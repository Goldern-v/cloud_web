import { Alignment } from 'element-plus/es/components/table-v2/src/constants';
<template>
  <div class="step">
    <ul class="step-ul">
      <li
        v-for="(item, index) of dataArray"
        :key="index"
        class="step-li"
        :style="{
          width:
            index === dataArray.length - 1
              ? 'auto'
              : `calc(${100 / (dataArray.length - 1)}%)`
        }"
      >
        <div v-if="type === 'serial'" class="flex-row step-item">
          <svg-icon
            v-if="step > index"
            icon="check-circle"
            class-name="custom-svg"
            class="ideal-default-margin-right"
          />
          <div
            v-else-if="step === index"
            class="index-current"
            :style="{ 'background-color': item.color }"
          >
            {{ index + 1 }}
          </div>
          <div v-else class="index-unselect">{{ index + 1 }}</div>

          <div v-if="step > index" class="title" @click="onClickIndex(index)">
            <div>{{ item?.title }}</div>
            <div>{{ item?.tip }}</div>
          </div>
          <div
            v-else-if="step === index"
            class="title"
            :style="{ color: item.color }"
            @click="onClickIndex(index)"
          >
            <div>{{ item?.title }}</div>
            <div>{{ item?.tip }}</div>
          </div>
          <div v-else class="title-unselect" @click="onClickIndex(index)">
            <div>{{ item?.title }}</div>
            <div>{{ item?.tip }}</div>
          </div>

          <div
            v-if="index !== dataArray.length - 1"
            class="line"
            :class="{ 'line-select': step > index }"
            :style="lineStyle(index)"
          ></div>
        </div>

        <div v-else-if="type === 'custom'" class="flex-row step-item">
          <template v-if="step >= index">
            <svg-icon
              v-if="item.icon"
              :icon="item.icon"
              class-name="custom-svg"
              :color="svgColor(index)"
              class="ideal-default-margin-right"
            />
          </template>
          <template v-else>
            <svg-icon
              v-if="item.icon"
              :icon="item.icon"
              class-name="custom-svg"
              color="#DCDCDC"
              class="ideal-default-margin-right"
            />
          </template>

          <div v-if="step > index" class="title" @click="onClickIndex(index)">
            <div>{{ item?.title }}</div>
            <div>{{ item?.tip }}</div>
          </div>
          <div
            v-else-if="step === index"
            class="title"
            :style="{ color: item.color }"
            @click="onClickIndex(index)"
          >
            <div>{{ item?.title }}</div>
            <div>{{ item?.tip }}</div>
          </div>
          <div v-else class="title-unselect" @click="onClickIndex(index)">
            <div>{{ item?.title }}</div>
            <div>{{ item?.tip }}</div>
          </div>

          <div
            v-if="index !== dataArray.length - 1"
            class="line"
            :class="{ 'line-select': step > index }"
            :style="lineStyle(index)"
          ></div>
        </div>

        <div v-else-if="type === 'dot'" class="flex-row step-item">
          <div
            class="flex-column"
            style="align-items: center"
            :style="{ 'margin-top': item.tip ? '30px' : '20px' }"
          >
            <div v-if="step > index" class="steps-empty-circle-done"></div>
            <div
              v-else-if="step === index"
              class="steps-empty-circle-active"
              :style="dotStyle(index)"
            ></div>
            <div v-else class="steps-empty-circle"></div>

            <div v-if="step > index" class="title" @click="onClickIndex(index)">
              <div>{{ item?.title }}</div>
              <div>{{ item?.tip }}</div>
            </div>
            <div
              v-else-if="step === index"
              class="title"
              :style="{ color: item.color }"
              @click="onClickIndex(index)"
            >
              <div>{{ item?.title }}</div>
              <div>{{ item?.tip }}</div>
            </div>
            <div v-else class="title-unselect" @click="onClickIndex(index)">
              <div>{{ item?.title }}</div>
              <div>{{ item?.tip }}</div>
            </div>
          </div>

          <div
            v-if="index !== dataArray.length - 1"
            class="line"
            :class="{ 'line-select': step > index }"
            :style="lineStyle(index)"
          ></div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { IdealSteps } from '@/types'
import { isUnDef } from '@/utils/is'

interface HorizontalProps {
  dataArray?: IdealSteps[]
  currentStep?: number
  type?: string
  minusStep?: number // 步骤从1开始,则需设置1 从0开始则默认0
}
const props = withDefaults(defineProps<HorizontalProps>(), {
  dataArray: () => [],
  currentStep: 0,
  type: 'serial', // serial:索引 custom:自定义 dot:圆点
  minusStep: 0
})

const step = computed(() => props.currentStep - props.minusStep)

// lineColor有值,则已完成步骤引导线显示相应颜色 否则显示主题色
const lineStyle = computed(() => (index: number) => {
  if (step.value > index) {
    const tempLineColor = props.dataArray[index + 1]?.lineColor
    return { 'border-color': !isUnDef(tempLineColor) ? tempLineColor : '' }
  } else {
    return { 'border-color': '' }
  }
})

const svgColor = computed(() => (index: number) => {
  if (step.value >= index) {
    const tempColor = props.dataArray[index]?.color
    return !isUnDef(tempColor) ? tempColor : ''
  } else {
    return ''
  }
})

const dotStyle = computed(() => (index: number) => {
  if (index === props.dataArray.length - 1) {
    const tempColor = props.dataArray[index]?.color
    return { 'background-color': !isUnDef(tempColor) ? tempColor : '' }
  } else {
    return { 'background-color': '' }
  }
})

const onClickIndex = (index: number) => {
  emit('clickIndex', index)
}

// 方法
interface EventEmits {
  (e: 'clickIndex', v: number): void
}
const emit = defineEmits<EventEmits>()
</script>

<style scoped lang="scss">
.step {
  padding-top: 10px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  .step-ul {
    list-style: none;
    display: flex;
    width: 100%;
    justify-content: space-between;
    .step-li {
      width: 100%;
      float: left;
      position: relative;
      .step-item {
        align-items: center;
        justify-content: space-between;
        .index,
        .index-unselect,
        .index-current {
          width: 24px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          border-radius: 50%;
          color: white;
          font-size: $defaultFontSize;
          background: white;
          position: relative;
          margin-right: 5px;
        }
        .index-unselect {
          border: 1px solid $componentBorder;
          color: $textColorSecondary;
        }
        .index-current {
          background-color: var(--el-color-primary);
        }
        .line,
        .line-select {
          top: -12px;
          left: 22px;
          border-bottom: 2px solid #e9e9e9;
          flex: 1;
          margin: 0 10px;
        }
        .line-select {
          border-color: var(--el-color-primary);
        }
        .title,
        .title-unselect {
          white-space: nowrap;
          color: var(--el-color-primary);
        }
        .title-unselect {
          color: $textColorSecondary;
        }

        .steps-empty-circle,
        .steps-empty-circle-active,
        .steps-empty-circle-done {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        .steps-empty-circle {
          border: 2px solid $componentBorder;
          border-width: 2px;
        }
        .steps-empty-circle-done {
          border: 2px solid var(--el-color-primary);
          border-width: 2px;
        }
        .steps-empty-circle-active {
          width: 14px;
          height: 14px;
          background-color: var(--el-color-primary);
        }
      }
    }
  }

  :deep(.custom-svg) {
    width: 24px;
    height: 24px;
    color: var(--el-color-primary);
  }
}
</style>
