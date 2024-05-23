<template>
  <div class="question-drawer">
    <el-drawer
      v-model="drawer"
      :title="drawerTitle"
      direction="rtl"
      :before-close="handleClose"
      :size="drawerSize"
    >
      <billing-mode v-if="showBilling"/>
      <available-area v-else-if="showAvailableArea"/>
      <architecture v-else-if="showArchitecture"/>
      <disk v-else-if="showDisk" />
      <create-safe-group v-else-if="showCreateSafeGroup" @clickCancelEvent="clickCancelEvent" @clickSuccessEvent="clickSuccessEvent"/>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import billingMode from './billing-mode.vue'
import availableArea from './available-area.vue'
import architecture from './architecture.vue'
import disk from './disk.vue'
import createSafeGroup from '../../safe-group/create.vue'

interface RegionDrawerProps {
  showDrawer?: boolean
  type?: string
}
const props = withDefaults(defineProps<RegionDrawerProps>(), {
  showDrawer: false,
  type: ''
})
const handleClose = () => {
  drawer.value = false
}

const drawer = computed({
  get: () => props.showDrawer,
  set: val => {
    emit('update:showDrawer', val)
  }
})
// 安全组创建取消
const clickCancelEvent = () => {
  drawer.value = false
}
/// 安全组创建确定
const clickSuccessEvent = () => {
  drawer.value = false
}

const drawerSize = ref(600)
const showBilling = computed(() => props.type === 'billingMode')
const showAvailableArea = computed(() => props.type === 'availableArea')
const showArchitecture = computed(() => props.type === 'architecture')
const showDisk = computed(() => props.type === 'disk')
const showCreateSafeGroup = computed(() => props.type === 'createSafeGroup')

watch(() => props.type, value => {
  if (value) {
    initDrawer()
  }
})
const drawerTitle = ref('')
const initDrawer = () => {
  if (showBilling.value) {
    drawerTitle.value = '计费说明'
  } else if (showAvailableArea.value) {
    drawerTitle.value = '可用区说明'
  } else if (showArchitecture.value) {
    drawerTitle.value = 'CPU架构说明'
  } else if (showDisk.value) {
    drawerTitle.value = '磁盘说明'
  } else if (showCreateSafeGroup.value) {
    drawerTitle.value = '创建安全组'
  }
}

// 方法
interface EventEmits {
  (e: 'update:showDrawer', v: any): void
}
const emit = defineEmits<EventEmits>()
</script>

<style scoped lang="scss">
.question-drawer {
  width: 100%;
  :deep(.el-drawer__title) {
    font-size: $largeFontSize;
    font-weight: 500;
  }
}
</style>
