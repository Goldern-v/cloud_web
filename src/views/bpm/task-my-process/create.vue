<template>
  <div class="ideal-main-container my-process">
    <div class="search-type">
      <ideal-select-search
        :search-type="SearchTypeEnum.title"
        prefix-title="流程名称"
        @clickSearch="clickSearch"
        @clickReset="clickReset"
      >
      </ideal-select-search>
    </div>

    <el-divider />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :total="state.total"
      :table-headers="tableHeaders"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
      <template #category>
        <el-table-column label="流程分类" align="center" show-overflow-tooltip>
          <template #default="props">
            <el-tag v-if="props.row.category === '1'">默认</el-tag>
          </template>
        </el-table-column>
      </template>
      <template #version>
        <el-table-column label="流程版本" align="center" show-overflow-tooltip>
          <template #default="props">
            <el-tag>v{{ props.row.version }}</el-tag>
          </template>
        </el-table-column>
      </template>
      <template #operation>
        <el-table-column label="操作" width="125" align="center">
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
      :dialog-title="dialogTitle"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script lang="ts" setup>
import dialogBox from './dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { SearchTypeEnum } from '@/utils/enum'
import { IdealTableColumnHeaders, IdealTableColumnOperate } from '@/types'
import { bpmMyprocessCreateList } from '@/api/java/bpm/task'
const state: IHooksOptions = reactive({
  dataListUrl: bpmMyprocessCreateList,
  deleteUrl: '',
  queryForm: {
    suspensionState: 1
  }
})
const { sizeChangeHandle, currentChangeHandle, getDataList, deleteHandle } =
  useCrud(state)

// 搜索
const clickSearch = (search: string, type: string) => {
  state.queryForm.key = search
  getDataList()
}

// 重置
const clickReset = () => {
  state.queryForm = {}
  getDataList()
}

// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '流程名称', prop: 'name' },
  { label: '流程分类', prop: 'category', useSlot: true },
  { label: '流程版本', prop: 'version', useSlot: true },
  { label: '流程描述', prop: 'remark' }
]

// 列表操作
const operateBtns: IdealTableColumnOperate[] = [{ title: '选择', prop: 'add' }]

// 弹框
const showDialog = ref(false)
const dialogType = ref('create')
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  getDataList()
}

const rowData = ref()
const dialogTitle = ref<string>('')
const clickOperateEvent = (command: string | number | object, row: any) => {
  rowData.value = row

  if (command === 'add') {
    showDialog.value = true
    dialogTitle.value = `申请信息`
  } else if (command === 'delete') {
    deleteHandle(row.id)
  }
}
</script>

<style scoped lang="scss">
.my-process {
  padding: 20px;
  box-sizing: border-box;

  .search-type {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    .form-style {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin: 10px 0;
      margin-right: 30px;
      .item-label {
        margin-right: 10px;
      }
    }
  }
  .cloud-host__time-range {
    margin-right: 10px;
  }
  .my-process-state {
    margin-right: 10px;
    :deep(.el-input) {
      width: 160px;
    }
  }
}
</style>
