<template>
  <div class="network-high">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-card>
        <el-form-item label="网络" required>
          <div class="flex-column" style="width: 100%;">
            <div class="flex-row flex-row-start-center" style="width: 100%;">
              <el-form-item prop="vpc" style="width: 15%;">
                <el-select v-model="form.vpc" placeholder="请选择虚拟私有云" class="ideal-default-margin-right">
                  <el-option v-for="item of vpcList" :key="item.uuid" :label="item.name" :value="item.uuid" />
                </el-select>
              </el-form-item>

              <svg-icon 
                icon="refresh-icon"
                class="ideal-svg-margin-right"
                style="cursor: pointer"
                @click="clickRefreshVpc">
              </svg-icon>

              <el-form-item prop="subnet" style="width: 15%;">
                <el-select v-model="form.subnet" placeholder="请选择子网" class="ideal-default-margin-right">
                  <el-option v-for="item of subnetList" :key="item.uuid" :label="item.name" :value="item.uuid" />
                </el-select>
              </el-form-item>

              <svg-icon icon="refresh-icon" style="cursor: pointer" @click="clickRefreshSubnet"></svg-icon>
            </div>

            <div class="ideal-tip-text ideal-large-margin-top">
              如需创建新的虚拟私有云，您可前往<el-button link type="primary" @click="clickCreateVpc">创建链接</el-button>。
            </div>
          </div>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="云服务器名称" prop="cloudHostName">
          <div class="flex-column" style="width: 100%">
            <div class="flex-row">
              <el-input v-model="form.cloudHostName" class="ideal-default-margin-right" style="width: 20%;" />
              <el-checkbox v-model="form.duplication" label="允许重名" />
            </div>
            <div class="flex-row">
              <div class="ideal-tip-text">
                购买多台云服务器时，支持自动增加数字后缀命名或者自定义规则命名。
              </div>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" show-word-limit maxlength="150" style="width: 20%;" />
        </el-form-item>

        <el-form-item label="登录凭证">
          <div class="flex-column">
            <el-radio-group v-model="form.loginCredentials" class="ideal-default-margin-right">
              <el-radio-button v-for="(item, index) of loginCredentialsList" :key="index" :label="item.value">
                {{ item.label }}
              </el-radio-button>
            </el-radio-group>

            <div v-if="form.loginCredentials === '2'" class="ideal-warning-text">
              请妥善保管密钥对的私钥文件，登录、重装和切换云服务器操作系统时，均需要使用该文件。
            </div>
            <div v-if="form.loginCredentials === '3'" class="ideal-error-text">
              您在登录云服务器前，需要先通过重置密码的方式设置密码。
            </div>
          </div>
        </el-form-item>

        <el-form-item v-if="form.loginCredentials === '1'" label="用户名">
          <div>root</div>
        </el-form-item>

        <el-form-item v-if="form.loginCredentials === '1'" label="密码" prop="securityCode">
          <div class="flex-column" style="width: 100%">
            <el-input
              v-model="form.securityCode"
              class="custom-input"
              show-password
              autocomplete="new-password"
              style="width: 20%;" />
            <div>请牢记密码，如忘记密码可登录ECS控制台重置密码。</div>
          </div>
        </el-form-item>

        <el-form-item v-if="form.loginCredentials === '1'" label="确认密码" prop="againSecurityCode">
          <el-input 
            v-model="form.againSecurityCode" 
            class="custom-input" 
            show-password 
            autocomplete="new-password"
            style="width: 20%;" />
        </el-form-item>
      </el-card>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { nameRuleOne, passwordRule } from '@/utils/validate'
import { generateCode } from '@/utils/tool'
import store from '@/store'
import { queryNetworkList } from '@/api/java/compute'

const formRef = ref<FormInstance>() // 校验表单

const checkName = (rule: any, value: any, callback: (e?: Error) => any) => {
  const reg = /(\-)*(\-)\2/g
  if (reg.test(value)) {
    callback(new Error('不能连续输入连字符--'))
  }
  rule.minLength = 2
  rule.maxLength = 15
  nameRuleOne(rule, value, callback)
}

const checkPwd = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!value) {
    callback()
  }
  rule.minLength = 8
  rule.maxLength = 26
  passwordRule(rule, value, callback)
}
const checkAgainPwd = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!value) {
    callback()
  }
  if (form.securityCode !== form.againSecurityCode) {
    callback(new Error('输入密码不一致！'))
  }
  rule.minLength = 8
  rule.maxLength = 26
  passwordRule(rule, value, callback)
}
const rules = reactive<FormRules>({
  vpc: [{ required: false, message: '请选择虚拟私有云', trigger: 'blur' }],
  subnet: [{ required: false, message: '请选择子网', trigger: 'blur' }],
  cloudHostName: [
    { required: false, validator: checkName, trigger: 'blur' }
  ],
  securityCode: [{ required: false, validator: checkPwd, trigger: 'blur' }],
  againSecurityCode: [
    { required: false, validator: checkAgainPwd, trigger: 'blur' }
  ],
})

// 表单
const form = reactive({
  vpc: '', // 虚拟私有云
  vpcInfo: '', // 虚拟私有云(供确认配置界面使用)
  subnet: '', // 子网
  subnetInfo: '', // 子网(供确认配置界面使用)
  cloudHostName: 'ecs-' + generateCode(4), // 云服务器名称
  duplication: false, // 允许重名
  description: '', // 描述
  loginCredentials: '1', // 登录凭证
  loginCredentialsName: '密码', // (供确认配置界面使用)
  securityCode: '', // 密码
  againSecurityCode: '',
})

const loginCredentialsList: any = [{ label: '密码', value: '1' }]

onMounted(() => {
  getNetworkList()
})

const router = useRouter()

const { resourcePool } = storeToRefs(store.resourceStore)

const vpcList = ref<any[]>([])
const subnetList = ref<any[]>([])
// 网络
const getNetworkList = () => {
  const params = {
    region: store.resourceStore.regionCode, // 区域
    regionId: store.resourceStore.regionId, // 区域ID
    projectId: store.resourceStore.projectId, // 项目id
    vdcId: store.userStore.user.vdcId, // vdc的主键值
    resourcePoolId: resourcePool.value.resourcePoolId // 资源池id
  }
  queryNetworkList(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        vpcList.value = data
      } else {
        vpcList.value = []
      }
    })
    .catch(_ => {
      vpcList.value = []
    })
}
// 监听虚拟私有云选择
watch(
  () => form.vpc,
  value => {
    if (value) {
      form.subnet = ''
      subnetList.value = []
      const result = vpcList.value?.find((item: any) => item.uuid === value)
      if (result && result.subnetDtoList.length) {
        form.subnet = result.subnetDtoList[0].uuid
        subnetList.value = result.subnetDtoList
      }
      form.vpcInfo = `${result.name}(${result.cidr})`
    }
  }
)
const clickRefreshVpc = () => {
  form.vpc = ''
  form.subnet = ''
  getNetworkList()
}
watch(
  () => form.subnet,
  value => {
    if (value && subnetList.value) {
      const result = subnetList.value.find((item: any) => item.uuid === value)
      form.subnetInfo = result.name
    }
  }
)
const clickRefreshSubnet = () => {
  form.subnet = ''
}

const clickCreateVpc = () => { }
// 事件
enum EventEnum {
  drawer = 'clickDrawer'
}
interface EventEmits {
  (e: EventEnum.drawer, v: string): void
}
const emit = defineEmits<EventEmits>()

const dic = toRefs(form)
defineExpose({
  formRef,
  dic
})
</script>

<style lang="scss" scoped>
.network-high {
  width: 100%;

  :deep(.el-form) {
    padding: 0;
  }

  .flex-row-start-center {
    justify-content: flex-start;
    align-items: center;
  }

  :deep(.el-card__body) {
    padding: 20px 20px 0;
  }
}
</style>
<style lang="scss">
.custom-tooltip {
  max-width: 260px;
}
</style>
