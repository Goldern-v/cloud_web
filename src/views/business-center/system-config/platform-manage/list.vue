<template>
  <div class="ideal-main-container platform-manage">
    <ideal-select-search :options="searchOptions"> </ideal-select-search>

    <el-divider />

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
      :is-multiple="true"
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

const searchOptions = [{ label: '名称', prop: 'name' }]
// 列表左侧按钮
const leftButtons: IdealButtonEventProp[] = [
  {
    title: '新建平台',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  { title: '批量删除', prop: 'delete' }
]
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    dialogType.value = OperateEventEnum.create
  }
  showDialog.value = true
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
  {
    id: '1689919869390',
    name: '软件部署平台-雄安互联网区',
    type: 'regex',
    platformId: '234124212421412',
    url: 'https://repos.xay.xacloudy.cn:7443/devops-x'
  },
  {
    id: '1689919869390',
    name: '软件部署平台-雄安互联网区',
    type: 'regex',
    platformId: '234124212421412',
    url: 'https://repos.xay.xacloudy.cn:7443/devops-x'
  },
  {
    id: '1689919869390',
    name: '软件部署平台-雄安互联网区',
    type: 'regex',
    platformId: '234124212421412',
    url: 'https://repos.xay.xacloudy.cn:7443/devops-x'
  },
  {
    id: '1689919869390',
    name: '软件部署平台-雄安互联网区',
    type: 'regex',
    platformId: '234124212421412',
    url: 'https://repos.xay.xacloudy.cn:7443/devops-x'
  }
]
// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: 'ID', prop: 'id' },
  { label: '平台名称', prop: 'name' },
  { label: '平台类型', prop: 'type' },
  { label: '平台ID', prop: 'platformId' },
  { label: '登出URL', prop: 'url' }
]
// 列表行数据操作事件
const operateBtns: IdealTableColumnOperate[] = [
  { title: '编辑', prop: 'edit' },
  { title: '删除', prop: 'delete' }
]
const clickOperateEvent = (command: string | number | object, row: any) => {
  if (command === 'edit') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.edit
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
.platform-manage {
  background-color: white;
  padding: 20px;
}
</style>
