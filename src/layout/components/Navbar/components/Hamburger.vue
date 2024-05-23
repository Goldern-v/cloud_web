<template>
  <div @click="handleClick">
    <svg-icon :icon="icon" class-name="sidebar-svg"/>
  </div>
</template>

<script setup lang="ts">
import store from '@/store'

const handleClick = () => {
  store.appStore.setSidebarOpened()
}

const icon = computed(() =>
  store.appStore.sidebarOpened ? 'icon-outdent' : 'icon-indent'
)
</script>
<style scoped lang="scss">
:deep(.svg-icon svg) {
  width: 20px;
  height: 20px;
}
</style>
