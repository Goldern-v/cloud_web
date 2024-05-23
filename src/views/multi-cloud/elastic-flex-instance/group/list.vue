<template>
  <div class="ideal-table-list__container flex-group">
    <div class="ideal-tip-text">您还可以创建9个弹性伸缩组。</div>

    <ideal-select-search
      class="ideal-default-margin-top"
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
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :is-multiple="true"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #name>
        <el-table-column label="名称/ID" show-overflow-tooltip>
          <template #default="props">
            <el-button link type="primary" class="flex-group-font-size" @click="clickDetail">{{ props.row.name }}</el-button>

            <ideal-text-copy
              :row="props.row"
              @mouseEnterEvent="value => (props.row.showCopy = value)"
              @mouseLeaveEvent="value => (props.row.showCopy = value)"
            />
          </template>
        </el-table-column>
      </template>

      <template #status>
        <el-table-column label="状态" >
          <template #default="props">
            <ideal-status-icon
              v-if="props.row.status"
              :status-icon="props.row.statusType"
              :status-text="props.row.status"
            />
          </template>
        </el-table-column>
      </template>

      <template #config>
        <el-table-column label="伸缩配置">
          <template #default="props">
            <div class="flex-group-font-size ideal-theme-text">{{ props.row.config }}</div>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="225" fixed="right">
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
      :select-data="state.dataListSelections"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    />
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

// 搜索
const clickSearch = (search: string, type: string) => {
  state.queryForm.type = type
  state.queryForm.search = search
  getDataList()
}
// 重置
const clickReset = () => {
  state.page = 1
  state.queryForm = {}
  getDataList()
}
// 列表下拉搜索
const searchOptions = [
  { label: '名称', prop: 'name' },
  { label: 'ID', prop: 'id' }
]
// 列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList
} = useCrud(state)
state.dataList = [
  {
    name: 'as-policy-5309',
    uuid: 'e916a919-9dae-439f-a24a-becdfa7ab9ce',
    status: '已启用',
    statusStr: 'using',
    statusType: 'status-success',
    config: 'as-config-553e',
    current: '0',
    expect: '0',
    min: '0',
    max: '1'
  }
]
watch(
  () => state.dataList,
  value => {
    if (value?.length) {
      value.forEach((item: any) => {
        item.showCopy = false // uuid拷贝
      })
    }
  }
)

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称/ID', prop: 'name', useSlot: true },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '伸缩配置', prop: 'config', useSlot: true },
  { label: '当前实例数', prop: 'current' },
  { label: '期望实例数', prop: 'expect' },
  { label: '最小实例数', prop: 'min' },
  { label: '最大实例数', prop: 'max' },
  { label: '网络配置', prop: 'network' }
]
// 行数据
const rowData = ref()
// 操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '查看伸缩策略', prop: 'check' },
  { title: '停用', prop: 'forbidden' },
  { title: '更换伸缩配置', prop: 'replace' },
  { title: '修改伸缩配置', prop: 'change' },
  { title: '修改伸缩组', prop: 'edit' },
  { title: '删除', prop: 'delete' }
]
const clickOperateEvent = (command: string | number | object, row: any) => {
  rowData.value = row
  if (command === 'replace') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.replace
  } else if (command === 'change') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.change
  } else if (command === 'edit') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.edit
  }
}
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '创建弹性伸缩组',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  { title: '导出', prop: 'export' }
])
const router = useRouter()
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    router.push({ path: '/multi-cloud/elastic-flex-group/create' })
  }
}
const clickDetail = () => {
  router.push({ path: '/multi-cloud/elastic-flex-group/detail' })
}
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum>()
const clickCloseEvent = () => {
  resetDialog()
}
const clickRefreshEvent = () => {
  resetDialog()
}
// 重置弹框
const resetDialog = () => {
  showDialog.value = false
  dialogType.value = undefined // 防止再点击弹框时 有值
  rowData.value = null
}
</script>

<style scoped lang="scss">
.flex-group {
  width: 100%;
  padding: 20px;
  .flex-group-font-size {
    font-size: $defaultFontSize;
  }
}
</style>
