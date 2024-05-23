<template>
  <div class="subnet">
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
        <el-table-column label="名称/ID">
          <template #default="props">
            <el-text type="primary" @click="toSubnet(props.row)">
              {{ props.row.name }}
            </el-text>

            <ideal-text-copy
              :row="props.row"
              @mouseEnterEvent="value => (props.row.showCopy = value)"
              @mouseLeaveEvent="value => (props.row.showCopy = value)"
            />
          </template>
        </el-table-column>
      </template>

      <template #cidr>
        <el-table-column label="ipv4网段">
          <template #default="props">
            <div class="flex-row">
              <div>{{ props.row.cidr }}(主网段)</div>
            </div>
          </template>
        </el-table-column>
      </template>

      <template #ipv6Gateway>
        <el-table-column label="ipv6网段">
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

      <template #status>
        <el-table-column label="状态">
          <template #default="props">
            <ideal-status-icon
              :status-icon="props.row.statusIcon"
              :status-text="props.row.statusText"
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
import dialogBox from '../../subnet/dialog-box.vue'
import {
  PaginationTypeEnum,
  OperateEventEnum,
  EventEnum,
  FiltrateEnum
} from '@/utils/enum'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp,
  IdealSearch,
  IdealTextProp
} from '@/types'
import { RESOURCE_STATUS, RESOURCE_STATUS_ICON } from '@/utils/dictionary'
import { querySubnetPage } from '@/api/java/network'

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
//公共参数
const commonParams = () => {
  const { resourcePoolId, regionId, projectId } = props.detailInfo
  const params = {
    resourcePoolId,
    regionId,
    projectId
  }
  return params
}
/**
 * 列表
 */
const state: IHooksOptions = reactive({
  dataListUrl: querySubnetPage,
  deleteUrl: '',
  queryForm: {
    vpcId: id
  },
  primaryKey: 'uuid'
})

// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true },
  { label: 'ipv4网段', prop: 'cidr', useSlot: true },
  { label: 'ipv6网段', prop: 'ipv6Gateway', useSlot: true },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '可用区', prop: 'availableZone' },
  { label: '网络ACL', prop: 'acl' }
]

const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList
} = useCrud(state)
// 行数据操作
const operateBtns: IdealTableColumnOperate[] = [
  // { title: '编辑', prop: 'edit' }, (暂时屏蔽)
  { title: '删除', prop: 'delete' }
]

const rowData = ref(null) // 当前行数据
// 行数据操作
const clickOperateEvent = (command: string | number | object, row: any) => {
  rowData.value = row
  showDialog.value = true
  if (command === 'delete') {
    dialogType.value = OperateEventEnum.delete
  } else if (command === 'edit') {
    rowData.value = row
    dialogType.value = OperateEventEnum.edit
  }
}

const handleIpv6 = (row: any) => {
  showDialog.value = true
  rowData.value = row
  dialogType.value = 'openIpv6'
}

watch(
  () => state.dataList,
  value => {
    if (value?.length) {
      value.forEach((item: any) => {
        item.statusText = RESOURCE_STATUS[item.status?.toUpperCase()]
        item.statusIcon = RESOURCE_STATUS_ICON[item.status?.toUpperCase()]
        item.acl = '--'
        item.showCopy = false
      })
    }
  }
)

// 列表左侧按钮
const leftButtons: IdealButtonEventProp[] = [
  {
    title: '创建子网',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  }
]
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
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
// 子网详情
const toSubnet = (row: any) => {
  const { id, vpcId, cloudPlatformTypeCode, cloudPlatformCategoryCode } = row
  router.push({
    path: '/multi-cloud/subnet/detail',
    query: { id, vpcId, cloudPlatformTypeCode, cloudPlatformCategoryCode }
  })
}
// 点击事件
interface EventEmits {
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  currentChangeHandle(state.page as number) // 查询当前页数据
}
</script>

<style scoped lang="scss">
.subnet {
  width: 100%;
  padding: 20px;
  background-color: white;
  box-sizing: border-box;
  .subnet-table-title {
    color: var(--el-color-primary);
    cursor: pointer;
  }
  :deep(.el-select .el-input) {
    width: 200px;
  }
  .subnet__button {
    justify-content: space-between;
    align-items: center;
  }
  .el-text.el-text--primary {
    cursor: pointer;
  }
}
</style>
