<template>
  <div class="subnet-create">
    <el-form
      ref="createFormRef"
      :model="createForm"
      :rules="rules"
      label-position="left"
    >
      <ideal-region-project
        ref="regionProject"
        :detail-info="detailInfo"
        class="custom-form-item"
        @selectRegion="selectRegion"
        @selectProject="selectProject"
      ></ideal-region-project>

      <el-form-item label="虚拟私有云" prop="vpc">
        <div class="flex-column custom-form-item">
          <div class="flex-row">
            <el-select
              v-model="createForm.vpc"
              placeholder="请选择"
              class="custom-form-item ideal-default-margin-right"
              :disabled="vpcDetailSwitch"
              @change="selectVpc"
            >
              <el-option
                v-for="(item, idx) of state.vpcList"
                :key="idx"
                :label="item.name"
                :value="item.uuid"
              >
              </el-option>
            </el-select>
            <svg-icon icon="refresh-icon"></svg-icon>
          </div>

          <div class="ideal-tip-text">IPv4网段：{{ state.vpcInfo?.cidr }}</div>
          <div class="ideal-tip-text">
            已创建子网：{{ state.vpcInfo?.subnetDtoList?.length }}
          </div>
        </div>
      </el-form-item>

      <el-form-item label="可用区" prop="availableZone">
        <el-radio-group
          v-model="createForm.availableZone"
          class="ideal-default-margin-right"
        >
          <el-radio-button
            v-for="(item, index) of state.availableZoneList"
            :key="index"
            :label="item.code"
          >
            {{ item.name }}
          </el-radio-button>
        </el-radio-group>

        <el-tooltip
          popper-class="custom-tooltip"
          effect="dark"
          content="可用区"
          placement="right"
        >
          <svg-icon icon="question-icon"></svg-icon>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="名称" prop="name">
        <el-input
          v-model="createForm.name"
          clearable
          class="custom-form-item"
        />
      </el-form-item>

      <el-form-item label="子网IPV4网段" prop="ipv4Gateway">
        <div class="flex-column custom-form-item">
          <ideal-ip-input
            :ip-value="createForm.ipv4Gateway"
            port-split="/"
            :select-cidr="createForm.ipv4Gateway"
            :port-options="state.portOptions"
            @listenChange="ipv4GatewayChangeEvent"
          ></ideal-ip-input>

          <div class="ideal-tip-text">可用IP数：251</div>
          <div class="ideal-warning-text">子网创建完成后，子网网段无法修改</div>
        </div>
      </el-form-item>

      <el-form-item label="子网IPv6网段">
        <el-checkbox
          v-model="createForm.openIpv6"
          label="开启IPv6"
          class="ideal-default-margin-right"
        />
        <el-tooltip effect="dark" content="开启IPv6" placement="right">
          <svg-icon icon="question-icon"></svg-icon>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="关联路由表" prop="subnetType">
        <div class="ideal-default-margin-right">默认</div>
        <el-tooltip effect="dark" content="关联路由表" placement="right">
          <svg-icon icon="question-icon"></svg-icon>
        </el-tooltip>
      </el-form-item>

      <el-divider border-style="dashed" />

      <el-form-item>
        <template #label>
          <div
            class="flex-row subnet-create-high-config"
            @click="state.isHigh = !state.isHigh"
          >
            <div style="color: black">高级配置</div>
            <svg-icon
              :icon="state.isHigh ? 'up-arrow' : 'down-arrow'"
              class="ideal-svg-margin-left"
            ></svg-icon>
          </div>
        </template>

        <div>网关 | DNS服务器地址 | 描述</div>
      </el-form-item>

      <template v-if="state.isHigh">
        <el-form-item label="网关" prop="gateway">
          <ideal-ip-input
            :ip-value="createForm.gateway"
            :select-cidr="createForm.gateway"
            @listenChange="gatewayChangeEvent"
          ></ideal-ip-input>
        </el-form-item>

        <el-form-item label="DNS服务器地址" prop="dnsServer">
          <div class="flex-column custom-form-item">
            <div class="flex-row">
              <el-input v-model="createForm.dnsServer" clearable />
              <el-button link>重置</el-button>
              <svg-icon icon="question-icon"></svg-icon>
            </div>

            <div class="ideal-tip-text">
              DNS服务器地址最多支持2个IP，请以英文逗号隔开。
            </div>
          </div>
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input
            v-model="createForm.description"
            type="textarea"
            placeholder="请输入内容"
            show-word-limit
            maxlength="150"
          />
        </el-form-item>
      </template>
    </el-form>

    <div class="flex-row subnet-create-button">
      <el-button type="info" @click="cancelForm(createFormRef)">{{
        t('cancel')
      }}</el-button>
      <el-button type="primary" @click="submitForm(createFormRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { nameRuleOne } from '@/utils/validate'
import { EventEnum } from '@/utils/enum'
import { queryVpcList, subnetCreate } from '@/api/java/network'
import { showLoading, hideLoading, generateCode } from '@/utils/tool'
import { ElMessage } from 'element-plus/es'
import store from '@/store'

interface subnetProps {
  detailInfo?: any
}

const props = withDefaults(defineProps<subnetProps>(), {
  detailInfo: () => ({})
})

const { t } = useI18n()
const createFormRef = ref<FormInstance>()
const createForm = reactive({
  regionId: '', //区域id
  projectId: '', //项目id
  cloudProjectId: '', //底层项目id
  vdcId: '',
  vpc: '', // 虚拟私有云
  vpcId: '',
  availableZone: '', // 可用区
  name: 'subnet-' + generateCode(4),
  ipv4Gateway: '0.0.0.0', // ipv4网段
  openIpv6: false, // 开启ipv6
  gateway: '0.0.0.0', // 网关
  dnsServer: '', // DNS服务器地址
  description: '',
  regionName: '',
  resourcePoolId: '' // 资源池id
})

// ipv4网段
const ipv4GatewayChangeEvent = (val: string) => {
  createForm.ipv4Gateway = val
}
// 网关
const gatewayChangeEvent = (val: string) => {
  createForm.gateway = val
}

const checkName = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!value.length) {
    callback(new Error('请输入名称'))
  }
  nameRuleOne({ maxLength: 20, minLength: 1 }, value, callback)
}
const rules = reactive<FormRules>({
  vpc: [{ required: true, message: '请选择虚拟私有云', trigger: 'blur' }],
  availableZone: [{ required: true, message: '请选择可用区', trigger: 'blur' }],
  name: [{ required: true, validator: checkName, trigger: 'blur' }],
  ipv4Gateway: [
    { required: true, message: '请输入子网IPv4网段', trigger: 'blur' }
  ]
})

const state = reactive({
  regionList: [] as any[], // 区域
  projectList: [] as any[], // 项目
  vpcList: [] as any[], //vpc
  vpcInfo: {} as any, //所选vpc详情
  portOptions: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 29],
  isHigh: false, // 是否开启高级配置
  availableZoneList: [] as any[] // 可用区列表
})

const vpcDetailSwitch = computed(() => Object.keys(props.detailInfo).length > 0) //是否vpc详情页新建子网

const { resourcePool } = store.resourceStore
onMounted(() => {
  if (vpcDetailSwitch.value) {
    createForm.resourcePoolId = props.detailInfo?.resourcePoolId
    createForm.vdcId = props.detailInfo?.vdcId
  } else {
    createForm.resourcePoolId = resourcePool.resourcePoolId
    createForm.vdcId = resourcePool.vdcId
  }
})

const selectRegion = (regionInfo: any) => {
  createForm.regionId = regionInfo?.id
  state.availableZoneList = regionInfo?.availableZones
  if (regionInfo.availableZones?.length) {
    createForm.availableZone = regionInfo.availableZones[0].code
  }
}

const projectData: any = ref() //项目信息
const selectProject = (projectInfo: any) => {
  projectData.value = projectInfo
  createForm.projectId = projectInfo.id
  createForm.cloudProjectId = projectInfo.cloudProjectId
}

watch(
  () => [createForm.regionId, createForm.projectId],
  ([region, project]) => {
    if (region && project) {
      queryVpc()
    }
  }
)
/**
 * 查询
 */

// 查询vpc
const queryVpc = () => {
  if (
    !createForm.regionId ||
    !createForm.resourcePoolId ||
    !createForm.projectId ||
    !createForm.vdcId
  ) {
    return
  }
  const params = {
    resourcePoolId: createForm.resourcePoolId,
    regionId: createForm.regionId,
    projectId: createForm.projectId,
    vdcId: createForm.vdcId
  }
  queryVpcList(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        state.vpcList = data
        if (vpcDetailSwitch.value) {
          createForm.vpc = props.detailInfo.uuid
          state.vpcInfo = props.detailInfo
        } else {
          createForm.vpc = data[0].uuid
          state.vpcInfo = data[0]
        }
      } else {
        state.vpcList = []
      }
    })
    .catch(_ => {
      state.vpcList = []
    })
}

const selectVpc = (val: any) => {
  state.vpcInfo = state.vpcList.find((item: any) => item.uuid === val)
}

watch(
  () => state.vpcInfo,
  val => {
    if (val?.cidr) {
      const cidr = val?.cidr.split('.')
      createForm.ipv4Gateway = `${cidr[0]}.${cidr[1]}.1.${
        cidr[3].split('/')[0]
      }/24`
      createForm.gateway = `${cidr[0]}.${cidr[1]}.1.1`
    }
  },
  { deep: true }
)

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
}
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  const flag = await checkForm(regionProject.value.formRef) //校验区域项目
  formEl.validate(valid => {
    if (valid && flag) {
      const commonParams = {
        regionId: createForm.regionId,
        projectId: createForm.projectId,
        resourcePoolId: createForm.resourcePoolId
      }
      let params = {
        name: createForm.name,
        cidr: createForm.ipv4Gateway,
        gatewayIp: createForm.gateway,
        vpcUuid: createForm.vpc,
        vpcId: state.vpcInfo?.id,
        description: createForm.description,
        availableZone: createForm.availableZone,
        vdcId: createForm.vdcId, // vdc的主键值,
        ...commonParams
      }
      showLoading('创建中...')
      subnetCreate(params)
        .then((res: any) => {
          const { code, data } = res
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
.subnet-create {
  width: 100%;
  :deep .el-form-item--default .el-form-item__label {
    width: 120px;
  }
  .subnet-create-button {
    justify-content: flex-end;
    align-items: center;
  }
  .subnet-create-high-config {
    cursor: pointer;
  }
  .custom-form-item {
    flex: 1;
  }
  .subnet-create-dhcp {
    width: 32%;
  }
}
</style>
