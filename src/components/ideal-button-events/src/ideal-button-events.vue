<template>
  <div class="flex-row ideal-button-events__container">
    <div class="flex-row left-button">
      <template v-for="(v, index) of leftButtons" :key="index">
        <el-tooltip
          effect="dark"
          placement="top-start"
          :content="v.disabledText"
          :disabled="!v.disabled"
        >
          <div class="ideal-default-margin-right">
            <el-button
              :id="v.prop"
              :type="v.type as any"
              :text="v.text"
              :disabled="v.disabled"
              @click="handleLeftButton(v)"
            >
              <svg-icon
                v-if="v.icon"
                :icon="v.icon"
                :color="v.iconColor"
                :class="v.title ? 'ideal-svg-margin-right' : ''"
              ></svg-icon>
              <span v-if="v.title">{{ v.title }}</span>
            </el-button>
          </div>
        </el-tooltip>
      </template>

      <el-dropdown
        v-if="showLeftMore"
        class="more-button"
        @command="handleLeftCommand"
      >
        <el-button type="primary">
          {{ moreTitle }}
          <svg-icon icon="down-arrow" class="ideal-svg-margin-left"></svg-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="(v, i) of leftMoreButtns"
              :key="i"
              :icon="v.icon"
              :command="v.prop"
              :disabled="v.disabled"
            >
              <el-tooltip
                effect="dark"
                placement="top-start"
                :content="v.disabledText"
                :disabled="!v.disabled"
              >
                {{ v.title }}
              </el-tooltip>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <slot name="append"></slot>
    </div>

    <div class="flex-row right-button">
      <template v-for="(v, index) of rightButtons" :key="index">
        <el-tooltip
          effect="dark"
          placement="top-start"
          :content="v.disabledText"
          :disabled="!v.disabled"
        >
          <div
            :class="{
              'ideal-default-margin-right': rightButtons.length - 1 !== index
            }"
          >
            <el-button
              :id="v.prop"
              :type="v.type as any"
              :text="v.text"
              :disabled="v.disabled"
              @click="handleRightButton(v)"
            >
              <svg-icon
                v-if="v.icon"
                :icon="v.icon"
                :color="v.iconColor"
                :class="v.title ? 'ideal-svg-margin-right' : ''"
              ></svg-icon>
              <span v-if="v.title">{{ v.title }}</span>
            </el-button>
          </div>
        </el-tooltip>
      </template>

      <el-dropdown
        v-if="showRightMore"
        class="more-button"
        @command="handleRightCommand"
      >
        <el-button type="primary">
          {{ moreTitle }}
          <svg-icon icon="down-arrow" class="ideal-svg-margin-left"></svg-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="(v, i) of rightMoreButtns"
              :key="i"
              :icon="v.icon"
              :command="v.prop"
              :disabled="v.disabled"
            >
              <el-tooltip
                effect="dark"
                placement="top-start"
                :content="v.disabledText"
                :disabled="!v.disabled"
              >
                {{ v.title }}
              </el-tooltip>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 列表点击事件
 */
import type { IdealButtonEventProp } from '@/types'
import store from '@/store'
// 按钮传参
interface ButtonEvents {
  leftBtns?: IdealButtonEventProp[]
  leftMaxButtons?: number // 左侧按钮最多显示按钮数量(leftBtns多出的按钮显示在更多里)
  rightBtns?: IdealButtonEventProp[]
  rightMaxButtons?: number // 右侧按钮最多显示按钮数量(rightBtns多出的按钮显示在更多里)
  moreTitle?: string
}

const props = withDefaults(defineProps<ButtonEvents>(), {
  leftBtns: () => [],
  leftMaxButtons: 5,
  rightBtns: () => [],
  rightMaxButtons: 4,
  moreTitle: '更多'
})

// 左侧按钮最多显示leftMaxButtons个,只有超过leftMaxButtons+1个按钮时才显示更多下拉框(大于等于leftMaxButtons+1,是为了只有leftMaxButtons个按钮时不显示更多下拉框)
const showLeftMore = computed(
  () => handleAuthority(props.leftBtns).length >= props.leftMaxButtons + 1
)

const leftButtons = computed(() => {
  let arr: IdealButtonEventProp[] = []
  const array = handleAuthority(props.leftBtns)
  array.forEach((item, index) => {
    if (index < leftBtnLimit()) {
      arr.push(item)
    }
  })
  return arr
})
const leftMoreButtns = computed(() => {
  let arr: IdealButtonEventProp[] = []
  const array = handleAuthority(props.leftBtns)
  array.forEach((item, index) => {
    if (index >= leftBtnLimit()) {
      arr.push(item)
    }
  })
  return arr
})
const leftBtnLimit = () => {
  let limit = props.leftMaxButtons
  // 防止只有leftMaxButtons个按钮时,会显示更多下拉框(实际只有一个按钮事件,没必要显示更多下拉框)
  if (showLeftMore.value) {
    limit = props.leftMaxButtons - 1
  }
  return limit
}
// 右侧按钮最多显示rightMaxButtons个
const showRightMore = computed(
  () => handleAuthority(props.rightBtns).length >= props.rightMaxButtons + 1
)
const rightButtons = computed(() => {
  let arr: IdealButtonEventProp[] = []
  const array = handleAuthority(props.rightBtns)
  array.forEach((item, index) => {
    if (index < rightBtnLimit()) {
      arr.push(item)
    }
  })
  return arr
})
const rightMoreButtns = computed(() => {
  let arr: IdealButtonEventProp[] = []
  const array = handleAuthority(props.rightBtns)
  array.forEach((item, index) => {
    if (index >= rightBtnLimit()) {
      arr.push(item)
    }
  })
  return arr
})

const rightBtnLimit = () => {
  let limit = props.rightMaxButtons
  // 防止只有rightMaxButtons - 1个按钮时,会显示更多下拉框(实际只有一个按钮事件,没必要显示更多下拉框)
  if (showRightMore.value) {
    limit = props.rightMaxButtons - 1
  }
  return limit
}

//判断按钮是否有权限
const handleAuthority = (array: IdealButtonEventProp[]) => {
  // 确保 whetherExitAuthority 不会直接触发 authorityList 的更新
  const whetherExitAuthority = (ele: any) => {
    return store.userStore.authorityList.some(
      (v: string) => v === ele?.authority
    )
  }
  // 创建 array 的浅拷贝
  let arr: IdealButtonEventProp[] = JSON.parse(JSON.stringify(array))
  // 使用副本进行进一步过滤，并返回结果
  return arr.filter((ele: any) => whetherExitAuthority(ele))
}
// 事件枚举
enum EventType {
  leftEvent = 'clickLeftEvent',
  rightEvent = 'clickRightEvent'
}

interface EventEmits {
  (e: EventType.leftEvent, v: string | number | object): void
  (e: EventType.rightEvent, v: string | number | object): void
}
const emit = defineEmits<EventEmits>()
// 左侧更多点击
const handleLeftCommand = (item: string | number | object) => {
  emit(EventType.leftEvent, item)
}
// 右侧更多点击
const handleRightCommand = (item: string | number | object) => {
  emit(EventType.rightEvent, item)
}
// 左侧按钮
const handleLeftButton = (item: any) => {
  document.getElementById(item.prop)?.blur()
  emit(EventType.leftEvent, item.prop)
}
// 右侧按钮
const handleRightButton = (item: any) => {
  document.getElementById(item.prop)?.blur()
  emit(EventType.rightEvent, item.prop)
}
</script>

<style lang="scss" scoped name="IdealTableEvents">
.ideal-button-events__container {
  width: 100%;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  .left-button {
    justify-content: flex-start;
    align-items: center;
  }
  .right-button {
    justify-content: flex-end;
    align-items: center;
  }
  .more-button {
    // 设置更多下拉框
    :deep(.el-button--primary) {
      --el-button-text-color: var(--el-text-color-regular);
      --el-button-bg-color: white;
      --el-button-border-color: #c5c5c5;
      --el-button-hover-text-color: var(--el-text-color-regular);
      &:hover,
      &:focus {
        background-color: white;
        border-color: var(--el-border-color-light);
      }
    }
  }
  // 按钮禁用设置
  :deep(
      .el-button.is-disabled,
      .el-button.is-disabled:focus,
      .el-button.is-disabled:hover
    ) {
    border-color: #ffffff;
    background-color: $gray3-light;
  }
}
</style>
