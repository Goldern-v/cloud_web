
<template>
  <div class="flex-row ideal-cycle-select">
    <div
      v-for="(item, index) of dataArray"
      :key="index"
      class="flex-row"
      :class="item.isSelect ? 'list-item-active' : 'list-item'"
      @click="clickWeekCycle(index)"
    >
      <div class="flex-row cycle-select-label">
        {{ item.label }}
      </div>

      <div class="top-right-tick">
        <svg-icon
          v-if="item.isSelect"
          icon="top-right-tick"
          color="var(--el-color-primary)"
        ></svg-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isEmpty } from '@/utils/is'
import { IdealCycleSelect } from '@/types'

interface IdealCycleSelectProps {
  dataArray?: IdealCycleSelect[]
}
const props = withDefaults(defineProps<IdealCycleSelectProps>(), {
  dataArray: () => ([])
})

const clickWeekCycle = (index: number) => {
  if (isEmpty(props.dataArray)) { return }
  
  emit('clickCycleSelect', index)
}

// 方法
interface EventEmits {
  (e: 'clickCycleSelect', v: number): void
}
const emit = defineEmits<EventEmits>()
</script>

<style scoped lang="scss">
.ideal-cycle-select {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  .cycle-select-label {
    margin: 0 2px 0px 12px;
  }
  .list-item,
  .list-item-active {
    cursor: pointer;
    border: 1px solid white;
    width: auto;
    margin: 2px 5px;
    background-color: $gray1-light;
    border-radius: 4px;
    justify-content: center;
    .list-item-label {
      margin: 0 2px 0 12px;
    }
  }
  .list-item-active {
    border: 1px solid var(--el-color-primary);
  }
  .top-right-tick,
  .top-right-tick-active {
    width: 14px;
    :deep(.svg-icon svg) {
      vertical-align: 0.5em; // 调整勾选中图标顶部边距
    }
  }
}
</style>
