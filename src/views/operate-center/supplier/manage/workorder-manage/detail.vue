<template>
  <div>
    <ideal-detail-info
      :label-array="labelArray"
      :detail-info="detailInfo"
    ></ideal-detail-info>

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
  val => {
    if (Object.keys(val).length) {
      dataList.value = val
      //   [val].forEach((item: any) => {
      //     item.source = item.dataResource === 'static' ? '静态录入' : 'API对接'
      //     item.bandwidth = `${item.minBandwidth}-${item.maxBandwidth}M`
      //     item.deliveryPeriod = `${item.deliveryDuration}天`
      //     item.nrcStr = `${item.nrc}$`
      //     item.mrcStr = `${item.mrc}$`
      //   })
    }
  }
)

const labelArray = ref([
  { label: '供应商名称', prop: 'name' },
  { label: '工单号', prop: 'status' },
  { label: '订单号', prop: 'uuid' },
  { label: '工单类型', prop: 'description' },
  { label: '工单状态', prop: 'description' },
  { label: '带宽', prop: 'description' },
  { label: '线路编号', prop: 'description' },
  { label: '创建时间', prop: 'description' },
  { label: '交付时间', prop: 'description' },
  { label: '备注信息', prop: 'description' }
])
const detailInfo = ref({})

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '接入类型', prop: 'aPortName' },
  { label: '云连接类型', prop: 'zPortName' },
  { label: '地址', prop: 'source' },
  { label: 'vlan', prop: 'mtu' }
]
</script>

<style scoped lang="scss">
.basic-info {
  background-color: white;
}
</style>
