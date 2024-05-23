<template>
  <div class="ideal-main-container ad-ldap">
    <ideal-button-events
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    >
    </ideal-button-events>

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

// 列表左侧按钮
const leftButtons: IdealButtonEventProp[] = [
  {
    title: '新建',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  }
]
const router = useRouter()
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    router.push({ path: '/business-center/system-config/ad-ldap/create' })
  }
}
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
  { id: '1', name: 'serverName', ip: '192.168.3.1', port: '80', ssl: '否' },
  { id: '2', name: 'serverName', ip: '192.168.3.2', port: '80', ssl: '否' },
  { id: '3', name: 'serverName', ip: '192.168.3.3', port: '80', ssl: '否' },
  { id: '4', name: 'serverName', ip: '192.168.3.4', port: '80', ssl: '否' }
]
// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: 'ID', prop: 'id' },
  { label: '名称', prop: 'name' },
  { label: 'IP', prop: 'ip' },
  { label: '端口', prop: 'port' },
  { label: 'SSL链接', prop: 'ssl' }
]
// 列表行数据操作事件
const operateBtns: IdealTableColumnOperate[] = [
  { title: '导入', prop: 'import' }
]
const clickOperateEvent = (command: string | number | object, row: any) => {
  if (command === 'import') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.import
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
.ad-ldap {
  background-color: white;
  padding: 20px;
}
</style>
