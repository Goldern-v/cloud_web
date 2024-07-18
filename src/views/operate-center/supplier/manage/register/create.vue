<template>
  <div class="create">
    <div class="create__container">
      <div class="flex-row create__tip ideal-default-margin-bottom">
        <svg-icon
          icon="info-warning"
          color="var(--el-color-primary)"
          class="ideal-svg-margin-right"
        ></svg-icon>
        <span
          >请提供您底座访问密钥Access Key信息来进行验证。Access
          Key由ID和密钥Secret构成，录入相关信息后可供平台进行纳管。注：需填写主账号的AKSK信息。</span
        >
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
        <el-form-item label="供应商名称" prop="name">
          <el-input
            v-model="form.name"
            class="custom-input"
            placeholder="请输入供应商名称"
          />
        </el-form-item>

        <el-form-item label="供应商类型" prop="supplierType">
          <el-select
            v-model="form.supplierType"
            placeholder="请选择"
            class="custom-input"
            :disabled="isEdit"
          >
            <el-option
              v-for="(item, index) of typeList"
              :key="index"
              :label="item.key"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="注册方式" prop="registerType">
          <el-radio-group
            v-model="form.registerType"
            class="ideal-default-margin-right"
          >
            <el-radio-button
              v-for="(item, index) of registrationList"
              :key="index"
              :label="item.value"
              >{{ item.label }}</el-radio-button
            >
          </el-radio-group>
        </el-form-item>

        <el-form-item
          v-if="form.registerType == 'PASSWORD_REGISTER'"
          label="底层账号"
          prop="username"
        >
          <el-input
            v-model="form.username"
            class="custom-input"
            placeholder="请输入底层账号"
          />
        </el-form-item>

        <el-form-item v-else label="访问密钥ID" prop="ak">
          <el-input
            v-model="form.ak"
            class="custom-input"
            placeholder="请输入访问密钥ID"
          />
        </el-form-item>

        <el-form-item
          v-if="form.registerType == 'PASSWORD_REGISTER'"
          label="账号密码"
          prop="password"
        >
          <el-input
            v-model="form.password"
            show-password
            placeholder="请输入账号密码"
          />
        </el-form-item>

        <el-form-item v-else label="访问密钥" prop="sk">
          <el-input
            v-model="form.sk"
            class="custom-input"
            placeholder="请输入访问密钥"
          />
        </el-form-item>

        <el-form-item label="注册域名" prop="url">
          <el-input
            v-model="form.url"
            class="custom-input"
            placeholder="请输入域名: 如 www.baidu.com"
          />
        </el-form-item>

        <el-form-item v-if="!isEdit" label="" prop="checked">
          <el-checkbox v-model="form.checked" label="" size="large" />
          <div style="font-size: 12px">
            <span>我已阅读并同意</span>
            <el-button
              text
              type="primary"
              style="padding: 0px"
              @click="agreement"
              >《云连接产品合作协议》</el-button
            >
            <span>中的条款和条件</span>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 创建和详情-基本信息
 */
import type { FormRules, FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus/es'
import { nameRuleThree } from '@/utils/validate'
import { compareDiffDictionary } from '@/utils/tool'
import { EventEnum } from '@/utils/enum'
import {
  supplierTypeList,
  supplierRegisterCreate,
  supplierRegisterUpdate
} from '@/api/java/operate-center'

interface CreateProps {
  isEdit?: boolean
  rowData?: any
}
const props = withDefaults(defineProps<CreateProps>(), {
  isEdit: false,
  rowData: () => ({})
})

const { t } = useI18n()

const formRef = ref<FormInstance>()
const form = reactive({
  name: '', // 供应商名称
  supplierType: '', // 供应商类型，
  registerType: 'SECRET_KEY_REGISTER', //注册方式
  ak: '',
  sk: '',
  url: '', //域名
  password: '', //账户密码
  username: '', //底层账号
  checked: []
})

const checkCloudName = (
  rule: any,
  value: any,
  callback: (e?: Error) => any
) => {
  if (!value.length) {
    callback(new Error('请输入云平台名称'))
  }
  nameRuleThree({ maxLength: 20, minLength: 1 }, value, callback)
}

const checkUrl = (rule: any, value: any, callback: (e?: Error) => any) => {
  const cnReg = /^([0-9a-zA-Z-]{1,}\.)+([a-zA-Z]{2,})$/
  if (!cnReg.test(value)) {
    callback(new Error('请输入合法域名'))
  } else {
    callback()
  }
}
const rules = reactive<FormRules>({
  name: [{ required: true, validator: checkCloudName, trigger: 'blur' }],
  supplierType: [
    { required: true, message: '请选择供应商类型', trigger: 'blur' }
  ],
  registerType: [
    { required: true, message: '请选择注册方式', trigger: 'blur' }
  ],
  ak: [{ required: true, message: '请输入访问密钥ID', trigger: 'blur' }],
  sk: [{ required: true, message: '请输入访问密钥', trigger: 'blur' }],
  username: [{ required: true, message: '请输入底层账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入账号密码', trigger: 'blur' }],
  url: [
    { required: true, message: '请输入注册域名', trigger: 'blur' },
    { required: true, validator: checkUrl, trigger: 'blur' }
  ],
  checked: [
    {
      type: 'array',
      required: true,
      message: '请阅读并勾选',
      trigger: 'change'
    }
  ]
})

const typeList = ref<any[]>([])
const registrationList: any = [
  { label: '密钥注册', value: 'SECRET_KEY_REGISTER' },
  { label: '账户密码注册', value: 'PASSWORD_REGISTER' }
]
onMounted(() => {
  getTypeList()
  if (props.isEdit) {
    initEditData()
  }
})
const getTypeList = () => {
  supplierTypeList()
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        typeList.value = data
      } else {
        typeList.value = []
      }
    })
    .catch(_ => {
      typeList.value = []
    })
}

// 表单深拷贝, 比较表单是否修改
const originDic = ref()
// 编辑数据
const initEditData = () => {
  form.name = props.rowData?.name
  form.supplierType = props.rowData?.supplierType
  form.ak = props.rowData?.ak
  form.sk = props.rowData?.sk
  form.username = props.rowData?.username
  form.password = props.rowData?.password
  form.registerType = props.rowData?.registerType
  form.url = props.rowData?.url
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
  emit(EventEnum.cancel)
}
const router = useRouter()

const agreement = () => {
  const url = router.resolve({
    path: '/agreement'
  })
  window.open(url.href)
}

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }

  formEl.validate((valid: boolean) => {
    if (!valid) {
      return
    }
    if (props.isEdit) {
      handleEdit()
    } else {
      handleCreate()
    }
  })
}

const handleCreate = () => {
  const params: any = {
    name: form.name, // 供应商名称
    supplierType: form.supplierType, // 供应商类型
    registerType: form.registerType,
    url: form.url
  }
  if (form.registerType == 'SECRET_KEY_REGISTER') {
    params.ak = form.ak
    params.sk = form.sk
  } else {
    params.username = form.username
    params.password = form.password
  }
  supplierRegisterCreate(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('创建成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error('创建失败')
    }
  })
}

const handleEdit = () => {
  // 筛选表单修改项, 编辑时只传修改项
  const tempDic = compareDiffDictionary(originDic.value, form)

  const params: { [key: string]: any } = { id: props.rowData?.id }
  for (const key in tempDic) {
    params[key] = tempDic[key]
  }
  supplierRegisterUpdate(params).then((res: any) => {
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
$customInputWidth: 352px;
.create {
  width: 100%;
  .create__container {
    padding: $idealPadding;
    .create__tip {
      background-color: var(--el-color-primary-light-9);
      padding: 20px;
      align-items: center;
    }
    .custom-input {
      width: $customInputWidth;
    }
    :deep(.el-input) {
      width: $customInputWidth;
    }
    // 修改分割线颜色
    :deep(.el-divider--vertical) {
      border-left: 2px var(--el-color-primary) solid;
    }
  }
}
</style>
<style lang="scss">
.create-form--create__tooltip {
  width: 260px;
}
</style>
