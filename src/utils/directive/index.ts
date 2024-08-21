import type { App } from 'vue'
import { auth } from './auth'
import { input, numberOnly } from './input'

export const directive = (app: App) => {
  // 权限指令
  auth(app)
  input(app)
  numberOnly(app)
}
