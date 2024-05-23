<template>
  <div class="mine-work-order">
    <div class="flex-row flex-row-center">
      <div class="mine-work-order-title ideal-default-margin-right">我的工单</div>

      <div class="flex-row mine-work-order-type">
        <div
          v-for="(item, index) of typeArray"
          :key="index"
          :class="selectIndex === index ? 'mine-work-order-item-active': 'mine-work-order-item'"
          @click="clickType(index)"
          >{{ item.label }}</div
        >
      </div>
    </div>

    <ideal-table-list
      class="mine-work-order-table"
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :show-pagination="false">
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
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type {
  IdealButtonEventProp,
  IdealTableColumnHeaders,
  IdealTableColumnOperate
} from '@/types'

const selectIndex = ref(0)
const typeArray = [
  { label: '待处理告警' },
  { label: '24H告警' },
  { label: '月度告警' }
]
const clickType = (index: number) => {
  selectIndex.value = index
}

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const { getDataList } = useCrud(state)
state.dataList = [
  { title: '云主机资源申请', name: '云资源申请', current: '数字办审批', person: '冯冬梅', organization: '组织', createTime: '2023-08-18 16:14:09' },
  { title: '云主机资源申请', name: '云资源申请', current: '数字办审批', person: '冯冬梅', organization: '组织', createTime: '2023-08-18 16:14:09' },
  { title: '云主机资源申请', name: '云资源申请', current: '数字办审批', person: '冯冬梅', organization: '组织', createTime: '2023-08-18 16:14:09' },
  { title: '云主机资源申请', name: '云资源申请', current: '数字办审批', person: '冯冬梅', organization: '组织', createTime: '2023-08-18 16:14:09' },
  { title: '云主机资源申请', name: '云资源申请', current: '数字办审批', person: '冯冬梅', organization: '组织', createTime: '2023-08-18 16:14:09' },
  { title: '云主机资源申请', name: '云资源申请', current: '数字办审批', person: '冯冬梅', organization: '组织', createTime: '2023-08-18 16:14:09' },
  { title: '云主机资源申请', name: '云资源申请', current: '数字办审批', person: '冯冬梅', organization: '组织', createTime: '2023-08-18 16:14:09' },
  { title: '云主机资源申请', name: '云资源申请', current: '数字办审批', person: '冯冬梅', organization: '组织', createTime: '2023-08-18 16:14:09' },
  { title: '云主机资源申请', name: '云资源申请', current: '数字办审批', person: '冯冬梅', organization: '组织', createTime: '2023-08-18 16:14:09' },
  { title: '云主机资源申请', name: '云资源申请', current: '数字办审批', person: '冯冬梅', organization: '组织', createTime: '2023-08-18 16:14:09' },
  { title: '云主机资源申请', name: '云资源申请', current: '数字办审批', person: '冯冬梅', organization: '组织', createTime: '2023-08-18 16:14:09' },
  { title: '云主机资源申请', name: '云资源申请', current: '数字办审批', person: '冯冬梅', organization: '组织', createTime: '2023-08-18 16:14:09' },
  { title: '云主机资源申请', name: '云资源申请', current: '数字办审批', person: '冯冬梅', organization: '组织', createTime: '2023-08-18 16:14:09' },
  { title: '云主机资源申请', name: '云资源申请', current: '数字办审批', person: '冯冬梅', organization: '组织', createTime: '2023-08-18 16:14:09' },
  { title: '云主机资源申请', name: '云资源申请', current: '数字办审批', person: '冯冬梅', organization: '组织', createTime: '2023-08-18 16:14:09' },
  { title: '云主机资源申请', name: '云资源申请', current: '数字办审批', person: '冯冬梅', organization: '组织', createTime: '2023-08-18 16:14:09' },
  { title: '云主机资源申请', name: '云资源申请', current: '数字办审批', person: '冯冬梅', organization: '组织', createTime: '2023-08-18 16:14:09' }
]
// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '工单标题', prop: 'title' },
  { label: '流程名称', prop: 'name' },
  { label: '当前环节', prop: 'current' },
  { label: '发起人', prop: 'person' },
  { label: '发起组织', prop: 'organization' },
  { label: '创建时间', prop: 'createTime' }
]

// 列表行数据操作事件
const operateBtns: IdealTableColumnOperate[] = [
  { title: '处理', prop: 'handle' }
]
const clickOperateEvent = (command: string | number | object, row: any) => {  
  if (command === 'handle') {}
}
</script>

<style scoped lang="scss">
.mine-work-order {
  padding: $idealPadding;
  background-color: white;
  height: calc(100% - 40px);
  .flex-row-center {
    align-items: center;
  }
  .mine-work-order-title {
    color: #2b2f39;
    font-weight: 500;
    font-size: 16px;
    width: 80px
  }
  .mine-work-order-type {
    background-color: #eff0f6;
    border-radius: $circleRadiusSize;
    .mine-work-order-item, .mine-work-order-item-active {
      padding: 3px 5px;
      margin: 3px 5px;
      cursor: pointer;
      border-radius: $circleRadiusSize;
    }
    .mine-work-order-item-active {
      background-color: white;
    }
  }
  :deep(.el-table) {
    height: calc(642px - 32px - 40px); // 642需和index.vue保持一致
  }
  .mine-work-order-table {
    height: calc(100% - 10px);
  }
}
</style>