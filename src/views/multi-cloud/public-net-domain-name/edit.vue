<template>
  <div>
    <el-form :model="form" label-position="left">
      <el-form-item label="域名" prop="domainName">
        <el-input
          v-model="form.domainName"
          class="custom-input"
          disabled
        ></el-input>
      </el-form-item>

      <el-form-item label="描述">
        <el-input
          v-model="form.remark"
          type="textarea"
          class="custom-input"
          :autosize="{ minRows: 2, maxRows: 6 }"
        ></el-input>
      </el-form-item>
    </el-form>

    <div class="flex-row ideal-submit-button">
      <el-button type="info" @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">

import { EventEnum } from '@/utils/enum'
interface dialogProps {
  rowData?: any
}
const props = withDefaults(defineProps<dialogProps>(), {
  rowData: () => {}
})

const { t } = useI18n()
const form = reactive({
  domainName: '',
  remark: ''
})

onMounted(() => {
  form.domainName = props.rowData.name
  form.remark = props.rowData.remark
})

// 点击事件
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const cancelForm = () => {
  emit(EventEnum.cancel)
}

//公共参数
const commonParams = () => {
  const params = {
    resourcePoolId: props.rowData.resourcePoolId,
    regionId: props.rowData.regionId,
    projectId: props.rowData.projectId
  }
  return params
}

const submitForm = () => {
  const params = {
    uuid: props.rowData.uuid,
    ...commonParams()
  }
}
</script>

<style scoped lang="scss">
.custom-input {
  width: 100%;
}
</style>
