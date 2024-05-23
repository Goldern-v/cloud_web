<template>
  <div class="operate-record_container">
    <ideal-button-events
      :right-btns="rightButtons"
      @clickRightEvent="clickRightEvent"
    >
    </ideal-button-events>
    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
    </ideal-table-list>
  </div>
</template>

<script setup lang="ts">
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders, IdealButtonEventProp } from '@/types'
import { useCrud } from '@/hooks'

const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})

const { sizeChangeHandle, currentChangeHandle } = useCrud(state)

const rightButtons: IdealButtonEventProp[] = [
  { prop: 'refresh', icon: 'refresh-icon' }
]
const clickRightEvent = (value: string | number | object) => {}

// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '操作名称', prop: 'name' },
  { label: '操作结果', prop: 'result' },
  { label: '操作时间', prop: 'time' },
  { label: '状态', prop: 'time' }
]
</script>

<style scoped lang="scss">
.operate-record_container {
  margin: 20px 10px 10px;
}
</style>
