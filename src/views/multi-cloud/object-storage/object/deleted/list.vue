<template>
  <div class="deleted">
    <div class="ideal-middle-margin-bottom">已删除对象是在多版本控制启用的情况下被删除的对象。已删除文件可以通过取消删除来取回。已删除文件夹不支持取消删除，如果取消删除文件夹下的文件，会连同文件夹一起取回。</div>

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
      <template #name>
        <el-table-column label="名称">
          <template #default="props">
            <div class="ideal-theme-text">{{ props.row.name }}</div>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="185" fixed="right">
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
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp
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
state.dataList = [
  { name: '122', storageClass: '--', size: '--', modifyTime: '--' }
]

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true },
  { label: '存储类别', prop: 'storageClass' },
  { label: '大小', prop: 'size' },
  { label: '最后修改时间', prop: 'modifyTime' }
]
// 操作
const operateBtns: IdealTableColumnOperate[] = [
  // { title: '分享', prop: 'share' },
]
const rowData = ref()
const clickOperateEvent = (command: string | number | object, row: any) => {}

// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  { title: '取消删除',prop: 'cancel' , disabled: true, disabledText: '请选择需要取消删除的对象' },
  { title: '彻底删除', prop: 'delete', disabled: true, disabledText: '请选择需要彻底删除的对象' }
])
const clickLeftEvent = (value: string | number | object) => {}
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
.deleted {
  padding: 10px $idealPadding $idealPadding;
  background-color: white;
}
</style>
