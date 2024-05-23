<template>
  <div class="flex-policy">
    <div class="ideal-tip-text">伸缩策略规定了伸缩活动触发需要满足的条件及需要执行的操作。</div>
    <div class="ideal-tip-text">您还可以添加9个策略。</div>

    <ideal-select-search
      class="ideal-default-margin-top"
      :options="searchOptions"
      @clickSearch="clickSearch"
      @clickReset="clickReset"
    />
    <el-divider />

    <ideal-button-events
      class="ideal-default-margin-top"
      :left-btns="leftButtons"
      :right-btns="rightButtons"
      @clickLeftEvent="clickLeftEvent"
      @clickRightEvent="clickRightEvent"
    />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :is-multiple="true"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle">
      <template #name>
        <el-table-column label="名称" >
          <template #default="props">
            <el-button link type="primary" @click="clickDetail(props.row)">{{ props.row.name }}</el-button>
          </template>
        </el-table-column>
      </template>
      
      <template #monitor>
        <el-table-column label="监控对象" >
          <template #default="props">
            <div class="flex-policy-font-size">{{ props.row.monitor }}</div>
            <el-button link type="primary" class="flex-policy-font-size" @click="clickMonitor(props.row)">{{ props.row.resource }}</el-button>
          </template>
        </el-table-column>
      </template>

      <template #trigger>
        <el-table-column label="触发条件">
          <template #default="props">
            <div class="flex-bandwidth-font-size">{{ props.row.trigger }}</div>
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

      <template #operation>
        <el-table-column label="操作" width="185" fixed="right">
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
  { name: 'as-policy-3s2d', id: '29ef9a91-0932-2910-af3d934eb', alarmName: 'as-alarm-646d', status: '已启用', statusType: 'status-success', type: '告警策略', monitor: '弹性伸缩组', resource: '指定资源', trigger: 'CPU使用率最大值>1%，连续满足1次后触发。监控周期5分钟。只告警1次。', execute: '增加1实例', coolingTime: '300', createTime: '2023-10-23 10:23:21' }
]
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '策略类型', prop: 'type' },
  { label: '监控对象', prop: 'monitor', useSlot: true },
  { label: '触发条件', prop: 'trigger', useSlot: true },
  { label: '执行动作', prop: 'execute' },
  { label: '冷却时间(秒)', prop: 'coolingTime' },
  { label: '创建时间', prop: 'createTime' }
]
// 操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '停用', prop: 'forbidden' },
  { title: '立即执行', prop: 'immediate' },
  { title: '修改', prop: 'edit' },
  { title: '删除', prop: 'delete' }
]
const rowData = ref()
const clickOperateEvent = (command: string | number | object, row: any) => {
  rowData.value = row
  if (command === 'forbidden') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.forbidden
  } else if (command === 'immediate') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.immediate
  }
}
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '添加伸缩策略',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  { title: '启用', prop: 'enable', disabled: true, disabledText: '请选择伸缩策略' },
  { title: '停用', prop: 'forbidden', disabled: true, disabledText: '请选择伸缩策略' },
  { title: '删除', prop: 'delete', disabled: true, disabledText: '请选择伸缩策略' }
])
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.create
  }
}
// 右侧按钮
const rightButtons = ref<IdealButtonEventProp[]>([
  { prop: 'refresh', icon: 'refresh-icon' }
])
const clickRightEvent = (value: string | number | object) => {}
const clickMonitor = (row: any) => {
  rowData.value = row
  showDialog.value = true
  dialogType.value = OperateEventEnum.check
}
const router = useRouter()
const clickDetail = (row: any) => {
  const data = JSON.stringify(row)
  router.push({ path: '/multi-cloud/elastic-flex-policy/detail', query: { data } })
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
.flex-policy {
  padding: 0 $idealPadding $idealPadding;
  .flex-policy-font-size {
    font-size: $defaultFontSize;
  }
}
</style>
