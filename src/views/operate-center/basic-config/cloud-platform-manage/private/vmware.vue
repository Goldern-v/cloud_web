<template>
  <div class="vmware">
    <div class="vmware__container">
      <div class="flex-row vmware__tip">
        <svg-icon
          icon="info-warning"
          color="var(--el-color-primary)"
          class="ideal-svg-margin-right"
        ></svg-icon>
        <span>请提供VMware ESXi的管理地址，管理员用户名和密码来进行验证。</span>
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
        <el-form-item>
          <div
            class="flex-row ideal-header-container ideal-middle-margin-top"
            style="width: 100%"
          >
            <el-divider direction="vertical" />
            <div>基本信息</div>
          </div>
        </el-form-item>

        <el-form-item label="云平台名称" prop="name">
          <el-input
            v-model="form.name"
            class="custom-input"
            placeholder="请输入名称"
          />
        </el-form-item>

        <el-form-item label="用户名" prop="account">
          <el-input
            v-model="form.account"
            :disabled="isEdit"
            class="custom-input"
            placeholder="请输入用户名"
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            :disabled="isEdit"
            class="custom-input"
            placeholder="请输入密码"
          />
        </el-form-item>

        <el-form-item label="访问地址" prop="accessUrl">
          <el-input
            v-model="form.accessUrl"
            :disabled="isEdit"
            class="custom-input"
            placeholder="请输入访问地址"
          />
        </el-form-item>

        <el-form-item label="端口">
          <el-input
            v-model="form.accessPort"
            class="custom-input"
            placeholder="请输入端口"
          />
        </el-form-item>

        <el-form-item label="只读模式" prop="mode">
          <el-switch v-model="form.mode" />
        </el-form-item>

        <el-form-item label="物理同步极" prop="physicalSync">
          <el-switch v-model="form.physicalSync" />
        </el-form-item>

        <el-form-item>
          <div class="flex-row ideal-header-container" style="width: 100%">
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
                popper-class="vmware-form--create__tooltip"
              >
                <svg-icon icon="question-icon"></svg-icon>
              </el-tooltip>
            </div>
          </template>

          <el-checkbox v-model="form.enableMonitor" label="启用云账户监控" />
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
import { compareDiffDictionary } from '@/utils/tool'
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
  account: '', // 用户
  password: '', // 用户密码
  accessUrl: '', // 访问地址
  accessPort: '', // 端口
  mode: false, // 只读模式
  physicalSync: false, // 物理同步极
  enableMonitor: false // 监控配置
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
  account: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
  password: [{ required: true, message: '请输入用户密码', trigger: 'blur' }],
  accessUrl: [{ required: true, message: '请输入访问地址', trigger: 'blur' }]
})

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
      form.name = data.name
      form.account = data.password.account
      form.password = data.password.password
      form.accessUrl = data.password.accessUrl
      form.accessPort = data.password.accessPort
      form.mode = !!data.mode
      form.enableMonitor = !!data.enableMonitor

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
  formEl.validate((valid: boolean) => {
    if (!valid) {
      return
    }
    if (isEdit) {
      handleEdit()
    } else {
      handleCreate()
    }
  })
}
const handleCreate = () => {
  const params = {
    name: form.name, // 云平台名称
    cloudType: props.cloudType, // 云类型 华为云、阿里云
    cloudCategory: props.cloudCategory, // 云类别 私有云、公有云
    accessCredentialType: 0, // 云底层访问类型 0：账号密码、1：密钥
    password: {
      // 账号密码
      account: form.account, // 云账户
      password: form.password, // 账户密码
      accessUrl: form.accessUrl, // 访问地址
      accessPort: form.accessPort // 访问端口
    },
    mode: form.mode ? 1 : 0,
    enableMonitor: form.enableMonitor // 开启监控
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
  // 筛选表单修改项, 编辑时只传修改项
  const tempDic = compareDiffDictionary(originDic.value, form)

  const params: { [key: string]: any } = { id }

  const password: { [key: string]: any } = {}
  for (const key in tempDic) {
    if (key === 'account') {
      password.account = form.account
    } else if (key === 'password') {
      password.password = form.password
    } else if (key === 'accessUrl') {
      password.accessUrl = form.accessUrl
    } else if (key === 'accessPort') {
      password.accessPort = form.accessPort
    } else {
      params[key] = tempDic[key]
    }
  }
  // password传参只传修改项
  if (!isEmpty(password)) {
    params.secret = password
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
.vmware {
  width: 100%;
  .vmware__container {
    padding: $idealPadding;
    .vmware__tip {
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
.vmware-form--create__tooltip {
  width: 260px;
}
</style>
