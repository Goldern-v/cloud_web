<template>
  <div class="transform">
    <ideal-table-list
      class="expand-confirm-table"
      :table-data="tableData"
      :table-headers="tableHeaders"
      :show-pagination="false"
      :is-multiple="true">
      <template #expandTable>
        <el-table-column type="expand">
          <template #default="props">
            <div>{{ props.row.name }}</div>
          </template>
        </el-table-column>
      </template>

      <template #name>
        <el-table-column label="名称/ID" show-overflow-tooltip>
          <template #default="props">
            <div>{{ props.row.name }}</div>

            <div class="transform-table-id">{{ props.row.uuid }}</div>
          </template>
        </el-table-column>
      </template>

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
    </ideal-table-list>

    <div class="flex-row ideal-large-margin-top" style="align-items: center;">
      <div style="width: 100px;">购买时长</div>

      <el-slider
        v-model="buyTime"
        :marks="buyTimeMarks"
        :max="14"
        :min="1"
        style="width: calc(100% - 100px);"
      />
    </div>

    <div class="flex-row ideal-large-margin-top" style="align-items: center;">
      <el-checkbox v-model="autoRenew" label="自动续费" />
      <el-tooltip
        popper-class="custom-tooltip"
        effect="dark"
        content="自动续费"
        placement="right"
      >
        <svg-icon icon="question-icon"></svg-icon>
      </el-tooltip>
    </div>

    <div class="flex-row ideal-large-margin-top">
      <div class="ideal-default-margin-right">预计到期时间</div>
      <div class="ideal-error-text ideal-default-margin-right">2023-11-10 10:59:59</div>
      <el-tooltip
        popper-class="custom-tooltip"
        effect="dark"
        content="预计到期时间"
        placement="right"
      >
        <svg-icon icon="question-icon"></svg-icon>
      </el-tooltip>
    </div>

    <price-info
      :steps-index="1"
      submit-title="去支付"
      @clickNext="clickNext"
    />
  </div>
</template>

<script setup lang="ts">
import priceInfo from './components/price-info.vue'
import type { IdealTableColumnHeaders } from '@/types'

const tableData: any = [
  {
    name: 'vault-32de',
    uuid: '	e916a9f9-9dae-439f-a24a-becdfa7ab9ce',
    product: '云备份',
    spec: '云硬盘备份存储库｜100GB',
    area: '华北-北京四',
    status: '使用中',
    statusType: 'status-success',
    openTime: '2023-10-09 17:02:32'
  }
]
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称/ID', prop: 'name', useSlot: true },
  { label: '产品类型', prop: 'product' },
  { label: '规格', prop: 'spec' },
  { label: '云服务区', prop: 'area' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '开通时间', prop: 'openTime' }
]
const buyTime = ref()
const buyTimeMarks: { [key: number]: string } = {
  1: '1个月',
  2: '2个月',
  3: '3个月',
  4: '4个月',
  5: '5个月',
  6: '6个月',
  7: '7个月',
  8: '8个月',
  9: '9个月',
  10: '10个月',
  11: '11个月',
  12: '1年',
  13: '2年',
  14: '3年'
}
const autoRenew = ref()
// 立即支付
const clickNext = () => {

}
</script>

<style scoped lang="scss">
.transform {
  // width: 100%;
  background-color: white;
  padding: $idealPadding;
  .transform-table-id {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 3px;
  }
}
</style>
