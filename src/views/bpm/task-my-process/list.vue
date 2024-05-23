<template>
  <div class="ideal-main-container my-process">
    <div class="search-type">
      <div class="form-style">
        <div class="item-label">所属流程</div>
        <div class="item-input">
          <el-input
            v-model="state.queryForm.processDefinitionId"
            placeholder="请输入流程定义的编号"
          ></el-input>
        </div>
      </div>
      <div class="form-style">
        <div class="item-label">流程分类</div>
        <div class="item-input">
          <el-select
            v-model="state.queryForm.category"
            placeholder="请选择流程分类"
            class="my-process-state"
          >
            <el-option
              v-for="item in categoryList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      <div class="form-style">
        <div class="item-label">状态</div>
        <div class="item-input">
          <el-select
            v-model="state.queryForm.status"
            placeholder="请选择状态"
            class="my-process-state"
          >
            <el-option
              v-for="item in sateList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      <div class="form-style">
        <div class="item-label">结果</div>
        <div class="item-input">
          <el-select
            v-model="state.queryForm.result"
            placeholder="请选择结果"
            class="my-process-state"
          >
            <el-option
              v-for="item in resultList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>

      <div class="form-style">
        <div class="item-label">提交时间</div>
        <div class="item-input">
          <el-date-picker
            v-model="state.queryForm.timeRange"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </div>
      </div>
      <ideal-select-search
        :is-required="false"
        :search-type="SearchTypeEnum.title"
        prefix-title="流程名称"
        @clickSearch="clickSearch"
        @clickReset="clickReset"
      >
      </ideal-select-search>
    </div>

    <el-divider />

    <ideal-button-events
      :right-btns="rightButtons"
      @clickRightEvent="clickRightEvent"
    >
    </ideal-button-events>

    <ideal-table-list
      :total="state.total"
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
      <template #endTime>
        <el-table-column label="结束时间" show-overflow-tooltip>
          <template #default="props">
            {{ dateFormat(props.row.endTime, FormatsEnums.YMDHIS) }}
          </template>
        </el-table-column>
      </template>
      <template #createTime>
        <el-table-column label="提交时间" show-overflow-tooltip>
          <template #default="props">
            {{ dateFormat(props.row.createTime, FormatsEnums.YMDHIS) }}
          </template>
        </el-table-column>
      </template>
      <template #category>
        <el-table-column label="流程分类" show-overflow-tooltip>
          <template #default="props">
            <el-tag v-if="props.row.category == 1">{{
              getShowText('categoryList', props.row.category)
            }}</el-tag>
            <el-tag v-else type="success">{{
              getShowText('categoryList', props.row.category)
            }}</el-tag>
          </template>
        </el-table-column>
      </template>
      <template #tasks>
        <el-table-column
          label="当前审批任务"
          show-overflow-tooltip
        >
          <template #default="props">
            <el-button
              v-for="task in props.row.tasks"
              :key="task.id"
              link
              type="primary"
            >
              <span>{{ task.name }}</span>
            </el-button>
          </template>
        </el-table-column>
      </template>
      <template #status>
        <el-table-column label="状态" show-overflow-tooltip>
          <template #default="props">
            <el-tag v-if="props.row.status == 1">{{
              getShowText('sateList', props.row.status)
            }}</el-tag>
            <el-tag v-else type="success">{{
              getShowText('sateList', props.row.status)
            }}</el-tag>
          </template>
        </el-table-column>
      </template>
      <template #result>
        <el-table-column label="结果" show-overflow-tooltip>
          <template #default="props">
            <el-tag v-if="props.row.result == 1">{{
              getShowText('resultList', props.row.result)
            }}</el-tag>
            <el-tag v-if="props.row.result == 2" type="success">{{
              getShowText('resultList', props.row.result)
            }}</el-tag>
            <el-tag v-if="props.row.result == 3" type="danger">{{
              getShowText('resultList', props.row.result)
            }}</el-tag>
            <el-tag v-if="props.row.result == 4" type="info">{{
              getShowText('resultList', props.row.result)
            }}</el-tag>
          </template>
        </el-table-column>
      </template>
      <template #operation>
        <el-table-column label="操作" width="125">
          <template #default="props">
            <ideal-table-operate
              :buttons="dealTableButtons(props.row)"
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
      :dialog-width="dialogWidth"
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
import { dateFormat, FormatsEnums } from '@/utils/time-format'
import {
  IdealButtonEventProp,
  IdealTableColumnHeaders,
  IdealTableColumnOperate
} from '@/types'
import { bpmMyprocessListUrl } from '@/api/java/bpm/task'
import { router } from '@/router'
const state: IHooksOptions = reactive({
  dataListUrl: bpmMyprocessListUrl,
  deleteUrl: '',
  queryForm: {
    name: '',
    processDefinitionId: '',
    tasktType: '',
    category: '',
    result: '',
    timeRange: ''
  }
})
const { sizeChangeHandle, currentChangeHandle, getDataList, deleteHandle } =
  useCrud(state)

const categoryList: any = ref([
  { label: '默认', value: 1 }
  // { label: 'OA', value: 2 }
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

const getShowText = (type: string, key: any): string => {
  let allText = {
    categoryList: categoryList.value,
    resultList: resultList.value,
    sateList: sateList.value
  }
  let typeList = (allText as any)[type]
  if (!typeList) {
    return '--'
  }
  let text = typeList.find((v: any) => v.value === key * 1)
  if (!text) {
    return '--'
  }
  return text.label || '--'
}

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
  { label: '流程名称', prop: 'name' },
  { label: '流程分类', prop: 'category', useSlot: true },
  { label: '当前审批任务', prop: 'tasks', useSlot: true },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '结果', prop: 'result', useSlot: true },
  { label: '提交时间', prop: 'createTime', useSlot: true },
  { label: '结束时间', prop: 'endTime', useSlot: true }
]

// 列表右侧按钮
const rightButtons: IdealButtonEventProp[] = [
  {
    prop: 'add',
    title: '发起流程',
    type: 'primary',
    icon: 'circle-add'
  }
]

// 列表操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '详情', prop: 'detail' },
  { title: '取消', prop: 'cancel' }
]

// 右侧按键回调函数
const clickRightEvent = (value: string | number | object) => {
  router.push('/bpm-manage/task/my-process/create')
}
/**
 * 处理列表操作按键
 * @param buttons 列表操作
 * @param rowData 列表单前行数据
 */
const dealTableButtons = (rowData: any): any => {
  let newButtons: any = []
  operateBtns.forEach((v: any) => {
    if (v.prop === 'cancel') {
      if (rowData.status != 2) {
        newButtons.push(v)
      }
    } else {
      newButtons.push(v)
    }
  })
  return newButtons
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
  getDataList()
}

const rowData = ref()
const clickOperateEvent = (command: string | number | object, row: any) => {
  rowData.value = row
  if (command === 'detail') {
    router.push({
      path: '/bpm-manage/task/my-process/detail',
      query: {
        id: row.id,
        processDefinitionId: row.processDefinitionId
      }
    })
  } else if (command === 'cancel') {
    showDialog.value = true
    dialogTitle.value = `取消流程`
    dialogWidth.value = '45%'
  }
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
    width: 160px;
    margin-right: 10px;
    :deep(.el-input) {
      width: 160px;
    }
  }
  .table-options {
    display: flex;
    justify-content: flex-start;
  }
}
</style>
