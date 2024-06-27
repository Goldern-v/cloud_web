<template>
  <div class="apply-virtual-ip">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="虚拟私有云" prop="name">
        <div class="flex-column">
          <div>subnet-default</div>
          <div class="ideal-tip-text">当前子网IPv4网段：192.168.0.0/24</div>
        </div>
      </el-form-item>

      <el-form-item label="创建方式" prop="createMode">
        <div class="flex-column">
          <el-radio-group v-model="form.createMode">
            <el-radio-button
              v-for="(item, index) in createModeList"
              :key="index"
              :label="item.label"
            >
              {{ item.value }}
            </el-radio-button>
          </el-radio-group>

          <template v-if="isManual">
            <ideal-ip-input
              :ip-value="form.manualIp"
              port-split="/"
              class="ideal-default-margin-top"
              @listenChange="createModeChangeEvent"
            ></ideal-ip-input>

            <div class="ideal-tip-text">可用IP地址范围: 192.168.0.0/24</div>
          </template>
        </div>
      </el-form-item>
    </el-form>

    <div class="flex-row apply-virtual-ip-button">
      <el-button type="info" @click="cancelForm(formRef)">{{
        t('cancel')
      }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()
const formRef = ref<FormInstance>()
const form = reactive({
  vpc: '', // 虚拟私有云
  createMode: '', // 创建方式
  manualIp: '' // 手动分配
})
const createModeList: any = ref([
  { label: '1', value: '自动分配' },
  { label: '2', value: '手动分配' }
])
const rules = reactive<FormRules>({
  createMode: [{ required: true, message: '请选择创建方式', trigger: 'blur' }]
})
const isManual = computed(() => form.createMode === '2')
// 手动分配
const createModeChangeEvent = (val: string) => {
  form.manualIp = val
}
// 点击事件
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
  formEl.validate((valid: boolean) => {
    if (!valid) {
      return
    }
    console.log('submit!')
    emit(EventEnum.success)
  })
}
</script>

<style scoped lang="scss">
.apply-virtual-ip {
  width: 100%;
  .apply-virtual-ip-button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
