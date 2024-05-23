<template>
  <div class="detail">
    <ideal-detail-info
      class="detail-info"
      :label-array="labelArray"
      :item-number="2"
      :detail-info="rowData"
    ></ideal-detail-info>

    <ideal-table-list
      class="ideal-large-margin-top detail-table"
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :show-pagination="false"
    >
      <template #status>
        <el-table-column label="状态" >
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
        <el-table-column label="操作" width="225" fixed="right">
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
import { isEmpty } from '@/utils/is'
import type { IdealTableColumnHeaders, IdealTableColumnOperate } from '@/types'

// 详情数据
const rowData = ref()
const route = useRoute()
onMounted(() => {
  const data = route.query.data
  if (!isEmpty(data)) {
    rowData.value = JSON.parse(data)
  }
})

const labelArray = ref([
  { label: '策略名称', prop: 'name' },
  { label: '策略类型', prop: 'type' },
  { label: 'ID', prop: 'id' },
  { label: '状态', prop: 'status' },
  { label: '执行动作', prop: 'execute' },
  { label: '冷却时间(秒)', prop: 'coolingTime' },
  { label: '创建时间', prop: 'createTime' },
  { label: '监控类型', prop: 'resource' },
  { label: '监控对象', prop: 'monitor' },
  { label: '告警规则名称', prop: 'alarmName' },
  { label: '触发条件', prop: 'trigger' }
])

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const {} = useCrud(state)
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '日志ID', prop: 'logId' },
  { label: '策略执行类型', prop: 'type' },
  { label: '策略执行状态', prop: 'status', useSlot: true },
  { label: '策略执行时间', prop: 'time' },
  { label: '伸缩前实例数', prop: 'before' },
  { label: '伸缩后实例数', prop: 'after' }
]
// 操作
const operateBtns: IdealTableColumnOperate[] = [
  // { title: '查看伸缩策略', prop: 'check' }
]
const clickOperateEvent = (command: string | number | object, row: any) => {
}
</script>

<style scoped lang="scss">
.detail {
  width: 100%;
  .detail-info {
    background-color: white;
  }
  .detail-table {
    padding: $idealPadding;
  }
}
</style>
