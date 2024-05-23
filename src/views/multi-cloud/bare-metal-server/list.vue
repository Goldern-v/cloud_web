<template>
  <div class="ideal-main-container bare-metal">
    <div class="ideal-tip-text">您还可以购买{{ quota }}台裸金属服务器，使用{{ cpuQuota }}核vCPU和{{ memoryQuota }}GiB内存。</div>

    <ideal-search class="ideal-middle-margin-top" :type-array="typeArray" @clickSearch="onClickSearch"></ideal-search>

    <!-- <ideal-select-search
      class="ideal-default-margin-top"
      :options="searchOptions"
      @clickSearch="clickSearch"
      @clickReset="clickReset"
    /> -->

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
        <el-table-column label="名称/ID" width="180" show-overflow-tooltip>
          <template #default="props">
            <el-button link type="primary" class="bare-metal-font-size" @click="clickDetail">{{ props.row.name }}</el-button>
            <div class="flex-row">
              <div class="bare-metal-table-id">{{ props.row.uuid }}</div>
              <svg-icon icon="copy-icon" @click="clickCopy(props.row?.uuid)" />
            </div>
          </template>
        </el-table-column>
      </template>

      <template #status>
        <el-table-column label="状态" width="120">
          <template #default="props">
            <ideal-status-icon
              v-if="props.row.status"
              :status-icon="props.row.statusIcon"
              :status-text="props.row.status"
            />
          </template>
        </el-table-column>
      </template>

      <template #billingMode>
        <el-table-column label="计费模式" width="150" show-overflow-tooltip>
          <template #default="props">
            <el-button link type="primary" class="bare-metal-font-size">{{ props.row.billingModeStr }}</el-button>
            <div class="bare-metal-font-size">{{ props.row.createTime }}</div>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="185" fixed="right">
          <template #default="props">
            <ideal-table-operate
              :buttons="props.row.operate"
              @clickMoreEvent="clickOperateEvent($event, props.row)"
            >
            </ideal-table-operate>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <!-- <dialog-box
      v-if="showDialog"
      :type="dialogType"
      :type-str="dialogTypeStr"
      :select-data="state.dataListSelections"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    /> -->
  </div>
</template>

<script setup lang="ts">
// import dialogBox from './dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { clickCopy } from '@/utils/tool'
import { OperateEventEnum, FiltrateEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp,
  IdealSearch,
  IdealTextProp
} from '@/types'

const typeArray = ref<IdealSearch[]>([
  { label: '日期', prop: 'date', type: FiltrateEnum.date },
  { label: '可用区', prop: 'availableZone', type: FiltrateEnum.list, array: [{ title: 'cn-east-2b', id: '1' }, { title: 'cn-east-1a', id: '2' }], arrayProp: 'title', arrayKey: 'id' },
  { label: '名称', prop: 'name', type: FiltrateEnum.input },
  { label: 'ID', prop: 'id', type: FiltrateEnum.input }
])

// 裸金属服务器配额
const quota = ref(196)
// vCPU
const cpuQuota = ref(792)
// 内存
const memoryQuota = ref(1584)

const onClickSearch = (v: IdealTextProp[]) => {
  console.log('---2--2--2---', v)
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
  getDataList
} = useCrud(state)
state.dataList = [
  {
    name: 'vpn跳板-不要动',
    uuid: 'e916a919-9dae-439f-a24a-becdfa7ab9ce',
    status: '正在使用',
    statusStr: 'using',
    statusIcon: 'status-success',
    availableZone: '可用区4',
    spec: '1vCPU | 2GiB',
    mirror: 'CoreOS 2079.4.0 64bit',
    ip: '192.168.1.2',
    billingModeStr: '按需计费',
    billingMode: 'onDemand',
    createTime: '2023/09/15 12:06:04'
  }
]
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称/ID', prop: 'name', useSlot: true },
  { label: '可用区', prop: 'availableZone' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '规格', prop: 'spec' },
  { label: '镜像', prop: 'mirror' },
  { label: 'IP地址', prop: 'ip' },
  { label: '计费模式', prop: 'billingMode', useSlot: true }
]
watch(
  () => state.dataList,
  value => {
    if (value?.length) {
      value.forEach((item: any) => {
        item.operate = newOperate(item)
      })
    }
  }
)
// 后期调接口后删除
onMounted(() => {
  if (state.dataList?.length) {
    state.dataList.forEach((item: any) => {
      item.operate = newOperate(item)
    })
  }
})
// 根据每行数据状态判断操作是否禁用
const newOperate = (item: any): IdealTableColumnOperate[] => {
  const resultArr: IdealTableColumnOperate[] = JSON.parse(JSON.stringify(operateBtns))
  if (!item.isAvailable) {
    resultArr[0].disabled = true
    resultArr[0].disabledText = dic.unavailable
  } 
  if (!item.isTransform) {
    resultArr[5].disabled = true
    resultArr[5].disabledText = dic.transform
  } 
  if (item.statusStr === 'using') {
    resultArr[6].disabled = true
    resultArr[6].disabledText = dic.delete
  }
  return resultArr
}
const dic: { [key: string]: string } = {
  unavailable: '只有可用状态的磁盘才能挂载。',
  transform: '请从云服务器发起转包年/包月。',
  delete: '正在使用状态的磁盘不允许执行此操作，请先卸载磁盘。'
}
// 操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '挂载', prop: 'mount' },
  { title: '扩容', prop: 'expand' },
  { title: '创建备份', prop: 'backup' },
  { title: '卸载', prop: 'unmounted' },
  { title: '创建快照', prop: 'snapShoot' },
  { title: '转包年包月', prop: 'change' },
  { title: '删除', prop: 'delete' }
]
const clickOperateEvent = (command: string | number | object, row: object) => {
  if (command === 'mount') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.mount
  } else if (command === 'expand') {
    router.push({ path: '/multi-cloud/bare-metal/expand' })
  }
}

// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '购买裸金属服务器',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  { title: '开机', prop: 'powerOn', disabled: true, disabledText: '请选择裸金属服务器' },
  { title: '关机', prop: 'shutdown', disabled: true, disabledText: '请选择裸金属服务器' },
  { title: '重启', prop: 'reboot', disabled: true, disabledText: '请选择裸金属服务器' },
  { title: '删除', prop: 'delete', disabled: true, disabledText: '请选择裸金属服务器' },
  { title: '导出', prop: 'export' }
])
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    handleBareMetalCreate()
  } else if (value === 'openAutoRenew') {
    showDialog.value = true
    dialogTypeStr.value = 'openAutoRenew'
  } else if (value === 'changeAutoRenew') {
    showDialog.value = true
    dialogTypeStr.value = 'changeAutoRenew'
  } else if (value === 'IMToOnDemand') {
    showDialog.value = true
    dialogTypeStr.value = 'IMToOnDemand'
  } else if (value === 'expireToOnDemand') {
    showDialog.value = true
    dialogTypeStr.value = 'expireToOnDemand'
  }
}
watch(() => state.dataListSelections, value => {
  leftButtons.value[1].disabled = true
  leftButtons.value[2].disabled = true
  leftButtons.value[3].disabled = true
  leftButtons.value[4].disabled = true
  if (value?.length) {
    leftButtons.value[1].disabled = false
    leftButtons.value[2].disabled = false
    leftButtons.value[3].disabled = false
    leftButtons.value[4].disabled = false
  }
})
const router = useRouter()
const handleBareMetalCreate = () => {
  router.push({ path: '/multi-cloud/bare-metal-server/create' })
}
const clickDetail = () => {
  // router.push({ path: '/multi-cloud/bare-metal/detail' })
}
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum>()
const dialogTypeStr = ref('')
const clickCloseEvent = () => {
  resetDialog()
}
const clickRefreshEvent = () => {
  resetDialog()
}
// 重置弹框
const resetDialog = () => {
  showDialog.value = false
  dialogType.value = undefined // 防止再点击弹框时 有值
  dialogTypeStr.value = ''
}
</script>

<style scoped lang="scss">
.bare-metal {
  padding: $idealPadding;
  .bare-metal-table-id {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 3px;
    font-size: $defaultFontSize;
  }
  .bare-metal-font-size {
    font-size: $defaultFontSize;
  }
}
</style>
