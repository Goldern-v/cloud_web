<template>
  <div class="big-screen">
    <div class="flex-row">
      <resource-overview style="width: 25%;"/>
      <pool-overview style="width: 50%;"/>
      <div style="width: 25%;">
        <platform-overview/>
        <alarm-statistics />
      </div>
    </div>

    <div class="flex-row">
      <monitor class="monitor"/>
      <cost-overview style="width: 40%;"/>
      <result-overview style="width: 30%;"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import resourceOverview from './components/resource-overview.vue'
import poolOverview from './components/pool-overview.vue'
import overview from './components/overview.vue'
import platformOverview from './components/platform-overview.vue'
import alarmStatistics from './components/alarm-statistics.vue'
import monitor from './components/monitor.vue'
import costOverview from './components/cost-overview.vue'
import resultOverview from './components/result-overview.vue'
</script>

<style scoped lang="scss">
.big-screen {
  width: 100%;
  .resource-overview, .platform-overview {
    width: 20%;
  }
  .overview {
    width: 60%;
  }
  .monitor {
    width: 30%;
  }
}
</style>
