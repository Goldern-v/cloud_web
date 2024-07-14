import { defineStore } from 'pinia'
import { useAccountLoginApi, useMobileLoginApi, useLogoutApi } from '@/api/auth'
import { useUserInfoApi } from '@/api/sys/user'
import cache from '@/utils/cache'
import { useAuthorityListApi } from '@/api/sys/menu'
import Cookies from 'js-cookie'
import CacheKey from '@/utils/cache/key'

export const userStore = defineStore('userStore', {
  state: () => ({
    // 用户信息
    user: {
      id: '',
      username: '',
      avatar: ''
    },
    // 权限列表
    authorityList: [],
    // 登录token
    token: Cookies.get(CacheKey.CookieKey) || cache.getToken(),
    // 首次登录
    firstLogin: false,
    // 登录界面返回的id,用于首次登录跳转重置密码
    id: ''
  }),
  actions: {
    setUser(val: any) {
      this.user = val
    },
    setToken(val: any) {
      this.token = val
      cache.setToken(val)
    },
    setFirstLogin(val: any) {
      this.firstLogin = val
    },
    setId(val: any) {
      this.id = val
    },
    // 账号登录
    async accountLoginAction(loginForm: any) {
      const { data } = await useAccountLoginApi(loginForm)
      this.setToken(data.access_token)
      this.setFirstLogin(data.skip)
      this.setId(data.id)
    },
    // 手机号登录
    async mobileLoginAction(loginForm: any) {
      const { data } = await useMobileLoginApi(loginForm)
      this.setToken(data.access_token)
    },
    // 获取用户信息
    async getUserInfoAction() {
      const { data } = await useUserInfoApi()
      this.setUser(data)
    },
    // 获取权限
    async getAuthorityListAction() {
      const { data } = await useAuthorityListApi()
      this.authorityList = data || []
    },
    // 用户退出
    async logoutAction() {
      const { data } = await useLogoutApi()
      // 移除 token
      Cookies.remove(CacheKey.CookieKey)
      this.setToken(null)

      if (data) {
        window.open(data, '_self')
      } else {
        location.reload()
      }
    }
  }
})
