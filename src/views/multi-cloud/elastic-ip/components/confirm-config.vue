<template>
  <div class="confirm-config">
    <ideal-table-list
      class="create-confirm-table"
      :table-data="basicData"
      :table-headers="tableHeaders"
      :show-pagination="false"
    >
      <template #productSpec>
        <el-table-column label="产品规格">
          <template #default="props">
            <div
              v-for="(item, index) in eipSpecification"
              :key="index"
              class="flex-row"
            >
              <div class="confirm-config-product-spec__label">
                {{ item.label }}
              </div>
              <div v-if="item.prop === 'tag'" class="custom-normal-content">
                <p v-for="(ele, idx) in props.row.tagNames" :key="idx">
                  {{ ele }}
                </p>
              </div>
              <div v-else>
                {{ props.row[item.prop] }}
              </div>
            </div>
          </template>
        </el-table-column>
      </template>

      <template #price>
        <el-table-column label="价格" width="150">
          <template #default="props">
            <div class="ideal-error-text">{{ props.row.price }}</div>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>
  </div>
</template>

<script setup lang="ts">
import { BillingEnum } from '@/utils/enum'
import { useResourcePool } from '@/utils/common/resource'
import type { IdealTextProp } from '@/types'

const { isPrivateHuawei, isPublic } = useResourcePool()

interface basicConfig {
  basicInfo?: any //基础配置信息
  price?: number //价格
}
const props = withDefaults(defineProps<basicConfig>(), {
  basicInfo: () => ({}),
  price: 0
})
const basicData: any = ref([])
const isPackage = computed(
  () => props.basicInfo.billingMode === BillingEnum.PACKAGE
)
watch(
  () => [props.basicInfo, props.price],
  ([value, price]) => {
    if (value) {
      value.productTypeText = '弹性公网IP'
      value.count = 1
      value.eipType = value.line === '5_bgp' ? '全动态BGP' : '静态BGP'
      value.billingModeText = isPackage.value ? '包年包月' : '按需计费'
      value.ipv6Enable = value.openIpv6 ? '启用' : '停用'
      basicData.value[0] = value
      basicData.value[0].price = `${price.toFixed(2)}元${
        isPackage.value ? '' : '/小时'
      } `
    }
  },
  { deep: true }
)

//弹性Ip的规格
const eipSpecification = ref<IdealTextProp[]>([])
onMounted(() => {
  if (isPublic.value) {
    eipSpecification.value = publicSpe
  } else if (isPrivateHuawei.value) {
    eipSpecification.value = privateSpe
  }
})

const tableHeaders = [
  { label: '产品类型', prop: 'productTypeText', width: '250' },
  { label: '产品规格', prop: 'productSpec', useSlot: true },
  { label: '计费模式', prop: 'billingModeText' },
  { label: '数量', prop: 'count', width: '150' },
  { label: '价格', prop: 'price', useSlot: true }
]

const publicSpe = [
  { label: '名称', prop: 'eipName' },
  { label: '区域', prop: 'regionName' },
  { label: '类型', prop: 'eipType' },
  { label: 'IPv6转换', prop: 'ipv6Enable' },
  { label: '标签', prop: 'tag' },
  { label: '带宽名称', prop: 'bandwidthName' },
  { label: '带宽大小', prop: 'bandwidthSize' }
]
const privateSpe = [
  { label: '名称', prop: 'eipName' },
  { label: '区域', prop: 'regionName' },
  { label: '标签', prop: 'tag' },
  { label: '外部网络', prop: 'externalNetwork' }
]
</script>

<style scoped lang="scss">
.confirm-config {
  width: 100%;
  .create-confirm-table {
    padding: 20px;
  }
  .confirm-config-product-spec__label {
    color: $textColorSecondary;
    width: 160px;
    text-align: left;
  }
  .custom-normal-content {
    color: $textColorPrimary;
  }
  :deep(.el-table__row) {
    color: $textColorPrimary;
    font-size: $defaultFontSize;
  }
}
</style>
