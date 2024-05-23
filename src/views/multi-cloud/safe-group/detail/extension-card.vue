<template>
  <div class="extension-card">
    <ideal-select-search
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
      <template #operation>
        <el-table-column label="操作" width="150">
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
    ></dialog-box>
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

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '私有IP地址', prop: 'name' },
  { label: '子网', prop: 'rule' },
  { label: '关联服务器名称', prop: 'instance' }
]
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '添加',
    prop: 'addExtension',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  { title: '移出', prop: 'delete', disabled: true, disabledText: '请先选择' }
])
type leftBtnType = string | number | object
const clickLeftEvent = (value: leftBtnType) => {
  if (value === 'addExtension') {
    showDialog.value = true
    dialogType.value = 'addExtension'
  }
}
const operateBtns = ref<IdealTableColumnOperate[]>([
  { title: '配置规则', prop: 'setRule' },
  { title: '管理实例', prop: 'manageInstance' }
])
const clickOperateEvent = (command: string | number | object, row: object) => {}

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
  { label: 'ID', prop: 'uuid' }
]
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
}
// 更新tabs选项卡标题数量, total: 当前页面列表总数 index: 当前tabs选项卡
interface EventEmits {
  (e: 'updatePageNumber', total: number, index: number): void
}
const emit = defineEmits<EventEmits>()
watch(
  () => state.dataList,
  (newValue, oldValue) => {
    if (newValue !== oldValue && newValue?.length) {
      emit('updatePageNumber', 6, 2)
    }
  }
)
</script>

<style scoped lang="scss">
.extension-card {
  padding: $idealPadding;
  background-color: white;
}
</style>
