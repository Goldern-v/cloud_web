<template>
  <div class="ideal-main-container work-manage-manage">
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

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      :row-data="rowData"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import { isSupplierManager } from '@/utils/role'
import dialogBox from './dialog-box.vue'
import { FiltrateEnum, PaginationTypeEnum } from '@/utils/enum'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import { typeFormat, statusFormat, statusList, typeList } from './common'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealSearch,
  IdealTextProp
} from '@/types'
import { supplierWorkorderList } from '@/api/java/operate-center'

const typeArray = ref<IdealSearch[]>([
  { label: '工单号', prop: 'id', type: FiltrateEnum.input },
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

const onClickSearch = (v: IdealTextProp[]) => {
  state.queryForm = {}
  if (v.length) {
    v.forEach((item: IdealTextProp) => {
      if (item.prop === 'date' && item?.value) {
        // 日期
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

const headerArray: IdealTableColumnHeaders[] = [
  { label: '供应商名称', prop: 'supplierName' },
  { label: '工单号', prop: 'id' },
  { label: '订单号', prop: 'orderId' },
  { label: '工单类型', prop: 'typeText' },
  { label: '工单状态', prop: 'statusText' },
  { label: '带宽', prop: 'bandwidthUnit' },
  { label: '线路编号', prop: 'privateConnectId' },
  { label: '创建时间', prop: 'createTime.date' }
]

const state: IHooksOptions = reactive({
  dataListUrl: supplierWorkorderList,
  dataList: [] as any[],
  queryForm: {}
})

const { sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)

watch(
  () => state.dataList,
  val => {
    if (val?.length) {
      val.forEach((item: any) => {
        item.operate = newOperate(item)
        item.typeText = item.type ? typeFormat[item.type] : ''
        item.statusText = item.status ? statusFormat[item.status] : ''
        item.bandwidthUnit = item.bandwidth ? item.bandwidth + 'Mbps' : ''
      })
    }
  }
)

const tableHeaders = ref<IdealTableColumnHeaders[]>()

onMounted(() => {
  //平台管理员角色
  if (!isSupplierManager.value) {
    tableHeaders.value = headerArray
    operateButtons.value = [
      {
        title: '详情',
        prop: 'detail',
        authority: 'supplier:workorder:manage:detail'
      }
    ]
  }
  //供应商角色
  else {
    tableHeaders.value = headerArray.filter(
      (item: any) => item.prop !== 'supplierName' && item.prop !== 'orderId'
    )
    operateButtons.value = [
      {
        title: '交付',
        prop: 'delivery',
        authority: 'supplier:workorder:manage:delivery'
      },
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
  }
})

const operateButtons = ref<IdealTableColumnOperate[]>([])

const newOperate = (ele: any): IdealTableColumnOperate[] => {
  let resultArr: IdealTableColumnOperate[] = []
  let lishiArr: IdealTableColumnOperate[] = []
  const tempArr = JSON.parse(JSON.stringify(operateButtons.value))
  if (isSupplierManager.value && ele.type.toUpperCase() !== 'NEW_DISCOUNT') {
    // 供应商角色下 非折扣类型 显示详情、交付按钮
    lishiArr = tempArr.filter((ele: any) => {
      return ele.prop == 'detail' || ele.prop == 'delivery'
    })
    if (ele.status.toUpperCase() !== 'UN_DEAL') {
      // 供应商角色下 非折扣类型   非未处理状态下 交付按钮禁用
      resultArr = setDeliveryDisabled(true, lishiArr)
    } else {
      return (resultArr = lishiArr)
    }
  } else if (
    isSupplierManager.value &&
    ele.type.toUpperCase() == 'NEW_DISCOUNT'
  ) {
    if (ele.status.toUpperCase() == 'UN_APPROVED') {
      // 供应商角色下 未审批状态  只显示审批按钮
      resultArr = tempArr.filter((ele: any) => {
        return ele.prop == 'approve'
      })
    } else {
      // 供应商角色下 非未审批状态  折扣类型 只显示详情按钮
      resultArr = tempArr.filter((ele: any) => {
        return ele.prop == 'detail'
      })
    }
  } else {
    resultArr = tempArr
  }
  return resultArr
}

const setDeliveryDisabled = (
  disabled: boolean,
  array: IdealTableColumnOperate[]
) => {
  const index = array.findIndex((item: any) => item.prop === 'delivery')
  array[index].disabled = disabled
  array[index].disabledText = '非未处理状态的不支持交付操作'
  return array
}

const rowData: any = ref({})
const router = useRouter()
const clickOperateEvent = (command: string | number, row: any) => {
  rowData.value = row
  if (command === 'delivery') {
    showDialog.value = true
    dialogType.value = 'delivery'
  } else if (command === 'detail' || command === 'approve') {
    router.push({
      path: '/operate-center/supplier/manage/workorder-manage/detail',
      query: {
        id: row.id
      }
    })
  }
}

// 弹框
const showDialog = ref(false)
const dialogType = ref<string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  getDataList()
}
</script>

<style scoped lang="scss">
.work-manage-manage {
  background-color: white;
  padding: $idealPadding;
  .ideal-theme-text {
    cursor: pointer;
  }
}
</style>
