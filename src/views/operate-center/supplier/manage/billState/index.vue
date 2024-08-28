<template>
  <div class="ideal-main-container bill-state-manage">
    <!-- 搜索框 -->
    <div class="flex-row">
      <div class="select_text">筛选条件</div>
      <el-radio-group v-model="timeSelect" class="ideal-default-margin-right">
        <el-radio-button
          v-for="(item, index) in timeList"
          :key="index"
          :value="item.value"
        >
          {{ item.label }}
        </el-radio-button>
      </el-radio-group>

      <div class="ideal-default-margin-right">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          :clearable="false"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          @change="dateChange"
        />
      </div>
    </div>
    <!-- 收入总览  收入占比 -->
    <div class="revenue_review">
      <el-row :gutter="20">
        <el-col :span="18"
          ><div class="grid_content">
            <div class="padding_ten">
              <div class="flex-between">
                <p>收入总览</p>
                <el-select
                  v-if="!isSupplierManager"
                  v-model="supplierId"
                  placeholder="请选择供应商类型"
                  style="width: 20%"
                >
                  <el-option
                    v-for="(item, index) in supplierType"
                    :key="index"
                    :label="item.key"
                    :value="item.value"
                  />
                </el-select>
              </div>
              <!-- 柱形图 -->
              <bar-charts
                ref="incomeReviewRatio"
                :bar-data="barData"
              ></bar-charts>
            </div>
          </div>
        </el-col>
        <el-col :span="6"
          ><div class="grid_content">
            <div class="padding_ten">
              <div v-if="!isSupplierManager">
                <div>收入占比</div>
                <pie-charts
                  ref="incomeScaleRatio"
                  :pie-data="pieData"
                ></pie-charts>
              </div>
              <div v-else>
                <div>相关指标</div>
                <supplier-index :pie-data="pieData"></supplier-index>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 账单明细 -->
    <div class="checkDetail">
      <div class="padding_ten">
        <div>账单明细</div>
        <!-- state.dataList -->
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
        </ideal-table-list>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isSupplierManager } from '@/utils/role'
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders } from '@/types'
import { PaginationTypeEnum } from '@/utils/enum'
import { ElMessage } from 'element-plus'
import { useCrud } from '@/hooks'
import barCharts from './barCharts.vue'
import pieCharts from './pieCharts.vue'
import supplierIndex from './supplierIndex.vue'
import {
  supplierBillList,
  supplierTypeList,
  supplierBillOverview,
  supplierBillPieChart
} from '@/api/java/operate-center'
const timeSelect = ref(7)
const dateRange = ref<[any, any]>() //时间范围
const timeList = [
  { label: '近7天', type: 'd', value: 7, paramType: 1 },
  { label: '近30天', type: 'd', value: 30, paramType: 2 },
  { label: '近半年', type: 'm', value: 6, paramType: 3 },
  { label: '近一年', type: 'm', value: 12, paramType: 4 }
]
import { typeFormat, resourceTypeFormat } from './common'
import { timeFormatByCondition } from '@/utils/time-format'

const overViewType = ref()
watch(
  () => timeSelect.value,
  val => {
    const obj = timeList.find(item => item.value === val)
    if (obj) {
      overViewType.value = obj.paramType
      const to = new Date()
      const from =
        obj?.type === 'd'
          ? new Date(to.getTime() - obj.value * 24 * 3600000)
          : new Date(to.getTime() - obj.value * 24 * 30 * 3600000)
      const fromFormat = timeFormatByCondition(from, 'YYYY-MM-DD')
      const toFormat = timeFormatByCondition(to, 'YYYY-MM-DD')
      dateRange.value = [fromFormat, toFormat]
    }
  },
  { immediate: true }
)

const dateChange = (val: any) => {
  timeSelect.value = 0
  overViewType.value = 5 // 自定义时间  要求参数传5
}

watch(
  () => dateRange,
  val => {
    if (val) {
      ;(state.queryForm.supplier = supplierId.value),
        (state.queryForm.startTime = dateRange.value?.[0]),
        (state.queryForm.endTime = dateRange.value?.[1]),
        queryRevenue() //收入总览卡片数据
      queryPie()
      getDataList()
    }
  },
  { deep: true }
)
const supplierId = ref()
const supplierType: any = ref([])

const querySupplier = async () => {
  try {
    const res = await supplierTypeList()
    supplierType.value = res.data
  } catch (err: any) {
    ElMessage.error(err)
  }
}

watch(
  () => supplierId.value,
  val => {
    if (val) {
      ;(state.queryForm.supplier = supplierId.value),
        (state.queryForm.startTime = dateRange.value?.[0]),
        (state.queryForm.endTime = dateRange.value?.[1]),
        queryRevenue() //收入总览卡片数据
      queryPie()
      getDataList()
    }
  }
)

const incomeReviewRatio = ref()
const incomeScaleRatio = ref()

const barData = ref({})

// 收入总览柱状图
const queryRevenue = () => {
  let params = {
    supplier: supplierId.value,
    startTime: dateRange.value?.[0],
    endTime: dateRange.value?.[1],
    type: overViewType.value
  }
  barData.value = {}
  supplierBillOverview(params).then((res: any) => {
    if (res.code === 200) {
      barData.value = res.data
      nextTick(() => {
        incomeReviewRatio?.value.initEchart()
      })
    } else {
      barData.value = {}
    }
  })
}

const pieData = ref([])

// 收入占比饼状图
const queryPie = () => {
  let params = {
    supplier: supplierId.value,
    startTime: dateRange.value?.[0],
    endTime: dateRange.value?.[1]
  }
  pieData.value = []
  supplierBillPieChart(params).then((res: any) => {
    if (res.code === 200) {
      pieData.value = res.data
      nextTick(() => {
        incomeScaleRatio?.value.initEchart()
      })
    } else {
      pieData.value = []
    }
  })
}

const state: IHooksOptions = reactive({
  dataListUrl: supplierBillList,
  dataList: [] as any[],
  queryForm: {
    supplier: supplierId.value,
    startTime: dateRange.value?.[0],
    endTime: dateRange.value?.[1]
  }
})

const { sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)

watch(
  () => state.dataList,
  (arr: any) => {
    if (arr.length) {
      arr.forEach((item: any) => {
        item.businessTypeFormat = resourceTypeFormat[item.businessType]
        item.orderType = typeFormat[item.workOrderType]
      })
    }
  },
  { immediate: true }
)

onMounted(() => {
  querySupplier()
  queryRevenue()
  queryPie()
  //平台管理员角色
  if (!isSupplierManager.value) {
    tableHeaders.value = headerArray
  }
  //供应商角色
  else {
    tableHeaders.value = headerArray.filter((item: any) => item.prop !== 'name')
  }
})
// const maxHeight = ref(300)
const tableHeaders = ref<IdealTableColumnHeaders[]>()
const headerArray: IdealTableColumnHeaders[] = [
  { label: '供应商名称', prop: 'supplierName', width: '120' },
  { label: '产品名称', prop: 'productName', width: '120' },
  { label: '业务类型', prop: 'businessTypeFormat', width: '100' },
  { label: '工单号', prop: 'workOrderId', width: '200' },
  { label: '工单类型', prop: 'orderType', width: '200' },
  { label: '带宽', prop: 'bandwidth' },
  { label: '价格（$)', prop: 'income', width: '100' },
  { label: '账单生成时间', prop: 'billTime.date', width: '180' }
]
</script>

<style scoped lang="scss">
.bill-state-manage {
  background-color: white;
  padding: $idealPadding;
}
.select_text {
  display: flex;
  align-items: center;
  padding-right: 20px;
}
.revenue_review {
  margin-top: 30px;
  .grid_content {
    height: 300px;
    border: 1px solid #e3e3e3;
  }
}
.checkDetail {
  border: 1px solid #e3e3e3;
  margin-top: 10px;
}
.padding_ten {
  padding: 10px;
}
.flex-between {
  display: flex;
  justify-content: space-between;
}
</style>
