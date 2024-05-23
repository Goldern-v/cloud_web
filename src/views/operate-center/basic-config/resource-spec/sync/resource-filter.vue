<template>
  <div class="flex-row custom-select-option">
    <el-popover
      ref="popoverRef"
      placement="bottom"
      width="450px"
      trigger="click"
      @hide="clickHide">
      <template #reference>
        <div class="flex-row">
          <div class="prefix-box">资源筛选</div>
          <el-input
            v-model="selectValue"
            :placeholder="placeholderTip"
            class="input-with-select"
            @focus="clickFocus"
          >
            <template #suffix>
              <svg-icon icon="down-arrow"></svg-icon>
            </template>
          </el-input>
        </div>
      </template>

      <div class="flex-row resource-pool-table">
        <el-scrollbar :height="maxScrollerHeight" class="resource-pool-table-scroller">
          <div class="all-select" @click="clickAllType">全部</div>
          <div v-for="(item, index) of categoryList" :key="index + 'type'" class="flex-row resource-pool-table-item" @click="clickCategoryList(index)">
            <div>{{item.name}}</div>
            <svg-icon icon="right-arrow"></svg-icon>
          </div>
        </el-scrollbar>

        <el-scrollbar :height="maxScrollerHeight" class="resource-pool-table-scroller">
          <div class="all-select" @click="clickAllVendor">全部云资源</div>
          <div v-for="(item, index) of typeList" :key="index + 'vendor'" class="flex-row resource-pool-table-item" @click="clickTypeList(index)">
            <el-image :src="item.iconUrl" style="width: 20px;height:20px;"/>
            <div>{{item.name}}</div>
            <svg-icon icon="right-arrow"></svg-icon>
          </div>
        </el-scrollbar>

        <el-scrollbar :height="maxScrollerHeight" class="resource-pool-table-scroller">
          <div class="all-select" @click="clickAllResourceBundle">全部资源池</div>
          <div v-for="(item, index) of resourcePoolList" :key="index + 'resource'" class="flex-row resource-pool-table-item" @click="clickResourceBundleList(index)">
            <div>{{item.name}}</div>
          </div>
        </el-scrollbar>
      </div>
    </el-popover>
    
  </div>
</template>

<script setup lang="ts">
/**
 * el-select下拉菜单自定义, 下拉菜单添加输入框
 * el-option必须要有,所以设置hidden
 */
import store from '@/store'
import { queryResourcePool, resourcePoolGrade } from '@/api/java/public'

interface IdealSelectOptionProp {
  placeholderTip?: string // 输入框提示
  primaryKey?: string // 下拉框主键
  primaryLabel?: string
  optionList?: any[] // 下拉菜单数组
}

withDefaults(defineProps<IdealSelectOptionProp>(), {
  placeholderTip: '请选择内容',
  primaryKey: 'key',
  primaryLabel: 'label',
  optionList: () => ([])
})
onMounted(() => {
  // getResourcePool()
  resourcePool()
})
// 类别
const categoryList = ref<any[]>([])
// 类别
const typeList = ref<any[]>([])
// 资源池
const resourcePoolList = ref<any[]>([])
// 获取资源池列表
const resourcePool = () => {
  const vdcId = store.userStore.user.vdcId
  resourcePoolGrade({ vdcId }).then((res: any) => {
    const { data, code } = res
    if (code === 200) {
      categoryList.value = data
      if (data.length) {
        typeList.value = data[0].cloudPlatformTypes
        if (typeList.value.length) {
          resourcePoolList.value = data[0].cloudPlatformTypes[0].cloudResourcePools
        }
      }
    } else {
      categoryList.value = []
    }
  }).catch(_ => {
    categoryList.value = []
  })
}

// 列表最大高
const maxScrollerHeight = ref('200px')

const popoverRef = ref()

const clickAllType = () => {
  closePopover('cloudPlatformCategory', '')
}

// 选择私有云还是公有云等
const clickCategoryList = (index: number) => {
  // 防止重选的时候有脏数据
  typeList.value = []
  resourcePoolList.value = []
  if(categoryList.value.length) {
    typeList.value = categoryList.value[index]?.cloudPlatformTypes
  } 
  if (typeList.value.length) {
    resourcePoolList.value = typeList.value[0]?.cloudResourcePools
  }
}
const clickAllVendor = () => {
  closePopover('cloudPlatformType', '')
}
// 选择阿里云还是华为云等
const clickTypeList = (index: number) => {
  resourcePoolList.value = []
  if (typeList.value.length) {
    resourcePoolList.value = typeList.value[index]?.cloudResourcePools
  }
}
const clickAllResourceBundle = () => {
  closePopover('resourcePoolId', '')
}
// 选择资源池
const clickResourceBundleList = (index: number) => {
  closePopover('resourcePoolId', resourcePoolList.value[index])
}
const closePopover = (type: string, select: any) => {
  let result = select
  if (type === 'cloudPlatformCategory') {
    selectValue.value = '全部'
  } else if (type === 'cloudPlatformType') {
    selectValue.value = '全部云资源'
  } else if (type === 'resourcePoolId') {
    selectValue.value = '全部资源池'
    if (select) {
      selectValue.value = select.name
      result = select.id
    }
  }
  showResource.value = false
  inputDisabled.value = false
  emits(EventEnum.select, type, (result as string))
  popoverRef.value.hide()
}
// 输入框选择值
const selectValue = ref('')
// 显示资源选择列表
const showResource = ref(false)
const inputDisabled = ref(false)
const clickHide = () => {
  showResource.value = false
  inputDisabled.value = false
}
const clickFocus = () => {
  showResource.value = true
  inputDisabled.value = true
}

enum EventEnum {
  select = 'clickSelectTable'
}
interface EventEmits {
  (e: EventEnum.select, type: string, v: string): void
}
const emits = defineEmits<EventEmits>()

// 清空
const clearSelect = () => {
  selectValue.value = ''
}
defineExpose({
  clearSelect
})
</script>

<style scoped lang="scss">
:deep(.el-popover.el-popper) {
  padding: 0;
}
.custom-select-option {
  width: 100%;
  align-items: center;
  .prefix-box {
    background-color: #EEEEEE;
    padding: 0 10px;
    height: 34px;
    line-height: 34px;
    color: #5E5E5E;
    border-radius: var(--el-border-radius-base) 0 0 var(--el-border-radius-base);
  }
  .input-with-select {
    width: 200px;
    :deep(.el-input__wrapper) {
      border-radius: 0 var(--el-border-radius-base) var(--el-border-radius-base) 0;
    }
  }
}
.resource-pool-table {
  width: 100%;
  .resource-pool-table-item:last-child {
    border-right: 0 ;
  }
  .resource-pool-table-scroller {
    width: 33.3%;
    border-right: 1px solid #eee;
    .resource-pool-table-item {
      cursor: pointer;
      justify-content: space-between;
      align-items: center;
      padding: 5px 10px;
      margin: 0 10px;
      border-bottom: 1px solid #eee;
      text-align: center;
      border-radius: 4px;
    }
  }
  :deep(.resource-pool-table-scroller:last-child) {
    border-right: 0 ;
  }
  .all-select {
    margin: 0 10px;
    padding: 5px 0;
    border-bottom: 1px solid #eee;
    cursor: pointer;
  }
}

ul li {
  list-style-type: none;
}
</style>
