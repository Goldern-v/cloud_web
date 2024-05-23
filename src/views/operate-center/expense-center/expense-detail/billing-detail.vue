<template>
  <div class="expense__detail">
    <ideal-search
      :type-array="typeArray"
      date-format="YYYY-MM-DD"
      @clickSearch="onClickSearch"
    ></ideal-search>

    <el-divider />

    <div class="flex-row" style="align-items: flex-start">
      <div style="width: 20%">
        <el-radio-group v-model="billType" class="ideal-middle-margin-bottom">
          <el-radio-button label="cloud">云管账单</el-radio-button>
          <el-radio-button label="sync">同步账单</el-radio-button>
        </el-radio-group>
      </div>

      <ideal-button-events
        :right-btns="rightButtons"
        @clickRightEvent="clickRightEvent"
      />
    </div>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :total="state.total"
      :page="state.page"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
      <template #name>
        <el-table-column label="名称" width="200" fixed="left">
          <template #default="props">
            <span>{{ props.row.name }}</span></template
          >
        </el-table-column>
      </template>
      <template #resource>
        <el-table-column label="资源池名称" width="150">
          <template #default="props">
            <el-tooltip
              popper-class="custom-tooltip"
              effect="dark"
              placement="top"
              :disabled="props.row.cloudResourcePoolVoList?.length === 1"
            >
              <template #content>
                <div
                  v-for="(item, idx) of props.row.cloudResourcePoolVoList"
                  :key="idx"
                >
                  {{ item.name }}
                </div>
              </template>
              <div v-if="props.row.cloudResourcePoolVoList?.length">
                {{ props.row.cloudResourcePoolVoList[0]?.name }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
      </template>

      <template #costName>
        <el-table-column label="成本中心" show-overflow-tooltip width="150">
          <template #default="props">
            <el-tooltip
              effect="dark"
              placement="top"
              :disabled="props.row.costList?.length < 1"
            >
              <template #content>
                <div v-for="(item, idx) of props.row.costList" :key="idx">
                  {{ item.costName }} : ￥{{ item.payAmount }}
                </div>
              </template>

              <div>
                <div v-if="props.row.costList[0]">
                  {{ props.row.costList[0].costName }}
                </div>
                <div v-else>--</div>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <ideal-set-table-header
      :show-drawer="showDrawer"
      :data-array="customHeaders"
      @update:showDrawer="showDrawer = $event"
      @onClickSubmit="onClickSubmit"
    />
  </div>
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus/es'
import { IHooksOptions } from '@/hooks/interface'
import type {
  IdealButtonEventProp,
  IdealTableColumnHeaders,
  IdealSearch,
  IdealTextProp
} from '@/types'
import { BillingEnum, FiltrateEnum } from '@/utils/enum'
import {
  queryPayAccountPage,
  expenseSyncPageUrl,
  queryBillCostPage,
  expenseTypeList
} from '@/api/java/operate-center'
import { useCrud } from '@/hooks'
import { vdcTreeList } from '@/api/java/public'

//计费模式
const billingTypeList: any = ref([
  { label: '包年/包月', value: BillingEnum.PACKAGE },
  { label: '按需', value: BillingEnum.ON_DEMAND }
])
const defaultProps = {
  children: 'sons',
  label: 'name',
  value: 'id'
}
const typeArray = ref<IdealSearch[]>([
  {
    label: '名称',
    prop: 'name',
    type: FiltrateEnum.input
  },
  {
    label: '费用类型',
    prop: 'resourceType',
    type: FiltrateEnum.list,
    arrayProp: 'name',
    arrayKey: 'code'
  },
  {
    label: 'VDC',
    prop: 'vdcId',
    type: FiltrateEnum.treeSelect,
    props: defaultProps
  },
  {
    label: '成本中心',
    prop: 'costId',
    type: FiltrateEnum.list,
    arrayProp: 'name',
    arrayKey: 'id'
  },
  {
    label: '计费模式',
    prop: 'billType',
    type: FiltrateEnum.list,
    array: billingTypeList.value,
    arrayProp: 'label',
    arrayKey: 'value'
  },
  { label: '日期', prop: 'date', type: FiltrateEnum.date }
])

const onClickSearch = (v: IdealTextProp[]) => {
  state.queryForm = {}
  if (v.length) {
    v.forEach((item: IdealTextProp) => {
      const temp = item.label.split('：')
      if (item.prop === 'resourceType') {
        // 消息类别
        const result = costTypeList.value.find(
          (ele: any) => ele.name === temp[1]
        )
        state.queryForm[item.prop] = result?.code
      } else if (item.prop === 'costId') {
        const result = costCenterList.value.find(
          (ele: any) => ele.name === temp[1]
        )
        state.queryForm[item.prop] = result?.id
      } else if (item.prop === 'billType') {
        const result = billingTypeList.value.find(
          (ele: any) => ele.label === temp[1]
        )
        state.queryForm[item.prop] = result?.value
      } else if (item.prop === 'date') {
        const timeArray = temp[1].split('/')
        state.queryForm.startTime = timeArray[0]
        state.queryForm.endTime = timeArray[1]
      } else if (item.prop === 'name') {
        state.queryForm[item.prop] = temp[1]
      } else if (item.prop === 'vdcId') {
        state.queryForm[item.prop] = item.value
      }
    })
  }
  getDataList()
}

/**
 * 列表
 */
const state: IHooksOptions = reactive({
  dataListUrl: queryPayAccountPage,
  deleteUrl: '',
  queryForm: {}
})
//页码切换
const { sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)
// 账单类型
const billType = ref('cloud')
// 云管账单
const cloudHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', check: true, useSlot: true },
  { label: '账期', prop: 'cycle', check: true, width: '150' },
  { label: '费用类型', prop: 'resourceName', check: true, width: '150' },
  { label: '资源名称', prop: 'resourceName', check: true, width: '150' },
  { label: '计费模式', prop: 'billingMode', check: true, width: '150' },
  { label: '账单类型', prop: 'orderName', check: true, width: '150' },
  { label: '订单号', prop: 'orderId', check: true, width: '150' },
  { label: '消费时间', prop: 'billDate', check: true, width: '150' },
  { label: '所属项目', prop: 'projectName', check: true, width: '150' },
  { label: '所属VDC', prop: 'vdcName', check: true, width: '150' },
  {
    label: '成本中心',
    prop: 'costName',
    useSlot: true,
    check: true,
    width: '150'
  },
  { label: '云平台类别', prop: 'cloudCategoryName', check: true, width: '150' },
  { label: '云平台类型', prop: 'cloudTypeName', check: true, width: '150' },
  { label: '资源池名称', prop: 'resourcePoolName', check: true, width: '150' },
  { label: '生成时间', prop: 'createTime.date', check: true, width: '150' },
  { label: '原价(元)', prop: 'totalOriginalPrices', check: true, width: '100' },
  {
    label: '优惠金额(元)',
    prop: 'totalDiscountPrices',
    check: true,
    width: '100'
  },
  {
    label: '应付金额(元)',
    prop: 'totalFinalPrices',
    check: true,
    width: '100'
  },
  { label: '实付金额(元)', prop: 'totalPayPrices', check: true, width: '100' }
]
// 同步账单
const syncHeaders: IdealTableColumnHeaders[] = [
  { label: '账期', prop: 'billDate', check: true },
  // { label: '账号', prop: 'account', check: true },
  { label: '费用类型', prop: 'cloudServiceTypeName', check: true },
  { label: '资源名称', prop: 'name', check: true },
  { label: '计费模式', prop: 'chargeModeName', check: true },
  { label: '账单类型', prop: 'billTypeName', check: true },
  { label: '订单号', prop: 'trade_id', check: true },
  { label: '消费时间', prop: 'billDate', check: true },
  { label: '云平台类别', prop: 'cloudCategoryName', check: true, width: '120' },
  { label: '云平台类型', prop: 'cloudTypeName', check: true, width: '120' },
  {
    label: '资源池名称',
    prop: 'resource',
    check: true,
    width: '120',
    useSlot: true
  },
  { label: '应付金额(元)', prop: 'officialAmount', check: true, width: '100' },
  { label: '优惠金额(元)', prop: 'discountAmount', check: true, width: '100' },
  { label: '实付金额(元)', prop: 'consumeAmount', check: true, width: '100' }
]
const customHeaders = ref<IdealTableColumnHeaders[]>([])
watch(
  () => billType.value,
  value => {
    if (value === 'cloud') {
      customHeaders.value = cloudHeaders
      tableHeaders.value = cloudHeaders
      state.dataListUrl = queryPayAccountPage
    } else {
      customHeaders.value = syncHeaders
      tableHeaders.value = syncHeaders
      state.dataListUrl = expenseSyncPageUrl
    }
    getDataList()
  }
)
// 自定义表头
const onClickSubmit = (value: IdealTableColumnHeaders[]) => {
  const tempArr = value.filter((item: IdealTableColumnHeaders) => item.check)

  let array: IdealTableColumnHeaders[] = []
  customHeaders.value.forEach((item: IdealTableColumnHeaders) => {
    tempArr.forEach((child: IdealTableColumnHeaders) => {
      if (child.prop === item.prop) {
        array.push(item)
      }
    })
  })
  tableHeaders.value = array
}
// 列表表头
const tableHeaders = ref<IdealTableColumnHeaders[]>([])
// 列表右侧按钮
const rightButtons: IdealButtonEventProp[] = [
  {
    prop: 'setting',
    icon: 'setting-icon'
  }
]
const clickRightEvent = (value: string | number | object) => {
  if (value === 'setting') {
    showDrawer.value = true
  }
}
// 抽屉是否显示
const showDrawer = ref(false)

watch(
  () => state.dataList,
  (arr: any) => {
    if (arr.length) {
      let billingModeFormat: any = {
        ON_DEMAND: '按需',
        PACKAGE: '包年/包月'
      }
      arr.forEach((ele: any) => {
        ele.billingMode = billingModeFormat[ele.billType]
      })
    }
  }
)

onMounted(() => {
  customHeaders.value = cloudHeaders
  tableHeaders.value = cloudHeaders
  getVdcTree()
  getCostCenter()
  getExpenseType()
})
//查询费用类型列表
const costTypeList: any = ref([]) //成本中心
const getExpenseType = () => {
  expenseTypeList()
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        costTypeList.value = data
        const index = typeArray.value.findIndex(
          (item: any) => item.prop === 'resourceType'
        )
        typeArray.value[index].array = data
      } else {
        costTypeList.value = []
      }
    })
    .catch(_ => {
      costTypeList.value = []
    })
}
//vdc
const getVdcTree = async () => {
  try {
    const res = await vdcTreeList()
    const index = typeArray.value.findIndex(
      (item: any) => item.prop === 'vdcId'
    )
    typeArray.value[index].array = res.data.sons
  } catch (err: any) {
    ElMessage.error(err)
  }
}
//成本中心
const costCenterList: Ref<any[]> = ref([])
const getCostCenter = async () => {
  try {
    const res = await queryBillCostPage()
    costCenterList.value = res.data
    const index = typeArray.value.findIndex(
      (item: any) => item.prop === 'costId'
    )
    typeArray.value[index].array = res.data
  } catch (err: any) {
    ElMessage.error(err)
  }
}
</script>
<style lang="scss" scoped>
.expense__detail {
  width: 100%;
  box-sizing: border-box;
  background-color: white;
  :deep(
      .el-input-group--append
        .el-input-group__append
        .el-select
        .el-select__wrapper
    ) {
    height: 34px;
  }
}

.input-with-select {
  margin: 0px 10px 10px 0;
  width: 24%;
  :deep(.el-input-group__append) {
    width: 80%;
    background-color: var(--el-fill-color-blank);
    padding: 0;
  }

  :deep .el-input__wrapper {
    background-color: var(--el-fill-color-light);
  }
}
.el-date-editor.el-input__inner {
  width: 146px;
  margin: 0 10px;
}
</style>
