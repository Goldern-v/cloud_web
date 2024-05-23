<template>
  <div class="disk">
    <div class="disk-title">解释说明</div>

    <div class="flex-row flex-row-center">
      <div class="custom-dot"></div>
      <div>系统盘</div>
    </div>
    <div class="ideal-tip-text">
      系统盘用于存储云服务器的操作系统，创建云服务器时自带系统盘，且系统盘自动初始化。
    </div>

    <div class="flex-row flex-row-center">
      <div class="custom-dot"></div>
      <div>数据盘</div>
    </div>
    <div class="ideal-tip-text">
      数据盘用于存储用户数据。
    </div>
    <div class="ideal-tip-text">数据盘可以在购买云服务器的时候购买，由系统自动挂载给云服务器。也可以在购买了云服务器之后，单独购买云硬盘并挂载给云服务器。</div>
    <div class="ideal-tip-text">数据盘挂载至云服务器后，需要登录云服务器初始化云硬盘才可以正常使用。</div>

    <div class="flex-row flex-row-center">
      <div class="custom-dot"></div>
      <div>磁盘类型</div>
    </div>
    <div class="ideal-tip-text">
      不同类型云硬盘的性能和价格有所不同，您可根据程序要求选择您所需的云硬盘。
    </div>

    <div class="flex-row flex-row-center">
      <div class="custom-dot"></div>
      <div>磁盘模式</div>
    </div>
    <div class="ideal-tip-text">
      根据是否支持高级的SCSI命令来划分云硬盘的磁盘模式，分为VBD(虚拟块存储设备 , Virtual Block Device)类型和SCSI (小型计算机系统接口, Small Computer System Interface) 类型。
    </div>
    <div class="ideal-tip-text">系统默认的磁盘模式为VBD，如果选择了SCSI，能支持SCSI指令透传，可应用于需要支持SCSI指令的场景。</div>

    <div class="flex-row flex-row-center">
      <div class="custom-dot"></div>
      <div>共享盘</div>
    </div>
    <div class="ideal-tip-text">
      共享磁盘是一种支持多个云服务器并发读写访问的数据块级存储设备，具备多挂载点、高并发性、高性能、高可靠性等特点。主要应用于需要支持集群、HA（High Available，指高可用集群）能力的关键企业应用场景，单个共享磁盘最多可同时挂载给16台云服务器。
    </div>

    <div class="disk-title">常见问题</div>
    <el-collapse accordion>
      <el-collapse-item name="1">
        <template #title>
          <span class="collapse-title" style="text-align: left">磁盘容量不足怎么办？</span>
        </template>
        
        <div>
          当已有云硬盘容量不足时，您可以扩大云硬盘的容量，即云硬盘扩容。系统盘和数据盘均支持扩容。当前磁盘只支持扩大容量，不支持缩小容量。
        </div>
      </el-collapse-item>

      <el-collapse-item name="2">
        <template #title>
          <span class="collapse-title" style="text-align: left">磁盘是怎样收费的？</span>
        </template>
        <div>
          云硬盘服务根据磁盘容量计费，云硬盘购买成功后开始收费，提供包年/包月、按需付费两种计费方式。
        </div>
      </el-collapse-item>

      <el-collapse-item name="3">
        <template #title>
          <span class="collapse-title" style="text-align: left">为什么登录云服务器看不到已挂载的磁盘？</span>
        </template>
        <div>
          新添加的磁盘未进行分区和初始化。磁盘挂载至云服务器后默认是没有分区和文件系统的，因此在资源管理器中不会显示，需要先手动执行初始化操作。
        </div>
      </el-collapse-item>

      <el-collapse-item name="4">
        <template #title>
          <span class="collapse-title" style="text-align: left">弹性云服务器可以挂载多块磁盘吗？</span>
        </template>
        <div>
          <div>系统最多支持挂载60块磁盘。</div>
          <div>创建弹性云服务器时，您可以为弹性云服务器添加24块磁盘。</div>
          <div>弹性云服务器创建成功后，可以最多添加60块磁盘。</div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.disk {
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
  .disk-title {
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
