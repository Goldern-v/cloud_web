<template>
  <el-breadcrumb
    separator="/"
    :separator-icon="ArrowRight"
    class="navbar-breadcrumb"
  >
    <el-breadcrumb-item v-for="(item, index) of breadcrumb" :key="index">
      <template v-if="index !== breadcrumb.length - 1">
        <span v-if="!item.path" class="navbar-breadcrumb-default">{{
          item.title
        }}</span>
        <span
          v-else
          class="navbar-breadcrumb-default toPathBreadcrumb"
          @click="toPath(item)"
          >{{ item.title }}</span
        >
      </template>
      <span v-else class="navbar-breadcrumb-active">{{ item.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { router } from '@/router'
import { ArrowRight } from '@element-plus/icons-vue'

const route = useRoute()
const breadcrumb = computed(() => route.meta.breadcrumb) as any

const toPath = (item: any) => {
  const { path } = item
  router.push({
    path
  })
}
</script>

<style lang="scss" scoped>
.navbar-breadcrumb {
  :deep(.el-breadcrumb__inner) {
    color: var(--theme-header-text-color) !important;
  }
  // padding-left: 10px;
  .navbar-breadcrumb-default {
    color: #999999;
    font-size: $largeFontSize;
    &.toPathBreadcrumb {
      cursor: pointer;
      &:hover {
        color: #333333;
      }
    }
  }
  .navbar-breadcrumb-active {
    color: #333333;
    font-weight: 500;
    font-size: $largeFontSize;
  }
  :deep(.el-breadcrumb__separator.el-icon) {
    color: #999999;
  }
}
</style>
