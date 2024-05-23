<template>
  <div class="create-info">
    <div>资源详情</div>
    <ideal-table-list
      :table-data="dataList"
      :table-headers="tableHeaders"
      :show-pagination="false">
      <template #config>
        <el-table-column label="配置">
          <div class="ideal-tip-text">区域<span class="create-info-content">{{ config.regionName }}</span></div>
          <div class="ideal-tip-text">名称<span class="create-info-content">{{ config.name }}</span></div>
          <div class="ideal-tip-text">来源<span class="create-info-content">{{ config.instanceName }}</span></div>
        </el-table-column>
      </template>
    </ideal-table-list>
  </div>
</template>

<script setup lang="ts">
import type { IdealTableColumnHeaders } from '@/types'

interface InfoProps {
  config?: any
}
const props = withDefaults(defineProps<InfoProps>(), {
  config: () => ({})
})

// 列表
const dataList = ref([{ name: '系统盘镜像', config: '', number: 1 }])

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '产品名称', prop: 'name' },
  { label: '配置', prop: 'config', useSlot: true },
  { label: '数量', prop: 'number' }
]
</script>

<style scoped lang="scss">
.create-info {
  width: calc(100% - 40px);
  background-color: white;
  padding: 20px;
  .create-info-content {
    margin-left: 10px;
  }
}
</style>