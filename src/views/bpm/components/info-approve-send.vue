<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    label-width="80px"
  >
    <el-form-item label="新审批人" prop="assigneeUserId">
      <el-select
        v-model="formData.assigneeUserId"
        placeholder="请选择新审批人"
        class="my-process-state"
      >
        <el-option
          v-for="item in userList"
          :key="item.id"
          :label="item.username"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
  </el-form>
  <div class="send-btns">
    <el-button :disabled="formLoading" type="primary" @click="submitForm"
      >确 定</el-button
    >
    <el-button @click="cancel">取 消</el-button>
  </div>
</template>
<script lang="ts" setup>
import { EventEnum } from '@/utils/enum'
import { getSimpleUserList } from '@/api/java/bpm/taskAssignRule'
import { bpmProcessSend } from '@/api/java/bpm/task'
interface DialogProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: null
})

// 方法
interface EventEmits {
  (e: EventEnum.close): void
  (e: EventEnum.success): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()
const dialogVisible = ref(false) // 弹窗是否展示
const formLoading = ref(false) // 表单的加载中:提交的按钮禁用
// 提交表单数据
const formData = ref({
  assigneeUserId: ''
})
let userList = ref<any>([])
const formRules = reactive({
  assigneeUserId: [
    { required: true, message: '请选择新的审批人', trigger: 'blur' }
  ]
})
const formRef = ref() // 表单 Ref

/** 处理保存按钮 */
const cancel = () => {
  emit(EventEnum.close)
}
/**
 * 获取用户列表-回显下拉框
 */
const getUserList = () => {
  getSimpleUserList().then((res: any) => {
    if (res.code === 200) {
      userList.value = res.data
    }
  })
}

/** 提交表单 */
const submitForm = async () => {
  // 校验表单
  if (!formRef) {
    return
  }
  const valid = await formRef.value.validate()
  if (!valid) {
    return
  }
  // 提交请求
  formLoading.value = true
  let params = {
    assigneeUserId: formData.value.assigneeUserId,
    id: props.rowData.id
  }
  bpmProcessSend(params).then((res: any) => {
    if (res.code === 200) {
      emit(EventEnum.success)
    }
  })
}

onMounted(() => {
  getUserList()
})
</script>

<style lang="scss" scoped>
.send-btns {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
