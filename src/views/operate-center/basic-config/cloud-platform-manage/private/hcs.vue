<template>
  <div class="hcs">
    <div class="hcs__container">
      <div class="flex-row hcs__tip">
        <svg-icon icon="info-warning" color="var(--el-color-primary)" class="ideal-svg-margin-right"></svg-icon>
        <span
          >为了管理华为云Stack云平台内的资源，需要您提供API访问地址、管理员用户名和密码等信息来访问您的华为云Stack。</span
        >
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
        <el-form-item>
          <div class="flex-row ideal-header-container ideal-middle-margin-top" style="width: 100%;">
            <el-divider direction="vertical" />
            <div>基本信息</div>
          </div>
        </el-form-item>

        <el-form-item label="云平台名称" prop="name">
          <el-input v-model="form.name" class="custom-input" />
        </el-form-item>

        <el-form-item label="版本号" prop="version">
          <el-radio-group v-model="form.version">
            <el-radio label="1">6.5</el-radio>
            <el-radio label="2">8.0</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="租户" prop="tenant">
          <el-input v-model="form.tenant" class="custom-input" />
        </el-form-item>

        <el-form-item label="只读模式">
          <el-switch v-model="form.readOnlyModel" />
        </el-form-item>

        <el-form-item>
          <div class="flex-row ideal-header-container" style="width: 100%;">
            <el-divider direction="vertical" />
            <div>运营侧服务配置</div>
          </div>
        </el-form-item>

        <el-form-item label="身份认证服务地址(IAM)" prop="iam">
          <el-input v-model="form.iam" placeholder="请输入身份认证服务地址" class="custom-input" />
        </el-form-item>

        <el-form-item label="运营管理服务地址(ManageOne运营面)" prop="operationService">
          <el-input v-model="form.operationService" placeholder="请输入运营管理服务地址" class="custom-input" />
        </el-form-item>

        <el-form-item label="弹性云服务器地址(ECS)" prop="ecs">
          <el-input v-model="form.ecs" placeholder="请输入弹性云服务器地址" class="custom-input" />
        </el-form-item>

        <el-form-item>
          <div class="flex-row ideal-header-container ideal-middle-margin-top" style="width: 100%;">
            <el-divider direction="vertical" />
            <div>认证信息</div>
          </div>
        </el-form-item>

        <el-form-item label="VDC管理员" prop="vdcManager">
          <el-input v-model="form.vdcManager" placeholder="请输入VDC管理员" class="custom-input" />
        </el-form-item>

        <el-form-item label="VDC管理员密码" prop="vdcManagerPwd">
          <el-input v-model="form.vdcManagerPwd" placeholder="请输入VDC管理员密码" class="custom-input" />
        </el-form-item>

        <el-form-item>
          <div class="flex-row ideal-header-container ideal-middle-margin-top" style="width: 100%;">
            <el-divider direction="vertical" />
            <div>监控配置</div>
          </div>
        </el-form-item>

        <el-form-item label="监控配置">
          <template #label>
            <div class="flex-row">
              <div style="margin-right: 3px">监控配置</div>
              <el-tooltip
                effect="dark"
                placement="right"
                content="云账户监控是指通过云账户API获取云资源的监控数据，支持ECS（请在虚拟机模板中选择监控方式）、SLB、OSS、Redis、RDS等监控。
启用后会调用云账户API，可能会触发云账户的API限流机制，并需要为超出免费次数限制的API调用支付额外的费用。"
                popper-class="hcs-form--create__tooltip"
              >
                <svg-icon icon="question-icon"></svg-icon>
              </el-tooltip>
            </div>
          </template>

          <el-checkbox v-model="form.enable" label="启用云账户监控" />
        </el-form-item>

        <el-form-item label="运维侧管理服务地址(ManageOne运维面)" prop="opsServer">
          <el-input v-model="form.opsServer" placeholder="请输入运维侧管理服务地址" class="custom-input" />
        </el-form-item>

        <el-form-item label="运维侧管理员" prop="ops">
          <el-input v-model="form.ops" placeholder="请输入运维侧管理员" class="custom-input" />
        </el-form-item>

        <el-form-item label="运维侧管理员密码" prop="opsPwd">
          <el-input v-model="form.opsPwd" placeholder="请输入运维侧管理员密码" class="custom-input" />
        </el-form-item>
      </el-form>
    </div>

    <save-button
      @clickCancel="clickCancel(formRef)"
      @clickSave="clickSave(formRef)"
    >
    </save-button>
  </div>
</template>

<script setup lang="ts">
/**
 * 创建和详情-基本信息
 */
import saveButton from '../components/save-button.vue'
import { ElMessage } from 'element-plus/es'
import type { FormRules, FormInstance } from 'element-plus'
import { isEmpty, isUnDef } from '@/utils/is'
import { nameRuleThree } from '@/utils/validate'
import {
  cloudPlatformCreate,
  cloudPlatformEdit,
  cloudPlatformDetail
} from '@/api/java/operate-center'

interface CloudProps {
  cloudCategory?: string
  cloudType?: string
}
const props = withDefaults(defineProps<CloudProps>(), {
  cloudCategory: '',
  cloudType: ''
})

const formRef = ref<FormInstance>()
const form = reactive({
  name: '',
  version: '', // 版本号
  tenant: '', // 租户
  readOnlyModel: false, // 只读模式
  iam: '', // 身份认证服务地址(IAM)
  operationService: '', // 运营管理服务地址
  ecs: '', // 弹性云服务器地址(ECS)
  vdcManager: '', // VDC管理员
  vdcManagerPwd: '', // VDC管理员密码
  enable: false, // 监控配置
  opsServer: '', // 运维侧管理服务地址(ManageOne运维面)
  ops: '', // 运维侧管理员
  opsPwd: '' // 运维侧管理员密码
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
  version: [{ required: true, message: '请选择版本号', trigger: 'blur' }],
  tenant: [{ required: true, message: '请输入租户', trigger: 'blur' }],
  iam: [{ required: true, message: '请输入身份认证服务地址(IAM)', trigger: 'blur' }],
  operationService: [{ required: true, message: '请输入运营管理服务地址', trigger: 'blur' }],
  ecs: [{ required: true, message: '请输入弹性云服务器地址(ECS)', trigger: 'blur' }],
  vdcManager: [{ required: true, message: '请输入VDC管理员', trigger: 'blur' }],
  vdcManagerPwd: [{ required: true, message: '请输入VDC管理员密码', trigger: 'blur' }],
  opsServer: [{ required: true, message: '请输入运维侧管理服务地址(ManageOne运维面)', trigger: 'blur' }],
  ops: [{ required: true, message: '请输入运维侧管理员', trigger: 'blur' }],
  opsPwd: [{ required: true, message: '请输入运维侧管理员密码', trigger: 'blur' }]
})

const route = useRoute()
const id = route.query.id
const isEdit = !isEmpty(id) && !isUnDef(id)
onMounted(() => {
  if (isEdit) {
    initEditData()
  }
})
// 编辑数据
const initEditData = () => {
  cloudPlatformDetail({ id }).then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      form.name = data.name
      // form.accessKeyId = data.secret.ak
      // form.secretAccessKey = data.secret.sk
      form.readOnlyModel = !!data.mode
      form.enable = !!data.enableMonitor
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
    accessCredentialType: 0, // 云底层访问类型 0：账号密码、1：密钥
    password: { // 账号密码
      // account: form.userName, // 云账户
      // password: form.password, // 账户密码
      // accessUrl: form.resourcePoolUrl, // 访问地址
      // accessPort: form.resourcePoolAddress // 访问端口
    },
    mode: form.readOnlyModel ? 1 : 0
  }
  cloudPlatformCreate(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('创建成功')
      router.push({
        path: '/operate-center/basic-config/cloud-platform-manage/list'
      })
    } else {
      ElMessage.error('创建失败')
    }
  })
}
const handleEdit = () => {
  const params = {
    name: form.name, // 云平台名称
    id
  }
  cloudPlatformEdit(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('编辑成功')
      router.push({
        path: '/operate-center/basic-config/cloud-platform-manage/list'
      })
    } else {
      ElMessage.error('编辑失败')
    }
  })
}
</script>

<style scoped lang="scss">
$customInputWidth: 352px;
.hcs {
  width: 100%;
  :deep(.el-form-item--default .el-form-item__label) {
    width: 130px;
  }
  .hcs__container {
    padding: $idealPadding;
    .hcs__tip {
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
.hcs-form--create__tooltip {
  width: 260px;
}
</style>
