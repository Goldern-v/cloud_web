<template>
  <div class="ideal-large-margin message-info">
    <el-tabs
      v-model="activeName"
      class="message-info__tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane name="unRead">
        <template #label>
          <span class="custom-tabs-label">
            未读消息<span>({{ total }})</span>
          </span>
        </template>
      </el-tab-pane>
      <el-tab-pane label="已读消息" name="alReadyRead"></el-tab-pane>
    </el-tabs>

    <component
      :is="tabs[activeName]"
      class="message-info__component"
      @updateListLength="handleListLength"
    ></component>
  </div>
</template>
<script setup lang="ts">
import type { TabsPaneContext } from 'element-plus'
import { ref } from 'vue'
import unRead from './unRead.vue'
import alReadyRead from './alReadyRead.vue'
// 标签页组件
const tabs: any = { unRead, alReadyRead }
const activeName = ref('unRead')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
const total = ref(0)
const handleListLength = (length: any) => {
  total.value = length
}
</script>
<style scoped lang="scss">
.message-info {
  box-sizing: border-box;
  // 修改tabs底部边距
  :deep(.el-tabs__header) {
    margin: 0;
  }
  :deep(.el-tabs) {
    padding: 10px 20px 0;
  }
  .message-info__tabs {
    background-color: white;
  }
  .message-info__component {
    margin-top: 20px;
  }
}
</style>
