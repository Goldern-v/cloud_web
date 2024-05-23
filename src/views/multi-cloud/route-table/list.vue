<template>
  <div class="ideal-main-container route-table">
    <ideal-search
      :exit-search-result="exitSearchResult"
      :type-array="typeArray"
      @clickSearch="onClickSearch"
    />

    <el-divider />

    <ideal-button-events
      :left-btns="leftButtons"
      :right-btns="rightButtons"
      @clickLeftEvent="clickLeftEvent"
      @clickRightEvent="clickRightEvent"
    >
    </ideal-button-events>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #name>
        <el-table-column label="名称/ID" show-overflow-tooltip>
          <template #default="props">
            <div
              class="ideal-theme-text"
              @click="clickRedirectDetail(props.row)"
            >
              {{ props.row.name }}
            </div>

            <ideal-text-copy
              :row="props.row"
              @mouseEnterEvent="value => (props.row.showCopy = value)"
              @mouseLeaveEvent="value => (props.row.showCopy = value)"
            />
          </template>
        </el-table-column>
      </template>

      <template #vpc>
        <el-table-column label="虚拟私有云">
          <template #default="props">
            <div class="ideal-theme-text">{{ props.row.vpc?.name }}</div>
          </template>
        </el-table-column>
      </template>

      <template #type>
        <el-table-column label="类型">
          <template #default="props">
            <div>
              {{ props.row.defaultRoute ? '默认路由表' : '自定义路由表' }}
            </div>
          </template>
        </el-table-column>
      </template>

      <template #associateSubnet>
        <el-table-column label="关联子网">
          <template #default="props">
            <div class="ideal-theme-text" @click="toSubnet(props.row)">
              {{ props.row.subnetList?.length }}
            </div>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" fixed="right" width="120">
          <template #default="props">
            <ideal-table-operate
              :buttons="operateBtns"
              :max-buttons="3"
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

    <ideal-set-table-header
      :show-drawer="showDrawer"
      :data-array="headerArray"
      @update:showDrawer="showDrawer = $event"
      @onClickSubmit="onClickSubmit"
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
  IdealTextProp
} from '@/types'
import { queryRouteTablePage } from '@/api/java/network'

const route = useRoute()
onMounted(() => {
  tableHeaders.value = headerArray
  if (Object.keys(route.query).length) {
    for (let key in route.query) {
      if (key !== 'open') {
        exitSearchResult.value.push({
          label: key + '：' + route.query[key],
          prop: key,
          value: route.query[key]
        })
      } else {
        showDialog.value = true
        dialogType.value = OperateEventEnum.create
      }
    }
  }
})

/**
 * 搜索类型
 */
const exitSearchResult: any = ref([])
const typeArray = ref<IdealSearch[]>([
  { label: '名称', prop: 'name', type: FiltrateEnum.input },
  { label: 'ID', prop: 'id', type: FiltrateEnum.input },
  { label: 'vpcId', prop: 'vpcId', type: FiltrateEnum.input }
])
const onClickSearch = (v: IdealTextProp[]) => {
  state.queryForm = {}
  if (v.length) {
    v.forEach((item: IdealTextProp) => {
      state.queryForm[item.prop] = item.value
    })
  }
  getDataList()
}
/**
 * 列表
 */
const state: IHooksOptions = reactive({
  dataListUrl: queryRouteTablePage,
  queryForm: {},
  createdIsNeed:
    !Object.keys(route.query).length || route.query?.open ? true : false
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList,
  deleteHandle
} = useCrud(state)

// 表头
const tableHeaders = ref<IdealTableColumnHeaders[]>([])
const headerArray: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true, check: true, disabled: true },
  {
    label: '虚拟私有云',
    prop: 'vpc',
    useSlot: true,
    check: true,
    disabled: false
  },
  { label: '类型', prop: 'type', useSlot: true, check: true, disabled: false },
  {
    label: '关联子网',
    prop: 'associateSubnet',
    useSlot: true,
    check: true,
    disabled: false
  },
  {
    label: '云平台类别',
    prop: 'cloudResourcePool.cloudCategoryName',
    check: true,
    disabled: false
  },
  {
    label: '云平台类型',
    prop: 'cloudResourcePool.cloudTypeName',
    check: true,
    disabled: false
  },
  {
    label: '云平台名称',
    prop: 'cloudResourcePool.cloudPlatform.name',
    check: true,
    disabled: false
  },
  {
    label: '资源池名称',
    prop: 'cloudResourcePool.name',
    check: true,
    disabled: false
  },
  {
    label: '所属项目',
    prop: 'projectName',
    check: true,
    disabled: false
  }
]
// 操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '关联子网', prop: 'associatedSubnet' },
  { title: '删除', prop: 'delete' }
]
const rowData: any = ref({})
const clickOperateEvent = (command: string | number | object, row: any) => {
  rowData.value = row
  showDialog.value = true
  if (command === 'associatedSubnet') {
    dialogType.value = OperateEventEnum.associate
  } else if (command === 'copy') {
    dialogType.value = OperateEventEnum.copy
  } else if (command === 'delete') {
    dialogType.value = OperateEventEnum.delete
  }
}

const toSubnet = (row: any) => {
  const { id, cloudResourcePool } = row
  router.push({
    path: '/multi-cloud/route-table/detail',
    query: {
      id,
      cloudCategory: cloudResourcePool?.cloudCategory,
      cloudType: cloudResourcePool?.cloudType,
      type: 'associateSubnet'
    }
  })
}
// 列表左侧按钮
const leftButtons: IdealButtonEventProp[] = [
  {
    title: '新建路由表',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  }
]
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    clickRouterTableCreate()
  }
}
// 列表右侧按钮
const rightButtons: IdealButtonEventProp[] = [
  {
    prop: 'refresh',
    icon: 'refresh-icon'
  },
  {
    prop: 'download',
    icon: 'download-icon'
  },
  {
    prop: 'setting',
    icon: 'setting-icon'
  }
]
const clickRightEvent = (value: string | number | object) => {
  if (value === 'setting') {
    drawerType.value = 'setting'
    showDrawer.value = true
  } else if (value === 'refresh') {
    getDataList()
  }
}

// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickRouterTableCreate = () => {
  showDialog.value = true
  dialogType.value = 'resourcePool'
}
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  if (dialogType.value === 'resourcePool') {
    dialogType.value = OperateEventEnum.create
  } else {
    showDialog.value = false
    getDataList()
  }
}
const router = useRouter()
// 详情
const clickRedirectDetail = (row: any) => {
  const { id, cloudResourcePool } = row
  router.push({
    path: '/multi-cloud/route-table/detail',
    query: {
      id,
      cloudCategory: cloudResourcePool?.cloudCategory,
      cloudType: cloudResourcePool?.cloudType
    }
  })
}

/**
 * 抽屉
 */
// 抽屉是否显示
const showDrawer = ref(false)
// 抽屉类型
const drawerType = ref('')
const onClickSubmit = (value: IdealTableColumnHeaders[]) => {
  const tempArr = value.filter((item: IdealTableColumnHeaders) => item.check)

  let array: IdealTableColumnHeaders[] = []
  headerArray.forEach((item: IdealTableColumnHeaders) => {
    tempArr.forEach((child: IdealTableColumnHeaders) => {
      if (child.prop === item.prop) {
        array.push(item)
      }
    })
  })
  tableHeaders.value = array
}
</script>

<style scoped lang="scss">
.route-table {
  padding: $idealPadding;
  .ideal-theme-text {
    cursor: pointer;
  }
}
</style>
