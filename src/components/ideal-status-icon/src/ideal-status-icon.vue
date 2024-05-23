<template>
  <div class="status-icon" :style="alignStyle">
    <i
      v-if="isIconFont"
      class="iconfont"
      :class="[statusIcon ? `module-${statusIcon}` : '']"
    ></i>
    <svg-icon v-else :icon="statusIcon" :class-name="statusIcon"/>
    <span class="status-text">{{ statusText }}</span>
  </div>
</template>

<script setup lang="ts" name="IdealStatusIcon">
/**
 * 状态
 */
interface IdealStatusIcon {
  statusIcon?: string // 状态图标
  statusText?: string // 状态值
  statusAlign?: string // 状态值局左、中、右
}
const props = withDefaults(defineProps<IdealStatusIcon>(), {
  statusIcon: '',
  statusText: '',
  statusAlign: 'left'
})
// 显示风格
const alignStyle = ref()
onMounted(() => {
  if (props.statusAlign === 'center') {
    alignStyle.value = {
      'justify-content': 'center'
    }
  } else if (props.statusAlign === 'left') {
    alignStyle.value = {
      'justify-content': 'flex-start'
    }
  } else if (props.statusAlign === 'right') {
    alignStyle.value = {
      'justify-content': 'flex-end'
    }
  }
})
const isIconFont = computed(() => ['success', 'start', 'warning', 'fail', 'banding', 'shutdown', 'loading'].includes(props.statusIcon))

</script>

<style scoped lang="scss">
@keyframes loading {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.status-icon {
  display: flex;
  flex-direction: row;
  align-items: center;

  .iconfont {
    font-size: 18px;
    &.module-success {
      color: $success6-light;
    }
    &.module-start {
      color: $success5-light;
    }
    &.module-warning {
      color: $warning6-light;
    }
    &.module-fail {
      color: $error6-light;
    }
    &.module-banding {
      color: $warning4-light;
    }
    &.module-shutdown {
      color: $gray6-light;
    }
    &.module-loading {
      color: $warning4-light;
      animation: loading 1s infinite linear;
    }
  }
  .status-text {
    margin-left: 6px;
  }
  .flex-row-center {
    align-items: center;
    justify-content: center;
  }
  :deep(.status-success) {
    color: $success5-light;
  }
  :deep(.status-error) {
    color: $error6-light;
  }
  :deep(.status-exception) {
    color: $warning5-light;
  }
}
</style>
