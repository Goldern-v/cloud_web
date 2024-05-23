<template>
  <div class="ideal-main-container all-tag">
    <ideal-select-search
      :search-type="SearchTypeEnum.title"
      :slot-array="['owner']"
      prefix-title="标签"
      @clickSearch="clickSearch"
      @clickReset="clickReset"
    >
      <template #owner>
        <el-input v-model="labelOwner" class="ideal-default-margin-right">
          <template #prepend>标签所有者</template>
        </el-input>
      </template>
    </ideal-select-search>

    <el-divider />

    <ideal-button-events
      :left-btns="attrData.leftButtons"
      @clickLeftEvent="clickLeftEvent"
    >
    </ideal-button-events>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :page="state.page"
      :table-headers="tableHeaders"
      :is-multiple="true"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #color>
        <el-table-column label="颜色">
          <template #default="props">
            <div
              v-if="props.row.labelType === 320001"
              class="all-tag-color"
              :style="{ backgroundColor: props.row.color }"
            ></div>
            <div
              v-else
              class="all-tag-color"
              :style="
                'border:' + '3px' + ' ' + 'solid' + ' ' + props.row.color + ';'
              "
            ></div>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="185">
          <template #default="props">
            <ideal-table-operate
              :buttons="operateBtns"
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
      :multiple-selection="multipleSelection"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import dialogBox from '../components/dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { SearchTypeEnum, OperateEventEnum, MoreOperateEnum } from '@/utils/enum'
import type {
  IdealButtonEventProp,
  IdealTableColumnHeaders,
  IdealTableColumnOperate
} from '@/types'

import {
  deleteResourceLabel,
  getResourceLabelList
} from '@/api/java/business-center'

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: getResourceLabelList,
  deleteUrl: deleteResourceLabel,
  queryForm: {}
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList,
  deleteHandle
} = useCrud(state)

const multipleSelection: any = ref([])
watch(
  () => state.dataListSelections,
  arr => {
    multipleSelection.value = arr
    attrData.leftButtons.forEach((item: any, index: number) => {
      item.disabled = index !== 0
      item.disabledText = '请选择一个或多个资源标签'
    })
    if (arr?.length) {
      attrData.leftButtons.forEach((item: any) => {
        item.disabled = false
        item.disabledText = ''
      })
    }
  },
  { deep: true }
)
// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: '颜色', prop: 'color', useSlot: true },
  { label: '资源数量', prop: 'bindResourcesCount' },
  { label: '标签所有者', prop: 'createUserName' },
  { label: '创建时间', prop: 'createTime' },
  { label: '描述', prop: 'remark' }
]
// 列表行数据操作事件
const operateBtns: IdealTableColumnOperate[] = [
  { title: '资源绑定', prop: 'bind' },
  { title: '删除', prop: 'delete' }
]

const rowData: any = ref({})
const clickOperateEvent = (command: string | number | object, row: any) => {
  rowData.value = row
  if (command === 'delete') {
    deleteHandle(row.id, '?id=', `确定要删除${row.name}?`, '删除操作')
  } else if (command === 'bind') {
    dialogType.value = OperateEventEnum.bind
    showDialog.value = true
  }
}

const attrData = reactive({
  leftButtons: [] as IdealButtonEventProp[]
})
// 列表左侧按钮
attrData.leftButtons = [
  {
    title: '批量删除',
    prop: 'batchDelete',
    disabled: true,
    disabledText: '请选择一个或多个资源标签'
  }
]
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    handleCloudHostCreate()
  } else if (value === 'batchDelete') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.delete
  }
}

const router = useRouter()
// 新建弹性云服务器
const handleCloudHostCreate = () => {
  router.push({ path: '/all-cloud/all-tag/create' })
}

// 详情
const handleRedirectDetail = () => {
  router.push({ path: '/all-cloud/all-tag/detail' })
}
const labelOwner = ref('') //标签所有者
// 搜索
const clickSearch = (search: string, type: string) => {
  state.queryForm.name = search
  state.queryForm.userName = labelOwner.value
  getDataList()
}
// 重置
const clickReset = () => {
  state.page = 1
  state.queryForm = {}
  getDataList()
}
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  getDataList()
}
</script>

<style scoped lang="scss">
.all-tag {
  padding: $idealPadding;
  .all-tag-color {
    width: 20px;
    height: 20px;
    box-sizing: border-box;
  }
}
</style>
