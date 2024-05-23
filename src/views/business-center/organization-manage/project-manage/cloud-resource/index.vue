<template>
  <div class="cloud-resource">
    <div class="cloud-resource-box">
      <div class="cloud-resource-box-total">
        <div v-for="(item, index) of totalImgList" :key="index" class="flex-row total-item">
          <el-image :src="item.img" style="margin-right: 10px;"></el-image>
          <div class="flex-column">
            <div class="total-item-title">{{ item.label }}</div>
            <div class="total-item-number">12<span class="total-item-unit">{{ item.unit }}</span></div>
          </div>
        </div>
      </div>

      <div class="flex-row header__title">
        <el-divider direction="vertical" />
        <div>计算</div>
      </div>

      <div class="cloud-resource-box-type">
        <div v-for="(item, index) of computeList" :key="index" class="flex-column type-item">
          <div class="flex-row type-item-content">
            <div class="flex-column">
              <div class="type-item-content-label">{{ item.label }}</div>
              <div class="type-item-content-number">12</div>
            </div>
            <div class="type-item-content-icon"><svg-icon :icon="item.icon" color="#25314C"></svg-icon></div>
          </div>
          
          <el-divider />

          <div class="flex-row type-item-content">
            <div class="type-item-content-label" style="color: #5E5E5E;">查看详情</div>
            <svg-icon icon="right-arrow"></svg-icon>
          </div>
        </div>
      </div>

      <div class="flex-row header__title">
        <el-divider direction="vertical" />
        <div>存储</div>
      </div>

      <div class="cloud-resource-box-type">
        <div v-for="(item, index) of storeList" :key="index" class="flex-column type-item">
          <div class="flex-row type-item-content">
            <div class="flex-column">
              <div class="type-item-content-label">{{ item.label }}</div>
              <div class="type-item-content-number">12</div>
            </div>
            <div class="type-item-content-icon"><svg-icon :icon="item.icon" color="#25314C"></svg-icon></div>
          </div>
          
          <el-divider />

          <div class="flex-row type-item-content">
            <div class="type-item-content-label" style="color: #5E5E5E;">查看详情</div>
            <svg-icon icon="right-arrow"></svg-icon>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-row footer-button">
      <el-button type="primary" @click="submitForm">{{ t('save') }}</el-button>
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">

const cpuTotalImg = new URL('@/assets/cloud-resource-cpu-total.png', import.meta.url).href
const diskTotalImg = new URL('@/assets/cloud-resource-disk-total.png', import.meta.url).href
const hostsTotalImg = new URL('@/assets/cloud-resource-hosts-total.png', import.meta.url).href
const memoryTotalImg = new URL('@/assets/cloud-resource-memory-total.png', import.meta.url).href
const systemTotalImg = new URL('@/assets/cloud-resource-system-total.png', import.meta.url).href
const unmountedTotalImg = new URL('@/assets/cloud-resource-unmounted-total.png', import.meta.url).href

const { t } = useI18n()

// 总量统计
const totalImgList = [
  { img: hostsTotalImg, label: '主机数量', unit: '核' },
  { img: cpuTotalImg, label: 'CPU总核数', unit: '核' },
  { img: memoryTotalImg, label: '内存总量', unit: 'G' },
  { img: systemTotalImg, label: '系统盘总量', unit: 'G' },
  { img: diskTotalImg, label: '磁盘数量', unit: '个' },
  { img: diskTotalImg, label: '磁盘总容量', unit: 'G' },
  { img: unmountedTotalImg, label: '挂载/未挂载数', unit: '个' }
]
// 计算
const computeList = [
  { icon: 'cloud-host', label: '弹性云主机' },
  { icon: 'cloud-host-snapshot', label: '云主机快照' },
  { icon: 'elastic-scaling', label: '弹性伸缩' }
]
// 存储
const storeList = [
  { icon: 'cloud-disk', label: '云硬盘' },
  { icon: 'cloud-disk-snapshot', label: '云硬盘快照' },
]
const router = useRouter()
const submitForm = () => {}
const cancelForm = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.cloud-resource {
  width: 100%;
  .cloud-resource-box {
    width: 100%;
    background-color: white;
    .cloud-resource-box-total, .cloud-resource-box-type {
      padding: 10px;
      width: calc(100% - 20px);
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      .total-item {
        background: url('@/assets/cloud-resource-background.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        margin: 10px;
        padding: 10px;
        width: calc(25% - 40px);
        justify-content: flex-start;
        align-items: center;
        .total-item-title {
          font-size: 14px;
          font-weight: 600;
          color: #000;
        }
        .total-item-number {
          font-size: 36px;
          font-weight: 700;
          color: var(--el-color-primary);
          .total-item-unit {
            margin-left: 10px;
            font-size: 14px;
            font-weight: 600;
            color: #8B8B8B;
          }
        }
      }
      .type-item {
        background-color: $gray1-light;
        border-radius: $circleRadiusSize;
        margin: 10px;
        padding: 10px 20px;
        width: calc(20% - 60px);
        justify-content: center;
        align-items: flex-start;
        .type-item-content {
          align-items: flex-start;
          justify-content: space-between;
          width: 100%;
          .type-item-content-label {
            font-size: 14px;
            font-weight: 400;
          }
          .type-item-content-number {
            font-size: 24px;
            font-weight: 700;
          }
          .type-item-content-icon {
            :deep(.svg-icon svg) {
              width: 24px;
              height: 24px;
            }
          }
        }
      }
    }
    .header__title {
      background-color: var(--el-color-primary-light-9);
      margin: 0 20px;
      height: $headerContainerHeight;
      line-height: $headerContainerHeight;
      align-items: center;
      // 修改分割线颜色
      :deep(.el-divider--vertical) {
        border-left: 2px var(--el-color-primary) solid;
      }
    }
  }
  .footer-button {
    margin-top: 5px;
    padding: 20px;
    background-color: white;
    justify-content: flex-start;
    align-items: center;
  }
}
</style>
