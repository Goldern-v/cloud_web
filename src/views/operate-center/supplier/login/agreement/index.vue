<template>
  <div class="agreement-container">
    <div class="agreement">
      <!-- 主标题 -->
      <h1 style="font-size: 18px">{{ mainContract.title }}</h1>
      <!-- 副标题 -->
      <h3>{{ mainContract.subtitle }}</h3>
      <!-- 条款内容 -->
      <div v-for="(item, index) in mainContract.contentList" :key="index">
        <!-- 条款主标题 -->
        <h4 v-if="item.title">{{ item.title }}</h4>
        <!-- 条款内容 -->
        <p style="text-indent: 2em">
          {{ item.term }}
          <!-- 跳转链接 -->
          <el-button
            type="primary"
            link
            style="padding: 0px"
            @click="open(item.url)"
            >{{ item.url }}</el-button
          >

          <span>{{ item.termTwo }}</span>
        </p>
        <!-- 条款二次细分 -->
        <div
          v-for="(e, idx) in item.additionalTerms"
          :key="idx"
          style="padding: 0 0 0 40px"
        >
          <!-- 条款次标题或内容 -->
          <p>{{ e.content }}</p>
          <!-- 具体条款 -->
          <div
            v-for="(ele, unit) in e.list"
            :key="unit"
            style="padding: 0 0 0 25px"
          >
            <p>{{ ele }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="appendix">
      <!-- 主标题 -->
      <h1 style="font-size: 18px">{{ appendix.title }}</h1>
      <!-- 副标题 -->
      <h3>{{ appendix.subtitle }}</h3>
      <!-- 条款内容 -->
      <div v-for="(item, index) in appendix.contentList" :key="index">
        <!-- 条款主标题 -->
        <h4 v-if="item.title">{{ item.title }}</h4>
        <!-- 条款内容 -->
        <p style="text-indent: 2em">{{ item.term }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mainContract, appendix } from './contract'
const open = (url: string) => {
  window.open(url)
}
</script>
<style scoped lang="scss">
.agreement-container {
  width: 100%;
  max-height: 100vh;
  overflow: auto;
  background: #f5f7fa;
  .agreement,
  .appendix {
    margin: 2% 5%;
    background: #fff;
    padding: 40px 40px;
    h1,
    h3 {
      text-align: center;
      margin-bottom: 20px;
    }
    p {
      font-size: 12px;
      line-height: 2.5;
      text-align: justify; /* 将段落文本超出一行时自动对齐 */
    }
  }
}
</style>
