<template>
  <div class="safe-group--create">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <ideal-region-project
        ref="regionProject"
        class="region-input"
        @selectRegion="selectRegion"
        @selectProject="selectProject"
      ></ideal-region-project>

      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" class="custom-input" />
      </el-form-item>

      <template v-if="isPublicHuawei">
        <el-form-item label="模版" prop="model" required>
          <el-select
            v-model="form.model"
            placeholder="请选择"
            class="custom-input"
          >
            <el-option
              v-for="(item, idx) of modelList"
              :key="idx"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="form.model === 'QADD_PORT'" label="入方向规则">
          <div class="flex-column">
            <el-checkbox
              v-model="allRemoteLogin"
              :indeterminate="loginIndeterminate"
              @change="checkRemoteLogin"
              >远程登录和ping:</el-checkbox
            >
            <el-checkbox-group v-model="customRule.checkedRemoteLogin">
              <el-checkbox
                v-for="city in remoteLogins"
                :key="city"
                :label="city"
                >{{ city }}</el-checkbox
              >
            </el-checkbox-group>

            <el-checkbox
              v-model="allWebServer"
              :indeterminate="webIndeterminate"
              @change="checkWebServer"
              >Web服务:</el-checkbox
            >
            <el-checkbox-group v-model="customRule.checkedWebServer">
              <el-checkbox
                v-for="city in allWebServers"
                :key="city"
                :label="city"
                >{{ city }}</el-checkbox
              >
            </el-checkbox-group>

            <el-checkbox
              v-model="allDataBase"
              :indeterminate="dataBaseIndeterminate"
              @change="checkDataBase"
              >数据库:</el-checkbox
            >
            <el-checkbox-group v-model="customRule.checkedDataBase">
              <el-checkbox
                v-for="city in allDataBases"
                :key="city"
                :label="city"
                >{{ city }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
        </el-form-item>
      </template>

      <el-form-item v-if="isAliyun || isCtyun" label="虚拟私有云" prop="vpc">
        <el-select v-model="form.vpc" placeholder="请选择" class="custom-input">
          <el-option
            v-for="(item, idx) of vpcList"
            :key="idx"
            :label="item.name"
            :value="item.uuid"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          clearable
          :autosize="{ minRows: 4, maxRows: 6 }"
          :placeholder="placeholderText"
          maxlength="255"
          show-word-limit
          class="custom-input"
        />
      </el-form-item>
    </el-form>

    <template v-if="isPublicHuawei">
      <el-button link type="primary" @click="clickModelRule">
        {{ modelRuleText }}
        <svg-icon
          :icon="showModelRule ? 'up-arrow' : 'down-arrow'"
          class="ideal-svg-margin-left"
        />
      </el-button>

      <model-rule
        v-if="showModelRule"
        ref="modelRuleRef"
        :rule-template="form.model"
        :security-group-name="form.name"
        :custom-rule="customRule"
        :form-data="form"
      />
    </template>

    <div class="flex-row safe-group--button ideal-default-margin-top">
      <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import modelRule from '../components/model-rule.vue'
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum } from '@/utils/enum'
import store from '@/store'
import { showLoading, hideLoading } from '@/utils/tool'
import { ElMessage } from 'element-plus/es'
import { safeGroupCreate } from '@/api/java/network'
import { useResourcePool } from '@/utils/common/resource'
import { queryVpcList } from '@/api/java/network'

const { isPublicHuawei, isAliyun, isCtyun } = useResourcePool()

const { t } = useI18n()

/**
 * 表单
 */
const formRef = ref<FormInstance>()
const form = reactive({
  regionId: '', //区域id
  projectId: '', //项目id
  name: 'Sys-' + Math.random().toString(36).substring(7),
  model: 'ALL PORT', // 模版
  description: '',
  vpc: ''
})

const placeholderText = ref('')
onMounted(() => {
  form.model = 'ALL PORT'
  if (isPublicHuawei.value) {
    placeholderText.value =
      '通用Web服务器，默认放通22、3389、80、443端口和ICMP协议。适用于需要远程登录、公网ping及用于网站服务的云服务器场景。'
  } else {
    placeholderText.value = ''
  }
})

const selectRegion = (regionInfo: any) => {
  form.regionId = regionInfo.id
}
const selectProject = (projectInfo: any) => {
  form.projectId = projectInfo.id
}

watch(
  () => [form.regionId, form.projectId],
  (newVal, oldVal) => {
    if (newVal[0] && newVal[1] && (isAliyun.value || isCtyun.value)) {
      queryVpc()
    }
  }
)

const modelList = [
  { label: '通用Web服务器', value: 'ALL PORT' },
  { label: '开放全部端口', value: 'UN PORT' },
  { label: '自定义', value: 'QADD_PORT' }
]

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
})
const modelRuleText = ref('隐藏模版规则')
const showModelRule = ref(true)
const clickModelRule = () => {
  showModelRule.value = !showModelRule.value
  modelRuleText.value = showModelRule.value ? '隐藏模版规则' : '显示模版规则'
}

const { resourcePool } = storeToRefs(store.resourceStore)

/**
 * 自定义模版规则
 */
const customRule = reactive({
  checkedRemoteLogin: [], //远程登录的ping选中项
  checkedWebServer: [], //Web服务选中项
  checkedDataBase: [] //数据库选中项
})
/**
 * 远程登录的ping
 */
const remoteLogins: any = [
  'SSH(22)',
  'RDP(3389)',
  'FTP(2021)',
  'Telnet(23)',
  'ICMP(全部)'
]

const checkRemoteLogin = (val: boolean) => {
  customRule.checkedRemoteLogin = val ? remoteLogins : []
}
//远程登录的ping是否全选
const allRemoteLogin = computed(() => {
  return customRule.checkedRemoteLogin.length === remoteLogins.length
})
//远程登录的ping全选 checkbox 的不确定状态
const loginIndeterminate = computed(() => {
  return 0 < customRule.checkedRemoteLogin.length < remoteLogins.length
})
/**
 * Web服务
 */
const allWebServers: any = ['HTTP(80)', 'HTTPS(443)', 'HTTP_ALT(8080)']
const checkWebServer = (val: boolean) => {
  customRule.checkedWebServer = val ? allWebServers : []
}
// Web服务全选 checkbox 的不确定状态
const webIndeterminate = computed(() => {
  return 0 < customRule.checkedWebServer.length < remoteLogins.length
})
//Web服务是否全选
const allWebServer = computed(() => {
  return customRule.checkedWebServer.length === remoteLogins.length
})
/**
 * 数据库
 */
const allDataBases: any = [
  'MySQL(3306)',
  'My SQL(1433)',
  'PostgreSQL(5432)',
  'Oracle(1521)',
  'Redis(6379)'
]
const checkDataBase = (val: boolean) => {
  customRule.checkedDataBase = val ? allDataBases : []
}
// 数据库全选 checkbox 的不确定状态
const dataBaseIndeterminate = computed(() => {
  return 0 < customRule.checkedDataBase.length < remoteLogins.length
})
//数据库是否全选
const allDataBase = computed(() => {
  return customRule.checkedDataBase.length === remoteLogins.length
})

const commonParams = () => {
  const params = {
    resourcePoolId: resourcePool.value?.resourcePoolId, //资源池id
    regionId: form.regionId,
    projectId: form.projectId,
    vdcId: store.userStore.user.vdcId
  }
  return params
}

//查询vpc信息
const vpcList: any = ref([])
const queryVpc = () => {
  const params = {
    ...commonParams()
  }
  queryVpcList(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        vpcList.value = data
        form.vpc = data[0].uuid
      } else {
        vpcList.value = []
      }
    })
    .catch(_ => {
      vpcList.value = []
    })
}
/**
 * 确定/取消
 */
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

const modelRuleRef = ref()
const regionProject = ref() //区域项目选择框组件
// 校验表单
const checkForm = async (formEl: FormInstance | undefined) => {
  let flag = false
  if (!formEl) {
    flag = false
  } else {
    await formEl.validate(valid => {
      flag = valid
    })
    return flag
  }
  return flag
}
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  const flag = await checkForm(regionProject.value.formRef) //校验区域项目
  formEl.validate(valid => {
    if (valid && flag) {
      const params: { [key: string]: any } = {
        name: form.name,
        description: form.description,
        ...commonParams()
      }
      //华为公有云存在模版规则
      if (isPublicHuawei.value) {
        let templateRuleList: any = []
        if (form.model === 'QADD_PORT') {
          templateRuleList = modelRuleRef.value.entryRules
            .concat(modelRuleRef.value.exitRules)
            .filter((item: any) => item.inboundRules !== '0')
        } else {
          templateRuleList = modelRuleRef.value.allRuleList
        }
        const rules = toRaw(templateRuleList).map((item: any) => {
          if (item.multiport) {
            return {
              direction: item.direction,
              protocol: item.protocol,
              description: item.description,
              action: item.action,
              priority: item.priority,
              multiport: item.multiport,
              source_address_type: item.sourceAddressType,
              remote_ip_prefix: item.remoteIpPrefix,
              remote_group_id: item.remoteGroupId,
              remote_address_group_id: item.remoteAddressGroupId,
              ethertype: item.ethertype
            }
          } else {
            return {
              direction: item.direction,
              protocol: item.protocol,
              description: item.description,
              action: item.action,
              priority: item.priority,
              source_address_type: item.sourceAddressType,
              remote_ip_prefix: item.remoteIpPrefix,
              remote_group_id: item.remoteGroupId,
              remote_address_group_id: item.remoteAddressGroupId,
              ethertype: item.ethertype
            }
          }
        })
        params.rules = rules
      }
      if (isAliyun.value || isCtyun.value) {
        params.vpcId = form.vpc
      }
      showLoading('创建中...')
      safeGroupCreate(params)
        .then((res: any) => {
          const { code } = res
          if (code === 200) {
            ElMessage.success('创建成功')
            emit(EventEnum.success)
          } else {
            ElMessage.error('创建失败')
          }
          hideLoading()
        })
        .catch(_ => {
          hideLoading()
        })
    } else {
      console.log('error submit!')
      return false
    }
  })
}
</script>

<style scoped lang="scss">
.safe-group--create {
  width: 100%;
  :deep(.el-form-item--default .el-form-item__label) {
    width: 90px;
  }
  .safe-group--button {
    justify-content: flex-end;
    align-items: center;
  }
  .custom-input {
    width: 70%;
  }
  :deep .region-input {
    .el-select {
      width: 70%;
    }
  }
  :deep .el-textarea__inner {
    font-size: $defaultFontSize;
  }
}
</style>
