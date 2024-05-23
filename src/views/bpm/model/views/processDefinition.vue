<template>
  <div class="ideal-main-container process-definition">
    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
      <template #category>
        <el-table-column
          label="流程分类"
          align="center"
          prop="category"
          width="100"
        >
          <template #default="scope">
            <ElTag v-if="scope.row.category"> 默认 </ElTag>
          </template>
        </el-table-column>
      </template>
      <template #version>
        <el-table-column label="流程版本" align="center" show-overflow-tooltip>
          <template #default="props">
            <el-tag v-if="props.row">v{{ props.row.version }}</el-tag>
            <el-tag v-else type="warning">未部署</el-tag>
          </template>
        </el-table-column>
      </template>
      <template #suspensionState>
        <el-table-column
          label="状态"
          align="center"
          prop="suspensionState"
          width="80"
        >
          <template #default="scope">
            <el-tag v-if="scope.row.suspensionState === 1" type="success"
              >激活</el-tag
            >
            <el-tag v-if="scope.row.suspensionState === 2" type="warning"
              >挂起</el-tag
            >
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="185" align="center">
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
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script lang="ts" setup>
import dialogBox from '../dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { IdealTableColumnHeaders, IdealTableColumnOperate } from '@/types'
import { getProcessDefinitionPage } from '@/api/java/bpm/model'
const route = useRoute()

const state: IHooksOptions = reactive({
  dataListUrl: getProcessDefinitionPage,
  queryForm: {
    key: route.query.key
  }
})
const { sizeChangeHandle, currentChangeHandle, getDataList, deleteHandle } =
  useCrud(state)

const router = useRouter()

state.dataList = []

// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '定义编号', prop: 'id' },
  { label: '流程名称', prop: 'name' },
  { label: '定义分类', prop: 'category', useSlot: true },
  { label: '表单信息', prop: 'formName' },
  { label: '流程版本', prop: 'version', useSlot: true },
  { label: '状态', prop: 'suspensionState', useSlot: true },
  { label: '部署时间', prop: 'deploymentTime' },
  { label: '定义描述', prop: 'description' }
]

// 列表操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '分配规则', prop: 'allocationRules' }
]

// 弹框
const showDialog = ref(false)
const dialogType = ref('')
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
}

const rowData = ref()
const clickOperateEvent = (command: string | number | object, row: any) => {
  router.push({
    path: '/bpm-manage/model/taskAssignRule/list',
    query: { modelId: row.id }
  })
}
</script>

<style scoped lang="scss">
.process-definition{
  padding: 20px;
  box-sizing: border-box;

  .cloud-host__time-range {
    margin-right: 10px;
  }
  .processDefinition-name {
    margin-right: 10px;
  }
  .processDefinition-type {
    margin-right: 10px;
    :deep(.el-input) {
      width: 224px;
    }
  }
}
</style>
