<template>
  <el-footer height="74px" class="price-footer__container">
    <div class="left">
      <div>
        <span>配置费用:</span>
        <span class="show-price"
          >{{ price.toFixed(2) }}元{{ onDemand ? '/小时' : '' }}</span
        >
      </div>
    </div>
    <div class="right">
      <el-button type="primary" @click="handleComplete">{{
        submitTitle
      }}</el-button>
    </div>
  </el-footer>
</template>

<script setup lang="ts" name="priceInfo">
/**
 * 底部价格信息视图
 */
interface PriceInfo {
  onDemand: boolean
  price: number
  submitTitle?: string
}

withDefaults(defineProps<PriceInfo>(), {
  submitTitle: '立即创建'
})

enum EventType {
  complete = 'clickComplete'
}
interface EventEmits {
  (e: EventType.complete): void
}
const emit = defineEmits<EventEmits>()

const handleComplete = () => {
  emit(EventType.complete)
}
</script>

<style lang="scss" scoped>
.price-footer__container {
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  background: #fff;
  z-index: 2000;
  box-shadow: 0 5px 17px 9px #e5e9ea;
  text-align: center;
  overflow: hidden;
  .left {
    float: left;
    margin: 30px 20px;
    color: #999;
    font-size: 12px;
    line-height: 24px;
    display: flex;
    span {
      vertical-align: baseline;
    }
  }
  .right {
    float: right;
    margin: 30px 20px;
  }
  .show-price {
    color: #f60;
    font-size: 24px;
  }
}
</style>
