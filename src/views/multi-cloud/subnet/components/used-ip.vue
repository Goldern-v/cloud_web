<template>
  <div class="ideal-table-list__container used-ip">
    <div class="flex-row used-ip__search">
      <ideal-select-search
        :search-type="SearchTypeEnum.title"
        prefix-title="模糊查询"
        @clickSearch="clickSearch"
        @clickReset="clickReset"
      >
      </ideal-select-search>
    </div>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
    </ideal-table-list>
  </div>
</template>

<script setup lang="ts">
import type {
  IdealButtonEventProp,
  IdealTableColumnHeaders,
  IdealTableColumnOperate
} from '@/types'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { SearchTypeEnum } from '@/utils/enum'

/**
 * 列表
 */
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const { sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)

// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: 'IPV4地址', prop: 'ipv4' },
  { label: 'IPV6地址', prop: 'ipv6' },
  { label: '用途', prop: 'purpose' }
]
state.dataList = [
  {
    ipv4: '192.168.0.11',
    ipv6: 'fe80::f816:3eff:fe9b:5f2d',
    purpose: '外部网关'
  }
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
</script>

<style scoped lang="scss">
.used-ip {
  width: 100%;
  padding: 20px;
  .used-ip__search {
    align-items: center;
    justify-content: flex-start;
    .used-ip__time-range {
      width: 30%;
      margin-right: 20px;
    }
  }
  .used-ip-table-title {
    color: var(--el-color-primary);
    cursor: pointer;
  }
  .used-ip-table-id {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
