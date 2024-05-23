<template>
  <div class="bill-record">
    <div class="bill-record__table-list">
      <div class="flex-row bill-record__tip">
        <svg-icon icon="info-warning" color="var(--el-color-primary)" class="ideal-svg-margin-right"></svg-icon>
        <span
          >您可以创建资源池，以灵活地管理云和基础架构资源。使用资源池可以帮助您定义资源配额并控制资源访问。资源池可以分配给单个VDC，也可以共享给多个或所有VDC</span
        >
      </div>

      <ideal-table-list
        :loading="state.dataListLoading"
        :table-data="state.dataList"
        :table-headers="tableHeaders"
        :total="state.total"
        :pagination-type="PaginationTypeEnum.totalSizes"
        @clickSizeChange="sizeChangeHandle"
        @clickCurrentChange="currentChangeHandle"
        @handleSelectionChange="selectionChangeHandle"
      >
        <template #statusText>
          <el-table-column label="状态">
            <template #default="props">
              <ideal-status-icon
                :status-icon="props.row.statusIcon"
                :status-text="props.row.statusText"
              ></ideal-status-icon>
            </template>
          </el-table-column>
        </template>
      </ideal-table-list>
    </div>

    <save-button @clickCancel="clickCancel" @clickSave="clickSave">
    </save-button>
  </div>
</template>

<script setup lang="ts">
/**
 * 详情的账单同步记录
 */
import saveButton from './save-button.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { PaginationTypeEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders } from '@/types'
import { syncBillRecordUrl } from '@/api/java/operate-center'

const route = useRoute()
const cloudPlatformId = route.query.id as string

const state: IHooksOptions = reactive({
  dataListUrl: syncBillRecordUrl,
  queryForm: {
    cloudPlatformId
  }
})

watch(() => state.dataList, value => {
  if (value?.length) {
    value.forEach((item: any) => {
      item.statusIcon = item.status ? 'status-success' : 'status-error'
      item.statusText = item.status ? '成功' : '失败'
    })
  }
})
const { selectionChangeHandle, sizeChangeHandle, currentChangeHandle } = useCrud(state)

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '同步时间', prop: 'startTime' },
  { label: '同步状态', prop: 'statusText', useSlot: true },
  { label: '同步详情', prop: 'msg' }
]

const router = useRouter()
const clickCancel = () => {
  router.back()
}

const clickSave = () => {
  router.push({
    path: '/operate-center/basic-config/cloud-platform-manage/list'
  })
}
</script>

<style scoped lang="scss">
.bill-record {
  width: 100%;
  .bill-record__table-list {
    padding: $idealPadding;
    .bill-record__tip {
      background-color: var(--custom-information-bg-color);
      padding: 20px;
      align-items: center;
    }
    .bill-record__table-name {
      cursor: pointer;
    }
  }
  .custom-color {
    color: var(--el-color-primary);
  }
}
</style>
