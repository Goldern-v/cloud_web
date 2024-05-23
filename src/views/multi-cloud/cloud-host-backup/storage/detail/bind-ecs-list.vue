<template>
  <div class="bind-ecs">
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
      ref="tableRef"
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :is-multiple="true"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle">
      <template #status>
        <el-table-column label="状态">
          <template #default="props">
            <ideal-status-icon
              v-if="props.row.status"
              :status-icon="props.row.statusType"
              :status-text="props.row.statusDes"
            ></ideal-status-icon>
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
  { label: '名称', prop: 'name' },
  { label: '服务器状态', prop: 'status' },
  { label: '服务器类型', prop: 'type' },
  { label: '可用区', prop: 'availableZone' },
  { label: '已选磁盘', prop: 'selected' },
  { label: '备份个数', prop: 'number' },
  { label: '备份空间(GB)', prop: 'size' }
]
// 列表行数据操作事件
const operateBtns: IdealTableColumnOperate[] = []
const clickOperateEvent = (command: string | number | object, row: any) => {}
// 列表左侧按钮
const leftButtons: IdealButtonEventProp[] = [
  { title: '绑定', prop: 'bind' },
  { title: '迁移', prop: 'migration' },
  { title: '解绑', prop: 'unbind' }
]
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
  }
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
.bind-ecs {
  width: calc(100% - 40px);
  padding: 20px;
  background-color: white;
}
</style>