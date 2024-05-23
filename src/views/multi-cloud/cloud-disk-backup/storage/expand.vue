<template>
  <div class="expand">
    <expand-form v-show="stepsIndex === 1"/>
    <expand-confirm v-show="stepsIndex === 2"/>
    <div v-if="stepsIndex === 3" class="flex-column complete-container">
      <div>{{ submitMsg }}</div>
      <div>
        页面将于<span>{{ countDown }}</span
        >秒后返回
      </div>
    </div>

    <price-info
      :steps-index="stepsIndex"
      @clickPrevious="clickPrevious"
      @clickNext="clickNext"
    >
    </price-info>
  </div>
</template>

<script setup lang="ts">
import expandForm from './components/expand-form.vue'
import expandConfirm from './components/expand-confirm.vue'
import priceInfo from './components/price-info.vue'

const stepsIndex = ref(1)
const clickPrevious = () => {
  if (stepsIndex.value === 1) {
    return
  }
  stepsIndex.value--
}
const clickNext = () => {
  if (stepsIndex.value === 3) {
    return
  }
  if (stepsIndex.value === 2) {
    timerHandler()
  }
  stepsIndex.value++
}
const submitMsg = ref('云硬盘备份存储库“dds-324mkj”扩容成功')
const countDown = ref(5)
const router = useRouter()
// 计时器处理器
const timerHandler = () => {
  const timer = setInterval(() => {
    if (countDown.value > 1) {
      countDown.value--
    } else {
      router.push({ path: '/multi-cloud/cloud-disk-backup/index' })
      clearInterval(timer)
    }
  }, 1000)
}
</script>

<style scoped lang="scss">
.expand {
  width: 100%;
  .complete-container {
    margin: 100px 0;
    align-items: center;
    justify-content: center;
  }
}
</style>
