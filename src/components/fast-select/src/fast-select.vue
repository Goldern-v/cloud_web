<template>
  <el-select
    :model-value="modelValue + ''"
    :placeholder="placeholder"
    :clearable="clearable"
    @change="changeModelValue($event)"
  >
    <el-option
      v-for="data in dataList"
      :key="data.dictValue"
      :label="data.dictLabel"
      :value="data.dictValue"
      >{{ data.dictLabel }}</el-option
    >
  </el-select>
</template>

<script setup lang="ts" name="FastSelect">
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
  },
  clearable: {
    type: Boolean,
    required: false,
    default: () => false
  },
  placeholder: {
    type: String,
    required: false,
    default: () => ''
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
