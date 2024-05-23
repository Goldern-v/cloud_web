<template>
  <div class="life-cycle-rules">
    <div>生命周期规则</div>
    <div class="ideal-tip-text ideal-middle-margin-bottom">您可以通过配置生命周期规则，实现实时删除桶中的对象或者定时转换对象的存储类别。</div>

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
state.dataList = [
  { name: 'rule-3bb9', status: 'ENABLE', statusIcon: 'status-success', statusText: '已启用', strategy: '按前缀配置：1', currentVersion: ['转换为低频访问存储：30天','转换为归档存储：31天'], historyVersion: '-'}
]
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '规则名称', prop: 'name' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '策略', prop: 'strategy' },
  { label: '当前版本', prop: 'currentVersion', useSlot: true },
  { label: '历史版本', prop: 'historyVersion' }
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
  { title: '删除', prop: 'export', disabled: true, disabledText: '请选择生命周期规则' },
  { title: '启用', prop: 'export', disabled: true, disabledText: '请选择生命周期规则' },
  { title: '禁用', prop: 'export', disabled: true, disabledText: '请选择生命周期规则' },
  { title: '复制', prop: 'unbindTag', disabled: false,  disabledText: '请选择生命周期规则' }
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
