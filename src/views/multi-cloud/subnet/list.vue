<template>
  <div class="ideal-main-container subnet">
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
        <el-table-column label="名称/ID" width="280">
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

      <template #vpcName>
        <el-table-column label="虚拟私有云" width="150">
          <template #default="props">
            <div class="ideal-theme-text" @click="toVpc(props.row)">
              {{ props.row.vpcName }}
            </div>
          </template>
        </el-table-column>
      </template>

      <template #ipv6Gateway>
        <el-table-column label="ipv6网段" width="150">
          <template #default="props">
            <div class="flex-row">
              <div>{{ props.row.ipv6Gateway || '--' }}</div>
              <div
                v-if="props.row.ipv6Enable === false"
                class="ideal-theme-text"
                @click="handleIpv6(props.row)"
              >
                开启IPv6
              </div>
            </div>
          </template>
        </el-table-column>
      </template>

      <template #routeTable>
        <el-table-column label="路由表" width="150">
          <template #default="props">
            <div class="ideal-theme-text" @click="toRouteTable(props.row)">
              {{ props.row.routeTableName }}
            </div>
            <div>
              {{
                props.row.defaultRoute === '0' ? '自定义路由表' : '默认路由表'
              }}
            </div>
          </template>
        </el-table-column>
      </template>

      <template #tag>
        <el-table-column label="标签" width="150">
          <template #default="props">
            <ideal-tag-show
              :row="props.row"
              tag-key="cloudLabelDetails"
            ></ideal-tag-show>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="220" fixed="right">
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

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      :row-data="rowData"
      :custom-route="customRoute"
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
import { querySubnetPage, queryRouteTableDetail } from '@/api/java/network'

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
  dataListUrl: querySubnetPage,
  deleteUrl: '',
  createdIsNeed:
    !Object.keys(route.query).length || route.query?.open ? true : false
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList
} = useCrud(state)

watch(
  () => state.dataList,
  value => {
    if (value?.length) {
      value.forEach((item: any) => {
        item.showCopy = false
        item.operate = newOperate(item)
        item.acl = '--'
      })
    }
  }
)
// 表头
const tableHeaders = ref<IdealTableColumnHeaders[]>([])
const headerArray: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true, check: true, disabled: true },
  {
    label: '虚拟私有云',
    prop: 'vpcName',
    useSlot: true,
    check: true,
    disabled: false
  },
  {
    label: '云平台类别',
    prop: 'cloudPlatformCategory',
    width: '150',
    check: true,
    disabled: false
  },
  {
    label: '云平台类型',
    prop: 'cloudPlatformType',
    width: '150',
    check: true,
    disabled: false
  },
  {
    label: '云平台名称',
    prop: 'cloudPlatformName',
    width: '150',
    check: true,
    disabled: false
  },
  {
    label: '资源池名称',
    prop: 'resourcePoolName',
    width: '150',
    check: true,
    disabled: false
  },
  {
    label: '所属项目',
    prop: 'projectName',
    check: true,
    disabled: false,
    width: '150'
  },
  {
    label: 'ipv4网段',
    prop: 'cidr',
    width: '150',
    check: true,
    disabled: false
  },
  {
    label: 'ipv6网段',
    prop: 'ipv6Gateway',
    useSlot: true,
    check: true,
    disabled: false
  },
  {
    label: '可用区',
    prop: 'availableZone',
    width: '150',
    check: true,
    disabled: false
  },
  { label: '网络ACL', prop: 'acl', check: true, disabled: false },
  {
    label: '路由表',
    prop: 'routeTable',
    useSlot: true,
    check: true,
    disabled: false
  },
  { label: '标签', prop: 'tag', useSlot: true, check: true, disabled: false }
]
// 操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '更换路由表', prop: 'replace' },
  { title: '删除', prop: 'delete' },
  { title: '标签管理', prop: 'associateTag' }
]
const rowData: any = ref({})
const clickOperateEvent = (command: string | number | object, row: any) => {
  rowData.value = row
  if (command === 'replace') {
    if (row.routeTableId) {
      queryRouteList(row)
    }
    showDialog.value = true
    dialogType.value = OperateEventEnum.replace
  } else if (command === 'delete') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.delete
  } else if (command === 'associateTag') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.associate
  }
}

// 根据每行数据状态判断操作是否禁用
const newOperate = (item: any): IdealTableColumnOperate[] => {
  let resultArr: IdealTableColumnOperate[] = []
  const tempArr = JSON.parse(JSON.stringify(operateBtns))
  if (item.defaultRoute === '0') {
    resultArr = handleDelete(item.defaultRoute, tempArr)
  } else {
    resultArr = tempArr
  }
  return resultArr
}
//根据是否绑定自定义路由表判断是否可以删除
const handleDelete = (
  defaultRoute: string,
  array: IdealTableColumnOperate[]
) => {
  array.forEach((item: any) => {
    if (item.prop === 'delete' && defaultRoute === '0') {
      item.disabled = true
      item.disabledText =
        '子网关联了自定义路由表，不支持删除。\n请在了网操作列下单击“更换路由表”，\n将自定义路由表更换为默以路由表后重试'
    }
  })
  return array
}

//跳转路由表
const toRouteTable = (row: any) => {
  const { routeTableId, resourcePoolId, regionId, projectId } = row
  const detail = JSON.stringify({
    type: 'associateSubnet',
    id: routeTableId,
    resourcePoolId,
    regionId,
    projectId
  })
  router.push({
    path: '/multi-cloud/route-table/detail',
    query: { id: routeTableId }
  })
}
//跳转vpc
const toVpc = (row: any) => {
  const { vpcId, cloudPlatformTypeCode, cloudPlatformCategoryCode } = row
  router.push({
    path: '/multi-cloud/vpc/detail',
    query: { id: vpcId, cloudPlatformTypeCode, cloudPlatformCategoryCode }
  })
}
//开启ipv6
const handleIpv6 = (row: any) => {
  rowData.value = row
  showDialog.value = true
  dialogType.value = 'openIpv6'
}
//查询自定义路由
const customRoute: any = ref([])
const queryRouteList = (row: any) => {
  const params = {
    id: row.routeTableId,
    resourcePoolId: row.resourcePoolId,
    projectId: row.projectId,
    regionId: row.regionId
  }
  queryRouteTableDetail(params).then((res: any) => {
    const { data, code } = res
    if (code === 200) {
      customRoute.value = data.routeList
    } else {
      customRoute.value = []
    }
  })
}
// 列表左侧按钮
const leftButtons: IdealButtonEventProp[] = [
  {
    title: '新建子网',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  { title: '批量解绑标签', prop: 'unbindTag', disabled: false }
]
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    clickSubnetCreate()
  } else if (value === 'unbindTag') {
    dialogType.value = 'unbindTag'
    showDialog.value = true
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
const clickSubnetCreate = () => {
  rowData.value = {}
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
  const { id, vpcId, cloudPlatformTypeCode, cloudPlatformCategoryCode } = row
  router.push({
    path: '/multi-cloud/subnet/detail',
    query: { id, vpcId, cloudPlatformTypeCode, cloudPlatformCategoryCode }
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
.subnet {
  padding: $idealPadding;
  .ideal-theme-text {
    cursor: pointer;
  }
  .subnet-table-id {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ideal-theme-text {
    cursor: pointer;
    font-size: 12px;
  }
}
</style>
