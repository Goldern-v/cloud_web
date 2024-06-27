<template>
  <div class="huawei-cloud">
    <div class="huawei-cloud__container">
      <div class="flex-row huawei-cloud__tip">
        <svg-icon
          icon="info-warning"
          color="var(--el-color-primary)"
          class="ideal-svg-margin-right"
        ></svg-icon>
        <span
          >为了管理华为云平台内的资源，需要您提供华为云访问密钥ID、访问密钥和华为云地址来访问您的华为云。</span
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

        <el-form-item label="访问密钥ID" prop="accessKeyId">
          <el-input
            v-model="form.accessKeyId"
            :disabled="isEdit"
            class="custom-input"
          ></el-input>
        </el-form-item>

        <el-form-item label="访问密钥" prop="secretAccessKey">
          <el-input
            v-model="form.secretAccessKey"
            :disabled="isEdit"
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
                popper-class="huawei-cloud-form--create__tooltip"
              >
                <svg-icon icon="question-icon"></svg-icon>
              </el-tooltip>
            </div>
          </template>

          <el-switch v-model="form.mode" />
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
                popper-class="huawei-cloud-form--create__tooltip"
              >
                <svg-icon icon="question-icon"></svg-icon>
              </el-tooltip>
            </div>
          </template>

          <el-checkbox v-model="form.enableMonitor" label="启用云账户监控" />
        </el-form-item>

        <el-form-item>
          <div class="flex-row ideal-header-container" style="width: 100%">
            <el-divider direction="vertical" />
            <div>费用配置</div>
          </div>
        </el-form-item>

        <el-form-item label="账单配置">
          <div>
            <el-radio-group v-model="form.billConfig" :disabled="isEdit">
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
import type { FormRules, FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus/es'
import { nameRuleThree } from '@/utils/validate'
import { compareDiffDictionary } from '@/utils/tool'
import { isEmpty, isUnDef } from '@/utils/is'
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
  accessKeyId: '',
  secretAccessKey: '',
  mode: false,
  enableMonitor: false, // 监控配置
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
      form.mode = !!data?.mode
      form.enableMonitor = !!data?.enableMonitor
      form.billConfig = data?.costConfig
      form.billSyncConfig = data?.costSyncConfig

      originDic.value = Object.assign({}, form)
    }
  })
}
// 月时间选择
const monthList: any = ref([])
// 初始化月时间
const initMonthList = () => {
  const arr: any = []
  for (let i = 1; i < 32; i++) {
    const obj: { [key: string]: any } = {
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
    if (value === 1) {
      timesList.value = weekList
      showFrequency.value = true
    } else if (value === 2) {
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
      sk: form.secretAccessKey
    },
    mode: form.mode ? 1 : 0, // 模式 0：读写、1：只读
    enableMonitor: form.enableMonitor, // 开启监控
    costConfig: form.billConfig, // 0：不计费、1：启用账单同步、2：启用计费管理
    costSyncConfig: form.billSyncConfig // 0每天，1每周，2每月
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
.huawei-cloud {
  width: 100%;
  .huawei-cloud__container {
    padding: $idealPadding;
    .huawei-cloud__tip {
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
.huawei-cloud-form--create__tooltip {
  width: 260px;
}
</style>
