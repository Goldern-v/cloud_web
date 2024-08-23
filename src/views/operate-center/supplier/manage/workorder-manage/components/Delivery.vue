<template>
  <div class="worker-content">
    <ideal-search
      :show-category="false"
      :show-platform-type="false"
      :show-resource-pool="false"
      :type-array="typeArray"
      @clickSearch="onClickSearch"
    />

    <el-divider border-style="solid" />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :pagination-type="PaginationTypeEnum.totalSizes"
      :total="state.total"
      :page="state.page"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
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
import { FiltrateEnum, PaginationTypeEnum } from '@/utils/enum'
import {
  deliveryHeaderArray,
  initListDataDefaultVal,
  initStatusInfo,
  sourceList,
  statusFormat,
  statusList,
  typeFormat,
  typeList
} from '../common'
import {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealTextProp
  // IdealSearch,
} from '@/types'

import { IHooksOptions } from '@/hooks/interface'
import { supplierWorkorderList } from '@/api/java/operate-center'
import { isSupplierManager } from '@/utils/role'
import { useCrud } from '@/hooks'

const emit = defineEmits<{
  (e: 'clickOperateEvent', command: string, row: any, tabType: string): void
}>()
const clickOperateEvent = (command: string, row: any) => {
  emit('clickOperateEvent', command, row, 'delivery')
}

const defaultQuery = {
  workerOrderTabType: 'delivery'
}
const state: IHooksOptions = reactive({
  dataListUrl: supplierWorkorderList,
  dataList: [] as any[],
  queryForm: {
    ...defaultQuery
  }
})
const { sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)

const operateButtons = ref<IdealTableColumnOperate[]>([])
const tableHeaders = ref<IdealTableColumnHeaders[]>()

initStatusInfo(['delivery'], ['待交付', '交付中', '已完成'])

// const typeArray = ref<IdealSearch[]>([
const typeArray = ref<any[]>([
  { label: '工单号', prop: 'orderNo', type: FiltrateEnum.input },
  {
    label: '资源类型',
    prop: 'resourceType',
    type: FiltrateEnum.list,
    array: sourceList,
    arrayProp: 'label',
    arrayKey: 'value'
  },
  {
    label: '工单类型',
    prop: 'type',
    type: FiltrateEnum.list,
    array: typeList,
    arrayProp: 'label',
    arrayKey: 'value'
  },
  {
    label: '工单状态',
    prop: 'status',
    type: FiltrateEnum.list,
    array: statusList,
    arrayProp: 'label',
    arrayKey: 'value'
  },
  {
    label: '创建时间',
    prop: 'date',
    type: FiltrateEnum.date
  }
])
const headerArray: IdealTableColumnHeaders[] = deliveryHeaderArray

const setDeliveryDisabled = (
  disabled: boolean,
  array: IdealTableColumnOperate[]
) => {
  const index = array.findIndex((item: any) => item.prop === 'delivery')
  array[index].disabled = disabled
  array[index].disabledText = '非未处理状态的不支持交付操作'
  return array
}

const newOperate = (ele: any): IdealTableColumnOperate[] => {
  let resultArr: IdealTableColumnOperate[] = []
  let lishiArr: IdealTableColumnOperate[] = []
  const tempArr = JSON.parse(JSON.stringify(operateButtons.value))
  //待判断操作按钮
  // if (isSupplierManager.value && ele.type.toUpperCase() !== 'NEW_DISCOUNT') {
  //   // 供应商角色下 非折扣类型 显示详情、交付按钮
  //   lishiArr = tempArr.filter(
  //     (ele: any) => ele.prop === 'detail' || ele.prop === 'delivery'
  //   )
  //   if (ele.status.toUpperCase() !== 'UN_DEAL') {
  //     // 供应商角色下 非折扣类型   非未处理状态下 交付按钮禁用
  //     resultArr = setDeliveryDisabled(true, lishiArr)
  //   } else {
  //     resultArr = lishiArr
  //   }
  // } else if (
  //   isSupplierManager.value &&
  //   ele.type.toUpperCase() === 'NEW_DISCOUNT'
  // ) {
  //   if (ele.status.toUpperCase() === 'UN_APPROVED') {
  //     // 供应商角色下 未审批状态  只显示审批按钮
  //     resultArr = tempArr.filter((ele: any) => ele.prop === 'approve')
  //   } else {
  //     // 供应商角色下 非未审批状态  折扣类型 只显示详情按钮
  //     resultArr = tempArr.filter((ele: any) => ele.prop === 'detail')
  //   }
  // } else {
  resultArr = tempArr
  // }
  return resultArr
}

watch(
  () => state.dataList,
  val => {
    if (val?.length) {
      val.forEach((item: any) => {
        item.operate = newOperate(item)
        item.typeText = item.type ? typeFormat[item.type] : ''
        item.statusText = item.status ? statusFormat[item.status] : ''
        item.bandwidthUnit = item.bandwidth ? item.bandwidth + 'Mbps' : ''
        initListDataDefaultVal(deliveryHeaderArray, val)
      })
    }
  }
)

const onClickSearch = (v: IdealTextProp[]) => {
  state.queryForm = { ...defaultQuery }
  if (v.length) {
    v.forEach((item: IdealTextProp) => {
      if (item.prop === 'date' && item?.value) {
        const timeArray = item.value.split('/')
        state.queryForm.startTime = timeArray[0]
        state.queryForm.endTime = timeArray[1]
      } else {
        state.queryForm[item.prop] = item.value
      }
    })
  }
  getDataList()
}

onMounted(() => {
  if (!isSupplierManager.value) {
    tableHeaders.value = headerArray
    // operateButtons.value = [
    //   {
    //     title: '详情',
    //     prop: 'detail',
    //     authority: 'supplier:workorder:manage:detail'
    //   }
    // ]
  } else {
    tableHeaders.value = headerArray.filter(
      (item: any) => item.prop !== 'supplierName' && item.prop !== 'orderId'
    )
  }
  operateButtons.value = [
    {
      title: '交付',
      prop: 'jiaofu',
      authority: 'supplier:workorder:manage:delivery'
    },
    {
      title: '详情',
      prop: 'detail',
      authority: 'supplier:workorder:manage:detail'
    }
  ]
})

defineExpose({
  getDataList
})
</script>

<style lang="scss" scoped>
.worker-content {
  background-color: white;
  padding: $idealPadding;
}
</style>
