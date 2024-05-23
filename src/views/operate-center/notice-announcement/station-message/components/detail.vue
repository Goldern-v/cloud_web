<template>
  <div class="detail">
    <div>【{{ rowData?.messageCategoryName }}】：{{ rowData?.content }}</div>
    <div>消息时间：{{ rowData?.operTime }}</div>
  </div>
</template>

<script setup lang="ts">
import { EventEnum } from '@/utils/enum'
import { stationMessageDetail } from '@/api/java/operate-center'

interface DetailProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<DetailProps>(), {
  rowData: null
})
onMounted(() => {
  getDetail()
})
const detail = ref()
const getDetail = () => {
  stationMessageDetail(props?.rowData?.id).then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      detail.value = data
      emit(EventEnum.success)
    } else {
      detail.value = {}
    }
  }).catch(_ => {
    detail.value = {}
  })
}
// 方法
interface EventEmits {
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()
</script>

<style scoped lang="scss">
.detail {
  background-color: white;
}
</style>
