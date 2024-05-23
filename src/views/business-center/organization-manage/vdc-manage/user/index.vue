<template>
  <div class="user-container">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
      class="user-form"
    >
      <div class="flex-row header__title">
        <el-divider direction="vertical" />
        <div>基本信息</div>
      </div>

      <el-form-item label="个人预算" prop="budget" class="ideal-large-margin-top">
        <el-input v-model.number="form.budget" class="vbf-item" clearable>
          <template #prepend>￥</template>
        </el-input>
      </el-form-item>

      <el-form-item label="告警阈值" prop="alarmThreshold">
        <el-input
          v-model.number="form.alarmThreshold"
          class="vbf-item"
          clearable
        >
          <template #prepend>%</template>
        </el-input>
      </el-form-item>

      <div class="flex-row header__title">
        <el-divider direction="vertical" />
        <div>用户配置</div>
      </div>
    </el-form>

    <div class="user-table">
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
        
        <template #role>
          <el-table-column label="角色">
            <template #default="props">
              <div v-for="(item,index) of props.row?.sysRoleList" :key="index">
              {{ item.name }}</div>
            </template>
          </el-table-column>
        </template>

        <template #operation>
          <el-table-column label="操作" fixed="right" width="150">
            <template #default="props">
              <ideal-table-operate
                :buttons="operateBtns"
                :max-buttons="3"
                @clickMoreEvent="clickOperateEvent($event, props.row)"
              >
              </ideal-table-operate>
            </template>
          </el-table-column>
        </template>
      </ideal-table-list>
    </div>

    <div class="flex-row footer-button">
      <el-button type="primary" @click="clickSubmit(formRef)">{{
        t('save')
      }}</el-button>
      <el-button @click="clickCancel(formRef)">{{ t('back') }}</el-button>
    </div>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      :row-data="rowData"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    >
    </dialog-box>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus/es'
import dialogBox from './dialog-box.vue'
import type { FormRules, FormInstance } from 'element-plus'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import { SearchTypeEnum, OperateEventEnum } from '@/utils/enum'
import type {
  IdealButtonEventProp,
  IdealTableColumnHeaders,
  IdealTableColumnOperate
} from '@/types'
import {
  getVdcUserBudgetApi,
  addVdcUserBudgetApi,
  editVdcUserBudgetApi,
  getUserListUrl,
  deleteVdcUserUrl
} from '@/api/java/business-center'

const { t } = useI18n()
// 路由
const route = useRoute()
const vdcId = route.query.id
const vdcCode = route.query.code
// 行数据
const rowData = ref()

onMounted(() => {
  getVdcUserBudget()
})
//查询用户预算
const getVdcUserBudget = async () => {
  const res: any = await getVdcUserBudgetApi(vdcId)
  if (res.code === 200) {
    form.budget = res.data?.budget
    form.alarmThreshold = res.data?.alarmThreshold
    form.id = res.data?.id
  }
}
// 表单
const formRef = ref<FormInstance>()
const form = reactive({
  budget: '', // 预算
  alarmThreshold: '', // 告警阀值
  id: '' // 接口有id则是编辑预算,没有是新增预算
})
const rules = reactive<FormRules>({
  budget: [
    { required: true, message: '请填写预算', trigger: 'blur' },
    { type: 'number', message: '数据类型错误', trigger: 'blur' }
  ],
  alarmThreshold: [
    { required: true, message: '请填写预算', trigger: 'blur' },
    { type: 'number', message: '数据类型错误', trigger: 'blur' }
  ]
})
// 列表
const state: IHooksOptions = reactive({
  dataListUrl: getUserListUrl,
  deleteUrl: deleteVdcUserUrl,
  queryForm: {
    vdcId,
    vdcCode,
    username: ''
  }
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  deleteHandle,
  getDataList
} = useCrud(state)
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '创建用户',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  { title: '添加用户', prop: 'addUser', disabled: true, disabledText: '请选择用户' },
  { title: '移除用户', prop: 'removeUser', disabled: true, disabledText: '请选择用户' },
  { title: '关联角色', prop: 'relateRole', disabled: true, disabledText: '请选择用户' }
])
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.create
  } else if (value === 'addUser') {
    rowData.value = {
      id: vdcId,
      code: vdcCode
    }
    showDialog.value = true
    dialogType.value = 'addUser'
  } else if (value === 'removeUser') {
    if (!state.dataListSelections?.length) {
      return ElMessage.warning('请选择需要删除的用户')
    }
    let userIdArray = state.dataListSelections.map((item: any) => {
      return item.id
    })
    const userIds = userIdArray?.join(',')
    clickDeleteUser(userIds)
  } else if (value === 'relateRole') {
    showDialog.value = true
    dialogType.value = 'relateRole'
  }
}
watch(() => state.dataListSelections, value => {
  leftButtons.value.forEach((item: any, index: number) => {
    if (index === 0) {
        item.disabled = false
      } else {
        item.disabled = true
        item.disabledText = '请选择用户'
      }
  })

  if (value?.length) {
    leftButtons.value?.forEach((item: any, index: number) => {
      if (index !== 0) {
        item.disabled = false
      }
    })
  }
})
// 列表行数据操作事件
const operateBtns: IdealTableColumnOperate[] = [
  { type: 'primary', title: '角色', prop: 'role' },
  { type: 'primary', title: '编辑', prop: 'edit' },
  { type: 'primary', title: '移除', prop: 'delete' }
]
const clickOperateEvent = (command: string | number | object, row: any) => {
  rowData.value = row
  if (command === 'role') {
    showDialog.value = true
    dialogType.value = 'relate-role'
  } else if (command === 'edit') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.edit
  } else if (command === 'delete') {
    clickDeleteUser(row?.id)
  }
}
const clickDeleteUser = (userIds: string) => {
  deleteHandle(
    vdcId as string,
    '?vdcId=',
    '确定从当前VDC移除所选用户吗？',
    '移除用户',
    `&userIds=${userIds}`
  )
}
// 搜索
const clickSearch = (search: string, type: string) => {
  if (search) {
    state.queryForm.username = search
  }
  getDataList()
}
// 重置
const clickReset = () => {
  state.page = 1
  state.queryForm.username = ''
  getDataList()
}
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '登录名', prop: 'username' },
  { label: '用户名', prop: 'realName' },
  { label: '手机号', prop: 'mobile' },
  { label: '邮箱', prop: 'email' },
  { label: '角色', prop: 'role', useSlot: true },
  { label: '企业微信', prop: 'enterpriseWechat' },
  { label: '钉钉', prop: 'dingTalk' }
]
const statusObj: any = reactive({
  1: '启用',
  2: '停用'
})
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
const router = useRouter()
// 详情
const clickDetail = (command: string | number | object, row: object) => {
  router.push({ path: './cmp-view' })
}
// 取消
const clickCancel = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  router.back()
}
// 保存
const clickSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate(valid => {
    if (valid) {
      if (form.id) {
        editInfo()
      } else {
        addInfo()
      }
    } else {
      console.log('error submit!')
      return false
    }
  })
}
//新增预算
const addInfo = () => {
  let params = {
    budget: form.budget,
    alarmThreshold: form.alarmThreshold,
    vdcId,
    vdcCode
  }
  const res: any = addVdcUserBudgetApi(params)
  if (res.code === 200) {
    ElMessage.success('保存成功')
    router.push({
      path: '/business-center/organization-manage/vdc-manage/list'
    })
  } else {
    ElMessage.error('保存失败')
  }
}
//编辑预算
const editInfo = () => {
  const res: any = editVdcUserBudgetApi(form)
  if (res.code === 200) {
    ElMessage.success('修改成功')
    router.push({
      path: '/business-center/organization-manage/vdc-manage/list'
    })
  } else {
    ElMessage.error('修改失败')
  }
}
</script>

<style lang="scss" scoped>
.user-container {
  width: 100%;
  // 修改分割线颜色
  :deep(.el-divider--vertical) {
    border-left: 1px var(--el-color-primary) solid;
  }
  .user-form {
    background-color: white;
    padding: 20px;
    .header__title {
      background-color: var(--el-color-primary-light-9);
      line-height: $headerContainerHeight;
      height: $headerContainerHeight;
      align-items: center;
      // 修改分割线颜色
      :deep(.el-divider--vertical) {
        border-left: 2px var(--el-color-primary) solid;
      }
    }
    .vbf-item {
      width: 352px;
    }
  }
  .user-table {
    background-color: white;
    padding: 20px;
  }
  .footer-button {
    margin-top: 5px;
    padding: 20px;
    background-color: white;
    justify-content: flex-start;
    align-items: center;
  }
}
</style>
