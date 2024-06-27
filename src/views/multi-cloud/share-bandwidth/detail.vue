<template>
  <div class="ideal-large-margin detail">
    <div class="detail-info">
      <ideal-detail-info
        :label-array="labelArray"
        :detail-info="detailInfo"
        class="basic-info__content"
      ></ideal-detail-info>
    </div>

    <div class="detail-tabs">
      <el-tabs v-model="activeName">
        <el-tab-pane
          v-for="item in tabControllers"
          :key="item.name"
          :label="item.label"
          :name="item.name"
        >
        </el-tab-pane>
      </el-tabs>
      <component
        :is="tabs[activeName]"
      ></component>
    </div>
  </div>
</template>

<script setup lang="ts">
import eipList from './components/eip-list.vue'

import ipv6List from './components/ipv6-list.vue'

const labelArray = ref([
  { label: '带宽名称', prop: 'name' },
  { label: '带宽ID', prop: 'uuid' },
  { label: '计费模式', prop: 'billingModeDes' },
  { label: '计费方式', prop: 'chargeMode' },
  { label: '创建时间', prop: 'createTime' },
  { label: '带宽大小(Mbit/s)', prop: 'size' }
])
const detailInfo = {
  name: 'bandwidth-09a4',
  uuid: '9a93e321-931b-0321-39ae8bc8',
  billingModeDes: '按需计费',
  chargeMode: '按带宽计费',
  createTime: '2023-09-20 10:20:21',
  size: 5
}

const activeName = ref('eipList')
const tabControllers = ref([
  { label: '弹性公网IP', name: 'eipList' },
  { label: 'IPv6网卡', name: 'ipv6List' }
])
const tabs: any = { eipList, ipv6List }
</script>

<style scoped lang="scss">
.detail {
  box-sizing: border-box;
  .detail-info, .detail-tabs {
    background-color: white;
    padding: 20px;
  }
  .detail-tabs {
    margin-top: 20px;
  }
}
</style>
