<template>
  <div class="flex-row flex-row-center">
    <div class="ideal-search">
      <div class="flex-row flex-center">
        <div class="ideal-search-result">
          <svg-icon
            icon="search-icon"
            class="ideal-svg-margin-right ideal-svg-margin-left"
            @click="clickSearch"
          />

          <div
            v-for="(item, index) of searchResult"
            :key="index"
            class="flex-row ideal-search-result-item"
          >
            <div class="ideal-search-result-item-label">{{ item.label }}</div>
            <svg-icon
              icon="close-icon"
              style="cursor: pointer"
              @click="clickDeleteSearchResult(index)"
            />
          </div>

          <div class="flex-row flex-center" style="flex: 1">
            <div
              v-if="!isEdit"
              class="ideal-search-replace ideal-tip-text"
              @click="clickInput"
            >
              {{ inputTip }}
            </div>

            <el-input
              v-else
              ref="inputRef"
              v-model="search"
              @change="listenEnter"
            >
            </el-input>

            <svg-icon
              v-if="searchResult.length"
              icon="close-icon"
              class="ideal-svg-margin-right"
              @click="clickDeleteAll"
            />
          </div>
        </div>

        <el-popover
          v-if="visible"
          ref="popoverRef"
          placement="bottom-start"
          width="180"
          popper-class="custom-popover"
          :virtual-ref="inputRef"
          :show-arrow="false"
          :visible="visible"
          virtual-triggering
          trigger="click"
          @before-leave="hidePopver"
        >
          <el-scrollbar
            v-if="visibleList"
            :style="{ height: maxScrollerHeight }"
          >
            <div
              v-for="(item, idx) of selectFilterItem?.array"
              :key="idx"
              style="padding: 2px 0"
              @click="clickList(item)"
            >
              {{ item[selectFilterItem?.arrayProp as string] }}
            </div>
          </el-scrollbar>

          <div v-else-if="visibleDate">
            <div>开始日期</div>
            <el-date-picker
              v-model="startDate"
              style="width: 150px"
              type="datetime"
              placeholder="请选择开始日期"
              :format="dateFormat"
              :value-format="dateFormat"
            />
            <div>结束日期</div>
            <el-date-picker
              v-model="endDate"
              style="width: 150px"
              type="datetime"
              placeholder="请选择结束日期"
              :format="dateFormat"
              :value-format="dateFormat"
            />
            <div class="flex-row" style="margin-top: 5px">
              <el-button link type="primary" @click="clickSureDate"
                >确定</el-button
              >
              <el-button link @click="clickCancelDate">取消</el-button>
            </div>
          </div>

          <div v-else-if="visibleTreeSelect">
            <el-tree
              ref="selectTree"
              class="treeStyle"
              :check-on-click-node="true"
              :highlight-current="true"
              :default-expand-all="true"
              :data="selectFilterItem?.array"
              :props="selectFilterItem?.props"
              node-key="id"
              :show-checkbox="false"
              :check-strictly="true"
              :expand-on-click-node="false"
              @check="handleTreeNodeClick"
            />
          </div>

          <div v-else v-click-outside="clickOutside">
            <div class="ideal-search-title">属性类型</div>
            <el-scrollbar :height="maxScrollerHeight">
              <div
                v-for="(item, index) of dataArray"
                :key="index"
                class="ideal-search-label"
                @click.stop="clickSelectType(item)"
              >
                {{ item.label }}
              </div>
            </el-scrollbar>
          </div>
        </el-popover>
      </div>
    </div>

    <div
      class="right-container"
      :style="hasRightSlot ? 'margin-left:10px' : ''"
    >
      <slot name="right-btn"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IdealSearch, IdealTextProp, IdealSearchResult } from '@/types'
import { FiltrateEnum } from '@/utils/enum'
import { ClickOutside as vClickOutside } from 'element-plus'
import { usePlatform } from '@/utils/common/resource'

interface IdealSearchProps {
  inputPlaceholder?: string
  typeArray?: IdealSearch[] // 弹出框 筛选条件
  data?: any // 筛选条件数组(根据 IdealSearch )
  exitSearchResult?: IdealTextProp[] //已默认存在的搜索条件
  dateFormat?: string
  showCategory?: boolean
  categoryLabel?: string
  showPlatformType?: boolean
  platformTypeLabel?: string
  showResourcePool?: boolean
  resourcePoolLabel?: string
}
const props = withDefaults(defineProps<IdealSearchProps>(), {
  inputPlaceholder: '默认按照名称搜索、过滤',
  typeArray: () => [] as IdealSearch[],
  data: () => ({}),
  exitSearchResult: () => [] as IdealTextProp[],
  dateFormat: 'YYYY-MM-DD HH:mm:ss',
  showCategory: true,
  categoryLabel: '云平台类别',
  showPlatformType: true,
  platformTypeLabel: '云平台类型',
  showResourcePool: true,
  resourcePoolLabel: '资源池'
})
// 搜索条件数组
const dataArray = ref<any[]>([])
onMounted(() => {
  inputTip.value = props.inputPlaceholder
  dataArray.value = props.typeArray
  handlePlatform()
})

watch(
  () => props.typeArray,
  val => {
    dataArray.value = val
  }
)
// 添加云平台类别、云平台类型和资源池
const handlePlatform = () => {
  if (props.showCategory) {
    addCategory()
  }

  if (props.showPlatformType) {
    addPlatformType()
  }

  if (props.showResourcePool) {
    addResourcePool()
  }
}
// 添加云平台类别搜索条件
const addCategory = () => {
  const category = {
    label: props.categoryLabel,
    prop: 'cloudCategory',
    type: FiltrateEnum.list,
    array: [],
    arrayProp: 'name',
    arrayKey: 'cloudCategory'
  }
  const haveCategory = dataArray.value.some(
    (item: any) => item.prop === 'cloudCategory'
  )
  if (!haveCategory) {
    dataArray.value.push(category)
  }
}
// 添加云平台类型搜索条件
const addPlatformType = () => {
  const type = {
    label: props.platformTypeLabel,
    prop: 'cloudType',
    type: FiltrateEnum.list,
    array: [],
    arrayProp: 'name',
    arrayKey: 'cloudType'
  }
  const haveType = dataArray.value.some(
    (item: any) => item.prop === 'cloudType'
  )
  if (!haveType) {
    dataArray.value.push(type)
  }
}
// 添加资源池搜索条件
const addResourcePool = () => {
  const pool = {
    label: props.resourcePoolLabel,
    prop: 'resourcePoolId',
    type: FiltrateEnum.list,
    array: [],
    arrayProp: 'name',
    arrayKey: 'id'
  }
  const havePool = dataArray.value.some(
    (item: any) => item.prop === 'resourcePoolId'
  )
  if (!havePool) {
    dataArray.value.push(pool)
  }
}
// 云平台
const { categoryList, typeList, resourcePoolList } = usePlatform()
watch(
  () => [categoryList.value, typeList.value, resourcePoolList.value],
  value => {
    dataArray.value.forEach((item: any) => {
      if (item.prop === 'cloudCategory') {
        item.array = value[0]
      } else if (item.prop === 'cloudType') {
        item.array = value[1]
      } else if (item.prop === 'resourcePoolId') {
        let tempArr: any[] = []
        tempArr = tempArr.concat(value[2])
        item.array = tempArr
      }
    })
  }
)

// 列表最大高
const maxScrollerHeight = ref('112px')

const slots = useSlots()
const hasRightSlot: Ref<boolean> = computed(() => !!slots['right-btn'])

// 已添加搜索条件
const searchResult = ref<IdealSearchResult[]>([])
const inputTip = ref('')
watch(
  () => searchResult.value,
  value => {
    inputTip.value = props.inputPlaceholder || '默认按照名称搜索、过滤'
    if (value.length) {
      inputTip.value = '添加筛选条件'
    }
  },
  { deep: true }
)

watch(
  () => props.exitSearchResult,
  arr => {
    if (arr.length) {
      searchResult.value = arr
      emit(EventType.search, searchResult.value)
    }
  },
  { deep: true }
)

// 搜索
const clickSearch = () => {
  emit(EventType.search, searchResult.value)
}

// 是否编辑 显示输入框,修复焦点获取和失去时弹出框有问题
const isEdit = ref(false)
// 切换div和el-input显示
const clickInput = () => {
  visible.value = true
  isEdit.value = true
}
// 显示弹出框
const visible = ref(false)
const inputRef = ref()

// el-popver关闭前执行 消除弹框闪屏问题
const hidePopver = () => {
  visible.value = false
  setTimeout(() => {
    visible.value = true
  }, 10)
}
// 点击空白关闭el-popover
const clickOutside = () => {
  visible.value = false
  isEdit.value = false
}

// 所选筛选条件
const selectFilterItem = ref<IdealSearch>()
// 选择属性类型
const clickSelectType = (item: IdealSearch) => {
  search.value = item.label + '：'
  selectFilterItem.value = item

  if (item.type === FiltrateEnum.list && item.array?.length) {
    visibleList.value = true
  } else if (item.type === FiltrateEnum.date) {
    visibleDate.value = true
  } else if (item.type === FiltrateEnum.input) {
    visible.value = false
    inputRef.value.blur()
  } else if (item.type === FiltrateEnum.treeSelect) {
    visibleTreeSelect.value = true
  }
}
// enter回车键
const listenEnter = () => {
  const temp = search.value.split('：')
  searchResult.value.forEach((item, index) => {
    if (item.label.includes(temp[0])) {
      searchResult.value.splice(index, 1)
    }
  })

  if (search.value) {
    searchResult.value.push({
      prop: selectFilterItem.value?.prop || '',
      label: search.value,
      value: temp[1]
    })
  }
  search.value = ''
  visible.value = false
  isEdit.value = false

  emit(EventType.search, searchResult.value)
}

// 输入框搜索值
const search = ref('')

// 列表
const visibleList = ref(false)
const clickList = (row: any) => {
  searchResult.value.forEach((item, index) => {
    if (item.label.includes(search.value)) {
      searchResult.value.splice(index, 1)
    }
  })
  searchResult.value.push({
    prop: selectFilterItem.value?.prop || '',
    label: `${search.value}${row[selectFilterItem.value?.arrayProp as string]}`,
    value: row[selectFilterItem.value?.arrayKey as string]
  })
  visible.value = false
  visibleList.value = false
  search.value = ''
  isEdit.value = false

  emit(EventType.search, searchResult.value)
  emit(EventType.clickList, selectFilterItem.value!.prop, row)
}
// 树ref
const selectTree = ref()
const visibleTreeSelect = ref(false)
//选中树形结构确定事件
const handleTreeNodeClick = (data: any, checkObj: any) => {
  if (checkObj.checkedKeys.length != 0) {
    if (checkObj.checkedKeys.length == 2) {
      // 如果选择超过一个节点，则只保留最后一个节点
      //单选实现
      selectTree.value.setCheckedKeys([data.id])
    }
  }
  searchResult.value.forEach((item, index) => {
    if (item.label.includes(search.value)) {
      searchResult.value.splice(index, 1)
    }
  })
  searchResult.value.push({
    prop: selectFilterItem.value?.prop || '',
    label: `${search.value}${
      data[selectFilterItem.value?.props?.label as string]
    }`,
    value: data[selectFilterItem.value?.props?.value as string]
  })
  visible.value = false
  visibleTreeSelect.value = false
  search.value = ''
  isEdit.value = false
  emit(EventType.search, searchResult.value)
}

// 是否显示日期
const visibleDate = ref(false)
// 开始日期
const startDate = ref('')
// 结束日期
const endDate = ref('')
// 日期 确定事件
const clickSureDate = () => {
  if (startDate.value || endDate.value) {
    // 删除已选日期
    searchResult.value.forEach((item, index) => {
      if (item.label.includes(search.value)) {
        searchResult.value.splice(index, 1)
      }
    })
    searchResult.value.push({
      prop: selectFilterItem.value?.prop || '',
      label: `${search.value}${startDate.value}/${endDate.value}`,
      value: `${startDate.value}/${endDate.value}`
    })

    startDate.value = ''
    endDate.value = ''
  }

  visible.value = false
  visibleDate.value = false
  search.value = ''
  isEdit.value = false

  emit(EventType.search, searchResult.value)
}
// 日期 取消事件
const clickCancelDate = () => {
  search.value = ''
  isEdit.value = false
  visible.value = false
  visibleDate.value = false
}

// 删除搜索选择项
const clickDeleteSearchResult = (index: number) => {
  searchResult.value.splice(index, 1)
  emit(EventType.search, searchResult.value)
}
// 清空筛选条件
const clickDeleteAll = () => {
  searchResult.value = []
  emit(EventType.search, searchResult.value)
}
// 删除搜索条件
const deleteSearch = (type: string) => {
  searchResult.value.forEach((item, index) => {
    if (item.prop.includes(type)) {
      searchResult.value.splice(index, 1)
    }
  })
}
// 方法
enum EventType {
  search = 'clickSearch',
  clickList = 'clickList'
}
interface EventEmits {
  (e: EventType.search, v: IdealSearchResult[]): void
  (e: EventType.clickList, currentProp: string, row: any): void
}
const emit = defineEmits<EventEmits>()

defineExpose({
  clickDeleteAll,
  deleteSearch
})
</script>

<style scoped lang="scss">
.ideal-search {
  width: 100%;
  border: 1px solid var(--el-border-color);
  border-radius: $circleRadiusSize;
  flex: 1;
  .flex-center {
    align-items: center;
  }
  .ideal-search-replace {
    width: 100%;
    height: 34px; // 输入框高
    line-height: 34px;
  }
  // 隐藏输入框边框
  :deep(.el-input) {
    --el-input-border-color: white;
    --el-input-hover-border-color: white;
    --el-input-focus-border-color: white;
  }
  .ideal-search-result {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;
    .ideal-search-result-item {
      align-items: center;
      background-color: $gray3-light;
      margin: 5px 5px;
      padding: 0 5px;
      border-radius: $circleRadiusSize;
      .ideal-search-result-item-label {
        display: flex;
        align-items: center;
        white-space: nowrap;
      }
    }
  }
  :deep(.el-date-editor) {
    --el-date-editor-width: 100px;
  }
}
</style>
<style lang="scss">
.custom-popover {
  .flex-row-center {
    align-items: center;
  }
  .ideal-search-title {
    border-bottom: 1px solid var(--el-border-color);
    padding-bottom: 10px;
  }
  .ideal-search-label {
    height: 28px;
    line-height: 28px;
    padding-left: 5px;
    cursor: pointer;
    &:hover {
      color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);
    }
  }
  :deep(.el-date-editor) {
    --el-date-editor-width: 100px;
  }
}
</style>
