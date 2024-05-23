<template>
  <div class="ideal-large-margin batch-operate-detail">
    <el-tabs v-model="activeName" class="batch-operate-detail__tabs">
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
      class="batch-operate__component"
    ></component>
  </div>
</template>

<script setup lang="ts">
import addDomainName from './add-domain-name.vue'
import addRecordSet from './add-record-set.vue'
import deleteRecordSet from './delete-record-set.vue'
import transferDomainName from './transfer-domain-name.vue'
import operateRecord from './operate-record.vue'

// 标签页组件
const tabs: any = {
  addRecordSet,
  addDomainName,
  deleteRecordSet,
  transferDomainName,
  operateRecord
}
// tabs标签页
const tabControllers = ref([
  { label: '批量添加域名', name: 'addDomainName' },
  { label: '批量添加记录集', name: 'addRecordSet' },
  { label: '批量删除记录集', name: 'deleteRecordSet' },
  { label: '批量转移域名', name: 'transferDomainName' },
  { label: '批量操作记录', name: 'operateRecord' }
])
const activeName = ref('')

const route = useRoute()
onMounted(() => {
  const type = route.query.type as string
  if (type) {
    activeName.value = type
  }
})
</script>

<style scoped lang="scss">
.batch-operate-detail {
  background: #fff;
  padding: $idealPadding;
}
</style>
