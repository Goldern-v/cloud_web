<template>
  <div class="cloud-host-monitor">
    <ideal-search
      ref="searchRef"
      :type-array="typeArray"
      :show-category="false"
      :show-platform-type="false"
      :show-resource-pool="false"
      @clickSearch="onClickSearch"
    >
      <template #right-btn>
        <ideal-button-events
          :right-btns="rightButtons"
          @clickRightEvent="clickRightEvent"
        />
      </template>
    </ideal-search>

    <el-divider border-style="solid" />

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
import dialogBox from './dialog-box.vue'
import { useCrud } from '@/hooks'
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
  deleteAlarmHistory,
  alarmRecordPageUrl
} from '@/api/java/maintenance-center'

const typeArray = ref<IdealSearch[]>([
  { label: '故障资源', prop: 'RESOURCE_INSTANCE', type: FiltrateEnum.input },
  { label: '资源类型', prop: 'RESOURCE_TYPE', type: FiltrateEnum.list },
  { label: '告警规则', prop: 'ALERT_NAME', type: FiltrateEnum.input }
])
const onClickSearch = (v: IdealTextProp[]) => {
  state.queryForm = {
    ploy: 'DONE_CHECK'
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
  { label: '告警类型', prop: 'alertConfigTypeDes' },
  { label: '告警规则', prop: 'alertConfigName' },
  { label: '阈值规则', prop: 'thresholdRule', useSlot: true },
  { label: '发生时间', prop: 'endTriggerTimeDes' },
  { label: '触发次数', prop: 'triggerTimes' },
  { label: '通知对象', prop: 'notifyObj', useSlot: true },
  { label: '确认人', prop: 'checkUserName' },
  { label: '确认时间', prop: 'checkTimeDes' }
]
const state: IHooksOptions = reactive({
  dataListUrl: alarmRecordPageUrl,
  deleteUrl: deleteAlarmHistory,
  primaryKey: 'id',
  queryForm: {
    ploy: 'DONE_CHECK'
  }
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList
} = useCrud(state)

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
const rowData = ref()
const operateButtons: IdealTableColumnOperate[] = [
  { title: '查看告警详情', prop: 'detail' }
]

const clickOperateEvent = (command: string | number, row: any) => {
  rowData.value = row
  if (command === 'detail') {
    dialogType.value = 'detail'
    showDialog.value = true
  }
}

const filterResourceType = () => {}

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
  .flex-row-center {
    align-items: center;
    justify-content: center;
  }
}
</style>
