<template>
  <div ref="chart" style="width: 100%; height: 300px"></div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'
import { defineExpose } from 'vue'

interface customData {
  statisticalValue?: any[] //统计值
  statisticalData?: any[] //横轴标签
}
const props = withDefaults(defineProps<customData>(), {
  statisticalValue: () => [], //统计值
  statisticalData: () => [] //横轴标签
})

const intervalNum = ref(0) //横轴标签间隔显示数量

const chart = ref()
let myChart: any
const initEchart = () => {
  if (myChart != null && myChart != '' && myChart != undefined) {
    myChart.dispose()
  }
  myChart = echarts.init(chart.value)
  let date: string[] = []
  let data = props.statisticalData
  data.forEach((item: any) => {
    date.push(item)
  })
  let option = {
    grid: {
      // top: '0',
      left: '5%',
      right: '5%',
      bottom: '5%',
      containLabel: true
    },
    color: ['#7792e7', '#4d5d7b', '#efb761'],
    title: {
      show: props.statisticalValue.length === 0,
      textStyle: {
        color: 'grey',
        fontSize: 16,
        fontFamily: 'pingfangRegular'
      },
      text: '暂无数据',
      left: 'center',
      top: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'none'
      },
      position: function (
        point: any,
        params: any,
        dom: any,
        rect: any,
        size: any
      ) {
        // 提示框位置
        let x = 0
        let y = 0
        if (point[0] + size.contentSize[0] + 10 > size.viewSize[0]) {
          x = point[0] - size.contentSize[0] - 10
        } else {
          x = point[0] + 10
        }
        if (point[1] + size.contentSize[1] + 10 > size.viewSize[1]) {
          y = point[1] - size.contentSize[1] - 10
        } else {
          y = point[1] + 10
        }
        return [x, y]
      }
    },
    legend: {
      show: true,
      top: '0%',
      type: 'scroll', //图例滚动
      // right: '10%',
      itemWidth: 12, // 图例标记的图形宽度。
      //   itemGap: 20, // 图例每项之间的间隔。
      itemHeight: 2, //  图例标记的图形高度。
      color: '#000',
      fontSize: 14,
      padding: [0, 8, 0, 8]
    },
    xAxis: {
      type: 'category',
      data: date,
      boundaryGap: false,
      axisTick: {
        show: false //隐藏X轴刻度
      },
      axisLine: {
        show: true, // 显示纵轴线
        lineStyle: {
          color: '#CCCCCC'
        }
      },
      axisLabel: {
        show: true,
        interval: intervalNum.value, //设置标签间隔 0显示所有标签
        color: '#808080',
        fontSize: 14,
        fontFamily: 'Source Han Sans CN-Regular'
      }
    },
    yAxis: [
      {
        type: 'value',
        nameTextStyle: {
          color: '#808080',
          fontSize: 12,
          fontFamily: 'Source Han Sans CN-Regular',
          align: 'left',
          verticalAlign: 'center'
        },
        axisLabel: {
          color: '#808080',
          fontSize: 12
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: 'rgba(223, 223, 223, 1)'
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        }
      }
    ],
    series: props.statisticalValue
  }
  myChart.setOption(option)
}
//echart图自适应
window.addEventListener('resize', function () {
  myChart.resize()
})
watch(
  () => props.statisticalValue,
  value => {
    initEchart()
  }
)
watch(
  () => props.statisticalData,
  value => {
    initEchart()
  }
)
onMounted(() => {
  initEchart()
})
defineExpose({
  initEchart
})
</script>

<style lang="scss" scoped></style>
