/**
 * 为了本地路由跳转时替换激活菜单的index, 保持左侧菜单仍显示
 * 例: 点击创建云主机, 将el-menu的页面加载时激活菜单default-active 从/multi-cloud/cloud-host/create替换成原来的/multi-cloud/cloud-host/list
 * 后期如果有好的解决方案也可以替换此方案
*/
import { replaceResourcePath } from './resource'
import { replaceMaintenancePath } from './maintenance'
import { replaceBusinessPath } from './business'
import { replaceOperatePath } from './operate'
import { replaceBpmPath } from './bpm'

// 添加本地路由跳转, 相关联的写在一起
export const replacePath = (path: string): string  => {
  let result = ''

  if (RegExp(/multi-cloud/).test(path)) {
    result = replaceResourcePath(path)
  } else if (RegExp(/maintenance-center/).test(path)) {
    result = replaceMaintenancePath(path)
  } else if (RegExp(/business-center/).test(path)) {
    result = replaceBusinessPath(path)
  } else if (RegExp(/operate-center/).test(path)) {
    result = replaceOperatePath(path)
  } else if (RegExp(/bpm-manage/).test(path)) {
    result = replaceBpmPath(path)
  } else {
    result = path
  }

  return result
}
