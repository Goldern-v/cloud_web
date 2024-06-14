import { useCookies } from 'vue3-cookies'
const { cookies } = useCookies()
const TokenKey = 'Authorization'
class cookie {
  getToken() {
    return cookies.get(TokenKey) //获取键名为Authorization的值
  }
  setToken(token: string) {
    return cookies.set(TokenKey, token) //设置键名Authorization，值为token
  }

  removeToken() {
    return cookies.remove(TokenKey) //移除键名为Authorization的值
  }
}

export default new cookie()
