<template>
  <div class="basic-info">
    <div class="flex-row basic-info__head">
      <div class="flex-column basic-info__head-img">
        <img class="basic-info__head-img-box" src="@/assets/detail-info.png" />
        <div class="basic-info__head-title">{{ routeTableInfo.name }}</div>
      </div>

      <el-divider direction="vertical" />

      <ideal-detail-info
        :label-array="labelArray"
        :detail-info="routeTableInfo"
        class="basic-info__content"
        @edit-info="editInfo"
      >
        <template #type>
          <div>
            {{ routeTableInfo.defaultRoute ? '默认路由表' : '自定义路由表' }}
          </div>
        </template>

        <template #vpc>
          <el-text type="primary" style="cursor: pointer" @click="toVpc">{{
            routeTableInfo.vpc?.name
          }}</el-text>
        </template>

        <template #createTime>
          <div class="flex-row">
            <div>{{ routeTableInfo.createTime?.date }}</div>
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

    <component :is="tabs[activeName]" :detail-info="routeTableInfo"></component>
  </div>
</template>

<script setup lang="ts">
import routeList from './route-list.vue'
import { RESOURCE_STATUS } from '@/utils/dictionary'
import { showLoading, hideLoading } from '@/utils/tool'
import { ElMessage } from 'element-plus/es'
import { queryRouteTableDetail, routeTableEdit } from '@/api/java/network'

// 详情label
const labelArray = ref([
  { label: '名称', prop: 'name', isEdit: true },
  { label: '类型', prop: 'type', useSlot: true },
  { label: 'ID', prop: 'uuid', isCopy: true },
  { label: '虚拟私有云', prop: 'vpc', useSlot: true },
  { label: '创建时间', prop: 'createTime', useSlot: true },
  { label: '描述', prop: 'description', isEdit: true }
])

// 标签页组件
const tabs: any = { routeList }
const activeName = ref('routeList')
// tabs标签页
const tabControllers = ref([{ label: '路由', name: 'routeList' }])

const route = useRoute()
const id = route.query?.id

onMounted(() => {
  queryDetailInfo()
})
const routeTableInfo: any = ref({}) //路由表详情信息
//路由表详细信息
const queryDetailInfo = () => {
  queryRouteTableDetail({ id }).then((res: any) => {
    const { data, code } = res
    if (code === 200) {
      data.statusText = RESOURCE_STATUS[data.status?.toUpperCase()]
      data.createDate = data.createTime?.date
      routeTableInfo.value = data
    } else {
      routeTableInfo.value = {}
    }
  })
}

const commonParams = () => {
  const { resourcePoolId, projectId, regionId } = routeTableInfo.value
  const params = {
    resourcePoolId,
    projectId,
    regionId
  }
  return params
}
//修改路由表
const editInfo = (val: any, config: any) => {
  const params: any = {
    description: val.description,
    id: val.id,
    name: val.name,
    ...commonParams()
  }
  showLoading('更新中...')
  routeTableEdit(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        ElMessage.success(data)
        config.showEdit = false
        queryDetailInfo()
      } else {
        ElMessage.error('更新失败')
      }
      hideLoading()
    })
    .catch(err => {
      hideLoading()
    })
}

const router = useRouter()
const toVpc = () => {
  const { vpcId, cloudResourcePool } = routeTableInfo.value
  router.push({
    path: '/multi-cloud/vpc/detail',
    query: {
      id: vpcId,
      cloudPlatformTypeCode: cloudResourcePool?.cloudCategory,
      cloudPlatformCategoryCode: cloudResourcePool?.cloudType
    }
  })
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
      padding: 0 20px 0 5%;
    }
  }
  .basic-info__tabs {
    margin-top: 20px;
    background-color: white;
  }
}
</style>
