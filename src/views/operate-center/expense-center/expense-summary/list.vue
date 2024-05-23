<template>
  <div class="expense-summary-container">
    <div class="expense-summary-box select-box">
      <ideal-input-select
        :filter="filter"
        :options="sortList"
        default-assign
        :slot-array="slotArray"
        @clickSearch="clickSearch"
        @clickReset="clickReset"
      >
        <template #expenseType>
          <el-input v-model="expenseType" class="input-with-select" readonly>
            <template #append>
              <el-select
                v-model="expense"
                clearable
                placeholder="全部"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, index) of costTypeList"
                  :key="index + 'selectSearch'"
                  :label="item.name"
                  :value="item.code"
                >
                </el-option>
              </el-select>
            </template>
          </el-input>
        </template>
        <template #vdc>
          <el-input v-model="VDC" class="input-with-select" readonly>
            <template #append>
              <el-tree-select
                v-model="selectVdc"
                :data="vdcTree"
                :render-after-expand="false"
                :props="defaultProps"
                check-strictly
                clearable
                style="width: 100%"
              />
            </template>
          </el-input>
        </template>
        <template #timeGranularity>
          <el-input
            v-model="timeGranularity"
            class="input-with-select"
            readonly
          >
            <template #append>
              <el-select
                v-model="selectTimeGranularity"
                placeholder="全部"
                style="width: 100%"
                @change="timeChange"
              >
                <el-option
                  v-for="(item, index) of timeOption"
                  :key="index + 'selectSearch'"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>
          </el-input>
        </template>
        <template #date>
          <el-date-picker
            v-model="selectDate"
            :type="datePickerType"
            range-separator="至"
            :start-placeholder="startText"
            :end-placeholder="endText"
            :clearable="false"
            :format="format"
            style="width: 19%"
          />
        </template>
        <template #cost>
          <el-input v-model="costCenter" class="input-with-select" readonly>
            <template #append>
              <el-select
                v-model="selectCostCenter"
                clearable
                placeholder="全部"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, index) of costCenterList"
                  :key="index + 'selectSearch'"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </template>
          </el-input>
        </template>
        <template #cloudPlatForm>
          <el-input v-model="cloudPlatForm" class="input-with-select" readonly>
            <template #append>
              <el-select
                v-model="selectCloudPlatForm"
                clearable
                placeholder="全部"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, index) of platformList"
                  :key="index + 'selectSearch'"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </template>
          </el-input>
        </template>
        <template #project>
          <el-input v-model="project" class="input-with-select" readonly>
            <template #append>
              <el-select
                v-model="selectProject"
                clearable
                placeholder="全部"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, index) of projectList"
                  :key="index + 'selectSearch'"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </template>
          </el-input>
        </template>
      </ideal-input-select>
    </div>
    <div class="flex-echarts-box">
      <div class="expense-summary-box echarts-left-box">
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
          :statistical-value="totalValue"
          :statistical-data="totalAxisData"
        ></category-echarts>
      </div>
      <div class="expense-summary-box echarts-right-box">
        <div class="flex-row" style="align-items: center">
          <img src="@/assets/pie-chart.png" alt="" />
          <span class="title-text">预测今天费用</span>
        </div>
        <div style="text-align: center; margin-top: 75px">
          <img
            class="todat-cost__img-box"
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
    <div class="flex-echarts-box">
      <div class="expense-summary-box echarts-left-box">
        <div class="flex-row title">
          <div class="flex-row" style="align-items: center">
            <img src="@/assets/bar-chart.png" alt="" />
            <span class="title-text">费用趋势</span>
          </div>
          <el-select
            v-model="costChartType"
            placeholder="全部"
            style="width: 20%"
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
        <category-echarts
          ref="costEchart"
          :statistical-value="costValue"
          :statistical-data="costAxisData"
        ></category-echarts>
      </div>
      <div class="expense-summary-box echarts-right-box">
        <div class="flex-row" style="align-items: center">
          <img src="@/assets/pie-chart.png" alt="" />
          <span class="title-text">费用占比</span>
        </div>
        <pie-echarts
          ref="expenseRatio"
          :statistical-value="ratioValue"
        ></pie-echarts>
      </div>
    </div>
    <div class="cost-rank-box expense-summary-box">
      <div class="flex-row" style="align-items: center">
        <img src="@/assets/pie-chart.png" alt="" />
        <span class="title-text">费用排行</span>
        <el-tooltip
          effect="dark"
          placement="right"
          content="点击具体费用类型可查看该项费用详情"
          popper-class="vdc-form--create__tooltip"
        >
          <svg-icon icon="question-icon"></svg-icon>
        </el-tooltip>
      </div>
      <div class="flex-row progress_bar">
        <div
          v-for="(item, index) in productList"
          :key="index"
          style="width: 50%; padding: 0 20px; box-sizing: border-box"
        >
          <el-row style="align-items: center" @click="toDetail(item)">
            <el-col :span="1">
              <div
                style="
                  width: 20px;
                  height: 20px;
                  border-radius: 20px;
                  text-align: center;
                  line-height: 20px;
                "
                :class="index <= 2 ? 'topThree' : 'latter'"
              >
                {{ index + 1 }}
              </div>
            </el-col>
            <el-col :span="8">{{ item.name }}</el-col>
            <el-col :span="11">
              <div style="width: 80%">
                <el-progress :percentage="item.rate" :show-text="false" />
              </div>
            </el-col>
            <el-col :span="4">￥{{ item.value }}元</el-col>
          </el-row>
          <el-divider />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus/es'
import categoryEcharts from './components/category-echarts.vue'
import pieEcharts from './components/pie-echarts.vue'
import {
  queryPaySummarySort,
  queryBillCostPage,
  expenseTypeList,
  queryCloudPlatformList,
  queryPaySummaryData
} from '@/api/java/operate-center'
import { queryProjectListApi } from '@/api/java/business-center'
import { vdcTreeList } from '@/api/java/public'
import { timeFormatByCondition } from '@/utils/time-format'

onMounted(() => {
  getExpenseSort()
  getVdcTree()
  getCostCenter()
  getExpenseType()
  getCloudPlatformList()
  getProjectList()
})

const filter = ref({
  name: '分类',
  type: 'classfiy',
  searchValue: 'value',
  selectLabel: 'code'
})
// 搜索插槽
const slotArray = [
  'expenseType',
  'vdc',
  'timeGranularity',
  'date',
  'cost',
  'cloudPlatForm',
  'project',
  'user'
]
const expenseType = ref('费用类型')
const VDC = ref('VDC')
const timeGranularity = ref('时间粒度')
const costCenter = ref('成本中心')
const cloudPlatForm = ref('云平台')
const project = ref('项目')

//查询费用总览分类
const selectSort = ref('')
const sortList: Ref<any[]> = ref([])
const getExpenseSort = () => {
  queryPaySummarySort()
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        sortList.value = data
        selectSort.value = sortList.value[0].value
        query()
      } else {
        sortList.value = []
      }
    })
    .catch(_ => {
      sortList.value = []
    })
}
//查询费用类型列表
const expense = ref('')
const costTypeList: Ref<any[]> = ref([])
const getExpenseType = () => {
  expenseTypeList()
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        costTypeList.value = data
      } else {
        costTypeList.value = []
      }
    })
    .catch(_ => {
      costTypeList.value = []
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
//成本中心
const selectCostCenter = ref('')
const costCenterList: Ref<any[]> = ref([])
const getCostCenter = async () => {
  try {
    const res = await queryBillCostPage()
    costCenterList.value = res.data
  } catch (err: any) {
    ElMessage.error(err)
  }
}
//时间粒度
const now = new Date() //今天的时间
const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) //距离今天过去一周
const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1) //本月第一天
const lastFirstDayOfMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1) //上个个月第一天
const selectDate = ref<[Date, Date]>([lastWeek, now])
const selectTimeGranularity = ref('1')
const timeOption = ref([
  { label: '天', value: '1' },
  { label: '月', value: '2' }
])
const startText = ref('开始日期')
const endText = ref('结束日期')
const datePickerType = ref<'monthrange' | 'daterange'>('daterange')
const format = ref('YYYY-MM-DD HH:mm:ss')
const timeChange = (val: string) => {
  datePickerType.value = val === '1' ? 'daterange' : 'monthrange'
  startText.value = val === '1' ? '开始日期' : '开始月份'
  endText.value = val === '1' ? '结束日期' : '结束月份'
  selectDate.value =
    val === '1' ? [lastWeek, now] : [lastFirstDayOfMonth, firstDayOfMonth]
  format.value = val === '1' ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM'
}

//查询云平台
const selectCloudPlatForm = ref('')
const platformList: any = ref([])
const getCloudPlatformList = () => {
  queryCloudPlatformList()
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        platformList.value = data
      } else {
        platformList.value = []
      }
    })
    .catch(_ => {
      platformList.value = []
    })
}
//获取项目列表
const selectProject = ref('')
const projectList: Ref<any[]> = ref([])
const getProjectList = async () => {
  const res: any = await queryProjectListApi()
  if (res.code === 200) {
    const { data } = res
    projectList.value = data
  } else {
    projectList.value = []
  }
}

const totalEchart = ref()
const costEchart = ref()
const expenseRatio = ref()
nextTick(() => {
  totalEchart?.value.initEchart()
  // costEchart?.value.initEchart()
  expenseRatio?.value.initEchart()
})
//费用总览
const totalStatisticalData: any = ref([])
const totalAxisData: any = ref([])
//费用趋势
const costAxisData: any = ref([])
const costValue: any = ref([])
//费用排行
const productList: any = ref([])
//今日预测费用
const todayCostForecast = ref({
  todayCost: '',
  message: '',
  rate: 0
})
//费用占比
const ratioValue: any = ref([])
const query = async () => {
  let params = {
    startTime: timeFormatByCondition(
      selectDate.value[0],
      'YYYY-MM-DD HH:MM:SS'
    ),
    endTime: timeFormatByCondition(selectDate.value[1], 'YYYY-MM-DD HH:MM:SS'),
    timeType: selectTimeGranularity.value,
    overviewGroup: selectSort.value,
    isSkip: false,
    ...searchParams
  }
  const res: any = await queryPaySummaryData(params)
  const { data, code } = res
  if (code === 200) {
    //总费用
    totalStatisticalData.value = data.totalCostTrendChart.series
    totalAxisData.value = data.totalCostTrendChart.xAxis
    //费用排行
    productList.value = data.costRankChart.itemRankList
    //费用趋势
    if (data.costTrendChart.series) {
      let arr: any = []
      data.costTrendChart.series.forEach((item: any, index: number) => {
        arr.push({
          name: item.name,
          type: 'line',
          // stack: 'total',
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
    //今日费用预测
    todayCostForecast.value.message = data.costForecastChart.message
    todayCostForecast.value.todayCost = data.costForecastChart.todayFee
    todayCostForecast.value.rate = data.costForecastChart.rate || 0
    //费用占比
    ratioValue.value = data.costRateChart.itemRateList
  } else {
  }
}
//统计项
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
    //折线拐点标志的样式
    // itemStyle: {
    //   color: '#366EF4',
    //   borderColor: '#366EF4',
    //   borderWidth: 5
    // },
    smooth: true
  }
])

//（折线图/柱状图）
const totalCostChartType = ref('line')
const costChartType = ref('line')
// 费用趋势图类型
const totalChartTypeList: any = [
  { label: '面积图', value: 'line' },
  { label: '柱状图', value: 'bar' }
]
const costChartTypeList: any = [
  { label: '折线图', value: 'line' },
  { label: '堆叠柱状图', value: 'bar' }
]

watch(
  //监听总费用趋势图类型变化
  () => totalCostChartType.value,
  val => {
    totalValue.value[0].type = val
    totalEchart.value.isBoundaryGap = val === 'bar'
    totalEchart.value.initEchart()
  },
  { deep: true }
)

watch(
  //监听费用趋势图类型变化
  () => costChartType.value,
  val => {
    costValue.value.forEach((ele: any) => {
      ele.type = val
    })
    costEchart.value.isBoundaryGap = val === 'bar'
    costEchart.value.initEchart()
  },
  { deep: true }
)

/* 方法 */
let searchParams = {
  resourceType: '',
  vdcId: '',
  costId: '',
  cloudPlatformId: '',
  projectId: ''
}
// 搜索
const clickSearch = (value: string, searchType: string) => {
  selectSort.value = value
  searchParams.resourceType = expense.value
  searchParams.vdcId = selectVdc.value
  searchParams.costId = selectCostCenter.value
  searchParams.cloudPlatformId = selectCloudPlatForm.value
  searchParams.projectId = selectProject.value
  query()
}
// 重置
const clickReset = () => {
  expense.value = ''
  selectVdc.value = ''
  selectCostCenter.value = ''
  selectCloudPlatForm.value = ''
  selectProject.value = ''
  searchParams = {
    resourceType: '',
    vdcId: '',
    costId: '',
    cloudPlatformId: '',
    projectId: ''
  }
  query()
}
const router = useRouter()
//单个统计项费用详情
const toDetail = (item: object) => {
  const expenseData = {
    ...searchParams,
    ...item,
    date: selectDate.value,
    overviewGroup: selectSort.value,
    timeType: selectTimeGranularity.value
  }
  let data = JSON.stringify(expenseData)
  router.push({
    path: '/operate-center/expense-center/expense-summary/detail',
    query: { data }
  })
}
</script>
<style lang="scss" scoped>
.expense-summary-container {
  margin: 20px;
  box-shadow: 0 0 5px 2px rgba($color: #333333, $alpha: 0.03);
}
.expense-summary-box {
  padding: 20px;
  background-color: white;
  box-sizing: border-box;
}

.input-with-select {
  margin: 0px 10px 10px 0;
  width: 19%;
  :deep(.el-input-group__append) {
    width: 80%;
    background-color: var(--el-fill-color-blank);
    padding: 0;
  }

  :deep .el-input__wrapper {
    background-color: var(--el-fill-color-light);
  }
}

.flex-echarts-box {
  display: flex;
  justify-content: space-between;

  .echarts-left-box {
    width: 70%;
    margin-top: 20px;
  }

  .echarts-right-box {
    width: 29%;
    margin-top: 20px;
  }
}

.cost-rank-box {
  margin-top: 20px;

  .progress_bar {
    flex-wrap: wrap;
    margin: 50px 0 30px 0;
  }

  .progress_item {
    width: 50%;
    padding: 10px;
  }
  .el-divider--horizontal {
    margin: 20px 0;
  }
}

.title {
  justify-content: space-between;
}

.title-text {
  font-size: 18px;
  font-weight: bold;
  margin: 0 10px;
}

//费用排行序号颜色
.topThree {
  background-color: #366ef4;
  color: #fff;
}

.latter {
  background-color: #ccc;
}
</style>
