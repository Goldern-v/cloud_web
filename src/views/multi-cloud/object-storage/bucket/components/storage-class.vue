<template>
  <div class="storage-class">
    <div class="flex-row">
      <el-tooltip
        v-for="(item, index) of dataArray"
        :key="index"
        :disabled="!item.disabled"
        effect="dark"
        content="归档存储的桶不支持配置多AZ。"
        placement="top-start"
      >
        <div
          class="storage-class-box ideal-default-margin-right"
          :class="{ 'storage-class-box-disabled': item.disabled, 'storage-class-box-selected': item.selected }"
          @click="clickIndex(index)"
        >
          <div class="storage-class-title">{{ item.title }}</div>
          <div class="ideal-tip-text">{{ item.tip }}</div>

          <div class="flex-row storage-class-item">
            <div
              v-for="(child, idx) of item.types"
              :key="idx"
              class="storage-class-item-type"
              :class="{'storage-class-item-type-disabled': item.disabled}"
            >
              {{ child }}
            </div>
          </div>

          <template v-if="showCost">
            <cost-view :array="item.costs" :disabled="item.disabled" style="width: 100%;"/>
          </template>
        </div>
      </el-tooltip>
      
      <div class="flex-column storage-class-button" @click="clickShowCost">
        <template v-if="showCost">
          <svg-icon icon="up-arrow"/>
          <div>收起</div>
        </template>
        <template v-else>
          <div>费用参考</div>
          <svg-icon icon="down-arrow"/>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import costView from './cost-view.vue'
import { EventEnum } from '@/utils/enum'

interface StorageDataProps {
  title?: string
  tip?: string
  types?: string[]
  disabled?: boolean
  selected?: boolean
  costs?: any[]
}

interface StorageClassProps {
  type?: string // 数据冗余存储策略类型
}
const props = withDefaults(defineProps<StorageClassProps>(), {
  type: 'more'
})

const dataArray = ref<StorageDataProps[]>([
  {
    title: '标准存储',
    tip: '适合高性能，高可靠，高可用，频繁访问场景',
    types: ['多AZ存储', '单AZ存储', '图片处理'],
    disabled: false,
    selected: true,
    costs: [
      { label: '存储费用', percentage: 4, text: '高' },
      { label: '取回费用', percentage: 0, text: '无' },
      { label: '请求费用', percentage: 1, text: '低' }
    ]
  },
  {
    title: '低频访问存储',
    tip: '适合高可靠，低成本，较少访问场景',
    types: ['多AZ存储', '单AZ存储', '图片处理'],
    disabled: false,
    selected: false,
    costs: [
      { label: '存储费用', percentage: 3, text: '中' },
      { label: '取回费用', percentage: 1, text: '低' },
      { label: '请求费用', percentage: 2, text: '中' }
    ]
  },
  {
    title: '归档存储',
    tip: '适合长期存储，平均一年访问一次',
    types: ['单AZ存储'],
    disabled: true,
    selected: false,
    costs: [
      { label: '存储费用', percentage: 2, text: '中' },
      { label: '取回费用', percentage: 2, text: '中' },
      { label: '请求费用', percentage: 2, text: '中' }
    ]
  }
])
onMounted(() => {
  dataArray.value[2].disabled = props.type === 'more'
})
watch(() => props.type, value => {
  dataArray.value.forEach((item: StorageDataProps) => {
    item.disabled = false
    item.selected = false
  })
  // 根据数据冗余存储策略类型判断默认存储类别是否可选
  dataArray.value[0].selected = true
  dataArray.value[2].disabled = value === 'more'
})
// 选择事件
const clickIndex = (index: number) => {
  dataArray.value.forEach((item: StorageDataProps, idx: number) => {
    item.selected = (idx === index && !item.disabled)
  })
}
// 显示成本视图
const showCost = ref(false)
const clickShowCost = () => {
  showCost.value = !showCost.value
}
// 方法
// interface EventEmits {
//   (e: EventEnum.cancel): void
// }
// const emit = defineEmits<EventEmits>()
</script>

<style scoped lang="scss">
.storage-class {
  width: 100%;
  .storage-class-box {
    width: 28%;
    padding: 10px;
    border: 1px solid $componentBorder;
    border-radius: $circleRadiusSize;
    cursor: pointer;
    &:hover {
      border-color: var(--el-color-primary);
    }
    .storage-class-title {
      font-size: $mediumFontSize;
      font-weight: 500;
    }
    .storage-class-item {
      justify-content: space-between;
      align-items: center;
      .storage-class-item-type {
        padding: 0px 2px;
        margin: 0 2px;
        background-color: var(--el-color-primary-light-9);
        width: 100%;
        text-align: center;
      }
      .storage-class-item-type-disabled {
        background-color: $gray3-light;
      }
    }
  }
  .storage-class-box-disabled {
    background-color: $gray1-light;
    cursor: not-allowed;
    &:hover {
      border-color: $componentBorder;
    }
  }
  .storage-class-box-selected {
    border: 1px solid var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
  }
  .storage-class-button {
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--el-color-primary);
  }
}
</style>
