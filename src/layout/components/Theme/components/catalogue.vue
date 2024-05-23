<template>
  <div>
    <header-menu
      :data="menuList"
      :check-home="checkMenuHome"
      @clickMenu="clickMenu"
      @clickHome="clickHome"
    />
  </div>
</template>

<script setup lang="ts">
import store from '@/store'
import HeaderMenu from '@/layout/components/HeaderMenu/index.vue'
import { isExternalLink, replaceLinkParam } from '@/utils/tool'

const menuList = store.routerStore.menuRoutes

/**
 * 点击首页
 */
const router = useRouter()
const clickHome = (menu: any) => {
  router.push(menu.path)
}
/**
 * 点击菜单
 * @param menu 菜单
 * @param parentMenu 父级元素
 */
const clickMenu = (menu: any, parentMenu: any) => {
  console.log(menu, parentMenu)

  if (menu.children && menu.children.length > 0) {
    // 如果不止二级菜单，顶部导航栏默认跳转下级第一个菜单
    menuJump(menu.children[0])
  } else {
    menuJump(menu)
  }
}

/**
 * 菜单跳转逻辑
 * @param menu 菜单数据
 */
const menuJump = (menu: any) => {
  // 不是新开页面，则直接切换路由
  if (!menu.meta.newOpen) {
    router.push(menu.path)
    return
  }
  // 新开页面逻辑
  if (isExternalLink(menu.meta.url)) {
    // 外链
    window.open(replaceLinkParam(menu.meta.url), '_blank')
  } else {
    // 内部组件
    window.open('#' + menu.meta.url, '_blank')
  }
}

/**
 * 菜单项
 * @param menu
 * @return Boolean 是否是首页
 */
const checkMenuHome = (menu: any) => {
  return menu.name === 'HomeIndex'
}
</script>

<style scoped lang="scss"></style>
