<template>
  <div class="task-progress">
    <ul class="task-progress-container">
      <li
        v-for="(item, index) of dataArray"
        :key="index"
        class="flex-row task-progress-item"
        @click="clickToTaskProgress()"
      >
        <svg-icon
          icon="status-time"
          class="ideal-svg-margin-right"
          class-name="status-time"
        />
        <div>
          <div class="task-progress-title">{{ item.type }}正在执行中</div>
          <el-progress :percentage="item.progress" :width="12" />
        </div>
        <svg-icon
          icon="close-icon"
          class="ideal-svg-margin-left"
          @click.stop="closeTaskProgress(index)"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import store from '@/store'
import { IdealEventFlow } from '@/types'
import { eventProgressDetail } from '@/api/java/public'

const eventFlowArray = computed(() => store.resourceStore.eventFlow)
const dataArray = ref<IdealEventFlow[]>([])

let timer: any = null
onMounted(() => {
  if (eventFlowArray.value.length) {
    handleInterval()
  }
})
// 监听pinia 事件流
watch(() => eventFlowArray.value, value => {
  if (value.length) {
    handleInterval()
  } else {
    clearInterval(timer)
    timer = null
  }
},{ deep: true })

const handleInterval = () => {
  if (timer) { return }
  timer = setInterval(() => {
    handleProgress()
  }, 10000)
}

const handleProgress = () => {
  const isComplete = dataArray.value.every(
    (item: IdealEventFlow) => item.progress === 100
  )

  if (isComplete && dataArray.value.length) {
    return
  }
  // 查询事件流id详情
  eventFlowArray.value.forEach((item: IdealEventFlow) => {
    getDetail(item)
  })

  setTimeout(() => {
    filterEventFlow()
  }, 10000)
}

const getDetail = (item: IdealEventFlow) => {
  if (!item?.eventFlowId) { return }
  eventProgressDetail({ eventFlowId: item.eventFlowId }).then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      const result = dataArray.value.find((row: IdealEventFlow) => row.eventFlowId === item.eventFlowId)
      if (result) {
        result.progress = data?.eventFlowPercent
        result.type = data?.routeTypeName
      } else {
        const newItem: IdealEventFlow = {
          eventFlowId: item.eventFlowId,
          progress: data?.eventFlowPercent,
          type: data?.routeTypeName
        }
        dataArray.value.push(newItem)
      }
    }
  })
}
// 清空进度100任务
const filterEventFlow = () => {
  const tempArray: IdealEventFlow[] = dataArray.value.filter(
    (item: IdealEventFlow) => item.progress !== 100
  )
  store.resourceStore.eventFlow = tempArray
  dataArray.value = tempArray
}
// 关闭当前事件流
const closeTaskProgress = (index: number) => {
  const eventFlowId = dataArray.value[index].eventFlowId
  const tempArray: IdealEventFlow[] = dataArray.value.filter(
    (item: IdealEventFlow) => item.eventFlowId !== eventFlowId
  )
  store.resourceStore.eventFlow = tempArray
  dataArray.value = tempArray
}

const router = useRouter()
const clickToTaskProgress = () => {
  router.push({ path: '/multi-cloud/task/list' })
}

onUnmounted(() => {
  if (timer) {
    clearInterval(timer) // 清除定时器
  }
})
</script>

<style scoped lang="scss">
.task-progress {
  position: absolute;
  top: 0px;
  right: 20px;
  overflow: hidden;
  .task-progress-title {
    color: var(--el-color-primary);
  }
  .task-progress-container {
    height: 100%;
    overflow: hidden;
    animation: 10s taskLoop linear infinite normal;
    &:hover {
      animation-play-state: paused;
      -webkit-animation-play-state: paused;
    }
    .task-progress-item {
      margin: 5px 0;
    }
  }
  .task-progress-container ul {
    list-style-type: none;
  }
}
@keyframes taskLoop {
  0% {
    transform: translateY(52px); // 上下边距20px 面包屑字体高度12px
    -webkit-transform: translateY(52px);
  }
  100% {
    transform: translateY(-120%);
    -webkit-transform: translateY(-120%);
  }
}
@-webkit-keyframes taskLoop {
  0% {
    transform: translateY(52px);
    -webkit-transform: translateY(52px);
  }
  100% {
    transform: translateY(-120%);
    -webkit-transform: translateY(-120%);
  }
}
:deep(.status-time) {
  color: var(--el-color-primary);
}
:deep(.close-icon) {
  color: var(--el-color-primary);
}
:deep(.el-progress__text) {
  min-width: 20px;
}
:deep(.el-progress-bar__outer) {
  background-color: white;
}
</style>
