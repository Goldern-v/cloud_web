<template>
  <div class="ideal-table-list__container main-net-card">
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
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #privateIp>
        <el-table-column label="私有IP地址" width="120">
          <template #default="props">
            <div
              class="main-net-card-title"
              @click="clickRedirectDetail(props.row, '')"
            >
              {{ props.row.fixedIp }}
            </div>
          </template>
        </el-table-column>
      </template>

      <template #network>
        <el-table-column label="所属网络" width="160">
          <template #default="props">
            <p class="ideal-theme-text" @click="toVpc(props.row)">
              {{ props.row.vpcName }}
            </p>
            <p class="ideal-theme-text" @click="toSubnet(props.row)">
              {{ props.row.subnet?.name }}
            </p>
          </template>
        </el-table-column>
      </template>

      <template #instance>
        <el-table-column label="已绑定实例" width="120">
          <template #default="props">
            <p class="ideal-theme-text" @click="toInstance(props.row)">
              {{ props.row.instance?.name }}
            </p>
          </template>
        </el-table-column>
      </template>

      <template #eip>
        <el-table-column label="绑定的弹性公网IP" width="120">
          <template #default="props">
            <p class="ideal-theme-text">
              {{ props.row.eip?.ipAddress || '--' }}
            </p>
          </template>
        </el-table-column>
      </template>

      <template #safeGroup>
        <el-table-column label="安全组">
          <template #default="props">
            <div class="ideal-theme-text" @click="toSafeGroup(props.row)">
              {{ props.row.securityGroupNum }}
            </div>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" fixed="right" width="240">
          <template #default="props">
            <ideal-table-operate
              :buttons="props.row.operate"
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
      nic-type="MAIN_CARD"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import dialogBox from '../dialog-box.vue'
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
import { NicTypeDic } from '@/utils/dictionary'
import { queryNetCardPage } from '@/api/java/network'
/**
 * 搜索类型
 * @type {IdealSearch[]}
 */
const typeArray = ref<IdealSearch[]>([
  { label: '私有IP地址', prop: 'name', type: FiltrateEnum.input },
  { label: 'ID', prop: 'id', type: FiltrateEnum.input }
])
const onClickSearch = (v: IdealTextProp[]) => {
  state.queryForm = {}
  if (v.length) {
    v.forEach((item: IdealTextProp) => {
      const temp = item.label.split(':')
      state.queryForm[item.prop] = temp[1]
    })
  }
  getDataList()
}
/**
 * 列表
 */
const state: IHooksOptions = reactive({
  dataListUrl: queryNetCardPage,
  deleteUrl: '',
  queryForm: {
    type: 'MAIN_CARD'
  }
})

const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList
} = useCrud(state)

watch(
  () => state.dataList,
  arr => {
    arr?.forEach(item => {
      item.nicType = NicTypeDic[item.type]
      item.operate = newOperate(item)
    })
  }
)

const newOperate = (item: any): IdealTableColumnOperate[] => {
  let resultArr: IdealTableColumnOperate[] = []
  const tempArr = JSON.parse(JSON.stringify(operateBtns))
  const arr = handleBindOperate(item, tempArr)
  if (item.bindInstanceType === 'ECS') {
    resultArr = handleBindOrNot(arr)
  } else {
    resultArr = arr
  }
  return resultArr
}
//判断绑定状态，显示绑定还是解绑按钮
const handleBindOperate = (
  item: any,
  array: IdealTableColumnOperate[]
): IdealTableColumnOperate[] => {
  if (!item.instance) {
    array.splice(0, 0, { title: '绑定实例', prop: 'bindInstance' })
  } else {
    array.splice(0, 0, { title: '解绑实例', prop: 'unbindInstance' })
  }
  if (!item.eip) {
    array.splice(1, 0, { title: '绑定弹性公网IP', prop: 'bindEip' })
  } else {
    array.splice(1, 0, { title: '解绑弹性公网IP', prop: 'unbindEip' })
  }
  return array
}
//绑定解绑按钮的禁用
const handleBindOrNot = (
  array: IdealTableColumnOperate[]
): IdealTableColumnOperate[] => {
  array.forEach((item: any) => {
    if (item.prop === 'unbindInstance') {
      item.disabled = true
      item.disabledText = '主弹性网卡不能解绑服务器'
    }
  })
  return array
}
// 列表左侧按钮
const leftButtons: IdealButtonEventProp[] = [
  {
    title: '创建弹性网卡',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white',
    disabled: true,
    disabledText: '暂不支持'
  }
]
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    showDialog.value = true
    dialogType.value = 'createMainNic'
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

// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '', prop: 'privateIp', useSlot: true },
  { label: '', prop: 'name', useSlot: true },
  { label: '类型', prop: 'nicType' },
  { label: '', prop: 'network', useSlot: true },
  { label: '', prop: 'instance', useSlot: true },
  { label: '绑定的弹性公网IP', prop: 'eip', useSlot: true },
  { label: '', prop: 'log', useSlot: true },
  { label: '安全组', prop: 'safeGroup', useSlot: true },
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
  }
]
// 行数据操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '更换安全组', prop: 'change' },
  { title: '删除', prop: 'delete' }
]
const rowData = ref({})
const clickOperateEvent = (command: string | number | object, row: object) => {
  showDialog.value = true
  rowData.value = row
  if (command === 'bind') {
    dialogType.value = 'bindInstance'
  } else if (command === 'bindEip') {
    dialogType.value = OperateEventEnum.bind
  } else if (command === 'unbindEip') {
    dialogType.value = OperateEventEnum.unbind
  } else if (command === 'change') {
    dialogType.value = OperateEventEnum.change
  } else if (command === 'delete') {
    dialogType.value = 'delete-main-nic'
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
  getDataList()
}
const router = useRouter()
// 详情
const clickRedirectDetail = (row: any, tab: string) => {
  const {
    id,
    uuid,
    resourcePoolId,
    regionId,
    projectId,
    cloudPlatformCategoryCode,
    cloudPlatformTypeCode
  } = row
  const data = JSON.stringify(
    Object.assign({
      type: 'MAIN_CARD',
      id,
      uuid,
      resourcePoolId,
      regionId,
      projectId,
      cloudPlatformCategoryCode,
      cloudPlatformTypeCode,
      tab
    })
  )
  router.push({
    path: '/multi-cloud/elastic-net-card/detail',
    query: {
      data
    }
  })
}

//跳转vpc
const toVpc = (row: any) => {
  const { vpc, cloudPlatformCategoryCode, cloudPlatformTypeCode } = row
  router.push({
    path: '/multi-cloud/vpc/detail',
    query: { id: vpc.id, cloudPlatformTypeCode, cloudPlatformCategoryCode }
  })
}
//跳转子网
const toSubnet = (row: any) => {
  const { subnet, vpc, cloudPlatformTypeCode, cloudPlatformCategoryCode } = row
  router.push({
    path: '/multi-cloud/subnet/detail',
    query: {
      id: subnet.id,
      vpcId: vpc.id,
      cloudPlatformTypeCode,
      cloudPlatformCategoryCode
    }
  })
}

//跳转云主机
const toInstance = (row: any) => {
  router.push({
    path: '/multi-cloud/cloud-host/detail',
    query: {
      uuid: row?.bindInstanceUuid,
      cloudCategory: row?.cloudPlatformCategoryCode,
      cloudType: row?.cloudPlatformTypeCode
    }
  })
}

const toSafeGroup = (row: any) => {
  clickRedirectDetail(row, 'associateSafeGroup')
}
</script>

<style scoped lang="scss">
.main-net-card {
  width: 100%;
  padding: 10px 20px 20px;
  .flex-row-center {
    align-items: center;
    justify-content: center;
  }
  .main-net-card-title {
    color: var(--el-color-primary);
    cursor: pointer;
  }
  .main-net-card-id {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .ideal-theme-text {
    cursor: pointer;
  }
}
</style>
