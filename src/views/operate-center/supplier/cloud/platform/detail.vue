<template>
  <div class="ideal-large-margin cloud-platform-manage__detail">
    <el-tabs
      v-model="activeName"
      class="cloud-platform-manage__tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane
        v-for="(item, index) of tabControllers"
        :key="index"
        :label="item.label"
        :name="item.name"
      >
      </el-tab-pane>
    </el-tabs>

    <component :is="active"></component>
  </div>
</template>

<script setup lang="ts">
import publicAliyun from './public/aliyun.vue'
import publicAmazon from './public/amazon.vue'
import publicAzure from './public/azure.vue'
import publicGoogle from './public/google.vue'
import publicZenlayer from './public/zenlayer.vue'
import resourcePool from './components/resource-pool.vue'
import type { TabsPaneContext } from 'element-plus'

// 标签页组件
const tabs = shallowRef<any>({
  publicAliyun,
  publicAmazon,
  publicAzure,
  publicGoogle,
  publicZenlayer,
  resourcePool
})

onMounted(() => {
  initComponents()
})
const route = useRoute()
const cloudCategory = route.query.cloudCategory as string
const cloudType = route.query.cloudType as string
const initComponents = () => {
  // 公有云 阿里云
  const isPublicAliyun =
    RegExp(/ALI/).test(cloudType) && RegExp(/PUBLIC/).test(cloudCategory)
  // 公有云 亚马逊
  const isPublicAmazon =
    RegExp(/AWS/).test(cloudType) && RegExp(/PUBLIC/).test(cloudCategory)
  // 公有云 微软云
  const isPublicAzure =
    RegExp(/AZURE/).test(cloudType) && RegExp(/PUBLIC/).test(cloudCategory)
  // 公有云 谷歌云
  const isPublicGoogle =
    RegExp(/GOOGLE/).test(cloudType) && RegExp(/PUBLIC/).test(cloudCategory)
  // 公有云 zenlayer
  const isPublicZenlayer =
    RegExp(/ZENLAYER/).test(cloudType) && RegExp(/PUBLIC/).test(cloudCategory)

  if (isPublicAliyun) {
    activeName.value = 'publicAliyun'
    tabControllers.value[0].name = 'publicAliyun'
    active.value = publicAliyun
  } else if (isPublicAmazon) {
    activeName.value = 'publicAmazon'
    tabControllers.value[0].name = 'publicAmazon'
    active.value = publicAmazon
  } else if (isPublicAzure) {
    activeName.value = 'publicAzure'
    tabControllers.value[0].name = 'publicAzure'
    active.value = publicAzure
  } else if (isPublicGoogle) {
    activeName.value = 'publicGoogle'
    tabControllers.value[0].name = 'publicGoogle'
    active.value = publicGoogle
  } else if (isPublicZenlayer) {
    activeName.value = 'publicZenlayer'
    tabControllers.value[0].name = 'publicZenlayer'
    active.value = publicZenlayer
  }
}

const tabControllers = ref([
  { label: '概览', name: 'publicAliyun' }
  // { label: '资源池', name: 'resourcePool' }  //2.0不展示资源池
])

const activeName = ref('publicAliyun')
const active = shallowRef<any>(publicAliyun)

const handleClick = (tab: TabsPaneContext, event: Event) => {
  active.value = tabs.value[tab.paneName!]
}
</script>

<style scoped lang="scss">
.cloud-platform-manage__detail {
  box-sizing: border-box;
  background-color: white;
  :deep(.el-tabs__nav-wrap::after) {
    height: 0;
  }
  .cloud-platform-manage__tabs {
    padding: 20px 20px 0;
  }
  :deep(.el-tabs__header) {
    margin: 0;
  }
}
</style>
