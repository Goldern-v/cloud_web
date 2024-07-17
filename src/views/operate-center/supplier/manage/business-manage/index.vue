<template>
  <div class="ideal-large-margin port-info">
    <div class="port-info__tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          v-for="item in tabControllers"
          :key="item.name"
          :label="item.label"
          :name="item.name"
        >
        </el-tab-pane>
      </el-tabs>
      <el-button
        v-auth="'supplier:manage:batchDownload'"
        type="primary"
        @click="handleDialog"
        >批量信息导入</el-button
      >
    </div>

    <component
      :is="tabs[activeName]"
      v-bind="currentProps"
      :key="componentKey"
      class="port-info__component"
    ></component>

    <batch-import-dialog
      v-if="showDialog"
      :type="dialogType"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></batch-import-dialog>
  </div>
</template>

<script setup lang="ts">
import batchImportDialog from '../batchImportDialog.vue'
import DCI from './DCI/index.vue'
import cloudPort from './cloud-port/index.vue'
import specificPort from './specific-port/index.vue'
import type { TabsPaneContext } from 'element-plus'

// 标签页组件
const tabs: any = { DCI, cloudPort, specificPort }
// tabs标签页
const tabControllers = ref([
  { label: '云端口', name: 'cloudPort' },
  { label: '专用端口', name: 'specificPort' },
  { label: 'DCI', name: 'DCI' }
])
const activeName = ref('cloudPort')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
// 当前组件需要的传参
const currentProps = ref()
watch(activeName, value => {
  if (value === 'cloudPort') {
    currentProps.value = { uuid: 'test' }
  }
})

// 弹框
const showDialog = ref(false)
const dialogType = ref<string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const componentKey = ref(0)
const clickRefreshEvent = () => {
  showDialog.value = false
  // 这里需要添加刷新页面
  componentKey.value++
}

const handleDialog = () => {
  showDialog.value = true
  dialogType.value = '供应商商务信息批量录入模板.xlsx'
}
</script>

<style scoped lang="scss">
.port-info {
  box-sizing: border-box;
  // 修改tabs底部边距
  :deep(.el-tabs__header) {
    margin: 0;
  }
  // :deep(.el-tabs) {
  //   padding: 10px 20px 0;
  // }
  .port-info__tabs {
    background-color: white;
    padding: 10px 20px 0;
    display: flex;
    justify-content: space-between;
  }
  .port-info__component {
    margin-top: 20px;
  }
}
</style>
