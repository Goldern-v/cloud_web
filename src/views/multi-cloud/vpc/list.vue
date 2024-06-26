<template>
  <div class="ideal-main-container vpc">
    <ideal-search
      ref="searchRef"
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
    >
      <template #name>
        <el-table-column label="名称/ID" width="280">
          <template #default="props">
            <div
              class="vpc-table-title"
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

      <template #status>
        <el-table-column label="状态" width="120">
          <template #default="props">
            <ideal-status-icon
              :status-icon="props.row.statusIcon"
              :status-text="props.row.statusText"
            ></ideal-status-icon>
          </template>
        </el-table-column>
      </template>

      <template #subnetCount>
        <el-table-column label="子网个数" width="150">
          <template #default="props">
            <div class="vpc-table-title" @click="toSubnet(props.row)">
              {{ props.row.subnetDtoList?.length }}
            </div>
          </template>
        </el-table-column>
      </template>

      <template #routeTable>
        <el-table-column label="路由表" width="150">
          <template #default="props">
            <div class="vpc-table-title" @click="toRouteTable(props.row)">
              {{ props.row.routeTableNum }}
            </div>
          </template>
        </el-table-column>
      </template>

      <template #instanceNum>
        <el-table-column label="服务器个数" width="150">
          <template #default="props">
            <div class="flex-row">
              <div class="ideal-theme-text" @click="toInstance(props.row)">
                {{ props.row.instanceNum }}
              </div>
              <svg-icon
                icon="cart-icon"
                class="ideal-svg-margin-left"
              ></svg-icon>
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
        <el-table-column label="操作" width="185" fixed="right">
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
import { RESOURCE_STATUS, RESOURCE_STATUS_ICON } from '@/utils/dictionary'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp,
  IdealSearch,
  IdealTextProp
} from '@/types'
import { queryVpcPage } from '@/api/java/network'

onMounted(() => {
  tableHeaders.value = headerArray
})

/**
 * 搜索类型
 * @type {IdealSearch[]}
 */
const searchRef = ref()
const typeArray = ref<IdealSearch[]>([
  { label: '名称', prop: 'name', type: FiltrateEnum.input },
  { label: 'ID', prop: 'id', type: FiltrateEnum.input }
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
const state: IHooksOptions = reactive({
  dataListUrl: queryVpcPage,
  deleteUrl: ''
})
const { sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)

watch(
  () => state.dataList,
  value => {
    if (value?.length) {
      value.forEach((item: any) => {
        item.showCopy = false
        item.statusText = RESOURCE_STATUS[item.status?.toUpperCase()]
        item.statusIcon = RESOURCE_STATUS_ICON[item.status?.toUpperCase()]
      })
    }
  }
)

// 表头
const tableHeaders = ref<IdealTableColumnHeaders[]>([])
const headerArray: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true, check: true, disabled: true },
  {
    label: 'IPV4网关',
    prop: 'cidr',
    width: '150',
    check: true,
    disabled: false
  },
  {
    label: '状态',
    prop: 'status',
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
    label: '子网个数',
    prop: 'subnetCount',
    useSlot: true,
    check: true,
    disabled: false
  },
  {
    label: '路由表',
    prop: 'routeTable',
    useSlot: true,
    check: true,
    disabled: false
  },
  {
    label: '服务器个数',
    prop: 'instanceNum',
    useSlot: true,
    check: true,
    disabled: false
  },
  { label: '标签', prop: 'tag', useSlot: true, check: true, disabled: false }
]
// 列表操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '编辑网段', prop: 'edit' },
  { title: '删除', prop: 'delete' },
  { title: '标签管理', prop: 'associateTag' }
]
const rowData: any = ref({})
const clickOperateEvent = (command: string | number | object, row: object) => {
  rowData.value = row
  showDialog.value = true
  if (command === 'edit') {
    dialogType.value = OperateEventEnum.edit
  } else if (command === 'associateTag') {
    dialogType.value = OperateEventEnum.associate
  } else if (command === 'delete') {
    dialogType.value = OperateEventEnum.delete
  }
}
const toSubnet = (row: any) => {
  router.push({ path: '/multi-cloud/subnet/list', query: { vpcId: row.id } })
}
const toRouteTable = (row: any) => {
  router.push({
    path: '/multi-cloud/route-table/list',
    query: { vpcId: row.id }
  })
}
// 列表左侧按钮
const leftButtons: IdealButtonEventProp[] = [
  {
    title: '新建虚拟私有云',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  {
    title: '批量解绑标签',
    prop: 'unbindTag'
  }
]
const clickLeftEvent = (command: string | number | object) => {
  if (command === 'create') {
    clickVpcCreate()
  } else if (command === 'unbindTag') {
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
    searchRef.value.clickDeleteAll()
    getDataList()
  }
}

const router = useRouter()
const clickVpcCreate = () => {
  showDialog.value = true
  dialogType.value = 'resourcePool'
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
    router.push({ path: '/multi-cloud/vpc/create' })
  } else {
    getDataList()
  }
}
// 详情
const clickRedirectDetail = (row: any) => {
  const { id, cloudPlatformTypeCode, cloudPlatformCategoryCode } = row
  router.push({
    path: '/multi-cloud/vpc/detail',
    query: { id, cloudPlatformTypeCode, cloudPlatformCategoryCode }
  })
}

const toInstance = (row: any) => {
  router.push({
    path: '/multi-cloud/cloud-host/list',
    query: { vpcId: row.uuid }
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
.vpc {
  padding: $idealPadding;
  .vpc__search {
    align-items: center;
    justify-content: space-between;
  }
  .vpc-table-title {
    color: var(--el-color-primary);
    cursor: pointer;
  }
  .vpc-table-id {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  // 修改列表高度
  :deep(.el-table) {
    height: calc(
      100vh - var(--navigation-bar-height) - var(--theme-header-height) - 40px -
        40px - 52px - 20px - 32px - 65px
    );
  }
}
</style>
