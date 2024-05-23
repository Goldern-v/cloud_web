<template>
  <div class="create-confirm">
    <ideal-table-list
      class="create-confirm-table"
      :table-data="tableArray"
      :table-headers="tableHeaders"
      :show-pagination="false">
      <template #productSpec>
        <el-table-column label="产品规格">
          <template #default="props">
            <div v-for="(item, index) of labelArray" :key="index" class="flex-row">
              <div>{{ item.label }}：</div>
              <div>{{ props.row[item.prop] }}</div>
            </div>
          </template>
        </el-table-column>
      </template>

      <template #price>
        <el-table-column label="价格">
          <template #default="props">
            <div class="ideal-error-text">{{ props.row.price }}</div>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>
  </div>
</template>

<script setup lang="ts">
import type { IdealTableColumnHeaders } from '@/types'
import { BillingEnum } from '@/utils/enum'

interface ConfirmProps {
  data?: any
}
const props = withDefaults(defineProps<ConfirmProps>(), {
  data: () => ({})
})
const tableArray = ref<any[]>([])

onMounted(() => {
  let dic = {
    productType: '共享带宽',
    billing: props.data.billingMode === BillingEnum.ON_DEMAND ? '按需计费' : '包年包月',
    number: 1,
    chargeType: props.data.chargeMode === '1' ? '按带宽计费' : '',
    size: `${props.data.bandwidthSize}Mbit/s`,
    price: '0.233',

    ...props.data
  }
  tableArray.value = [dic]
})

// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '产品类型', prop: 'productType' },
  { label: '产品规格', prop: 'productSpec', useSlot: true },
  { label: '计费模式', prop: 'billing' },
  { label: '数量', prop: 'number' },
  { label: '价格', prop: 'price', useSlot: true }
]
const labelArray = [
  { label: '区域', prop: 'region' },
  { label: '带宽名称', prop: 'name' },
  { label: '计费方式', prop: 'chargeType' },
  { label: '带宽大小', prop: 'size' }
]
</script>

<style scoped lang="scss">
.create-confirm {
  width: 100%;
  .create-confirm-table {
    padding: 20px;
  }
}
</style>