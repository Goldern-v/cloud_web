<template>
  <div class="ideal-main-container public-network">
    <ideal-search :type-array="typeArray" @clickSearch="onClickSearch" />

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
      :total="state.total"
      :is-multiple="true"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #name>
        <el-table-column label="名称" show-overflow-tooltip width="280">
          <template #default="props">
            <ideal-text-copy
              :row="props.row"
              label-key="name"
              copy-key="name"
              @mouseEnterEvent="value => (props.row.showCopy = value)"
              @mouseLeaveEvent="value => (props.row.showCopy = value)"
            />
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="185" fixed="right">
          <template #default="props">
            <ideal-table-operate
              :buttons="operateButtons"
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

<script setup lang="ts">
import dialogBox from './dialog-box.vue'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum, BillingEnum, FiltrateEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp,
  IdealSearch,
  IdealTextProp
} from '@/types'
import { useCrud } from '@/hooks'

onMounted(() => {
  tableHeaders.value = headerArray
})
//搜索
const typeArray = ref<IdealSearch[]>([
  { label: '名称', prop: 'name', type: FiltrateEnum.input }
])
const onClickSearch = (v: IdealTextProp[]) => {
  // state.queryForm = {}
  // if (v.length) {
  //   v.forEach((item: IdealTextProp) => {
  //     const temp = item.label.split('：')
  //     state.queryForm[item.prop] = temp[1]
  //   })
  // }
  // getDataList()
}

// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '创建公有网络',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  {
    title: '设置共享模式',
    prop: 'shareMode',
    icon: 'pause-circle',
    iconColor: 'var(--el-button-text-color)',
    disabled: true,
    disabledText: '请选择公有网络'
  }
])

const router = useRouter()
const clickLeftEvent = (value: string | number | object) => {
  showDialog.value = true
  if (value === 'create') {
    dialogType.value = 'resourcePool'
  } else if (value === 'shareMode') {
    dialogType.value = 'setShareMode'
  }
}

// 列表右侧按钮
const rightButtons = ref<IdealButtonEventProp[]>([
  { prop: 'refresh', icon: 'refresh-icon' }
])
const clickRightEvent = (value: string | number | object) => {
  if (value === 'refresh') {
    // getDataList()
  }
}

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})

const tableHeaders = ref<IdealTableColumnHeaders[]>([])
const headerArray: IdealTableColumnHeaders[] = [
  {
    label: '名称',
    prop: 'name',
    useSlot: true,
    check: true,
    disabled: true
  },
  {
    label: 'IPv4 CIDR',
    prop: 'ipv4',
    check: true,
    disabled: true
  },
  {
    label: '共享模式',
    prop: 'shareMode',
    check: true,
    disabled: true
  },
  {
    label: '云平台类别',
    prop: 'pool.cloudCategoryName',
    width: '150',
    check: true,
    disabled: false
  },
  {
    label: '云平台类型',
    prop: 'pool.cloudTypeName',
    width: '150',
    check: true,
    disabled: false
  },
  {
    label: '资源池名称',
    prop: 'pool.name',
    width: '150',
    check: true,
    disabled: false
  },
  { label: '所属项目', prop: 'project.name', check: true, disabled: false },
  {
    label: '创建时间',
    prop: 'createTime',
    check: true,
    disabled: true
  }
]

const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList
} = useCrud(state)

state.dataList = [
  {
    name: '公有网络',
    ipv4: '10.10.2.2/24',
    shareMode: '全局共享',
    createTime: '2023-12-22 09:53:11',
    pool: {
      cloudCategoryName: '私有云',
      cloudTypeName: 'zstack'
    },
    project: {
      name: 'default'
    }
  }
]

const multipleSelection: any = ref([])
watch(
  () => state.dataListSelections,
  arr => {
    multipleSelection.value = arr
    leftButtons.value[1].disabled = arr?.length ? false : true
    leftButtons.value[1].disabledText = arr?.length ? '' : '请选择公有网络'
  },
  { deep: true }
)

watch(
  () => state.dataList,
  arr => {
    arr?.forEach((item: any) => {
      // item.operate = newOperate(item)
    })
  }
)

const operateButtons: IdealTableColumnOperate[] = [
  { type: 'primary', title: '编辑', prop: 'edit' },
  { type: 'primary', title: '删除', prop: 'delete' },
  { type: 'primary', title: '设置共享模式', prop: 'set-share-mode' }
]

const rowData = ref({})
const clickOperateEvent = (command: string | number | object, row: object) => {
  showDialog.value = true
  rowData.value = row
  if (command === 'edit') {
    dialogType.value = OperateEventEnum.edit
  } else if (command === 'delete') {
    dialogType.value = OperateEventEnum.delete
  } else if (command === 'set-share-mode') {
    showDialog.value = true
    dialogType.value = 'setShareMode'
  }
}
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  if (dialogType.value === 'resourcePool') {
    router.push({
      path: '/multi-cloud/public-network/create'
    })
  } else {
    getDataList()
  }
}
</script>

<style scoped lang="scss">
.public-network {
  padding: $idealPadding;
  // background-color: white;
}
</style>
