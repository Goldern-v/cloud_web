<template>
  <div>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" clearable style="width: 100%" />
      </el-form-item>

      <el-form-item label="类型" prop="type">
        <el-select
          v-model="form.type"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option
            v-for="(item, index) of typeList"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="长度" prop="length">
        <el-input-number
          v-model="form.length"
          placeholder="请输入内容"
          clearable
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="初始序号">
        <el-input-number
          v-model="form.initNum"
          placeholder="请输入内容"
          clearable
          style="width: 100%"
        />
      </el-form-item>
    </el-form>
    <div
      class="flex-row ideal-submit-button"
    >
      <el-button @click="cancelForm(formRef)">{{
        t('cancel')
      }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus/es'
import type { FormRules, FormInstance } from 'element-plus'
import { nameRuleOne } from '@/utils/validate'
import { EventEnum } from '@/utils/enum'
import {
  addVdcSuffixApi,
  getVdcSuffixApi
} from '@/api/java/business-center.js'

const { t } = useI18n()

const route = useRoute()
const vdcId = route.query.id
const vdcCode = route.query.code

// 后缀
const formRef = ref<FormInstance>()
const form = reactive({
  name: '',
  type: '',
  length: 0,
  initNum: 0,
  vdcId,
  vdcCode
})
const checkSuffixName = (
  rule: any,
  value: any,
  callback: (e?: Error) => any
) => {
  let nameRepeat = suffixList.value.some((item: any) => item.name === value)
  if (!value.length) {
    callback(new Error('请输入后缀名称'))
  } else if (nameRepeat) {
    callback(new Error('已存在相同名称后缀'))
  }
  nameRuleOne({ maxLength: 20, minLength: 1 }, value, callback)
}
const rules = reactive<FormRules>({
  name: [{ required: true, validator: checkSuffixName, trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  length: [{ required: true, message: '请输入长度', trigger: 'blur' }]
})

onMounted(() => {
  getVdcSuffix()
})
// 后缀数据
let suffixList = ref<any>([])
const getVdcSuffix = async () => {
  const res: any = await getVdcSuffixApi(vdcId)
  if (res.code === 200) {
    suffixList.value = res.data
  }
}

// 后缀类型列表
const typeList = ref<any>([
  { label: '数字序列', value: 'NUMBER_LIST' },
  { label: '动态数字序列', value: 'DYNAMIC_NUMBER_LIST' },
  { label: '随机字符串', value: 'RANDOM_STRING' }
])

// 方法
interface EmitEvent {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EmitEvent>()
// 后缀操作
const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  emit(EventEnum.cancel)
}
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate((valid: Boolean) => {
    if (valid) {
      handleAdd()
    }
  })
}
const handleAdd = () => {
  addVdcSuffixApi(form).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('添加成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error('添加失败')
    }
  })
}
</script>

<style scoped lang="scss">
</style>
