<template>
  <div class="net-segment">
    <ideal-search :type-array="typeArray" @clickSearch="onClickSearch" />

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
  </div>
</template>

<script setup lang="ts">
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
import { clickCopy } from '@/utils/tool'
import { ElMessage, ElMessageBox } from 'element-plus/es'

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

const router = useRouter()

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
    label: '起始IP',
    prop: 'startIp',
    check: true,
    disabled: false
  },
  {
    label: '结束IP',
    prop: 'endIp',
    check: true,
    disabled: false
  },
  {
    label: '子网掩码',
    prop: 'subnetMask',
    check: true,
    disabled: false
  },
  {
    label: '网关',
    prop: 'gateWay',
    check: true,
    disabled: false
  },
  {
    label: 'IPv4地址使用率',
    prop: 'ipv4UtilizationRate',
    check: true,
    disabled: false
  },
  {
    label: 'Ipv4 CIDR',
    prop: 'ipv4',
    check: true,
    disabled: false
  },
  {
    label: '共享模式',
    prop: 'shareMode',
    check: true,
    disabled: false
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
    name: '10.245.20.1/24',
    startIp: '10.245.20.2',
    endIp: '10.245.20.254',
    ipv4UtilizationRate: '10%',
    ipv4: '10.10.2.2/24',
    shareMode: '全局共享',
    createTime: '2023-12-22 09:53:11',
    subnetMask: '255.255.255.0',
    mtu: '1500'
  }
]

watch(
  () => state.dataList,
  arr => {
    arr?.forEach((item: any) => {
      // item.operate = newOperate(item)
    })
  }
)

const toDetail = (row: any) => {
  const detail = JSON.stringify(row)
  router.push({
    path: '/multi-cloud/manage-network/detail',
    query: { detail }
  })
}

const operateButtons: IdealTableColumnOperate[] = [
  { type: 'primary', title: '设置共享模式', prop: 'setShareMode' },
  { type: 'primary', title: '删除', prop: 'delete' }
]

const rowData = ref({})
const clickOperateEvent = (command: string | number | object, row: any) => {
  rowData.value = row
  if (command === 'setShareMode') {
    handleSetShareMode(row)
  } else if (command === 'delete') {
    handleDelete(row)
  }
}
const handleSetShareMode = (row: any) => {
  ElMessageBox.confirm('确定要设置共享模式吗？', '设置共享模式', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const params = {}
    })
    .catch(() => {
      ElMessage.info('取消设置共享模式')
    })
}
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确定要删除网络段吗？', '删除网络段', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const params = {}
    })
    .catch(() => {
      ElMessage.info('取消删除网络段')
    })
}
</script>

<style scoped lang="scss">
.net-segment {
  padding: $idealPadding;
  background-color: white;
}
</style>
