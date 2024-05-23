import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import App from './App.vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { registerStore } from './store'
import { directive } from './utils/directive'
import { router } from './router'
import { i18n } from './i18n'
import 'virtual:svg-icons-register'
import '@/icons/iconfont/iconfont.css'

import '@/icons/iconfont/iconfont'
import 'element-plus/dist/index.css'
import '@/styles/index.scss'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
// 注册 Pinia
registerStore()
// 注册 自定义指令
directive(app)

// 引入 form-create
import { setupFormCreate } from '@/plugins/form-create'
app.use(setupFormCreate)

app.use(router)
app.use(i18n)
app.use(ElementPlus)
app.mount('#app')
