<template>
  <div>
    <general-create v-if="isPublic || isPrivateHuawei" />

    <!-- <vmwareCreate
      v-else-if="isPrivateVmware"
      @clickSuccessEvent="clickSuccessEvent"
    /> -->
  </div>
</template>

<script setup lang="ts">
import generalCreate from './components/create.vue'
import { useResourcePool } from '@/utils/common/resource'

const { isPublic, isPrivateVmware, isPrivateHuawei } = useResourcePool()
</script>

<style scoped lang="scss"></style>
