<template>
  <div class="permission">
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
      <template #expandTable>
        <el-table-column type="expand">
          <template #default="props">
            <div class="permission-expand">授权地址：{{ props.row.address }}</div>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="125" fixed="right">
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
    />
  </div>
</template>

<script setup lang="ts">
import dialogBox from '../dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp
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
state.dataList = [
  { name: 'vpc-01', id: 1 }
]

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: '读写权限', prop: 'permission' },
  { label: '授权IP数量', prop: 'number' }
]
// 操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '添加授权', prop: 'addPermission' },
  { title: '删除', prop: 'delete' }
]
const rowData = ref()
const clickOperateEvent = (command: string | number | object, row: any) => {
  rowData.value = row
  if (command === 'addPermission') {
    showDialog.value = true
    dialogType.value = 'addPermission'
  } else if (command === 'delete') {
    // deleteHandle(row.id)
  }
}
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '添加VPC',
    prop: 'addVpc',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  }
])
const router = useRouter()
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'addVpc') {
    showDialog.value = true
    dialogType.value = 'addVpc'
  }
}

// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  resetDialog()
}
const clickRefreshEvent = () => {
  resetDialog()
}
// 重置弹框
const resetDialog = () => {
  showDialog.value = false
  dialogType.value = ''
}
</script>

<style scoped lang="scss">
.permission {
  background-color: white;
  padding: $idealPadding;
  .permission-expand {
    padding: 10px $idealPadding;
  }
}
</style>
