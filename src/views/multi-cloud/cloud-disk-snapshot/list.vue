<template>
  <div class="ideal-main-container snapshot">
    <div class="snapshot-tip">
      <div>温馨提示：</div>
      <div>1. 目前云硬盘快照特性可免费使用，收费商用时间另行通知。</div>
      <div>2. 快照免费使用期间，单个磁盘最大支持创建7个快照。</div>
      <div>3. 您还可以创建2000个快照。</div>
    </div>

    <ideal-select-search
      class="ideal-default-margin-top"
      :options="searchOptions"
      @clickSearch="clickSearch"
      @clickReset="clickReset"
    />

    <el-divider />

    <ideal-button-events
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    />

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
            <el-button
              link
              type="primary"
              class="snapshot-font-size"
              @click="clickDetail"
              >{{ props.row.name }}</el-button
            >
            <div class="flex-row">
              <div class="snapshot-table-id">{{ props.row.uuid }}</div>
              <svg-icon icon="copy-icon" @click="clickCopy(props.row?.uuid)" />
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
            />
          </template>
        </el-table-column>
      </template>

      <template #diskName>
        <el-table-column label="磁盘名称">
          <template #default="props">
            <el-button link type="primary" class="snapshot-font-size">{{
              props.row.diskName
            }}</el-button>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="185" fixed="right">
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
      :select-data="state.dataListSelections"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    />
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { clickCopy } from '@/utils/tool'
import { OperateEventEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp
} from '@/types'
import dialogBox from './dialog-box.vue'

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
// 列表下拉搜索
const searchOptions = [
  { label: '名称', prop: 'name' },
  { label: 'ID', prop: 'id' }
]
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
    name: 'snapshot-814e',
    uuid: 'e916a919-9dae-439f-a24a-becdfa7ab9ce',
    status: '可用',
    statusStr: 'using',
    statusType: 'status-success',
    createTime: '2023/09/15 12:06:04',
    diskName: 'vpn跳板-不要动',
    encrypt: '否',
    isMount: true
  }
]
watch(
  () => state.dataList,
  value => {
    if (value?.length) {
      value.forEach((item: any) => {
        item.operate = newOperate(item)
      })
    }
  }
)
// 后期调接口后删除
onMounted(() => {
  if (state.dataList?.length) {
    state.dataList.forEach((item: any) => {
      item.operate = newOperate(item)
    })
  }
})
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '快照名称/ID', prop: 'name', useSlot: true },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '创建时间', prop: 'createTime' },
  { label: '磁盘名称', prop: 'diskName', useSlot: true },
  { label: '加密', prop: 'encrypt' }
]
// 操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '回滚数据', prop: 'rollback' },
  { title: '创建磁盘', prop: 'create' },
  { title: '删除', prop: 'delete' }
]
const clickOperateEvent = (command: string | number | object, row: object) => {
  if (command === 'rollback') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.mount
  } else if (command === 'create') {
    // router.push({ path: '/multi-cloud/snapshot/expand' })
  }
}
// 根据每行数据状态判断操作是否禁用
const newOperate = (item: any): IdealTableColumnOperate[] => {
  const resultArr: IdealTableColumnOperate[] = JSON.parse(
    JSON.stringify(operateBtns)
  )
  if (item.isMount) {
    resultArr[0].disabled = true
    resultArr[0].disabledText = dic.isMount
  }
  return resultArr
}
const dic: { [key: string]: string } = {
  isMount:
    '快照的源磁盘处于挂载状态，不能执行此操作。请先卸载磁盘，再回滚数据。'
}
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '删除',
    prop: 'delete',
    disabled: true,
    disabledText: '请选择需要删除的快照。'
  },
  { title: '导出', prop: 'export' },
  { title: '创建快照', prop: 'create', type: 'primary' }
])
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'delete') {
  } else if (value === 'export') {
  } else if (value === 'create') {
    showDialog.value = true
    dialogType.value = 'resourcePool'
  }
}

watch(
  () => state.dataListSelections,
  value => {
    leftButtons.value[0].disabled = true
    if (value?.length) {
      leftButtons.value[0].disabled = false
    }
  }
)
const router = useRouter()
const clickDetail = () => {}
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const dialogTypeStr = ref('')
const clickCloseEvent = () => {
  resetDialog()
}
//新建云硬盘快照选择资源池确定事件
const clickRefreshEvent = () => {
  if (dialogType.value === 'resourcePool') {
    router.push({ path: '/multi-cloud/cloud-disk-snapshot/create' })
  }
  resetDialog()
  getDataList()
}
// 重置弹框
const resetDialog = () => {
  showDialog.value = false
  dialogType.value = undefined // 防止再点击弹框时 有值
  dialogTypeStr.value = ''
}
</script>

<style scoped lang="scss">
.snapshot {
  padding: $idealPadding;
  .snapshot-tip {
    border: 1px solid var(--el-color-primary);
    border-radius: $circleRadiusSize;
    padding: $idealPadding;
    background-color: var(--el-color-primary-light-9);
  }
  .snapshot-table-id {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 3px;
    font-size: $defaultFontSize;
  }
  .snapshot-font-size {
    font-size: $defaultFontSize;
  }
}
</style>
