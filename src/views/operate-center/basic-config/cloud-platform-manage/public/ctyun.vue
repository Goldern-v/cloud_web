<template>
  <div class="ctyun">
    <div class="ctyun__container">
      <div class="flex-row ctyun__tip">
        <svg-icon
          icon="info-warning"
          color="var(--el-color-primary)"
          class="ideal-svg-margin-right"
        ></svg-icon>
        <span
          >请提供天翼云访问密钥ID和访问密钥来访问您的天翼云。请确保您的账号和天翼云已经完成计算，存储，网络等所有相关API的注册和签约</span
        >
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
          <el-input v-model="form.name" class="custom-input"></el-input>
        </el-form-item>

        <el-form-item label="账户ID" prop="accountId">
          <el-input v-model="form.accountId" class="custom-input"></el-input>
        </el-form-item>

        <el-form-item label="用户ID" prop="accountUserId">
          <el-input
            v-model="form.accountUserId"
            class="custom-input"
          ></el-input>
        </el-form-item>

        <el-form-item label="访问密钥ID" prop="accessKeyId">
          <el-input v-model="form.accessKeyId" class="custom-input"></el-input>
        </el-form-item>

        <el-form-item label="访问密钥" prop="secretAccessKey">
          <el-input
            v-model="form.secretAccessKey"
            class="custom-input"
          ></el-input>
        </el-form-item>

        <el-form-item label="只读模式">
          <template #label>
            <div class="flex-row">
              <div style="margin-right: 3px">只读模式</div>
              <el-tooltip
                effect="dark"
                placement="right"
                content="只读模式下，系统不支持创建、修改、删除云账户的资源"
                popper-class="ctyun-form--create__tooltip"
              >
                <svg-icon icon="question-icon"></svg-icon>
              </el-tooltip>
            </div>
          </template>

          <el-switch v-model="form.readOnlyModel" />
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
                popper-class="ctyun-form--create__tooltip"
              >
                <svg-icon icon="question-icon"></svg-icon>
              </el-tooltip>
            </div>
          </template>

          <el-checkbox v-model="form.enable" label="启用云账户监控" />
        </el-form-item>

        <el-form-item>
          <div class="flex-row ideal-header-container" style="width: 100%">
            <el-divider direction="vertical" />
            <div>费用配置</div>
          </div>
        </el-form-item>

        <el-form-item label="账单配置">
          <div>
            <el-radio-group v-model="form.billConfig">
              <el-radio :label="1">启用账单同步</el-radio>
              <el-radio :label="2">启用计费管理</el-radio>
            </el-radio-group>

            <div v-if="form.billConfig === 1" class="ideal-tip-text">
              启用账单同步后可配置账单策略，即通过设置的定时策略，同步云账户费用信息。您可以在费用明细查看云账户一段时间内费用信息。
            </div>
            <div v-else-if="form.billConfig === 2" class="ideal-tip-text">
              启用计费管理，您可以在计费中心-费用类型和定价模型进行配置，创建资源后产生账单。您可以在费用明细查看云账户一段时间内费用。
            </div>
          </div>
        </el-form-item>

        <el-form-item v-if="form.billConfig === 1" label="账单同步重复周期">
          <div class="flex-column" style="width: 60%">
            <el-radio-group v-model="form.billSyncConfig">
              <el-radio :label="0">每天</el-radio>
              <el-radio :label="1">每周</el-radio>
              <el-radio :label="2">每月</el-radio>
            </el-radio-group>

            <el-radio-group
              v-if="showFrequency"
              v-model="form.billSyncConfigValue"
            >
              <el-radio-button
                v-for="(item, index) of timesList"
                :key="index"
                :label="item.value"
                >{{ item.label }}</el-radio-button
              >
            </el-radio-group>
          </div>
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
  accountId: '', // 账户ID
  accountUserId: '', // 用户ID
  accessKeyId: '', // 访问密钥ID
  secretAccessKey: '', // 访问密钥
  readOnlyModel: false, // 只读模式
  enable: false, // 监控配置
  billConfig: 0, // 启用账单同步 0：不计费、1：启用账单同步、2：启用计费管理
  billSyncConfig: 0, // 账单同步重复周期选择 0每天，1每周，2每月
  billSyncConfigValue: '' // 重复周期值
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
  accountId: [{ required: true, message: '请输入账户ID', trigger: 'blur' }],
  accountUserId: [{ required: true, message: '请输入用户ID', trigger: 'blur' }],
  accessKeyId: [
    { required: true, message: '请输入访问密钥ID', trigger: 'blur' }
  ],
  secretAccessKey: [
    { required: true, message: '请输入访问密钥', trigger: 'blur' }
  ]
})

const route = useRoute()
const id = route.query.id
const isEdit = !isEmpty(id) && !isUnDef(id)

onMounted(() => {
  initMonthList()
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
      form.accountId = data?.secret.cloudAccount
      form.accountUserId = data?.secret.cloudUser
      form.accessKeyId = data.secret.ak
      form.secretAccessKey = data.secret.sk
      form.readOnlyModel = !!data.mode
      form.enable = !!data.enableMonitor
      form.billConfig = data.costConfig
      form.billSyncConfig = data.costSyncConfig
    }
  })
}
// 月时间选择
const monthList: any = ref([])
// 初始化月时间
const initMonthList = () => {
  let arr: any = []
  for (let i = 1; i < 32; i++) {
    let obj: { [key: string]: any } = {
      label: `${i}`,
      value: i
    }
    arr.push(obj)
  }
  monthList.value = arr
}
// 周时间选择
const weekList = [
  { label: '日', value: 7 },
  { label: '一', value: 1 },
  { label: '二', value: 2 },
  { label: '三', value: 3 },
  { label: '四', value: 4 },
  { label: '五', value: 5 },
  { label: '六', value: 6 }
]
// 重复周期时间数组
const timesList: any = ref([])
// 显示重复周期时间选择
const showFrequency = ref(false)
watch(
  () => form.billSyncConfig,
  value => {
    if (value === 2) {
      timesList.value = weekList
      showFrequency.value = true
    } else if (value === 1) {
      timesList.value = monthList.value
      showFrequency.value = true
    } else if (value === 0) {
      showFrequency.value = false
    }
  }
)

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
    accessCredentialType: 1, // 云底层访问类型 0：账号密码、1：密钥
    secret: {
      // 密钥
      ak: form.accessKeyId,
      sk: form.secretAccessKey,
      cloudAccount: form.accountId, // 云账户id
      cloudUser: form.accountUserId // 云用户id
    },
    mode: form.readOnlyModel ? 1 : 0, // 模式 0：读写、1：只读
    enableMonitor: form.enable, // 开启监控
    costConfig: form.billConfig,
    costSyncConfig: form.billSyncConfig
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
.ctyun {
  width: 100%;
  .ctyun__container {
    padding: $idealPadding;
    .ctyun__tip {
      background-color: var(--el-color-primary-light-9);
      padding: 20px;
      align-items: center;
    }
    .ctyun__title {
      justify-content: flex-start;
      align-items: center;
      background-color: $gray1-light;
      padding: 10px;
      width: 100%;
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
.ctyun-form--create__tooltip {
  width: 260px;
}
</style>
