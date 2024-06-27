<template>
  <div class="process-cancel">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="80px"
    >
      <el-form-item label="取消原因" prop="reason">
        <el-input v-model="formData.reason" placeholder="请输入取消原因" />
      </el-form-item>
    </el-form>
    <div class="footer-btns">
      <el-button :disabled="formLoading" type="primary" @click="submitForm"
        >确 定</el-button
      >
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { bpmMyprocessCancel } from '@/api/java/bpm/task'
import { EventEnum } from '@/utils/enum'
const router = useRouter()

interface EventEmits {
  (e: EventEnum.close): void
  (e: EventEnum.success): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()
// 属性值
interface DialogProps {
  rowData?: any // 行数据
  type?: string
}

const props = withDefaults(defineProps<DialogProps>(), {
  rowData: null,
  type: 'create'
})
const formLoading = ref(false) // 表单的加载中：提交的按钮禁用
// 提交表单数据
const formData = ref({
  reason: ''
})
const formRules = reactive({
  reason: [{ required: true, message: '请输入取消原因', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref
// 表单状态

/** 处理保存按钮 */
const handleSave = () => {}

/** 提交表单 */
const submitForm = async () => {
  // 校验表单
  if (!formRef.value) {
    return
  }
  const valid = await formRef.value.validate()
  if (!valid) {
    return
  }

  // 提交请求
  formLoading.value = true
  let params = {
    id: props.rowData.id,
    reason: formData.value.reason
  }
  bpmMyprocessCancel(params).then((res: any) => {
    if (res.code === 200) {
      emit(EventEnum.success)
    }
  })
}
/** 关闭按钮 */
const cancel = () => {
  emit(EventEnum.close)
}

/** 初始化 **/
onMounted(() => {})
</script>

<style scoped lang="scss">
.process-cancel {
  .footer-btns {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
@/api/java/form/bpm
