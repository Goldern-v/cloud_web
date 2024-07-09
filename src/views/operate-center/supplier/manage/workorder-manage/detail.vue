<template>
  <div>
    <ideal-detail-info :label-array="labelArray" :detail-info="rowData">
      <template #createTime>
        <div>{{ rowData.createTime.date }}</div>
      </template>
      <template #updateTime>
        <div>{{ rowData.updateTime.date }}</div>
      </template>
    </ideal-detail-info>

    <p>资源概览</p>

    <ideal-table-list
      :table-data="dataList"
      :table-headers="tableHeaders"
      :show-pagination="false"
    >
    </ideal-table-list>
  </div>
</template>
<script setup lang="ts">
import type { IdealTableColumnHeaders } from '@/types'
import { isSupplierManager } from '@/utils/role'

// 属性值
interface portProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<portProps>(), {
  rowData: null
})

const dataList: any = ref([])

watch(
  () => props.rowData,
  (val: any) => {
    if (val) {
      dataList.value = [
        {
          type: 'A端',
          cloudType: val.endpointADto.cloudType,
          cloudRegionId: val.endpointADto.cloudRegionId,
          vlanId: val.endpointADto.vlanId
        },
        {
          type: 'Z端',
          cloudType: val.endpointZDto.cloudType,
          cloudRegionId: val.endpointZDto.cloudRegionId,
          vlanId: val.endpointZDto.vlanId
        }
      ]
    }
  },
  { immediate: true }
)

onMounted(() => {
  //平台管理员角色
  if (!isSupplierManager.value) {
    labelArray.value = headerArray.value
  }
  //供应商角色
  else {
    labelArray.value = headerArray.value.filter(
      (item: any) => item.prop !== 'supplierName' && item.prop !== 'orderId'
    )
  }
})

const labelArray = ref([])
const headerArray: any = ref([
  { label: '供应商名称', prop: 'supplierName' },
  { label: '工单号', prop: 'id' },
  { label: '订单号', prop: 'orderId' },
  { label: '工单类型', prop: 'typeText' },
  { label: '工单状态', prop: 'statusText' },
  { label: '带宽', prop: 'bandwidthUnit' },
  { label: '线路编号', prop: 'privateConnectId' },
  { label: '创建时间', prop: 'createTime', useSlot: true },
  { label: '交付时间', prop: 'updateTime', useSlot: true },
  { label: '备注信息', prop: 'remark' }
])

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '接入类型', prop: 'type' },
  { label: '云连接类型', prop: 'cloudType' },
  { label: '地址', prop: 'cloudRegionId' },
  { label: 'vlan', prop: 'vlanId' }
]
</script>

<style scoped lang="scss">
.basic-info {
  background-color: white;
}
</style>
