import * as echarts from 'echarts'

export const useEcharts = () => {
  // 初始化echart
  const allocEchart = (elementId: string) : any => {
    const echartDom = document.getElementById(elementId) as HTMLElement
    const myEchart = echarts.init(echartDom) // echarts实例不能用响应式变量
    return myEchart
  }

  // 监听legend点击,更改title标题总数
  const listenLegendSelectChange = (myEchart: any, option: any) => {
    if (!myEchart) { return }
    // 数据选中状态发生变化时触发的事件
    myEchart.on('legendselectchanged', function (params: any) {
      let tempArray: any[] = [] // 将点击后的数组设为空（每点击一次就重新判断添加）
      // 循环点击图例后获取到的名字
      for (let key in params.selected) {
        // 判断值是否为true 将值为true的名字push到tempArray数组当中保留起来
        if (params.selected[key]) {
          tempArray.push(key)
        }
      }
      let echartSum = 0 //将总数的值设为0（每点击一次就重新计算）
      // 循环判断数据的全部数据里的name值是否与我们点击图例后所剩数据的数组相等
      // 相等的话就将其value值进行相加得出点击图例后所剩数据的总数
      option.series[0].data.forEach((item: any) => {
        tempArray.forEach(v => {
          if (item.name === v) {
            echartSum += item.value
          }
        })
      })
      option.title.text = `${echartSum}`
      // 重新设置配置项和数据
      myEchart.setOption(option)
    })
  }

  return {
    allocEchart,
    listenLegendSelectChange
  }
}