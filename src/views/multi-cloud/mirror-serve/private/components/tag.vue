<template>
  <div class="tag">
    <el-button type="primary">
      <svg-icon icon="circle-add" color="white" class="ideal-svg-margin-right"/>
      添加标签
    </el-button>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle">
      <template #bg>
        <el-table-column label="颜色">
          <template #default="props">
            <div class="tag-bg" :style="{'background-color':props.row.bg}"></div>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="185">
          <template #default="props">
            <ideal-table-operate
              :buttons="operateBtns"
              @clickMoreEvent="clickOperateEvent($event, props.row)"
            >
            </ideal-table-operate>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate
} from '@/types'


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
  deleteHandle
} = useCrud(state)

// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: '颜色', prop: 'bg', useSlot: true }
]
// 列表行数据操作事件
const operateBtns: IdealTableColumnOperate[] = [
  { title: '解绑', prop: 'delete' }
]
const clickOperateEvent = (command: string | number | object, row: any) => {}
state.dataList = [
  { name: 'test0001', bg: 'red' }
]
</script>

<style scoped lang="scss">
.tag {
  width: calc(100% - 40px);
  background-color: white;
  padding: 0 20px 20px;
  .tag-bg{ 
    width: 20px;
    height: 20px;
  }
}
</style>