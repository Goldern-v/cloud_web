<template>
  <div class="tag">
    <el-button type="primary">
      <svg-icon icon="circle-add"></svg-icon>
      添加标签
    </el-button>

    <el-divider />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :show-pagination="false"
    >
      <template #color>
        <el-table-column label="颜色">
          <template #default="props">
            <div class="tag-color-box" :style="{backgroundColor: props.row.color}"></div>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="185">
          <template #default="props">
            <el-button link type="primary" @click="clickDelete(props.row)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders } from '@/types'

// 弹性公网IP列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const { getDataList } = useCrud(state)
state.dataList = [
  { name: 'eip-0717', color: '#ed2' }
]
// 弹性公网IP表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: '颜色', prop: 'color', useSlot: true }
]
const clickDelete = (row: any) => {}
</script>

<style scoped lang="scss">
.tag {
  width: calc(100% - 40px);
  background-color: white;
  padding: 20px;
  .tag-color-box {
    width: 20px;
    height: 20px;
  }
}
</style>
