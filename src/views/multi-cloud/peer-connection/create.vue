<template>
  <div class="peer-connection--create">
    <div class="flex-row peer-connection__warning-tip">
      <svg-icon icon="info-warning" color="var(--el-color-primary)" class="ideal-svg-margin-right"></svg-icon>
      <div>
        <div>对等连接用于连通同一个区域内的VPC，您可以在相同帐户下或不同帐户下的VPC之间创建对等连接:</div>
        <div>创建相同帐户下的对等连接</div>
        <div>创建不同帐户下的对等连接</div>
        <div>如果您要连通不同区域的VPC，请使用云连接服务。</div>
      </div>
    </div>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
    >
      <el-form-item label="对等连接名称" prop="name">
        <el-input v-model="form.name" class="peer-connection-input"/>
      </el-form-item>

      <el-form-item>
        <div class="flex-row ideal-header-container" style="width: 100%;">
          <el-divider direction="vertical" />
          <div>选择本端VPC</div>
        </div>
      </el-form-item>

      <el-form-item label="本端VPC" prop="localVPC">
        <el-select v-model="form.localVPC" placeholder="请选择" class="peer-connection-input">
          <el-option
            v-for="(item, idx) of localVPCList"
            :key="idx"
            :label="item.otherName"
            :value="item.otherId"
          >
            {{ item.otherName }}
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="本端VPC网段" prop="localVPCNetwork">
        <div>{{ form.localVPCNetwork }}</div>
      </el-form-item>

      <el-form-item>
        <div class="flex-row ideal-header-container" style="width: 100%;">
          <el-divider direction="vertical" />
          <div>选择对端VPC</div>
        </div>
      </el-form-item>

      <el-form-item label="账户" prop="account">
        <el-radio-group
          v-model="form.account"
        >
          <el-radio-button
            v-for="(item, index) in accountList"
            :key="index"
            :label="item.label"
          >
          {{ item.value }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="对端项目" prop="oppositeProject">
        <div class="flex-column" style="width: 100%;">
          <el-select v-model="form.oppositeProject" placeholder="请选择" class="peer-connection-input">
            <el-option
              v-for="(item, idx) of oppositeProjectList"
              :key="idx"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <div class="ideal-tip-text">当您选择“当前帐户”时，此处默认填充对应的项目。</div>
        </div>
      </el-form-item>

      <el-form-item label="对端VPC" prop="oppositeVPC">
        <el-select v-model="form.oppositeVPC" placeholder="请选择" class="peer-connection-input">
          <el-option
            v-for="(item, idx) of oppositeVPCList"
            :key="idx"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="对端VPC网段">
        <div>{{ form.oppositeVPCNetwork }}</div>
      </el-form-item>

      <el-form-item label="描述">
        <el-input v-model="form.description" class="peer-connection-input"/>
      </el-form-item>
    </el-form>

    <div class="flex-row peer-connection--button">
      <el-button type="info" @click="cancelForm(formRef)"
        >{{ t('cancel') }}</el-button
      >
      <el-button type="primary" @click="submitForm(formRef)"
        >{{ t('confirm') }}</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { nameRuleTwo } from '@/utils/validate'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()
const formRef = ref<FormInstance>()
const form = reactive({
  name: '', // 对等连接名称
  localVPC: '', // 本端VPC
  localVPCNetwork: '192.168.0.0/16', // 本端VPC网段
  account: '', // 账户
  oppositeProject: '', // 对端项目
  oppositeVPC: '', // 对象VPC
  oppositeVPCNetwork: '--', // 对端VPC网段
  description: '',
})
const localVPCList = ref<any>([])
const accountList = ref<any>([
  { label: 'current', value: '当前账户' },
  { label: 'other', value: '其他账户' }
])
const oppositeProjectList = ref<any>([])
const oppositeVPCList = ref<any>([])

const checkVpcId = (rule: any, value: any, callback: (e?: Error) => any) => {
  setTimeout(() => {
    if (form.localVPC === form.oppositeVPC) {
      return callback(new Error('对等连接两段VPC不能相同'))
    } else {
      callback()
    }
  }, 1000)
}
const checkName = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!value.length) {
    callback(new Error('请输入对等连接名称'))
  } 
  nameRuleTwo({ maxLength: 63, minLength: 1 }, value, callback)
}
const rules = reactive<FormRules>({
  name: [{ required: true, validator: checkName, trigger: 'blur' }],
  localVPC: [{ required: true, validator: checkVpcId, trigger: 'blur' }],
  localVPCNetwork: [{ required: true, message: '请输入本端VPC网段', trigger: 'blur'}],
  account: [{ required: true, message: '请选择账户', trigger: 'blur'}],
  oppositeProject: [{ required: true, message: '请选择对端项目', trigger: 'blur'}],
  oppositeVPC: [{ required: true, validator: checkVpcId, trigger: 'blur' }]
})
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
  formEl.validate((valid: any) => {
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
.peer-connection--create {
  width: 100%;
  :deep(.el-form) {
    padding: 0;
  }
  .peer-connection__warning-tip {
    background-color: var(--custom-information-bg-color);
    padding: 20px;
    margin-bottom: 20px;
  }
  .peer-connection--button {
    justify-content: flex-end;
    align-items: center;
  }
  .vpc-create-button {
    color: var(--el-color-primary);
  }
  .peer-connection__tip {
    background-color: $gray1-light;
    padding: 10px;
    align-items: center;
    width: 100%;
  }
  .peer-connection-input {
    width: 70%;
  }
}
</style>
