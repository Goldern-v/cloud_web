<template>
  <el-container class="layout-container layout-columns">
    <el-header class="navbar-container" :class="headerClass">
      <el-container>
        <Logo v-if="theme.isLogo" class="logo-container" />
        <Catalogue> </Catalogue>
      </el-container>
      <NavbarRight />
    </el-header>

    <el-container>
      <el-aside v-if="subMenus.length > 0" :width="sideMenuWidth">
        <div
          class="flex-row module-box"
          :style="{ 'margin-left': showSidebar ? '20px' : '15px' }"
        >
          <Hamburger class="module-hamburger" />
          <div v-if="showSidebar" class="module-title">{{ moduleTitle }}</div>
        </div>

        <el-scrollbar class="side-scrollbar-container">
          <el-menu
            :default-active="defaultActive"
            :collapse="!store.appStore.sidebarOpened"
            :unique-opened="store.appStore.theme.uniqueOpened"
            background-color="transparent"
            :collapse-transition="false"
            mode="vertical"
          >
            <menu-item v-for="menu in subMenus" :key="menu.path" :menu="menu">
            </menu-item>
          </el-menu>
        </el-scrollbar>
      </el-aside>

      <el-main class="main-container">
        <Main />
      </el-main>
      <fix-info v-if="isAdmin"></fix-info>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import store from '@/store'
import Logo from '@/layout/components/Logo/index.vue'
import NavbarRight from '@/layout/components/Navbar/NavbarRight.vue'
import Main from '@/layout/components/Main/index.vue'
import fixInfo from '@/layout/components/fix-info/index.vue'
import MenuItem from '@/layout/components/Menu/MenuItem.vue'
import Hamburger from '@/layout/components/Navbar/components/Hamburger.vue'
import Catalogue from './components/catalogue.vue'
import { RouteRecordRaw } from 'vue-router'
import { replacePath } from '@/router/replace'

const route = useRoute()
const router = useRouter()

const defaultActive = computed(() => {
  const { path } = route
  return replacePath(path)
})

const showSidebar = computed(() => store.appStore.sidebarOpened)
const moduleTitle = ref<string>('') // 模块标题

const subMenus = ref<any[]>([])
watch(route, () => {
  subMenus.value = []
  initSubMenu()
})

onMounted(() => {
  initSubMenu()
})

const isAdmin = computed(
  () => !store.userStore.user.roleTypeList?.includes('3')
)

const menuPath = ref<string>('')
const initSubMenu = () => {
  menuPath.value = defaultActive.value
  for (const menu of store.routerStore.menuRoutes) {
    // 是否包含当前路由
    const exist = findRoute(menu.children)
    if (exist) {
      subMenus.value = menu.children
      menuPath.value = menu.path
      moduleTitle.value = menu.meta.title
      break
    }
  }
}

const findRoute = (menus: RouteRecordRaw[]): boolean => {
  for (const menu of menus) {
    // 有子菜单的情况
    if (menu.children && menu.children.length > 0) {
      if (findRoute(menu.children)) {
        return true
      }
    } else if (menu.path === defaultActive.value) {
      return true
    }
  }
  return false
}

const findLeafRoute = (menus: RouteRecordRaw[]): any => {
  for (const menu of menus) {
    // 有子菜单的情况
    if (menu.children && menu.children.length > 0) {
      return findLeafRoute(menu.children)
    } else {
      return menu
    }
  }
  return null
}

const headerClass = computed(() =>
  store.appStore.theme.headerStyle === 'theme' ? 'header-theme' : ''
)

const sidebarClass = computed(() => {
  return store.appStore.theme.sidebarStyle === 'dark' ? 'sidebar-dark' : ''
})

const theme = computed(() => store.appStore.theme)

const sideMenuWidth = computed(() =>
  store.appStore.sidebarOpened ? '200px' : '49px'
)
</script>

<style lang="scss" scoped>
.navbar-container {
  height: var(--navigation-bar-height);
  display: flex;
  align-items: center;
  background: $headerNavbarBgColor;
  border-bottom: 0px solid var(--theme-border-color-light);
  color: var(--theme-header-text-color);
  :deep(.svg-icon) {
    align-items: center;
    cursor: pointer;
    // line-height: var(--navigation-bar-height); // var(--theme-header-height);
    padding: 0;
    svg {
      // color: var(--theme-header-text-color) !important;
      font-size: 16px;
    }
    &:hover {
      background: var(--theme-header-hover-color);
    }
  }
  .logo-container {
    border-bottom: 0;
    justify-content: flex-start;
    width: 212px !important;
  }
}
.side-scrollbar-container {
  height: calc(100vh - var(--menu-header-height) - var(--theme-header-height));
}
.module-box {
  justify-content: flex-start;
  align-items: center;
  height: var(--menu-header-height) !important;
  line-height: var(--menu-header-height) !important;
  border-bottom: 1px solid #f4f4f4;
  .module-hamburger {
    margin-top: 7px;
  }
  .module-title {
    width: calc(100% - 20px - 16px - 5px - 20px);
    font-size: $mediumFontSize !important;
    font-weight: 500;
    padding-left: 5px;
  }
}
.main-container {
  height: calc(
    100vh - var(--breadcrumb-height) - 12px
  ); // Main组件 面包屑高度--breadcrumb-height 顶边距12px
  padding: 0 0 20px;
  background-color: #f0f2f5; // 面包屑背景色
}
// 设置右边框
:deep(.el-aside) {
  border-right: 1px solid rgba($color: $componentBorder, $alpha: 0.3);
}
:deep(.el-menu--collapse) {
  width: 49px;
}
// 调整收起菜单
:deep(.el-menu-tooltip__trigger),
:deep(.el-sub-menu__title) {
  padding: 0 15px;
}
</style>
