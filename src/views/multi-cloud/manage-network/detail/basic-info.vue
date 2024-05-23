<template>
  <div class="basic-info">
    <div class="flex-row basic-info__head">
      <div class="flex-column basic-info__head-img">
        <img class="basic-info__head-img-box" src="@/assets/detail-info.png" />
        <div class="basic-info__head-title">{{ routeData.name }}</div>
      </div>

      <el-divider direction="vertical" />

      <ideal-detail-info
        :label-array="labelArray"
        :detail-info="routeData"
        class="basic-info__content"
        @edit-info="editInfo"
      >
      </ideal-detail-info>
    </div>

    <el-tabs
      v-model="activeName"
      class="basic-info__tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane
        v-for="item in tabControllers"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      >
      </el-tab-pane>
    </el-tabs>

    <component :is="tabs[activeName]" :detail-info="detailInfo"></component>
  </div>
</template>

<script setup lang="ts">
import netSegment from './net-segment.vue'
import { querySubnetDetail, subnetEdit } from '@/api/java/network'
import { RESOURCE_STATUS } from '@/utils/dictionary'
import { showLoading, hideLoading } from '@/utils/tool'
import { ElMessage } from 'element-plus'

// 详情label
const labelArray = ref([
  { label: 'UUID', prop: 'uuid', isEdit: true },
  { label: 'MTU', prop: 'mtu', isCopy: true },
  { label: 'IPv4 CIDR', prop: 'ipv4', isCopy: true },
  { label: '创建时间', prop: 'createTime' },
  { label: '最后操作时间', prop: 'lastTime' }
])
// 详情
onMounted(() => {
  queryDetail()
})

const route = useRoute()
const routeData = JSON.parse(route.query.detail as any)
// const routeData = ref({})
//公共参数
const commonParams = () => {
  const params = {
    resourcePoolId: routeData.resourcePoolId,
    regionId: routeData.regionId,
    projectId: routeData.projectId
  }
  return params
}
// 详情
const detailInfo: any = ref({})
const queryDetail = () => {
  querySubnetDetail({ id: routeData.id, ...commonParams() }).then(
    (res: any) => {
      const { data, code } = res
      if (code === 200) {
        data.statusText = RESOURCE_STATUS[data.status]
        detailInfo.value = data
      } else {
        detailInfo.value = {}
      }
    }
  )
}

const editInfo = (val: any, config: any) => {
  const data = JSON.parse(route.query.detail as any)
  const params: any = {
    vpcId: data.vpcId,
    uuid: val.uuid,
    name: val.name,
    description: val.description,
    ipv6_enable: false,
    ...commonParams()
  }
  showLoading('更新中...')
  subnetEdit(params)
    .then((res: any) => {
      const { code, data, msg } = res
      if (code === 200) {
        ElMessage.success(data || '更新成功')
        config.showEdit = false
        queryDetail()
      } else {
        ElMessage.error(msg)
      }
      hideLoading()
    })
    .catch(err => {
      hideLoading()
    })
}
// 标签页组件
const tabs: any = { netSegment }
// tabs标签页
const tabControllers = ref([{ label: '网络段', name: 'netSegment' }])
const activeName = ref('netSegment')

const handleClick = (tab: any) => {
  if (tab.paneName === 'netSegment') {
    queryDetail()
  }
}
</script>

<style scoped lang="scss">
.basic-info {
  width: 100%;
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
      padding: 0 20px 0 10%;
    }
  }
  .basic-info__tabs {
    margin-top: 20px;
    background-color: white;
  }
}
</style>
