<template>
  <div class="ideal-table-list__container cloud-server">
    <ideal-search :type-array="typeArray" @clickSearch="onClickSearch" />

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
      <template #name>
        <el-table-column label="ECS名称/ID">
          <template #default="props">
            <div>{{ props.row.name }}</div>
            <div>{{ props.row.uuid }}</div>
          </template>
        </el-table-column>
      </template>

      <template #status>
        <el-table-column label="状态">
          <template #default="props">
            <ideal-status-icon
              v-if="props.row.status"
              :status-icon="props.row.statusIcon"
              :status-text="props.row.status"
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
            />
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      :data-list="selectBind"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    />
  </div>
</template>

<script setup lang="ts">
import dialogBox from './dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum, FiltrateEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp,
  IdealSearch,
  IdealSearchResult
} from '@/types'

const typeArray = ref<IdealSearch[]>([
  { label: '名称', prop: 'name', type: FiltrateEnum.input }
])
const onClickSearch = (v: IdealSearchResult[]) => {
  state.queryForm = {}
  if (v.length) {
    v.forEach((item: IdealSearchResult) => {
      state.queryForm[item.prop] = item.value
    })
  }
  getDataList()
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
  getDataList
} = useCrud(state)

state.dataList = [
  {
    name: 'ecs-4093',
    uuid: '9403-23ab-3402-af32',
    status: '关机',
    statusIcon: 'status-error',
    privateIp: '192.43.23.1',
    eip: '',
    bindKeyPair: ''
  },
  {
    name: 'ecs-3af2',
    uuid: '1bf3-f0d3-64b2-ef71',
    status: '关机',
    statusIcon: 'status-error',
    privateIp: '12.5.62.9',
    eip: '',
    bindKeyPair: ''
  }
]
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: 'ECS名称/ID', prop: 'name', useSlot: true, width: '140' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '私有IP地址', prop: 'privateIp' },
  { label: '弹性IP', prop: 'eip' },
  { label: '绑定密钥对', prop: 'bindKeyPair' }
]
const operateBtns: IdealTableColumnOperate[] = [{ title: '绑定', prop: 'bind' }]
// 需要绑定的云服务器(注:不直接使用state.dataListSelections防止多选后,操作绑定,再选多选绑定数据错乱)
const selectBind: any = ref([])
const clickOperateEvent = (command: string | number | object, row: object) => {
  if (command === 'bind') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.bind
    selectBind.value = [row]
  }
}
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '绑定',
    prop: 'bind',
    type: 'primary',
    iconColor: 'white',
    disabled: true,
    disabledText: '还未选择云服务器'
  }
])
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'bind') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.bind
    selectBind.value = state.dataListSelections
  }
}
// 监听多选结果,修改绑定按钮是否可操作
watch(
  () => state.dataListSelections,
  value => {
    leftButtons.value[0].disabled = true
    if (value?.length) {
      leftButtons.value[0].disabled = false
    }
  }
)
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
.cloud-server {
  width: 100%;
  padding: 10px 20px 20px;
}
</style>
