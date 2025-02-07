import axios from 'axios'
import qs from 'qs'
import store from '@/store'
import cache from '@/utils/cache'
import { ElMessage } from 'element-plus/es'
import Cookies from 'js-cookie'
import CacheKey from '@/utils/cache/key'

// axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL as any,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json;charset=UTF-8' }
})

// 请求拦截器
service.interceptors.request.use(
  (config: any) => {
    const userStore = store.userStore
    if (userStore?.token) {
      config.headers.Authorization = userStore.token
    }
    const { resourcePool, regionCode } = storeToRefs(store.resourceStore)
    if (resourcePool.value?.resourcePoolId && regionCode.value) {
      config.headers.resourceBundleId = resourcePool.value?.resourcePoolId
      config.headers.region = regionCode.value
    }

    config.headers['Accept-Language'] = cache.getLanguage()

    // 追加时间戳，防止GET请求缓存
    if (config.method?.toUpperCase() === 'GET') {
      config.params = { ...config.params, t: new Date().getTime() }
    }

    if (
      Object.values(config.headers).includes(
        'application/x-www-form-urlencoded'
      )
    ) {
      config.data = qs.stringify(config.data)
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    if (response.status !== 200) {
      return Promise.reject(new Error(response.statusText || 'Error'))
    }

    const res = response.data
    if (Object.prototype.toString.call(res) === '[object Blob]') {
      return response
    }

    // 200响应成功 400用户登录密码错误提示
    if (res.code === 200 || res.code === 400) {
      return res
    }

    // 没有权限，如:未登录、登录过期等，需要跳转到登录页
    if (res.code === 401) {
      store.userStore?.setToken('')
      Cookies.remove(CacheKey.CookieKey)
      location.reload()
    }

    // 错误提示
    ElMessage.error(res.msg || res.data)

    return Promise.reject(new Error(res.msg || 'Error'))
  },
  error => {
    ElMessage.error(error.message)
    return Promise.reject(error)
  }
)

// 导出 axios 实例
export default service
