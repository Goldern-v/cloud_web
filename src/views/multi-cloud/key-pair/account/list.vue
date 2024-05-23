<template>
  <div class="ideal-table-list__container account">
    <ideal-select-search
      :search-type="SearchTypeEnum.title"
      prefix-title="名称查询"
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
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #operation>
        <el-table-column label="操作" width="185">
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
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum, SearchTypeEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders, IdealTableColumnOperate, IdealButtonEventProp } from '@/types'

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
  { label: '指纹', prop: 'fingerprint' },
  { label: '状态', prop: 'status' },
  { label: '私钥', prop: 'privateKey' }
]
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
const operateBtns: IdealTableColumnOperate[] = [
  { title: '修改', prop: 'edit' },
  { type: 'info', title: '删除', prop: 'delete' }
]
const clickOperateEvent = (command: string | number | object, row: object) => {}
// 列表左侧按钮
const leftButtons: IdealButtonEventProp[] = [
  {
    title: '创建密钥对',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  { title: '导入密钥对', prop: 'import' }
]
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.create
  } else if (value === 'import') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.import
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
.account {
  width: 100%;
  padding: 10px 20px 20px;
}
</style>
