<template>
  <div class="acl-detail">
    <el-tabs v-model="activeName" class="acl-detail-tabs" @tab-click="handleClick">
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
      class="acl-detail__component"
    ></component>
  </div>
</template>

<script setup lang="ts">
import basicInfo from './basic-info/index.vue'
import enterRule from './enter-rule/list.vue'
import exitRule from './exit-rule/list.vue'
import associateSubnet from './associate-subnet/list.vue'
import type { TabsPaneContext } from 'element-plus'

// 标签页组件
const tabs: any = { basicInfo, enterRule, exitRule, associateSubnet }

// tabs标签页
const tabControllers = ref([
  { label: '基本信息', name: 'basicInfo' },
  { label: '入方向规则', name: 'enterRule' },
  { label: '出方向规则', name: 'exitRule' },
  { label: '关联子网', name: 'associateSubnet' }
])
const activeName = ref('basicInfo')

onMounted(() => {
  const route = useRoute()
  const type = route.query.type as string
  if (type) {
    activeName.value = type
  }
})

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

</script>

<style scoped lang="scss">
.acl-detail {
  margin: $idealMargin;
  .acl-detail-tabs {
    background-color: white;
    padding: 0 20px;
    // 修改tabs底部边距
    :deep(.el-tabs__header) {
      margin: 0;
    }
  }
  .acl-detail__component {
    margin-top: 20px;
  }
  // 修改分割线颜色
  :deep(.el-divider--vertical) {
    border-left: 1px var(--el-color-primary) solid;
  }
}
</style>
