<template>
  <div class="ideal-large-margin process-detail">
    <process-info :row-data="rowData" type="detail" />
  </div>
</template>

<script setup lang="ts">
import processInfo from './components/process-info.vue'
interface DialogProps {
  rowData?: any // 行数据
}

const props = withDefaults(defineProps<DialogProps>(), {
  rowData: {}
})
// 弹框取消
const clickCancelEvent = () => {}
// 弹框成功提交
const clickSuccessEvent = () => {}
</script>

<style lang="scss" scoped>
.process-detail {
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
}
</style>
