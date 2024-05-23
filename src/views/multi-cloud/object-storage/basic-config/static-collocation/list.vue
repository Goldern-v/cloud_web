<template>
  <div class="static-collocation">
    <div class="flex-row static-collocation-tip ideal-middle-margin-bottom">
      <svg-icon icon="info-warning" class-name="info-warning" class="ideal-svg-margin-right"/>
      <div>基于安全合规要求，OBS禁止通过默认域名(桶访问域名或静态网站访问域名)使用静态网站托管功能。即在生效时间点后创建的桶，使用上述域名从浏览器访问网页类型文件时，不会显示对象内容。</div>
    </div>

    <div>静态网站托管</div>
    <div class="ideal-tip-text">您可以将静态网站文件上传至桶中，并为其设置匿名用户读取权限，无需服务器技术，即可托管您的静态网站在OBS中。</div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.static-collocation {
  padding: $idealPadding;
  background-color: white;
  :deep(.info-warning) {
    color: var(--el-color-primary)
  }
  .static-collocation-tip {
    background-color: var(--el-color-primary-light-9);
    border: 1px solid var(--el-color-primary);
    padding: 10px;
  }
}
</style>
