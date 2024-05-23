<template>
  <div class="ideal-large-margin eip-detail">
    <div class="eip-detail__header">
      <div class="flex-row eip-detail_back">
        <svg-icon icon="left-arrow" @click="goBack"></svg-icon>
        <el-divider direction="vertical" />
        <div>
          <el-text type="primary">弹性负载均衡/</el-text>
          后端服务器组({{ serverGroupName }})
        </div>
      </div>
      <div class="eip-detail__tabs">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane
            v-for="item in tabControllers"
            :key="item.name"
            :label="item.label"
            :name="item.name"
          >
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <component :is="tabs[activeName]" v-bind="currentProps"></component>
  </div>
</template>
<script lang="ts" setup>
import type { TabsPaneContext } from 'element-plus'
import basicInfo from './basic-info.vue'
import backEndServer from './back-end-server.vue'

const router = useRouter()
const goBack = () => {
  router.back()
}

const detailInfo: any = ref({})
const route = useRoute()
onMounted(() => {
  detailInfo.value = JSON.parse(route.query.detail as any)
})

const serverGroupName = ref('elb-978a')

const activeName = ref('basicInfo')
const tabControllers = ref([
  { label: '基本信息', name: 'basicInfo' },
  { label: '后端服务器', name: 'backEndServer' }
])
const tabs: any = { basicInfo, backEndServer }

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
// 当前组件需要的传参
const currentProps = ref()
</script>
<style lang="scss" scoped>
.eip-detail {
  box-sizing: border-box;
}
.eip-detail__header {
  background-color: #fff;
  padding: 0 20px;
  .eip-detail_back {
    align-items: center;
    height: 40px;
  }
  .clickLeftEvent {
    padding: 20px 0;
    background-color: #fff;
  }
}
</style>
