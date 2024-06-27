<template>
  <div class="cloud-host-create">
    <general-create
      v-if="isPublic || isPrivateHuawei"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <vmwareCreate
      v-else-if="isPrivateVmware"
      @clickSuccessEvent="clickSuccessEvent"
    />
  </div>
</template>

<script setup lang="ts">
import generalCreate from './components/create.vue'
import vmwareCreate from './vmware/create.vue'
import { useResourcePool } from '@/utils/common/resource'

const {
  isPublic,
  isPrivateVmware,
  isPrivateHuawei
} = useResourcePool()

const router = useRouter()
const clickSuccessEvent = () => {
  router.push({ path: '/multi-cloud/cloud-host/list' })
}
</script>

<style lang="scss" scoped>
:deep(.el-step__title.is-success) {
  color: var(--el-color-primary);
}
:deep(.el-step__head.is-success) {
  color: var(--el-color-primary);
  border-color: var(--el-color-primary);
}
.cloud-host-create {
  box-sizing: border-box;
  margin: $idealMargin $idealMargin 80px;
  .cloud-host-create-steps {
    margin-bottom: $idealPadding;
  }
}
</style>
