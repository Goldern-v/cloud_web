<template>
  <div class="remove-eip">
    <div class="remove-eip-tip">
      <div class="flex-row">
        <svg-icon icon="info-warning" color="var(--el-color-primary)" class="ideal-default-margin-right"></svg-icon>
        <div>
          <div>弹性公网IP移出共享带宽后，分配按带宽计费带宽，默认带宽大小5Mbit/s，您可以自定义带宽上限。</div>
        </div>
      </div>
    </div>

    <div class="flex-row remove-eip-info">
      <div>共享带宽：</div>
      <div>
        <div>{{ rowData.name }}</div>
      </div>
    </div>

    <div>弹性公网IP</div>

    <ideal-table-list
      :table-data="tableArray"
      :table-headers="tableHeaders"
      :show-pagination="false"
    >
      <template #status>
        <el-table-column label="状态">
          <template #default="props">
            <ideal-status-icon
              v-if="props.row.status"
              :status-icon="props.row.statusType"
              :status-text="props.row.status"
            />
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <div class="remove-eip-spec">EIP移出后规格</div>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="计费模式">
        <el-radio-group v-model="form.billingMode">
            <el-radio-button
              v-for="(item, index) of billingModeList"
              :key="index"
              :label="item.label"
            >
              {{ item.value }}
            </el-radio-button>
          </el-radio-group>
      </el-form-item>
      <el-form-item label="带宽大小(Mbit/s)">
        <el-input-number
          v-model="form.bandwidthSize"
          class="ideal-default-margin-right"
          :min="1"
          :max="2000"
        />
        <div class="ideal-warning-text">带宽范围：1-2,000 Mbit/s</div>
      </el-form-item>
      <el-form-item label="公网带宽费用">
        <div class="ideal-error-text">¥0.315</div>
        <div>/小时</div>
      </el-form-item>
    </el-form>

    <div class="flex-row remove-eip-button">
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EventEnum, BillingEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders } from '@/types'
import type { FormRules, FormInstance } from 'element-plus'

const { t } = useI18n()
interface AddEipProp {
  rowData?: any
}
const props = withDefaults(defineProps<AddEipProp>(), {
  rowData: () => ({})
})
const formRef = ref<FormInstance>()
const form = reactive({
  billingMode: BillingEnum.ON_DEMAND, // 计费模式
  bandwidthSize: 1, // 带宽大小
  line: '', // 线路
})
const rules = reactive<FormRules>({})
const billingModeList = [
  { label: BillingEnum.PACKAGE, value: '包年包月' },
  { label: BillingEnum.ON_DEMAND, value: '按需收费' }
]

onMounted(() => {
  tableArray.value = [props.rowData]
})
// 列表
const tableArray = ref<any[]>([])
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '弹性公网IP', prop: 'name' },
  { label: 'IPv6地址', prop: 'ip' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '类型', prop: 'type' },
  { label: '已绑定实例', prop: 'bound' }
]
// 方法
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const cancelForm = () => {
  emit(EventEnum.cancel)
}

const submitForm = () => {
  emit(EventEnum.success)
}
</script>

<style scoped lang="scss">
.remove-eip {
  width: 100%;
  .remove-eip-tip {
    background-color: var(--el-color-primary-light-9);
    padding: 20px;
    border-radius: $circleRadiusSize;
    border: 1px solid var(--el-color-primary);
  }
  .remove-eip-info {
    margin: 10px 0;
  }
  .remove-eip-spec {
    font-size: 16px;
    font-weight: 500;
    margin-top: 20px;
  }
  .remove-eip-button {
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;
  }
}
</style>
