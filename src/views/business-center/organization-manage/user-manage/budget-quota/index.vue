<template>
  <div class="budget-quota">
    <ideal-table-list
      class="budget-quota-table"
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
      <template #usageRate>
        <el-table-column label="使用率">
          <template #default="props">
            <el-progress :percentage="props.row.usageRate" />
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <div class="flex-row footer-button">
      <el-button @click="cancelForm">{{ t('back') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders } from '@/types'
import { userRelatedBudgetQuota } from '@/api/java/business-center'
import { router } from '@/router'

const { t } = useI18n()
// 列表
const route = useRoute()
const detailInfo = JSON.parse(route.query.detail as any)
const state: IHooksOptions = reactive({
  dataListUrl: userRelatedBudgetQuota,
  isPage: false,
  queryForm: {
    vdcId: detailInfo.vdcId
  }
})
const { selectionChangeHandle, sizeChangeHandle, currentChangeHandle } =
  useCrud(state)

// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '业务组', prop: 'name' },
  { label: '预算', prop: 'budget' },
  { label: '重置周期', prop: 'resetCycle' },
  { label: '使用率', prop: 'usageRate', useSlot: true },
  { label: '已使用', prop: 'use' },
  { label: '剩余', prop: 'remainder' }
]

watch(
  () => state.dataList,
  arr => {
    const cycleFormat: any = {
      FOREVER: '无',
      WEAK: '周',
      MONTH: '月',
      YEAR: '年'
    }
    arr?.forEach(item => {
      item.usageRate = (item.use / item.budget) * 100
      if (isNaN(item.usageRate)) {
        item.usageRate = 0
      }
      item.resetCycle = cycleFormat[item.cycle]
    })
  }
)
const cancelForm = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.budget-quota {
  width: 100%;
  .budget-quota-table {
    background-color: white;
    padding: $idealPadding;
  }
  .footer-button {
    margin-top: 5px;
    padding: 20px;
    background-color: white;
    justify-content: flex-start;
    align-items: center;
  }
}
</style>
