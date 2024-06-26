<template>
  <div>
    <reset v-if="firstLogin"/>
    <account v-else/>
  </div>
</template>

<script setup lang="ts">
import reset from './reset.vue'
import account from './account.vue'
import store from '@/store'

const firstLogin = computed(() => store.userStore.firstLogin)
</script>

<style scoped lang="scss">

</style>
