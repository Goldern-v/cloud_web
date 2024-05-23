<template>
  <div class="ideal-large-margin detail">
    <ideal-detail-info
      :label-array="labelArray"
      :item-number="2"
      :detail-info="detailInfo"
      class="detail-info"
    ></ideal-detail-info>

    <ideal-table-list
      class="ideal-default-margin-top detail-table"
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :show-pagination="false">
    </ideal-table-list>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders, IdealTableColumnOperate } from '@/types'

const labelArray = ref([
  { label: '策略名称', prop: 'policyName' },
  { label: '策略类型', prop: 'policyType' },
  { label: 'ID', prop: 'id' },
  { label: '资源类型', prop: 'resourceType' },
  { label: '资源', prop: 'resource' },
  { label: '执行动作', prop: 'action' },
  { label: '冷却时间(秒)', prop: 'coolingTime' },
  { label: '限制值', prop: 'limit' },
  { label: '创建时间', prop: 'createTime' },
  { label: '告警规则名称', prop: 'ruleName' },
  { label: '触发条件', prop: 'trigger' }
])
const detailInfo = ref({
  policyName: 'as-policy-5209',
  policyType: '告警策略',
  id: '930a4e98-093c-302a-2091ae39',
  resourceType: '弹性公网IP',
  resource: '1.92.30.23',
  action: '设置为1Mbit/s',
  coolingTime: '300',
  limit: '--',
  createTime: '2023-10-10 19:09:20',
  ruleName: 'as-alarm-3902',
  trigger: '入网带宽最大值>1bit/s。连续满足1次后触发。监控周期5分钟。只警告一次。'
})

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const {
  getDataList
} = useCrud(state)

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '策略执行类型', prop: 'name' },
  { label: '策略执行状态', prop: 'status' },
  { label: '策略执行时间', prop: 'resource' },
  { label: '伸缩资源', prop: 'type' },
  { label: '伸缩原始值(Mbit/s)', prop: 'trigger' },
  { label: '伸缩目标值(Mbit/s)', prop: 'execute' }
]
// 操作
const operateBtns: IdealTableColumnOperate[] = [
  // { title: '停用', prop: 'forbidden' }
]
const clickOperateEvent = (command: string | number | object, row: any) => {
}
</script>

<style scoped lang="scss">
.detail {
  box-sizing: border-box;
  .detail-info {
    padding: $idealPadding;
    width: calc(100% - $idealPadding*2);
    background-color: white;
  }
  .detail-table {
    padding: $idealPadding;
  }
}
</style>
