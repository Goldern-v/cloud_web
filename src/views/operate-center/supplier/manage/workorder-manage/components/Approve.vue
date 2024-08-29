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
  approveHeaderArray,
  initListDataDefaultVal,
  initStatusInfo,
  resourceTypeFormat,
  statusFormat,
  statusList,
  typeFormat
} from '../common'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealSearch,
  IdealTextProp
} from '@/types'

import { IHooksOptions } from '@/hooks/interface'
import { supplierWorkorderList } from '@/api/java/operate-center'
import { isSupplierManager } from '@/utils/role'
import { useCrud } from '@/hooks'

const emit = defineEmits<{
  (e: 'clickOperateEvent', command: string, row: any, tabType: string): void
}>()
const clickOperateEvent = (command: string, row: any) => {
  emit('clickOperateEvent', command, row, 'approve')
}

const defaultQuery = {
  workerOrderTabType: 'approval'
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

initStatusInfo(['approve'], ['已通过', '待审批', '已驳回'])

const typeArray = ref<IdealSearch[]>([
  { label: '工单号', prop: 'orderNo', type: FiltrateEnum.input },
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
const headerArray: IdealTableColumnHeaders[] = approveHeaderArray

const newOperate = (ele: any): IdealTableColumnOperate[] => {
  let resultArr: IdealTableColumnOperate[] = []
  const tempArr = JSON.parse(JSON.stringify(operateButtons.value))
  // if (isSupplierManager.value) {
  if (['待审批'].includes(statusFormat[ele.status])) {
    resultArr = tempArr.filter((item: any) => item.prop === 'approve')
  } else if (['已驳回', '已通过'].includes(statusFormat[ele.status])) {
    resultArr = tempArr.filter((item: any) => item.prop === 'detail')
  }
  // } else {
  // resultArr = tempArr
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
        item.resourceTypeText = item.resourceType
          ? resourceTypeFormat[item.resourceType]
          : '-'
        item.statusText = item.status ? statusFormat[item.status] : ''
        item.bandwidthUnit = item.bandwidth ? item.bandwidth + 'Mbps' : ''
        initListDataDefaultVal(approveHeaderArray, val)
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
      title: '详情',
      prop: 'detail',
      authority: 'supplier:workorder:manage:detail'
    },
    {
      title: '审批',
      prop: 'approve',
      authority: 'supplier:workorder:manage:approve'
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
