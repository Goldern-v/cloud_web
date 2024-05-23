<template>
  <div class="ideal-large-margin detail">
    <el-tabs v-model="activeName">
      <el-tab-pane
        v-for="item in tabControllers"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      >
      </el-tab-pane>
    </el-tabs>
    <component :is="tabs[activeName]"></component>
  </div>
</template>

<script setup lang="ts">
import basicInfo from './basic-info.vue'
import enterRule from './enter-rule.vue'
import exitRule from './exit-rule.vue'
import relateInstance from './relate-instance.vue'

const activeName = ref('basicInfo')
const route = useRoute()
const cloudPlatformCategoryCode = route.query
  ?.cloudPlatformCategoryCode as string //云类别
const cloudPlatformTypeCode = route.query?.cloudPlatformTypeCode as string //云类型
onMounted(() => {
  activeName.value = (route.query?.type as string) || 'basicInfo'
})
const tabs: any = { basicInfo, enterRule, exitRule, relateInstance }
const tabControllers: any = ref([])

const tabOptions = [
  { label: '基本信息', name: 'basicInfo' },
  { label: '入方向规则', name: 'enterRule' },
  { label: '出方向规则', name: 'exitRule' },
  { label: '关联实例', name: 'relateInstance' }
]
//华为私有云
const isPrivateHuawei = computed(
  () =>
    RegExp(/HUAWEI_CLOUD/).test(cloudPlatformTypeCode) &&
    RegExp(/PRIVATE/).test(cloudPlatformCategoryCode)
)
onMounted(() => {
  //华为私有云不支持关联实例功能
  if (isPrivateHuawei.value) {
    tabControllers.value = tabOptions.filter(item => {
      return item.name !== 'relateInstance'
    })
  } else {
    tabControllers.value = tabOptions
  }
})
</script>

<style scoped lang="scss">
.detail {
  box-sizing: border-box;
  // 修改tabs底部边距
  :deep(.el-tabs__header) {
    margin: 0;
    background-color: white;
    padding: 0 $idealPadding;
  }
}
</style>
