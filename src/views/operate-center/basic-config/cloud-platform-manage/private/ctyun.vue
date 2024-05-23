<template>
  <div class="openstack">
    <div class="openstack__container">
      <div class="flex-row openstack__tip">
        <svg-icon icon="info-warning" color="var(--el-color-primary)" class="ideal-svg-margin-right"></svg-icon>
        <span
          >为了管理天翼云账户内的资源，需要您提供API访问地址、管理员用户名和密码等信息来访问您的天翼云。</span
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
          <el-input v-model="form.name" class="custom-input" placeholder="请输入名称"/>
        </el-form-item>

        <el-form-item label="用户" prop="userName">
          <el-input v-model="form.userName" class="custom-input" placeholder="请输入用户"/>
        </el-form-item>

        <el-form-item label="用户密码" prop="password">
          <el-input v-model="form.password" class="custom-input" placeholder="请输入用户密码"/>
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" class="custom-input" placeholder="请确认密码"/>
        </el-form-item>

        <el-form-item label="资源池URL" prop="resourcePoolUrl">
          <el-input v-model="form.resourcePoolUrl" class="custom-input" placeholder="请输入资源池URL"/>
        </el-form-item>

        <el-form-item label="资源池地址" prop="resourcePoolAddress">
          <el-input v-model="form.resourcePoolAddress" class="custom-input" placeholder="请输入资源池地址"/>
        </el-form-item>        

        <el-form-item label="只读模式" prop="readOnlyModel">
          <el-switch v-model="form.readOnlyModel" />
        </el-form-item>

        <el-form-item>
          <div class="flex-row ideal-header-container" style="width: 100%;">
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
                popper-class="openstack-form--create__tooltip"
              >
                <svg-icon icon="question-icon"></svg-icon>
              </el-tooltip>
            </div>
          </template>

          <el-checkbox v-model="form.enable" label="启用云账户监控" />
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
  userName: '', // 用户
  password: '', // 用户密码
  confirmPassword: '', // 确认密码
  resourcePoolUrl: '', // 资源池URL
  resourcePoolAddress: '', // 资源池地址
  readOnlyModel: false, // 只读模式
  enable: false // 监控配置
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
  userName: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
  password: [{ required: true, message: '请输入用户密码', trigger: 'blur' }],
  confirmPassword: [{ required: true, message: '请输入确认密码', trigger: 'blur' }],
  resourcePoolUrl: [{ required: true, message: '请输入资源池URL', trigger: 'blur' }],
  readOnlyModel: [{ required: true, message: '请选择只读模式', trigger: 'blur' }],
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
      form.userName = data.password.account
      form.password = data.password.password
      form.confirmPassword = data.password.password
      form.resourcePoolUrl = data.password.accessUrl
      form.resourcePoolAddress = data.password.accessPort
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
      account: form.userName, // 云账户
      password: form.password, // 账户密码
      accessUrl: form.resourcePoolUrl, // 访问地址
      accessPort: form.resourcePoolAddress // 访问端口
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
.openstack {
  width: 100%;
  .openstack__container {
    padding: $idealPadding;
    .openstack__tip {
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
.openstack-form--create__tooltip {
  width: 260px;
}
</style>
