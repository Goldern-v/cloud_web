<template>
  <div class="associate">
    <ideal-button-events
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    />

    <el-divider />

    <ideal-select-search
      :options="searchOptions"
      @clickSearch="clickSearch"
      @clickReset="clickReset"
    />

    <ideal-table-list
      ref="multipleTableRef"
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
      <template #operation>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="props">
            <ideal-table-operate
              :buttons="operateBtns"
              @clickMoreEvent="clickOperateEvent($event, props.row)"
            />
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
import dialogBox from './dialog-box.vue'
import { OperateEventEnum } from '@/utils/enum'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type {
  IdealButtonEventProp,
  IdealTableColumnHeaders,
  IdealTableColumnOperate
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
  getDataList,
  deleteHandle
} = useCrud(state)

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称/ID', prop: 'name' },
  { label: 'IPv4网段', prop: 'ipv4' },
  { label: 'IPv6网段', prop: 'ipv6' },
  { label: '虚拟私有云', prop: 'vpc' }
]
// 操作
const operateBtns: IdealTableColumnOperate[] = [
  // { title: '修改', prop: 'change' },
  // { title: '删除', prop: 'delete' }
]
const clickOperateEvent = (command: string | number | object, row: any) => {
  // if (command === 'close') {
  //   showDialog.value = true
  //   dialogType.value = OperateEventEnum.close
  // } 
}
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  { title: '关联', prop: 'associate' },
  { title: '取消关联', prop: 'delete', disabled: true, disabledText: '请选择需要取消关联的子网。' }
])
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'associate') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.associate
  }
}
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
}
</script>

<style scoped lang="scss">
.associate {
  background-color: white;
  padding: $idealPadding;
}
</style>
