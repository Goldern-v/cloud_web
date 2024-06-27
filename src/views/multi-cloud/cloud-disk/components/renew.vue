<template>
  <div class="renew">
    <div class="renew-original">
      <div class="flex-row renew__tip">
        <svg-icon
          icon="info-warning"
          color="#F3AD3C"
          class="ideal-svg-margin-right"
        ></svg-icon>
        <span>以下云硬盘将进行续订操作</span>
      </div>

      <ideal-table-list
        :table-data="originalData"
        :table-headers="originalHeader"
        :show-pagination="false"
      >
        <template #name>
          <el-table-column label="名称/ID" show-overflow-tooltip>
            <template #default="props">
              <div>{{ props.row.name }}</div>
              <div>{{ props.row.id }}</div>
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
      </ideal-table-list>
    </div>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
      class="renew-form"
    >
      <el-form-item label="购买时长" prop="buyTime">
        <el-slider
          v-model="form.buyTime"
          :marks="buyTimeMarks"
          :max="14"
          :min="1"
        />
      </el-form-item>
    </el-form>

    <div class="flex-row footer-button">
      <div>
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
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum } from '@/utils/enum'
import { ElMessage } from 'element-plus'
import type { FormRules, FormInstance } from 'element-plus'
import { approvalProcess } from '@/utils/tool'
import { queryInquiry } from '@/api/java/public'
import { cloudDiskRenew } from '@/api/java/store'

const { t } = useI18n()
interface RenewProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<RenewProps>(), {
  rowData: () => ({})
})
// 原有规格数据
const originalData = ref<any[]>([])
onMounted(() => {
  originalData.value = [props.rowData]
  getInquiry()
})
const originalHeader: IdealTableColumnHeaders[] = [
  { label: '名称/ID', prop: 'name', useSlot: true },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '创建时间', prop: 'createTime.date' }
]

const formRef = ref<FormInstance>()
const form = reactive({
  buyTime: 1
})
const rules = reactive<FormRules>({
  buyTime: [{ required: true, message: '请选择购买时长', trigger: 'blur' }]
})
const buyTimeMarks: { [key: number]: string } = {
  1: '1个月',
  2: '2个月',
  3: '3个月',
  4: '4个月',
  5: '5个月',
  6: '6个月',
  7: '7个月',
  8: '8个月',
  9: '9个月',
  10: '10个月',
  11: '11个月',
  12: '1年',
  13: '2年',
  14: '3年'
}
watch(
  () => form.buyTime,
  value => {
    if (value) {
      getInquiry()
    }
  }
)
const price = ref(0)
// 询价
const getInquiry = () => {
  let params: { [key: string]: any } = {
    cloudPlatformId: props.rowData?.cloudResourcePool?.cloudPlatform?.id, // 云平台类型id
    resourceId: props.rowData?.billResourceId,
    resourceType: 'EBS', // 云资源类型
    billType: props.rowData?.billType, // 计费模式
    itemsList: [
      {
        code: 'basic_price',
        specs: '1'
      },
      {
        code: props.rowData?.volumeType,
        specs: props.rowData?.size // 系统盘大小
      }
    ], // 计费项列表
    orderType: 'RENEW' // 订单类别 SUBSCRIBE订购、RENEW续订、VARIATION变配、UNSUBSCRIBE退订
  }

  params.billCycle = 'MONTH'
  params.cycleNum = form.buyTime
  if (form.buyTime > 11) {
    params.billCycle = 'YEAR'
    params.cycleNum = form.buyTime - 11
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

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate((valid: boolean) => {
    if (!valid) {
      return
    }
    handleRenew()
  })
}
const handleRenew = () => {
  const params: { [key: string]: any } = {
    resourceType: 'EBS', // 资源类型
    instanceResourceId: props.rowData?.uuid, // 云硬盘uuid
    instanceResourceName: props.rowData?.name, // 云硬盘名称
    volumeType: props.rowData?.volumeType, // 云硬盘类型
    size: props.rowData?.size, // 云硬盘大小
    type: 'RENEW', // 操作类型
    billType: 'PACKAGE', // 计费类型
    resourcePoolId: props.rowData?.resourcePoolId,
    poolTypeUuid: props.rowData?.cloudResourcePool?.cloudType,
    regionId: props.rowData?.regionId,
    projectId: props.rowData?.projectId,
    vdcId: props.rowData?.vdcId,
    cloudPlatformId: props.rowData?.cloudResourcePool?.cloudPlatform?.id
  }

  // 超过一年
  if (form.buyTime > 11) {
    params.billCycle = 'YEAR' // 包周期类型
    params.billCycleNum = form.buyTime - 11 // 包周期时长
  } else {
    params.billCycle = 'MONTH'
    params.billCycleNum = form.buyTime
  }
  cloudDiskRenew(params).then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      approvalProcess('EBSRENEW', props.rowData?.vdcId, data).then(
        (result: any) => {
          if (result.code === 200) {
            emit(EventEnum.success)
          }
        }
      )
    } else {
      ElMessage.error('续订失败')
    }
  })
}
</script>

<style scoped lang="scss">
.renew {
  width: 100%;
  .renew-original {
    padding: 0 17px;
    .renew__tip {
      background-color: #fefbed;
      padding: 20px;
      align-items: center;
    }
  }
  .renew-form {
    :deep(.el-table) {
      height: 200px;
    }
  }
  .footer-button {
    justify-content: space-between;
    align-items: center;
    margin-top: 30px;
    .footer-button-price {
      color: var(--el-color-primary);
    }
  }
}
</style>
