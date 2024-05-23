<template>
  <div class="delete-file">
    <div class="ideal-tip-text">确定要删除以下文件系统吗？</div>
    <div class="ideal-tip-text">删除前请先登录云服务器卸载已挂载的文件系统。</div>
    <div class="ideal-tip-text">删除后将无法恢复，请谨慎操作。</div>
    <div class="ideal-tip-text">建议您删除前创建一个备份文件，并将备份文件下载至本地保存。<span class="ideal-theme-text">立即备份</span></div>

    <ideal-table-list
      :table-data="dataList"
      :table-headers="tableHeaders"
      :show-pagination="false"
    ></ideal-table-list>
  </div>
</template>

<script setup lang="ts">
import type { IdealTableColumnHeaders } from '@/types'

interface DeleteFileProps {
  rowData?: any
}
const props = withDefaults(defineProps<DeleteFileProps>(), {
  rowData: () => ({})
})

const dataList = ref<any[]>([])
onMounted(() => {
  dataList.value = [props.rowData]
})

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: '创建时间', prop: 'createTime' },
  { label: '状态', prop: 'status', useSlot: true }
]
</script>

<style scoped lang="scss">
.delete-file {
  width: 100%;
}
</style>
