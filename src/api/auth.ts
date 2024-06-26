import service from '@/utils/request'
import { iams } from './java/prefix'
type Api = typeof Api[keyof typeof Api]
const Api = {
  AUTH_CAPTCHA: `${iams}/sys/auth/captcha`, // 登录验证
  AUTH_SEND_CODE: `${iams}/sys/auth/send/code`, // 发送验证码
  AUTH_LOGIN: `${iams}/sys/auth/login`, // 账号登录
  AUTH_LOGIN_MOBILE: `${iams}/sys/auth/mobile`, // 手机号登录
  AUTH_LOGOUT: `${iams}/sys/auth/logout`, // 退出
  AUTH_RESET: `${iams}/sys/user/supplier/password` // 供应商修改密码
}

export const useCaptchaApi = () => {
  return service.get(Api.AUTH_CAPTCHA)
}

export const useSendCodeApi = (mobile: string) => {
  return service.post(`${Api.AUTH_SEND_CODE}?mobile=${mobile}`)
}

export const useAccountLoginApi = (data: any) => {
  return service.post(Api.AUTH_LOGIN, data)
}

export const useMobileLoginApi = (data: any) => {
  return service.post(Api.AUTH_LOGIN_MOBILE, data)
}

export const useLogoutApi = () => {
  return service.post(Api.AUTH_LOGOUT)
}

export const useAccountResetApi = (data: any) => {
  return service.put(Api.AUTH_RESET, data)
}
