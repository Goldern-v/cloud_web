<template>
  <div class="object-detail">
    <div class="object-detail__tabs">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          v-for="item in tabControllers"
          :key="item.name"
          :label="item.label"
          :name="item.name"
        >
        </el-tab-pane>
      </el-tabs>
    </div>

    <component
      :is="tabs[activeName]"
      class="object-detail__component"
    ></component>
  </div>
</template>

<script setup lang="ts">
import bucketPolicy from './bucket-policy/list.vue'
import bucketAcl from './bucket-acl/list.vue'
import corsRule from './cors-rule/list.vue'
import securityChain from './security-chain/index.vue'
import type { TabsPaneContext } from 'element-plus'

// 标签页组件
const tabs: any = { bucketPolicy, bucketAcl, corsRule, securityChain }

// tabs标签页
const tabControllers = ref([
  { label: '桶策略', name: 'bucketPolicy' },
  { label: '桶ACLs', name: 'bucketAcl' },
  { label: 'CORS规则', name: 'corsRule' },
  { label: '防盗链', name: 'securityChain' }
])
const activeName = ref('bucketPolicy')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

</script>

<style scoped lang="scss">
.object-detail {
  width: 100%;
  .object-detail__tabs {
    background-color: white;
    padding: $idealPadding $idealPadding 0;
    // 修改tabs底部边距
    :deep(.el-tabs__header) {
      margin: 0;
    }
  }
  // 修改分割线颜色
  :deep(.el-divider--vertical) {
    border-left: 1px var(--el-color-primary) solid;
  }
}
</style>
