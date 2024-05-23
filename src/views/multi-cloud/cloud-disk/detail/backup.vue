<template>
  <div class="backup ideal-large-margin-top">
    <ideal-button-events
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
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
              class="backup-font-size"
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
              :status-icon="props.row.status"
              :status-text="props.row.statusDes"
            />
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="150" fixed="right">
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
    status: 'status-success',
    statusDes: '运行中',
    statusType: 'normal',
    uuid: '5fbc187b-7a6b-4860-9128-2583c39944d5',
    createTime: '2023-09-28 10:09:23'
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
  { title: '创建磁盘', prop: 'create' }
]
const clickOperateEvent = (command: string | number | object, row: object) => {
  if (command === 'monitor') {
  }
}
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  { title: '创建备份', prop: 'create' }
])
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
  }
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
}
</script>

<style scoped lang="scss">
.backup {
  background-color: white;
  padding: $idealPadding;
  .backup-font-size {
    font-size: $defaultFontSize;
  }
}
</style>
