<template>
  <div class="ideal-main-container resource-tag">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="item in tabControllers"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      >
      </el-tab-pane>
    </el-tabs>

    <component :is="tabs[activeName]" v-bind="currentProps"></component>
  </div>
</template>

<script setup lang="ts">
import publicTag from './public/list.vue'
import privateTag from './private/list.vue'
import type { TabsPaneContext } from 'element-plus'

// 标签页组件
const tabs: any = { publicTag, privateTag }
// tabs标签页
const tabControllers = ref([
  { label: '公有标签', name: 'publicTag' },
  { label: '私有标签', name: 'privateTag' }
])
const activeName = ref('')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const route = useRoute()
onMounted(() => {
  activeName.value =
    route.query.labelType === '320002' ? 'privateTag' : 'publicTag'
})

// 当前组件需要的传参
const currentProps = ref()
watch(activeName, value => {
  if (value === 'basicInfo') {
    currentProps.value = { uuid: 'test' }
  }
})
</script>

<style scoped lang="scss">
.resource-tag {
  background-color: white;
  // 修改tabs底部边距
  :deep(.el-tabs__header) {
    margin: 0;
  }
  :deep(.el-tabs) {
    padding: 10px 20px;
  }
  // 修改分割线颜色
  // :deep(.el-divider--vertical) {
  //   border-left: 1px var(--el-color-primary) solid;
  // }
}
</style>
