<template>
  <div class="add-listener">
    <ideal-horizontal-steps
      class="add-listener-steps"
      :data-array="stepsArray"
      :current-step="stepsIndex"
    />

    <config-listener v-show="stepsIndex === 0"> </config-listener>
    <allocate-strategy v-show="stepsIndex === 1"></allocate-strategy>
    <back-end-server v-show="stepsIndex === 2"></back-end-server>
    <confirm-config v-show="stepsIndex === 3"></confirm-config>
    <progress-footer
      :steps-index="stepsIndex"
      @clickPrevious="clickPrevious"
      @clickNext="clickNext"
      @clickComplete="clickComplete"
    ></progress-footer>
  </div>
</template>

<script setup lang="ts">
import configListener from './config-listener.vue'
import allocateStrategy from './allocate-strategy.vue'
import backEndServer from './back-end-server.vue'
import confirmConfig from './confirm-config.vue'
import progressFooter from './progress-footer.vue'
import type { IdealSteps } from '@/types'

const stepsIndex = ref(0)
const stepsArray: IdealSteps[] = [
  { title: '配置监听器' },
  { title: '配置后端分配策略' },
  { title: '添加后端服务器' },
  { title: '确认配置' }
]
const clickPrevious = () => {
  if (stepsIndex.value === 1) {
    return
  }
  stepsIndex.value--
}
const clickNext = async () => {
  stepsIndex.value++
  console.log(stepsIndex.value, '-----------')
}

const clickComplete = () => {}
</script>

<style scoped lang="scss">
:deep(.el-step__title.is-success) {
  color: var(--el-color-primary);
}

:deep(.el-step__head.is-success) {
  color: var(--el-color-primary);
  border-color: var(--el-color-primary);
}
.add-listener {
  box-sizing: border-box;
  margin: $idealMargin $idealMargin 80px;
  .add-listener-steps {
    margin-bottom: 20px;
  }
}
</style>
