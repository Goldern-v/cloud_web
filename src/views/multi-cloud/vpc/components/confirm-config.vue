<template>
  <div class="confirm-config">
    <ideal-table-list
      :table-data="tableData"
      :table-headers="tableHeaders"
      :show-pagination="false"
    >
      <template #productSpec>
        <el-table-column label="产品规格">
          <template #default="props">
            <div
              v-for="(item, index) in props.row.productSpecification"
              :key="index"
              class="flex-row"
            >
              <div class="confirm-config-product-spec__label">
                {{ item.label }}
              </div>
              <div class="custom-normal-content">
                {{ props.row[item.prop] }}
              </div>
            </div>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>
  </div>
</template>

<script setup lang="ts">
interface basicConfig {
  basicInfo: any
}
const props = withDefaults(defineProps<basicConfig>(), {
  basicInfo: () => ({})
})
const tableData: any = ref([])
watch(
  () => props.basicInfo,
  obj => {
    if (obj) {
      tableData.value = obj.subnetFormData.map((ele: any, index: number) => {
        if (index === 0) {
          return {
            productType: '虚拟私有云',
            productSpecification: vpcSpecification,
            count: 1,
            regionName: obj.regionName,
            vpcName: obj.vpcName,
            vpcDesc: obj.vpcDesc,
            ipv4Cidr: obj.ipv4Cidr,
            subnetName: ele.subnetName,
            subnetDesc: ele.subnetDesc,
            subnetType: '普通子网',
            subnetIp4vCidr: ele.subnetIp4vCidr,
            gateway: ele.gateway
          }
        } else {
          return {
            productType: '子网' + index,
            productSpecification: subSpecification,
            count: 1,
            subnetName: ele.subnetName,
            subnetDesc: ele.subnetDesc,
            subnetType: '普通子网',
            subnetIp4vCidr: ele.subnetIp4vCidr,
            gateway: ele.gateway
          }
        }
      })
    }
  },
  { deep: true }
)

const tableHeaders = [
  { label: '产品类型', prop: 'productType', width: '250' },
  { label: '产品规格', prop: 'productSpec', useSlot: true },
  { label: '数量', prop: 'count', width: '250' }
]
const vpcSpecification = [
  { label: '区域', prop: 'regionName' },
  { label: '名称', prop: 'vpcName' },
  { label: 'VPC描述', prop: 'vpcDesc' },
  { label: 'VPC网段', prop: 'ipv4Cidr' },
  { label: '默认子网名称', prop: 'subnetName' },
  { label: '默认子网描述', prop: 'subnetDesc' },
  { label: '默认子网类型', prop: 'subnetType' },
  { label: '默认子网网段', prop: 'subnetIp4vCidr' },
  { label: '网关', prop: 'gateway' }
]
const subSpecification = [
  { label: '子网名称', prop: 'subnetName' },
  { label: '子网描述', prop: 'subnetDesc' },
  { label: '子网类型', prop: 'subnetType' },
  { label: '子网网段', prop: 'subnetIp4vCidr' },
  { label: '网关', prop: 'gateway' }
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
