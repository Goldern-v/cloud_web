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
import publicHuaweiCloud from './public/huawei-cloud.vue'
import publicCtyun from './public/ctyun.vue'
import publicAliyun from './public/aliyun.vue'
import publicTencent from './public/tencent.vue'
import publicAmazon from './public/amazon.vue'
import publicZenlayer from './public/zenlayer.vue'
import privateVmware from './private/vmware.vue'
import privateHuawei from './private/huawei.vue'
import computeResource from './components/compute-resource.vue'
import storageResource from './components/storage-resource.vue'
import networkResource from './components/network-resource.vue'
import resourceSynchronization from './components/resource-synchronization.vue'
import { useCommon } from './components/common'
import type { TabsPaneContext } from 'element-plus'

// 标签页组件
const tabs = shallowRef<any>({
  publicHuaweiCloud,
  publicAliyun,
  publicTencent,
  publicCtyun,
  publicAmazon,
  publicZenlayer,
  privateVmware,
  privateHuawei,
  computeResource,
  storageResource,
  networkResource,
  resourceSynchronization
})
const {
  isPublicHuawei,
  isPublicCtyun,
  isPublicAli,
  isPublicTencent,
  isPublicAmazon,
  isPublicZenlayer,
  isPrivateVmware,
  isPrivateHuawei
} = useCommon()
onMounted(() => {
  initComponents()
})

const initComponents = () => {
  if (isPublicHuawei) {
    activeName.value = 'publicHuaweiCloud'
    tabControllers.value[0].name = 'publicHuaweiCloud'
    active.value = publicHuaweiCloud
  } else if (isPublicCtyun) {
    activeName.value = 'publicCtyun'
    tabControllers.value[0].name = 'publicCtyun'
    active.value = publicCtyun
  } else if (isPublicAli) {
    activeName.value = 'publicAliyun'
    tabControllers.value[0].name = 'publicAliyun'
    active.value = publicAliyun
  } else if (isPublicTencent) {
    activeName.value = 'publicTencent'
    tabControllers.value[0].name = 'publicTencent'
    active.value = publicTencent
  } else if (isPublicAmazon) {
    activeName.value = 'publicAmazon'
    tabControllers.value[0].name = 'publicAmazon'
    active.value = publicAmazon
  } else if (isPublicZenlayer) {
    activeName.value = 'publicZenlayer'
    tabControllers.value[0].name = 'publicZenlayer'
    active.value = publicZenlayer
  } else if (isPrivateVmware) {
    activeName.value = 'privateVmware'
    tabControllers.value[0].name = 'privateVmware'
    active.value = privateVmware
  } else if (isPrivateHuawei) {
    activeName.value = 'privateHuawei'
    tabControllers.value[0].name = 'privateHuawei'
    active.value = privateHuawei
  }
}

const tabControllers = ref([
  { label: '概览', name: 'publicHuaweiCloud' },
  { label: '计算资源', name: 'computeResource' },
  { label: '存储资源', name: 'storageResource' },
  { label: '网络资源', name: 'networkResource' },
  { label: '资源同步', name: 'resourceSynchronization' }
])

const activeName = ref('publicHuaweiCloud')
const active = shallowRef<any>(publicHuaweiCloud)

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
