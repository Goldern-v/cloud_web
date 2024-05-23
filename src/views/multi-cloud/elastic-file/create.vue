<template>
  <div class="create">
    <create-form v-show="stepsIndex === 0" ref="basicConfigRef"/>

    <create-confirm v-show="stepsIndex === 1" :info="orderInfo.basic"/>

    <price-info
      :steps-index="stepsIndex"
      @clickPrevious="clickPrevious"
      @clickNext="clickNext"
    />
  </div>
</template>

<script setup lang="ts">
import createForm from './components/create-form.vue'
import createConfirm from './components/create-confirm.vue'
import priceInfo from './components/price-info.vue'
import { showLoading, hideLoading } from '@/utils/tool'

const basicConfigRef = ref()
const orderInfo: any = reactive({})
onMounted(() => {
  orderInfo.basic = basicConfigRef.value.form
})

const stepsIndex = ref(0)
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
  if (stepsIndex.value === 1) {
    showLoading()
    setTimeout(() => {
      hideLoading()
    }, 2000)
  }
  stepsIndex.value++
}

</script>

<style scoped lang="scss">
.create {
  margin: $idealMargin $idealMargin 80px;
  :deep(.el-form) {
    padding: 0;
  }
  :deep(.el-card__body) {
    padding: 20px 20px 0;
  }
  .tag-box {
    margin-bottom: 10px;
  }
}
</style>
