<template>
  <div class="tag">
    <div class="ideal-tip-text">您还可以添加10个标签。标签由键和值组成，针对分层管理资源可用键和值，普通管理资源只用键即可，值可以为空。</div>

    <ideal-button-events
      class="ideal-default-margin-top"
      :left-btns="leftButtons"
      :right-btns="rightButtons"
      @clickLeftEvent="clickLeftEvent"
      @clickRightEvent="clickRightEvent"
    />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #operation>
        <el-table-column label="操作" width="185">
          <template #default="props">
            <ideal-table-operate
              :buttons="operateBtns"
              :mode="MoreOperateEnum.cascaderPanel"
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
import {
  OperateEventEnum,
  MoreOperateEnum
} from '@/utils/enum'
import type {
  IdealButtonEventProp,
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
  { label: '键', prop: 'tag' },
  { label: '值', prop: 'availableZoneName' }
]
// 列表行数据操作事件
const operateBtns: IdealTableColumnOperate[] = [
  { title: '删除', prop: 'delete' },
  { title: '编辑', prop: 'edit' }
]
const clickOperateEvent = (command: string | number | object, row: any) => {
}
// 列表左侧按钮
const leftButtons: IdealButtonEventProp[] = [
  {
    title: '添加标签',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  }
]
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
  }
}
// 列表右侧按钮
const rightButtons: IdealButtonEventProp[] = [
  {
    prop: 'refresh',
    icon: 'refresh-icon'
  }
]
const clickRightEvent = (value: string | number | object) => {}

</script>

<style scoped lang="scss">
.tag {
  width: calc(100% - 40px);
  padding: 20px;
  background-color: white;
}
</style>