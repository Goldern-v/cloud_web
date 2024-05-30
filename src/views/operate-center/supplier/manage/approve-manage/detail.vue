<template>
  <div class="information-detail">
    <el-card>
      <el-collapse v-model="activeNames">
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
            <div>{{ detailInfo[ele.prop] }}</div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { DetailPanelProps } from '../information-manage/interface'
const activeNames = ref(['basic', 'node', 'device', 'port'])

const detailData = ref<DetailPanelProps[]>([
  {
    title: '基本信息',
    name: 'basic',
    labelArray: [
      { label: '名称', prop: 'name' },
      { label: '描述', prop: 'remark' }
    ]
  },
  {
    title: '节点信息',
    name: 'node',
    labelArray: [
      { label: '节点名称', prop: 'nodeName' },
      { label: '区域', prop: 'region' },
      { label: '国家', prop: 'country' },
      { label: '城市', prop: 'city' },
      { label: '机房名称', prop: 'region' },
      { label: '地理位置', prop: 'region' },
      { label: '数据中心名称', prop: 'region' },
      { label: '机柜号', prop: 'region' }
    ]
  },
  {
    title: '设备信息',
    name: 'device',
    labelArray: [
      { label: '设备名称', prop: 'nodeName' },
      { label: '所属机架', prop: 'region' },
      { label: '所属U位', prop: 'country' },
      { label: '网络平面', prop: 'city' }
    ]
  },
  {
    title: '端口信息',
    name: 'port',
    labelArray: [
      { label: '端口类型', prop: 'nodeName' },
      { label: '端口名称', prop: 'region' },
      { label: '速率', prop: 'speed' }
    ]
  }
])
const detailInfo: any = ref({})
</script>

<style scoped lang="scss">
.information-detail {
  box-sizing: border-box;
  margin: $idealMargin $idealMargin 80px;
  :deep(.el-card) {
    height: calc(
      100vh - var(--navigation-bar-height) - var(--theme-header-height) - 40px
    ); // 两个40分别是面包屑和标签页
    position: relative;
    padding: 0 $idealPadding;
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
