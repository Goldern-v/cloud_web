<template>
  <div class="ideal-main-container cloud-disk-backup-policy">
    <div>您还可以创建31个备份策略。</div>

    <ideal-button-events
      class="ideal-default-margin-top"
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    />

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
        <el-table-column label="名称/ID" width="210" show-overflow-tooltip>
          <template #default="props">
            <el-button link class="cloud-disk-backup-policy-font-size">{{
              props.row.name
            }}</el-button>
            <div class="cloud-disk-backup-policy-table-id">
              {{ props.row.uuid }}
            </div>
          </template>
        </el-table-column>
      </template>

      <template #status>
        <el-table-column label="是否启用" width="160">
          <template #default="props">
            <ideal-status-icon
              v-if="props.row.status"
              :status-icon="props.row.statusType"
              :status-text="props.row.status"
            />
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
    />
  </div>
</template>

<script setup lang="ts">
import dialogBox from './dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp
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
  getDataList
} = useCrud(state)
state.dataList = [
  {
    name: 'vpn跳板-不要动',
    uuid: 'e916a919-9dae-439f-a24a-becdfa7ab9ce',
    status: '启用',
    statusStr: 'using',
    statusType: 'status-success',
    backupTime:
      '00:00, 01:00, 02:00, 03:00, 04:00, 05:00, 06:00, 07:00, 08:00, 09:00, 10:00, 11:00',
    backupCycle: '星期天, 星期一, 星期二, 星期三, 星期四, 星期五',
    saveRule: '4个'
  },
  {
    name: 'vpn跳板-不要动',
    uuid: 'e216a5f9-9dae-439f-a24a-becdfa7ab9ce',
    status: '未启用',
    statusStr: 'using',
    statusType: 'status-error',
    backupTime: '03:00, 04:00, 05:00',
    backupCycle: '星期一, 星期二, 星期三',
    saveRule: '5个'
  }
]

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称/ID', prop: 'name', useSlot: true },
  { label: '是否启用', prop: 'status', useSlot: true },
  { label: '备份时间', prop: 'backupTime' },
  { label: '备份周期', prop: 'backupCycle' },
  { label: '保留规则', prop: 'saveRule' },
  { label: '绑定存储库', prop: 'bind' }
]
// 操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '停用', prop: 'shutdown' },
  { title: '编辑', prop: 'edit' },
  { title: '删除', prop: 'delete' }
]
const rowData = ref()
const clickOperateEvent = (command: string | number | object, row: object) => {
  rowData.value = row
  if (command === 'shutdown') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.shutdown
  } else if (command === 'edit') {
    router.push({ path: '/multi-cloud/disk-backup-policy/create' })
  } else if (command === 'delete') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.delete
  }
}
const dic: { [key: string]: string } = {
  unavailable: '只有可用状态的磁盘才能挂载。',
  transform: '请从云服务器发起转包年/包月。',
  delete: '正在使用状态的磁盘不允许执行此操作，请先卸载磁盘。'
}
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '创建策略',
    prop: 'create',
    type: 'primary',
    iconColor: 'white'
  }
])
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    handleCloudDiskCreate()
  }
}

const router = useRouter()
const handleCloudDiskCreate = () => {
  showDialog.value = true
  dialogType.value = 'resourcePool'
}

// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  resetDialog()
}
const clickRefreshEvent = () => {
  if (dialogType.value === 'resourcePool') {
    router.push({ path: '/multi-cloud/disk-backup-policy/create' })
  }
  resetDialog()
}
// 重置弹框
const resetDialog = () => {
  showDialog.value = false
  dialogType.value = undefined // 防止再点击弹框时 有值
  rowData.value = null
}
</script>

<style scoped lang="scss">
.cloud-disk-backup-policy {
  padding: $idealPadding;
  .cloud-disk-backup-policy-table-id {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 3px;
    font-size: $defaultFontSize;
  }
  .cloud-disk-backup-policy-font-size {
    font-size: $defaultFontSize;
  }
}
</style>
