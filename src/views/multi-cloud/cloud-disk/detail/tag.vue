<template>
  <div class="tag ideal-large-margin-top">
    <el-button type="primary">
      <svg-icon icon="circle-add"></svg-icon>
      添加标签
    </el-button>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :show-pagination="false"
    >
      <template #operation>
        <el-table-column label="操作" width="120">
          <template #default="props">
            <ideal-table-operate
              :buttons="operateBtns"
              @clickMoreEvent="clickOperateEvent($event, props.row)"
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
import type { IdealTableColumnHeaders, IdealTableColumnOperate } from '@/types'

// 弹性公网IP列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const { getDataList } = useCrud(state)
state.dataList = [
  { value: '1', key: 'a' }
]
// 弹性公网IP表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '键', prop: 'key' },
  { label: '值', prop: 'value' }
]
// 操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '编辑', prop: 'edit' },
  { title: '删除', prop: 'delete' }
]
const clickOperateEvent = (command: string | number | object, row: any) => {
  if (command === 'delete') {
  }
}
</script>

<style scoped lang="scss">
.tag {
  background-color: white;
  padding: $idealPadding;
}
</style>
