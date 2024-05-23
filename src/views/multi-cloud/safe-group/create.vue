<template>
  <div>
    <general-create
      v-if="isPublic || isPrivateHuawei"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
  </div>
</template>

<script setup lang="ts">
import generalCreate from './general-create/index.vue'
import { useResourcePool } from '@/utils/common/resource'
import { EventEnum } from '@/utils/enum'

const { isPublic, isPrivateVmware, isPrivateHuawei } = useResourcePool()

// 方法
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()
// 弹框取消
const clickCancelEvent = () => {
  emit(EventEnum.cancel)
}
// 弹框成功提交
const clickSuccessEvent = () => {
  emit(EventEnum.success)
}
</script>

<style scoped lang="scss"></style>
