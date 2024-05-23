<template>
  <div class="life-cycle-rules">
    <div class="ideal-tip-text ideal-middle-margin-bottom">您可以通过创建DIS通知规则，以便指定事件发生时向指定懂得DIS通道发送通知消息。新创建的DIS通知将在5分钟之内生效。</div>

    <ideal-button-events
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    />

    <ideal-table-list
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
      <template #status>
        <el-table-column label="状态">
          <template #default="props">
            <ideal-status-icon
              v-if="props.row.status"
              :status-icon="props.row.statusIcon"
              :status-text="props.row.statusText"
            />
          </template>
        </el-table-column>
      </template>

      <template #currentVersion>
        <el-table-column label="当前版本">
          <template #default="props">
            <div v-for="(item,index) of props.row.currentVersion" :key="index">{{ item }}</div>
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
import dialogBox from './dialog-box.vue'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import { OperateEventEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp,
  IdealSearch,
  IdealTextProp
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
  getDataList,
  query
} = useCrud(state)

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: 'DIS通知名称', prop: 'name' },
  { label: '事件', prop: 'event' },
  { label: '前缀', prop: 'prefix' },
  { label: '后缀', prop: 'suffix' },
  { label: 'DIS通道', prop: 'channel' },
  { label: 'IAM委托', prop: 'delegation' }
]
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '创建',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  { title: '删除', prop: 'export', disabled: true, disabledText: '请选择通知' },
  { title: '复制', prop: 'unbindTag', disabled: false, disabledText: '请选择通知' }
])
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.create
  }
}
// 操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '编辑', prop: 'edit' },
  { title: '删除', prop: 'delete' },
  { title: '禁用', prop: 'forbidden' }
]
const rowData = ref()
const clickOperateEvent = (command: string | number | object, row: any) => {

}

// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  resetDialog()
}
const clickRefreshEvent = () => {
  resetDialog()
  query()
}
// 重置弹框
const resetDialog = () => {
  showDialog.value = false
  dialogType.value = '' // 防止再点击弹框时 有值
}
</script>

<style scoped lang="scss">
.life-cycle-rules {
  padding: $idealPadding;
  background-color: white;
}
</style>
