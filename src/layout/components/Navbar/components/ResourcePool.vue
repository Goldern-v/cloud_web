<template>
  <div class="resource-pool">
    <el-popover
      ref="popoverRef"
      placement="bottom-end"
      :width="popoverWidth"
      :show-arrow="false"
      trigger="click"
      @hide="clickHide"
    >
      <template #reference>
        <el-button class="resource-pool-button" @click="clickRegionName">
          <svg-icon
            icon="internet-zone"
            class="ideal-svg-margin-right"
            class-name="internet-zone"
          />
          {{ regionInfo?.name }}</el-button
        >
      </template>

      <div v-if="show" class="flex-row resource-pool-table">
        <el-scrollbar
          :height="maxScrollerHeight"
          class="resource-pool-table-scroller"
        >
          <div
            v-for="(item, index) of typeList"
            :key="index + 'type'"
            class="flex-row resource-pool-table-item"
            @click="clickTypeList(index)"
          >
            <div>{{ item.des }}</div>
            <svg-icon icon="right-arrow"></svg-icon>
          </div>
        </el-scrollbar>

        <el-scrollbar
          v-if="showVendor"
          :height="maxScrollerHeight"
          class="resource-pool-table-scroller"
        >
          <div
            v-for="(item, index) of vendorList"
            :key="index + 'vendor'"
            class="flex-row resource-pool-table-item"
            @click="clickVendorList(index)"
          >
            <el-image :src="item.iconUrl" style="width: 20px; height: 20px" />
            <div>{{ item.des }}</div>
            <svg-icon icon="right-arrow"></svg-icon>
          </div>
        </el-scrollbar>

        <el-scrollbar
          v-if="showResource"
          :height="maxScrollerHeight"
          class="resource-pool-table-scroller"
        >
          <div
            v-for="(item, index) of resourceBundleList"
            :key="index + 'resource'"
            class="flex-row resource-pool-table-item"
            @click="clickResourceBundleList(index)"
          >
            <div>{{ item.name }}</div>
            <svg-icon icon="right-arrow"></svg-icon>
          </div>
        </el-scrollbar>

        <el-scrollbar
          v-if="showRegion"
          :height="maxScrollerHeight"
          class="resource-pool-table-scroller"
        >
          <div
            v-for="(item, index) of regionList"
            :key="index + 'region'"
            class="flex-row resource-pool-table-item"
            @click="clickRegionList(index)"
          >
            <div class="flex-row">
              <svg-icon
                icon="location-icon"
                class="ideal-svg-margin-right"
              ></svg-icon>
              <div>{{ item.name }}</div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import store from '@/store'
import { queryResourcePool, queryUserProject } from '@/api/java/public'

const popoverWidth = ref('200px')
// 列表最大高
const maxScrollerHeight = ref('200px')
// 资源池选择
const { regionInfo, resourcePoolInfo } = storeToRefs(store.resourceStore)
// 弹出框
const popoverRef = ref()

onMounted(() => {
  getResourcePool()
})
// 公有云私有云
const typeList: any = ref([])
// 阿里云腾讯云
const vendorList: any = ref([])
const showVendor = ref(false)
// 资源池
const resourceBundleList: any = ref([])
const showResource = ref(false)
// 区域
const regionList: any = ref([])
const showRegion = ref(false)
// 获取资源池
const getResourcePool = () => {
  queryResourcePool()
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        handleDefaultRegion(data)
        typeList.value = data?.typeList
        vendorList.value = typeList.value[0]?.vendorList
        resourceBundleList.value = vendorList.value[0]?.resourceBundleList
        regionList.value = resourceBundleList.value[0]?.regionList
      } else {
        typeList.value = []
        vendorList.value = []
        resourceBundleList.value = []
        regionList.value = []
      }
    })
    .catch(_ => {
      typeList.value = []
      vendorList.value = []
      resourceBundleList.value = []
      regionList.value = []
    })
}
// 首次登录默认选择第一条区域
const handleDefaultRegion = (array: any) => {
  if (store.resourceStore.resourcePoolInfo && store.resourceStore.regionInfo) {
    return
  }
  if (
    array?.typeList.length &&
    array?.typeList[0].vendorList.length &&
    array?.typeList[0].vendorList[0].resourceBundleList.length &&
    array?.typeList[0].vendorList[0].resourceBundleList[0].regionList.length
  ) {
    const resourcePoolItem =
      array?.typeList[0].vendorList[0].resourceBundleList[0]
    store.resourceStore.resourcePoolInfo = resourcePoolItem
    store.resourceStore.regionInfo = resourcePoolItem.regionList[0]
    getUserProject()
  }
}
// 选择私有云还是公有云等
const clickTypeList = (index: number) => {
  showVendor.value = true
  showResource.value = false
  showRegion.value = false
  popoverWidth.value = '400px'

  // 防止重选的时候有脏数据
  vendorList.value = []
  resourceBundleList.value = []
  regionList.value = []
  if (typeList.value.length) {
    vendorList.value = typeList.value[index]?.vendorList
  }
  if (vendorList.value.length) {
    resourceBundleList.value = vendorList.value[0]?.resourceBundleList
  }
  if (resourceBundleList.value.length) {
    regionList.value = resourceBundleList.value[0]?.regionList
  }
}
// 选择阿里云还是华为云等
const clickVendorList = (index: number) => {
  showResource.value = true
  showRegion.value = false
  popoverWidth.value = '600px'

  resourceBundleList.value = []
  regionList.value = []
  if (vendorList.value.length) {
    resourceBundleList.value = vendorList.value[index]?.resourceBundleList
  }
  if (resourceBundleList.value.length) {
    regionList.value = resourceBundleList.value[0]?.regionList
  }
}
// 资源池选择索引
let resourcePoolIndex = 0
// 选择资源池
const clickResourceBundleList = (index: number) => {
  showRegion.value = true
  popoverWidth.value = '800px'

  resourcePoolIndex = index
  regionList.value = []
  if (resourceBundleList.value.length) {
    regionList.value = resourceBundleList.value[index]?.regionList
  }
}
// 选择区域
const clickRegionList = (index: number) => {
  const resourcePoolItem = resourceBundleList.value[resourcePoolIndex]
  store.resourceStore.resourcePoolInfo = resourcePoolItem
  store.resourceStore.regionInfo = regionList.value[index]
  show.value = false
  popoverRef.value.hide()
  getUserProject()
}

// 显示资源池列表
const show = ref(false)
const clickHide = () => {
  show.value = false
  showVendor.value = false
  showResource.value = false
  showRegion.value = false
  popoverWidth.value = '150px'
}
const clickRegionName = () => {
  show.value = true
}

// 项目信息
const getUserProject = () => {
  const params = {
    region: regionInfo.value?.code,
    userId: store.userStore.user.id,
    cloudResourcePoolId: resourcePoolInfo.value?.id
  }
  queryUserProject(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        store.resourceStore.cloudProjectId = data.cloudProjectId // 底层项目id
        store.resourceStore.projectId = data.id // 云管项目id
      } else {
        store.resourceStore.cloudProjectId = ''
        store.resourceStore.projectId = ''
      }
    })
    .catch(_ => {
      store.resourceStore.cloudProjectId = ''
      store.resourceStore.projectId = ''
    })
}
</script>

<style scoped lang="scss">
:deep(.el-popover.el-popper) {
  padding: 0;
}
.resource-pool {
  width: 100%;
  .resource-pool-button {
    background-color: rgba($color: #ffffff, $alpha: 0.1);
    color: white;
    border-color: rgba(39, 43, 52, 0.6);
  }
  :deep(.internet-zone) {
    color: white;
  }
}
.resource-pool-table {
  width: 100%;
  .resource-pool-table-item:last-child {
    border-right: 0;
  }
  .resource-pool-table-scroller {
    width: 100%;
    border-right: 1px solid #eee;
    .resource-pool-table-item {
      cursor: pointer;
      justify-content: space-between;
      align-items: center;
      padding: 10px 10px;
      margin: 0 10px;
      border-bottom: 1px solid #eee;
      text-align: center;
      border-radius: 4px;
    }
  }
}
</style>
