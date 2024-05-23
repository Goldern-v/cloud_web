<template>
  <div id="pieEcharts" style="width: 100%; height: 400px"></div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts'

interface customData {
  statisticalValue?: any[] //统计值
}
const props = withDefaults(defineProps<customData>(), {
  statisticalValue: () => [] //统计值
})

const statisticalData = ref([] as any[])
const totalCost = ref(0)
watch(
  () => props.statisticalValue,
  arr => {
    statisticalData.value = []
    let arr1 = arr.filter((ele: any) => ele.name !== 'total' && ele.value !== 0)
    arr1.forEach((item: any) => {
      statisticalData.value.push({
        name: item.name,
        value: item.value
      })
    })
    totalCost.value = arr.find((ele: any) => ele.name === 'total').value
    initEchart()
  },
  { deep: true }
)

let myChart: any
const initEchart = () => {
  const echartDom = document.getElementById('pieEcharts') as HTMLElement
  if (myChart != null && myChart != '' && myChart != undefined) {
    myChart.dispose()
  }
  myChart = echarts.init(echartDom)
  let option = {
    legend: {
      type: 'scroll',
      bottom: '0',
      itemWidth: 17, // 图例标记的图形宽度。
      itemGap: 16, // 图例每项之间的间隔。h2hyy
      itemHeight: 7 //  图例标记的图形高度。
    },
    color: [
      '#165DFF',
      '#13C2C2',
      '#2FC25B',
      '#FACC14',
      '#F04864',
      '#8543E0',
      '#e53e31',
      '#dc7f00'
    ],
    title: {
      text: `￥${totalCost.value}`, //主标题文本
      subtext: '总费用', //副标题文本
      left: 'center',
      top: '32%',
      textStyle: {
        fontSize: 25,
        color: '#454c5c',
        align: 'center'
      },
      subtextStyle: {
        fontFamily: '微软雅黑',
        fontSize: 15,
        color: '#6c7a89'
      }
    },
    series: [
      {
        name: '',
        type: 'pie',
        center: ['50%', '40%'],
        radius: ['45%', '58%'],
        avoidLabelOverlap: false,
        emphasis: {
          label: {
            show: true,
            formatter(param: any) {
              return param.name + '\n' + ' (' + param.percent + '%)'
            },
            color: '#282828',
            fontSize: 12
          },
          labelLine: {
            lineStyle: {
              color: '#4DA5E0'
            }
          }
        },
        data: statisticalData.value,
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 5
        }
      }
    ]
  }
  myChart.setOption(option)
}
//echart图自适应
window.addEventListener('resize', function () {
  myChart.resize()
})

defineExpose({
  initEchart
})
</script>

<style lang="scss" scoped></style>
