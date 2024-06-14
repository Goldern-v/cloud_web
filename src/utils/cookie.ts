import Cookies from 'js-cookie'

const TokenKey = 'Authorization'
class cookie {
  getToken() {
    return Cookies.get(TokenKey) //获取键名为Authorization的值
  }
  setToken(token: string) {
    return Cookies.set(TokenKey, token) //设置键名Authorization，值为token
  }

  removeToken() {
    return Cookies.remove(TokenKey) //移除键名为Authorization的值
  }
}

export default new cookie()
