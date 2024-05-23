<template>
  <div class="ideal-main-container elastic-file">
    <div class="ideal-tip-text">
      创建文件系统成功后，您还需前往弹性云服务器执行挂载操作，才能实现多个云服务器共享文件存储。了解如何挂载文件系统。
    </div>
    <div class="ideal-tip-text ideal-middle-margin-bottom">
      您还可以创建2个文件系统，总容量为479.17TB。点击右边刷新按钮获取文件系统最新状态。
    </div>

    <ideal-select-search
      :options="searchOptions"
      @clickSearch="clickSearch"
      @clickReset="clickReset"
    />

    <el-divider />

    <ideal-button-events
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
      :is-multiple="true"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #name>
        <el-table-column label="名称">
          <template #default="props">
            <el-button link type="primary" @click="clickDetail">{{
              props.row.name
            }}</el-button>
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
import dialogBox from './dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp
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
state.dataList = [{ name: '122' }]

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true },
  { label: '状态', prop: 'status' },
  { label: '可用区', prop: 'area' },
  { label: '存储类型', prop: 'type' },
  { label: '共享协议', prop: 'protocol' },
  { label: '已用容量', prop: 'usedSize' },
  { label: '最大容量', prop: 'maxSize' },
  { label: '计费模式', prop: 'billingMode' },
  { label: '加密', prop: 'encrypt' },
  { label: '共享路径', prop: 'sharePath' }
]
// 操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '扩容', prop: 'expand' },
  { title: '退订', prop: 'unsubscribe' }
]
const rowData = ref()
const clickOperateEvent = (command: string | number | object, row: any) => {
  rowData.value = row
  if (command === 'expand') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.expand
  } else if (command === 'unsubscribe') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.unsubscribe
  }
}
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '新建弹性文件',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  {
    title: '删除',
    prop: 'delete',
    disabled: true,
    disabledText: '请选择需要删除的文件'
  }
])
const router = useRouter()
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    showDialog.value = true
    dialogType.value = 'resourcePool'
  } else if (value === 'delete') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.delete
  }
}
// 列表右侧按钮
const rightButtons = ref<IdealButtonEventProp[]>([
  { prop: 'refresh', icon: 'refresh-icon' }
])
const clickRightEvent = (value: string | number | object) => {
  if (value === 'refresh') {
    clickReset()
  }
}
watch(
  () => state.dataListSelections,
  value => {
    leftButtons.value[1].disabled = true
    if (value?.length) {
      leftButtons.value[1].disabled = false
    }
  }
)
const clickDetail = () => {
  router.push({ path: '/multi-cloud/elastic-file/detail' })
}
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  resetDialog()
}
const clickRefreshEvent = () => {
  if (dialogType.value === 'resourcePool') {
    router.push({ path: '/multi-cloud/elastic-file/create' })
  }
  resetDialog()
}
// 重置弹框
const resetDialog = () => {
  showDialog.value = false
  dialogType.value = ''
}
</script>

<style scoped lang="scss">
.elastic-file {
  padding: $idealPadding;
  background-color: white;
}
</style>
