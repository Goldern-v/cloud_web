<template>
  <div class="cloud-host-monitor">
    <ideal-search
      ref="searchRef"
      :show-category="false"
      :show-platform-type="false"
      :show-resource-pool="false"
      :type-array="typeArray"
      @clickSearch="onClickSearch"
    />

    <el-divider border-style="solid" />

    <ideal-button-events
      :left-btns="leftButtons"
      :right-btns="rightButtons"
      @clickLeftEvent="clickLeftEvent"
      @clickRightEvent="clickRightEvent"
    />

    <ideal-table-list
      ref="idealTableRef"
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      is-multiple
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #thresholdRule>
        <el-table-column label="阈值规则" width="120">
          <template #default="props">
            <el-tooltip :content="props.row.overview" placement="top">{{
              props.row.alertConfigRuleName
            }}</el-tooltip>
          </template>
        </el-table-column>
      </template>

      <template #notifyObj>
        <el-table-column label="通知对象" width="120">
          <template #default="props">
            <div
              v-for="(item, index) in props.row.contactGroupNames"
              :key="index"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="180">
          <template #default="props">
            <ideal-table-operate
              :buttons="operateButtons"
              @clickMoreEvent="clickOperateEvent($event as any, props.row)"
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
      :select-data="state.dataListSelections"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    />
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import dialogBox from './dialog-box.vue'
import { OperateEventEnum, FiltrateEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealTextProp,
  IdealTableColumnOperate,
  IdealButtonEventProp,
  IdealSearch
} from '@/types'
import { IHooksOptions } from '@/hooks/interface'
import { expenseTypeList } from '@/api/java/operate-center'
import {
  deleteAlarmRecord,
  alarmRecordPageUrl
} from '@/api/java/maintenance-center'

const typeArray = ref<IdealSearch[]>([
  { label: '故障资源', prop: 'RESOURCE_INSTANCE', type: FiltrateEnum.input },
  { label: '资源类型', prop: 'RESOURCE_TYPE', type: FiltrateEnum.list },
  { label: '告警规则', prop: 'ALERT_NAME', type: FiltrateEnum.input }
])
const onClickSearch = (v: IdealTextProp[]) => {
  state.queryForm = {
    ploy: 'WAIT_CHECK'
  }
  if (v.length) {
    v.forEach((item: IdealTextProp) => {
      const temp = item.label.split('：')
      state.queryForm.filterType = item.prop
      if (item.prop === 'RESOURCE_TYPE') {
        const result = resourceTypeList.value.find(
          (item: any) => item.name === temp[1]
        )
        state.queryForm.filterTypeValue = result?.code
      } else {
        state.queryForm.filterTypeValue = temp[1]
      }
    })
  }
  getDataList()
}

onMounted(() => {
  getExpenseType()
})
const resourceTypeList: any = ref([])
const getExpenseType = () => {
  expenseTypeList()
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        const typeItem = typeArray.value.find(
          (item: IdealSearch) => item.prop === 'RESOURCE_TYPE'
        )
        typeItem!.array = data
        typeItem!.arrayKey = 'code'
        typeItem!.arrayProp = 'name'
        resourceTypeList.value = data
      } else {
        resourceTypeList.value = []
      }
    })
    .catch(_ => {
      resourceTypeList.value = []
    })
}

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '资源类型', prop: 'resourceTypeDes' },
  { label: '故障资源', prop: 'resourceName' },
  { label: '告警级别', prop: 'reportLevelDes' },
  { label: '告警规则', prop: 'alertConfigName' },
  { label: '阈值规则', prop: 'thresholdRule', useSlot: true },
  { label: '发生时间', prop: 'endTriggerTimeDes' },
  { label: '触发次数', prop: 'triggerTimes' },
  { label: '通知对象', prop: 'notifyObj', useSlot: true }
]
const state: IHooksOptions = reactive({
  dataListUrl: alarmRecordPageUrl,
  deleteUrl: deleteAlarmRecord,
  primaryKey: 'id',
  queryForm: {
    ploy: 'WAIT_CHECK'
  }
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList
} = useCrud(state)
const operateButtons: IdealTableColumnOperate[] = [
  { title: '确认', prop: 'confirm' },
  { title: '查看告警详情', prop: 'detail' }
]
const rowData = ref()
// 操作
const clickOperateEvent = (command: string | number, row: any) => {
  rowData.value = row
  if (command === 'confirm') {
    dialogType.value = 'confirm'
    showDialog.value = true
  } else if (command === 'detail') {
    dialogType.value = 'detail'
    showDialog.value = true
  }
}
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '确认',
    prop: 'confirm',
    disabled: true,
    disabledText: '请选择告警记录'
  },
  {
    title: '删除',
    prop: 'delete',
    disabled: true,
    disabledText: '请选择告警记录'
  }
])
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'confirm') {
    dialogType.value = 'confirm'
    showDialog.value = true
  } else if (value === 'delete') {
    dialogType.value = 'delete'
    showDialog.value = true
  }
}
// 列表右侧按钮
const rightButtons = ref<IdealButtonEventProp[]>([
  { prop: 'refresh', icon: 'refresh-icon' }
])

const searchRef = ref()
const clickRightEvent = (value: string | number | object) => {
  if (value === 'refresh') {
    searchRef.value.clickDeleteAll()
  }
}
watch(
  () => state.dataListSelections,
  value => {
    leftButtons.value[0].disabled = true
    leftButtons.value[1].disabled = true
    if (value?.length) {
      leftButtons.value[0].disabled = false
      leftButtons.value[1].disabled = false
    }
  }
)

// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  resetDialog()
}
const idealTableRef = ref()
const clickRefreshEvent = () => {
  idealTableRef.value.IdealTableList.clearSelection() // 清空多选
  resetDialog()
  getDataList()
}
// 重置弹框
const resetDialog = () => {
  showDialog.value = false
  dialogType.value = '' // 防止再点击弹框时 有值
}
</script>

<style scoped lang="scss">
.cloud-host-monitor {
  // padding: $idealPadding;
  background-color: #fff;
  .resource-type {
    margin-top: -3px;
    font-size: $defaultFontSize;
  }
  :deep(.down-arrow) {
    width: 12px;
    height: 12px;
  }
  .flex-row-center {
    align-items: center;
    justify-content: center;
  }
}
</style>
