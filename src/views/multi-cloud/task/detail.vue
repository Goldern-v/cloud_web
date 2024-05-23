<template>
  <div class="ideal-main-container detail">
    <div class="flex-row ideal-header-container">
      <el-divider direction="vertical" />
      <div>{{ detail?.routeName }}</div>
    </div>

    <ideal-detail-info
      :item-number="3"
      :label-array="labelArray"
      :detail-info="detail"
      label-position="left"
      class="basic-info__content"
    >
      <template #status>
        <div>{{ RESOURCE_STATUS[detail?.status] }}</div>
      </template>
    </ideal-detail-info>

    <div class="flex-row ideal-header-container">
      <el-divider direction="vertical" />
      <div>任务执行明细</div>
    </div>

    <ideal-horizontal-steps
      class="ideal-middle-margin-top"
      :current-step="stepsIndex"
      :data-array="stepsArray"
      @clickIndex="clickStepIndex"/>

    <div class="ideal-middle-margin-top flex-row">
      <div>消息体</div>
      <el-input v-model="msg" type="textarea" autosize disabled/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RESOURCE_STATUS } from '@/utils/dictionary'
import { eventProgressDetail } from '@/api/java/public'
import type { IdealSteps } from '@/types'
import { dateFormat, FormatsEnums } from '@/utils/time-format'

const route = useRoute()
const eventFlowId = route.query.eventFlowId as string

onMounted(() => {
  getDetail()
})

const detail = ref()
const msg = ref('')
const getDetail = () => {
  eventProgressDetail({ eventFlowId }).then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      detail.value = data
      detail.value.startTime = dateFormat(data.createTime.date,FormatsEnums.YMDHIS)
      detail.value.endTime = dateFormat(data.endTime.date,FormatsEnums.YMDHIS)
      msg.value = data.eventExecDetail.endExecDetail
      if (data.status === 'CLOSE') {
        stepsIndex.value = 2
        stepsArray.value = successStep
      } else if (data.status === 'ERROR_CLOSE') {
        stepsIndex.value = 2
        stepsArray.value = failStep
      } else {
        stepsIndex.value = 1
        stepsArray.value = execStep
      }
    }
  })
}

const labelArray = ref([
  { label: '任务ID', prop: 'eventId' },
  { label: '任务状态', prop: 'status', useSlot: true },
  { label: '任务对象', prop: 'eventName' },
  { label: '开始时间', prop: 'startTime' },
  { label: '结束时间', prop: 'endTime' },
  { label: '持续时间', prop: 'runTime' }
])

const stepsIndex = ref(0)
const successStep: IdealSteps[] = [
  { title: '生成任务' },
  { title: '执行任务' },
  { title: '任务成功', color: '#2BA471' }
]
const failStep: IdealSteps[] =[
  { title: '生成任务' },
  { title: '执行任务' },
  { title: '任务失败', color: '#D54941' }
]
const execStep: IdealSteps[] =[
  { title: '生成任务' },
  { title: '执行任务', color: '#E37318' }
]
const stepsArray = ref<IdealSteps[]>()
const clickStepIndex = (index: number) => {
  if (index === 0) {
    msg.value = detail.value.eventExecDetail.startExecDetail
  } else if (index === 1) {
    msg.value = detail.value.eventExecDetail.runExecDetail
  } else {
    msg.value = detail.value.eventExecDetail.endExecDetail
  }
}
</script>

<style scoped lang="scss">
.detail {
  background-color: white;
  padding: $idealPadding;
  :deep(.el-divider--vertical) {
    border-left: 1px var(--el-color-primary) solid;
  }
  .detail-steps {
    margin-top: $idealMargin;
  }
}
</style>
