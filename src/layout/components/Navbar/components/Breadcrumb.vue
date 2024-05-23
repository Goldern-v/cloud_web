<template>
  <el-breadcrumb
    separator="/"
    :separator-icon="ArrowRight"
    class="navbar-breadcrumb"
  >
    <el-breadcrumb-item v-for="(item, index) of breadcrumb" :key="index">
      <span v-if="index !== breadcrumb.length - 1" class="navbar-breadcrumb-default">{{ item }}</span>
      <span v-else class="navbar-breadcrumb-active">{{ item }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { ArrowRight } from '@element-plus/icons-vue'

const route = useRoute()
const breadcrumb = computed(() => route.meta.breadcrumb) as any
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
