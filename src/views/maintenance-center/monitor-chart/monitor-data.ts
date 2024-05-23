import {
  queryVmMonitorInfo,
  queryVmMonitorIndicators
} from '@/api/java/maintenance-center'
import store from '@/store'
import { dayjs } from 'element-plus'

export const instanceMonitor = () => {
  const monitorIndicator: any = ref([])
  //请求监控指标
  const queryInstanceMonitorIndicators = (detail: any, dateRange: any) => {
    //detail路由传参云平台类别(cloudCategory)、云平台类型(cloudType)、监控对象(monitorObject)、uuid
    const { cloudType, cloudCategory } = detail
    monitorIndicator.value = []
    const params = {
      cloudType,
      cloudCategory,
      resourceType: detail.monitorObject,
      userId: store.userStore.user.id
    }
    queryVmMonitorIndicators(params).then((res: any) => {
      monitorIndicator.value = res.data
      queryInstanceMonitorData(detail, dateRange, monitorIndicator)
    })
  }

  const monitorData: any = ref([]) //选中的监控信息
  //监控数据
  const queryInstanceMonitorData = (
    detail: any,
    dateRange: any,
    setMonitorIndicators: any
  ) => {
    setMonitorIndicators.value.forEach((monitor: any) => {
      const uuid = detail.uuid
      const params = {
        uuid,
        from: new Date(dateRange.value[0]).getTime(),
        to: new Date(dateRange.value[1]).getTime(),
        item_name: monitor.itemName
      }
      const statisticsValue: any = []
      queryVmMonitorInfo(params).then((res: any) => {
        const { code, data } = res
        if (code === 200) {
          if (data.list) {
            data.list.forEach((item: any) => {
              // 数据初始化，防止脏数据污染
              const valOjb = {
                date: dayjs.unix(item.sampling_time).format('MM-DD HH:mm:ss'),
                value: item.sampling_value
              }
              statisticsValue.push(valOjb)
            })
            monitor.statisticsValue = statisticsValue
            monitor.max = data.max
            monitor.min = data.min
          }
        } else {
          monitor.statisticsValue = []
          monitor.max = ''
          monitor.min = ''
        }
      })
    })
    monitorData.value = setMonitorIndicators.value
  }

  return {
    queryInstanceMonitorIndicators,
    queryInstanceMonitorData, //请求云主机监控数据
    monitorData
  }
}
