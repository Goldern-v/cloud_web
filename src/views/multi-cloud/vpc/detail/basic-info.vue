<template>
  <div class="basic-info">
    <div class="flex-row basic-info__head">
      <div class="flex-column basic-info__head-img">
        <img class="basic-info__head-img-box" src="@/assets/detail-info.png" />
        <div class="basic-info__head-title">{{ detailInfo.name }}</div>
      </div>

      <el-divider direction="vertical" />

      <ideal-detail-info
        :label-array="labelArray"
        :detail-info="detailInfo"
        class="basic-info__content"
        @edit-info="editInfo"
      >
        <template #createTime>
          <div class="flex-row">
            <div>{{ detailInfo.createTime?.date }}</div>
          </div>
        </template>

        <template #vpcCidr>
          <div class="flex-row" style="align-items: center">
            <div class="ideal-default-margin-right">{{ detailInfo.cidr }}</div>
            <div class="ideal-theme-text">编辑网段</div>
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
      class="vpc-detail__component"
      :detail-info="detailInfo"
    ></component>
  </div>
</template>

<script setup lang="ts">
import subnet from './subnet.vue'
import routeTable from './route-table.vue'
import { queryVpcDetail, vpcEdit } from '@/api/java/network'
import { RESOURCE_STATUS } from '@/utils/dictionary'
import { ElMessage } from 'element-plus'
import { hideLoading, showLoading } from '@/utils/tool'

// 详情label
const labelArray = ref([
  { label: '名称', prop: 'name', isEdit: true },
  { label: 'ID', prop: 'id', isCopy: true },
  { label: '创建时间', prop: 'createTime', useSlot: true },
  { label: '状态', prop: 'statusText' },
  { label: 'vpc网段', prop: 'vpcCidr', useSlot: true },
  { label: '描述', prop: 'description', isEdit: true }
])

const route = useRoute()
const id = route.query?.id //vpcId
onMounted(() => {
  queryDetail()
})

// 详情
const detailInfo: any = ref({})
const queryDetail = () => {
  queryVpcDetail({ id: id }).then((res: any) => {
    const { data, code } = res
    if (code === 200) {
      data.statusText = RESOURCE_STATUS[data.status]
      detailInfo.value = data
    } else {
      detailInfo.value = {}
    }
  })
}

const commonParams = () => {
  const { resourcePoolId, regionId, projectId } = detailInfo.value
  const params = {
    resourcePoolId,
    regionId,
    projectId
  }
  return params
}

const editInfo = (val: any, config: any) => {
  const params: any = {
    id: detailInfo.value.id,
    uuid: detailInfo.value.uuid,
    name: val.name,
    vdcId: detailInfo.value.vdcId,
    description: val.description,
    ...commonParams()
  }
  if (val.cidr !== detailInfo.value.cidr) {
    params.cidr = val.cidr
  }
  showLoading('修改中...')
  vpcEdit(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        hideLoading()
        ElMessage.success('修改成功')
        config.showEdit = false
        queryDetail()
      } else {
        hideLoading()
        ElMessage.error('修改失败')
      }
    })
    .catch(() => {
      hideLoading()
    })
}

// 标签页组件
const tabs: any = { subnet, routeTable }
// tabs标签页
const tabControllers = ref([
  { label: '子网', name: 'subnet' },
  { label: '路由表', name: 'routeTable' }
])
const activeName = ref('subnet')
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
