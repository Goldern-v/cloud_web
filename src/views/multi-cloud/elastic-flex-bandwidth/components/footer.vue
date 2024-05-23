<template>
  <el-footer :class="showSidebar ? 'price-footer':'price-footer-small'">
    <div class="flex-row price-footer-box">
      <el-button type="primary" @click="handleCreate"
          >立即创建</el-button
        >
    </div>
  </el-footer>
</template>

<script setup lang="ts">
import store from '@/store'

const showSidebar = computed(() => store.appStore.sidebarOpened)

enum EventType {
  create = 'clickCreateEvent'
}
interface EventEmits {
  (e: EventType.create): void
}
const emit = defineEmits<EventEmits>()
const handleCreate = () => {
  emit(EventType.create)
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
    height: 100%;
    justify-content: flex-end;
    align-items: center;
  }
}
.price-footer-small {
  width: calc(100% - $sidebarSmallWidth);
  left: $sidebarSmallWidth;
}
</style>
