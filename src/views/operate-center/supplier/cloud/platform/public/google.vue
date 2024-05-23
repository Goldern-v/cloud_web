<template>
  <div class="google">
    <div class="google__container">
      <div class="flex-row google__tip">
        <svg-icon
          icon="info-warning"
          color="var(--el-color-primary)"
          class="ideal-svg-margin-right"
        ></svg-icon>
        <span
          >请提供阿里云访问密钥Access Key信息来进行验证。Access
          Key由ID和密钥Secret构成。</span
        >
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
        <el-form-item>
          <div class="flex-row ideal-header-container ideal-middle-margin-top" style="width: 100%">
            <el-divider direction="vertical" />
            <div>基本信息</div>
          </div>
        </el-form-item>

        <el-form-item label="云平台名称" prop="name">
          <el-input v-model="form.name" style="width: 20%;"></el-input>
        </el-form-item>

        <el-form-item label="接入方式" prop="accessWay">
          <el-radio-group v-model="form.accessWay">
            <el-radio-button label="1" value="密钥" />
            <el-radio-button label="2" value="密码" />
          </el-radio-group>
        </el-form-item>

        <el-form-item label="访问密钥ID" prop="accessKeyId">
          <el-input v-model="form.accessKeyId" :disabled="isEdit" style="width: 20%;"></el-input>
        </el-form-item>

        <el-form-item label="访问密钥" prop="secretAccessKey">
          <el-input
            v-model="form.secretAccessKey"
            :disabled="isEdit"
            style="width: 20%;"
          ></el-input>
        </el-form-item>

        <el-form-item label="类型">
          <div>公有云</div>
        </el-form-item>

        <el-form-item label="站点" prop="station">
          <el-select v-model="form.station" placeholder="请选择" style="width: 20%;">
            <el-option
              v-for="(item, idx) of stationList"
              :key="idx"
              :label="item.cnName"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <submit-button
      @clickCancel="clickCancel(formRef)"
      @clickSave="clickSave(formRef)"
    >
    </submit-button>
  </div>
</template>

<script setup lang="ts">
/**
 * 创建和详情-基本信息
 */
import submitButton from '../components/submit-button.vue'
import { ElMessage } from 'element-plus/es'
import type { FormRules, FormInstance } from 'element-plus'
import { isEmpty, isUnDef } from '@/utils/is'
import { compareDiffDictionary } from '@/utils/tool'
import { nameRuleThree } from '@/utils/validate'
import {
  cloudPlatformCreate,
  cloudPlatformEdit,
  cloudPlatformDetail
} from '@/api/java/operate-center'

interface GoogleProps {
  cloudCategory?: string
  cloudType?: string
}
const props = withDefaults(defineProps<GoogleProps>(), {
  cloudCategory: '',
  cloudType: ''
})

const formRef = ref<FormInstance>()
const form = reactive({
  name: '',
  accessWay: '', // 接入方式
  accessKeyId: '', // 访问密钥ID
  secretAccessKey: '', // 访问密钥
  station: '' // 站点
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
const rules = reactive<FormRules>({
  name: [{ required: true, validator: checkCloudName, trigger: 'blur' }],
  accessWay: [{ required: true, message: '请选择接入方式', trigger: 'blur' }],
  accessKeyId: [
    { required: true, message: '请输入访问密钥ID', trigger: 'blur' }
  ],
  secretAccessKey: [
    { required: true, message: '请输入访问密钥', trigger: 'blur' }
  ],
  station: [{ required: true, message: '请选择站点', trigger: 'blur' }]
})
// 站点
const stationList: any = ref([])

const route = useRoute()
const id = route.query.id
const isEdit = !isEmpty(id) && !isUnDef(id)

onMounted(() => {
  if (isEdit) {
    initEditData()
  }
})
// 表单深拷贝, 比较表单是否修改
const originDic = ref()
// 编辑数据
const initEditData = () => {
  cloudPlatformDetail({ id }).then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      form.name = data?.name
      form.accessKeyId = data?.secret?.ak
      form.secretAccessKey = data?.secret?.sk

      originDic.value = Object.assign({}, form)
    }
  })
}

const router = useRouter()
const clickCancel = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  router.back()
}

const clickSave = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate(valid => {
    if (valid) {
      if (isEdit) {
        handleEdit()
      } else {
        handleCreate()
      }
    } else {
      console.log('error submit!')
      return false
    }
  })
}
const handleCreate = () => {
  const params = {
    name: form.name, // 云平台名称
    cloudType: props.cloudType, // 云类型 华为云、阿里云
    cloudCategory: props.cloudCategory, // 云类别 私有云、公有云
    accessCredentialType: 1, // 云底层访问类型 0：账号密码、1：密钥
    secret: {
      // 密钥
      ak: form.accessKeyId,
      sk: form.secretAccessKey
    }
  }
  cloudPlatformCreate(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('创建成功')
      router.push({
        // path: '/operate-center/basic-config/cloud-platform-manage/list'
      })
    } else {
      ElMessage.error('创建失败')
    }
  })
}
const handleEdit = () => {
  // 筛选表单修改项, 编辑时只传修改项
  const tempDic = compareDiffDictionary(originDic.value, form)

  const params: { [key: string]: any } = { id }

  const secret: { [key: string]: any } = {}
  for (const key in tempDic) {
    if (key === 'accessKeyId') {
      secret.ak = form.accessKeyId
    } else if (key === 'secretAccessKey') {
      secret.sk = form.secretAccessKey
    } else {
      params[key] = tempDic[key]
    }
  }
  // ak、sk修改则传参
  if (!isEmpty(secret)) {
    params.secret = secret
  }

  cloudPlatformEdit(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('编辑成功')
      router.push({
        // path: '/operate-center/basic-config/cloud-platform-manage/list'
      })
    } else {
      ElMessage.error('编辑失败')
    }
  })
}
</script>

<style scoped lang="scss">
$customInputWidth: 352px;
.google {
  width: 100%;
  .google__container {
    padding: $idealPadding;
    .google__tip {
      background-color: var(--el-color-primary-light-9);
      padding: 20px;
      align-items: center;
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
.google-form--create__tooltip {
  width: 260px;
}
</style>
