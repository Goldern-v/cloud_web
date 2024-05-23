<template>
  <div class="recover">
    <div>确定要对以下云主机进行恢复操作吗?</div>

    <ideal-table-list
      :table-data="originalData"
      :table-headers="originalHeader"
      :show-pagination="false"
    >
      <template #name>
        <el-table-column label="名称/ID" show-overflow-tooltip width="280">
          <template #default="props">
            <div>{{ props.row.name }}</div>
            <div>{{ props.row.id }}</div>
          </template>
        </el-table-column>
      </template>
      <template #status>
        <el-table-column label="状态">
          <template #default="props">
            <ideal-status-icon
              :status-icon="props.row.statusIcon"
              :status-text="props.row.statusText"
            ></ideal-status-icon>
          </template>
        </el-table-column>
      </template>

      <template #ipAddress>
        <el-table-column label="ip地址">
          <template #default="props">
            <div v-for="(item, index) of props.row.nicList" :key="index">
              {{ item.fixedIp }}
            </div>
          </template>
        </el-table-column>
      </template>
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
import { ElMessage } from 'element-plus'
import { recoverCloudHost } from '@/api/java/compute'

interface HangUpProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<HangUpProps>(), {
  rowData: () => ({})
})

const { t } = useI18n()

// 原有规格数据
const originalData: any = ref<any[]>([])
onMounted(() => {
  if (props.rowData) {
    originalData.value = [props.rowData]
  }
})
const originalHeader: IdealTableColumnHeaders[] = [
  { label: '名称/ID', prop: 'name', useSlot: true },
  { label: '状态', prop: 'status', useSlot: true },
  { label: 'ip地址', prop: 'ipAddress', useSlot: true },
  { label: '到期时间', prop: 'dueTime' }
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
  recoverCloudHost({ uuid: props.rowData.uuid }).then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      ElMessage.success('云主机恢复成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error(data.msg || '云主机恢复失败')
    }
  })
}
</script>

<style scoped lang="scss">
.recover {
  width: 100%;
  .footer-button {
    justify-content: flex-end;
    align-items: center;
    margin-top: 10px;
  }
}
</style>
