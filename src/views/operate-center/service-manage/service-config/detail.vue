<template>
  <div class="ideal-large-margin detail">
    <div class="detail-title ideal-middle-margin-bottom">{{ name }}</div>
    <div class="flex-row tip-container ideal-middle-margin-bottom">
      <svg-icon icon="info-warning" class-name="info-warning" class="ideal-svg-margin-right"/>
      <div>若想申请不同资源池的当前服务，需先配置底层资源。</div>
    </div>

    <ideal-select-search
      :options="searchOptions"
      @clickSearch="clickSearch"
      @clickReset="clickReset"
    />

    <el-divider />

    <ideal-button-events
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    />

    <ideal-table-list
      ref="tableRef"
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      :is-multiple="true"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #name>
        <el-table-column label="名称" show-overflow-tooltip>
          <template #default="props">
            <el-button link type="primary">{{ props.row.name }}</el-button>
          </template>
        </el-table-column>
      </template>

      <template #status>
        <el-table-column label="状态">
          <template #default="props">
            <ideal-status-icon
              :status-icon="props.row.statusIcon"
              :status-text="props.row.statusText"
            />
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="props">
            <ideal-table-operate
              :buttons="props.row.operate"
              @clickMoreEvent="clickOperateEvent($event, props.row)"
            >
            </ideal-table-operate>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      :row-data="rowData"
      :select-data="state.dataListSelections"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import dialogBox from './dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp
} from '@/types'
import { serviceConfigResourcePageUrl, serviceConfigResourceUrl } from '@/api/java/operate-center'
import { ElMessage } from 'element-plus'

const route = useRoute()
const name = route.query.name
const serviceCategoryId = route.query.serviceCategoryId

// 搜索
const clickSearch = (search: string, type: string) => {
  if (type) {
    state.queryForm[type] = search
  }
  getDataList()
}
// 重置
const clickReset = () => {
  state.page = 1
  getDataList()
}
// 列表下拉搜索
const searchOptions = [
  { label: '名称', prop: 'name' }
]

onMounted(() => {
  state.queryForm.serviceCategoryId = serviceCategoryId
})

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: serviceConfigResourcePageUrl,
  deleteUrl: serviceConfigResourceUrl,
  queryForm: {}
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList,
  deleteHandle,
  query
} = useCrud(state)
watch(() => state.dataList, value => {
  if (value?.length) {
    value.forEach((item: any) => {
      item.statusIcon = item.status ? 'status-success':'status-error'
      item.statusText = item.status ? '启用':'禁用'
      item.operate = newOperate(item, operateBtns)
    })
  }
})
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '云平台类别', prop: 'cloudTypeDto.name' },
  { label: '云平台类型', prop: 'cloudPlatformDto.name' },
  { label: '资源池名称', prop: 'resourcePoolDto.name' },
  { label: '描述', prop: 'remark' },
  { label: '状态', prop: 'status', useSlot: true }
]
// 操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '编辑', prop: 'edit' },
  { title: '删除', prop: 'delete' }
]
const rowData = ref()
const clickOperateEvent = (command: string | number | object, row: any) => {
  rowData.value = row
  if (command === 'edit') {
    showDialog.value = true
    dialogType.value = 'editResource'
  } else if (command === 'delete') {
    deleteHandle(row.id)
  }
}
// 根据每行数据状态判断操作是否禁用
const newOperate = (item: any, operateBtns: IdealTableColumnOperate[]): IdealTableColumnOperate[] => {
  let resultArr: IdealTableColumnOperate[] = []
  const tempArr = JSON.parse(JSON.stringify(operateBtns))
  if (item.status) {
    resultArr = setOperateBtns(item.status, '启用状态不可编辑/删除', tempArr)
  } else {
    resultArr = setOperateBtns(false, '', tempArr)
  }
  return resultArr
}
// 根据状态设置操作禁用状态
const setOperateBtns = (
  disabled: boolean,
  disabledText: string,
  array: IdealTableColumnOperate[]
): IdealTableColumnOperate[] => {
  const arr: IdealTableColumnOperate[] = []
  array.forEach((item: any) => {
    if (!item.children) {
      item.disabled = disabled
      item.disabledText = disabledText
    }
    arr.push(item)
  })
  return arr
}
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '配置底层资源',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  { title: '启用', prop: 'enable', disabled: true, disabledText: '请选择需要启用的资源' },
  { title: '禁用', prop: 'forbidden', disabled: true, disabledText: '请选择需要禁用的资源' },
  { title: '删除', prop: 'delete', disabled: true, disabledText: '请选择需要删除的资源' }
])
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    showDialog.value = true
    dialogType.value = 'addResource'
  } else if (value === 'enable') {
    const haveEnable = state.dataListSelections?.some((item: any) => item.status) 
    if (haveEnable){
      return ElMessage.warning('不能选择启用状态资源')
    }
    showDialog.value = true
    dialogType.value = OperateEventEnum.enable
  } else if (value === 'forbidden') {
    const haveForbidden = state.dataListSelections?.some((item: any) => !item.status) 
    if (haveForbidden){
      return ElMessage.warning('不能选择禁用状态资源')
    }
    showDialog.value = true
    dialogType.value = OperateEventEnum.forbidden
  } else if (value === 'delete') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.delete
  }
}
// 监听多选
watch(() => state.dataListSelections, value => {
  leftButtons.value?.forEach((item: any, index: number) => {
    if (index !== 0) {
      item.disabled = true
      item.disabledText = '请选择资源池'
    }
  })

  if (value?.length) {
    handleLeftButton(value)
  }
})
const handleLeftButton = (arr: any[]) => {
  const exitEnable = arr.some((item: any) => item.status)
  const exitForbidden = arr.some((item: any) => !item.status)

  if (exitEnable && exitForbidden) {
    leftButtons.value?.forEach((item: any) => {
      if (item.prop === 'enable' || item.prop === 'forbidden') {
        item.disabled = true
        item.disabledText = '请不要同时选择启用和禁用资源'
      } else {
        item.disabled = false
      }
    })
  } else if (exitEnable) {
    leftButtons.value.forEach((item: any) => {
      if (item.prop === 'enable') {
        item.disabled = true
        item.disabledText = '所选资源已启用'
      } else {
        item.disabled = false
      }
    })
  } else if (exitForbidden) {
    leftButtons.value.forEach((item: any) => {
      if (item.prop === 'forbidden') {
        item.disabled = true
        item.disabledText = '所选资源已禁用'
      } else {
        item.disabled = false
      }
    })
  } else {
    leftButtons.value.forEach((item: any) => {
      item.disabled = false
    })
  }
}
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const dialogTypeStr = ref('')
const clickCloseEvent = () => {
  resetDialog()
}
const clickRefreshEvent = () => {
  resetDialog()
  query()
}
const tableRef = ref()
// 重置弹框
const resetDialog = () => {
  showDialog.value = false
  dialogType.value = '' // 防止再点击弹框时 有值
  dialogTypeStr.value = ''
  tableRef.value.IdealTableList.clearSelection()
}
</script>

<style scoped lang="scss">
.detail {
  background-color: white;
  padding: $idealPadding;
  .detail-title {
    font-size: $mediumFontSize;
    font-weight: 500;
  }
  :deep(.info-warning) {
    color: var(--el-color-primary);
  }
  .tip-container {
    background-color: var(--el-color-primary-light-9);
    padding: 10px;
  }
}
</style>
