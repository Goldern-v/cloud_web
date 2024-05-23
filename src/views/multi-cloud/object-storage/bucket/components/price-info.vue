<template>
  <div :class="showSidebar ? 'price-info':'price-info-small'">
    <div class="flex-row price-info-box">
      <div class="flex-column price-info-item">
        <div style="height: 20px;">创建阶段</div>
        <div class="flex-row">
          OBS桶： 
          <div class="price-info-item-content">创建免费</div>
        </div>
      </div>

      <div class="flex-column price-info-item">
        <div style="height: 20px;">使用阶段</div>
        <div class="price-info-item-content">按需/资源包计费</div>
      </div>

      <div class="price-info-item">
        <el-button
          type="primary"
          @click="handleCreate"
          >立即创建</el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import store from '@/store'

const showSidebar = computed(() => store.appStore.sidebarOpened)

const handleCreate = () => {}
</script>

<style scoped lang="scss">
.price-info, .price-info-small {
  position: fixed;
  width: calc(100% - $sidebarWidth);
  bottom: 0;
  left: $sidebarWidth;
  background: #fff;
  z-index: 2000;
  box-shadow: 5px 5px 17px 9px #e5e9ea;
  text-align: center;
  overflow: hidden;
  height: 60px;
  line-height: 60px;
  .price-info-box {
    justify-content: space-between;
    padding: 0 $idealPadding;
    .price-info-item {
      height: 60px;
      line-height: 60px;
      justify-content: center;
      align-items: flex-start;
      .price-info-item-content {
        font-size: $largeFontSize;
        font-weight: 600;
      }
    }
  }
}
.price-info-small {
  width: calc(100% - $sidebarSmallWidth);
  left: $sidebarSmallWidth;
}
</style>
