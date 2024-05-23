<template>
  <div class="flex-row input-select-search__container">
    <div :style="{ width: selectBoxWidth }" class="input-with-select">
      <el-input v-model="filterName" readonly>
        <template #append>
          <el-select
            v-model="selectValue"
            :clearable="!defaultAssign"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="(item, index) of options"
              :key="index + 'selectSearch'"
              :label="item[filter.selectLabel]"
              :value="item[filter.searchValue]"
            >
            </el-option>
          </el-select>
        </template>
      </el-input>
    </div>

    <template v-for="item of slotArray" :key="item">
      <slot :name="item"></slot>
    </template>

    <div class="flex-row custom-button" @click="handleSearch">
      <!-- <svg-icon icon="search-icon"></svg-icon> -->
      <span>{{ searchBtnTitle }}</span>
    </div>

    <div class="flex-row custom-button reset-button" @click="handleReset">
      <span>{{ resetBtnTitle }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
//复合输入框自定义属性
interface filterForm {
  options?: any[] // 下拉框选项
  filter?: {
    name: string
    type: string
    searchValue: string
    selectLabel: string
  } //select自定义表头(name字段用来展示表头文字，type:传参的对应字段，searchValue下拉框绑定值，searchName下拉框展示名称)
  searchBtnTitle?: string // 搜索按钮标题
  resetBtnTitle?: string // 重置按钮标题
  slotArray?: string[] // 插槽
  selectBoxWidth?: string
  defaultAssign?: boolean
}
const props = withDefaults(defineProps<filterForm>(), {
  options: () => [],
  slotArray: () => [], // 插槽
  searchBtnTitle: '搜索',
  resetBtnTitle: '重置',
  filter: () => ({
    name: '',
    type: '',
    searchValue: '',
    selectLabel: ''
  }),
  selectBoxWidth: '19%', //搜索框宽度
  defaultAssign: false
})
const filterName = computed(() => props.filter.name)

// 事件枚举
enum EventType {
  search = 'clickSearch', // 搜索
  reset = 'clickReset' // 重置
}
interface SearchEmits {
  (e: EventType.search, search: string, type: string): void
  (e: EventType.reset): void
}
const emit = defineEmits<SearchEmits>()
const selectValue = ref('')
//搜索
const handleSearch = () => {
  emit(EventType.search, selectValue.value, props.filter.type)
}
const handleReset = () => {
  // 下拉框重置
  if (!props.defaultAssign) {
    selectValue.value = ''
  }
  emit(EventType.reset)
}

watch(
  () => props.options,
  value => {
    if (props.options.length && props.defaultAssign) {
      selectValue.value = props.options[0][props.filter.searchValue]
    }
  },
  { deep: true }
)
</script>
<style lang="scss" scoped>
.input-select-search__container {
  flex-wrap: wrap;
  box-sizing: border-box;
  :deep(.el-input__wrapper) {
    width: 25%;
    padding: 1px 10px;
  }
  :deep(
      .el-input-group--append
        .el-input-group__append
        .el-select
        .el-select__wrapper
    ) {
    height: 34px;
  }
  :deep(.el-select .el-input__wrapper:focus) {
    border-color: transparent !important;
  }
}
.input-with-select {
  margin: 0px 10px 10px 0;
  :deep .el-input__wrapper {
    background-color: var(--el-fill-color-light);
  }
  :deep(.el-input-group__append) {
    width: 80%;
    background-color: var(--el-fill-color-blank);
    padding: 0;
  }
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
  margin: 0px 10px 10px 0;
}
.reset-button {
  border: 1px solid var(--el-border-color-light);
  background: white;
  color: var(--el-button-text-color);
  &:hover {
    border-color: var(--el-border-color-light);
  }
  margin: 0px 10px 10px 0;
}
</style>
