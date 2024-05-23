<template>
  <el-alert
    class="alert-type"
    :title="alertProps.alertTitle"
    :type="alertProps.type"
    :closable="false"
    show-icon
  >
    <template #title>
      <div
        v-for="(alertItem, index) in alertProps.alertTitleList"
        :key="index"
        class="alert-item"
      >
        {{ alertItem }}
      </div>
    </template>
  </el-alert>
</template>

<script setup lang="ts">
interface IAlertProps {
  alertProps?: {
    alertTitleList?: string[]
    alertTitle?: string
    type?: string
  }
}

const props = withDefaults(defineProps<IAlertProps>(), {
  alertProps: () => ({
    alertTitleList: [],
    alertTitle: '',
    type: 'info'
  })
})
</script>

<style lang="scss" scoped>
.alert-type {
  align-items: center;
  width: auto;
  margin: 0 0 12px;
  flex: 0 0 auto; //解决列表页样式不对问题
  font-size: 12px;
  .alert-item {
    margin: 5px 0;
    color: black;
  }
  :deep .el-alert__title {
    font-size: 12px;
    color: #1d2129;
  }
  :deep .el-icon-info:before {
    color: var(--themeColor);
  }
  :deep .el-alert__content {
    display: flex;
    align-items: baseline;
    /* display: table-cell; */
    padding: 0 8px;
  }
}
</style>
