<template>
  <div class="sidebar-logo">
    <img src="@/assets/supplier/logo.png" class="logo-container" alt=""/>
    <div class="logo-title"> {{ $t('app.logoText') }}</div>
  </div>
</template>

<script setup lang="ts">
// import store from '@/store'
</script>

<style lang="scss" scoped>
.sidebar-logo {
  width: 230px !important;
  height: var(--theme-header-height);
  line-height: var(--theme-header-height);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  box-shadow: rgb(0 21 41 / 2%) 0 1px 4px;
  color: var(--theme-logo-text-color);
  font-size: 18px;
  .el-avatar {
    width: 25px;
    height: 25px;
  }
  .logo-title {
    margin-left: 10px;
    font-size: 14px;
    font-weight: 500;
  }
  .logo-container {
    width: 26px;
    height: 26px;
    object-fit: contain;
  }
}
.sidebar-logo-expend {
  width: 100% !important;
}
</style>
