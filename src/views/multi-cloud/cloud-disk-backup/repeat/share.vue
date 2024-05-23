<template>
  <div class="share">
    <div class="flex-row">
      <el-select v-model="status" placeholder="请选择" class="ideal-default-margin-right">
        <el-option
          v-for="item of statusList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>

      <ideal-select-search
        @clickSearch="clickSearch"
        @clickReset="clickReset"
      />
    </div>

    <el-divider />

    <ideal-button-events
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :is-multiple="true"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #status>
        <el-table-column label="状态">
          <template #default="props">
            <ideal-status-icon
              v-if="props.row.status"
              :status-icon="props.row.statusType"
              :status-text="props.row.statusDes"
            />
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="185">
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
import {
  SearchTypeEnum,
  OperateEventEnum
} from '@/utils/enum'
import type {
  IdealButtonEventProp,
  IdealTableColumnHeaders,
  IdealTableColumnOperate
} from '@/types'

const status = ref()
const statusList = ref<any>([])

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
  { label: '名称/ID', prop: 'name' },
  { label: '状态', prop: 'status' },
  { label: '备份类型', prop: 'type' },
  { label: '磁盘名称', prop: 'ecsName' },
  { label: '磁盘容量(GB)', prop: 'ecsType' },
  { label: '创建时间', prop: 'createTime' }
]
// 列表行数据操作事件
const operateBtns: IdealTableColumnOperate[] = [
  { title: '删除', prop: 'delete' },
  { title: '编辑', prop: 'edit' }
]
const clickOperateEvent = (command: string | number | object, row: any) => {
}
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  { title: '删除', prop: 'delete', disabled: true, disabledText: '请先选择' }
])
const clickLeftEvent = (value: string | number | object) => {
}
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
.share {
  width: calc(100% - 40px);
  padding: 10px 20px 20px;
  background-color: white;
}
</style>