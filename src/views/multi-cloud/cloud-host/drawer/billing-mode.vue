<template>
  <div class="billing-explain">
    <div class="billing-explain-title">解释说明</div>

    <div class="flex-row flex-row-center">
      <div class="custom-dot"></div>
      <div>包年/包月</div>
    </div>
    <div class="ideal-tip-text">
      包年包月是预付费模式，按订单的购买周期计费，适用于可预估资源使用周期的场景，价格比按需计费模式更优惠。
    </div>

    <div class="flex-row flex-row-center">
      <div class="custom-dot"></div>
      <div>按需计费</div>
    </div>
    <div class="ideal-tip-text">
      按需计费是后付费模式，按弹性云服务器的实际使用时长计费，可以随时开通/删除弹性云服务器。
    </div>

    <ideal-table-list
      :table-data="dataList"
      :table-headers="tableHeaders"
      :show-pagination="false">
      <template #package>
        <el-table-column label="包年/包月">
          <template #default="props">{{ props.row.package }}</template>
        </el-table-column>
      </template>

      <template #on_demand>
        <el-table-column label="按需计费">
          <template #default="props">{{ props.row.on_demand }}</template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <div class="billing-explain-title">常见问题</div>
    <el-collapse accordion>
      <el-collapse-item name="1">
        <template #title>
          <span class="collapse-title" style="text-align: left">包年/包月和按需计费模式哪个更划算？</span>
        </template>
        
        <div>
          <div>在单位时间内包年/包月比按需计费模式更划算。</div>
          <div>包年包月适用于可预估资源使用周期的场景。</div>
          <div>按需计费适用于对计算资源有灵活需求的场景，可以随时开通/删除弹性云服务器。</div>
          <div>请根据实际使用场景选择计费模式。</div>
        </div>
      </el-collapse-item>

      <el-collapse-item name="2">
        <template #title>
          <span class="collapse-title" style="text-align: left">按需付费的弹性云服务器关机后还会计费吗？</span>
        </template>
        <div>
          <div>对于按需付费的弹性云服务器：</div>
          <div>普通实例（不含本地盘和FPGA卡）关机后，基础资源(如vCPU、内存、镜像)不计费，但系统盘仍会收取容量对应的费用，其他绑定资源（如云硬盘、弹性公网IP、带宽等），按各自产品的计费方法（“包年/包月”或“按需付费”）正常计费。</div>
          <div>
            特殊实例（含本地盘和FPGA卡）关机后正常计费。如果停止计费，需删除弹性云服务器。
          </div>
        </div>
      </el-collapse-item>

      <el-collapse-item name="3">
        <template #title>
          <span class="collapse-title" style="text-align: left">云服务器怎样停止计费？</span>
        </template>
        <div>
          <div>“按需计费”计费模式的产品：例如按需计费的弹性云服务器、按需计费的云硬盘等，如果不再使用该产品，需彻底停止计费，请直接删除相应产品。如果弹性云服务器包含本地盘、FPGA卡，则关机后仍然计费。如需停止计费，需删除弹性云服务器。</div>
          <div>“包年/包月”计费模式的产品：例如包括包年/包月的弹性云服务器、包年/包月的云硬盘等，用户在购买时一次性付费，到期自动停止使用。如果用户提前终止使用，系统不会予以退费。</div>
        </div>
      </el-collapse-item>

      <el-collapse-item name="4">
        <template #title>
          <span class="collapse-title" style="text-align: left"
            >弹性云服务器到期了怎么办？</span
          >
        </template>
        <div>
          包年/包月方式购买的弹性云服务器到期后，请及时在管理控制台续费管理页面进行续费操作。
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import type { IdealTableColumnHeaders } from '@/types'

// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '计费模式', prop: 'billingMode' },
  { label: '包年/包月', prop: 'package', useSlot: true },
  { label: '按需计费', prop: 'on_demand', useSlot: true }
]
const dataList = [
  { billingMode: '付费模式', package: '预付费按照订单的购买周期结算。', on_demand: '后付费按照云服务器实际使用时长计费。' },
  { billingMode: '计费周期', package: '按订单的购买周期计费。', on_demand: '秒级计费，按小时结算。' },
  { billingMode: '关机计费', package: '按订单的购买周期计费。云服务器关机对包年/包月计费无影响。', on_demand: '普通实例基础资源(如vCPU、内存、镜像)不计费，绑定资源（如云硬盘、弹性公网IP、带宽等）正常计费。' },
  { billingMode: '更改计费方式', package: '支持变更为按需资源。但包年/包月资费模式到期后，按需的资费模式才会生效。', on_demand: '支持变更为包年/包月资源。' },
  { billingMode: '变更规格', package: '支持变更实例规格。', on_demand: '支持变更实例规格。' },
  { billingMode: '适用场景', package: '适用于可预估资源使用周期的场景，价格比按需计费模式更优惠。对于长期使用者，推荐该方式。', on_demand: '适用于计算资源需求波动的场景，可以随时开通，随时删除。' }
]
</script>

<style scoped lang="scss">
.billing-explain {
  width: 100%;
  .flex-row-center {
    align-items: center;
  }
  .custom-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--el-color-primary);
    margin-right: 3px;
  }
  .billing-explain-title {
    font-size: $mediumFontSize;
    font-weight: 500;
  }
  .collapse-title {
    flex: 1;
    order: 1;
  }
  // 修改折叠框
  :deep(.el-collapse) {
    --el-collapse-header-bg-color: var(--el-color-primary-light-9);
    border-top: none;
    border-bottom: none;
  }
  :deep(.el-collapse-item__header) {
    padding-left: 10px;
  }
  :deep(.el-collapse-item) {
    border: 1px solid $sub5-light;
    margin: 10px 0;
    border-radius: $circleRadiusSize;
  }
  :deep(.el-collapse-item__content) {
    padding: 10px;
  }
}
</style>
