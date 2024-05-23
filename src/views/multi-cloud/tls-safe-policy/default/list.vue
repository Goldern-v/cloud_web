<template>
  <div class="default-policy">
    <ideal-search :type-array="typeArray" @clickSearch="onClickSearch" />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
    </ideal-table-list>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { FiltrateEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealSearch,
  IdealTextProp
} from '@/types'

const typeArray = ref<IdealSearch[]>([
  { label: '名称', prop: 'name', type: FiltrateEnum.input },
  { label: 'UUID', prop: 'uuid', type: FiltrateEnum.input }
])
const onClickSearch = (v: IdealTextProp[]) => {
  state.queryForm = {}
  if (v.length) {
    v.forEach((item: IdealTextProp) => {
      const temp = item.label.split('：')
      state.queryForm[item.prop] = temp[1]
    })
  }
  getDataList()
}

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
  getDataList,
  query
} = useCrud(state)
state.dataList = [
  { name: 'tls-1-1', event: '19', tlsProtocol: ['TLS 1.2','TLS 1.1','TLS 1.0'] },
  { name: 'tls-1-2', event: '20', tlsProtocol: ['TLS 1.2','TLS 1.1','TLS 1.0'] },
  { name: 'tls-1-3', event: '5', tlsProtocol: ['TLS 1.2','TLS 1.1'] },
  { name: 'tls-1-4', event: '44', tlsProtocol: ['TLS 1.2'] },
  { name: 'tls-1-5', event: '16', tlsProtocol: ['TLS 1.3','TLS 1.1'] }
]
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: '加密事件', prop: 'event' },
  { label: 'TLS协议', prop: 'tlsProtocol' }
]

</script>

<style scoped lang="scss">
.default-policy {
  padding: $idealPadding;
  background-color: white;
  .default-policy-table-id {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 3px;
    font-size: $defaultFontSize;
  }
  .default-policy-font-size {
    font-size: $defaultFontSize;
  }
}
</style>
