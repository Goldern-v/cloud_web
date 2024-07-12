<template>
  <div class="ideal-main-container task-assign-rule">
    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :show-pagination="false"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
      <template #type>
        <el-table-column label="规则类型" align="center" prop="type">
          <template #default="scope">
            <el-tag v-if="scope.row.type">
              {{ typeObject[scope.row.type] }}
            </el-tag>
          </template>
        </el-table-column>
      </template>
      <template #options>
        <el-table-column label="规则范围" align="center" prop="options">
          <template #default="scope">
            <el-tag
              v-for="option in scope.row.options"
              :key="option"
              class="mr-5px"
            >
              {{ getAssignRuleOptionName(scope.row.type, parseInt(option)) }}
            </el-tag>
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
import {
  getTaskAssignRuleList,
  getSimpleRoleList,
  getSimplePostList,
  getSimpleUserList,
  getSimpleUserGroupList,
  getVdcPage
} from '@/api/java/bpm/taskAssignRule'
const route = useRoute()
const state: IHooksOptions = reactive({
  dataListUrl: getTaskAssignRuleList,
  isPage: false,
  queryForm: {
    modelId: route.query.modelId
  }
})
const dataSuccess = ref(false)
const { sizeChangeHandle, currentChangeHandle, getDataList, deleteHandle } =
  useCrud(state)

state.dataList = []

const roleOptions = ref() // 角色列表
const deptOptions = ref() // 部门列表
const postOptions = ref() // 岗位列表
const userOptions = ref() // 用户列表
const userGroupOptions = ref() // 用户组列表
onMounted(async () => {
  const res = await getSimpleRoleList()
  roleOptions.value = res.data
  // 获得部门列表
  const dept = await getVdcPage({
    pageNum: 1,
    pageSize: 99999
  })
  deptOptions.value = dept.data.data
  // 获得岗位列表
  const post = await getSimplePostList()
  postOptions.value = post.data
  // 获得用户列表
  const user = await getSimpleUserList()
  userOptions.value = user.data
  // 获得用户组列表
  const group = await getSimpleUserGroupList()
  userGroupOptions.value = group.data
  dataSuccess.value = true
})
const typeObject = ref<{ [index: number]: string }>({
  10: '角色',
  20: '部门的人',
  21: '部门的负责人',
  22: '岗位',
  30: '用户',
  40: '用户组',
  50: '自定义脚本'
})
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '任务名', prop: 'taskDefinitionName' },
  { label: '任务标识', prop: 'taskDefinitionKey' },
  { label: '规则类型', prop: 'type', useSlot: true },
  { label: '规则范围', prop: 'options', useSlot: true }
]

// 列表操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '修改', prop: 'editRule', authority: 'flowModel:manage:rule:update' }
]
const getAssignRuleOptionName = (type: number, option: number) => {
  if (!dataSuccess.value) {
    return
  }
  const name = ref()
  if (type === 10) {
    roleOptions.value.forEach((item: any) => {
      if (item.id === option) {
        name.value = item.name
      }
    })
  } else if (type === 20) {
    deptOptions.value.forEach((item: any) => {
      if (parseInt(item.id) === option) {
        name.value = item.name
      }
    })
  } else if (type === 22) {
    postOptions.value.forEach((item: any) => {
      if (parseInt(item.id) === option) {
        name.value = item.postName
      }
    })
  } else if (type === 30 || type === 31 || type === 32) {
    userOptions.value.forEach((item: any) => {
      if (parseInt(item.id) === option) {
        console.log(item.name, 'item.name')
        name.value = item.username
      }
    })
  } else if (type === 40) {
    userGroupOptions.value.forEach((item: any) => {
      if (parseInt(item.id) === option) {
        name.value = item.name
      }
    })
  } else {
    name.value = '未知(' + option + ')'
  }
  return name.value
}
// 弹框
const showDialog = ref(false)
const dialogType = ref()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  getDataList()
}

const rowData = ref()
const clickOperateEvent = (command: string | number | object, row: any) => {
  console.log(command, 'command')
  rowData.value = row
  dialogType.value = command
  showDialog.value = true
}
</script>

<style scoped lang="scss">
.task-assign-rule {
  padding: 20px;
  box-sizing: border-box;

  .cloud-host__time-range {
    margin-right: 10px;
  }

  .taskAssignRule-name {
    margin-right: 10px;
  }

  .taskAssignRule-type {
    margin-right: 10px;

    :deep(.el-input) {
      width: 224px;
    }
  }
}
</style>
