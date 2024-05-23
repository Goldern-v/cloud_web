<template>
  <div>
    <el-form :model="form" label-position="left">
      <el-form-item label="弹性公网IP">
        {{ form.ip }}
      </el-form-item>

      <el-form-item label="选择共享带宽">
        <el-select v-model="form.bandwidth">
          <el-option
            v-for="item of bandwidthList"
            :key="item.label"
            :label="item.prop"
          />
        </el-select>
        <svg-icon icon="refresh-icon" style="margin: 0 10px"></svg-icon>
        <span style="color: var(--el-color-primary); font-size: 12px"
          >管理共享带宽</span
        >
      </el-form-item>
    </el-form>
    <div class="flex-row ideal-submit-button" style="justify-content: center">
      <el-button type="primary" @click="submitForm">{{
        t('confirm')
      }}</el-button>
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IdealTextProp } from '@/types'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()
interface PowerOnProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<PowerOnProps>(), {
  rowData: () => ({})
})

const form = reactive({
  ip: '',
  bandwidth: ''
})

onMounted(() => {
  form.ip = props.rowData.ip
})

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
const bandwidthList: IdealTextProp[] = []
</script>
