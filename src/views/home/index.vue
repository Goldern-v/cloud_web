<template>
  <div class="ideal-large-margin home">
    <el-scrollbar>
      <div class="flex-row" style="width: 100%;">
        <left class="home-left"/>
        <right class="home-right"/>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import left from './left.vue'
import right from './right.vue'
</script>

<style scoped lang="scss">
.home {
  box-sizing: border-box;
  flex:1;
  .home-left {
    width: 70%;
  }
  .home-right {
    width: 30%;
  }
}
</style>