<template>
  <div class="illegal">
    <div class="illegal-title ideal-middle-margin-bottom">不合规资源统计</div>

    <div class="flex-row" style="align-items: center;">
      <div class="illegal-resource">
        <div class="flex-row illegal-resource-container">
          不合规数量
          <div class="flex-row" style="align-items: center;">
            <div class="illegal-resource-count illegal-resource-count-color">{{ disqualificationTotal }}</div>
            <div class="illegal-resource-count">/{{ total }}</div>
          </div>
        </div>
        <el-progress :stroke-width="16" :percentage="rate * 100">
          <el-button text></el-button>
        </el-progress>
      </div>

      <el-divider direction="vertical" />

      <div class="flex-row illegal-policy">
        <div class="flex-row illegal-policy-risk">
          <div
            v-for="(item, index) of policies"
            :key="index"
            class="flex-row illegal-policy-risk-item"
          >
            <svg-icon
              icon="risk-icon"
              class-name="risk-icon"
              :color="item.color"
              class="ideal-svg-margin-right"
            />
            <div class="flex-column">
              <div>{{ item.label }}</div>
              <div>{{ item.count }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { homeOptimization } from '@/api/java/home'

const policies = ref<any[]>([
  { label: '最高风险', key: 'highest', count: '0', color: '#D54941' },
  { label: '高风险', key: 'high', count: '0', color: '#FF7F22' },
  { label: '中风险', key: 'middle', count: '0', color: '#F5C352' },
  { label: '低风险', key: 'low', count: '0', color: '#8DA4C6' }
])

onMounted(() => {
  getOptimization()
})
const total = ref(0)
const disqualificationTotal = ref(0)
const rate = ref(0)
const getOptimization = () => {
  homeOptimization()
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        total.value = data.total
        disqualificationTotal.value = data.disqualificationTotal
        rate.value = data.rate

        policies.value.forEach((item: any) => {
          if (item.key === 'highest') {
            item.count = data.strategy.HIGHEST
          } else if (item.key === 'high') {
            item.count = data.strategy.HIGH
          } else if (item.key === 'middle') {
            item.count = data.strategy.MIDDLE
          } else if (item.key === 'low') {
            item.count = data.strategy.LOW
          }
        })
      } else {
        policies.value.forEach((item: any) => {
          item.count = 0
        })
      }
    })
    .catch(_ => {
      policies.value.forEach((item: any) => {
        item.count = 0
      })
    })
}
</script>

<style scoped lang="scss">
.illegal {
  background-color: white;
  padding: $idealPadding;
  align-items: flex-start;
  .illegal-resource {
    width: 30%;
    .illegal-resource-container {
      justify-content: space-between;
      padding-right: 10px;
      .illegal-resource-count {
        font-size: $mediumFontSize;
      }
      .illegal-resource-count-color {
        color: var(--el-color-primary);
      }
    }
  }
  .illegal-policy {
    width: calc(70% - 20px - 10px);
    margin-left: 10px;
    .illegal-policy-risk {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      .illegal-policy-risk-item {
        width: 20%;
        align-items: center;
        background-color: #f9f9f9;
        border-radius: $circleRadiusSize;
        padding: 10px;
      }
    }
  }
  .illegal-title {
    font-size: $mediumFontSize;
    font-weight: 500;
  }
  :deep(.el-divider--vertical) {
    height: 40px;
  }
  :deep(.risk-icon) {
    width: 24px;
    height: 24px;
  }
}
</style>
