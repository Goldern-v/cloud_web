<template>
  <div class="eip">
    <ideal-select-search
      :options="searchOptions"
      @clickSearch="clickSearch"
      @clickReset="clickReset"
    />

    <el-divider />

    <ideal-button-events
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
      <template #status>
        <el-table-column label="状态">
          <template #default="props">
            <ideal-status-icon
              v-if="props.row.status"
              :status-icon="props.row.statusType"
              :status-text="props.row.status"
            />
          </template>
        </el-table-column>
      </template>

      <template #billingMode>
        <el-table-column label="计费模式">
          <template #default="props">
            <div>{{ props.row.billingMode }}</div>
            <div>{{ props.row.createTime }}</div>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="125">
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
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders, IdealTableColumnOperate, IdealButtonEventProp } from '@/types'

// 列表下拉搜索
const searchOptions = [
  { label: '名称', prop: 'name' },
  { label: 'ID', prop: 'uuid' }
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
  { ip: '12.0.20.40', status: '未绑定', statusType: 'status-error', type: '全动态BGP', bound: '未绑定实例，扣费中', billingMode: '按需', createTime: '2023-09-21 12:23:09', ipTextType: 'primary', boundTextType: 'warning' },
  { ip: '12.0.20.40', status: '未绑定', statusType: 'status-error', type: '全动态BGP', bound: '未绑定实例，扣费中', billingMode: '按需', createTime: '2023-09-21 12:23:09', ipTextType: 'primary', boundTextType: 'danger' },
  { ip: '12.0.20.40', status: '未绑定', statusType: 'status-error', type: '全动态BGP', bound: '未绑定实例，扣费中', billingMode: '按需', createTime: '2023-09-21 12:23:09', ipTextType: 'info', boundTextType: 'success' }
]
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '弹性公网IP/ID', prop: 'ip', setTextType: true, textTypeProp: 'ipTextType' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '类型', prop: 'type' },
  { label: '已绑定实例', prop: 'bound', setTextType: true, textTypeProp: 'boundTextType' },
  { label: '计费模式', prop: 'billingMode', useSlot: true }
]
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  { title: '添加', prop: 'renew', disabled: true, disabledText: '请先选择' },
  { title: '移出', prop: 'replace', disabled: true, disabledText: '请先选择' }
])
type eventType = string | number | object
const clickLeftEvent = (value: eventType) => { /* TODO document why this arrow function is empty */ }
// 列表右侧按钮
const rightButtons: IdealButtonEventProp[] = [
  {
    prop: 'refresh',
    icon: 'refresh-icon'
  }
]
const clickRightEvent = (value: eventType) => { /* TODO document why this arrow function is empty */ }
const operateBtns: IdealTableColumnOperate[] = [
  { title: '移出', prop: 'delete' }
]
const clickOperateEvent = (command: eventType, row: object) => {}
// 重置
const clickReset = () => {
  state.page = 1
  state.queryForm = {}
  getDataList()
}
// 搜索
const clickSearch = (search: string, type: string) => {
  state.queryForm.type = type
  state.queryForm.search = search
  getDataList()
}
watch(() => state.dataListSelections, value => {
  leftButtons.value[0].disabled = true
  leftButtons.value[1].disabled = true
  if (value?.length) {
    leftButtons.value[0].disabled = false
    leftButtons.value[1].disabled = false
  }
})
</script>

<style scoped lang="scss">
.eip {
  width: 100%;
  
}
</style>