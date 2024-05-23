<template>
  <div class="alarm-record">
    <div class="alarm-record-title">告警信息</div>

    <div class="alarm-record-level ideal-default-margin-top">
      <div
        v-for="(item, index) of levelArray"
        :key="index"
        class="flex-row alarm-record-level-item"
      >
        <div
          class="flex-column alarm-record-level-item-info"
          :style="{
            borderRight: index !== levelArray.length - 1 ? borderRight : ''
          }"
        >
          <div>{{ item.label }}</div>
          <div
            class="alarm-record-level-item-count"
            :style="{ color: item.color }"
          >
            {{ item.count }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 告警记录组件
 */
import { homeAlarmStatistics } from '@/api/java/home'

onMounted(() => {
  getStatistics()
})
const dataArray = ref<any[]>([])
const getStatistics = () => {
  const params = {}
  homeAlarmStatistics(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        dataArray.value = data
      } else {
        dataArray.value = []
      }
    })
    .catch(_ => {
      dataArray.value = []
    })
}
watch(
  () => dataArray.value,
  value => {
    if (value.length) {
      levelArray.value.forEach((item: any) => {
        value.forEach((child: any) => {
          if (item.key === child.enlevel) {
            item.count = child.count
          }
        })
      })
    }
  }
)
const borderRight = ref('1px solid #F3F3F4')
const timeArray = [
  { label: '待处理告警' },
  { label: '24H告警' },
  { label: '月度告警' }
]
const selectIndex = ref(0)
const clickTime = (index: number) => {
  selectIndex.value = index
}

const disasterImg = new URL('@/assets/alarm-disaster.png', import.meta.url).href
const generalImg = new URL('@/assets/alarm-general.png', import.meta.url).href
const promptImg = new URL('@/assets/alarm-prompt.png', import.meta.url).href
const severityImg = new URL('@/assets/alarm-severity.png', import.meta.url).href
const levelArray: any = ref([
  {
    img: disasterImg,
    label: '致命告警',
    count: '0',
    color: '#FF5051',
    key: 'CRITICIZE'
  },
  {
    img: severityImg,
    label: '严重告警',
    count: '0',
    color: '#FEA864',
    key: 'BAD'
  },
  {
    img: generalImg,
    label: '警告告警',
    count: '0',
    color: '#FEE043',
    key: 'WARN'
  },
  {
    img: promptImg,
    label: '提醒告警',
    count: '0',
    color: '#5080F5',
    key: 'LOG'
  }
])
</script>

<style scoped lang="scss">
.alarm-record {
  background-color: white;
  margin-left: 10px;
  padding: $idealPadding;
  .flex-row-between {
    align-items: center;
    justify-content: space-between;
  }
  .alarm-record-title {
    color: #2b2f39;
    font-weight: 500;
    font-size: $mediumFontSize;
  }
  .alarm-record-time {
    background-color: #eff0f6;
    border-radius: $circleRadiusSize;
    .alarm-record-time-item,
    .alarm-record-time-item-active {
      padding: 3px 5px;
      margin: 3px 5px;
      cursor: pointer;
      border-radius: $circleRadiusSize;
    }
    .alarm-record-time-item-active {
      background-color: white;
    }
  }
  .alarm-record-level {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    background-color: #fafafa;
    .alarm-record-level-item {
      width: 25%;
      align-items: center;
      justify-content: center;
      padding: $idealPadding 0;
      .alarm-record-level-item-info {
        align-items: center;
        width: 100%;
        .alarm-record-level-item-count {
          color: #2b2f39;
          font-weight: 600;
          font-size: 18px;
        }
      }
      :deep(.el-divider--horizontal) {
        margin: 10px 0;
      }
    }
  }
  :deep(.el-divider--vertical) {
    height: 20px;
  }
}
</style>
