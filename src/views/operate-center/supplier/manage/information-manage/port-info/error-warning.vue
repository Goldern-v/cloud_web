<template>
  <div class="error-warning">
    <el-popover
      placement="right"
      trigger="hover"
      width="200"
      :content="content"
    >
      <template #reference>
        <el-icon
          ><CircleCloseFilled color="var(--el-color-danger)"
        /></el-icon> </template
    ></el-popover>
  </div>
</template>

<script setup lang="ts">
import { CircleCloseFilled } from '@element-plus/icons-vue'

const props = defineProps<{ content: string }>()
</script>

<style lang="scss" scoped>
.error-warning {
  margin-left: 2px;
}
</style>
