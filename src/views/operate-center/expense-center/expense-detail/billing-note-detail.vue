<template>
  <div class="expense__detail">
    <ideal-search
      :type-array="typeArray"
      date-format="YYYY-MM-DD"
      @clickSearch="onClickSearch"
    ></ideal-search>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :total="state.total"
      :page="state.page"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
      <template #costName>
        <el-table-column label="成本中心" show-overflow-tooltip>
          <template #default="props">
            <el-tooltip
              effect="dark"
              placement="top"
              :disabled="!props.row.costList?.length"
            >
              <template #content>
                <div v-for="(item, idx) of props.row.costList" :key="idx">
                  {{ item.costName }} : ￥{{ item.payAmount }}
                </div>
              </template>

              <div>
                <div v-if="props.row.costList?.length">
                  {{ props.row.costList[0]?.costName }}
                </div>
                <div v-else>--</div>
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>
  </div>
</template>
<script setup lang="ts">
import { ElMessage } from 'element-plus/es'
import { IHooksOptions } from '@/hooks/interface'
import {
  queryBillingPage,
  queryBillCostPage,
  expenseTypeList
} from '@/api/java/operate-center'
import { useCrud } from '@/hooks'
import { vdcTreeList } from '@/api/java/public'
import { BillingEnum, FiltrateEnum } from '@/utils/enum'
import type {
  IdealButtonEventProp,
  IdealTableColumnHeaders,
  IdealSearch,
  IdealTextProp
} from '@/types'

const billingTypeList = ref([{ label: '按需', value: 'ON_DEMAND' }])
const defaultProps = {
  children: 'sons',
  label: 'name',
  value: 'id'
}
const typeArray = ref<IdealSearch[]>([
  {
    label: '名称',
    prop: 'name',
    type: FiltrateEnum.input,
    arrayProp: 'name',
    arrayKey: 'code'
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
//计费模式
const selectBilling = ref('ON_DEMAND')

const state: IHooksOptions = reactive({
  dataListUrl: queryBillingPage,
  deleteUrl: '',
  queryForm: {
    billType: selectBilling.value
  }
})
//页码切换
const { sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)
// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', check: true },
  { label: '订单号', prop: 'orderId' },
  { label: '费用类型', prop: 'resourceName' },
  { label: '计费模式', prop: 'billingMode' },
  { label: '项目名称', prop: 'projectName' },
  { label: 'VDC', prop: 'vdcName' },
  { label: '成本中心', prop: 'costName', useSlot: true },
  { label: '计费项', prop: 'code' },
  { label: '账单类型', prop: 'orderName' },
  { label: '开始计费时间', prop: 'startTime' },
  { label: '结束计费时间', prop: 'endTime' },
  { label: '计费单费用', prop: 'payPrices' },
  { label: '生成时间', prop: 'createTime.date', check: true, width: '120' }
]

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
  getVdcTree()
  getCostCenter()
  getExpenseType()
})
//查询费用类型列表
const costTypeList: Ref<any[]> = ref([])
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
const vdcTree: Ref<any[]> = ref([])
const getVdcTree = async () => {
  try {
    const res = await vdcTreeList()
    vdcTree.value = res.data.sons
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
