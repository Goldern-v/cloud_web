<template>
  <div class="custom-select-option">
    <el-select
      ref="selectValueRef"
      v-model="selectValue"
      placeholder="请选择"
      popper-class="custom-select-option__select"
      :popper-append-to-body="false"
      @visible-change="closeSelect"
    >
      <template #prefix>{{ prefixTitle }}:</template>
      <el-option value="1" hidden></el-option>

      <el-input
        v-model="searchValue"
        :placeholder="placeholderTip"
        class="custom-select-option__input"
      >
        <template #suffix>
          <svg-icon icon="search-icon" style="cursor: pointer;" @click="clickSearch"></svg-icon>
        </template>
      </el-input>
      <div
        v-for="(item, index) of optionArray"
        :key="index"
        class="custom-select-option__table"
        @click="selectType(item)"
      >
        {{ item[primaryLabel] }}
      </div>
    </el-select>
  </div>
</template>

<script setup lang="ts">
/**
 * el-select下拉菜单自定义, 下拉菜单添加输入框
 * el-option必须要有,所以设置hidden
 */

interface IdealSelectOptionProp {
  prefixTitle?: string // Select 组件头部内容
  placeholderTip?: string // 下拉菜单输入框提示
  primaryKey: string // 下拉框主键
  primaryLabel: string
  optionList: any[] // 下拉菜单数组
}

const props = withDefaults(defineProps<IdealSelectOptionProp>(), {
  prefixTitle: '',
  placeholderTip: '搜索'
})

// 获取当前el-select
const selectValueRef: any = ref(null)
// 选择结果
const selectValue = ref('')
// 下拉菜单添加的输入框值
const searchValue = ref('')
// 下拉菜单输入改变列表展示,设置此变量存放下拉菜单数组而不影响父组件值
const optionArray = ref<any>([])
onMounted(() => {
  optionArray.value = props.optionList
})
watch(
  () => props.optionList,
  value => {
    optionArray.value = value
  }
)
// 监听下拉菜单输入框
watch(searchValue, value => {
  searchData(value)
})
// 搜索框内容变化时
const searchData = (value: string) => {
  let arr = []
  if (value) {
    arr = props.optionList.filter(
      item => item[props.primaryKey].indexOf(value) !== -1
    )
  } else {
    arr = props.optionList
  }
  optionArray.value = arr
}
const clickSearch = () => {
  emits(EventEnum.search, searchValue.value)
}
// 方法
enum EventEnum {
  select = 'clickSelectTable',
  search = 'clickSearch'
}
interface EventEmits {
  (e: EventEnum.select, v: string): void
  (e: EventEnum.search, v: string): void
}
const emits = defineEmits<EventEmits>()
// 直接点击下拉菜单元素
const selectType = (item: any) => {
  selectValue.value = item[props.primaryLabel]
  selectValueRef?.value?.blur()
  emits(EventEnum.select, item[props.primaryKey])
}
// 下拉框关闭时，将搜索框内容置空
const closeSelect = (value: string) => {
  if (value) {
    searchValue.value = ''
  }
}
// 清空
const clearSelect = () => {
  selectValue.value = ''
}
defineExpose({
  clearSelect
})
</script>

<style scoped lang="scss">
.custom-select-option {
  width: 100%;
}
</style>

<style lang="scss">
// 注意:
.el-popper .custom-select-option__select {
  padding: 5px 10px;
  .custom-select-option__input {
    width: 100%;
    .el-input__wrapper {
      border-radius: 50px;
    }
  }
  .custom-select-option__table {
    padding: 5px 0;
    cursor: pointer;
  }
}
</style>
