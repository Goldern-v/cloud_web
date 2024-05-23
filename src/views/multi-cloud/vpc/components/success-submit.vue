<template>
  <div class="success-submit flex-column">
    <div class="flex-column complete-container">
      <img :src="checkSuccess" alt="" />
      <div style="font-size: 14px; font-weight: bold">{{ submitMsg }}</div>
      <div class="ideal-tip-text" style="font-weight: normal">
        页面将于<span class="count-down">{{ countDown }}</span
        >秒后返回
      </div>
      <el-button type="primary" @click="goBack">{{ t('back') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface IdealSuccessSUbmitProps {
  submitMsg?: string
}

const props = withDefaults(defineProps<IdealSuccessSUbmitProps>(), {
  submitMsg: '提交成功'
})

const { t } = useI18n()

const checkSuccess = new URL('@/assets/check-success.png', import.meta.url).href
// 计时器
const timer = ref<any>(null)
// 开启计时器
const startTimer = () => {
  timer.value = setInterval(() => {
    countDown.value--
  }, 1000)
}

const countDown = ref(5)
const router = useRouter()
watch(countDown, value => {
  if (value === 0) {
    clearInterval(timer.value)
    timer.value = null
    router.back()
  }
})

const goBack = () => {
  router.back()
}

defineExpose({
  startTimer
})
</script>

<style scoped lang="scss">
.success-submit {
  height: calc(100vh - var(--breadcrumb-height) - 140px);
  justify-content: center;
  .complete-container {
    align-items: center;
    justify-content: center;
    img {
      margin-bottom: 20px;
    }
    div {
      line-height: 50px;
    }
  }
  .count-down {
    color: var(--el-color-primary);
    margin: 0 5px;
  }
}
</style>
