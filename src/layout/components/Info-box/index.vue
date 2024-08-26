<template>
  <div v-for="(item, index) in list" :key="index + 'li'" class="infoBox">
    <div class="tltie">
      <el-divider content-position="left">{{ item.title }}</el-divider>
    </div>
    <div class="info-box">
      <div
        v-for="(li, liIn) in item.children"
        :key="liIn + 'lili'"
        class="infoItem"
      >
        {{ li }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ list: any[] }>(), {
  list: () => []
})
</script>

<style lang="scss" scoped>
.infoBox {
  margin-bottom: 10px;
  .tltie {
    font-size: 14px;
  }
  .infoItem {
    line-height: 1.5;
  }
}
</style>
