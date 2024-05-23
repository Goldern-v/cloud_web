<template>
  <div class="snapshot ideal-large-margin-top">
    <el-text>该磁盘已创建0个快照，还可以创建7个快照。</el-text>

    <ideal-button-events
      class="ideal-default-margin-top"
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
        <el-table-column label="名称" show-overflow-tooltip>
          <template #default="props">
            <el-button
              link
              type="primary"
              class="snapshot-font-size"
              >{{ props.row.name }}</el-button
            >
          </template>
        </el-table-column>
      </template>

      <template #status>
        <el-table-column label="状态" width="150">
          <template #default="props">
            <ideal-status-icon
              v-if="props.row.status"
              :status-icon="props.row.statusType"
              :status-text="props.row.statusDes"
            />
          </template>
        </el-table-column>
      </template>

      <template #deviceId>
        <el-table-column label="挂载点" show-overflow-tooltip>
          <template #default="props">
            <div class="snapshot-font-size">{{ props.row.deviceId }}</div>
            <div class="snapshot-font-size">{{ props.row.bdf }}</div>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="180" fixed="right">
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
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    />
  </div>
</template>

<script setup lang="ts">
import dialogBox from '../dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp
} from '@/types'

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
    name: 'vpn跳板-不要动',
    status: 'running',
    statusDes: '运行中',
    statusType: 'status-success',
    uuid: '5fbc187b-7a6b-4860-9128-2583c39944d5',
    createTime: '2023-09-25 14:12:51'
  }
]
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true },
  { label: '状态', prop: 'status', useSlot: true },
  { label: 'ID', prop: 'uuid' },
  { label: '创建时间', prop: 'createTime' }
]
// 操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '回滚数据', prop: 'rollback' },
  { title: '创建磁盘', prop: 'create' },
  { title: '删除', prop: 'delete' }
]
const clickOperateEvent = (command: string | number | object, row: object) => {
  if (command === 'monitor') {
  }
}
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  { title: '创建快照', prop: 'create' },
  {
    title: '删除',
    prop: 'delete',
    disabled: true,
    disabledText: '请选择一个或者多个云服务器进行操作。'
  }
])
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
  } else if (value === 'delete') {
  }
}
watch(
  () => state.dataListSelections,
  value => {
    leftButtons.value[1].disabled = true
    if (value?.length) {
      leftButtons.value[1].disabled = false
    }
  }
)
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
}
</script>

<style scoped lang="scss">
.snapshot {
  background-color: white;
  padding: $idealPadding;
  .snapshot-font-size {
    font-size: $defaultFontSize;
  }
}
</style>
