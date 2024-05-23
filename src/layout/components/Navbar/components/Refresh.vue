<template>
  <svg-icon icon="icon-reload" @click="refresh"></svg-icon>
</template>

<script setup lang="ts">
import store from '@/store'

const router = useRouter()
const route = useRoute()

const refresh = () => {
  store.tabsStore.delCachedView(route).then(() => {
    nextTick(() => {
      router.replace({ path: '/redirect' + route.path }).catch(err => {
        console.log(err)
      })
    })
  })
}
</script>
