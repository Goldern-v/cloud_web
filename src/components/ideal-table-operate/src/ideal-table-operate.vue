<template>
  <div class="ideal-table-operate__container flex-row">
    <div
      v-for="(v, index) of operateButtons"
      :key="index"
      :type="v.type"
      class="operate-button flex-row"
    >
      <div v-if="!v.children">
        <el-tooltip
          effect="dark"
          placement="top-start"
          :content="v.disabledText"
          :disabled="!v.disabled"
        >
          <div
            class="title-button"
            :class="v.disabled ? 'title-button-hover' : ''"
            @click="handleEvent(v)"
          >
            {{ v.title }}
          </div>
        </el-tooltip>
      </div>
      <div v-else>
        <el-dropdown @command="handleCommand">
          <span
            class="dropdown-button"
            :class="v.disabled ? 'title-button-hover' : ''"
          >
            {{ v.title }}
            <svg-icon icon="down-arrow" style="font-size: 9px"></svg-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(it, inx) in v.children"
                :key="inx"
                :disabled="it.disabled"
                :command="it.prop"
                ><el-tooltip
                  effect="dark"
                  placement="top-start"
                  :content="it.disabledText"
                  :disabled="!it.disabled"
                >
                  {{ it.title }}
                </el-tooltip></el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <el-divider
        v-if="index < operateButtons.length - 1 || showMore"
        direction="vertical"
      />
    </div>

    <template v-if="showMore">
      <el-dropdown v-if="isDropdown" max-height="200" @command="handleCommand">
        <span class="more-button">
          {{ moreTitle }}
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="(v, i) of moreButtons"
              :key="i"
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

      <el-popover
        v-else-if="isPanel"
        ref="popoverRef"
        placement="bottom-end"
        :width="panelWidth"
        popper-class="custom-popover"
        :show-arrow="false"
        trigger="click"
        @hide="clickHide"
      >
        <template #reference>
          <div class="more-button" @click="clickMorePanel">{{ moreTitle }}</div>
        </template>
        <div v-if="showPanel" class="flex-row operate-panel">
          <el-scrollbar
            :height="maxScrollerHeight"
            class="operate-panel-scroller"
          >
            <el-button
              v-for="(item, index) of moreButtons"
              :key="index + 'panel'"
              link
              :disabled="item.disabled"
              class="flex-row operate-panel-item"
              style="justify-content: space-between"
              @click="clickMorePanelEvent(index)"
            >
              <el-tooltip
                effect="dark"
                placement="top-start"
                :content="item.disabledText"
                :disabled="!item.disabled"
              >
                {{ item.title }}
              </el-tooltip>
              <svg-icon
                v-if="item?.children?.length"
                icon="right-arrow"
              ></svg-icon>
            </el-button>
          </el-scrollbar>

          <el-scrollbar
            v-if="showChildPanel"
            :height="maxScrollerHeight"
            class="operate-panel-scroller"
          >
            <el-button
              v-for="(item, index) of childMoreBtns"
              :key="index + 'childPanel'"
              link
              :disabled="item.disabled"
              class="flex-row operate-panel-item"
              @click="clickMoreChildPanelEvent(item.prop)"
            >
              <el-tooltip
                effect="dark"
                placement="top-start"
                :content="item.disabledText"
                :disabled="!item.disabled"
              >
                {{ item.title }}
              </el-tooltip>
            </el-button>
          </el-scrollbar>
        </div>
      </el-popover>
    </template>
  </div>
</template>

<script setup lang="ts" name="IdealTableOperate">
/**
 * 列表操作事件
 * */
import type { IdealTableColumnOperate } from '@/types'
import { MoreOperateEnum } from '@/utils/enum'
import store from '@/store'

// 级联面板自定义属性key
interface CascaderPanelProps {
  label?: string
  value?: string
  children?: string
  disabled?: string
}
// 操作按钮属性
interface OperateButtons {
  buttons?: IdealTableColumnOperate[]
  moreTitle?: string
  maxButtons?: number // 最多显示按钮数量
  mode?: MoreOperateEnum
  panelProps?: CascaderPanelProps
}

const props = withDefaults(defineProps<OperateButtons>(), {
  buttons: () => [],
  moreTitle: '更多',
  maxButtons: 3,
  mode: MoreOperateEnum.dropdown,
  panelProps: (): CascaderPanelProps => ({
    label: 'title',
    children: 'children',
    disabled: 'disabled',
    value: 'prop'
  })
})

const isDropdown = props.mode === MoreOperateEnum.dropdown
const isPanel = props.mode === MoreOperateEnum.cascaderPanel
// 操作按钮最多显示maxButtons个,只有超过maxButtons+1个按钮时才显示更多下拉框(大于等于maxButtons+1,是为了只有maxButtons个按钮时不显示更多下拉框)
const showMore = computed(
  () => handleAuthority(props.buttons).length >= props.maxButtons + 1
)
// 按钮数限制,超过则显示更多
const btnLimit = () => {
  let limit = props.maxButtons
  // 防止只有maxButtons个按钮时,会显示更多下拉框(实际只有一个按钮事件,没必要显示更多下拉框)
  if (showMore.value) {
    limit = props.maxButtons - 1
  }
  return limit
}
// 操作按钮
const operateButtons = computed(() => {
  const arr: IdealTableColumnOperate[] = []
  const array = handleAuthority(props.buttons)
  array.forEach((item: IdealTableColumnOperate, index) => {
    if (index < btnLimit()) {
      arr.push(item)
    }
  })
  return arr
})

const handleAuthority = (array: IdealTableColumnOperate[]) => {
  // 确保 whetherExitAuthority 不会直接触发 authorityList 的更新
  const whetherExitAuthority = (ele: any) => {
    return store.userStore.authorityList.some(
      (v: string) => v === ele?.authority
    )
  }
  // 创建 array 的浅拷贝
  let arr: IdealTableColumnOperate[] = JSON.parse(JSON.stringify(array))

  // 在副本上进行过滤操作
  arr.forEach((item: any) => {
    if (item.children) {
      item.children = item.children.filter((ele: any) =>
        whetherExitAuthority(ele)
      )
    }
  })
  // 使用副本进行进一步过滤，并返回结果
  return arr.filter(
    (ele: any) => whetherExitAuthority(ele) || (ele.children?.length ?? 0) > 0
  )
}
// 更多按钮
const moreButtons = computed(() => {
  const arr: IdealTableColumnOperate[] = []
  const array = handleAuthority(props.buttons)
  array.forEach((item, index) => {
    if (index >= btnLimit()) {
      arr.push(item)
    }
  })
  return arr
})
// 事件枚举
enum EventType {
  more = 'clickMoreEvent'
}
// 点击事件
interface EventEmits {
  (e: EventType.more, v: string | number | object): void
}
const emit = defineEmits<EventEmits>()
/**
 * 下拉菜单
 * 更多点击事件
 */
const handleCommand = (item: any) => {
  if (item.disabled) {
    return
  }
  emit(EventType.more, item)
}
const handleEvent = (item: any) => {
  if (item.disabled) {
    return
  }
  emit(EventType.more, item.prop)
}
/**
 * 级联面板
 * */
// 列表最大高
const maxScrollerHeight = ref('150px')
// 级联宽
const panelWidth = ref('150px')
const popoverRef = ref()
// showPanel防止选择显示上一次结果
const showPanel = ref(false)
const clickMorePanel = () => {
  showPanel.value = true
}
const childMoreBtns = ref<IdealTableColumnOperate[]>([])
const showChildPanel = ref(false)
const clickMorePanelEvent = (index: number) => {
  if (!moreButtons.value[index].children?.length) {
    showChildPanel.value = false
    childMoreBtns.value = []
    panelWidth.value = '150px'
    emit(EventType.more, moreButtons.value[index].prop)
  } else {
    showChildPanel.value = true
    panelWidth.value = '300px'
    childMoreBtns.value = moreButtons.value[index]
      .children as IdealTableColumnOperate[]
  }
}
const clickMoreChildPanelEvent = (result: string) => {
  showPanel.value = false
  showChildPanel.value = false
  panelWidth.value = '150px'
  popoverRef.value.hide()
  emit(EventType.more, result)
}
const clickHide = () => {
  showPanel.value = false
  showChildPanel.value = false
  panelWidth.value = '150px'
}
</script>

<style lang="scss" scoped>
.ideal-table-operate__container {
  width: 100%;
  box-sizing: border-box;
  justify-content: flex-start;
  align-items: center;
  .title-button {
    cursor: pointer;
  }
  .dropdown-button {
    font-size: 12px;
    cursor: pointer;
    text-align: center;
    color: var(--el-color-primary);
    line-height: 23px !important;
    align-items: center;
  }
  .title-button-hover {
    cursor: not-allowed;
    color: $gray6-light;
  }
  .operate-button {
    color: var(--el-color-primary);
    justify-content: center;
    align-items: center;
    font-size: 12px;
  }
  .more-button {
    cursor: pointer;
    display: flex;
    align-items: center;
    font-size: 12px;
    color: var(--el-color-primary);
    :deep(.el-divider--vertical) {
      margin: 0 12px;
    }
  }
}
</style>
<style lang="scss">
.custom-popover {
  .el-cascader-menu {
    min-width: 140px;
  }
  .el-cascader-node {
    padding: 0 10px 0 20px;
  }
  .el-cascader-node__label {
    color: var(--el-color-primary);
  }
  .more-button {
    cursor: pointer;
    color: var(--el-color-primary);
  }
  .operate-panel {
    width: 100%;
    .operate-panel-item:last-child {
      border-right: 0;
    }
    .operate-panel-scroller {
      width: 100%;
      border-right: 1px solid #eee;
      .operate-panel-item {
        // cursor: pointer;
        font-size: 12px;
        width: calc(100% - 20px);
        align-items: center;
        padding: 10px 10px;
        margin: 0 10px;
        border-bottom: 1px solid #eee;
        text-align: center;
        border-radius: 4px;
      }
    }
  }
}
</style>
