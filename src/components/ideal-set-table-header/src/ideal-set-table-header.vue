<template>
  <div class="question-drawer">
    <el-drawer
      v-model="drawer"
      :title="drawerTitle"
      direction="rtl"
      :before-close="handleClose"
      :size="drawerSize"
    >
      <div class="setting">
        <el-input v-model="searchValue" class="ideal-middle-margin-bottom" placeholder="搜索" >
          <template #suffix>
            <svg-icon icon="search-icon" @click="clickSearch"/>
          </template>
        </el-input>

        <div v-for="(item, index) of checkboxArray" :key="index">
          <el-checkbox v-model="item.check" :label="item.label" :disabled="item.disabled"/>
        </div>

        <div class="flex-row ideal-submit-button">
          <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
          <el-button type="primary" @click="submitForm">{{ t('confirm') }}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import type { IdealTableColumnHeaders } from '@/types'

interface RegionDrawerProps {
  showDrawer?: boolean // 是否显示
  drawerTitle?: string // 名称
  drawerSize?: number // 大小
  dataArray?: IdealTableColumnHeaders[] // 多选
}
const props = withDefaults(defineProps<RegionDrawerProps>(), {
  showDrawer: false,
  drawerTitle: '自定义显示列',
  drawerSize: 300,
  dataArray: () => []
})

const { t } = useI18n()
// 多选
const checkboxArray = ref<IdealTableColumnHeaders[]>([])
onMounted(() => {
  if (props.dataArray.length) {
    checkboxArray.value = props.dataArray
  }
})
watch(() => props.dataArray, value => {
  if (value.length) {
    checkboxArray.value = props.dataArray
  }
},{ deep: true })

// 搜索值
const searchValue = ref('')
const clickSearch = () => {
  handleSearch()
}
watch(() => searchValue, value => {
  handleSearch()
},{ deep: true })
const handleSearch = () => {
  const arr = props.dataArray.filter((item: IdealTableColumnHeaders) => item.label.includes(searchValue.value))
  checkboxArray.value = arr
}

const handleClose = () => {
  drawer.value = false
}

const drawer = computed({
  get: () => props.showDrawer,
  set: val => {
    emit('update:showDrawer', val)
  }
})

const cancelForm = () => {
  drawer.value = false
}

const submitForm = () => {
  drawer.value = false
  emit('onClickSubmit', checkboxArray.value)
}
// 方法
interface EventEmits {
  (e: 'update:showDrawer', v: any): void
  (e: 'onClickSubmit', v: IdealTableColumnHeaders[]): void
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
