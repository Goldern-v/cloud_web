<template>
  <div class="ipv6">
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

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: 'IPv6网卡', prop: 'ip', setTextType: true, textTypeProp: 'ipTextType' },
  { label: '所属vpc', prop: 'vpc' },
  { label: '子网', prop: 'type' },
  { label: '所属实例', prop: 'instance', setTextType: true, textTypeProp: 'boundTextType' }
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
.ipv6 {
  width: 100%;
  
}
</style>