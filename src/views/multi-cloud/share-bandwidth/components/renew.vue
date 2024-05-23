<template>
  <div class="renew">
    <el-form
      ref="renewFormRef"
      :model="renewForm"
      :rules="rules"
      label-position="left"
    >
      <el-form-item label="名称:">
        <span>{{ info?.name }}</span>
      </el-form-item>

      <el-form-item label="ID:">
        <span>{{ info?.uuid }}</span>
      </el-form-item>

      <el-form-item label="周期类型:">
        <el-select v-model="renewForm.timeType" @change="queryPrice">
          <el-option
            v-for="item in timeTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="周期时长:" prop="timeValue">
        <el-select v-model="renewForm.timeValue" @change="queryPrice">
          <el-option v-for="x in timeValueList" :key="x" :label="x" :value="x">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="价格:">
        <span v-loading="priceLoading" class="countPrice"
          >￥{{ renewPrice }}
        </span>
      </el-form-item>
    </el-form>

    <div class="flex-row renew-button">
      <el-button @click="cancelForm(renewFormRef)"
        >{{ t('cancel') }}</el-button
      >
      <el-button type="primary" @click="submitForm(renewFormRef)"
        >{{ t('confirm') }}</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()
interface RenewProp {
  rowData?: any
}

const props = withDefaults(defineProps<RenewProp>(), {
  rowData: () => ({})
})
const info = reactive({
  name: '',
  uuid: ''
})
onMounted(() => {
  info.name = props.rowData.name
  info.uuid = props.rowData.uuid
})
const renewFormRef = ref<FormInstance>()
const renewForm = reactive({
  timeType: 3,
  timeValue: ''
})
const timeTypeList = [
  { label: '按月', value: 3 },
  { label: '按年', value: 5 }
]
const timeValueList = computed(() => {
  let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  if (renewForm.timeType === 5) {
    arr = [1, 2, 3]
  }
  return arr
})

watch(
  () => renewForm.timeType,
  () => {
    renewForm.timeValue = ''
  }
)

const priceLoading = ref(false)
const renewPrice = ref('')
const queryPrice = () => {} // 价格查询

const rules = reactive<FormRules>({
  timeValue: [
    {
      required: true,
      message: '请选择周期时长',
      trigger: 'blur'
    }
  ]
})
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
      console.log('submit!')
      emit(EventEnum.success)
    } else {
      console.log('error submit!')
      return false
    }
  })
}
</script>

<style scoped lang="scss">
.renew {
  width: 100%;
  :deep(.el-form) {
    padding: 0 0 8px;
  }
  .renew-button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>