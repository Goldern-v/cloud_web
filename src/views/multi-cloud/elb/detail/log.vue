<template>
  <div class="access-log">
    <div class="flex-row custom-warning-box">
      <svg-icon
        icon="info-warning"
        color="var(--el-color-primary)"
        class="ideal-svg-margin-right"
      ></svg-icon>
      <span
        >七层独享型负均衡和七层共享型负均衡支持此功能，四层独享型负载均衡和四层共享型负均衡不支持。<span
          style="color: var(--el-color-primary)"
          >访问日志使用指南</span
        ></span
      >
    </div>
    <div class="log-container">
      <el-row>
        <el-col :span="8"><div>日志组</div></el-col>
        <el-col :span="8"><div>日志流</div></el-col>
        <el-col :span="8"
          ><div
            style="color: var(--el-color-primary); cursor: pointer"
            @click="configLog"
          >
            配置访问日志
          </div></el-col
        >
      </el-row>
    </div>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import { OperateEventEnum } from '@/utils/enum'
import dialogBox from '../dialog-box.vue'
/**
 * 弹窗
 */
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
}

const configLog = () => {
  showDialog.value = true
  dialogType.value = OperateEventEnum.config
}
</script>

<style scoped lang="scss">
.access-log {
  margin: $idealMargin 0;
  background-color: #fff;
  padding: $idealPadding;
  .custom-warning-box {
    background-color: var(--custom-information-bg-color);
    padding: 10px 20px;
    align-items: center;
  }
  .log-container {
    border-radius: $circleRadiusSize;
    background-color: $gray1-light;
    align-items: center;
    padding: 15px;
    margin: 20px 0;
  }
}
</style>
