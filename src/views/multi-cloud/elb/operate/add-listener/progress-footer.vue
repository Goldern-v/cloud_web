<template>
  <el-footer height="60px" class="progress-footer">
    <div class="flex-row progress-footer-box">
      <div class="flex-row progress-footer-box--item">
        <el-button
          v-if="stepsIndex !== 0"
          type="primary"
          @click="handlePrevious"
          >上一步</el-button
        >
        <el-button v-if="stepsIndex === 0" type="primary" @click="handleNext"
          >下一步：配置后端分配策略</el-button
        >
        <el-button v-if="stepsIndex === 1" type="primary" @click="handleNext"
          >下一步：添加后端服务器组</el-button
        >
        <el-button v-if="stepsIndex === 2" type="primary" @click="handleNext"
          >确认配置</el-button
        >
        <el-button
          v-if="stepsIndex === 3"
          type="primary"
          @click="handleComplete"
          >提交</el-button
        >
      </div>
    </div>
  </el-footer>
</template>

<script setup lang="ts" name="priceInfo">
import store from '@/store'

interface PriceInfo {
  stepsIndex?: number
  basicData?: any
  confirmData?: any
}

const props = withDefaults(defineProps<PriceInfo>(), {
  stepsIndex: 1,
  basicData: () => ({}),
  confirmData: () => ({})
})
// 监听询价接口用到的传参数据
watch(
  () => [
    props.basicData.billingMode,
    props.basicData.eipPurchaseDuration,
    props.basicData.bandwidthSize
  ],
  value => {},
  {
    deep: true
  }
)

enum EventType {
  previous = 'clickPrevious',
  next = 'clickNext',
  complete = 'clickComplete',
  question = 'clickQuestion'
}
interface EventEmits {
  (e: EventType.previous): void
  (e: EventType.next): void
  (e: EventType.complete): void
  (e: EventType.question): void
}
const emit = defineEmits<EventEmits>()
// 上一步
const handlePrevious = () => {
  emit(EventType.previous)
}
// 下一步
const handleNext = () => {
  emit(EventType.next)
}
// 完成
const handleComplete = () => {
  emit(EventType.complete)
}

defineExpose({
  // price
})
</script>

<style lang="scss" scoped>
.progress-footer {
  position: fixed;
  width: calc(100% - $sidebarWidth);
  bottom: 0;
  left: $sidebarWidth;
  background: #fff;
  z-index: 2000;
  box-shadow: 0 5px 17px 9px #e5e9ea;
  text-align: center;
  overflow: hidden;
  .custom-margin-right {
    margin-right: 10px;
  }
  .progress-footer-box {
    height: 60px;
    line-height: 60px;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
