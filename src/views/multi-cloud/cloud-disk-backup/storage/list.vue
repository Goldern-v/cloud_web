<template>
  <div class="storage">
    <div class="ideal-tip-text">
      存储库是存放资源产生的备份副本的容器，您可以将资源绑定至存储库并绑定备份策略，为您的数据提供保障。
    </div>

    <ideal-select-search
      class="ideal-default-margin-top"
      :search-type="SearchTypeEnum.title"
      prefix-title="名称查询"
      @clickSearch="clickSearch"
      @clickReset="clickReset"
    >
    </ideal-select-search>

    <el-divider />

    <ideal-button-events
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    >
    </ideal-button-events>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :is-multiple="true"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #name>
        <el-table-column label="名称/ID" show-overflow-tooltip>
          <template #default="props">
            <el-button link type="primary" @click="clickDetail">{{
              props.row.name
            }}</el-button>

            <div class="flex-row">
              <div class="storage-table-d">{{ props.row.uuid }}</div>
            </div>
          </template>
        </el-table-column>
      </template>

      <template #status>
        <el-table-column label="状态">
          <template #default="props">
            <ideal-status-icon
              v-if="props.row.status"
              :status-icon="props.row.statusType"
              :status-text="props.row.status"
            ></ideal-status-icon>
          </template>
        </el-table-column>
      </template>

      <template #storedSize>
        <el-table-column label="已存储/总存储库容量(GB)" width="200">
          <template #default="props">
            <el-progress :percentage="props.row.storedSize">
              <div>{{ props.row.storedSize }}/{{ props.row.allSize }}</div>
            </el-progress>
          </template>
        </el-table-column>
      </template>

      <template #backupPolicy>
        <el-table-column label="备份策略状态" show-overflow-tooltip width="120">
          <template #default="props">
            <div class="cloud-host-table-title">
              {{ props.row.backupPolicy }}
            </div>

            <div class="flex-row">
              <div class="storage-table-d">{{ props.row.backupPolicyStr }}</div>
            </div>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="225">
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
import dialogBox from './dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { SearchTypeEnum, OperateEventEnum } from '@/utils/enum'
import type {
  IdealButtonEventProp,
  IdealTableColumnHeaders,
  IdealTableColumnOperate
} from '@/types'

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList,
  deleteHandle
} = useCrud(state)
state.dataList = [
  {
    name: 'vault-5a27',
    uuid: '98a2e32b-09a1-0321-0acd',
    type: '备份',
    status: '可用',
    statusType: 'status-success',
    spec: '--',
    storedSize: 5,
    allSize: 30,
    backupPolicy: '启用',
    backupPolicyStr: 'defaultPolicy',
    bound: 1,
    billingMode: '按需计费'
  }
]
watch(
  () => state.dataListSelections,
  value => {
    leftButtons.value[1].disabled = true
    leftButtons.value[2].disabled = true
    if (value?.length) {
      leftButtons.value[1].disabled = false
      leftButtons.value[2].disabled = false
    }
  }
)
// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '已存储容量(GB)', prop: 'storedSize', useSlot: true },
  { label: '备份策略状态', prop: 'backupPolicy', useSlot: true },
  { label: '已绑定磁盘(个)', prop: 'bound' },
  { label: '计费方式', prop: 'billingMode' }
]
// 列表行数据操作事件
const operateBtns: IdealTableColumnOperate[] = [
  { title: '绑定磁盘', prop: 'bindDisk' },
  { title: '执行备份', prop: 'execute' },
  { title: '绑定备份策略', prop: 'bind' },
  { title: '扩容', prop: 'expand' },
  { title: '缩容', prop: 'reduce' },
  { title: '转包周期', prop: 'transform' },
  { title: '启用自动绑定', prop: 'autoBind' },
  { title: '删除', prop: '' }
]
const router = useRouter()
const rowData = ref()
const clickOperateEvent = (command: string | number | object, row: any) => {
  rowData.value = row
  if (command === 'bindDisk') {
    showDialog.value = true
    dialogType.value = 'bindDisk'
  } else if (command === 'execute') {
    router.push({
      path: '/multi-cloud/cloud-host-backup-storage/execute-backup'
    })
  } else if (command === 'bind') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.bind
  } else if (command === 'autoBind') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.autoBind
  } else if (command === 'expand') {
    router.push({ path: '/multi-cloud/cloud-disk-backup-storage/expand' })
  } else if (command === 'reduce') {
    router.push({ path: '/multi-cloud/cloud-disk-backup-storage/reduce' })
  } else if (command === 'transform') {
    router.push({ path: '/multi-cloud/cloud-disk-backup-storage/transform' })
  }
}
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '创建云硬盘备份存储库',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  {
    title: '删除',
    prop: 'delete',
    disabled: true,
    disabledText: '请选择存储库'
  },
  {
    title: '绑定备份策略',
    prop: 'bind',
    disabled: true,
    disabledText: '请选择存储库'
  }
])
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'bind') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.bind
  } else if (value === 'create') {
    showDialog.value = true
    dialogType.value = 'resourcePool'
  }
}
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
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  if (dialogType.value === 'resourcePool') {
    router.push({ path: '/multi-cloud/cloud-disk-backup-storage/create' })
  }
  showDialog.value = false
}
const clickDetail = () => {
  router.push({ path: '/multi-cloud/cloud-disk-backup-storage/detail' })
}
</script>

<style scoped lang="scss">
.storage {
  width: calc(100% - 40px);
  padding: 10px 20px 20px;
  .storage-table-d {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
