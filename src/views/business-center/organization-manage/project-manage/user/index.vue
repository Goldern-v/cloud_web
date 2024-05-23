<template>
  <div class="ideal-table-list__container project-manage-user">
    <ideal-select-search
      :search-type="SearchTypeEnum.title"
      prefix-title="登录名"
      @clickSearch="clickSearch"
      @clickReset="clickReset"
    >
    </ideal-select-search>

    <el-divider border-style="solid" />

    <ideal-button-events
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    >
    </ideal-button-events>

    <ideal-table-list
      :reserve="false"
      :is-multiple="true"
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :total="state.total"
      :page="state.page"
      :table-headers="tableHeaders"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #account>
        <el-table-column label="登录名">
          <template #default="props">
            <el-button
              link
              type="primary"
              @click="clickDetail($event, props.row)"
              >{{ props.row.account }}</el-button
            >
          </template>
        </el-table-column>
      </template>
      <template #status>
        <el-table-column label="状态">
          <template #default="props">
            <p
              :class="
                statusObj[props.row.status] === '启用'
                  ? 'user-active'
                  : 'user-disable'
              "
            >
              {{ statusObj[props.row.status] }}
            </p>
          </template>
        </el-table-column>
      </template>
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
      :row-data="rowData"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus/es'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import DialogBox from './dialog-box.vue'
import { OperateEventEnum, SearchTypeEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealButtonEventProp,
  IdealTableColumnOperate
} from '@/types'
import {
  getProjectUserListApi,
  deleteProjectUserUrl
} from '@/api/java/business-center'

const route = useRoute()
const id: any = route.query.vdcId
const code: any = route.query.vdcCode
const projectId: any = route.query.id

const state: IHooksOptions = reactive({
  dataListUrl: getProjectUserListApi,
  deleteUrl: deleteProjectUserUrl,
  queryForm: {
    vdcId: id,
    vdcCode: code,
    projectId,
    userName: ''
  }
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList,
  deleteHandle
} = useCrud(state)

// 搜索
const clickSearch = (search: string, type: string) => {
  state.queryForm.userName = search
  getDataList()
}
// 重置
const clickReset = () => {
  state.page = 1
  state.queryForm.userName = ''
  getDataList()
}
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '登录名', prop: 'username' },
  { label: '用户名', prop: 'realName' },
  { label: '手机号', prop: 'mobile' },
  { label: '邮箱', prop: 'email' },
  { label: '角色', prop: 'k3' }
]
// 列表左侧按钮
const leftButtons: IdealButtonEventProp[] = [
  {
    title: '关联用户',
    prop: 'relateUser',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  { title: '移除用户', prop: 'removeUser' },
  { title: '关联角色', prop: 'relateRole' }
]
// 行数据
const rowData = ref({})
// 列表左侧按钮事件
const clickLeftEvent = (command: string | number | object) => {
  if (command === 'relateUser') {
    rowData.value = {
      id,
      code,
      projectId
    }
    showDialog.value = true
    dialogType.value = 'addUser'
  } else if (command === 'removeUser') {
    if (!state.dataListSelections?.length) {
      return ElMessage.warning('请选择需要删除的用户')
    }
    let userIdArray = state.dataListSelections.map((item: any) => {
      return item.id
    })
    const userIds = userIdArray?.join(',')
    clickDeleteUser(userIds)
  } else if (command === 'relateRole') {
    showDialog.value = true
    dialogType.value = 'relateRole'
  }
}
// 列表行数据操作事件
const operateBtns: IdealTableColumnOperate[] = [
  { type: 'primary', title: '关联角色', prop: 'relateRole' },
  { type: 'primary', title: '移除', prop: 'delete' }
]
const clickOperateEvent = (command: string | number | object, row: any) => {
  if (command === 'relateRole') {
    showDialog.value = true
    dialogType.value = 'relateRole'
  } else if (command === 'delete') {
    const userIds = row.id
    clickDeleteUser(userIds)
  }
}
const clickDeleteUser = (userIds: string) => {
  deleteHandle(
    projectId as string,
    '?id=',
    '确定从当前项移除所选用户吗？',
    '移除用户',
    `&userIds=${userIds}`
  )
}
const statusObj: any = reactive({
  1: '启用',
  2: '停用'
})

const router = useRouter()
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()

const clickCloseEvent = () => {
  showDialog.value = false
  rowData.value = {}
}
const clickRefreshEvent = () => {
  showDialog.value = false
  getDataList()
}
const clickDetail = (command: string | number | object, row: object) => {
  router.push({ path: './cmp-view' })
}
</script>

<style scoped lang="scss">
.project-manage-user {
  width: 100%;
  padding: 20px;
}
</style>
