<template>
  <div class="public-network-create">
    <resource-info :ref="'resourceInfoRef'"> </resource-info>
    <config-info :ref="'configInfoRef'"> </config-info>
    <footer-submit> </footer-submit>
  </div>
</template>

<script setup lang="ts">
import resourceInfo from './components/resource-info.vue'
import configInfo from './components/config-info.vue'
import footerSubmit from './components/footer-submit.vue'
</script>

<style scoped lang="scss">
.public-network-create {
  box-sizing: border-box;
  margin: $idealMargin $idealMargin 80px;
  .custom-input {
    width: 20%;
  }
  .ideal-header-container {
    width: 100%;
  }
  :deep(.el-divider--vertical) {
    border-left: 2px var(--el-color-primary) solid;
  }
}
</style>
