<template>
  <div class="confirm-config">
    <ideal-table-list
      :table-data="basicData"
      :table-headers="tableHeaders"
      :show-pagination="false"
    >
      <template #productSpec>
        <el-table-column label="产品规格">
          <template #default="props">
            <div
              v-for="(item, index) in props.row.specification"
              :key="index"
              class="flex-row"
            >
              <div class="confirm-config-product-spec__label">
                {{ item.label }}
              </div>
              <div class="custom-normal-content">
                {{ props.row[item.prop] || '--' }}
              </div>
            </div>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>
  </div>
</template>

<script setup lang="ts">
import { BillingEnum } from '@/utils/enum'

interface basicConfig {
  basicInfo?: any //基础配置信息
  price?: string //价格
}
const props = withDefaults(defineProps<basicConfig>(), {
  basicInfo: () => ({}),
  price: ''
})
const basicData: any = ref([])
const isPackage = computed(
  () => props.basicInfo.basic.billingMode === BillingEnum.PACKAGE
)
watch(
  () => [props.basicInfo, props.price],
  ([value, price]) => {
    const basicInfo = value.basic //基础配置
    const netInfo = value.net //网络配置
    if (value) {
      const elbInfo = {
        productTypeText: '弹性负载均衡',
        specification: elbSpecification,
        billingModeText: isPackage.value ? '包年包月' : '按需计费',
        regionName: basicInfo.regionName,
        name: basicInfo.elbName,
        netType: netInfo.netType,
        vpc: netInfo.vpc,
        instanceType: netInfo.instanceType === 'whole' ? '独享型' : '共享型',
        propertyMode: netInfo.propertyMode ? '已开启' : '已关闭',
        count: 1,
        price: isPackage ? price + '/小时' : '',
        priceTextType: 'danger'
      }
      const bandwidthTypeText: any = {
        bandwidth: '按带宽计费',
        traffic: '按流量计费',
        shareBandwidth: '加入共享带宽'
      }
      const eipInfo = {
        productTypeText: '弹性公网IP',
        specification: [{ label: '弹性公网IP类型', prop: 'eipType' }],
        eipType: netInfo.eipType === '5_bgp' ? '全动态BGP' : '静态BGP',
        bandwidthType: netInfo.bandwidthType,
        count: 1,
        priceTextType: 'danger'
      }
      const bandwidthInfo = {
        productTypeText: '带宽',
        specification: [
          { label: '带宽大小', prop: 'bandwidthSize' },
          { label: '计费方式', prop: 'bandwidthType' }
        ],
        bandwidthSize: netInfo.bandwidthSize,
        bandwidthType: bandwidthTypeText[netInfo.bandwidthType],
        count: 1,
        priceTextType: 'danger'
      }
      basicData.value[0] = elbInfo
      basicData.value[1] = eipInfo
      basicData.value[2] = bandwidthInfo
    }
  },
  { deep: true }
)
onMounted(() => {})

const tableHeaders = [
  { label: '产品类型', prop: 'productTypeText', width: '250' },
  { label: '产品规格', prop: 'productSpec', useSlot: true },
  { label: '计费模式', prop: 'billingModeText' },
  { label: '数量', prop: 'count', width: '100' },
  {
    label: '价格',
    prop: 'price',
    width: '100',
    setTextType: true,
    textTypeProp: 'priceTextType'
  }
]

//弹性负载均衡的规格
const elbSpecification = [
  { label: '名称', prop: 'name' },
  { label: '区域', prop: 'regionName' },
  { label: '网络类型', prop: 'netType' },
  { label: '所属VPC', prop: 'vpc' },
  { label: '实例类型', prop: 'instanceType' },
  { label: '性能保障模式', prop: 'propertyMode' },
  { label: '标签', prop: 'tsg' },
  { label: '描述', prop: 'remark' }
]
</script>

<style scoped lang="scss">
.confirm-config {
  width: 100%;

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
