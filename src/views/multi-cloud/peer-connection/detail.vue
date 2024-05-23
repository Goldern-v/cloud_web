<template>
  <div class="ideal-large-margin basic-info">
    <div class="flex-row basic-info__head">
      <div class="flex-column basic-info__head-img">
        <img class="basic-info__head-img-box" src="@/assets/detail-info.png" alt=""/>
        <div class="basic-info__head-title">subnet-default</div>
      </div>

      <el-divider direction="vertical"/>

      <ideal-detail-info :label-array="labelArray" :detail-info="detailInfo" class="basic-info__content">
        <template #instanceName>
          <div class="flex-row">
            <div>{{detailInfo.instanceName}}</div>
            <svg-icon icon="edit-pen" class="ideal-svg-margin-left"></svg-icon>
          </div>
        </template>

        <template #localVpcName>
          <div class="flex-row">
            <div class="ideal-theme-text">{{ detailInfo.localVpcName }}</div>
          </div>
        </template>

        <template #peerVpcName>
          <div class="flex-row">
            <div class="ideal-theme-text">{{ detailInfo.peerVpcName }}</div>
          </div>
        </template>
      </ideal-detail-info>
    </div>

    <el-tabs v-model="activeName" class="basic-info__tabs">
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
</template>

<script setup lang="ts">
import localRoute from './components/local-route.vue'
import peerRoute from './components/peer-route.vue'

// 详情label
const labelArray = ref([
  { label: '实例名称', prop: 'instanceName', useSlot: true },
  { label: '状态', prop: 'status' },
  { label: '主机名称', prop: 'hostName' },
  { label: '连接类型', prop: 'connectionType' },
  { label: '本端VPC名称', prop: 'localVpcName', useSlot: true },
  { label: '对端VPC名称', prop: 'peerVpcName', useSlot: true },
  { label: '本端VPC ID', prop: 'localVpcId' },
  { label: '对端VPC ID', prop: 'peerVpcId'},
  { label: '本端VPC网段', prop: 'localVpcNetwork' },
  { label: '对端VPC网段', prop: 'peerVpcNetwork' },
  { label: '企业项目', prop: 'project' }
])
// 详情
const detailInfo = ref({
  instanceName: 'VPN-1693',
  status: '已接受',
  hostName: '2443532525235235353',
  connectionType: '同账号',
  localVpcName: 'VPVC-1693',
  peerVpcName: 'VPVC-1691',
  localVpcId: '424c04c-b049-1a29-8a07-7a291ac069a1',
  peerVpcId: 'dd4c04c-b849-4729-8a07-7a291ac069a7',
  localVpcNetwork: '192.168.0.12',
  peerVpcNetwork: '192.168.0.11',
  project: 'r192.168.0.11',
})
// 标签页组件
const tabs: any = { localRoute, peerRoute }
// tabs标签页
const tabControllers = ref([
  { label: '本端路由', name: 'localRoute' },
  { label: '对端路由', name: 'peerRoute' }
])
const activeName = ref('localRoute')
</script>

<style scoped lang="scss">
.basic-info {
  box-sizing: border-box;
  :deep(.el-tabs) {
    padding: 10px 20px 0;
  }
  .basic-info__head {
    width: calc(100% - 40px);
    padding: 20px;
    background-color: white;
    .basic-info__head-img {
      width: 25%;
      justify-content: center;
      align-items: center;
      .basic-info__head-img-box {
        width: 180px;
        height: 150px;
      }
      .basic-info__head-title {
        margin-top: 10px;
      }
    }
    // 修改分割线
    :deep(.el-divider--vertical) {
      height: auto;
      border-left: 2px var(--el-border-color) var(--el-border-style);
    }
    .basic-info__content {
      width: 75%;
      padding: 0 20px 0 5%;
    }
  }
  .basic-info__tabs {
    margin-top: 20px;
    background-color: white;
  }
}
</style>