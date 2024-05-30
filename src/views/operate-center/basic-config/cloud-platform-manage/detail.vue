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
import publicHuaweiCloud from './public/huawei-cloud.vue'
import publicCtyun from './public/ctyun.vue'
import publicAliyun from './public/aliyun.vue'
import publicTencent from './public/tencent.vue'
import publicAmazon from './public/amazon.vue'
import publicZenlayer from './public/zenlayer.vue'
import privateCtyun from './private/ctyun.vue'
import privateVmware from './private/vmware.vue'
import privateHuawei from './private/huawei.vue'
import resourcePool from './components/resource-pool.vue'
import priceModel from './components/price-model.vue'
import billRecord from './components/bill-record.vue'
import domain from './components/domain.vue'
import authorized from './authorized/list.vue'
import { useCommon } from './common'
import type { TabsPaneContext } from 'element-plus'

// 标签页组件
const tabs = shallowRef<any>({
  publicHuaweiCloud,
  publicCtyun,
  publicAliyun,
  publicTencent,
  publicAmazon,
  publicZenlayer,
  privateCtyun,
  privateVmware,
  privateHuawei,
  resourcePool,
  priceModel,
  billRecord,
  domain,
  authorized
})
const {
  isPublicHuawei,
  isPublicCtyun,
  isPublicAli,
  isPublicTencent,
  isPublicAmazon,
  isPublicZenlayer,
  isPrivateCtyun,
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
  } else if (isPublicZenlayer) {
    activeName.value = 'publicZenlayer'
    tabControllers.value[0].name = 'publicZenlayer'
    active.value = publicZenlayer
  } else if (isPrivateCtyun) {
    activeName.value = 'privateCtyun'
    tabControllers.value[0].name = 'privateCtyun'
    active.value = privateCtyun
  } else if (isPrivateVmware) {
    activeName.value = 'privateVmware'
    tabControllers.value[0].name = 'privateVmware'
    active.value = privateVmware
  } else if (isPrivateHuawei) {
    activeName.value = 'privateHuawei'
    tabControllers.value[0].name = 'privateHuawei'
    active.value = privateHuawei
  } else if (isPublicAmazon) {
    activeName.value = 'publicAmazon'
    tabControllers.value[0].name = 'publicAmazon'
    active.value = publicAmazon
  }

  // 除VMWARE私有和华为公有 添加域名列表
  if (!isPrivateVmware && !isPublicHuawei) {
    tabControllers.value.push({ label: '域名', name: 'domain' })
  }

  if (!isPublicAmazon) {
    tabControllers.value.push({ label: '授权账户', name: 'authorized' })
  }
}

const tabControllers = ref([
  { label: '概览', name: 'publicHuaweiCloud' },
  { label: '资源池', name: 'resourcePool' },
  { label: '定价模型', name: 'priceModel' },
  { label: '账单同步记录', name: 'billRecord' }
])

const activeName = ref('publicHuaweiCloud')
const active = shallowRef<any>(publicHuaweiCloud)

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
