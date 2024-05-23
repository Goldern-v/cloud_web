<template>
  <div class="ideal-main-container model">
    <ideal-select-search
      :search-type="SearchTypeEnum.title"
      :slot-array="slotArray"
      prefix-title="流程标识"
      @clickSearch="clickSearch"
      @clickReset="clickReset"
    >
      <template #nameValue>
        <el-input
          v-model="nameValue"
          placeholder="请输入搜索内容"
          class="model-name"
        >
          <template #prepend> 流程名称 </template>
        </el-input>
      </template>
    </ideal-select-search>

    <el-divider />

    <ideal-button-events
      :right-btns="rightButtons"
      @clickRightEvent="clickRightEvent"
    >
    </ideal-button-events>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :total="state.total"
      :pagination-type="PaginationTypeEnum.totalSizes"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
      <template #name>
        <el-table-column
          label="流程名称"
          align="center"
          prop="category"
          width="100"
        >
          <template #default="scope">
            <el-button
              type="primary"
              link
              @click="clickOperateEvent('modelDetail', scope.row)"
            >
              <span>{{ scope.row.name }}</span>
            </el-button>
          </template>
        </el-table-column>
      </template>
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
      <template #formType>
        <el-table-column
          label="表单信息"
          align="center"
          prop="formType"
          width="200"
        >
          <template #default="scope">
            <el-button
              v-if="scope.row.formType === 10"
              type="primary"
              link
              @click="clickOperateEvent('formDetail', scope.row)"
            >
              <span>{{ scope.row.formName }}</span>
            </el-button>
            <el-button
              v-else-if="scope.row.formType === 20"
              type="primary"
              link
              @click="clickOperateEvent('formDetail', scope.row)"
            >
              <span>{{ scope.row.formCustomCreatePath }}</span>
            </el-button>
            <label v-else>暂无表单</label>
          </template>
        </el-table-column>
      </template>
      <template #processDefinition>
        <el-table-column
          label="最新部署的流程定义"
          align="center"
          show-overflow-tooltip
        >
          <el-table-column
            label="流程版本"
            align="center"
            show-overflow-tooltip
          >
            <template #default="props">
              <el-tag v-if="props.row.processDefinition">
                v{{ props.row.processDefinition.version }}
              </el-tag>
              <el-tag v-else type="warning">未部署</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="激活状态"
            align="center"
            show-overflow-tooltip
          >
            <template #default="props">
              <el-switch
                v-if="props.row.processDefinition"
                v-model="props.row.processDefinition.suspensionState"
                :active-value="1"
                :inactive-value="2"
                @change="handleChangeState(props.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="部署时间"
            align="center"
            show-overflow-tooltip
          >
            <template #default="props">
              <div v-if="props.row.processDefinition">
                {{ props.row.processDefinition.deploymentTime }}
              </div>
            </template>
          </el-table-column>
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
import dialogBox from './dialog-box.vue'
import {
  getModelPage,
  deleteModel,
  deployModel,
  updateModelState
} from '@/api/java/bpm/model'
import { ElMessage, ElMessageBox } from 'element-plus/es'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import {
  EventEnum,
  OperateEventEnum,
  PaginationTypeEnum,
  SearchTypeEnum
} from '@/utils/enum'
import {
  IdealButtonEventProp,
  IdealTableColumnHeaders,
  IdealTableColumnOperate
} from '@/types'

const state: IHooksOptions = reactive({
  dataListUrl: getModelPage,
  deleteUrl: deleteModel,
  queryForm: {}
})
const { sizeChangeHandle, currentChangeHandle, getDataList, deleteHandle } =
  useCrud(state)

// 搜索插槽
const slotArray = ['nameValue']

const router = useRouter()

// 流程名称
const nameValue = ref('')

const typeList: any = ref([
  { label: '开启', value: 1 },
  { label: '关闭', value: 0 }
])

// 搜索
const clickSearch = (search: string, type: string) => {
  state.queryForm.name = nameValue
  state.queryForm.key = search
  getDataList()
}

// 重置
const clickReset = () => {
  state.queryForm = {}
  nameValue.value = ''
  getDataList()
}

state.dataList = []

// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '流程标识', prop: 'key' },
  { label: '流程名称', prop: 'name', useSlot: true },
  { label: '流程分类', prop: 'category', useSlot: true },
  { label: '表单信息', prop: 'formType', useSlot: true },
  { label: '创建时间', prop: 'createTime' },
  { label: '创建时间', prop: 'processDefinition', useSlot: true }
]

// 列表右侧按钮
const rightButtons: IdealButtonEventProp[] = [
  {
    prop: 'newProcess',
    title: '新建流程',
    type: 'primary',
    icon: 'circle-add'
  },
  {
    prop: 'importProcess',
    title: '导入流程',
    type: 'primary'
  }
]

// 列表操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '修改流程', prop: 'editProcess' },
  { title: '设计流程', prop: 'designProcess' },
  { title: '分配规则', prop: 'allocationRules' },
  { title: '发布流程', prop: 'publishingProcess' },
  { title: '流程定义', prop: 'processDefinition' },
  { title: '删除', prop: 'delete' }
]
// 右侧按键回调函数
const clickRightEvent = (value: string | number | object) => {
  switch (value) {
    case 'newProcess':
      dialogType.value = value
      showDialog.value = true
      break
    case 'importProcess':
    //todo
  }
}

// 弹框
const showDialog = ref(false)
const dialogType = ref()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  getDataList()
  showDialog.value = false
}

const rowData = ref()
const clickOperateEvent = (command: string | number | object, row: any) => {
  rowData.value = row
  switch (command) {
    case 'editProcess':
      dialogType.value = command
      showDialog.value = true
      break
    case 'publishingProcess':
      release()
      break
    case 'delete':
      deleteHandle(row.id, '?id=')
      break
    case 'allocationRules':
      router.push({
        path: '/bpm-manage/model/taskAssignRule/list',
        query: { modelId: row.id }
      })
      break
    case 'processDefinition':
      router.push({
        path: '/bpm-manage/model/processDefinition/list',
        query: { key: row.key }
      })
      break
    case 'designProcess':
      router.push({
        path: '/bpm-manage/model/edit',
        query: { modelId: row.id }
      })
      break
    case 'modelDetail':
      dialogType.value = command
      showDialog.value = true
      break
    case 'formDetail':
      dialogType.value = command
      showDialog.value = true
      break
  }
}
/** 更新状态操作 */
const handleChangeState = async (row: any) => {
  const state = row.processDefinition.suspensionState
  try {
    // 修改状态的二次确认
    const id = row.id
    const statusState = state === 1 ? '激活' : '挂起'
    const content =
      '是否确认' + statusState + '流程名字为"' + row.name + '"的数据项?'
    await ElMessageBox.confirm(content)
    // 发起修改状态
    await updateModelState(id, state)
    // 刷新列表
    await getDataList()
  } catch {
    // 取消后，进行恢复按钮
    row.processDefinition.suspensionState = state === 1 ? 2 : 1
  }
}

const release = () => {
  ElMessageBox.confirm('是否发布该流程！', '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      deployModel(rowData.value.id)
        .then((res: any) => {
          let data = res
          if (data.code === 200) {
            ElMessage.success('发布成功')
            getDataList()
          }
        })
        .catch((err: any) => {
          console.log('发布失败')
        })
    })
    .catch(() => {})
}
</script>

<style scoped lang="scss">
.model {
  padding: 20px;
  box-sizing: border-box;

  .cloud-host__time-range {
    margin-right: 10px;
  }
  .model-name {
    margin-right: 10px;
  }
  .model-type {
    margin-right: 10px;
    :deep(.el-input) {
      width: 224px;
    }
  }
}
</style>
