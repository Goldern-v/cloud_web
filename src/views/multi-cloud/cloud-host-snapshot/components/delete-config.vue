<template>
  <div class="delete">
    <div>请选择快照自动删除策略</div>

    <el-radio-group v-model="type">
      <el-radio label="1">按时间</el-radio>
      <el-radio label="2">按大小</el-radio>
      <el-radio label="3">按数量</el-radio>
      <el-radio label="4">永久保留</el-radio>
    </el-radio-group>

    <div class="flex-row" style="align-items: center;">
      <div>超过</div>
      <el-input v-model="num" style="width: 100px;"/>
      <div>天后自动删除。天数取值范围为1-65536</div>
    </div>

    <div class="flex-row ideal-submit-button">
      <el-button @click="clickCancel">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="clickSave">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()

const type = ref('1')
const num = ref('')
// 点击事件
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const clickSave = () => {
  emit(EventEnum.success)
}
const clickCancel = () => {
  emit(EventEnum.cancel)
}
</script>

<style scoped lang="scss">
.delete {
  width: 100%;
}
</style>
