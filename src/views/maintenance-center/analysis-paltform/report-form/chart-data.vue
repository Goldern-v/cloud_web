<template>
  <div>
    <div class="report-form__file-content">
      <div class="report-form__file-content-title">
        <span>仪表板使用情况</span>
      </div>
      <div class="flex-row report-form__file-content-date">
        <div>
          <span class="ideal-default-margin-right">年月</span>
          <el-date-picker
            v-model="selectDate"
            type="month"
            :clearable="false"
            format="YYYY-MM"
          >
          </el-date-picker>
        </div>
        <div class="flex-row data-text">查看帮助</div>
      </div>
      <div
        class="flex-row report-form__file-content-data"
        style="flex-wrap: wrap"
      >
        <div
          v-for="(item, index) in panelList"
          :key="index"
          class="file-content-panel"
        >
          <div class="panel-title">
            {{ item.title }}
          </div>
          <div
            v-if="!item.useSlot"
            class="ideal-content--small__container panel-text"
          >
            {{ item.value }}
          </div>
          <span v-for="(ele, index) in item.value" v-else :key="index">
            <span style="font-weight: 500; margin: 0 5px">{{ ele.date }}</span>
            <span class="ideal-content--small__container panel-text">{{
              ele.value
            }}</span>
          </span>
        </div>
      </div>
      <div
        class="ideal-content--small__container panel-text"
        style="padding-bottom: 20px"
      >
        仪表板访问趋势
      </div>
      <div class="report-form__file-chart">
        <div class="flex-row" style="justify-content: space-between">
          <div class="report-form__file-chart-item">
            <div>
              <span class="chart-text">当月访问量统计</span>
              <category-echarts
                ref="pageViewEchart"
                :statistical-value="monthlyVisits"
                :statistical-data="monthlyAxisData"
              ></category-echarts>
            </div>
          </div>
          <div class="report-form__file-chart-item">
            <div>
              <span class="chart-text">每日访问/编辑次数</span>
              <category-echarts
                ref="pageViewEchart"
                :statistical-value="dailyVisits"
                :statistical-data="dailyAxisData"
              ></category-echarts>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import categoryEcharts from './components/category-echarts.vue'

const pageViewEchart = ref()
nextTick(() => {
  pageViewEchart?.value.initEchart()
})

const selectDate = new Date()

const panelList: any = ref([
  { title: '当月仪表板访问次数', value: '71,033' },
  { title: '当月访问用户数量', value: '6' },
  { title: '当月访问仪表板数量', value: '5,798 ' },
  {
    title: '历史数据',
    value: [
      {
        date: '2023-03:',
        value: '21,687'
      },
      {
        date: '2023-02:',
        value: '0'
      }
    ],
    useSlot: true
  },
  {
    title: '历史数据',
    value: [
      {
        date: '2023-03:',
        value: '5'
      },
      {
        date: '2023-02:',
        value: '0'
      }
    ],
    useSlot: true
  },
  {
    title: '历史数据',
    value: [
      {
        date: '2023-03:',
        value: '1,979'
      },
      {
        date: '2023-02:',
        value: '0'
      }
    ],
    useSlot: true
  }
])

/* 当月访问量统计 */
const monthlyAxisData: any = ref([
  '2021-10',
  '2021-11',
  '2021-12',
  '2021-13',
  '2022-01',
  '2022-02',
  '2022-03',
  '2022-04',
  '2022-05'
])
const dailyInstrumentVisits: any = ref([
  '0',
  '10',
  '55',
  '35',
  '50',
  '30',
  '55',
  '60',
  '80',
  '30',
  '55'
])
const visitsPerCapita = ref([
  '0',
  '24',
  '70',
  '80',
  '60',
  '35',
  '70',
  '80',
  '90',
  '35',
  '50'
])
const usersPerCapita = ref([])
const monthlyVisits = ref<any>([
  {
    name: '人均访问次数',
    type: 'line',
    data: visitsPerCapita,
    symbol: 'circle',
    symbolSize: 10, //标记的大小
    lineStyle: {
      width: 3
    },
    itemStyle: {
      borderColor: '#fff', // 边框颜色
      borderWidth: 2 // 边框宽度
    },
    label: {
      show: true, // 在折线拐点上显示数据
      color: '#7792e7'
    }
  },
  {
    name: '日访问仪表数量',
    type: 'line',
    data: dailyInstrumentVisits,
    symbol: 'circle',
    symbolSize: 10,
    lineStyle: {
      width: 3
    },
    itemStyle: {
      borderColor: '#fff', // 边框颜色
      borderWidth: 2 // 边框宽度
    },
    label: {
      show: true,
      color: '#4d5d7b'
    }
  },
  {
    name: '日均访问用户数',
    type: 'line',
    data: usersPerCapita,
    symbol: 'circle',
    symbolSize: 10,
    itemStyle: {
      borderColor: '#fff', // 边框颜色
      borderWidth: 2 // 边框宽度
    },
    lineStyle: {
      width: 3
    },
    label: {
      show: true,
      color: '#4d5d7b'
    }
  }
])

/* 每日访问/编辑次数 */
const dailyAxisData = ref([])
const editTimes = ref([
  '0',
  '10',
  '25',
  '39',
  '25',
  '15',
  '25',
  '28',
  '16',
  '29',
  '20'
])
const viewTimes = ref([
  '0',
  '20',
  '38',
  '45',
  '35',
  '34',
  '25',
  '50',
  '48',
  '60',
  '37'
])
const dailyVisits = ref([
  {
    name: '编辑次数',
    type: 'bar',
    data: editTimes,
    lineStyle: {
      width: 3
    },
    label: {
      show: true, // 在折线拐点上显示数据
      color: '#7792e7'
    }
  },
  {
    name: '查看次数',
    type: 'bar',
    data: viewTimes,
    lineStyle: {
      width: 3
    },
    label: {
      show: true, // 在折线拐点上显示数据
      color: '#4d5d7b'
    }
  },
  {
    name: '操作次数',
    type: 'line',
    data: visitsPerCapita,
    symbol: 'circle',
    symbolSize: 10, //标记的大小
    lineStyle: {
      width: 3
    },
    itemStyle: {
      borderColor: '#fff', // 边框颜色
      borderWidth: 2 // 边框宽度
    },
    label: {
      show: true, // 在折线拐点上显示数据
      color: '#efb761'
    }
  }
])
</script>
<style lang="scss" scoped>
@import './custom.scss';
</style>
