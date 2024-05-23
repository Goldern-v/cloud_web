<template>
  <div class="flex-row quick-access">
    <div class="quick-access-title">快捷入口</div>

    <el-divider direction="vertical"/>

    <div v-for="(item, index) of serviceList" :key="index" class="flex-column quick-access-service">
      <svg-icon
        :icon="item.icon"
        color="#25314C"
        class="ideal-svg-margin-right"
      />
      <div class="quick-access-service-label">{{ item.label }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 快捷入口组件
*/

const serviceList = ref([
  { label: '弹性云主机', icon: 'cloud-host' },
  { label: '镜像服务', icon: 'mirror-service' },
  { label: '裸金属服务器', icon: 'bare-metal' },
  { label: '弹性文件服务', icon: 'elastic-file' },
  { label: '弹性伸缩', icon: 'elastic-scaling' },
  { label: '共享带宽', icon: 'share-bandwidth' },
  { label: '管理', icon: 'dashed-plus' },
])
</script>

<style scoped lang="scss">
$labelColor: #1D2129;
.quick-access {
  background-color: white;
  align-items: center;
  padding: 10px 20px;
  .quick-access-title {
    width: 32px;
    margin-right: 10px;
    color: $labelColor;
    font-weight: 500;
    font-size: 16px;
  }
  .quick-access-service {
    justify-content: center;
    align-items: center;
    margin: 0 10px;
    .quick-access-service-label {
      color: $labelColor;
      font-weight: 400;
      font-size: 12px;
    }
  }
}
</style>