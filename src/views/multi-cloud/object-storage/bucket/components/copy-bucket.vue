<template>
  <div class="copy-bucket">
    <div class="flex-row copy-bucket-search">
      <ideal-select-search
        :options="searchOptions"
        @clickSearch="clickSearch"
        @clickReset="clickReset"
      />
    </div>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :is-radio="true"
      :show-pagination="false"
    ></ideal-table-list>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()

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
  { label: 'ID', prop: 'id' }
]
// 列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const {
  getDataList
} = useCrud(state)

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '桶名称', prop: 'name' },
  { label: '存储类别', prop: 'category' },
  { label: '区域', prop: 'area' },
  { label: '数据冗余存储策略', prop: 'policy' },
  { label: '创建时间', prop: 'createTime' }
]
// 方法
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const cancelForm = () => {
  emit(EventEnum.cancel)
}

const submitForm = () => {
  emit(EventEnum.success)
}
</script>

<style scoped lang="scss">
.copy-bucket {
  width: 100%;
  .copy-bucket-search {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
