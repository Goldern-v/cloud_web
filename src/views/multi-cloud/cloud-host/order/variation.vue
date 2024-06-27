<template>
  <div class="upgrade">
    <div class="upgrade-original">
      <div class="flex-row upgrade__tip">
        <svg-icon
          icon="info-warning"
          color="#F3AD3C"
          class="ideal-svg-margin-right"
        ></svg-icon>
        <span
          >以下云主机将进行变配操作，变配将产生升级订单，请于48小时内支付订单，否则变配操作失败，数据将被清空，请谨慎进行操作升级</span
        >
      </div>

      <ideal-table-list
        row-key="id"
        :table-data="originalData"
        :table-headers="originalHeader"
        :show-pagination="false"
      >
        <template #name>
          <el-table-column label="名称/ID" show-overflow-tooltip>
            <template #default="props">
              <div>{{ props.row.name }}</div>
              <div>{{ props.row.uuid }}</div>
            </template>
          </el-table-column>
        </template>
        <template #status>
          <el-table-column label="状态">
            <template #default="props">
              <ideal-status-icon
                :status-icon="props.row.statusIcon"
                :status-text="props.row.statusText"
              ></ideal-status-icon>
            </template>
          </el-table-column>
        </template>

        <template #spec>
          <el-table-column label="规格">
            <template #default="props">
              <div v-if="props.row.flavor.uuid">
                {{ props.row.flavor.name }}
              </div>
              <div v-if="props.row.flavor.vcpus">
                {{ props.row.flavor.vcpus }}核｜{{ props.row.flavor.ram }}G
              </div>
            </template>
          </el-table-column>
        </template>
      </ideal-table-list>
    </div>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
      class="upgrade-form ideal-middle-margin-top"
    >
      <el-form-item label="CPU架构" prop="cpuArchitecture">
        <el-radio-group
          v-model="form.cpuArchitecture"
          class="ideal-default-margin-right"
        >
          <el-radio-button
            v-for="(item, index) of cpuArchitectureList"
            :key="index"
            :label="item.cpuArchitecture"
          >
            {{ item.cpuArchitectureName }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="分类" required>
        <div class="flex-column" style="width: 100%">
          <div class="flex-row">
            <span class="ideal-default-margin-right">vCPU</span>
            <el-select
              v-model="form.cpu"
              clearable
              placeholder="选择"
              :popper-append-to-body="false"
              class="ideal-default-margin-right"
              style="width: 150px"
            >
              <el-option
                v-for="item of vCPUList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>

            <span class="ideal-default-margin-right">内存</span>
            <el-select
              v-model="form.ram"
              clearable
              placeholder="选择"
              :popper-append-to-body="false"
              class="ideal-default-margin-right"
              style="width: 150px"
            >
              <el-option
                v-for="item of memoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>

            <span class="ideal-default-margin-right">规格名称</span>
            <el-input
              v-model="form.name"
              class="custom-input ideal-default-margin-right"
              style="width: 200px"
              @blur="specNameBlur"
            />
          </div>

          <!-- <div class="flex-row ideal-default-margin-top">
            <el-radio-group v-model="form.specsType" class="ideal-default-margin-right">
              <el-radio-button
                v-for="(item, index) in specsTypeList"
                :key="index"
                :label="item.code"
              >
                {{ item.name }}
              </el-radio-button>
            </el-radio-group>

            <el-tooltip
              popper-class="custom-tooltip"
              effect="dark"
              content="类型"
              placement="right"
            >
              <svg-icon icon="question-icon"></svg-icon>
            </el-tooltip>
          </div>

          <el-radio-group
            v-if="instanceSpecsList?.length"
            v-model="form.instanceSpecs"
            class="ideal-large-margin-top"
          >
            <el-radio-button
              v-for="(item, index) of instanceSpecsList"
              :key="index"
              :label="item"
            >
              {{ item }}
            </el-radio-button>
          </el-radio-group> -->

          <el-form-item prop="spec">
            <ideal-table-list
              :loading="state.dataListLoading"
              :table-data="state.dataList"
              :table-headers="tableHeaders"
              :is-radio="true"
              :show-pagination="false"
              max-height="285"
              :custom-assign="selectSpecs"
              @clickTableCellRow="clickTableCellRow"
            >
            </ideal-table-list>

            <div class="ideal-warning-text">{{ checkInfo }}</div>
          </el-form-item>
        </div>
      </el-form-item>
    </el-form>

    <div class="flex-row footer-button">
      <div style="font-weight: bolder; color: #000">
        配置费用: <span class="footer-button-price">{{ price }}元</span>
      </div>
      <div class="flex-row">
        <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
        <el-button type="primary" @click="submitForm(formRef)">{{
          t('confirm')
        }}</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum, resourceTypeEnum, BillingEnum } from '@/utils/enum'
import type { FormRules, FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useVariation } from './variation'
import { vCPUList, memoryList } from '../components/common'
import { queryInquiry } from '@/api/java/public'
import {
  queryCloudHostDetail,
  specListUrl,
  cloudHostVariation,
  submitCloudHostOrder,
  validateFlavor
} from '@/api/java/compute'
import { querySpecTypeList } from '@/api/java/operate-center'

const { t } = useI18n()
interface UpgradeProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<UpgradeProps>(), {
  rowData: () => ({})
})
// 表单
const formRef = ref<FormInstance>()
const form = reactive({
  specsType: '',
  spec: null as any,
  cpuArchitecture: '',
  instanceSpecs: '',
  cpu: '',
  ram: '',
  name: ''
})
const rules = reactive<FormRules>({
  spec: [{ required: true, message: '请选择规格', trigger: 'blur' }]
})

// 原有规格数据
const originalData = ref<any[]>([])
const selectSpecs = ref('') //回显原规格
onMounted(() => {
  originalData.value = [props.rowData]
  form.cpu = props.rowData.flavor?.vcpus
  form.ram = props.rowData.flavor?.ram
  selectSpecs.value = props.rowData?.flavor?.id
  form.spec = props.rowData?.flavor
  // queryDetailData()
})

//变配参数
const { commonParams, detailData } = useVariation(props.rowData, form)
watch(
  () => detailData.value,
  value => {
    if (value) {
      const cloudPlatformId = value.cloudPlatform?.id
      getSpecType({ cloudPlatformId })
      getInquiry()
    }
  }
)

const originalHeader: IdealTableColumnHeaders[] = [
  { label: '名称/ID', prop: 'name', useSlot: true },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '镜像', prop: 'image.osVersion' },
  { label: '规格', prop: 'spec', useSlot: true },
  { label: '创建时间', prop: 'createTime.date' }
]
// 变配列表
const state: IHooksOptions = reactive({
  dataListUrl: specListUrl,
  isPage: false,
  createdIsNeed: false,
  queryForm: {
    resourcePoolId: props?.rowData?.pool?.id,
    projectId: props?.rowData?.project?.id,
    availableZone: props?.rowData?.availableZone,
    cpuArchitecture: toRef(form, 'cpuArchitecture'), // cpu架构
    specsType: toRef(form, 'specsType'), // 规格类型
    vcpus: toRef(form, 'cpu'), // cpu核数
    ram: toRef(form, 'ram'), // 内存大小
    name: toRef(form, 'name') //规格名称
  }
})
const { getDataList } = useCrud(state)
// 变配表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '实例类型', prop: 'specsTypeName' },
  { label: '规格名称', prop: 'name' },
  { label: 'vCPUs', prop: 'vcpus' },
  { label: '内存', prop: 'ram' },
  { label: 'CPU', prop: 'cpuName' }
]

// 规格名称输入框失去焦点后再触发搜索
const specNameBlur = () => {
  getDataList()
}

const cpuArchitectureList: any = ref([]) // CPU架构
const specsTypeList: any = ref([]) // 规格类型
const instanceSpecsList: any = ref([]) // 规格实例类型
//查询云主机规格数据
const getSpecType = (cloudPlatformId: any) => {
  querySpecTypeList(cloudPlatformId)
    .then((res: any) => {
      const { data, code } = res
      if (code === 200) {
        cpuArchitectureList.value = data
        if (data.length) {
          form.cpuArchitecture = data[0].cpuArchitecture
          specsTypeList.value = data[0].specsType
          instanceSpecsList.value = data[0].specsType[0].instanceSpecsClan
        }
      } else {
        cpuArchitectureList.value = []
        specsTypeList.value = []
      }
    })
    .catch(_ => {
      cpuArchitectureList.value = []
      specsTypeList.value = []
    })
}

// 监听架构选择
watch(
  () => form.cpuArchitecture,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      const result = cpuArchitectureList.value?.find(
        (item: any) => item.cpuArchitecture === newValue
      )
      specsTypeList.value = result?.specsType
      instanceSpecsList.value = result?.specsType[0].instanceSpecsClan
      // cpu架构重选后清空规格选择结果
      form.specsType = ''
      form.instanceSpecs = ''
    }
  }
)

watch(
  () => [
    form.cpuArchitecture,
    form.specsType,
    form.instanceSpecs,
    form.cpu,
    form.ram
  ],
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      const isSame = newValue.every(
        (row: any, index: number) => row === oldValue[index]
      )
      if (!isSame && newValue[0]) {
        getDataList()
      }
    }
  }
)
//校验规格是否可用
const checkInfo = ref('')
const getValidateFlavor = (row: any) => {
  const params = {
    id: row?.id,
    instanceId: props.rowData.id
  }
  validateFlavor(params).then((res: any) => {
    const { data, code } = res
    if (code === 200) {
      checkInfo.value = data.notAvailableReason
    } else {
      checkInfo.value = ''
    }
  })
}
const clickTableCellRow = (row: any) => {
  form.spec = row
  getInquiry()
  if (
    props.rowData?.pool.cloudCategory === 'PUBLIC' &&
    props.rowData?.pool.cloudType === 'ALI_CLOUD'
  ) {
    getValidateFlavor(row)
  }
}
//询价参数
const inquiryParams = () => {
  const params: { [key: string]: any } = {
    cloudPlatformId: detailData?.value.cloudAccount?.id, // 云平台类型id
    resourceType: resourceTypeEnum.ECS, // 云资源类型
    billType: props.rowData.billType, // 计费模式
    itemsList: [
      {
        code: detailData?.value.systemVolume?.volumeType, //系统盘类型
        specs: detailData?.value.systemVolume?.size // 系统盘大小
      },
      {
        code: 'ram', // 实例内存
        specs: form.spec?.ram
      },
      {
        code: 'vcpus', // 实例规格 核数
        specs: form.spec?.vcpus
      }
    ], // 计费项列表
    orderType: 'VARIATION', // 订单类别 SUBSCRIBE订购、RENEW续订、VARIATION变配、UNSUBSCRIBE退订
    resourceId: props.rowData.billResourceId //计费项标识id
  }
  return params
}
const price = ref(0)
// 询价
const getInquiry = () => {
  const params = {
    ...inquiryParams()
  }
  queryInquiry(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        price.value = data.finalPrices
      } else {
        price.value = 0
      }
    })
    .catch(_ => {
      price.value = 0
    })
}
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

// 提交变配
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate((valid: boolean) => {
    if (valid) {
      const params = {
        ...commonParams()
      }
      cloudHostVariation(params).then((res: any) => {
        const { data, code } = res
        if (code === 200) {
          ElMessage.success(data.msg || '生成变配订单成功,请等待审批')
          emit(EventEnum.success)
        } else {
          ElMessage.error(data.msg || '生成变配订单失败')
        }
      })
    }
  })
}
// 提交订单
const submitOrder = (orderId: string) => {
  const params: { [key: string]: any } = {
    billType: props?.rowData?.billingMode
      ? BillingEnum.PACKAGE
      : BillingEnum.ON_DEMAND,
    cloudPlatformId: props?.rowData?.cloudAccountId,
    itemsList: [
      {
        code: 'ram', // 实例内存
        specs: form.spec.ram
      },
      {
        code: 'vcpus', // 实例规格 核数
        specs: form.spec.vcpus
      }
    ],
    orderType: 'VARIATION',
    orderId,
    projectId: props?.rowData?.projectId,
    resourcePoolId: props?.rowData?.resourcePoolId,
    resourceType: 'ECS',
    resourceId: props?.rowData?.billResourceId,
    vdcId: props?.rowData?.vdcId,
    name: props?.rowData?.name
  }
  if (props?.rowData?.billingMode) {
    params.billCycle = props?.rowData?.billingUnit
    params.cycleNum = props?.rowData?.billingUnitValue
  }
  submitCloudHostOrder(params).then((res: any) => {
    const { data, code } = res
    if (code === 200) {
      ElMessage.success('升级成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error(data.msg || '升级失败')
    }
  })
}
</script>

<style scoped lang="scss">
.upgrade {
  width: 100%;
  .upgrade-original {
    .upgrade__tip {
      background-color: #fefbed;
      padding: 20px;
      align-items: center;
    }
  }
  .upgrade-form {
    :deep(.el-table) {
      height: 187px;
    }
  }
  .footer-button {
    justify-content: space-between;
    align-items: center;
    .footer-button-price {
      color: var(--el-color-primary);
    }
  }
}
</style>
