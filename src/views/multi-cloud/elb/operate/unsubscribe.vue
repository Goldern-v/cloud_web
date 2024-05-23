<template>
  <div class="unbind-elb">
    <div class="flex-row">
      <img src="@/assets/warning.png" style="width: 25px" alt="" />
      <span class="warning_title">确定对以下负载均衡器转进行退订操作吗?</span>
    </div>
    <div class="flex-row custom-warning-box">
      <svg-icon
        icon="info-warning"
        color="var(--el-color-primary)"
        class="ideal-svg-margin-right"
      ></svg-icon>
      确定退订后，负载均衡实例及其下配置(监听器、转发策略、后端服务器组等)
      无法恢复，后端服务器自动取消与后端服务器组的关联，请谨慎操作。
    </div>
    <ideal-table-list
      :table-data="tableData"
      :table-headers="tableHeader"
      :show-pagination="false"
    >
    </ideal-table-list>

    <div class="flex-row ideal-submit-button">
      <el-button type="info" @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()
interface PowerOnProps {
  multipleSelection?: string[] //多选
}
const props = withDefaults(defineProps<PowerOnProps>(), {
  multipleSelection: () => []
})

const description = ref('')

// 原有规格数据
const tableData = ref<any[]>([])
onMounted(() => {
  tableData.value = props.multipleSelection
})
const tableHeader: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'ipAddress' },
  { label: '状态', prop: 'statusText' },
  { label: '原因', prop: 'reason' }
]

// 点击事件
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
.unbind-elb {
  width: 100%;
  .footer-button {
    justify-content: flex-end;
    align-items: center;
    margin-top: 10px;
  }
  .warning_title {
    margin-left: 10px;
    font-weight: bolder;
    font-size: 14px;
    color: var(--el-text-color-primary);
  }
  .custom-warning-box {
    background-color: var(--custom-information-bg-color);
    border: 1px solid var(--el-color-primary);
    padding: 10px 20px;
    margin-top: 20px;
    align-items: baseline;
  }
}
</style>
