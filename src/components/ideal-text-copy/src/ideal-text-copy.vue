<template>
  <div
    class="flex-row ideal-text-copy"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div class="ideal-text-copy-label">{{ row[labelKey] }}</div>
    <svg-icon
      v-if="row[showKey] && !isInitializing"
      icon="copy-icon"
      class-name="copy-svg"
      @click="clickCopy(row[copyKey])"
    />
  </div>
</template>

<script setup lang="ts">
import { clickCopy } from '@/utils/tool'
/**
 * 鼠标移到文本内容上显示粘贴复制
*/

interface IdealTextCopyProps {
  row?: any // 行数据
  showKey?: string // 是否显示svg图标的字段
  labelKey?: string // 显示内容的字段
  copyKey?: string // 需要复制的字段
  initializing?: string // 是否正在初始化中
}

const props = withDefaults(defineProps<IdealTextCopyProps>(), {
  row: () => ({}),
  showKey: 'showCopy',
  labelKey: 'id',
  copyKey: 'id',
  initializing: 'initializing'
})
// 判断需要复制的内容是否正在初始化
const isInitializing = computed(() => props.row[props.labelKey] === props.initializing)

// 事件
enum EventType {
  enter = 'mouseEnterEvent',
  leave = 'mouseLeaveEvent'
}
interface EventEmits {
  (e: EventType.enter, v: boolean): void
  (e: EventType.leave, v: boolean): void
}
const emit = defineEmits<EventEmits>()

// 移入鼠标
const handleMouseEnter = () => {
  emit(EventType.enter, true)
}
// 移出鼠标
const handleMouseLeave = (row: any) => {
  emit(EventType.enter, false)
}
</script>

<style scoped lang="scss">
// 文本超出隐藏
@mixin textHidden() {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ideal-text-copy {
  align-items: center;
  width: 100%;
  .ideal-text-copy-label {
    margin-right: 10px;
    @include textHidden();
  }
  :deep(.copy-svg) {
    color: var(--el-color-primary);
  }
}
</style>
