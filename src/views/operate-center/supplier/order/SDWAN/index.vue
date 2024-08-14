<template>
  <div class="ideal-large-margin order-SDWAN">
    <el-tabs
      v-model="activeName"
      class="order-SDWAN__tabs"
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
    <component
      :is="tabs[activeName]"
      class="order-SDWAN__component"
    ></component>
  </div>
</template>

<script setup lang="ts">
import { tabControllersData } from './utils/data'
import progressing from './components/progressing.vue'
import finish from './components/finish.vue'
import abnormalBill from './components/abnormalBill.vue'

const tabControllers = ref(tabControllersData)
const activeName = ref('progressing')
const tabs: any = { progressing, finish, abnormalBill }

const handleClick = e => {
  console.log(e, 'handleClick')
}
</script>

<style lang="scss" scoped>
.order-SDWAN {
  box-sizing: border-box;

  :deep(.el-tabs__header) {
    margin: 0;
  }

  :deep(.el-tabs) {
    padding: 10px 20px 0;
  }

  .order-SDWAN__tabs {
    background-color: white;
  }

  .order-SDWAN__component {
    margin-top: 20px;
  }
}
</style>
