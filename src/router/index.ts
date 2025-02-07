import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'
import { i18n } from '@/i18n'
import { isExternalLink, pathToCamel } from '@/utils/tool'
import CacheKey from '@/utils/cache/key'
import Cookies from 'js-cookie'

NProgress.configure({ showSpinner: false })
/**
 * 注: 本地路由有改动, @/layout/components/Theme/active-path 的路由也许改动
 */
import { publicMenu } from './public'
const publicRoute = publicMenu()
import { operateCenterMenu } from './operate-center'
const operateCenterRoute = operateCenterMenu()
import { businessCenterMenu } from './business-center'
const businessCenterRoute = businessCenterMenu()
import { maintenanceCenterMenu } from './maintenance-center'
const maintenanceCenterRoute = maintenanceCenterMenu()

import { bpmMenu } from './bpm'
const bpmRouter = bpmMenu()

const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: () => import('../layout/index.vue'),
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('../layout/components/Router/Redirect.vue')
      }
    ]
  },
  {
    path: '/iframe/:query?',
    component: () => import('../layout/components/Router/Iframe.vue')
  },
  {
    path: '/login',
    component: () => import('../views/operate-center/supplier/login/index.vue')
  },
  {
    path: '/404',
    component: () => import('../views/404.vue')
  },
  {
    path: '/big-screen',
    component: () => import('../views/big-screen/index.vue')
  },
  {
    path: '/agreement',
    component: () =>
      import('../views/operate-center/supplier/login/agreement/index.vue')
  },
  {
    path: '/ctyun/novnc',
    component: () => import('@/views/multi-cloud/cloud-host/novnc/index.vue')
  },
  ...publicRoute,
  ...operateCenterRoute,
  ...businessCenterRoute,
  ...bpmRouter,
  ...maintenanceCenterRoute
]

const asyncRoutes: RouteRecordRaw = {
  path: '/',
  component: () => import('../layout/index.vue'),
  redirect: '/operate-center/supplier/manage/information-manage/index',
  children: [
    {
      path: '/home/index',
      name: 'Home',
      component: () => import('../views/home/index.vue'),
      meta: {
        title: i18n.global.t('router.home'),
        affix: true
      }
    },
    {
      path: '/profile/password',
      name: 'ProfilePassword',
      component: () => import('../views/profile/password.vue'),
      meta: {
        title: i18n.global.t('router.profilePassword'),
        cache: true
      }
    }
  ]
}

// 配置常量菜单
export const constantMenu = [
  {
    id: 1000,
    name: 'Demo',
    url: null,
    openStyle: 0,
    icon: 'icon-windows',
    children: []
  }
]

export const errorRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)',
  redirect: '/404'
}

export const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes
})

// 白名单列表
const whiteList = ['/login', '/agreement']

// 路由跳转前
router.beforeEach(async (to, from, next) => {
  NProgress.start()

  // token存在的情况
  if (store.userStore.token) {
    if (to.path === '/login') {
      next('/home')
    } else {
      // 用户信息不存在，则重新拉取
      if (!store.userStore.user.id) {
        try {
          await store.userStore.getUserInfoAction()
          await store.userStore.getAuthorityListAction()
          await store.appStore.getDictListAction()
        } catch (error) {
          // 请求异常，则跳转到登录页
          store.userStore?.setToken('')
          Cookies.remove(CacheKey.CookieKey)
          next('/login')
          return Promise.reject(error)
        }

        // 动态菜单+常量菜单
        const menuRoutes = await store.routerStore.getMenuRoutes()

        // 获取扁平化路由，将多级路由转换成一级路由
        const keepAliveRoutes = getKeepAliveRoutes(menuRoutes, [])

        //静态路由获取上级面包屑
        constantRoutesGetBreadcrumb(menuRoutes)

        // 添加菜单路由
        asyncRoutes.children?.push(...keepAliveRoutes)
        router.addRoute(asyncRoutes)

        // 错误路由
        router.addRoute(errorRoute)

        // 保存路由数据
        store.routerStore.setRoutes(constantRoutes.concat(asyncRoutes))

        next({ ...to, replace: true })
      } else {
        next()
      }
    }
  } else {
    // 没有token的情况下，可以进入白名单
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
    }
  }
})

// 路由加载后
router.afterEach(() => {
  NProgress.done()
})

const constantRoutesGetBreadcrumb = (routes: RouteRecordRaw[]) => {
  constantRoutes.forEach(consRoute => {
    consRoute.children?.forEach(route => {
      const res = getDeeproute(routes, route)
      if (!res && route.meta?.useDefaultBreadcrumb) {
        const indexArr: number[] = []
        routes.find((r1, r1index) => {
          const r1Result = r1.children?.find((r2, r2index) => {
            if (r2.meta!.title === route.meta!.useDefaultBreadcrumb) {
              indexArr.unshift(r2index)
              return true
            }
          })
          if (r1Result) {
            indexArr.unshift(r1index)
            return true
          }
        })
        if (indexArr.length) {
          const arr: any[] = []
          indexArr.forEach((key, index) => {
            arr[index] = {
              title:
                index === 0
                  ? routes[key].meta!.title
                  : routes[key]?.children?.[key]?.meta?.title
            }
          })
          route.meta!.breadcrumb = [...arr, { title: route.meta!.title }]
        }
      }
    })
  })
}

const getDeeproute = (
  routes: RouteRecordRaw[],
  targetRoute: RouteRecordRaw
) => {
  return routes.find((r1: any) => {
    if (r1.meta.title === targetRoute?.meta?.fatherTlt) {
      targetRoute.meta!.breadcrumb = [
        ...r1.meta.breadcrumb,
        {
          title: targetRoute.meta!.title,
          path: '/' + targetRoute.path
        }
      ]
      return true
    } else if (r1.children.length) {
      getDeeproute(r1.children, targetRoute)
    }
  })
}

// 获取扁平化路由，将多级路由转换成一级路由
export const getKeepAliveRoutes = (
  rs: RouteRecordRaw[],
  breadcrumb: string[]
): RouteRecordRaw[] => {
  const routerList: RouteRecordRaw[] = []

  rs.forEach((item: any) => {
    if (item.meta.title) {
      const breadcrumbItem: any = {
        title: item.meta.title
      }
      if (item.meta.url) {
        breadcrumbItem.path = '/' + item.meta.url
      }
      breadcrumb.push(breadcrumbItem)
    }

    if (item.children && item.children.length > 0) {
      routerList.push(...getKeepAliveRoutes(item.children, breadcrumb))
    } else {
      item.meta.breadcrumb.push(...breadcrumb)
      routerList.push(item)
    }

    breadcrumb.pop()
  })
  return routerList
}

// 加载vue组件
const layoutModules = import.meta.glob('/src/views/**/*.vue')

// 根据路径，动态获取vue组件
const getDynamicComponent = (path: string): any => {
  return layoutModules[`/src/views/${path}.vue`]
}

// 根据菜单列表，生成路由数据
export const generateRoutes = (menuList: any): RouteRecordRaw[] => {
  const routerList: RouteRecordRaw[] = []

  menuList.forEach((menu: any) => {
    let component
    let path
    if (menu.children && menu.children.length > 0) {
      component = () => import('@/layout/index.vue')
      path = '/p/' + menu.id
    } else {
      // 判断是否iframe
      if (isIframeUrl(menu)) {
        component = () => import('@/layout/components/Router/Iframe.vue')
        path = '/iframe/' + menu.id
      } else {
        component = getDynamicComponent(menu.url)
        path = '/' + menu.url
      }
    }
    const route: RouteRecordRaw = {
      path: path,
      name: pathToCamel(path),
      component: component,
      children: [],
      meta: {
        title: menu.name,
        icon: menu.icon,
        code: menu.code,
        id: '' + menu.id,
        url: menu.url,
        cache: true,
        newOpen: menu.openStyle === 1,
        breadcrumb: []
      }
    }
    // 有子菜单的情况
    if (menu.children && menu.children.length > 0) {
      route.children?.push(...generateRoutes(menu.children))
    }

    routerList.push(route)
  })

  return routerList
}

// 判断是否iframe
const isIframeUrl = (menu: any): boolean => {
  // 如果是新页面打开，则不用iframe
  if (menu.openStyle === 1) {
    return false
  }

  // 是否外部链接
  return isExternalLink(menu.url)
}
