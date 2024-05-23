<template>
  <div class="resource-container">
    <div class="flex-row resource-zone">
      <div class="flex-row resource-zone-pre" @click="clickSwiperPre">
        <svg-icon icon="left-arrow" />
      </div>

      <swiper 
        :initial-slide="swiperIndex"
        :space-between="10"
        :lazy="true"
        :navigation="navigation"
        :modules="modules"
        @slideChange="onSlideChange">
        <swiper-slide v-for="(item,index) of dataArray" :key="index" >
          <div class="flex-column resource-zone-data">
            <div class="resource-zone-data-item">
              <div class="resource-zone-data-item-header">{{ item.topZone }}</div>

              <div class="flex-row flex-row-center" style="padding: $idealPadding;">
                <resource-zone-data :zone-data="cpuData"/>
                <el-divider direction="vertical" class="divider-vertical" />
                <resource-zone-data :zone-data="memoryData"/>
              </div>
            </div>

            <div class="resource-zone-data-item ideal-default-margin-top">
              <div class="resource-zone-data-item-header">{{ item.bottomZone }}</div>

              <div class="flex-row flex-row-center" style="padding: $idealPadding;">
                <resource-zone-data :zone-data="cpuData"/>
                <el-divider direction="vertical" class="divider-vertical" />
                <resource-zone-data :zone-data="memoryData"/>
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>

      <div class="flex-row resource-zone-next" @click="clickSwiperNext">
        <svg-icon icon="right-arrow" />
      </div>
    </div>

    <div class="flex-row pagination-box">
      <div class="pagination-box-current">当前{{ swiperIndex + 1}}页</div>
      <div class="pagination-box-total">/共32页</div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 资源概览-区域统计组件
*/
import ResourceZoneData from './resource-zone-data.vue'

import { Swiper, SwiperSlide} from 'swiper/vue'
import {Navigation} from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

// 前后按钮
const navigation = ref({
  nextEl: '.resource-zone-next',
  prevEl: '.resource-zone-pre'
})
// 需导入的轮博模块
const modules = [Navigation]
// 当前轮博索引
const swiperIndex = ref(0)
// 当前Slide切换到另一个Slide
const onSlideChange = (swiper: any) => {
  swiperIndex.value = swiper.activeIndex
}
const dataArray: any = ref([
  { topZone: 'zone1', bottomZone: 'zone2'},
  { topZone: 'zone3', bottomZone: 'zone4'},
  { topZone: 'zone5', bottomZone: 'zone6'},
  { topZone: 'zone7', bottomZone: 'zone8'},
  { topZone: 'zone9', bottomZone: 'zone10'},
  { topZone: 'zone11', bottomZone: 'zone12'},
  { topZone: 'zone13', bottomZone: 'zone14'},
  { topZone: 'zone15', bottomZone: 'zone16'}
])
// 上一页
const clickSwiperPre = () => {
  if (swiperIndex.value === 0) { return }
  swiperIndex.value--
}
// 下一页
const clickSwiperNext = () => {
  if (swiperIndex.value >= 3) { return }
  swiperIndex.value++
}

const cpuData = ref({
  label: 'CPU概览',
  totalIcon: 'cpu-total',
  total: '37843',
  unit: '核',
  allocIcon: 'alloc',
  alloc: '23871',
  rates: 45.34,
  ratesLabel: 'CPU分配率'
})

const memoryData = ref({
  label: '内存概览',
  totalIcon: 'memory-total',
  total: '40216',
  unit: 'GB',
  allocIcon: 'alloc',
  alloc: '30984',
  rates: 87.87,
  ratesLabel: '内存分配率'
})
</script>

<style scoped lang="scss">


$bgColor: #f7f8fa;
.flex-row-center {
  align-items: center;
}
.resource-container {
  width: 100%;
  .resource-zone {
    width: 100%;
    .resource-zone-pre,
    .resource-zone-next {
      background-color: $bgColor;
      padding: 0 5px;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .resource-zone-data {
      margin: 0 10px;
      .resource-zone-data-item {
        width: 100%;
        border: 1px solid #e5e6eb;
        border-radius: $circleRadiusSize;
        .resource-zone-data-item-header {
          background-color: $bgColor;
          padding: 10px;
          color: #1d2129;
          font-size: 16px;
          font-weight: 500;
        }
        .divider-vertical {
          height: 6em;
        }
      }
    }
  }
  .pagination-box {
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    .pagination-box-current,
    .pagination-box-total {
      color: #c70009;
      font-size: 12px;
      font-weight: 400;
    }
    .pagination-box-total {
      color: #86909c;
    }
  }
}
</style>
