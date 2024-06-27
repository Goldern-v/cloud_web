<template>
  <div class="copy">
    <copy-single
      v-if="rowData"
      :row-data="rowData"
      @clickCancelEvent="cancelForm"
      @clickSuccessEvent="submitForm"
    />

    <copy-multi
      v-else
      :select-data="selectData"
      @clickCancelEvent="cancelForm"
      @clickSuccessEvent="submitForm"
    />
  </div>
</template>

<script setup lang="ts">
import copySingle from './copy-single.vue'
import copyMulti from './copy-multi.vue'
import type { FormInstance } from 'element-plus'
import { EventEnum } from '@/utils/enum'

interface ShareProps {
  rowData?: any // 行数据
  selectData?: any[]
}
withDefaults(defineProps<ShareProps>(), {
  rowData: null,
  selectData: () => []
})

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
.copy {
  width: 100%;
}
</style>
