<template>
  <div class="add-vpc">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="虚拟私有云(VPC)" prop="vpc">
        <el-select v-model="form.vpc">
          <el-option
            v-for="(item, index) of vpcList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <svg-icon
          icon="refresh-icon"
          class="ideal-svg-margin-right ideal-svg-margin-left"
          style="cursor: pointer"
          @click="clickRefresh"
        />
        <el-button link type="primary" @click="clickCreateVpc"
          >新建VPC</el-button
        >
      </el-form-item>

      <el-form-item label="权限组" prop="permission">
        <el-select v-model="form.permission">
          <el-option
            v-for="(item, index) of permissions"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
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

const formRef = ref<FormInstance>() // 校验表单
const form = reactive({
  vpc: '', // 虚拟私有云
  permission: '' // 权限组
})
const rules = reactive<FormRules>({
  vpc: [{ required: true, message: '请选择虚拟私有云', trigger: 'blur' }],
  permission: [{ required: true, message: '请选择权限组', trigger: 'blur' }]
})

const vpcList = ref<any[]>([])
const permissions = ref<any[]>([])

const clickRefresh = () => {}
const clickCreateVpc = () => {}

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
    emit(EventEnum.success)
  })
}
</script>

<style scoped lang="scss">
.add-vpc {
  width: 100%;
}
</style>
