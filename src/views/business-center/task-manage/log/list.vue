<template>
  <div class="ideal-main-container exception">
    <ideal-select-search
      :search-type="SearchTypeEnum.select"
      :options="searchOptions"
      :slot-array="slotArray"
      @clickSearch="clickSearch"
      @clickReset="clickReset"
    >
      <template #resourcePoolType>
        <custom-select
          class="custom-select ideal-default-margin-right"
          prefix-title="资源池类型"
          @clickSelect="clickResourcePoolSelect"
        ></custom-select>
      </template>
    </ideal-select-search>

    <el-divider />

    <ideal-table-list
      row-key="orderId"
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #expandTable>
        <el-table-column type="expand">
          <template #default="props">
            <el-steps
              :active="props.row.exceptionIndex"
              finish-status="success"
              class="exception-expand"
            >
              <el-step title="生成任务">
                <template #icon>
                  <svg-icon icon="dot-empty" />
                </template>
              </el-step>
              <el-step title="发送消息">
                <template #icon>
                  <svg-icon icon="dot-empty" />
                </template>
              </el-step>
              <el-step title="已发送消息">
                <template #icon>
                  <svg-icon icon="dot-empty" />
                </template>
              </el-step>
            </el-steps>
            <div class="flex-row exception-message-body">
              <div class="exception-message-body-left">消息体</div>
              <div>{{ props.row }}</div>
            </div>
          </template>
        </el-table-column>
      </template>

      <template #exceptionIndex>
        <el-table-column
          label="任务序号"
          type="index"
          width="80"
        ></el-table-column>
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

    <!-- <dialog-box
      v-if="showDialog"
      :type="dialogType"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box> -->
  </div>
</template>

<script setup lang="ts">
import customSelect from '../task/components/custom-select.vue'
// import dialogBox from './dialog-box.vue'
import type { IdealTableColumnHeaders, IdealTableColumnOperate } from '@/types'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { SearchTypeEnum, OperateEventEnum } from '@/utils/enum'

// 搜索选项
const searchOptions = [{ label: '订单ID', prop: 'orderId' }]
// 搜索插槽
const slotArray = ['resourcePoolType', 'exceptionType']
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

// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '任务序号', prop: 'exceptionIndex', useSlot: true },
  { label: '订单ID', prop: 'orderId' },
  { label: '资源池类型', prop: 'resourcePoolType' },
  { label: '资源池', prop: 'resourcePool' },
  { label: '资源名称', prop: 'resourceName' },
  { label: '类型', prop: 'type' },
  { label: '创建时间', prop: 'createTime' }
]
state.dataList = [
  {
    orderId: '2jwiru92bh2k3j3',
    resourcePoolType: '公有云',
    resourcePool: '阿里云',
    resourceName: 'ecs-aoo001',
    type: '下发更新消息',
    createTime: '2023-5-27 11:35:21',
    exceptionIndex: 0
  },
  {
    orderId: '14siru2dgh1d2gb',
    resourcePoolType: '私有云',
    resourcePool: '腾讯云',
    resourceName: 'ecm-2201',
    type: '下发更新消息',
    createTime: '2023-4-07 14:29:07',
    exceptionIndex: 1
  },
  {
    orderId: 'rei3kji903kdg2b',
    resourcePoolType: '公有云',
    resourcePool: '华为云',
    resourceName: 'eip-a4101',
    type: '下发更新消息',
    createTime: '2023-3-28 16:08:32',
    exceptionIndex: 2
  },
  {
    orderId: '98alk3jf2kd2ybm',
    resourcePoolType: '私有云',
    resourcePool: '天翼云',
    resourceName: 'esb-b2020',
    type: '下发更新消息',
    createTime: '2023-2-17 09:28:36',
    exceptionIndex: 1
  }
]
// 列表行数据操作事件
const operateBtns: IdealTableColumnOperate[] = [
  { type: 'primary', title: '记录', prop: 'record' }
]
const clickOperateEvent = (command: string | number | object, row: any) => {
  if (command === 'record') {
    // showDialog.value = true
    // dialogType.value = 'recordInfo'
  }
}
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
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
const clickResourcePoolSelect = (value: string) => {}
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
}
</script>

<style scoped lang="scss">
.exception {
  padding: $idealPadding;
  .custom-select {
    width: 190px;
    :deep(.el-select .el-input) {
      width: 180px;
      height: 34px;
    }
  }
  :deep(.el-select .el-input) {
    width: 120px;
    height: 34px;
  }
  .exception-expand {
    padding: 0 20%;
    :deep(.el-step__head.is-success) {
      color: var(--el-color-primary);
      border-color: var(--el-color-primary);
    }
    :deep(.el-step__title.is-success) {
      color: var(--el-color-primary);
    }
    :deep(.el-step__head.is-process) {
      color: var(--el-color-primary);
      border-color: var(--el-color-primary);
    }
    :deep(.el-step__title.is-process) {
      color: var(--el-color-primary);
    }
  }
  .exception-message-body {
    padding: 10px 20px;
    justify-content: center;
    align-items: flex-start;
    .exception-message-body-left {
      width: 100px;
      color: #000;
    }
  }
  :deep(.el-select__wrapper) {
    min-height: 34px;
  }
}
</style>
