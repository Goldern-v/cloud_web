<template>
  <div class="ideal-main-container my-process">
    <div class="search-type">
      <ideal-select-search
        :is-required="false"
        :search-type="SearchTypeEnum.title"
        prefix-title="配置名称"
        @clickSearch="clickSearch"
        @clickReset="clickReset"
      >
      </ideal-select-search>
    </div>

    <el-divider />

    <ideal-button-events
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    >
    </ideal-button-events>

    <ideal-table-list
      :total="state.total"
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
      <template #status>
        <el-table-column label="状态" show-overflow-tooltip>
          <template #default="props">
            <el-tag v-if="props.row.status == 0">开启</el-tag>
            <el-tag v-else type="info">关闭</el-tag>
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
import { mockProcess } from '../form/testData'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum, SearchTypeEnum } from '@/utils/enum'
import { dateFormat, FormatsEnums } from '@/utils/time-format'
import {
  IdealButtonEventProp,
  IdealTableColumnHeaders,
  IdealTableColumnOperate
} from '@/types'
import { bpmMyprocessListUrl } from '@/api/java/bpm/task'
import { bpmConfigListUrl } from '@/api/java/bpm/config'
import { router } from '@/router'
const state: IHooksOptions = reactive({
  dataListUrl: bpmConfigListUrl,
  deleteUrl: '',
  isPage: true,
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
  { label: '配置名称', prop: 'configName' },
  { label: '流程定义名称', prop: 'processDefinitionName' },
  { label: '流程定义ID', prop: 'processDefinitionId' },
  { label: '请求URL', prop: 'requestUrl' },
  { label: '请求成功回调', prop: 'completedCallBackUrl' },
  { label: '请求成功回调方法类型', prop: 'completedCallBackMethodType' },
  { label: '请求失败回调', prop: 'cancelCallBackUrl' },
  { label: '请求失败回调方法类型', prop: 'cancelCallBackMethodType' },
  { label: '状态', prop: 'status', useSlot: true }
]

// 列表右侧按钮
const leftButtons: IdealButtonEventProp[] = [
  {
    prop: 'add',
    title: '新建',
    type: 'primary',
    icon: 'circle-add'
  }
]

// 列表操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '编辑', prop: 'edit' },
  { title: '删除', prop: 'delete' }
]

// 右侧按键回调函数
const clickLeftEvent = (value: string | number | object) => {
  showDialog.value = true
  dialogTitle.value = `新建配置`
  dialogWidth.value = '50%'
  dialogType.value = 'create'
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
  if (command === 'edit') {
    showDialog.value = true
    dialogTitle.value = `编辑配置`
    dialogWidth.value = '50%'
    dialogType.value = 'edit'
  } else if (command === 'delete') {
    showDialog.value = true
    dialogTitle.value = `删除配置`
    dialogWidth.value = '50%'
    dialogType.value = 'delete'
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
