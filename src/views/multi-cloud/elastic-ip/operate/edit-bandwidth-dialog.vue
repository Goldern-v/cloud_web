<template>
  <div>
    <div class="unbind">
      <div class="flex-row">
        <img src="@/assets/warning.png" style="width: 25px" alt="" />
        <span class="warning_title">确定要修改以下弹性公网IP的带宽吗?</span>
      </div>
      <div class="flex-row warning_desc">
        批量修改的带宽支持按需按带宽和按需按流量两种类型，其他类型不支持
      </div>
      <ideal-table-list
        :table-data="tableData"
        :table-headers="tableHeader"
        :show-pagination="false"
      >
      </ideal-table-list>
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
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum, OperateEventEnum } from '@/utils/enum'

interface PowerOnProps {
  multipleSelection?: string[] //多选
}
const props = withDefaults(defineProps<PowerOnProps>(), {
  multipleSelection: () => []
})
const { t } = useI18n()

// 原有规格数据
const tableData = ref<any[]>([])
onMounted(() => {
  tableData.value = props.multipleSelection
})
const tableHeader: IdealTableColumnHeaders[] = [
  { label: '弹性公网IP', prop: 'ipAddress' },
  { label: '带宽名称', prop: 'instance' },
  { label: '带宽大小', prop: 'bandwidthSize' },
  { label: '计费类型', prop: 'billingMode' }
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

const router = useRouter()
const submitForm = () => {
  const data = JSON.stringify(props.multipleSelection)
  router.push({
    path: '/multi-cloud/elastic-ip/batch-edit',
    query: {
      data
    }
  })
}
</script>

<style scoped lang="scss">
.unbind {
  width: 100%;
  padding: 15px 0;
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
  .warning_desc {
    margin: 10px 0;
  }
}
</style>
