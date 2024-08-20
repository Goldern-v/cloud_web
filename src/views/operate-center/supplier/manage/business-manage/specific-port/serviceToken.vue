<template>
  <div class="flex-center margin-top">
    <div>{{ rowData.serviceToken }}</div>
    <div class="flex-center">
      <el-button type="primary" @click="copy()">复 制</el-button>
      <el-button @click="cancelForm()"> 取 消</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { EventEnum } from '@/utils/enum'
import { clickCopy } from '@/utils/tool'
// 方法
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()
defineProps<{
  rowData?: any
}>()
const token = ref<any>('serviceToken')
const cancelForm = () => {
  emit(EventEnum.cancel)
}
const copy = () => {
  clickCopy(token.value)
  // emit(EventEnum.success)
}
</script>
<style lang="scss" scoped>
.flex-center {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.margin-top {
  margin-top: 20px;
}
</style>
