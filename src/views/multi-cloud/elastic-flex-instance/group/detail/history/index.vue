<template>
  <div class="history">
    <div class="flex-row history-search">
      <div>
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD"
          @change="dateChange"
        />
      </div>

      <svg-icon icon="refresh-icon" class="ideal-svg-margin-left"/>
    </div>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :is-multiple="true"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #status>
        <el-table-column label="状态" >
          <template #default="props">
            <ideal-status-icon
              v-if="props.row.status"
              :status-icon="props.row.statusType"
              :status-text="props.row.status"
            />
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { IdealTableColumnHeaders } from '@/types'

const now = new Date()
const lastHour = new Date(now.getTime() - 60 * 60 * 1000)
const dateRange = ref<[Date, Date]>([lastHour, now]) //时间范围
const dateChange = (value: any) => {}

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList
} = useCrud(state)
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '活动ID', prop: 'name' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '活动类型', prop: 'type' },
  { label: '描述', prop: 'description' },
  { label: '开始时间', prop: 'startTime' },
  { label: '结束时间', prop: 'endTime' }
]
</script>

<style scoped lang="scss">
.history {
  padding: 0 $idealPadding $idealPadding;
  .history-search {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
