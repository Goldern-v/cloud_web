<template>
  <div class="ideal-main-container work-manage-manage">
    <p>基本信息</p>
    <ideal-detail-info
      :label-array="labelArray"
      :detail-info="detailInfo"
      class="padding-left"
    >
      <template #createTime>
        <div>{{ detailInfo.createTime.date }}</div>
      </template>
      <template #updateTime>
        <div>{{ detailInfo.updateTime.date }}</div>
      </template>
    </ideal-detail-info>

    <p>资源概览</p>

    <ideal-table-list
      :table-data="dataList"
      :table-headers="tableHeaders"
      :show-pagination="false"
      class="padding-left"
    >
    </ideal-table-list>

    <p>线路价格</p>

    <ideal-table-list
      :table-data="dataList"
      :table-headers="priceHeaders"
      :show-pagination="false"
      class="padding-left"
    >
      <template #expandTable>
        <el-table-column type="expand">
          <template #default="props">
            <p>审批详情</p>
            {{ props }}
            <!-- <ideal-table-list
              :table-data="[]"
              :table-headers="contactTableHeaders"
              :show-pagination="false"
              style="padding-left: 60px"
            >
            </ideal-table-list> -->
          </template>
        </el-table-column>
      </template>
      <template #operation>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="props">
            <ideal-table-operate
              :buttons="props.row.operate"
              @clickMoreEvent="clickOperateEvent($event as any, props.row)"
            >
            </ideal-table-operate>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>
  </div>
</template>
<script setup lang="ts">
import type { IdealTableColumnHeaders, IdealTableColumnOperate } from '@/types'
import { isSupplierManager } from '@/utils/role'

// 属性值
// interface portProps {
//   rowData?: any // 行数据
// }
// const props = withDefaults(defineProps<portProps>(), {
//   rowData: null
// })

const detailInfo: any = ref({})
const route = useRoute()
onMounted(() => {
  detailInfo.value = JSON.parse(route.query.detail as any)
  console.log(detailInfo.value, '详情数据')
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
const dataList: any = ref([])

watch(
  () => detailInfo.value,
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
  }
  // { immediate: true }
)
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
const priceHeaders: IdealTableColumnHeaders[] = [
  { label: '原价', prop: 'type' },
  { label: '成交价($)', prop: 'cloudType' },
  { label: '审批状态', prop: 'cloudRegionId' },
  { label: '最终可接受价格($)', prop: 'vlanId' },
  { label: '审批时间', prop: 'time' }
]
const operateButtons: IdealTableColumnOperate[] = [
  { title: '通过', prop: 'pass' },
  { title: '驳回', prop: 'reject' }
]
const newOperate = (ele: any): IdealTableColumnOperate[] => {
  let resultArr: IdealTableColumnOperate[] = []
  const tempArr = JSON.parse(JSON.stringify(operateButtons))
  // if (ele.approvalStatus.toUpperCase() === 'PASS') {
  //   resultArr = setOperateBtns(true, tempArr)
  // } else if (ele.approvalStatus.toUpperCase() === 'OFFSHELVES') {
  //   resultArr = setEditDisabled(true, tempArr)
  // } else {
  //   resultArr = tempArr
  // }
  resultArr = tempArr
  return resultArr
}
// 根据状态设置操作禁用状态
// const setOperateBtns = (
//   disabled: boolean,
//   array: IdealTableColumnOperate[]
// ) => {
//   const arr: IdealTableColumnOperate[] = []
//   array.forEach((item: any) => {
//     item.disabled = disabled
//     item.disabledText = `已通过审批的不支持${item.title}操作`
//     arr.push(item)
//   })
//   return arr
// }
const clickOperateEvent = (command: string | number, row: any) => {
  if (command === 'pass') {
  } else if (command === 'reject') {
  }
}
const contactTableHeaders: IdealTableColumnHeaders[] = [
  { label: '成交价($)', prop: 'cloudType' },
  { label: '审批记录', prop: 'cloudRegionId' },
  { label: '可接受价格($)', prop: 'vlanId' },
  { label: '审批时间', prop: 'time' }
]
</script>

<style scoped lang="scss">
.work-manage-manage {
  background-color: white;
  padding: $idealPadding;
}
.basic-info {
  background-color: white;
}
.padding-left {
  padding-left: 60px;
  margin-bottom: 20px;
}
</style>
