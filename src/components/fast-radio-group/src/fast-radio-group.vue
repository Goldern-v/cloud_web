<template>
  <el-radio-group
    :model-value="modelValue + ''"
    @change="changeModelValue($event)"
  >
    <el-radio
      v-for="data in dataList"
      :key="data.dictValue"
      :label="data.dictValue"
      >{{ data.dictLabel }}</el-radio
    >
  </el-radio-group>
</template>

<script setup lang="ts" name="FastRadioGroup">
import store from '@/store'
import { getDictDataList } from '@/utils/tool'

const props = defineProps({
  modelValue: {
    type: [Number, String],
    required: true
  },
  dictType: {
    type: String,
    required: true
  }
})

const changeModelValue = (event: any) => {
  emit('update:modelValue', event)
}
// 方法
interface EventEmits {
  (e: 'update:modelValue', v: any): void
}
const emit = defineEmits<EventEmits>()

const dataList = getDictDataList(store.appStore.dictList, props.dictType)
</script>
