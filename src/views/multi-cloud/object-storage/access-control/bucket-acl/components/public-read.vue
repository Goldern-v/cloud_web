<template>
  <div>
    <div>公共读权限可以使任何用户在不用身份认证的情况下直接读取桶内的对象，为确保您的数据安全，不推荐此配置，建议您选择私有。</div>
    <el-checkbox v-model="agree" label="我已知晓上述配置可能产生的影响"/>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm">选择私有</el-button>
      <el-button type="primary" @click="submitForm">确认修改</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EventEnum } from '@/utils/enum'

const agree = ref(false)
// 方法
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const cancelForm = () => {
  emit(EventEnum.cancel)
}

const submitForm = () => {
  emit(EventEnum.success)
}
</script>

<style scoped lang="scss">

</style>
