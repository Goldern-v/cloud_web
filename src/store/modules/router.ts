import { useMenuNavApi } from '@/api/sys/menu'
import { generateRoutes, constantMenu } from '@/router'
import { RouteRecordRaw } from 'vue-router'
import cache from '@/utils/cache'

export const routerStore = defineStore('routerStore', {
  state: () => ({
    menuRoutes: [] as RouteRecordRaw[],
    routes: [] as RouteRecordRaw[],
    monitorRoute: ''
  }),
  actions: {
    async getMenuRoutes() {
      const { data } = await useMenuNavApi()
      const routes = generateRoutes(data)

      this.menuRoutes.push(...routes)

      // 常量菜单
      // const constantRoutes = generateRoutes(constantMenu)
      // this.menuRoutes.push(...constantRoutes)

      return this.menuRoutes
    },
    setRoutes(routers: RouteRecordRaw[]) {
      this.routes = routers
    },
    //运维中心设置监控页的侧边栏
    setMonitorSidebar(route: string) {
      this.monitorRoute = route
      cache.setMonitorSidebar(route)
    }
  }
})

function isChild(route: RouteRecordRaw, pRoute: RouteRecordRaw): boolean {
  if (
    pRoute.children &&
    pRoute.children.find(child => `${pRoute.path}/${child.path}` === route.path)
  ) {
    return true
  }
  return false
}

export function handleRoutes(routes: RouteRecordRaw[]): RouteRecordRaw[] {
  let map = new Map<string, boolean>() // 是否顶级路由
  routes.forEach(route => {
    if (routes.find(pRoute => isChild(route, pRoute))) {
      map.set(route.path, false) // 该路由是某个路由的子路由
    } else {
      map.set(route.path, true) // 该路由不是任何路由的子路由,是顶级路由
    }
  })
  return routes.filter(route => map.get(route.path)) // 返回所有顶级路由
}
