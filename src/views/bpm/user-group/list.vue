<template>
  <div class="ideal-table-list__container user-group">
    <ideal-select-search
      :search-type="SearchTypeEnum.title"
      :slot-array="slotArray"
      prefix-title="组名"
      @clickSearch="clickSearch"
      @clickReset="clickReset"
    >
      <template #stateValue>
        <el-select
          v-model="stateValue"
          placeholder="请选择"
          class="user-group-state"
        >
          <template #prefix>状态:</template>
          <el-option
            v-for="item in sateList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>

      <template #timeRange>
        <div class="cloud-host__time-range">
          <el-date-picker
            v-model="timeRange"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </div>
      </template>
    </ideal-select-search>

    <el-divider />

    <ideal-button-events
      :right-btns="rightButtons"
      @clickRightEvent="clickRightEvent"
    >
    </ideal-button-events>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
      <template #createTime>
        <el-table-column label="创建时间" align="center" show-overflow-tooltip>
          <template #default="props">
            {{ props.row.createTime }}
          </template>
        </el-table-column>
      </template>
      <template #operation>
        <el-table-column label="操作" width="125" align="center">
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

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      :row-data="rowData"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script lang="ts" setup>
import dialogBox from './dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum, SearchTypeEnum } from '@/utils/enum'
import {
  IdealButtonEventProp,
  IdealTableColumnHeaders,
  IdealTableColumnOperate
} from '@/types'

const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const { sizeChangeHandle, currentChangeHandle, getDataList, deleteHandle } =
  useCrud(state)

// 搜索插槽
const slotArray = ['groupName', 'stateValue', 'timeRange']

// 时间范围
const timeRange = ref('')

// 状态
const stateValue = ref('')
const sateList: any = ref([
  { label: '开启', value: 1 },
  { label: '关闭', value: 0 }
])

// 搜索
const clickSearch = (search: string, type: string) => {
  state.queryForm.type = type
  state.queryForm.search = search
  getDataList()
}

// 重置
const clickReset = () => {
  state.queryForm = {}
  getDataList()
}

state.dataList = [
  {
    name: 'test',
    description: 'test',
    memberUser: '用户名2',
    status: '开启',
    id: 114,
    createTime: 1692340836000
  },
  {
    name: 'ddd',
    description: '222',
    memberUser: '用户1',
    status: '关闭',
    id: 113,
    createTime: 1692328945000
  }
]

// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '编号', prop: 'id' },
  { label: '组名', prop: 'name' },
  { label: '描述', prop: 'description' },
  { label: '成员', prop: 'memberUser' },
  { label: '状态', prop: 'status' },
  { label: '创建时间', prop: 'createTime' }
]

// 列表右侧按钮
const rightButtons: IdealButtonEventProp[] = [
  {
    prop: 'add',
    title: '新增',
    type: 'primary',
    icon: 'circle-add'
  }
]

// 列表操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '编辑', prop: 'edit' },
  { title: '删除', prop: 'delete' }
]

// 右侧按键回调函数
const clickRightEvent = (value: string | number | object) => {
  if (value === 'add') {
    dialogType.value = OperateEventEnum.create
    showDialog.value = true
  }
}

// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
}

const rowData = ref()
const clickOperateEvent = (command: string | number | object, row: any) => {
  rowData.value = row
  if (command === 'edit') {
    dialogType.value = OperateEventEnum.edit
    showDialog.value = true
  } else if (command === 'delete') {
    deleteHandle(row.id)
  }
}
</script>

<style scoped lang="scss">
.user-group {
  padding: 20px;
  box-sizing: border-box;

  .cloud-host__time-range {
    margin-right: 10px;
  }
  .user-group-state {
    margin-right: 10px;
    :deep(.el-input) {
      width: 160px;
    }
  }
}
</style>
