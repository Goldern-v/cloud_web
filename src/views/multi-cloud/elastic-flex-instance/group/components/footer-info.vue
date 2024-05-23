<template>
  <el-footer height="60px" :class="showSidebar ? 'price-footer' : 'price-footer-small'">
    <div class="flex-row price-footer-box">
      <div class="flex-row price-footer-box--item">
        <div>配置费用：</div>
        <div class="show-price">
          ¥{{ price }}元/小时
        </div>
      </div>

      <div class="flex-row price-footer-box--item">
        <el-button
          type="primary"
          @click="handleComplete"
          >确认配置信息</el-button
        >
      </div>
    </div>
  </el-footer>
</template>

<script setup lang="ts" name="priceInfo">
import store from '@/store'

const showSidebar = computed(() => store.appStore.sidebarOpened)

const price = ref(0)

enum EventType {
  complete = 'clickComplete'
}
interface EventEmits {
  (e: EventType.complete): void
}
const emit = defineEmits<EventEmits>()
// 完成
const handleComplete = () => {
  emit(EventType.complete)
}

</script>

<style lang="scss" scoped>
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
  .price-footer-box {
    height: 60px;
    line-height: 60px;
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
