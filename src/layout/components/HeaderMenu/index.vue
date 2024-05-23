<template>
  <div class="ct-header-menu">
    <!-- 菜单导航-start -->

    <ul class="ct-header-menu-list">
      <li
        v-for="(item, index) in data"
        :key="index"
        class="ct-header-menu-item"
        :class="{
          home: checkHome(item),
          select: maskIndex === index
        }"
        @click="clickHome(item)"
        @mouseover="enterMenu(index)"
      >
        <svg-icon
          v-if="showIcon(item.meta.icon)"
          :icon="item.meta.icon"
          class="ct-header-menu-item-icon"
        ></svg-icon>
        <span class="ct-header-menu-item-text">{{ item.meta.title }}</span>
      </li>
    </ul>
    <!-- 菜单导航-end -->

    <!-- 菜单弹层-start -->
    <div v-show="showFixMenu" class="ct-header-layer">
      <div class="ct-mask-layer"></div>
      <div class="ct-header-layer-content" @mouseleave="leaveMenu">
        <img
          alt="导航菜单弹层图片"
          src="@/assets/headerNavBg.png"
          class="ct-header-layer-image"
        />
        <div class="ct-header-layer-right">
          <div class="ct-header-layer-box">
            <div class="ct-header-layer-search">
              <svg-icon
                icon="search-icon"
                color="#ccc"
                class="ct-header-layer-icon-magnifier"
                class-name="custom-svg"
              />
              <input
                v-model="keyword"
                type="text"
                placeholder="请输入产品或服务"
              />
            </div>
            <div class="ct-header-layer-menu-list">
              <template v-for="(item, index) in filterMenuData" :key="index">
                <div
                  class="ct-header-layer-menu-item"
                  :style="{ marginLeft: index % 5 === 0 ? 0 : '80px' }"
                >
                  <div
                    class="ct-header-layer-menu-item-title flex-row"
                    :class="{ link: item.url }"
                    @click="clickMenu(item)"
                  >
                    <svg-icon
                      v-if="showIcon(item.meta.icon)"
                      :icon="item.meta.icon"
                      class="ideal-svg-margin-right"
                      class-name="custom-svg"
                    />
                    <span class="ct-header-menu-item-text">{{
                      item.meta.title
                    }}</span>
                  </div>
                  <ul class="ct-header-menu-child">
                    <li
                      v-for="(oItem, oIndex) in item.children"
                      :key="`${index}-${oIndex}`"
                      @click="clickMenu(oItem)"
                    >
                      {{ oItem.meta.title }}
                    </li>
                  </ul>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 菜单弹层-end -->

    <!-- 遮罩层 -->
  </div>
</template>

<script setup lang="ts">
interface HeadMenuProps {
  data?: any // 菜单数据
  nameKey?: string // 菜单名称key
  iconKey?: string // 菜单图标key
  checkHome?: Function // 检测哪个菜单是首页
  zIndex?: string | number | undefined // 层级
}

const props = withDefaults(defineProps<HeadMenuProps>(), {
  data: () => [],
  nameKey: 'menu.title',
  iconKey: 'icon',
  checkHome: () => {},
  zIndex: 0
})
// 显示icon图标
const showIcon = computed(() => (val: string) => {
  return !!val //store.appStore.theme.layout !== 'columns'
})

const maskIndex = ref(null)

const menuList: any = ref([])

const showFixMenu = ref(false)

const keyword = ref('')

const filterMenuData = computed(() => {
  if (!menuList.value.length || !keyword.value) {
    return menuList.value
  }
  const filterList: any = []
  const reg = new RegExp(keyword.value, 'ig')
  menuList.value.forEach((item: any) => {
    const newChildList: any = []
    item.children.forEach((oItem: any) => {
      if (reg.test(oItem.meta.title)) {
        newChildList.push(oItem)
      }
    })
    if (reg.test(item.meta.title) || newChildList.length) {
      filterList.push({
        ...item,
        children: newChildList
      })
    }
  })
  return filterList
})

/**
 * 进入菜单
 * @param index 菜单序号
 */
const enterMenu = (index: any): boolean => {
  maskIndex.value = index
  const menu = props.data[index]
  if (!menu) {
    showFixMenu.value = false
    return showFixMenu.value
  }
  if (!menu.children.length) {
    showFixMenu.value = false
    return showFixMenu.value
  }
  menuList.value = menu.children
  showFixMenu.value = true
  return showFixMenu.value
}

/**
 * 离开菜单
 */
const leaveMenu = () => {
  maskIndex.value = null
  showFixMenu.value = false
  keyword.value = ''
}

/**
 * 点击菜单
 * @param menu
 */
enum EventType {
  menu = 'clickMenu', //点击菜单
  home = 'clickHome' //点击主页
}
interface EventEmits {
  (e: EventType.menu, menu: any, parentMenu: any): void
  (e: EventType.home, menu: any): void
}
const emit = defineEmits<EventEmits>()
const clickMenu = (menu: any) => {
  // 父级元素
  const parentMenu = maskIndex.value ? props.data[maskIndex.value] : null
  emit(EventType.menu, menu, parentMenu)
  leaveMenu()
}

/**
 * 点击首页
 * @param menu
 */
const clickHome = (menu: any) => {
  if (!props.checkHome(menu)) {
    return
  }
  emit(EventType.home, menu)
  leaveMenu()
}
</script>

<style scoped lang="scss">
.ct-header-menu {
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;

  .ct-header-menu-list {
    &:after {
      content: '';
      clear: both;
      display: block;
    }

    .ct-header-menu-item {
      float: left;
      padding: 0 12px;
      height: 32px;
      line-height: 32px;
      text-align: center;

      .ct-header-menu-item-icon {
        margin-right: 8px;
        font-size: $defaultFontSize;
        vertical-align: middle;
        height: 32px;
        line-height: 32px;
        opacity: 0.8;
      }

      .ct-header-menu-item-text {
        display: inline-block;
        font-size: $defaultFontSize;
        color: #fff;
        opacity: 0.8;
        font-weight: 500;
        vertical-align: middle;
        text-align: center;
      }
      &.select {
        cursor: pointer;
        background: rgba($color: #fff, $alpha: 0.1);
        border-radius: $circleRadiusSize;

        .ct-header-menu-item-icon,
        .ct-header-menu-item-text {
          opacity: 1;
        }
      }

      &.home {
        position: relative;
        margin-right: 20px;
        &::after {
          content: '';
          position: absolute;
          width: 1px;
          height: 12px;
          background: rgba(255, 255, 255, 0.3);
          // opacity: 0.35;
          right: -20px;
          top: 18px;
          transform: translateY(-50%);
        }
      }

      & + .ct-header-menu-item {
        margin-left: 20px;
      }
    }
  }

  .ct-header-layer {
    position: fixed;
    width: 100%;
    height: 100vh;
    min-width: 1440px;
    top: 50px;
    left: 0;
    z-index: 99;

    .ct-header-layer-content {
      position: absolute;
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      height: 553px;
      left: 0;
      top: 0;
      background: #fff;
    }

    .ct-mask-layer {
      width: 100%;
      height: 100%;
      background-color: #000000;
      opacity: 0.1;
    }

    .ct-header-layer-right {
      width: calc(100% - 212px);
      height: 100%;
      padding: 30px;
      box-sizing: border-box;

      .ct-header-layer-box {
        height: 100%;
        // 调整svg颜色
        :deep(.custom-svg) {
          color: #25314c;
        }
      }

      .ct-header-layer-search {
        width: 100%;
        margin-bottom: 20px;
        height: 32px;
        border-radius: $circleRadiusSize;
        position: relative;
        border: 1px solid #dcdcdc;

        input {
          width: 100%;
          height: 100%;
          background: #f3f3f4;
          box-sizing: border-box;
          text-indent: 32px;
          font-size: $defaultFontSize;
          outline: none;
          border: none;
        }

        .ct-header-layer-icon-magnifier {
          color: #000000 !important;
          font-size: $defaultFontSize;
          height: 32px;
          line-height: 32px;
          position: absolute;
          left: 9px;
        }
      }
      .header-layer-search {
        width: 100%;
        margin-bottom: 20px;
        border-radius: $circleRadiusSize;
        // background: #f3f3f4;
      }

      .ct-header-layer-menu-list {
        width: 100%;
        height: calc(100% - 52px);
        overflow-y: auto;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        .ct-header-layer-menu-item {
          width: calc(20% - 64px);
          min-width: 164px;
          margin-bottom: 20px;
        }

        .ct-header-layer-menu-item-title {
          padding-bottom: 12px;
          border-bottom: 0.5px solid rgba(197, 197, 197, 0.5);
          align-items: center;
          &.link {
            cursor: pointer;
          }

          .img-icon {
            vertical-align: middle;
          }

          .ct-header-menu-item-icon {
            color: #25314c;
            font-size: $defaultFontSize;
            vertical-align: middle;
            margin-right: 4px;
          }

          .ct-header-menu-item-text {
            font-family: 'ct-font-bold';
            font-size: $mediumFontSize;
            font-weight: 500;
            vertical-align: middle;
            color: $textColorPrimary;
          }
        }

        .ct-header-menu-child {
          margin-top: 12px;
          padding: 0px;
          li {
            font-size: $defaultFontSize;
            color: $textColorSecondary;
            line-height: 30px;

            & + li {
              margin-top: 8px;
            }

            &:hover {
              cursor: pointer;
              color: var(--el-color-primary);
            }
          }
        }
      }
    }
  }
}
ul li {
  list-style-type: none;
}
</style>
