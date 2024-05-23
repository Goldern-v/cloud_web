<template>
  <div class="bucket-policy-tip">
    <div v-if="type === 'read'">公共读权限可以使任何用户在不用身份认证的情况下直接读取桶内的对象，为确保您的数据安全，不推荐此配置，建议您选择私有。</div>
    <div v-else>公共读写权限可以使任何用户在不用身份认证的情况下直接读/写/删桶内的对象，为确保您的数据安全，不推荐此配置，建议您选择私有。</div>
    <el-checkbox v-model="agree" label="我已知晓上述配置可能产生的影响"></el-checkbox>

    <div class="flex-row ideal-submit-button">
      <el-button type="danger" @click="clickPrivate">选择私有</el-button>
      <el-button @click="submitForm">确认修改</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { OperateEventEnum, EventEnum } from '@/utils/enum'

interface TipProps {
  type: OperateEventEnum | string | undefined
}
withDefaults(defineProps<TipProps>(), {})

const agree = ref(false)

// 方法
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()
const clickPrivate = () => {
  emit(EventEnum.cancel)
}
const submitForm = () => {
  emit(EventEnum.success)
}
</script>

<style scoped lang="scss">
.bucket-policy-tip {
  width: 100%;
}
</style>
