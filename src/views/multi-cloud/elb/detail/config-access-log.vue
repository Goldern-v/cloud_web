<template>
  <div class="access-log">
    <div class="ideal-tip-text">
      访问日志提供了对七层负均衡进行的所有请求的详细日志，日志存在云日志服务中。
    </div>
    <div class="flex-row" style="align-items: center">
      <span class="ideal-default-margin-right">启动日志记录</span
      ><el-switch v-model="enabled"></el-switch>
    </div>

    <el-form :model="form" label-position="left">
      <el-form-item label="日志组">
        <el-select v-model="form.logGroup" placeholder="请选择" disabled>
          <el-option
            v-for="(item, index) in logGroupList"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="日志流">
        <el-select v-model="form.logFlow" placeholder="请选择" disabled>
          <el-option
            v-for="(item, index) in logFlowList"
            :key="index"
          ></el-option>
          <svg-icon icon="refresh-icon"></svg-icon>
        </el-select>
      </el-form-item>
    </el-form>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelBtn">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitBtn">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EventEnum } from '@/utils/enum'
const { t } = useI18n()
const enabled = ref(false)

const form = reactive({
  logGroup: '',
  logFlow: ''
})

const logGroupList: any = []
const logFlowList: any = []

interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()
const cancelBtn = () => {
  emit(EventEnum.cancel)
}

const submitBtn = () => {
  emit(EventEnum.success)
}
</script>

<style scoped lang="scss">
:deep(.el-form) {
  padding: 0;
}
</style>
