<template>
  <div class="back-end-server">
    <el-card class="back-end-server-tab">
      <el-tabs v-model="activeName" @tab-click="handleClick">
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
        v-bind="currentProps"
        @addResource="addResource"
      ></component>
    </el-card>

    <el-card class="health-check ideal-large-margin-top">
      <config-health-check> </config-health-check>
    </el-card>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import type { TabsPaneContext } from 'element-plus'
import { OperateEventEnum } from '@/utils/enum'
import dialogBox from '../../dialog-box.vue'
import cloudServer from './cloud-server.vue'
import acrossVpc from './across-vpc.vue'
import elasticNetCard from './elastic-net-card.vue'
import configHealthCheck from './config-health-check.vue'

/**
 * tab页
 */
const activeName = ref('cloudServer')
const tabControllers = ref([
  { label: '云服务器', name: 'cloudServer' },
  { label: '跨VPC后端', name: 'acrossVpc' },
  { label: '辅助弹性网卡', name: 'elasticNetCard' }
])
const tabs: any = { cloudServer, acrossVpc, elasticNetCard }
// 当前组件需要的传参
const currentProps = ref()
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const addResource = (type: string) => {
  if (type === 'cloudServer') {
    showDialog.value = true
    dialogType.value = 'addCloudServer'
  } else if (type === 'acrossVpc') {
    showDialog.value = true
    dialogType.value = 'addAcrossVpc'
  } else if (type === 'elasticNetCard') {
    showDialog.value = true
    dialogType.value = 'addElasticNetCard'
  }
}

/**
 * 弹窗
 */
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
}
</script>

<style scoped lang="scss">
.back-end-server {
  :deep(.ideal-detail-info) {
    padding: 0px;
    .ideal-detail-info-item {
      padding: 0px;
    }
  }
  .health-check {
    margin-bottom: 65px;
  }
}
</style>
