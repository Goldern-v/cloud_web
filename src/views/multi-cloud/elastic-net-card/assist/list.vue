<template>
  <div class="ideal-table-list__container peer-connection">
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
        <el-table-column label="私有IP地址">
          <template #default="props">
            <div
              class="peer-connection-title"
              @click="clickRedirectDetail(props.row)"
            >
              {{ props.row.fixedIp }}
            </div>
          </template>
        </el-table-column>
      </template>

      <template #mainFixedIp>
        <el-table-column label="所属弹性网卡">
          <template #default="props">
            <p class="ideal-theme-text">{{ props.row.mainFixedIp }}</p>
          </template>
        </el-table-column>
      </template>

      <template #network>
        <el-table-column label="所属网络">
          <template #default="props">
            <p class="ideal-theme-text">{{ props.row.vpcName }}</p>
            <p class="ideal-theme-text">{{ props.row.subnet?.name }}</p>
          </template>
        </el-table-column>
      </template>

      <template #eip>
        <el-table-column label="绑定的弹性公网IP">
          <template #default="props">
            <p class="ideal-theme-text">{{ props.row.eip?.ipAddress }}</p>
            <p>{{ props.row.eip?.name }}</p>
          </template>
        </el-table-column>
      </template>

      <template #safeGroup>
        <el-table-column label="安全组">
          <template #default="props">
            <div class="ideal-theme-text">
              {{ props.row.securityGroupNum }}
            </div>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="285">
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
      nic-type="BACKUP_CARD"
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
      const temp = item.label.split('：')
      state.queryForm[item.prop] = temp[1]
    })
  }
  getDataList()
}
const state: IHooksOptions = reactive({
  dataListUrl: queryNetCardPage,
  deleteUrl: '',
  queryForm: {
    type: 'BACKUP_CARD'
  }
})

const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList
} = useCrud(state)

// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '私有IP地址', prop: 'privateIp', useSlot: true },
  { label: '所属弹性网卡', prop: 'mainFixedIp', useSlot: true },
  { label: '所属网络', prop: 'network', useSlot: true },
  { label: '绑定的弹性公网IP', prop: 'eip', useSlot: true },
  { label: '描述', prop: 'description' },
  { label: 'VLAN', prop: 'vlan' },
  { label: '安全组', prop: 'safeGroup', useSlot: true },
  { label: '云平台类别', prop: 'cloudPlatformCategory' },
  { label: '云平台类型', prop: 'cloudPlatformType' },
  {
    label: '云平台名称',
    prop: 'cloudPlatformName',
    width: '150'
  },
  { label: '资源池名称', prop: 'resourcePoolName' },
  { label: '所属项目', prop: 'projectName' }
]
const leftButtons: IdealButtonEventProp[] = [
  {
    title: '创建辅助弹性网卡',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  }
]
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    showDialog.value = true
    dialogType.value = 'resourcePool'
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

watch(
  () => state.dataList,
  arr => {
    arr?.forEach((item: any) => {
      item.operate = newOperate(item)
    })
  }
)
const newOperate = (item: any): IdealTableColumnOperate[] => {
  let resultArr: IdealTableColumnOperate[] = []
  const tempArr = JSON.parse(JSON.stringify(operateBtns))
  resultArr = handleBindOperate(item, tempArr)
  return resultArr
}
//判断绑定状态，显示绑定还是解绑按钮
const handleBindOperate = (
  item: any,
  array: IdealTableColumnOperate[]
): IdealTableColumnOperate[] => {
  if (!item.eip) {
    array.splice(0, 0, { title: '绑定弹性公网IP', prop: 'bindEip' })
  } else {
    array.splice(0, 0, { title: '解绑弹性公网IP', prop: 'unbindEip' })
  }
  return array
}

const rowData = ref({})
// 行数据操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '更换安全组', prop: 'change' },
  { title: '删除', prop: 'delete' }
]
const clickOperateEvent = (command: string | number | object, row: object) => {
  rowData.value = row
  showDialog.value = true
  if (command === 'bindEip') {
    dialogType.value = OperateEventEnum.bind
  } else if (command === 'unbindEip') {
    dialogType.value = OperateEventEnum.unbind
  } else if (command === 'delete') {
    dialogType.value = 'delete-assist-nic'
  } else if (command === 'change') {
    dialogType.value = OperateEventEnum.change
  }
}

// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
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
  const data = JSON.stringify(Object.assign(row, { type: 'BACKUP_CARD' }))
  router.push({
    path: '/multi-cloud/elastic-net-card/detail',
    query: {
      data
    }
  })
}
</script>

<style scoped lang="scss">
.peer-connection {
  width: 100%;
  padding: 10px 20px 20px;
  .flex-row-center {
    align-items: center;
    justify-content: center;
  }
  .peer-connection-create-box {
    justify-content: space-between;
    align-items: center;
  }
  .peer-connection-title {
    color: var(--el-color-primary);
    cursor: pointer;
  }
  .peer-connection-id {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
