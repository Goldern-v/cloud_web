<template>
  <div class="optimization">
    <div class="optimization-title">云主机优化建议</div>

    <div class="flex-row optimization-container">
      <div
        v-for="(item, index) of serviceList"
        :key="index"
        class="flex-column optimization-item"
        :style="{ background: item.background }"
      >
        <div class="flex-row" style="justify-content: space-between">
          <div>
            <div class="optimization-label" :style="{ color: item.color }">
              {{ item.label }}
            </div>
            <div class="optimization-count">{{ item.count }}</div>
          </div>

          <svg-icon
            :icon="item.icon"
            :color="item.iconColor"
            class="optimization-svg ideal-svg-margin-right"
            class-name="optimization-svg"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { homeOptimization } from '@/api/java/home'

onMounted(() => {
  getOptimization()
})
const getOptimization = () => {
  homeOptimization()
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        serviceList.value.forEach((item: any) => {
          if (item.key === 'down') {
            item.count = data.suggest.DOWNSIZING
          } else if (item.key === 'upgrade') {
            item.count = data.suggest.UPGRADING
          } else if (item.key === 'changeBill') {
            item.count = data.suggest.CHANGE_BILL_MODE
          } else if (item.key === 'recycle') {
            item.count = data.suggest.RECYCLE
          }
        })
      } else {
        serviceList.value.forEach((item: any) => {
          item.count = 0
        })
      }
    })
    .catch(_ => {
      serviceList.value.forEach((item: any) => {
        item.count = 0
      })
    })
}

const serviceList = ref([
  {
    label: '建议降配',
    icon: 'downsizing',
    key: 'down',
    count: '0',
    color: '#C26440',
    iconColor: '#EBCCBD',
    background: 'linear-gradient(to right, #FCEDE2, #FDF7F4)'
  },
  {
    label: '建议升配',
    icon: 'upgrading',
    key: 'upgrade',
    count: '0',
    color: '#C0812F',
    iconColor: '#EDCE84',
    background: 'linear-gradient(to right, #FDF8E8, #FFFCF4)'
  },
  {
    label: '建议回收',
    icon: 'recycle',
    key: 'recycle',
    count: '0',
    color: '#4A8C85',
    iconColor: '#9CDAC9',
    background: 'linear-gradient(to right, #DFF9F3, #F2FBF9)'
  },
  {
    label: '建议更改付费方式',
    icon: 'change-payment',
    key: 'changeBill',
    count: '0',
    color: '#3A6BB9',
    iconColor: '#AAC4EA',
    background: 'linear-gradient(to right, #D2E1F7, #F5F9FE)'
  }
])
</script>

<style scoped lang="scss">
$labelColor: #1d2129;
.optimization {
  background-color: white;
  align-items: center;
  padding: $idealPadding;
  .optimization-title {
    margin-right: 10px;
    color: $labelColor;
    font-weight: 500;
    font-size: $mediumFontSize;
  }
  .optimization-container {
    width: 100%;
    justify-content: space-around;
    align-items: center;
    .optimization-item {
      width: calc(25% - 30px);
      padding: 10px;
      margin-top: 10px;
      border-radius: $circleRadiusSize;
      .optimization-count {
        font-size: $largeFontSize;
        font-weight: 500;
      }
    }
    .optimization-label {
      color: $labelColor;
      font-weight: 400;
      font-size: $defaultFontSize;
    }
  }
  :deep(.optimization-svg) {
    width: 32px;
    height: 32px;
  }
}
</style>
