import { defineStore } from 'pinia'
import { ITheme } from '@/store/theme/interface'
import cache from '@/utils/cache'
import { useDictTypeAllApi } from '@/api/sys/dict'

export const appStore = defineStore('appStore', {
  state: () => ({
    // sidebar 是否展开
    sidebarOpened: cache.getSidebarOpened(),
    // 国际化
    language: cache.getLanguage(),
    // 组件大小
    componentSize: cache.getComponentSize(),
    // 字典列表
    dictList: [],
    // 主题
    theme: cache.getTheme()
  }),
  actions: {
    setSidebarOpened(show: boolean) {
      this.sidebarOpened = show || !this.sidebarOpened
      cache.setSidebarOpened(this.sidebarOpened)
    },
    setLanguage(locale: string) {
      this.language = locale
      cache.setLanguage(locale)
    },
    setComponentSize(size: string) {
      this.componentSize = size
      cache.setComponentSize(size)
    },
    async getDictListAction() {
      const { data } = await useDictTypeAllApi()
      this.dictList = data || []
    },
    setTheme(theme: ITheme) {
      this.theme = theme
      cache.setTheme(theme)
    }
  }
})
