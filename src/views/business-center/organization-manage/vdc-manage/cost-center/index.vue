<template>
  <div class="cost-center">
    <ideal-table-list
      class="cost-center-table"
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :show-pagination="false"
      :total="state.total"
      :page="state.page"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
    </ideal-table-list>

    <div class="flex-row footer-button">
      <el-button type="primary" @click="clickSubmit">{{ t('save') }}</el-button>
      <el-button @click="clickCancel">{{ t('back') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { billCost } from '@/api/java/operate-center'
import type { IdealTableColumnHeaders } from '@/types'

const { t } = useI18n()
const vdcId = useRoute().query.id
const state: IHooksOptions = reactive({
  dataListUrl: billCost,
  deleteUrl: '/sys/user',
  isPage: false,
  queryForm: {
    vdcId
  }
})
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '成本中心名称', prop: 'name' },
  { label: '描述', prop: 'remark' },
  { label: '创建者', prop: 'createName' },
  { label: '创建时间', prop: 'createTimeText' }
]
const { sizeChangeHandle, currentChangeHandle } = useCrud(state)

watch(
  () => state.dataList,
  value => {
    value?.forEach(item => {
      item.createTimeText = item.createTime.date
      item.createName = item.creator.name
    })
  }
)
const clickSubmit = () => {}
const router = useRouter()
const clickCancel = () => {
  router.back()
}
</script>
<style scoped lang="scss">
.cost-center {
  width: 100%;
  .cost-center-table {
    padding: 20px;
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
