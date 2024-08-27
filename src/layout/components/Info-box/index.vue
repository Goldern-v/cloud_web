<template>
  <div v-for="(item, index) in list" :key="index + 'li'" class="infoBox">
    <div class="tltie">
      <div class="title-container">
        <img :src="getImageUrl(imgList[index])" />
        {{ item.title }}
      </div>
      <div class="dashed"></div>
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

const imgList = reactive([
  '../../../assets/department.png',
  '../../../assets/department-second.png'
])

const getImageUrl = (src: string) => {
  const img = new URL(src, import.meta.url).href
  return img
}
</script>

<style lang="scss" scoped>
.infoBox {
  margin-bottom: 10px;
  &:first-of-type {
    .tltie .title-container img {
      position: relative;
      top: 4px;
      height: 28px;
    }
  }
  &:nth-of-type(2) {
    .tltie .title-container img {
      height: 24px;
    }
  }
  .tltie {
    position: relative;
    height: 24px;
    margin-bottom: 8px;
    .dashed {
      content: '';
      position: absolute;
      width: 100%;
      height: 0;
      border-top: 1px dashed #e7e7e7;
      top: 50%;
    }
    .title-container {
      display: flex;
      align-items: center;
      padding: 0 6px;
      position: absolute;
      left: 0;
      top: 0;
      background-color: var(--el-bg-color-overlay);
      z-index: 1;
      margin-right: 5px;
      img {
        width: 25px;
        margin-right: 5px;
      }
    }
  }
  .infoItem {
    line-height: 22px;
    color: #666666;
  }
}
</style>
