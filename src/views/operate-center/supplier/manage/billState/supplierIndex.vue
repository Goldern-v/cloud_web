<template>
  <div class="index_container flex_center">
    <div class="index_item flex_column">
      <div class="flex_between">
        <img src="@/assets/income_top.png" alt="" />
        <div class="flex_column">
          <span class="font_size">端口收入</span>
          <span>{{ portData }}￥</span>
        </div>
      </div>
      <div class="flex_between">
        <img src="@/assets/income_bot.png" alt="" />
        <div class="flex_column">
          <span class="font_size">线路收入</span>
          <span>{{ lineData }}￥</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
// 属性值
interface PortProps {
  pieData?: any
}
const props = withDefaults(defineProps<PortProps>(), {
  pieData: null
})

const portData = ref(0)
const lineData = ref(0)

watch(
  () => props.pieData,
  val => {
    if (val.length > 0) {
      val.forEach((item: any) => {
        if (item.key === 'LINE') {
          lineData.value = item.value
        } else if (item.key === 'LINE') {
          portData.value = item.value
        }
      })
    }
  },
  { immediate: true }
)
</script>
<style lang="scss" scoped>
.index_container {
  margin: 20px 0;
  .index_item {
    width: 80%;
    height: 220px;
    img {
      width: 80px;
      height: 80px;
    }
  }
}
.flex_center {
  display: flex;
  justify-content: center;
}
.flex_between {
  display: flex;
  justify-content: space-between;
}
.flex_column {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.font_size {
  font-size: 16px;
}
</style>
