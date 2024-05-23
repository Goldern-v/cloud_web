<template>
  <div class="monitor">
    <div class="flex-row">
      <el-radio-group v-model="timeSelect" class="ideal-default-margin-right" @change="timeChange">
        <el-radio-button
          v-for="(item, index) in timeList"
          :key="index"
          :label="item.value"
        >
          {{ item.label }}
        </el-radio-button>
      </el-radio-group>

      <div class="ideal-default-margin-right">
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD HH:mm:ss"
          @change="dateChange"
        />
      </div>

      <el-button link type="primary" @click="toMoreMonitor"
        >查看更多监控指标详情</el-button
      >
    </div>

    <div class="monitor-chart">
      <monitor-line
        v-for="(item, index) of monitorData"
        :key="index"
        ref="chart"
        :item="item"
        :statistics-data="item.statisticsData"
        :statistics-value="item.statisticsValue"
        class="monitor-chart-line"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import MonitorLine from '@/views/maintenance-center/monitor-chart/monitor-line.vue'
import { queryVmMonitorInfo } from '@/api/java/maintenance-center'
import { resourceTypeEnum } from '@/utils/enum'
import store from '@/store'
import { dayjs } from 'element-plus'

const lineData: any = ref([
  {
    name: 'CPU使用率',
    itemName: 'cpu_util',
    unit: '%'
  },
  {
    name: '内存使用率',
    itemName: 'mem_util',
    unit: '%'
  },
  {
    name: '磁盘使用率',
    itemName: 'disk_util',
    unit: '%'
  },
  {
    name: '网络流入速率',
    itemName: 'network_in_bytes_rate',
    unit: 'KB/s'
  },
  {
    name: '网络流出速率',
    itemName: 'network_out_bytes_rate',
    unit: 'KB/s'
  }
])

/**
 * 初始化赋值时间，监听时间变化请求监控数据
 */
const timeSelect = ref<number | null>(1)
const now = new Date()
const lastHour = new Date(now.getTime() - 60 * 60 * 1000)
const dateRange = ref<[Date, Date]>([lastHour, now]) //时间范围

const dateChange = (val: any) => {
  timeSelect.value = null
}

const timeList = [
  { label: '近1小时', type: 'h', value: 1 },
  { label: '近3小时', type: 'h', value: 3 },
  { label: '近12小时', type: 'h', value: 12 },
  { label: '近24小时', type: 'h', value: 24 },
  { label: '近7天', type: 'd', value: 7 },
  { label: '近30天', type: 'd', value: 30 }
]

const timeChange = (time: any) => {
  const obj = timeList.find(item => item.value === time)
  if (obj) {
    const to = new Date()
    const from =
      obj?.type === 'h'
        ? new Date(to.getTime() - obj.value * 3600000)
        : new Date(to.getTime() - obj.value * 24 * 3600000)
    dateRange.value = [from, to]
  }
}

onMounted(() => {
  queryInstanceMonitorData()
})
/**
 * 查询监控信息
 */

const route = useRoute()

const monitorData: any = ref([]) //监控信息
const queryInstanceMonitorData = () => {
  lineData.value.forEach((monitor: any) => {
    const params = {
      uuid: route.query.uuid,
      from: new Date(dateRange.value[0]).getTime(),
      to: new Date(dateRange.value[1]).getTime(),
      item_name: monitor.itemName
    }
    monitor.statisticsValue = [] //数据初始化，防止脏数据污染
    queryVmMonitorInfo(params).then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        if (data.list) {
          data.list.forEach((item: any) => {
            let valOjb = {
              date: dayjs.unix(item.sampling_time).format('MM-DD HH:mm:ss'),
              value: item.sampling_value
            }
            monitor.statisticsValue.push(valOjb)
          })
          monitor.max = data.max
          monitor.min = data.min
        }
      }
    })
  })
  monitorData.value = lineData.value
}

watch(
  () => dateRange,
  val => {
    queryInstanceMonitorData()
  },
  { deep: true }
)

onBeforeRouteLeave((to, from, next) => {
  store.routerStore.setMonitorSidebar(
    '/maintenance-center/host-machine-monitor/cloud-host-monitor'
  )
  next()
})
//查看更多监控指标
const router = useRouter()
const toMoreMonitor = () => {
  const data = JSON.stringify({
    monitorObject: resourceTypeEnum.ECS,
    uuid: route.query.uuid,
    cloudCategory: route.query.cloudCategory,
    cloudType: route.query.cloudType
  })
  router.push({
    path: '/maintenance-center/monitor-chart/index',
    query: { data }
  })
}
</script>

<style scoped lang="scss">
.monitor {
  width: calc(100% - 40px);
  background-color: white;
  padding: 20px;
  .monitor-chart {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .monitor-chart-line {
      width: calc(33% - 20px);
      height: 250px;
      margin: 20px 20px 0 0;
    }
  }
}
</style>
