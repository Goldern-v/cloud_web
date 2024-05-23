<template>
  <div>
    <div class="storage-class">
      <el-tooltip
        v-for="(item, index) of dataArray"
        :key="index"
        effect="dark"
        placement="top-start"
        popper-class="custom-tooltip"
      >
        <template #content>
          <div class="flex-row">
            <div class="custom-tooltip-label">IOPS</div>
            <div>{{ item.IOPS }}</div>
          </div>
          <div class="flex-row">
            <div class="custom-tooltip-label">时延</div>
            <div>{{ item.delay }}</div>
          </div>
          <div class="flex-row">
            <div class="custom-tooltip-label">带宽</div>
            <div>{{ item.bandwidth }}</div>
          </div>
          <div v-if="type !== 'hpcCache'" class="flex-row">
            <div class="custom-tooltip-label">容量</div>
            <div>{{ item.size }}</div>
          </div>
          <div class="custom-tooltip-tip">{{ item.tip }}</div>
        </template>

        <div
          class="storage-class-box ideal-default-margin-right"
          :class="{
            'storage-class-box-disabled': item.disabled,
            'storage-class-box-selected': item.selected
          }"
          @click="clickIndex(index)"
        >
          <div class="storage-class-title">{{ item.title }}</div>
          <div class="ideal-tip-text">{{ item.content }}</div>

          <div class="flex-row storage-class-item">
            <div
              v-for="(child, idx) of item.types"
              :key="idx"
              class="storage-class-item-type"
              :class="{ 'storage-class-item-type-disabled': item.disabled }"
            >
              {{ child }}
            </div>
          </div>
        </div>
      </el-tooltip>
    </div>

    <template v-if="type === 'hpc'">
      <div class="ideal-tip-text">
        已选择规格：{{ selectItem?.title }} | {{ selectItem?.IOPS }} IOPS |
        {{ selectItem?.delay }} 时延 | {{ selectItem?.bandwidth }} 带宽 |
        {{ selectItem?.size }} 容量
      </div>
      <div class="ideal-error-text">
        您还可以创建20个文件系统。剩余容量32,768GB。
      </div>
    </template>
    <template v-else-if="type === 'hpcCache'">
      <div class="ideal-tip-text">
        已选择规格：{{ selectItem?.title }} | {{ selectItem?.IOPS }} IOPS |
        {{ selectItem?.delay }} 时延 | {{ selectItem?.bandwidth }} 带宽
      </div>
      <div class="ideal-error-text">
        您还可以创建20个文件系统。剩余容量32,768GB。
      </div>
      <div class="ideal-error-text">
        创建完成后，请前往详情页面配置NAS/OBS绑定目标。
      </div>
    </template>
    <template v-else-if="type === 'general'">
      <div class="ideal-error-text">
        您还可以创建20个文件系统。剩余容量32,768GB。
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { EventEnum } from '@/utils/enum'

interface StorageDataProps {
  title?: string
  content?: string
  types?: string[]
  disabled?: boolean
  selected?: boolean
  IOPS?: string
  delay?: string // 时延
  bandwidth?: string // 带宽
  size?: string // 容量
  tip?: string
}

interface StorageClassProps {
  type?: string // 文件系统类型 hpc:HPC型 hpcCache:HPC缓存型 general:通用型
}
const props = withDefaults(defineProps<StorageClassProps>(), {
  type: 'hpc'
})

const hpcArray: StorageDataProps[] = [
  {
    title: '20MB/s/TiB',
    content: '最大带宽8GB/s',
    types: ['大容量', '低成本'],
    disabled: false,
    selected: true,
    IOPS: '最大25万',
    delay: '2~5ms',
    bandwidth: '最大8GB/s',
    size: '3.6TB~1PB',
    tip: '适用于企业办公、代码仓管理'
  },
  {
    title: '40MB/s/TiB',
    content: '最大带宽8GB/s',
    types: ['大容量', '低成本'],
    disabled: false,
    selected: false,
    IOPS: '最大25万',
    delay: '2~5ms',
    bandwidth: '最大8GB/s',
    size: '1.2TB~1PB',
    tip: '适用于企业办公、代码仓管理'
  },
  {
    title: '125MB/s/TiB',
    content: '最大带宽20GB/s',
    types: ['低时延', '高性价比'],
    disabled: false,
    selected: false,
    IOPS: '最大百万',
    delay: '<1ms',
    bandwidth: '最大20GB/s',
    size: '1.2TB~1PB',
    tip: '适用于影视渲染、基因分析、EDA仿真'
  },
  {
    title: '250MB/s/TiB',
    content: '最大带宽20GB/s',
    types: ['低时延', '高带宽'],
    disabled: false,
    selected: false,
    IOPS: '最大百万',
    delay: '<1ms',
    bandwidth: '最大20GB/s',
    size: '1.2TB~1PB',
    tip: '适用于影视渲染、基因分析、EDA仿真'
  },
  {
    title: '500MB/s/TiB',
    content: '最大带宽20GB/s',
    types: ['低时延', '性能高密'],
    disabled: false,
    selected: false,
    IOPS: '最大百万',
    delay: '<1ms',
    bandwidth: '最大20GB/s',
    size: '1.2TB~1PB',
    tip: '适用于自动驾驶、AIGC、芯片设计EDA'
  },
  {
    title: '1000MB/s/TiB',
    content: '最大带宽20GB/s',
    types: ['低时延', '性能高密'],
    disabled: false,
    selected: false,
    IOPS: '最大百万',
    delay: '<1ms',
    bandwidth: '最大20GB/s',
    size: '1.2TB~1PB',
    tip: '适用于自动驾驶、AIGC、芯片设计EDA'
  }
]
const hpcCacheArray: StorageDataProps[] = [
  {
    title: '缓存型',
    content: '最大带宽48GB/s',
    types: ['低时延', '灵活配置'],
    disabled: false,
    selected: false,
    IOPS: '百万级',
    delay: '亚毫秒',
    bandwidth: '最大48GB/s',
    tip: '适用于AI训练、影视渲染、基因分析、EDA仿真'
  }
]
const generalArray: StorageDataProps[] = [
  {
    title: '标准型',
    content: '最大带宽150MB/s',
    types: ['低成本'],
    disabled: true,
    selected: false,
    IOPS: '5K',
    delay: '2~5ms',
    bandwidth: '150MB/s',
    size: '500GB~32TB',
    tip: '适用于代码存储、文件共享、企业办公、日志存储'
  },
  {
    title: '标准型-增强版',
    content: '最大带宽1GB/s',
    types: ['大容量', '低成本'],
    disabled: true,
    selected: false,
    IOPS: '15K',
    delay: '2~5ms',
    bandwidth: '1GB/s',
    size: '10TB~320TB',
    tip: '适用于代码存储、文件共享、企业办公、日志存储'
  },
  {
    title: '性能型',
    content: '最大带宽350MB/s',
    types: ['低时延'],
    disabled: true,
    selected: false,
    IOPS: '20K',
    delay: '1~2ms',
    bandwidth: '350MB/s',
    size: '500GB~32TB',
    tip: '适用于高性能网站、文件共享、内容管理、图片渲染、AI训练、企业办公'
  },
  {
    title: '性能型-增强版',
    content: '最大带宽2GB/s',
    types: ['大容量', '低时延'],
    disabled: true,
    selected: false,
    IOPS: '100K',
    delay: '1~2ms',
    bandwidth: '2GB/s',
    size: '10TB~320TB',
    tip: '适用于高性能网站、文件共享、内容管理、图片渲染、AI训练、企业办公'
  }
]
const dataArray = ref<StorageDataProps[]>([])
// 选择的存储类型
const selectItem = ref<StorageDataProps>()
onMounted(() => {
  initDataArray(props.type)
})
const initDataArray = (type: string) => {
  dataArray.value = hpcArray
  if (type === 'hpc') {
    dataArray.value = hpcArray
  } else if (type === 'hpcCache') {
    dataArray.value = hpcCacheArray
  } else if (type === 'general') {
    dataArray.value = generalArray
  }

  // 重置选择
  dataArray.value.forEach((item: StorageDataProps) => {
    item.disabled = false
    if (type === 'general') {
      item.disabled = true
    }
    item.selected = false
  })
  if (type !== 'general') {
    dataArray.value[0].selected = true
  }

  selectItem.value = dataArray.value[0]

  emit('clickSelect', selectItem.value)
}
watch(
  () => props.type,
  value => {
    initDataArray(value)
  }
)
// 选择事件
const clickIndex = (index: number) => {
  selectItem.value = dataArray.value[index]
  dataArray.value.forEach((item: StorageDataProps, idx: number) => {
    item.selected = idx === index && !item.disabled
  })
  emit('clickSelect', selectItem.value)
}

// 方法
interface EventEmits {
  (e: 'clickSelect', v: any): void
}
const emit = defineEmits<EventEmits>()
</script>

<style scoped lang="scss">
.storage-class {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  .storage-class-box {
    width: calc(25% - 32px);
    padding: 10px;
    margin-top: 10px;
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
        background-color: var(--el-color-primary-light-8);
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
}
</style>
<style lang="scss">
.custom-tooltip {
  min-width: 150px;
  &-label {
    width: 40px;
  }
  &-tip {
    border-top: 1px solid $componentBorder;
    margin-top: 3px;
    padding-top: 3px;
  }
}
</style>
