<template>
  <div class="architecture">
    <div class="architecture-title">解释说明</div>
    <div class="flex-row flex-row-center">
      <div class="custom-dot"></div>
      <div>x86计算</div>
    </div>
    <div class="ideal-tip-text">
      x86 CPU架构采用复杂指令集（CISC），CISC指令集的每个小指令可以执行一些较低阶的硬件操作，指令数目多而且复杂，每条指令的长度并不相同。由于指令执行较为复杂所以每条指令花费的时间较长。
    </div>

    <div class="flex-row flex-row-center">
      <div class="custom-dot"></div>
      <div>鲲鹏计算</div>
    </div>
    <div class="ideal-tip-text">
      鲲鹏处理器基于Arm结构，采用RISC精简指令集（RISC），RISC是一种执行较少类型计算机指令的微处理器，它能够以更快的速度执行操作，使计算机的结构更加简单合理地提高运行速度，相对于X86 CPU架构具有更加均衡的性能功耗比。
    </div>
    <div class="ideal-tip-text">鲲鹏CPU架构的优势是高密度低功耗，可以提供更高的性价比，满足重载业务场景使用。</div>

    <div class="architecture-title">常见问题</div>
    <el-collapse accordion>
      <el-collapse-item name="1">
        <template #title>
          <span class="collapse-title" style="text-align: left">鲲鹏CPU架构的云服务器可以切换成x86 CPU架构的云服务器吗？</span>
        </template>
        
        <div>
          两种CPU架构的云服务器不可以互相切换，因为两者的CPU架构不同，从而导致两者所使用的操作系统中部分二进制文件格式不同，不可以互相切换。
        </div>
      </el-collapse-item>

      <el-collapse-item name="2">
        <template #title>
          <span class="collapse-title" style="text-align: left">x86 CPU架构的服务器创建的私有镜像能否用于创建鲲鹏CPU架构的服务器？</span>
        </template>
        <div>
          不可以，x86 CPU架构的服务器创建的私有镜像中的部分二进制文件只能在x86 CPU架构上运行，不可以用来创建鲲鹏CPU架构的服务器。
        </div>
      </el-collapse-item>

      <el-collapse-item name="3">
        <template #title>
          <span class="collapse-title" style="text-align: left">可以创建Windows操作系统的鲲鹏CPU架构服务器吗？</span>
        </template>
        <div>
          不可以，暂不支持创建Windows操作系统的鲲鹏CPU架构服务器，也不支持使用Windows操作系统的镜像切换鲲鹏CPU架构服务器的操作系统。
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.architecture {
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
  .architecture-title {
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
