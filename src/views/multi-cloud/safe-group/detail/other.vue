<template>
  <div class="elastic-card">
    <ideal-select-search
      :options="searchOptions"
      @clickSearch="clickSearch"
      @clickReset="clickReset"
    />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
    >
      <template #id>
        <el-table-column label="ID">
          <template #default="props">
            <div class="flex-row">
              <el-text type="primary">{{ props.row.id }}</el-text>
              <svg-icon
                icon="copy-icon"
                class="ideal-svg-margin-left"
                @click="clickCopy(props.row?.id)"
              />
            </div>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { clickCopy } from '@/utils/tool'
import type { IdealTableColumnHeaders } from '@/types'

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})

const { getDataList } = useCrud(state)

state.dataList = [
  { id: '93a02e93-102b-29cd-1092e7bf', type: '弹性网卡', ip: '192.168.0.74' },
  { id: '11a02e93-102b-29cd-1092e7bf', type: '弹性网卡', ip: '192.168.0.24' },
  { id: '53a02e93-102b-29cd-1092e7bf', type: '弹性网卡', ip: '192.168.0.14' }
]
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: 'ID', prop: 'id', useSlot: true },
  { label: '资源类型', prop: 'type' },
  { label: 'IP地址', prop: 'ip' }
]
// 搜索
const clickSearch = (search: string, type: string) => {
  state.queryForm.type = type
  state.queryForm.search = search
  getDataList()
}
// 重置
const clickReset = () => {
  state.page = 1
  state.queryForm = {}
  getDataList()
}
// 列表下拉搜索
const searchOptions = [
  { label: '名称', prop: 'name' },
  { label: 'ID', prop: 'uuid' }
]
// 更新tabs选项卡标题数量, total: 当前页面列表总数 index: 当前tabs选项卡
interface EventEmits {
  (e: 'updatePageNumber', total: number, index: number): void
}
const emit = defineEmits<EventEmits>()
watch(
  () => state.dataList,
  (newValue, oldValue) => {
    if (newValue !== oldValue && newValue?.length) {
      emit('updatePageNumber', 8, 3)
    }
  }
)
</script>

<style scoped lang="scss">
.elastic-card {
  padding: $idealPadding;
  background-color: white;
}
</style>
