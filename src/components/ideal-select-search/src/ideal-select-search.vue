<template>
  <div class="flex-row select-search__container">
    <el-input v-model="search" :placeholder="placeholder" class="ideal-default-margin-right">
      <template #prepend>
        <el-select
          v-if="isSelect"
          v-model="selectType"
          placeholder="请选择"
          style="width: 100px;height: 34px;"
          @change="selectChange"
        >
          <el-option
            v-for="(item, index) of options"
            :key="index + 'selectSearch'"
            :label="item.label"
            :value="item.prop"
          >
          </el-option>
        </el-select>

        <template v-else>{{ prefixTitle }}</template>
      </template>

      <template #suffix>
        <svg-icon
          v-if="showSuffixSearch"
          style="cursor: pointer"
          icon="search-icon"
          @click="handleSearch"
        />
      </template>
    </el-input>

    <template v-for="item of slotArray" :key="item">
      <slot :name="item"></slot>
    </template>

    <div
      v-if="showSearchBtn"
      class="flex-row custom-button"
      @click="handleSearch"
    >
      <span class="label-font-size">{{ searchBtnTitle }}</span>
    </div>

    <div
      v-if="showResetBtn"
      class="flex-row custom-button reset-button"
      @click="handleReset"
    >
      <span class="label-font-size">{{ resetBtnTitle }}</span>
    </div>
  </div>
</template>

<script setup lang="ts" name="IdealSelectSearch">
/**
 * 下拉框选择搜索
 */
import { ElMessage } from 'element-plus/es'
import type { IdealTextProp } from '@/types'
import { SearchTypeEnum } from '@/utils/enum'

// 下拉选择输入框属性
interface IdealSelectSearch {
  placeholder?: string // 搜索框提示
  options?: IdealTextProp[] // 下拉框选项
  searchBtnTitle?: string // 搜索按钮标题
  resetBtnTitle?: string // 重置按钮标题
  searchType?: SearchTypeEnum // 搜索类型
  prefixTitle?: string // 标题搜索
  slotArray?: string[] // 插槽
  isRequired?: boolean // 输入框是否必须输入值才能搜索
  showSuffixSearch?: boolean // 显示输入框尾部搜索按钮
  showSearchBtn?: boolean // 显示搜索按钮
  showResetBtn?: boolean // 显示重置按钮
  defaultAssign?: boolean //是否默认赋值
}
// 传参
const props = withDefaults(defineProps<IdealSelectSearch>(), {
  placeholder: '请输入搜索内容',
  options: () => [],
  searchBtnTitle: '搜索',
  resetBtnTitle: '重置',
  searchType: SearchTypeEnum.select,
  prefixTitle: '',
  slotArray: () => [],
  isRequired: false,
  showSuffixSearch: false,
  showSearchBtn: true,
  showResetBtn: true,
  defaultAssign: false
})
// 是否下拉框选择
const isSelect = computed(() => props.searchType === SearchTypeEnum.select)

// 事件枚举
enum EventType {
  search = 'clickSearch', // 搜索
  reset = 'clickReset', // 重置
  change = 'selectChange'
}
interface SearchEmits {
  (e: EventType.search, search: string, type: string): void
  (e: EventType.reset): void
  (e: EventType.change, val: string): void
}
const emit = defineEmits<SearchEmits>()

const search = ref('') // 搜索值
const selectType = ref('')
const handleSearch = () => {
  if (props.isRequired) {
    if (!search.value) {
      return ElMessage.warning('请输入搜索内容')
    }
    // 校验下拉选择
    if (isSelect.value) {
      if (!selectType.value) {
        return ElMessage.warning('请选择搜索类型')
      }
    }
  }
  emit(EventType.search, search.value, selectType.value)
}

const handleReset = () => {
  // 将输入框和下拉框重置
  search.value = ''
  if (!props.defaultAssign) {
    selectType.value = ''
  }
  emit(EventType.reset)
}

//前缀选择发生改变时
const selectChange = (val: string) => {
  emit(EventType.change, val)
}

watch(
  () => props.options,
  arr => {
    if (arr.length && props.defaultAssign) {
      selectType.value = arr[0].prop
    }
  },
  { deep: true, immediate: true }
)
</script>

<style lang="scss" scoped>
.select-search__container {
  padding: 0;
  :deep(.el-select .el-input) {
    width: 120px;
  }
  :deep(.el-input-group) {
    width: 320px;
  }
  :deep(.el-select .el-input__inner:focus) {
    border-color: transparent !important;
  }
  :deep(.el-select .el-input.is-focus) {
    border-color: transparent !important;
  }
  :deep(.el-input-group--prepend .el-input-group__prepend .el-select .el-select__wrapper) {
    height: 34px;
  }
  .custom-button {
    border: 1px solid var(--el-color-primary);
    border-radius: $circleRadiusSize;
    color: var(--el-color-primary);
    cursor: pointer;
    align-items: center;
    padding: 0 12px;
    &:hover {
      background-color: var(--theme-menu-hover-bg-color);
    }
  }
  .reset-button {
    border: 1px solid $gray5-light;
    background: white;
    color: var(--el-button-text-color);
    margin: 0 10px;
    &:hover {
      border-color: var(--el-border-color-light);
    }
  }
  .label-font-size {
    font-size: $defaultFontSize;
  }
}
</style>
