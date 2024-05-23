<template>
  <div>
    <el-footer
      height="60px"
      :class="showSidebar ? 'submit-footer' : 'submit-footer-small'"
    >
      <div class="flex-row flex-row_right">
        <div>
          <el-button id="submit-btn" type="primary" @click="onClickCreate"
            >立即创建</el-button
          >
        </div>
      </div>
    </el-footer>
  </div>
</template>

<script setup lang="ts">
import store from '@/store'
const showSidebar = computed(() => store.appStore.sidebarOpened)

const onClickCreate = () => {}
</script>

<style lang="scss" scoped>
.submit-footer,
.submit-footer-small {
  position: fixed;
  width: calc(100% - $sidebarWidth);
  bottom: 0;
  left: $sidebarWidth;
  background: #fff;
  z-index: 2000;
  box-shadow: 5px 5px 17px 9px #e5e9ea;
  text-align: center;
  overflow: hidden;
  .flex-row_right {
    height: 60px;
    line-height: 60px;
    justify-content: flex-end;
  }
}
.submit-footer-small {
  width: calc(100% - $sidebarSmallWidth);
  left: $sidebarSmallWidth;
}
</style>
