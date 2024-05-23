<template>
  <div class="delete-nic">
    <div class="flex-row warning_desc">
      即将删除辅助弹性网卡<span>{{ props.rowData.fixedIp }}</span>
    </div>

    <div class="ideal-tip-text">
      删除辅助弹性网卡时，会解除辅助弹性网卡和弹性网卡的绑定关系。如果辅助弹性网卡已被其他资源使用，会同步删除关联资源中使用辅助弹性网卡的条目。删除操作无法恢复，请谨慎操作。
    </div>

    <ideal-table-list
      :table-data="tableData"
      :table-headers="tableHeaders"
      :show-pagination="false"
    >
      <template #network>
        <el-table-column label="所属网络">
          <template #default="props">
            <p class="ideal-theme-text">{{ props.row.vpcName }}</p>
            <p class="ideal-theme-text">{{ props.row.subnet.name }}</p>
          </template>
        </el-table-column>
      </template>

      <template #eip>
        <el-table-column label="绑定的弹性公网IP">
          <template #default="props">
            <p class="ideal-theme-text">{{ props.row.eip?.ipAddress }}</p>
            <p>{{ props.row.eip?.name }}</p>
            <p>
              {{
                props.row.billType
                  ? props.row.billType === 'PACKAGE'
                    ? '包年包月'
                    : '按需'
                  : ''
              }}
            </p>
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
import { ElMessage } from 'element-plus'
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum } from '@/utils/enum'
import { showLoading, hideLoading } from '@/utils/tool'
import { deleteAssistNic } from '@/api/java/network'
interface NicProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<NicProps>(), {
  rowData: () => ({})
})

const { t } = useI18n()

const tableData: any = ref([])
onMounted(() => {
  tableData.value = [props.rowData]
})

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '私有IP地址', prop: 'fixedIp' },
  { label: '所属弹性网卡', prop: 'mainFixedIp' },
  { label: '所属网络', prop: 'network', useSlot: true },
  { label: '绑定的弹性公网IP', prop: 'eip', useSlot: true }
]
//公共入参
const commonParams = () => {
  const params = {
    resourcePoolId: props.rowData.resourcePoolId,
    regionId: props.rowData.regionId,
    projectId: props.rowData.projectId,
    vdcId: props.rowData.vdcId
  }
  return params
}

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
  const params = {
    uuid: props.rowData.uuid,
    ...commonParams()
  }
  showLoading('删除中...')
  deleteAssistNic(params)
    .then((res: any) => {
      const { code } = res
      if (code === 200) {
        ElMessage.success('删除成功')
        emit(EventEnum.success)
      } else {
        ElMessage.success('删除失败')
      }
      hideLoading()
    })
    .catch(_ => {
      hideLoading()
    })
}
</script>

<style scoped lang="scss">
.delete-nic {
  .warning_desc {
    margin: 10px 0;
    font-size: 14px;
    align-items: center;
    span {
      font-weight: bolder;
      color: var(--el-text-color-primary);
      margin-left: 5px;
    }
  }
}
</style>
