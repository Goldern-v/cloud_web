<template>
  <div :class="showSidebar ? 'footer-container' : 'footer-container-small'">
    <div class="flex-row flex-row-between">
      <div class="flex-row ideal-large-margin-left">
        <div>配置费用：</div>
        <div class="ideal-error-text" style="font-size: 20px;font-weight: 500;">¥16.00</div>
      </div>

      <el-button
        v-if="stepsIndex === 1"
        class="ideal-large-margin-right"
        type="primary"
        @click="handleCreate"
        >立即创建</el-button
      >

      <div v-else class="flex-row">
        <el-button :disabled="btnDisabled" @click="handlePrevious">上一页</el-button>
        <el-button class="ideal-large-margin-right" :disabled="btnDisabled" type="primary" @click="handleSubmit"
          >提交</el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import store from '@/store'

interface FooterProps {
  stepsIndex?: number
}
const props = withDefaults(defineProps<FooterProps>(), {
  stepsIndex: 1
})

const showSidebar = computed(() => store.appStore.sidebarOpened)

const btnDisabled = computed(() => props.stepsIndex === 3)
enum EventType {
  previous = 'clickPrevious',
  create = 'clickCreate',
  submit = 'clickSubmit'
}
interface EventEmits {
  (e: EventType.previous): void
  (e: EventType.create): void
  (e: EventType.submit): void
}
const emit = defineEmits<EventEmits>()
// 上一步
const handlePrevious = () => {
  emit(EventType.previous)
}
// 创建
const handleCreate = () => {
  emit(EventType.create)
}
// 提交
const handleSubmit = () => {
  emit(EventType.submit)
}
</script>

<style scoped lang="scss">
$bottomHeight: 60px;
.footer-container, .footer-container-small {
  position: fixed;
  width: calc(100% - $sidebarWidth);
  bottom: 0;
  left: $sidebarWidth;
  background: #fff;
  z-index: 2000;
  box-shadow: 5px 5px 17px 9px #e5e9ea;
  text-align: right;
  overflow: hidden;
  height: $bottomHeight;
  line-height: $bottomHeight;
  .flex-row-between {
    justify-content: space-between;
    align-items: center;
  }
}
.footer-container-small {
  width: calc(100% - $sidebarSmallWidth);
  left: $sidebarSmallWidth;
}
</style>
