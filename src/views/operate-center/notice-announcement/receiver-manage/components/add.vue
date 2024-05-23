<template>
  <div>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
    >
      <el-form-item label="接收人姓名" prop="name">
        <el-input v-model="form.name"/>
      </el-form-item>

      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="form.phone"/>
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email"/>
      </el-form-item>

      <el-form-item label="企业微信">
        <el-input v-model="form.wechat"/>
      </el-form-item>

      <el-form-item label="钉钉">
        <el-input v-model="form.dingTalk"/>
      </el-form-item>
    </el-form>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum } from '@/utils/enum'
import { compareDiffDictionary } from '@/utils/tool'
import { validateEmail, validateMobile } from '@/utils/validate'
import { receiverManageAdd, receiverManageEdit } from '@/api/java/operate-center'

const { t } = useI18n()

// 属性值
interface AddProps {
  isEdit?: boolean
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<AddProps>(), {
  isEdit: false,
  rowData: null
})

const formRef = ref<FormInstance>()
const form = reactive({
  name: '', // 接收人姓名
  phone: '', // 手机号码
  email: '', // 邮箱
  wechat: '', // 企业微信
  dingTalk: '' // 钉钉
})
const validPhone = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!validateMobile(value)) {
    callback(new Error('手机号码格式错误'))
  } else {
    callback()
  }
}
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入接收人姓名', trigger: 'blur' }],
  phone: [{ required: true, validator: validPhone, trigger: 'blur' }],
  email: [{ required: false, validator: validateEmail, trigger: 'blur' }]
})
onMounted(() => {
  if (props.isEdit) {
    formEdit()
  }
})
// 表单深拷贝, 比较表单是否修改
const originDic = ref()

const formEdit = () => {
  form.name = props.rowData.name
  form.phone = props.rowData.phone
  form.email = props.rowData.email
  form.wechat = props.rowData.wechat
  form.dingTalk = props.rowData.dingTalk

  originDic.value = Object.assign({}, form)
}
// 方法
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

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate(valid => {
    if (valid) {
      handleSubmit()
    }
  })
}
const handleSubmit = () => {
  if (props.isEdit) {
    edit()
  } else {
    add()
  }
}
const add = () => {
  const params = {...form}
  receiverManageAdd(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('添加成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error('添加失败')
    }
  })
}
const edit = () => {
  // 筛选表单修改项
  const tempDic = compareDiffDictionary(originDic.value, form)
  const params = {
    id: props.rowData.id,
    ...tempDic
  }
  receiverManageEdit(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('编辑成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error('编辑失败')
    }
  })
}
</script>

<style scoped lang="scss">

</style>
