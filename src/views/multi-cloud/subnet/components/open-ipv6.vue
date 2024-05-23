<template>
  <div>
    <div class="ideal-medium-text">
      确定要为子网{{ rowData.name }}自动分配IPv6网段吗?
    </div>
    <div>
      开启IPv6功能后，将自动为子网分配IPv6网段，暂不支持自定义设置IPv6网段。<span
        class="ideal-warning-text"
        >IPv6功能开启后不允许关闭。</span
      >
    </div>

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
import { showLoading, hideLoading } from '@/utils/tool'
import { subnetEdit } from '@/api/java/network'
import { ElMessage } from 'element-plus'
// 属性值
interface DialogProps {
  rowData?: any // 行数
}
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: null
})

const { t } = useI18n()

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
  //更新子网接口
  const params: any = {
    vpcId: props.rowData.vpcId,
    uuid: props.rowData.uuid,
    name: props.rowData.name,
    description: props.rowData.description,
    ipv6_enable: true,
    ...commonParams()
  }
  showLoading('开启IPv6中...')
  subnetEdit(params)
    .then((res: any) => {
      const { code, data, msg } = res
      if (code === 200) {
        ElMessage.success(data || '开启IPv6成功')
        emit(EventEnum.success)
      } else {
        ElMessage.error(msg)
      }
      hideLoading()
    })
    .catch(err => {
      hideLoading()
    })
}
</script>

<style scoped lang="scss">
.ideal-medium-text {
  color: $textColorPrimary;
}
</style>
