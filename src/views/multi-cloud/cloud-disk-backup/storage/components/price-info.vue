<template>
  <el-footer :class="showSidebar ? 'price-footer':'price-footer-small'">
    <div class="flex-row price-footer-box">
      <div class="flex-row price-footer-box--item">
        <div>{{ title }}</div>
        <div class="show-price">
          ¥{{ price.toFixed(2) }}元{{ onDemand ? '/小时' : '' }}
        </div>
        <el-tooltip
          popper-class="custom-tooltip"
          effect="dark"
          :content="title"
          placement="right"
        >
          <svg-icon icon="question-icon"></svg-icon>
        </el-tooltip>
      </div>

      <div class="flex-row price-footer-box--item">
        <el-button
          v-if="stepsIndex === 2"
          type="primary"
          @click="handlePrevious"
          >上一步</el-button
        >
        <el-button v-if="stepsIndex !== 3" type="primary" @click="handleNext"
          >{{ submitTitle }}</el-button
        >
      </div>
    </div>
  </el-footer>
</template>

<script setup lang="ts" name="priceInfo">
import store from '@/store'

interface PriceInfo {
  onDemand?: boolean
  stepsIndex?: number
  title?: string
  submitTitle?: string
}

withDefaults(defineProps<PriceInfo>(), {
  onDemand: false,
  stepsIndex: 1,
  title: '扩容后费用',
  submitTitle: '立即申请'
})

const showSidebar = computed(() => store.appStore.sidebarOpened)

const price = ref(0)

enum EventType {
  previous = 'clickPrevious',
  next = 'clickNext',
  complete = 'clickComplete'
}
interface EventEmits {
  (e: EventType.previous): void
  (e: EventType.next): void
  (e: EventType.complete): void
}
const emit = defineEmits<EventEmits>()
// 上一步
const handlePrevious = () => {
  emit(EventType.previous)
}
// 下一步
const handleNext = () => {
  emit(EventType.next)
}
</script>

<style lang="scss" scoped>
$bottomHeight: 60px;
.price-footer, .price-footer-small {
  position: fixed;
  width: calc(100% - $sidebarWidth);
  bottom: 0;
  left: $sidebarWidth;
  background: #fff;
  z-index: 2000;
  box-shadow: 5px 5px 17px 9px #e5e9ea;
  text-align: center;
  overflow: hidden;
  height: $bottomHeight;
  line-height: $bottomHeight;
  .price-footer-box {
    justify-content: space-between;
    align-items: center;
    .price-footer-box--item {
      justify-content: flex-start;
      align-items: center;
      .show-price {
        color: var(--el-color-primary);
        font-size: 18px;
        margin-right: 10px;
      }
    }
  }
  .left {
    float: left;
    margin: 30px 20px;
    color: #000;
    font-size: 14px;
    line-height: 24px;
    display: flex;
    span {
      vertical-align: baseline;
    }
    .num-units {
      margin: 0 10px;
    }
  }
  .right {
    float: right;
    margin: 30px 20px;
  }
}
.price-footer-small {
  width: calc(100% - $sidebarSmallWidth);
  left: $sidebarSmallWidth;
}
</style>
