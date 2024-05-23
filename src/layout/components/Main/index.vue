<template>
  <el-scrollbar>
    <el-main class="layout-main">
      <el-header :style="breadcrumbHeaderHeight">
        <div v-if="showBreadcrumb" class="flex-row breadcrumb-style">
          <Breadcrumb class="breadcrumb-container"></Breadcrumb>
        </div>

        <scroll-bar />
      </el-header>

      <el-scrollbar class="layout-scrollbar">
        <div class="layout-card" :style="layoutMainHeight">
          <router-view v-slot="{ Component, route }">
            <keep-alive
              v-if="theme.isTabsCache"
              :include="[...store.tabsStore.cachedViews]"
            >
              <component :is="Component" :key="route.name" />
            </keep-alive>
            <component :is="Component" v-else :key="route.name" />
          </router-view>
        </div>
      </el-scrollbar>
    </el-main>
  </el-scrollbar>
</template>

<script setup lang="ts">
import scrollBar from './scroll-bar.vue'
import Breadcrumb from '@/layout/components/Navbar/components/Breadcrumb.vue'
import { RouterView } from 'vue-router'
import store from '@/store'
import { replacePath } from '@/router/replace'

const theme = computed(() => store.appStore.theme)
const layoutMainHeight = computed(() => {
  if (!theme.value.isTabsView) {
    return 'min-height: calc(100vh - var(--breadcrumb-height) - var(--navigation-bar-height) - 40px) !important'
  } else {
    return ''
  }
})

const route = useRoute()
const defaultActive = computed(() => {
  const { path } = route
  return replacePath(path)
})

const showBreadcrumb = computed(() => {
  // 不含首页且设置了面包屑
  return (
    !RegExp(/home/g).test(defaultActive.value) &&
    store.appStore.theme.isBreadcrumb
  )
})

const breadcrumbHeaderHeight = computed(() => {
  if (showBreadcrumb.value) {
    // 标签页显: 面包屑高度 + 标签页高度
    if (theme.value.isTabsView) {
      return 'height: calc(var(--breadcrumb-height) + 40px !important'
    } else {
      return 'height: calc(var(--breadcrumb-height)'
    }
  } else {
    return 'height: 0;'
  }
})
</script>
<style scoped lang="scss">
.breadcrumb-style {
  justify-content: flex-start;
  margin-top: 20px;
  .breadcrumb-container {
    height: var(--breadcrumb-height);
    line-height: var(--breadcrumb-height);
  }
}
</style>
