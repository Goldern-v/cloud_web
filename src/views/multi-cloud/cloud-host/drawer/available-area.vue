<template>
  <div class="available-area">
    <div class="available-area-title">解释说明</div>

    <div class="flex-row flex-row-center">
      <div class="custom-dot"></div>
      <div>可用区（AZ，Availability Zone）</div>
    </div>
    <div class="ideal-tip-text">
      可用区是在同一区域下，电力、网络隔离的物理区域，可用区之间内网互通，不同可用区之间物理隔离。
    </div>
    <div class="ideal-tip-text">
      一个区域内有多个可用区，一个可用区发生故障后不会影响同一区域内下的其它可用区。
    </div>

    <div class="available-area-title">常见问题</div>
    <el-collapse accordion>
      <el-collapse-item name="1">
        <template #title>
          <span class="collapse-title" style="text-align: left">不同可用区的云服务器是否可以通过内网互相访问？</span>
        </template>
        
        <div>
          同一个区域下的不同可用区内网互通，可以内网互相访问，不同区域的可用区网络不通，但可以绑定弹性公网IP通过外网互相访问。
        </div>
      </el-collapse-item>

      <el-collapse-item name="2">
        <template #title>
          <span class="collapse-title" style="text-align: left">怎样选择可用区？</span>
        </template>
        <div>
          <div>是否将资源放在同一可用区内，主要取决于您对容灾能力和网络时延的要求。</div>
          <div>如果您的应用需要较高的容灾能力，建议您将资源部署在同一区域的不同可用区内。</div>
          <div>
            如果您的应用要求实例之间的网络延时较低，则建议您将资源创建在同一可用区内。
          </div>
        </div>
      </el-collapse-item>

      <el-collapse-item name="3">
        <template #title>
          <span class="collapse-title" style="text-align: left">云服务器购买成功后，可以更换可用区吗？</span>
        </template>
        <div>
          <div>已购买的弹性云服务器不支持更换可用区。</div>
          <div>如需迁移云服务器到其他可用区，您可以将云服务器制作成私有镜像，使用私有镜像在目标可用区创建同一镜像环境的云服务器。</div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.available-area {
  width: 100%;
  .flex-row-center {
    align-items: center;
  }
  .custom-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--el-color-primary);
    margin-right: 3px;
  }
  .available-area-title {
    font-size: $mediumFontSize;
    font-weight: 500;
  }
  .collapse-title {
    flex: 1;
    order: 1;
  }
  // 修改折叠框
  :deep(.el-collapse) {
    --el-collapse-header-bg-color: var(--el-color-primary-light-9);
    border-top: none;
    border-bottom: none;
  }
  :deep(.el-collapse-item__header) {
    padding-left: 10px;
  }
  :deep(.el-collapse-item) {
    border: 1px solid $sub5-light;
    margin: 10px 0;
    border-radius: $circleRadiusSize;
  }
  :deep(.el-collapse-item__content) {
    padding: 10px;
  }
}
</style>
