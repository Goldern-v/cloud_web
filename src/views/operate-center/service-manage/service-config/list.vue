<template>
  <div class="ideal-main-container service-catalog">
    <ideal-select-search
      :search-type="SearchTypeEnum.title"
      :slot-array="slotArray"
      prefix-title="名称"
      @clickSearch="clickSearch"
      @clickReset="clickReset"
    >
      <template #service-category>
        <el-select
          v-model="serviceCategory"
          clearable
          class="ideal-default-margin-right"
          placeholder="请选择"
          style="width: 260px;"
        >
          <template #prefix><div>服务目录</div></template>
          <el-option
            v-for="(item, index) of serviceCategories"
            :key="index + 'selectSearch'"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </template>
      <template #service-status>
        <el-select
          v-model="serviceStatus"
          clearable
          class="ideal-default-margin-right"
          placeholder="请选择"
          style="width: 260px;"
        >
          <template #prefix><div>服务状态</div></template>
          <el-option
            v-for="(item, index) of serviceStatusList"
            :key="index + 'selectSearch'"
            :label="item.label"
            :value="item.prop"
          >
          </el-option>
        </el-select>
      </template>
    </ideal-select-search>

    <el-divider border-style="solid" />

    <ideal-button-events
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    />

    <ideal-table-list
      ref="idealTableRef"
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :total="state.total"
      :page="state.page"
      :pagination-type="PaginationTypeEnum.totalSizes"
      :is-multiple="true"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #name>
        <el-table-column label="名称" width="150">
          <template #default="props">
            <el-button link type="primary" @click="clickDetail(props.row)">{{ props.row.name }}</el-button>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" fixed="right" width="120">
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
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>
<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus/es'
import dialogBox from './dialog-box.vue'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import {
  SearchTypeEnum,
  PaginationTypeEnum,
  OperateEventEnum
} from '@/utils/enum'
import type { IdealTableColumnHeaders, IdealTableColumnOperate, IdealTextProp, IdealButtonEventProp } from '@/types'
import { serviceConfigPageUrl, serviceConfigUrl, serviceCategoryList, serviceConfigUpdate, serviceConfigBatch } from '@/api/java/operate-center'

onMounted(() => {
  getServiceConfigList()
})
// 服务配置
const serviceCategory = ref('')
const serviceCategories = ref<any[]>([])
const getServiceConfigList = () => {
  serviceCategoryList().then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      serviceCategories.value = data
    } else {
      serviceCategories.value = []
    }
  }).catch(_ => {
    serviceCategories.value = []
  })
}
//  列表搜索值
const slotArray = ['service-category', 'service-status']
const serviceStatus = ref('')
const serviceStatusList: IdealTextProp[] = [
  { label: '发布', prop: 'true' },
  { label: '未发布', prop: 'false' },
]
// 搜索
const clickSearch = (search: string, type: string) => {
  state.queryForm.type = type
  state.queryForm.name = search
  state.queryForm.status = serviceStatus.value
  state.queryForm.serviceCategoryDefinitionId = serviceCategory.value
  getDataList()
}
// 重置
const clickReset = () => {
  serviceStatus.value = ''
  serviceCategory.value = ''
  state.queryForm = {}
  getDataList()
}
// 列表
const state: IHooksOptions = reactive({
  dataListUrl: serviceConfigPageUrl,
  deleteUrl: serviceConfigUrl,
  queryForm: {}
})
const {
  sizeChangeHandle,
  currentChangeHandle,
  deleteHandle,
  getDataList,
  selectionChangeHandle
} = useCrud(state)
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '顺序', prop: 'sort', width: '50' },
  { label: '名称', prop: 'name', useSlot: true },
  { label: '描述', prop: 'remark', width: '300' },
  { label: '服务目录', prop: 'serviceCategoryDefinition.name' },
  { label: '服务类型', prop: 'serviceCategoryType.name' },
  { label: '状态', prop: 'statusText' },
  { label: '创建者', prop: 'creator.name' },
  { label: '创建时间', prop: 'createTime.date', width: '150' }
]
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '创建服务配置',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  { title: '发布', prop: 'publish', disabled: true, disabledText: '请选择需发布的服务配置' },
  { title: '取消发布', prop: 'unpublish', disabled: true, disabledText: '请选择需取消发布的服务配置' },
])
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.create
  } else if (value === 'publish') {
    const isPublish = state.dataListSelections?.some((item: any) => item.status) // 选择结果是否有已发布资源
    if (isPublish) {
      return ElMessage.warning('请不要选择已发布的服务配置')
    }
    handlePublish()
  } else if (value === 'unpublish') {
    const isUnpublish = state.dataListSelections?.some((item: any) => !item.status) // 选择结果是否有已发布资源
    if (isUnpublish) {
      return ElMessage.warning('请不要选择未发布的服务配置')
    }
    handleUnpublish()
  }
}
const handlePublish = () => {
  let ids = handleSelectId()
  const dic = { ids, status: true }
  ElMessageBox.confirm('确定发布当前服务配置吗？', '发布', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      updateStatus(dic, '发布')
    })
}
const handleUnpublish = () => {
  let ids = handleSelectId()
  const dic = { ids, status: false }
  ElMessageBox.confirm('确定取消发布当前服务配置吗？', '取消发布', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      updateStatus(dic, '取消发布')
    })
}
const handleSelectId = (): string => {
  let result = ''
  const array = state.dataListSelections?.map((item => {
    return item.id
  }))
  if (array?.length) {
    result = array.join(',')
  }
  return result
}
// 监听多选
watch(() => state.dataListSelections, value => {
  leftButtons.value?.forEach((item: any, index: number) => {
    if (index !== 0) {
      item.disabled = true
      item.disabledText = '请不要选择未发布的服务配置'
    }
  })

  if (value?.length) {
    handleLeftButton(value)
  }
})

const handleLeftButton = (arr: any[]) => {
  const isPublish = arr.some((item: any) => item.status)
  const isUnpublish = arr.some((item: any) => !item.status)

  if (isPublish && isUnpublish) {
    leftButtons.value?.forEach((item: any) => {
      if (item.prop === 'publish' || item.prop === 'unpublish') {
        item.disabled = true
        item.disabledText = '请不要同时选择已发布和未发布服务配置'
      } else {
        item.disabled = false
      }
    })
  } else if (isPublish) {
    leftButtons.value.forEach((item: any) => {
      if (item.prop === 'publish') {
        item.disabled = true
        item.disabledText = '所选服务配置已发布'
      } else {
        item.disabled = false
      }
    })
  } else if (isUnpublish) {
    leftButtons.value.forEach((item: any) => {
      if (item.prop === 'unpublish') {
        item.disabled = true
        item.disabledText = '所选服务配置未发布'
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
const operateBtns: IdealTableColumnOperate[] = [
  { title: '编辑', prop: 'edit', disabled: false, disabledText: '内置服务配置不可编辑' },
  { title: '删除', prop: 'delete', disabled: false, disabledText: '内置服务配置不可删除' }
]
const clickOperateEvent = (command: string | number | object, row: any) => {
  if (command === 'delete') {
    deleteHandle(row.id)
  } else if (command === 'edit') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.edit
    rowData.value = row
  }
}
// 监听列表
watch(
  () => state.dataList,
  value => {
    if (value?.length) {
      value.forEach((item: any) => {
        item.statusText = item.status ? '发布' : '未发布'
        item.operate = newOperate(item, operateBtns)
      })
    }
  }
)
// 根据每行数据状态判断操作是否禁用
const newOperate = (item: any, operateBtns: IdealTableColumnOperate[]): IdealTableColumnOperate[] => {
  let resultArr: IdealTableColumnOperate[] = []
  const tempArr = JSON.parse(JSON.stringify(operateBtns))
  if (item.status) {
    resultArr = setOperateBtns(item.status, '发布状态不可编辑/删除', tempArr)
  } else {
    resultArr = setOperateBtns(false, '', tempArr)
  }
  if (item.custom === 0) {
    resultArr = setOperateBtns(true, '内置服务配置不可编辑/删除', tempArr)
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
const idealTableRef = ref()
// 更新状态-发布/未发布
const updateStatus = (params: {[key: string]:any}, type: string) => {
  serviceConfigBatch(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success(`${type}成功`)
      idealTableRef.value.IdealTableList.clearSelection() // 清空多选
      getDataList()
    } else {
      ElMessage.error(`${type}失败`)
    }
  }).catch(_ => {
    ElMessage.error(`${type}失败`)
  })
}

const router = useRouter()
const clickDetail = (row: any) => {
  const name = row.name
  const serviceCategoryId = row.id
  router.push({ path: '/operate-center/service-manage/service-config/detail', query: { name, serviceCategoryId } })
}
/**
 * 弹框
 */
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const rowData = ref({}) //行数据
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  getDataList()
}
</script>
<style lang="scss" scoped>
.service-catalog {
  background-color: white;
  padding: $idealPadding;
  :deep(.el-select .el-input) {
    width: 200px;
    height: 34px;
  }
  :deep(.el-select__wrapper) {
    min-height: 34px;
  }
}
</style>
