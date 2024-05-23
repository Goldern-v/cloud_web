<template>
  <div class="flex-instance">
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
      @handleSelectionChange="selectionChangeHandle"
    >
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

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: '生命周期状态', prop: 'cycleStatus' },
  { label: '健康状态', prop: 'healthStatus' },
  { label: '伸缩配置', prop: 'config' },
  { label: '实例加入方式', prop: 'mode' },
  { label: '实例保护', prop: 'protect' },
  { label: '加入时间', prop: 'time' }
]
// 行数据
const rowData = ref()
// 操作
const operateBtns: IdealTableColumnOperate[] = [
  // { title: '查看伸缩策略', prop: 'check' }
]
const clickOperateEvent = (command: string | number | object, row: any) => {
  rowData.value = row
  // if (command === 'replace') {
  //   showDialog.value = true
  //   dialogType.value = OperateEventEnum.replace
  // }
}
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  { title: '移入伸缩组', prop: 'shiftIn' },
  { title: '移出伸缩组', prop: 'shiftOut', disabled: true, disabledText: '请选择伸缩实例' },
  { title: '移出伸缩组并删除', prop: 'delete', disabled: true, disabledText: '请选择伸缩实例' },
  { title: '设置实例保护', prop: '', disabled: true, disabledText: '请选择伸缩实例' },
  { title: '取消实例保护', prop: '', disabled: true, disabledText: '请选择伸缩实例' },
  { title: '转入备用', prop: '', disabled: true, disabledText: '请选择伸缩实例' },
  { title: '转出备用', prop: '', disabled: true, disabledText: '请选择伸缩实例' }
])
// 监控操作按钮是否可用
watch(
    () => state.dataListSelections,
    value => {
      leftButtons.value[1].disabled = true
      leftButtons.value[2].disabled = true
      leftButtons.value[3].disabled = true
      leftButtons.value[4].disabled = true
      leftButtons.value[5].disabled = true
      leftButtons.value[6].disabled = true
      leftButtons.value[1].disabledText = '请选择伸缩实例'
      leftButtons.value[2].disabledText = '请选择伸缩实例'
      leftButtons.value[3].disabledText = '请选择伸缩实例'
      leftButtons.value[4].disabledText = '请选择伸缩实例'
      leftButtons.value[5].disabledText = '请选择伸缩实例'
      leftButtons.value[6].disabledText = '请选择伸缩实例'
      if (value?.length) {
        leftButtons.value[1].disabled = false
        leftButtons.value[2].disabled = false
        leftButtons.value[3].disabled = false
        leftButtons.value[4].disabled = false
        leftButtons.value[5].disabled = false
        leftButtons.value[6].disabled = false
      }
    }
  )
const router = useRouter()
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'shiftIn') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.shiftIn
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
.flex-instance {
  padding: 0 $idealPadding $idealPadding;
}
</style>
