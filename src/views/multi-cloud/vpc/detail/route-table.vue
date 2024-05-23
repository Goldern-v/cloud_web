<template>
  <div class="route-table">
    <ideal-search
      :show-category="false"
      :show-platform-type="false"
      :show-resource-pool="false"
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
      :total="state.total"
      :page="state.page"
      :pagination-type="PaginationTypeEnum.totalSizes"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #name>
        <el-table-column label="名称/ID" show-overflow-tooltip>
          <template #default="props">
            <el-text type="primary" @click="toRouteTable(props.row)">{{
              props.row.name
            }}</el-text>

            <ideal-text-copy
              :row="props.row"
              @mouseEnterEvent="value => (props.row.showCopy = value)"
              @mouseLeaveEvent="value => (props.row.showCopy = value)"
            />
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
            <div class="ideal-theme-text">
              {{ props.row.subnetList?.length }}
            </div>
          </template>
        </el-table-column>
      </template>
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
      :row-data="rowData"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import dialogBox from '../../route-table/dialog-box.vue'
import {
  FiltrateEnum,
  PaginationTypeEnum,
  OperateEventEnum
} from '@/utils/enum'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealSearch,
  IdealTextProp,
  IdealButtonEventProp
} from '@/types'
import { queryRouteTablePage } from '@/api/java/network'
import store from '@/store'

interface DetailProps {
  detailInfo?: any // 行数据
}
const props = withDefaults(defineProps<DetailProps>(), {
  detailInfo: () => ({})
})

/**
 * 搜索类型
 */
const typeArray = ref<IdealSearch[]>([
  { label: '名称', prop: 'name', type: FiltrateEnum.input },
  { label: 'ID', prop: 'id', type: FiltrateEnum.input }
])
const onClickSearch = (v: IdealTextProp[]) => {
  state.queryForm = {}
  state.queryForm.vpcId = id
  if (v.length) {
    v.forEach((item: IdealTextProp) => {
      state.queryForm[item.prop] = item.value
    })
  }
  getDataList()
}

const route = useRoute()
const id = route.query?.id //vpcId
const cloudPlatformCategoryCode = route.query?.cloudPlatformCategoryCode //云类别
const cloudPlatformTypeCode = route.query?.cloudPlatformTypeCode //云类型

const state: IHooksOptions = reactive({
  dataListUrl: queryRouteTablePage,
  deleteUrl: '',
  queryForm: {
    vpcId: id
  },
  primaryKey: 'uuid'
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList
} = useCrud(state)
// 行数据操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '删除', prop: 'delete' }
]
// 当前行数据
const rowData = ref({})
// 行数据操作
const clickOperateEvent = (command: string | number | object, row: any) => {
  if (command === 'delete') {
    rowData.value = row
    showDialog.value = true
    dialogType.value = OperateEventEnum.delete
  }
}
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true },
  { label: '虚拟私有云', prop: 'vpc.name' },
  { label: '类型', prop: 'type', useSlot: true },
  {
    label: '关联子网',
    prop: 'associateSubnet',
    useSlot: true,
    check: true,
    disabled: false
  }
]

// 列表左侧按钮
const leftButtons: IdealButtonEventProp[] = [
  {
    title: '创建路由表',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  }
]
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    const { vdcId, resourcePoolId } = props.detailInfo
    const resourceInfo = {
      categoryId: cloudPlatformCategoryCode, //云类别
      cloudPlatformType: cloudPlatformTypeCode, //云类型
      resourcePoolId, //资源池id
      vdcId //vdcId
    }
    store.resourceStore.resourcePool = resourceInfo //复用路由表创建弹窗，根据vuex存储的resourcePool进行不同云判断
    rowData.value = props.detailInfo
    showDialog.value = true
    dialogType.value = OperateEventEnum.create
  }
}
// 列表右侧按钮
const rightButtons: IdealButtonEventProp[] = [
  {
    prop: 'refresh',
    icon: 'refresh-icon'
  }
]
const clickRightEvent = (value: string | number | object) => {
  if (value === 'refresh') {
    getDataList()
  }
}

const router = useRouter()
const toRouteTable = (row: any) => {
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

// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  currentChangeHandle(state.page as number) // 查询当前页数据
}
</script>

<style scoped lang="scss">
.route-table {
  width: 100%;
  padding: 20px;
  background-color: white;
  box-sizing: border-box;
  :deep(.el-select .el-input) {
    width: 200px;
  }
  .route-table__button {
    justify-content: space-between;
    align-items: center;
  }
  .route-table-create-time {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .el-text.el-text--primary {
    cursor: pointer;
  }
}
</style>
