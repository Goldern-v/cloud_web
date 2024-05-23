<template>
  <div class="inform">
    <div class="ideal-tip-text">添加通知后，当指定事件发生时将发送通知到指定的主题。</div>
    <div class="ideal-tip-text">您还可以添加5个通知。</div>

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
  { name: 'as-hook-3s2d', type: '实例启动', default: '继续', timeOut: '3600', theme: '11', custom: '' }
]
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: '挂钩类型', prop: 'type' },
  { label: '默认回调操作', prop: 'default' },
  { label: '超时时间(秒)', prop: 'timeOut' },
  { label: '通知主题', prop: 'theme' },
  { label: '自定义通知信息', prop: 'custom' }
]
// 操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '修改', prop: 'edit' },
  { title: '删除', prop: 'delete' }
]
const rowData = ref()
const clickOperateEvent = (command: string | number | object, row: any) => {}
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '添加通知',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  }
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
.inform {
  padding: 0 $idealPadding $idealPadding;
}
</style>
