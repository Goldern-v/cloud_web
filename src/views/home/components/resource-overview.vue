<template>
  <div class="resource-overview">
    <div class="resource-overview-title">资源概览</div>

    <div class="flex-row">
      <div
        v-for="(item, index) of resourceStatistics"
        :key="index"
        class="flex-column resource-overview-item"
      >
        <div class="flex-row">
          <div class="resource-overview-item-type">{{ item.type }}</div>
          <el-tooltip
            effect="dark"
            placement="right"
            :content="item.type"
            popper-class="resource__tooltip"
          >
            <svg-icon icon="question-icon"></svg-icon>
          </el-tooltip>
        </div>

        <div class="resource-overview-item-total">{{ item.total }}</div>

        <div class="flex-row flex-row-between">
          <div class="resource-overview-item-statistics">分配量</div>
          <div class="resource-overview-item-statistics">
            <span class="ideal-theme-text">{{ item.alloc }}</span
            >核
          </div>
        </div>

        <div class="flex-row flex-row-between">
          <div class="resource-overview-item-statistics">剩余量</div>
          <div class="resource-overview-item-statistics">
            <span class="ideal-theme-text">{{ item.surplus }}</span
            >核
          </div>
        </div>

        <el-progress
          :percentage="item.percentage"
          :show-text="false"
          class="ideal-default-margin-top"
        />

        <div class="resource-overview-item-alloc">
          分配率：{{ item.allocRates }}%
        </div>
      </div>
    </div>

    <resource-zone class="ideal-default-margin-top"/>
  </div>
</template>

<script setup lang="ts">
/**
 * 资源概览组件
*/
import ResourceZone from './resource-zone.vue'

const resourceStatistics = ref([
  {
    type: 'CPU总量（核）',
    total: '45230',
    unit: '核',
    alloc: '30980',
    surplus: '14250',
    percentage: 68.49,
    allocRates: '20.94'
  },
  {
    type: '内存总量（GB）',
    total: '54092',
    unit: 'GB',
    alloc: '36432',
    surplus: '18680',
    percentage: 67.35,
    allocRates: '54.09'
  },
  {
    type: '块存储总量（TB）',
    total: '3400',
    unit: 'TB',
    alloc: '2300',
    surplus: '1100',
    percentage: 67.65,
    allocRates: '38.74'
  },
  {
    type: '文件存储总量（GB）',
    total: '98502',
    unit: 'GB',
    alloc: '59002',
    surplus: '39500',
    percentage: 59.90,
    allocRates: '76.10'
  }
])
</script>

<style scoped lang="scss">
$bgColor: #f7f8fa;
.resource-overview {
  padding: $idealPadding;
  background-color: white;
  .flex-row-between {
    align-items: center;
    justify-content: space-between;
  }
  .resource-overview-title {
    color: #2b2f39;
    font-weight: 500;
    font-size: 16px;
  }
  .resource-overview-item {
    border: 1px solid #e5e6eb;
    padding: 10px;
    width: 25%;
    margin-right: 10px;
    margin-top: 10px;
    .resource-overview-item-type {
      color: #4e5969;
      font-weight: 500;
      font-size: 12px;
      margin: 5px 0;
    }
    .resource-overview-item-total {
      color: #1d2129;
      font-weight: 600;
      font-size: 16px;
      margin: 5px 0;
    }
    .resource-overview-item-alloc {
      background-color: $bgColor;
      padding: 10px;
      text-align: center;
      margin-top: 10px;
    }
    .resource-overview-item-statistics {
      color: #4e5969;
      font-weight: 400;
      font-size: 12px;
    }
  }
  .resource-overview-item:last-child {
    margin-right: 0;
  }
}
</style>
<style lang="scss">
.resource__tooltip {
  width: 260px;
}
</style>
