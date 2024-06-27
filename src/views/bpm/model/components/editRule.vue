<template>
  <div class="edit">
    <el-form
      ref="editFormRef"
      :model="editForm"
      :rules="rules"
      label-position="right"
      label-width="100px"
    >
      <el-form-item label="任务名称" prop="taskDefinitionName">
        <el-input
          v-model="editForm.taskDefinitionName"
          class="custom-input"
          placeholder="请输入任务名称"
          disabled
        />
      </el-form-item>

      <el-form-item label="任务标识" prop="taskDefinitionKey">
        <el-input
          v-model="editForm.taskDefinitionKey"
          class="custom-input"
          placeholder="请输入任务标识"
          disabled
        />
      </el-form-item>

      <el-form-item label="规则类型" prop="type">
        <el-select
          v-model="editForm.type"
          placeholder="请选择规则类型"
          filterable
          style="width: 100%"
        >
          <el-option
            v-for="(item, index) of ruleTypeList"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="editForm.type === 10" label="指定角色" prop="roleIds">
        <el-select
          v-model="editForm.roleIds"
          clearable
          multiple
          style="width: 100%"
        >
          <el-option
            v-for="item in roleOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="editForm.type === 20" label="指定部门" prop="deptIds">
        <el-tree-select
          ref="treeRef"
          v-model="editForm.deptIds"
          :default-checked-keys="editForm.deptIds"
          style="width: 100%"
          :data="deptTreeOptions"
          :props="defaultProps"
          check-strictly
          empty-text="加载中，请稍后"
          multiple
          node-key="id"
          show-checkbox
        />
      </el-form-item>
      <el-form-item v-if="editForm.type === 22" label="指定岗位" prop="postIds">
        <el-select
          v-model="editForm.postIds"
          clearable
          multiple
          style="width: 100%"
        >
          <el-option
            v-for="item in postOptions"
            :key="item.id"
            :label="item.postName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="
          editForm.type === 30 || editForm.type === 31 || editForm.type === 32
        "
        label="指定用户"
        prop="userIds"
      >
        <el-select
          v-model="editForm.userIds"
          clearable
          multiple
          style="width: 100%"
        >
          <el-option
            v-for="item in userOptions"
            :key="item.id"
            :label="item.username"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="editForm.type === 40"
        label="指定用户组"
        prop="userGroupIds"
      >
        <el-select
          v-model="editForm.userGroupIds"
          clearable
          multiple
          style="width: 100%"
        >
          <el-option
            v-for="item in userGroupOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <div class="flex-row vpc-button--edit">
      <el-button type="info" @click="cancelForm(editFormRef)">取消</el-button>
      <el-button
        v-loading="formLoading"
        type="primary"
        @click="submitForm(editFormRef)"
        >确认</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus/es'
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum } from '@/utils/enum'
import {
  createTaskAssignRule,
  getSimpleRoleList,
  getSimpleDeptList,
  getSimplePostList,
  getSimpleUserList,
  getSimpleUserGroupList,
  updateTaskAssignRule
} from '@/api/java/bpm/taskAssignRule'

interface CreateProps {
  rowData?: any
}

const props = withDefaults(defineProps<CreateProps>(), {
  rowData: () => ({})
})
const roleOptions = ref() // 角色列表
const deptTreeOptions = ref() // 部门树
const postOptions = ref() // 岗位列表
const userOptions = ref() // 用户列表
const userGroupOptions = ref() // 用户组列表
const route = useRoute()

const editFormRef = ref<FormInstance>()
const editForm: any = reactive({
  taskDefinitionName: '',
  taskDefinitionKey: '',
  type: Number(undefined),
  modelId: '',
  options: [],
  roleIds: [],
  deptIds: [],
  postIds: [],
  userIds: [],
  userGroupIds: []
})

const defaultProps = ref({
  children: 'sons',
  label: 'name',
  value: 'id',
  isLeaf: 'leaf'
})

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入流程名称', trigger: 'blur' }],
  identifying: [
    { required: true, message: '请输入流程标识', trigger: 'change' }
  ],
  classification: [
    { required: true, message: '请选择流程分类', trigger: 'change' }
  ]
})
const formLoading = ref(false)
const ruleTypeList: any = ref([
  { label: '角色', value: 10 },
  { label: 'VDC下用户', value: 20 },
  // { label: '岗位', value: 22 },
  { label: '用户', value: 30 }
  // { label: '用户组', value: 40 }
])

interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()
const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  emit(EventEnum.cancel)
}
onMounted(() => {
  open()
})
/** 打开弹窗 */
const open = async () => {
  const row = props.rowData

  if (row) {
    // 回显除了部门需要字符串类型其余都要数值类型
    if (row.options && row.type !== 20) {
      row.options = row.options.map((item: any) => {
        item = item * 1
        return item
      })
    }
    ;(editForm.modelId = route.query.modelId),
      (editForm.taskDefinitionName = row.taskDefinitionName),
      (editForm.taskDefinitionKey = row.taskDefinitionKey),
      (editForm.id = row.id),
      (editForm.type = row.type)
  }

  // 获得角色列表
  const role = await getSimpleRoleList()
  roleOptions.value = role.data
  // 获得部门列表
  const dept = await getSimpleDeptList()
  deptTreeOptions.value = dept.data.sons
  // 获得岗位列表
  const post = await getSimplePostList()
  postOptions.value = post.data
  // 获得用户列表
  const user = await getSimpleUserList()
  userOptions.value = user.data
  // 获得用户组列表
  const group = await getSimpleUserGroupList()
  userGroupOptions.value = group.data

  // 将 options 赋值到对应的 roleIds 等选项
  if (row.type === 10) {
    editForm.roleIds.push(...row.options)
  } else if (row.type === 20) {
    editForm.deptIds.push(...row.options)
  } else if (row.type === 22) {
    editForm.postIds.push(...row.options)
  } else if (row.type === 30 || row.type === 31 || row.type === 32) {
    editForm.userIds.push(...row.options)
  } else if (row.type === 40) {
    editForm.userGroupIds.push(...row.options)
  }
}

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate((valid: boolean) => {
    if (!valid) {
      return
    }
    // 构建表单
    const form = {
      ...editForm,
      taskDefinitionName: undefined
    }
    // 将 roleIds 等选项赋值到 options 中
    if (form.type === 10) {
      form.options = form.roleIds
    } else if (form.type === 20) {
      form.options = form.deptIds
    } else if (form.type === 22) {
      form.options = form.postIds
    } else if (form.type === 30 || form.type === 31 || form.type === 32) {
      form.options = form.userIds
    } else if (form.type === 40) {
      form.options = form.userGroupIds
    }
    form.roleIds = undefined
    form.deptIds = undefined
    form.postIds = undefined
    form.userIds = undefined
    form.userGroupIds = undefined

    // 提交请求
    formLoading.value = true
    const apiData = [createTaskAssignRule, updateTaskAssignRule]
    try {
      apiData[form.id ? 1 : 0](form)
        .then((res: any) => {
          formLoading.value = false
          let data = res
          if (data.code === 200) {
            ElMessage.success(form.id ? '修改规则成功' : '新建规则成功')
            emit(EventEnum.success)
          }
        })
        .catch((err: any) => {
          console.log(err, 'err')
        })
    } finally {
      formLoading.value = false
    }
  })
}
</script>

<style scoped lang="scss">
.edit {
  width: 100%;
  :deep(.el-form) {
    padding: 0;
  }
  .edit__tip {
    background-color: var(--custom-information-bg-color);
    align-items: center;
    padding: 20px;
    margin-bottom: 10px;
    border-radius: $circleRadiusSize;
  }
  .vpc-button--edit {
    justify-content: flex-end;
    align-items: center;
  }
  :deep(.el-select .el-select-tags-wrapper.has-prefix) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
