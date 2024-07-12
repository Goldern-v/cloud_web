<template>
  <div class="ideal-main-container my-process">
    <div class="search-type">
      <div class="form-style">
        <div class="item-input">
          <el-date-picker
            v-model="state.queryForm.createTime"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </div>
      </div>
      <ideal-select-search
        :is-required="false"
        :search-type="SearchTypeEnum.title"
        prefix-title="任务名称"
        @clickSearch="clickSearch"
        @clickReset="clickReset"
      >
      </ideal-select-search>
    </div>

    <el-divider />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
      <template #createTime>
        <el-table-column label="创建时间" show-overflow-tooltip>
          <template #default="props">
            {{ dateFormat(props.row.createTime, FormatsEnums.YMDHIS) }}
          </template>
        </el-table-column>
      </template>
      <template #category>
        <el-table-column label="所属流程" show-overflow-tooltip>
          <template #default="props">
            {{ props.row.processInstance.name }}
          </template>
        </el-table-column>
      </template>
      <template #tasks>
        <el-table-column label="流程发起人" show-overflow-tooltip>
          <template #default="props">
            {{ props.row.processInstance.startUserNickname }}
          </template>
        </el-table-column>
      </template>
      <template #status>
        <el-table-column label="任务状态" show-overflow-tooltip>
          <template #default="props">
            <el-tag v-if="props.row.suspensionState === 1" type="success"
              >激活</el-tag
            >
            <el-tag v-if="props.row.suspensionState === 2" type="warning"
              >挂起</el-tag
            >
          </template>
        </el-table-column>
      </template>
      <template #operation>
        <el-table-column label="操作" width="125">
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
      :row-data="rowData"
      dialog-width="50%"
      dialog-title="详情"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script lang="ts" setup>
import dialogBox from './dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum, SearchTypeEnum } from '@/utils/enum'
import { dateFormat, FormatsEnums } from '@/utils/time-format'
import {
  IdealButtonEventProp,
  IdealTableColumnHeaders,
  IdealTableColumnOperate
} from '@/types'
import { bpmDoneListUrl } from '@/api/java/bpm/task'
import { router } from '@/router'
const state: IHooksOptions = reactive({
  dataListUrl: bpmDoneListUrl,
  deleteUrl: '',
  queryForm: {
    name: '',
    createTime: ''
  }
})
const { sizeChangeHandle, currentChangeHandle, getDataList, deleteHandle } =
  useCrud(state)

const categoryList: any = ref([
  { label: '默认', value: 1 },
  { label: 'OA', value: 2 }
])
const resultList: any = ref([
  { label: '处理中', value: 1 },
  { label: '通过', value: 2 },
  { label: '不通过', value: 3 },
  { label: '取消', value: 4 }
])
const sateList: any = ref([
  { label: '进行中', value: 1 },
  { label: '已完成', value: 2 }
])

// 搜索
const clickSearch = (search: string, type: string) => {
  state.queryForm.name = search
  getDataList()
}

// 重置
const clickReset = () => {
  state.queryForm = {}
  getDataList()
}

// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '流程编号', prop: 'id' },
  { label: '任务名称', prop: 'name' },
  { label: '所属流程', prop: 'category', useSlot: true },
  { label: '流程发起人', prop: 'tasks', useSlot: true },
  { label: '原因', prop: 'reason' },
  { label: '提交时间', prop: 'createTime', useSlot: true }
]

// 列表操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '详情', prop: 'detail', authority: 'finishedTask:manage:info' },
  { title: '流程', prop: 'process', authority: 'finishedTask:manage:flow' }
]

const rowData = ref()
const clickOperateEvent = (command: string | number | object, row: any) => {
  rowData.value = row
  if (command === 'process') {
    router.push({
      path: '/bpm-manage/task/my-process/detail',
      query: {
        id: row.processInstance.id,
        processDefinitionId: row.processInstance.processDefinitionId
      }
    })
  } else if (command === 'detail') {
    showDialog.value = true
  }
}

// 弹框
const showDialog = ref(false)
const dialogType = ref('cancel')
const dialogTitle = ref('cancel')
const dialogWidth = ref('75%')
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
}
</script>

<style scoped lang="scss">
.my-process {
  padding: 20px;
  box-sizing: border-box;

  :deep(.el-date-editor.el-input__wrapper) {
    height: 34px;
  }

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
