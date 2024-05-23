<template>
  <div class="flex-column left">
    <mine-resource style="margin-bottom: 10px;"/>
    <illegal style="margin-bottom: 10px;"/>
    <optimization style="margin-bottom: 10px;"/>
    <expenses-trends style="margin-bottom: 10px;"/>
    <usage-trends />
  </div>
</template>

<script setup lang="ts">
import illegal from './components/illegal.vue'
import optimization from './components/optimization.vue'
import mineResource from './components/mine-resource.vue'
import expensesTrends from './components/expenses-trends.vue'
import usageTrends from './components/usage-trends.vue'

</script>

<style scoped lang="scss">
.left {
  justify-content: space-between;
}
</style>
