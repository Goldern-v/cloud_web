<template>
  <div class="exit-rule">
    <ideal-button-events
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    />

    <el-divider />

    <ideal-select-search
      :options="searchOptions"
      @clickSearch="clickSearch"
      @clickReset="clickReset"
    />

    <ideal-table-list
      ref="multipleTableRef"
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      :is-multiple="true"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #operation>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="props">
            <ideal-table-operate
              :buttons="operateBtns"
              @clickMoreEvent="clickOperateEvent($event, props.row)"
            />
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import dialogBox from './dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum } from '@/utils/enum'
import type {
  IdealButtonEventProp,
  IdealTableColumnHeaders,
  IdealTableColumnOperate
} from '@/types'

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
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList,
  deleteHandle
} = useCrud(state)

state.dataList = [
  { priority: '*', status: '启用', type: 'IPv4', policy: '允许', protocol: '全部', originAddress: '0.0.0.0/0', originPort: '全部', goalAddress: '0.0.0.0/0', goalPort: '全部', description: '--'},
  { priority: '1', status: '启用', type: 'IPv4', policy: '允许', protocol: '全部', originAddress: '0.0.0.0/0', originPort: '全部', goalAddress: '0.0.0.0/0', goalPort: '全部', description: '--'}
]
const multipleTableRef = ref()
watch(() => state.dataListSelections, value => {
  if (value) {
    value.forEach((item: any) => {
      if (item.priority === '*') {
        multipleTableRef.value.IdealTableList.toggleRowSelection(item, false)
      }
    })
  }
})

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '优先级', prop: 'priority' },
  { label: '状态', prop: 'status' },
  { label: '类型', prop: 'type' },
  { label: '策略', prop: 'policy' },
  { label: '协议', prop: 'protocol' },
  { label: '源地址', prop: 'originAddress' },
  { label: '源端口范围', prop: 'originPort' },
  { label: '目的地址', prop: 'goalAddress' },
  { label: '目的端口范围', prop: 'goalPort', width: '150' },
  { label: '描述', prop: 'description' }
]
// 操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '修改', prop: 'change' },
  { title: '删除', prop: 'delete' },
  { title: '向前插规则', prop: 'forward' },
  { title: '向后插规则', prop: 'backwards' },
  { title: '关闭', prop: 'close' }
]
const clickOperateEvent = (command: string | number | object, row: any) => {
  if (command === 'close') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.close
  } else if (command === 'forward') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.forward
  } else if (command === 'backwards') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.backwards
  } else if (command === 'change') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.change
  }
}
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  { title: '添加规则', prop: 'add' },
  { title: '删除', prop: 'delete', disabled: true, disabledText: '添加网络ACL规则时无法同时进行规则的添加、修改、删除等操作。' }
])
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'add') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.add
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
</script>

<style scoped lang="scss">
.exit-rule {
  background-color: white;
  padding: $idealPadding;
}
</style>
