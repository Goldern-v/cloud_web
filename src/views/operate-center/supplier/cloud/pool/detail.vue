<template>
  <div class="ideal-large-margin resource-pool-manage__detail">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="(item, index) of tabControllers"
        :key="index"
        :label="item.label"
        :name="item.name"
      >
      </el-tab-pane>
    </el-tabs>

    <component :is="tabs[activeName]"></component>
  </div>
</template>

<script setup lang="ts">
import publicGeneral from './public/general.vue'
import type { TabsPaneContext } from 'element-plus'

// 标签页组件
const tabs = shallowRef<any>({
  publicGeneral
})

onMounted(() => {
  initComponents()
})
const route = useRoute()
const cloudCategory = route.query.cloudCategory as string
const cloudType = route.query.cloudType as string
const initComponents = () => {
  // 公有云 阿里云
  const isPublicAliyun = RegExp(/ALI/).test(cloudType) && RegExp(/PUBLIC/).test(cloudCategory)
  // 公有云 亚马逊
  const isPublicAmazon = RegExp(/AWS/).test(cloudType) && RegExp(/PUBLIC/).test(cloudCategory)
  // 公有云 微软云
  const isPublicAzure = RegExp(/AZURE/).test(cloudType) && RegExp(/PUBLIC/).test(cloudCategory)
  // 公有云 谷歌云
  const isPublicGoogle = RegExp(/GOOGLE/).test(cloudType) && RegExp(/PUBLIC/).test(cloudCategory)
  // 公有云 zenlayer
  const isPublicZenlayer = RegExp(/ZENLAYER/).test(cloudType) && RegExp(/PUBLIC/).test(cloudCategory)

  if (isPublicAliyun || isPublicAmazon || isPublicAzure || isPublicGoogle || isPublicZenlayer) {
    activeName.value = 'publicGeneral'
    tabControllers.value[0].name = 'publicGeneral'
    active.value = publicGeneral
  }
}

const tabControllers = ref([
  { label: '概览', name: 'publicGeneral' }
])

const activeName = ref('publicGeneral')
const active = shallowRef<any>(publicGeneral)

const handleClick = (tab: TabsPaneContext, event: Event) => {
  active.value = tabs.value[tab.paneName!]
}

</script>

<style scoped lang="scss">
.resource-pool-manage__detail {
  box-sizing: border-box;
  background-color: white;
  :deep(.el-tabs__nav-wrap::after) {
    height: 0;
  }
  :deep(.el-tabs) {
    padding: 0 20px;
  }
}
</style>
