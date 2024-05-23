<template>
  <div class="resource-pool">
    <div class="resource-pool__table-list">
      <div class="flex-row resource-pool__tip">
        <svg-icon
          icon="info-warning"
          color="var(--el-color-primary)"
          class="ideal-svg-margin-right"
        ></svg-icon>
        <span
          >您可以创建资源池，以灵活地管理云和基础架构资源。</span
        >
      </div>

      <ideal-table-list
        :loading="state.dataListLoading"
        :table-data="state.dataList"
        :table-headers="tableHeaders"
        :total="state.total"
        :page="state.page"
        :pagination-type="PaginationTypeEnum.totalSizes"
        @clickSizeChange="sizeChangeHandle"
        @clickCurrentChange="currentChangeHandle"
        @handleSelectionChange="selectionChangeHandle"
      >
        <template #name>
          <el-table-column label="名称">
            <template #default="props">
              <div class="custom-color resource-pool__table-name">
                {{ props.row.name }}
              </div>
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
      </ideal-table-list>
    </div>

    <submit-button
      :show-save="false"
      @clickCancel="clickCancel()"
    >
    </submit-button>
  </div>
</template>

<script setup lang="ts">
import submitButton from './submit-button.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { PaginationTypeEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders } from '@/types'
import { RESOURCE_STATUS_ICON, RESOURCE_STATUS } from '@/utils/dictionary'
import { resourcePoolList } from '@/api/java/operate-center'

const route = useRoute()
const cloudPlatformId = route.query.id as string

const { t } = useI18n()

const state: IHooksOptions = reactive({
  dataListUrl: resourcePoolList,
  queryForm: {
    cloudPlatformId
  }
})
watch(
  () => state.dataList,
  value => {
    if (value) {
      value.forEach((item: any) => {
        item.statusIcon = RESOURCE_STATUS_ICON[item?.status.toUpperCase()]
        item.statusText = RESOURCE_STATUS[item?.status.toUpperCase()]
      })
    }
  }
)
const { selectionChangeHandle, sizeChangeHandle, currentChangeHandle } =
  useCrud(state)

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '资源池名称', prop: 'name', useSlot: true },
  { label: '资源池类型', prop: 'cloudCategoryName' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '创建者', prop: 'creator.name' },
  { label: '创建时间', prop: 'createTime.date' }
]

const router = useRouter()
const clickCancel = () => {
  router.back()
}
const handleCancel = () => {
  router.push({
    // path: '/operate-center/basic-config/cloud-platform-manage/list'
  })
}

</script>

<style scoped lang="scss">
.resource-pool {
  width: 100%;
  .resource-pool__table-list {
    padding: $idealPadding;
    .resource-pool__tip {
      background-color: var(--custom-information-bg-color);
      padding: 20px;
      align-items: center;
    }
    .resource-pool__table-name {
      cursor: pointer;
    }
  }
  .custom-color {
    color: var(--el-color-primary);
  }
}
</style>
