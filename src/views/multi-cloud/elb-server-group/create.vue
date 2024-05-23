<template>
  <div class="server-group-container">
    <ideal-horizontal-steps
      class="server-group-create-steps"
      :data-array="stepsArray"
      :current-step="stepsIndex"
    />

    <config-strategy
      v-show="stepsIndex === 0"
      ref="strategyRef"
    ></config-strategy>

    <back-end-server v-show="stepsIndex === 1" ref="serverRef">
    </back-end-server>

    <confirm-config
      v-show="stepsIndex === 2"
      :config-info="orderInfo"
    ></confirm-config>

    <progress-footer
      :steps-index="stepsIndex"
      @clickPrevious="clickPrevious"
      @clickNext="clickNext"
    >
    </progress-footer>
  </div>
</template>

<script setup lang="ts">
import type { IdealSteps } from '@/types'
import configStrategy from './components/config-strategy.vue'
import backEndServer from './components/back-end-server/index.vue'
import confirmConfig from './components/confirm-config.vue'
import progressFooter from './components/progress-footer.vue'

const stepsIndex = ref(0)
const stepsArray: IdealSteps[] = [
  { title: '配置后端分配策略' },
  { title: '添加后端服务器' },
  { title: '确认配置' }
]

const strategyRef = ref()
const orderInfo: any = reactive({})
onMounted(() => {
  orderInfo.strategy = strategyRef.value.form
})

const clickPrevious = () => {
  if (stepsIndex.value === 0) {
    return
  }
  stepsIndex.value--
}
const clickNext = () => {
  if (stepsIndex.value === 2) {
    return
  }
  stepsIndex.value++
}
</script>

<style scoped lang="scss">
.server-group-container {
  margin: $idealMargin $idealMargin 80px;
  .server-group-create-steps {
    margin-bottom: 20px;
  }
}
</style>
