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
      <el-option
        v-for="item in optionList"
        :key="item.value"
        :label="item[primaryLabel]"
        :value="item[primaryKey]"
      >
      </el-option>
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
  primaryKey?: string // 下拉框主键
  primaryLabel?: string
  optionList?: any[] // 下拉菜单数组
}

const props = withDefaults(defineProps<IdealSelectOptionProp>(), {
  prefixTitle: '',
  placeholderTip: '搜索',
  primaryKey: 'value',
  primaryLabel: 'label',
  optionList: () => []
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
// 
watch(searchValue, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    selectValue.value = newValue
    selectValueRef?.value?.blur()
    if (newValue) {
      emits(EventEnum.select, newValue)
    }
  }
})
// 搜索框内容变化时
// const searchData = (value: string) => {
//   let arr = []
//   if (value) {
//     arr = props.optionList.filter(
//       item => item[props.primaryKey].indexOf(value) !== -1
//     )
//   } else {
//     arr = props.optionList
//   }
//   optionArray.value = arr
// }

enum EventEnum {
  select = 'clickSelect'
}
interface EventEmits {
  (e: EventEnum.select, v: string): void
}
const emits = defineEmits<EventEmits>()
// 直接点击下拉菜单元素
const selectType = (item: any) => {
  
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
