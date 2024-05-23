<template>
  <div class="ideal-main-container cloud-host-snapshot">
    <div class="cloud-host-snapshot-tip ideal-middle-margin-bottom">
      快照功能仅用于应用迭代时使用，不能用作数据备份，每台云主机可以同时创建10份快照，每份快照建议创建后7天内删除。
    </div>

    <ideal-search :type-array="typeArray" @clickSearch="onClickSearch" />

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
      :total="state.total"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #status>
        <el-table-column label="状态" width="120">
          <template #default="props">
            <ideal-status-icon
              v-if="props.row.status"
              :status-icon="props.row.statusIcon"
              :status-text="props.row.statusText"
            />
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="props">
            <ideal-table-operate
              :buttons="props.row.operate"
              :max-buttons="2"
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
    />
  </div>
</template>

<script setup lang="ts">
import dialogBox from './dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { existPropWithArray } from '@/utils/tool'
import { OperateEventEnum, BillingEnum, FiltrateEnum } from '@/utils/enum'
import { RESOURCE_STATUS, RESOURCE_STATUS_ICON } from '@/utils/dictionary'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp,
  IdealSearch,
  IdealSearchResult
} from '@/types'

const typeArray = ref<IdealSearch[]>([
  { label: '快照名称', prop: 'name', type: FiltrateEnum.input },
  { label: 'UUID', prop: 'uuid', type: FiltrateEnum.input },
  { label: '主机名称', prop: 'instanceName', type: FiltrateEnum.input }
])
const onClickSearch = (v: IdealSearchResult[]) => {
  state.queryForm = {}
  if (v.length) {
    v.forEach((item: IdealSearchResult) => {
      state.queryForm[item.prop] = item.value
    })
  }
  getDataList()
}

onMounted(() => {
  // 后期联调接口需删除此代码
  if (state.dataList?.length) {
    state.dataList.forEach((item: any) => {
      item.statusText = RESOURCE_STATUS[item.status.toUpperCase()]
      item.statusIcon = RESOURCE_STATUS_ICON[item.status.toUpperCase()]
      item.operate = newOperate(item)
    })
  }
})
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
  query
} = useCrud(state)
state.dataList = [
  {
    name: '测试-11',
    uuid: 'f30eb281-092a-2984-b4c2-1a45-a320e321ab',
    status: 'RUNNING',
    statusIcon: 'status-success',
    statusText: '成功',
    size: '40',
    instanceName: 'test_jp',
    createTime: '2023-12-29 15:34:09'
  },
  {
    name: 'test01',
    uuid: 'b1ad3191-193b-4562-a1b1-3dc2-b125ef2a91',
    status: 'CREATE_ING',
    statusIcon: 'loading',
    statusText: '创建中',
    size: '0',
    instanceName: 'ecm-ten98-0001',
    createTime: '2024-01-20 10:05:23'
  }
]
watch(
  () => state.dataList,
  value => {
    if (value?.length) {
      value.forEach((item: any) => {
        item.statusText = RESOURCE_STATUS[item.status.toUpperCase()]
        item.statusIcon = RESOURCE_STATUS_ICON[item.status.toUpperCase()]
        item.operate = newOperate(item)
      })
    }
    loopUpdateStatus()
  }
)
// 轮询
const loopUpdateStatus = () => {
  if (!state.dataList?.length) {
    return
  }
  let timer: number | undefined
  const existLoading = existPropWithArray(
    'loading',
    state?.dataList,
    'statusIcon'
  ) // 操作正在进行中

  if (existLoading) {
    timer = setTimeout(() => {
      query()
    }, 5000)
  } else {
    if (timer) {
      clearTimeout(timer)
    }
  }
}
// 根据每行数据状态判断操作是否禁用
const newOperate = (item: any): IdealTableColumnOperate[] => {
  const resultArr: IdealTableColumnOperate[] = JSON.parse(
    JSON.stringify(operateBtns)
  )

  if (item.statusIcon === 'loading') {
    resultArr.forEach((child: any) => {
      child.disabled = true
      child.disabledText = `${item.statusText}暂不能操作`
    })
  }
  return resultArr
}
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '快照名称', prop: 'name' },
  { label: '快照ID', prop: 'uuid' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '快照大小(GB)', prop: 'size' },
  { label: '云主机名称', prop: 'instanceName' },
  { label: '创建时间', prop: 'createTime' }
]
// 操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '恢复快照', prop: 'recover' },
  { title: '编辑', prop: 'edit' },
  { title: '删除', prop: 'delete' }
]
const clickOperateEvent = (command: string | number | object, row: any) => {
  if (command === 'delete') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.delete
  }
}
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '新建快照',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  { title: '删除策略配置', prop: 'deleteConfig' }
])
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    showDialog.value = true
    dialogType.value = 'resourcePool'
  } else if (value === 'deleteConfig') {
    showDialog.value = true
    dialogType.value = 'deleteConfig'
  }
}
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  resetDialog()
}
const clickRefreshEvent = () => {
  if (dialogType.value === 'resourcePool') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.create
  } else {
    resetDialog()
  }

  query()
}
// 重置弹框
const resetDialog = () => {
  showDialog.value = false
  dialogType.value = '' // 防止再点击弹框时 有值
}
</script>

<style scoped lang="scss">
.cloud-host-snapshot {
  padding: $idealPadding;
  .cloud-host-snapshot-tip {
    background-color: var(--el-color-primary-light-9);
    border: 1px solid var(--el-color-primary);
    padding: 10px;
  }
}
</style>
