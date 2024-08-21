<template>
  <div class="ideal-large-margin work-manage-manage">
    <el-tabs v-model="activeName" class="work-manage__tabs">
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
      ref="currentComponent"
      class="work-manage__component"
      @clickOperateEvent="clickOperateEvent"
    ></component>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      :row-data="rowData"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import { tabControllersData } from './common'
import dialogBox from './dialog-box.vue'
import Processing from './components/Processing.vue'
import Approve from './components/Approve.vue'
import Delivery from './components/Delivery.vue'

const rowData: any = ref({})
const currentComponent = ref()
const router = useRouter()
const showDialog = ref(false)
const dialogType = ref<string>()
const tabControllers = ref(tabControllersData)
const activeName = ref('Processing')
const tabs: any = { Processing, Approve, Delivery }

const clickOperateEvent = (command: string, row: any, tabType: string) => {
  console.log('clickOperateEvent', command, row, tabType)

  rowData.value = row
  if (['delivery', 'detail', 'approve'].includes(command)) {
    router.push({
      path: '/operate-center/supplier/manage/workorder-manage/detail',
      query: {
        id: row.id,
        command,
        tabType
      }
    })
  } else if (command === 'jiaofu') {
    showDialog.value = true
    dialogType.value = 'delivery'
  }
}

const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  currentComponent.value.getDataList()
}
</script>

<style scoped lang="scss">
.work-manage-manage {
  // background-color: white;
  // padding: $idealPadding;
  .ideal-theme-text {
    cursor: pointer;
  }
  :deep(.el-tabs__header) {
    margin: 0;
  }

  :deep(.el-tabs) {
    padding: 10px 20px 0;
  }

  .work-manage__tabs {
    background-color: white;
  }

  .work-manage__component {
    margin-top: 20px;
  }
}
</style>
