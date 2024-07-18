<template>
  <div class="information-detail">
    <el-card>
      <el-collapse
        v-model="activeNames"
        class="collapse-content"
        @change="handleChange"
      >
        <el-collapse-item
          v-for="(item, index) in detailData"
          :key="index"
          :name="item.name"
        >
          <template #title>
            <div class="collapse-title">{{ item.title }}</div>
          </template>
          <div
            v-for="(ele, idx) in item.labelArray"
            :key="idx"
            class="flex-row information-detail_item"
          >
            <div style="width: 150px">{{ ele.label }}:</div>
            <div v-if="item.name === 'basic'">{{ detailInfo[ele.prop] }}</div>
            <div v-if="item.name === 'node'">{{ nodeInfo[ele.prop] }}</div>
            <div v-if="item.name === 'device'">{{ deviceInfo[ele.prop] }}</div>
          </div>
        </el-collapse-item>

        <el-collapse-item
          v-for="(item, index) in portInfo"
          :key="index"
          :name="'port'"
        >
          <template #title>
            <div class="collapse-title">
              端口<span v-if="portInfo.length > 1">{{ index + 1 }}</span
              >信息
            </div>
          </template>

          <div
            v-for="(ele, idx) in portData"
            :key="idx"
            class="flex-row information-detail_item"
          >
            <div style="width: 150px">{{ ele.label }}</div>
            <div>{{ item[ele.prop] }}</div>
          </div>
        </el-collapse-item>
      </el-collapse>

      <el-button class="back-btn" type="primary" @click="() => $router.go(-1)"
        >返回</el-button
      >
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { DetailPanelProps } from './interface'
import { supplierInfoDetail } from '@/api/java/operate-center'
import { ElMessage } from 'element-plus'
import store from '@/store'

const activeNames = ref(['basic', 'node', 'device', 'port', 'port'])

const detailData = ref<DetailPanelProps[]>([])

const basicData = [
  { label: '名称', prop: 'vendorName' },
  { label: 'ID', prop: 'vendorId' }
]
const nodeData = [
  { label: '节点名称', prop: 'name' },
  { label: '区域', prop: 'areaName' },
  { label: '国家', prop: 'countryName' },
  { label: '城市', prop: 'cityName' },
  { label: '机房名称', prop: 'equipmentRoom' },
  { label: '经度', prop: 'longitude' },
  { label: '纬度', prop: 'latitude' },
  { label: '地理位置', prop: 'address' },
  { label: '数据中心名称', prop: 'dataCenter' },
  { label: '机柜号', prop: 'cabinets' }
]
const deviceData = [
  { label: '设备名称', prop: 'name' },
  { label: '所属机柜', prop: 'cabinetName' },
  { label: '所属U位', prop: 'uType' },
  { label: '网络平面', prop: 'planarNetwork' }
]

const portData: any = ref([
  { label: '端口类型', prop: 'portTypeText' },
  { label: '端口名称', prop: 'name' },
  { label: '速率', prop: 'speed' }
])

const route = useRoute()
const id = route.query.id as string
const detailInfo: any = ref({})
const nodeInfo: any = ref({})
const deviceInfo: any = ref({})
const portInfo: any = ref({})

onMounted(() => {
  queryDetail()
})
//查询供应商详情
const queryDetail = async () => {
  const cloudTypeFormat: { [key: string]: any } = {
    SPECIALIZED: '专用端口',
    NNI: 'NNI端口',
    aliyun: '阿里云端口',
    aws: 'AWS端口',
    Azure: 'Azure端口'
  }
  try {
    const res = await supplierInfoDetail(id)
    detailInfo.value = res.data
    if (detailInfo.value) {
      detailData.value.push({
        title: '基本信息',
        name: 'basic',
        labelArray: basicData
      })
    }
    nodeInfo.value = res.data?.supplierNodeDetail?.node
    if (nodeInfo.value) {
      detailData.value.push({
        title: '节点信息',
        name: 'node',
        labelArray: nodeData
      })
    }
    deviceInfo.value = res.data?.supplierNodeDetail?.equipments[0]
    if (deviceInfo.value) {
      detailData.value.push({
        title: '设备信息',
        name: 'device',
        labelArray: deviceData
      })
    }
    portInfo.value = res.data?.supplierNodeDetail?.ports
    if (portInfo.value) {
      portInfo.value.forEach((item: any) => {
        if (item.portType !== 'CLOUD') {
          item.portTypeText = cloudTypeFormat[item.portType]
        } else {
          item.portTypeText = cloudTypeFormat[item.cloudPortType]
        }
      })
    }
  } catch (err: any) {
    ElMessage.error(err)
  }
}

onBeforeRouteLeave((to, from, next) => {
  store.commonStore.removeSideBar()
  next()
})
const handleChange = () => {}
</script>

<style scoped lang="scss">
.information-detail {
  box-sizing: border-box;
  margin: $idealMargin $idealMargin 80px;

  :deep(.el-card) {
    height: calc(
      100vh - var(--navigation-bar-height) - var(--theme-header-height) - 40px
    );
    position: relative;
    padding: 0 $idealPadding;
    overflow: auto;
  }
  .back-btn {
    position: fixed;
    right: 100px;
    bottom: 100px;
  }
  .information-detail_item {
    padding: 5px;
  }
  :deep(.el-collapse-item__header) {
    font-size: 14px;
    font-weight: bold;
    text-align: left;
  }
  .collapse-title {
    flex: 1 0 90%; //使箭头位于左侧
    order: 1;
  }
}
</style>
