<template>
  <div class="release-container">
    <div class="flex-row" style="align-items: flex-end">
      <img src="@/assets/warning.png" style="width: 25px" alt="" />
      <span class="warning_title"
        >确认删除路由表{{ detailInfo.name }}下路由吗?</span
      >
    </div>
    <div class="ideal-tip-text ideal-default-margin-top">
      删除路由可能导致业务中断，请再次确认变更后的影响。
    </div>
    <ideal-table-list
      :table-data="tableArray"
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
import { ElMessage } from 'element-plus'
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum } from '@/utils/enum'
import { showLoading, hideLoading } from '@/utils/tool'
import { deleteRouteInRouteTable } from '@/api/java/network'

interface releaseProps {
  tableArray?: any // 行数据
  detailInfo?: any // 行数据
}
const props = withDefaults(defineProps<releaseProps>(), {
  tableArray: () => [],
  detailInfo: () => {}
})

const { t } = useI18n()

const tableHeader: IdealTableColumnHeaders[] = [
  { label: '目的地址', prop: 'destination' },
  { label: '下一跳类型', prop: 'nextType' },
  { label: '下一跳', prop: 'nextHopName' }
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
  showLoading('删除中...')
  const routeIds = props.tableArray.map((item: any) => item.id)
  const params = {
    name: props.detailInfo.name,
    id: props.detailInfo.id,
    routeIds,
    resourcePoolId: props.detailInfo.resourcePoolId,
    regionId: props.detailInfo.regionId,
    projectId: props.detailInfo.projectId
  }
  deleteRouteInRouteTable(params)
    .then((res: any) => {
      const { msg, code, status, data } = res
      if (code === 200 && status) {
        ElMessage.success(data)
        emit(EventEnum.success)
      } else {
        ElMessage.error(msg || '删除失败')
      }
      hideLoading()
    })
    .catch(_ => {
      hideLoading()
    })
}
</script>

<style scoped lang="scss">
.release-container {
  width: 100%;
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
