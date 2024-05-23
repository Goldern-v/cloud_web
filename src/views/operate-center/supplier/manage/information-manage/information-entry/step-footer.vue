<template>
  <div class="flex-row step-footer-box">
    <el-button v-if="stepsIndex === firstStep" @click="handleCancel"
      >取消</el-button
    >
    <el-button
      v-if="stepsIndex !== firstStep"
      id="previous-btn"
      @click="handlePrevious"
      >上一步</el-button
    >
    <el-button
      v-if="stepsIndex !== lastStep"
      id="next-btn"
      type="primary"
      @click="handleNext"
      >下一步</el-button
    >
    <el-button
      v-if="stepsIndex === lastStep"
      type="primary"
      @click="handleComplete"
      >完成</el-button
    >
  </div>
</template>

<script setup lang="ts">
interface StepInfo {
  stepsIndex?: number // 步骤
  lastStep?: number // 最后一步
  firstStep?: number // 第一步
}

const props = withDefaults(defineProps<StepInfo>(), {
  stepsIndex: 0,
  lastStep: 3,
  firstStep: 0
})

enum EventType {
  cancel = 'clickCancel',
  previous = 'clickPrevious',
  next = 'clickNext',
  complete = 'clickComplete',
  question = 'clickQuestion'
}
interface EventEmits {
  (e: EventType.previous): void
  (e: EventType.cancel): void
  (e: EventType.next): void
  (e: EventType.complete): void
  (e: EventType.question): void
}
const emit = defineEmits<EventEmits>()
//取消
const handleCancel = () => {
  emit(EventType.cancel)
}
// 上一步
const handlePrevious = () => {
  document.getElementById('previous-btn')?.blur()
  emit(EventType.previous)
}
// 下一步
const handleNext = () => {
  document.getElementById('next-btn')?.blur()
  emit(EventType.next)
}
// 完成
const handleComplete = () => {
  emit(EventType.complete)
}
</script>

<style scoped lang="scss">
// .step-footer-box {
//   position: fixed;
//   bottom: 40px;
// }
</style>
