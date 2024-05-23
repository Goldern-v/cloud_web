<template>
  <div class="flex-row custom-select-option">
    <el-popover
      ref="popoverRef"
      placement="bottom"
      :width="popoverWidth"
      trigger="click"
      popper-class=""
      @hide="clickHide"
    >
      <template #reference>
        <div class="flex-row">
          <div class="prefix-box">资源筛选</div>
          <el-input
            v-model="selectValue"
            :placeholder="placeholderTip"
            :disabled="inputDisabled"
            class="input-with-select"
            @focus="clickFocus"
          >
            <template #suffix>
              <svg-icon icon="down-arrow"></svg-icon>
            </template>
          </el-input>
        </div>
      </template>

      <div v-if="showResource" class="flex-row resource-pool-table">
        <el-scrollbar
          :height="maxScrollerHeight"
          class="resource-pool-table-scroller"
        >
          <div class="all-select" @click="clickAllType">全部</div>
          <div
            v-for="(item, index) of typeList"
            :key="index + 'type'"
            class="flex-row resource-pool-table-item"
            @click="clickTypeList(index)"
          >
            <div>{{ item.des }}</div>
            <svg-icon icon="right-arrow"></svg-icon>
          </div>
        </el-scrollbar>

        <el-scrollbar
          v-if="showVendor"
          :height="maxScrollerHeight"
          class="resource-pool-table-scroller"
        >
          <div class="all-select" @click="clickAllVendor">全部云资源</div>
          <div
            v-for="(item, index) of vendorList"
            :key="index + 'vendor'"
            class="flex-row resource-pool-table-item"
            @click="clickVendorList(index)"
          >
            <el-image :src="item.iconUrl" style="width: 20px; height: 20px" />
            <div>{{ item.des }}</div>
            <svg-icon icon="right-arrow"></svg-icon>
          </div>
        </el-scrollbar>

        <el-scrollbar
          v-if="showResourceBundle"
          :height="maxScrollerHeight"
          class="resource-pool-table-scroller"
        >
          <div class="all-select" @click="clickAllResourceBundle">
            全部资源池
          </div>
          <div
            v-for="(item, index) of resourceBundleList"
            :key="index + 'resource'"
            class="flex-row resource-pool-table-item"
            @click="clickResourceBundleList(index)"
          >
            <div>{{ item.name }}</div>
          </div>
        </el-scrollbar>

        <el-scrollbar
          v-if="showRegion"
          :height="maxScrollerHeight"
          class="resource-pool-table-scroller"
        >
          <div class="all-select" @click="clickAllResourceBundle">全部区域</div>
          <div
            v-for="(item, index) of regionList"
            :key="index + 'resource'"
            class="flex-row resource-pool-table-item"
            @click="clickRegionList(index)"
          >
            <div>{{ item.name }}</div>
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
import { queryResourcePool } from '@/api/java/public'

const popoverWidth = ref('150px')

interface IdealSelectOptionProp {
  placeholderTip?: string // 输入框提示
  primaryKey?: string // 下拉框主键
  primaryLabel?: string
  optionList?: any[] // 下拉菜单数组
}

const props = withDefaults(defineProps<IdealSelectOptionProp>(), {
  placeholderTip: '请选择内容',
  primaryKey: 'key',
  primaryLabel: 'label',
  optionList: () => []
})
onMounted(() => {
  getResourcePool()
})
// 列表最大高
const maxScrollerHeight = ref('150px')
const showResourceBundle = ref(false)
const showVendor = ref(false)
const showRegion = ref(false)
// 公有云私有云
const typeList: any = ref([])
// 阿里云腾讯云
const vendorList: any = ref([])
// 资源池
const resourceBundleList: any = ref([])
//区域
const regionList: any = ref([])

const popoverRef = ref()
// 获取资源数据
const getResourcePool = () => {
  queryResourcePool()
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        typeList.value = data?.typeList
        vendorList.value = typeList.value[0]?.vendorList
        resourceBundleList.value = vendorList.value[0]?.resourceBundleList
        regionList.value = resourceBundleList.value[0]?.regionList
      } else {
        typeList.value = []
        vendorList.value = []
        resourceBundleList.value = []
        regionList.value = []
      }
    })
    .catch(_ => {
      typeList.value = []
      vendorList.value = []
      resourceBundleList.value = []
    })
}

const clickAllType = () => {
  closePopover('cloudPlatformCategory', '')
}
// 选择私有云还是公有云等
const clickTypeList = (index: number) => {
  showVendor.value = true
  popoverWidth.value = '300px'
  // 防止重选的时候有脏数据
  vendorList.value = []
  resourceBundleList.value = []
  if (typeList.value.length) {
    vendorList.value = typeList.value[index]?.vendorList
  }
  if (vendorList.value.length) {
    resourceBundleList.value = vendorList.value[0]?.resourceBundleList
  }
}
const clickAllVendor = () => {
  closePopover('cloudPlatformType', '')
}
// 选择阿里云还是华为云等
const clickVendorList = (index: number) => {
  showResourceBundle.value = true
  showRegion.value = false
  popoverWidth.value = '450px'
  resourceBundleList.value = []
  if (vendorList.value.length) {
    resourceBundleList.value = vendorList.value[index]?.resourceBundleList
  }
}
const clickAllResourceBundle = () => {
  closePopover('resourcePoolId', '')
}
// 选择资源池
const clickResourceBundleList = (index: number) => {
  showRegion.value = true
  popoverWidth.value = '600px'
  const result = resourceBundleList.value[index]
  emits(EventEnum.selectResource, 'resourcePool', result as string)
}

//选择区域
const clickRegionList = (index: number) => {
  closePopover('regionInfo', regionList.value[index])
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
  } else if (type === 'regionInfo') {
    selectValue.value = '全部区域'
    if (select) {
      selectValue.value = select.name
      result = select
    }
  }
  showResource.value = false
  inputDisabled.value = false
  emits(EventEnum.select, type, result as string)
  popoverWidth.value = '150px'
  popoverRef.value.hide()
}

// 输入框选择值
const selectValue = ref('')
// 显示资源选择列表
const showResource = ref(false)
const inputDisabled = ref(false)
const clickHide = () => {
  showResource.value = false
  showVendor.value = false
  showResourceBundle.value = false
  showRegion.value = false
  inputDisabled.value = false
}
const clickFocus = () => {
  showResource.value = true
}

enum EventEnum {
  select = 'clickSelectTable',
  selectResource = 'clickSelectResource'
}
interface EventEmits {
  (e: EventEnum.select, type: string, v: string): void
  (e: EventEnum.selectResource, type: string, v: string): void
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
    background-color: #eeeeee;
    padding: 0 10px;
    height: 34px;
    line-height: 34px;
    color: #5e5e5e;
    border-radius: var(--el-border-radius-base) 0 0 var(--el-border-radius-base);
  }
  .input-with-select {
    width: 200px;
    :deep(.el-input__wrapper) {
      border-radius: 0 var(--el-border-radius-base) var(--el-border-radius-base)
        0;
    }
  }
}
.resource-pool-table {
  width: 100%;
  .resource-pool-table-item:last-child {
    border-right: 0;
  }
  .resource-pool-table-scroller {
    width: 100%;
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
    border-right: 0;
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
