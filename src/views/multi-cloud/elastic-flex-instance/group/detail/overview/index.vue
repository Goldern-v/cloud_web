<template>
  <div class="overview">
    <div class="flex-row overview-top">
      <overview-statistics class="overview-statistics"/>
      <overview-activity class="overview-activity"/>
    </div>

    <overview-info class="ideal-large-margin-top"/>
  </div>
</template>

<script setup lang="ts">
import overviewStatistics from './overview-statistics.vue'
import overviewActivity from './overview-activity.vue'
import overviewInfo from './overview-info.vue'

</script>

<style scoped lang="scss">
.overview {
  background-color: var(--theme-main-bg-color);
  .overview-top {
    padding: 0 $idealPadding $idealPadding;
    background-color: white;
    .overview-statistics {
      padding: $idealPadding;
      width: calc(70% - $idealPadding * 2);
    }
    .overview-activity {
      background-color: white;
      padding: $idealPadding;
      width: calc(30% - $idealPadding * 2);
    }
  }
}
</style>
