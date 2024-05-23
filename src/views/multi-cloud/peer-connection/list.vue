<template>
  <div class="ideal-main-container peer-connection">
    <ideal-select-search
      :search-type="SearchTypeEnum.title"
      prefix-title="模糊查询"
      @clickSearch="clickSearch"
      @clickReset="clickReset"
    >
    </ideal-select-search>

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
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #name>
        <el-table-column label="名称/ID">
          <template #default="props">
            <div class="peer-connection-title" @click="clickRedirectDetail">
              {{ props.row.name }}
            </div>

            <div class="flex-row flex-row-center">
              <el-tooltip
                effect="dark"
                :content="props.row.id"
                placement="top-start"
              >
                <div class="peer-connection-id">{{ props.row.id }}</div>
              </el-tooltip>

              <svg-icon
                icon="copy-icon"
                @click="clickCopy(props.row.id)"
              ></svg-icon>
            </div>
          </template>
        </el-table-column>
      </template>

      <template #statusText>
        <el-table-column label="状态">
          <template #default="props">
            <ideal-status-icon
              :status-icon="props.row.status"
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
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import dialogBox from './dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { clickCopy } from '@/utils/tool'
import { OperateEventEnum, SearchTypeEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp
} from '@/types'

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
state.dataList = [
  {
    name: 'vrt-vpc-2034',
    id: '2901-4de2-4cab-04a1',
    statusText: '可用',
    status: 'status-success',
    localVpc: 'vpc-2094',
    localVpcNet: '192.168.0.0/16',
    oppositeIp: '默认路由表',
    oppositeVPC: 'vpc-9302',
    description: '--'
  }
]
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true },
  { label: '状态', prop: 'statusText', useSlot: true },
  { label: '本端VPC', prop: 'localVpc' },
  { label: '本端VPC网段', prop: 'localVpcNet' },
  { label: '对端项目IP', prop: 'oppositeIp' },
  { label: '对端VPC', prop: 'oppositeVPC' },
  { label: '描述', prop: 'description' }
]
// 行数据操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '删除', prop: 'delete' }
]
const clickOperateEvent = (command: string | number | object, row: object) => {}

// 列表左侧按钮
const leftButtons: IdealButtonEventProp[] = [
  {
    title: '创建对等连接',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  }
]
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    clickPeerCreate()
  }
}
// 列表右侧按钮
const rightButtons: IdealButtonEventProp[] = [
  {
    prop: 'download',
    icon: 'download-icon'
  },
  {
    prop: 'setting',
    icon: 'setting-icon'
  }
]
const clickRightEvent = (value: string | number | object) => {}
const clickPeerCreate = () => {
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
  if (dialogType.value === 'resourcePool') {
    dialogType.value = OperateEventEnum.create
  } else {
    showDialog.value = false
  }
}
const router = useRouter()
// 详情
const clickRedirectDetail = () => {
  router.push({ path: '/multi-cloud/peer-connection/detail' })
}
</script>

<style scoped lang="scss">
.peer-connection {
  padding: $idealPadding;
  .flex-row-center {
    align-items: center;
    justify-content: center;
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
