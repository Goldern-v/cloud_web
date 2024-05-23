<template>
  <div class="cost-view">
    <div class="ideal-tip-text">成本视图</div>
    <div v-for="(item, index) of array" :key="index">
      <div class="flex-row cost-view-box">
        <div style="width: 60px">{{ item.label }}</div>

        <div class="flex-row" style="width: calc(100% - 70px)">
          <div
            v-for="(child, idx) of 4"
            :key="idx"
            class="cost-view-box-item ideal-default-margin-right"
            :class="{
              'cost-view-box-item-active': idx < item.percentage,
              'cost-view-box-item-disabled': disabled,
              'cost-view-box-item-disabled-active':
                disabled && idx < item.percentage
            }"
          ></div>
        </div>

        <div style="width: 10px">{{ item.text }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface CostViewProps {
  array?: any[]
  disabled?: boolean
}
withDefaults(defineProps<CostViewProps>(), {
  array: () => [],
  disabled: false
})
</script>

<style scoped lang="scss">
.cost-view {
  width: 100%;
  .cost-view-box {
    align-items: center;
    .cost-view-box-item,
    .cost-view-box-item-active,
    .cost-view-box-item-disabled,
    .cost-view-box-item-disabled-active {
      width: 20%;
      height: 5px;
      background-color: #f3f5fd;
    }
    .cost-view-box-item-active {
      background-color: var(--el-color-primary);
    }
    .cost-view-box-item-disabled {
      background-color: $gray3-light;
    }
    .cost-view-box-item-disabled-active {
      background-color: $gray5-light;
    }
  }
}
</style>
