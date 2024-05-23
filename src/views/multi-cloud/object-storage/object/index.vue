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
      @clickConfig="clickConfig"
    ></component>
  </div>
</template>

<script setup lang="ts">
import objList from './obj/list.vue'
import deletedList from './deleted/list.vue'
import chipList from './chip/list.vue'
import type { TabsPaneContext } from 'element-plus'

// 标签页组件
const tabs: any = { objList, deletedList, chipList }

// tabs标签页
const tabControllers = ref([
  { label: '对象', name: 'objList' },
  { label: '已删除对象', name: 'deletedList' },
  { label: '碎片', name: 'chipList' }
])
const activeName = ref('objList')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
const clickConfig = () => {
  emit('clickConfig') // 跳转访问控制权限
}
// 方法
interface EventEmits {
  (e: 'clickConfig'): void
}
const emit = defineEmits<EventEmits>()
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
