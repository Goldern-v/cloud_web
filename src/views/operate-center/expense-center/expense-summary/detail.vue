<template>
  <div class="ideal-large-margin">
    <div class="expense-summary-detail flex-row header">
      <p class="title-text">{{ expenseName }}费用概览</p>
      <div class="flex-row">
        <el-date-picker
          v-model="selectDate"
          :type="datePickerType"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :clearable="false"
          :format="format"
        >
        </el-date-picker>
        <div class="flex-row custom-button" @click="handleSearch">
          <i>查询</i>
        </div>
        <div class="flex-row custom-button reset-button" @click="handleReset">
          <i>重置</i>
        </div>
      </div>
    </div>
    <div class="flex-echarts-box">
      <div class="expense-summary-detail echarts-left-box ideal-default-margin-top">
        <div class="flex-row title">
          <div class="flex-row" style="align-items: center">
            <img src="@/assets/bar-chart.png" alt="" />
            <span class="title-text">总费用趋势</span>
          </div>
          <el-select
            v-model="totalCostChartType"
            placeholder="全部"
            style="width: 20%"
          >
            <el-option
              v-for="item in totalChartTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <category-echarts
          ref="totalEchart"
          chart-id="totalEchart"
          :statistical-value="totalValue"
          :statistical-data="totalAxisData"
        ></category-echarts>
      </div>
      <div class="expense-summary-detail echarts-right-box ideal-default-margin-top">
        <div class="flex-row" style="align-items: center">
          <img src="@/assets/pie-chart.png" alt="" />
          <span class="title-text">预测今天费用</span>
        </div>
        <div style="text-align: center; margin-top: 75px">
          <img
            class="today-cost__img-box"
            src="@/assets/today-cost.png"
            alt=""
          />
          <p style="color: #366ef4; margin: 20px">
            ￥<span style="font-size: 30px">{{
              todayCostForecast.todayCost
            }}</span>
          </p>
          <span>{{ todayCostForecast.message }}</span>
          <span
            v-if="todayCostForecast.rate"
            style="
              padding: 5px 10px;
              background-color: #fff0ed;
              color: #d75149;
              margin-left: 10px;
            "
          >
            <svg-icon
              v-if="todayCostForecast.rate > 0"
              icon="arrow-up"
              style="display: inline"
            ></svg-icon>
            <svg-icon
              v-if="todayCostForecast.rate < 0"
              icon="arrow-down"
              style="display: inline"
            ></svg-icon>
          </span>
        </div>
      </div>
    </div>
    <div class="expense-summary-detail ideal-default-margin-top">
      <div class="flex-row title">
        <div class="flex-row" style="align-items: center">
          <img src="@/assets/bar-chart.png" alt="" />
          <span class="title-text">费用占比和趋势</span>
        </div>
        <div class="flex-row">
          <el-select
            v-model="selectSort"
            placeholder="请选择"
            style="width: 200px"
            @change="handleSortChange"
          >
            <el-option
              v-for="item in sortList"
              :key="item.value"
              :label="item.code"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="costChartType"
            placeholder="全部"
            class="ideal-default-margin-left"
            style="width: 200px"
          >
            <el-option
              v-for="item in costChartTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="flex-echarts-box">
        <div style="width: 29%">
          <pie-echarts
            ref="expenseRatio"
            :statistical-value="ratioValue"
          ></pie-echarts>
        </div>
        <div><el-divider direction="vertical"></el-divider></div>
        <div style="width: 70%">
          <category-echarts
            ref="costEchart"
            chart-id="costEchart"
            :statistical-value="costValue"
            :statistical-data="costAxisData"
            style="width: 100%"
          ></category-echarts>
        </div>
      </div>
    </div>
    <div class="expense-summary-detail ideal-default-margin-top">
      <div class="flex-row" style="align-items: center; margin-bottom: 20px">
        <img src="@/assets/file.png" />
        <span class="title-text">{{ expenseName }}费用明细</span>
      </div>
      <div>
        <el-input v-model="vdc" class="input-with-select" readonly>
          <template #append>
            <el-tree-select
              v-model="selectVdc"
              :data="vdcTree"
              :render-after-expand="false"
              :props="defaultProps"
              check-strictly
              clearable
            />
          </template>
        </el-input>
        <el-input v-model="resourcePool" class="input-with-select" readonly>
          <template #append>
            <el-select
              v-model="selectResourcePool"
              placeholder="全部"
              clearable
            >
              <el-option
                v-for="(item, index) of resourcePoolIds"
                :key="index + 'selectSearch'"
                :label="item.information.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </template>
        </el-input>
        <el-input
          v-model="searchValue"
          placeholder="请输入你需要搜索的内容"
          clearable
          style="width: 19%; margin: 0px 10px 10px 0"
        >
        </el-input>
      </div>
      <ideal-table-list
        :loading="dataListLoading"
        :table-data="dataList"
        :table-headers="tableHeaders"
        :page="currentPage"
        :total="total"
        @clickSizeChange="sizeChangeHandle"
        @clickCurrentChange="currentChangeHandle"
      >
      </ideal-table-list>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ElMessage, dayjs } from 'element-plus/es'
import categoryEcharts from './components/category-echarts.vue'
import pieEcharts from './components/pie-echarts.vue'
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders } from '@/types'
import {
  queryPaySummaryData,
  queryPaySummarySort,
  queryPaySummaryDetail,
  resourcePoolSelect
} from '@/api/java/operate-center'
import { timeFormatByCondition } from '@/utils/time-format'
import { vdcTreeList } from '@/api/java/public'

const route = useRoute()
const expenseData: any = ref({}) //费用总览跳转详情携带参数
const expenseName: any = ref('')

const selectDate = ref('')
const format = ref('YYYY-MM-DD')
const datePickerType = ref<'monthrange' | 'daterange'>('daterange')

onMounted(() => {
  expenseData.value = JSON.parse(route.query.data as any)
  if (expenseData.value.overviewGroup !== 'EXPENSE_TYPE') {
    tableHeaders.value.unshift({ label: '费用类型', prop: 'resourceName' })
  }
  expenseName.value = expenseData.value.name //费用名称
  datePickerType.value =
    expenseData.value.timeType === '1' ? 'daterange' : 'monthrange' //时间类型（日/月维度）
  format.value = expenseData.value.timeType === '1' ? 'YYYY-MM-DD' : 'YYYY-MM' //时间格式化
  selectDate.value = expenseData.value.date.map((item: any) => {
    return new Date(item)
  }) //时间初始化
  if (expenseData.value.overviewGroup === 'VDC') {
    selectVdc.value = expenseData.value.code //初始化赋值详情的vdc
  } else if (expenseData.value.overviewGroup === 'POOL_RESOURCE') {
    selectResourcePool.value = expenseData.value.code
  } //初始化赋值详情的资源池
  getExpenseSort()
  getVdcTree()
  getResourcePool()
  queryDetail()
})

const vdc = ref('VDC')
const resourcePool = ref('资源池')
const searchValue = ref('')

const totalEchart = ref()
const costEchart = ref()
const expenseRatio = ref()

/**
 * 列表
 */
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
//页码切换
const sizeChangeHandle = (val: number) => {
  currentPage.value = 1
  pageSize.value = val
  queryDetail()
}
const currentChangeHandle = (val: number) => {
  currentPage.value = val
  queryDetail()
}
// 列表表头
const tableHeaders = ref<IdealTableColumnHeaders[]>([
  { label: '名称', prop: 'name' },
  { label: 'VDC', prop: 'vdcName' },
  { label: '资源池', prop: 'resourcePoolName' },
  { label: '项目', prop: 'projectName' },
  { label: '时间', prop: 'payTime' },
  { label: '费用(元)', prop: 'payAmount' }
])

//费用总览
const totalStatisticalData: any = ref([]) //统计值
const totalAxisData: any = ref([]) //横轴数据
//费用趋势
const costValue: any = ref() //统计值
const costAxisData: any = ref([]) //横轴数据
//今日预测费用
const todayCostForecast = ref({
  todayCost: '',
  message: '',
  rate: 0
})
//费用占比
const ratioValue: any = ref('')

//查询费用总览分类
const selectSort = ref('')
const sortList: Ref<any[]> = ref([])
const getExpenseSort = () => {
  queryPaySummarySort()
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        sortList.value = data.filter(
          (item: any) => item.value !== expenseData.value.overviewGroup
        )
        selectSort.value = sortList.value[0].value
        query('')
      } else {
        sortList.value = []
      }
    })
    .catch(_ => {
      sortList.value = []
    })
}

//vdc
const selectVdc = ref('')
const vdcTree: Ref<any[]> = ref([])
const defaultProps = {
  children: 'sons',
  label: 'name',
  value: 'id'
}
const getVdcTree = async () => {
  try {
    const res = await vdcTreeList()
    vdcTree.value = res.data.sons
  } catch (err: any) {
    ElMessage.error(err)
  }
}
// 查询资源池
const selectResourcePool = ref('')
const resourcePoolIds: any = ref([])
const getResourcePool = () => {
  resourcePoolSelect()
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        resourcePoolIds.value = data
      } else {
        resourcePoolIds.value = []
      }
    })
    .catch(_ => {
      resourcePoolIds.value = []
    })
}

watch(
  () => [selectVdc.value, selectResourcePool.value, searchValue.value],
  ([vdc, resourcePool, value]) => {
    queryDetail()
  }
)

const handleSortChange = () => {
  query('dimension')
}

/* 总费用趋势折线图 */
//charts图配置项
const totalValue = ref<any>([
  {
    type: 'line',
    data: totalStatisticalData,
    symbolSize: 5, //标记的大小
    lineStyle: {
      color: '#366EF4',
      width: 3,
      shadowColor: 'rgba(57, 117, 255,0.5)' //设置折线阴影
    },
    // 区域填充样式
    areaStyle: {
      opacity: 0.8,
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: 'rgba(57, 117, 255,0.5)' },
          { offset: 1, color: 'rgba(57, 117, 255,0)' }
        ],
        global: false
      }
    },
    smooth: true
  }
])

//（折线图/柱状图）切换
const totalCostChartType = ref('line')
const costChartType = ref('line')
// 费用趋势图类型
const totalChartTypeList: any = [
  { label: '折线图', value: 'line' },
  { label: '柱状图', value: 'bar' }
]
const costChartTypeList: any = [
  { label: '折线图', value: 'line' },
  { label: '堆叠柱状图', value: 'bar' }
]

watch(
  () => totalCostChartType.value,
  val => {
    //监听总费用趋势图类型变化
    totalValue.value[0].type = val
    totalEchart.value.isBoundaryGap = val === 'bar'
    totalEchart.value.initEchart()
  },
  { deep: true }
)

watch(
  () => costChartType.value,
  val => {
    //监听总费用趋势图类型变化
    costValue.value.forEach((ele: any) => {
      ele.type = val
    })
    costEchart.value.isBoundaryGap = val === 'bar'
    costEchart.value.initEchart()
  },
  { deep: true }
)

//公共参数
const commonParams = () => {
  const params = {
    startTime: timeFormatByCondition(selectDate.value[0], 'YYYY-MM-DD'),
    endTime: timeFormatByCondition(selectDate.value[1], 'YYYY-MM-DD'),
    timeType: expenseData.value.timeType,
    overviewGroup: expenseData.value.overviewGroup,
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    overviewGroupSkip: selectSort.value,
    isSkip: true,
    searchContent: searchValue.value,
    resourceType:
      expenseData.value.overviewGroup === 'EXPENSE_TYPE'
        ? expenseData.value.code
        : '',
    costId:
      expenseData.value.overviewGroup === 'COST' ? expenseData.value.code : '',
    projectId:
      expenseData.value.overviewGroup === 'PROJECT'
        ? expenseData.value.code
        : ''
  }
  return params
}

//请求echart图表数据
const query = async (type: string) => {
  const params = Object.assign(commonParams(), {
    resourcePoolId:
      expenseData.value.overviewGroup === 'POOL_RESOURCE'
        ? expenseData.value.code
        : '',
    vdcId:
      expenseData.value.overviewGroup === 'VDC' ? expenseData.value.code : ''
  })
  const res: any = await queryPaySummaryData(params)
  const { data, code } = res
  if (code === 200) {
    if (!type) {
      //总费用
      totalStatisticalData.value = data.totalCostTrendChart.series
      totalAxisData.value = data.totalCostTrendChart.xAxis
      //今日费用预测
      todayCostForecast.value.message = data.costForecastChart.message
      todayCostForecast.value.todayCost = data.costForecastChart.todayFee
      todayCostForecast.value.rate = data.costForecastChart.rate
    }
    //费用趋势
    if (data.costTrendChart.series) {
      let arr: any = []
      data.costTrendChart.series.forEach((item: any, index: number) => {
        arr.push({
          name: item.name,
          type: costChartType.value,
          data: item.data,
          symbolSize: 5, //标记的大小
          lineStyle: {
            width: 3
          },
          itemStyle: {
            borderWidth: 5
          },
          smooth: false
        })
      })
      costAxisData.value = data.costTrendChart.xAxis
      costValue.value = arr.filter((ele: any) => {
        return ele.data.some((it: number) => {
          return it !== 0
        })
      })
    }

    //费用占比
    ratioValue.value = data.costRateChart.itemRateList
  }
}

const dataListLoading = ref(false)
const dataList = ref([])
//请求费用明细数据
const queryDetail = async () => {
  dataList.value = []
  const params = Object.assign(commonParams(), {
    resourcePoolId: selectResourcePool.value || '',
    vdcId: selectVdc.value || ''
  })
  const res: any = await queryPaySummaryDetail(params)
  const { data, code } = res
  if (code === 200) {
    data.costItemsChart.costItemsChartPage.data.forEach((item: any) => {
      item.payTime = dayjs(item.payTime).format('YYYY-MM-DD HH:mm:ss')
    })
    //费用明细
    dataList.value = data.costItemsChart.costItemsChartPage.data
    total.value = data.costItemsChart.costItemsChartPage.total
  } else {
    dataList.value = []
    total.value = 0
  }
}

/* 方法 */
const handleSearch = () => {
  query('')
  queryDetail()
}
const handleReset = () => {
  query('')
  queryDetail()
}

defineExpose({
  selectDate
})
</script>
<style lang="scss" scoped>
.expense-summary-detail {
  width: 100%;
  padding: 20px;
  background-color: white;
  box-sizing: border-box;
}

.header {
  justify-content: space-between;
  align-items: center;
}
.flex-echarts-box {
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;

  .echarts-left-box {
    width: 70%;
  }

  .echarts-right-box {
    width: 29%;
  }
}

.title {
  justify-content: space-between;
  margin-bottom: 20px;
}

.title-text {
  font-size: 18px;
  font-weight: bold;
  margin-left: 10px;
}

.el-divider--vertical {
  display: inline-block;
  width: 5px;
  height: 100%; //更改竖向分割线长度
  margin: 0 8px;
  vertical-align: middle;
  position: relative;
}
.custom-button {
  border: 1px solid var(--el-color-primary);
  border-radius: $circleRadiusSize;
  color: var(--el-color-primary);
  cursor: pointer;
  align-items: center;
  padding: 0 12px;
  &:hover {
    background-color: var(--theme-menu-hover-bg-color);
  }
  margin-left: 10px;
}
.reset-button {
  border: 1px solid var(--el-border-color-light);
  background: white;
  color: var(--el-button-text-color);
  &:hover {
    border-color: var(--el-border-color-light);
  }
  margin-left: 10px;
}
.input-with-select {
  margin: 0px 10px 10px 0;
  width: 19%;
  :deep .el-input__wrapper {
    background-color: var(--el-fill-color-light);
  }
  :deep(.el-input-group__append) {
    width: 80%;
    background-color: var(--el-fill-color-blank);
    padding: 0;
  }
}
:deep(
    .el-input-group--append
      .el-input-group__append
      .el-select
      .el-select__wrapper
  ) {
  height: 34px;
}
</style>
