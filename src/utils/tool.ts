import type { App, Plugin } from 'vue'
import constant from '@/utils/constant'
import { useClipboard } from '@vueuse/core'
import { ElMessage } from 'element-plus/es'
import { ResourceCreationApi, ResourceCreationName } from '@/utils/dictionary'
import { getVdcApprovalProcess } from '@/api/java/public' //获取vdc对应审批流程
import { queryPaymentOrder } from '@/api/java/business-center' //订单提交

// 把路径转换成驼峰命名
export const pathToCamel = (path: string): string => {
  return path.replace(/\/(\w)/g, (all, letter) => letter.toUpperCase())
}

// 是否外链
export const isExternalLink = (url: string): boolean => {
  return /^(https?:|\/\/|http?:|\/\/|^{{\s?apiUrl\s?}})/.test(url)
}

// 替换外链参数
export const replaceLinkParam = (url: string): string => {
  return url.replace('{{apiUrl}}', constant.apiUrl)
}

// 转换文件大小格式
export const convertSizeFormat = (size: number): string => {
  const unit = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
  let index = Math.floor(Math.log(size) / Math.log(1024))
  let newSize = size / Math.pow(1024, index)

  // 保留的小数位数
  return newSize.toFixed(2) + ' ' + unit[index]
}

// 获取svg图标(id)列表
export const getIconList = (): string[] => {
  const rs: string[] = []
  const list = document.querySelectorAll('svg symbol')
  for (let i = 0; i < list.length; i++) {
    rs.push(list[i].id)
  }
  return rs
}

// 获取字典Label
export const getDictLabel = (
  dictList: any[],
  dictType: string,
  dictValue: string
) => {
  const type = dictList.find((element: any) => element.dictType === dictType)
  if (type) {
    const val = type.dataList.find(
      (element: any) => element.dictValue === dictValue + ''
    )
    if (val) {
      return val.dictLabel
    } else {
      return dictValue
    }
  } else {
    return dictValue
  }
}

// 获取字典数据列表
export function getDictDataList(dictList: any[], dictType: string) {
  const type = dictList.find((element: any) => element.dictType === dictType)
  if (type) {
    return type.dataList
  } else {
    return []
  }
}

// 全局组件安装
export const withInstall = <T>(component: any, alias?: string) => {
  const comp = component as any
  comp.install = (app: App) => {
    app.component(comp.name || comp.displayName || comp.__name, component)
    if (alias) {
      app.config.globalProperties[alias] = component
    }
  }
  return component as T & Plugin
}

/**
 * @description: loading提示, 不传值则取默认值显示。
 * @param {*} loadingText 加载提示文字, 默认Loading
 * @param {*} loadingBackground 加载背景色, 默认黑色背景
 * @return {*}
 */
import { ElLoading } from 'element-plus'
let loading: any
export const showLoading = (
  loadingText = 'Loading',
  loadingBackground = 'rgba(0, 0, 0, 0.7)'
) => {
  let options = {
    lock: true,
    text: loadingText,
    spinner: 'el-icon-loading',
    background: loadingBackground
  }
  loading = ElLoading.service(options)
}

export const hideLoading = () => {
  loading.close()
}
// 粘贴复制
export const clickCopy = (value: string) => {
  if (navigator.clipboard) {
    const { copy } = useClipboard()
    copy(value)
  } else {
    // 修复http协议复制无效
    const input = document.createElement('input')
    input.setAttribute('value', value)
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
  }
  ElMessage.success('复制成功!')
}
export const routePrefix = () => {
  const osId = ref('')
  const prefixPath = ref('')

  onBeforeMount(() => {
    getPrefix()
  })

  const getPrefix = () => {
    prefixPath.value = 'jdCloud'
    if (RegExp(/tencent/g).test(osId.value)) {
      prefixPath.value = 'tencentCloud'
    }
    return prefixPath.value
  }
  return { prefixPath }
}
/**
 * 比较表单,只取修改项
 * originDic: 深拷贝表单 modifyDic: 表单
 */
export const compareDiffDictionary = (
  originDic: { [key: string]: any },
  modifyDic: { [key: string]: any }
): { [key: string]: any } => {
  const resultDic: { [key: string]: any } = {}
  Object.getOwnPropertyNames(originDic).forEach((key: any) => {
    if (modifyDic[key] !== originDic[key]) {
      resultDic[key] = modifyDic[key]
    }
  })
  return resultDic
}
// 数组是否存在某值
export const existPropWithArray = (
  value: string,
  array: any[],
  key: string
): boolean => {
  let result = false
  if (!array.length || !value || !key) {
    return result
  }

  result = array.some((item: any) => item[key] === value)
  return result
}
// 随机码
const allCharacters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const lowerCaseCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789'
/**
 * type: all 大小写数字 lowerCase: 小写数字
 */
export const generateCode = (len: number, type = 'lowerCase'): string => {
  let charStr = lowerCaseCharacters
  if (type === 'all') {
    charStr = allCharacters
  } else if (type === 'lowerCase') {
    charStr = lowerCaseCharacters
  }
  let code = ''
  for (let i = 0; i < len; i++) {
    const randomIndex = Math.floor(Math.random() * charStr.length)
    code += charStr.charAt(randomIndex)
  }
  return code
}
// 图片URL转换Base64格式
export const convertImageToBase64 = (imageUrl: string, callback: any) => {
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.height = img.naturalHeight
    canvas.width = img.naturalWidth
    ctx?.drawImage(img, 0, 0)
    const dataUrl = canvas.toDataURL()
    callback && callback(dataUrl)
  }
  img.src = imageUrl
}

// 获取vdc对应审批流程
export const approvalProcess = (
  createApi: string,
  id: number | string,
  orderId: number | string
) => {
  return new Promise((resolve, rejects) => {
    const params: any = {
      requestUrl: ResourceCreationApi[createApi],
      vdcId: id
    }
    getVdcApprovalProcess(params).then((res: any) => {
      if (res.code === 200) {
        // 判断是否含有data，且data不为空
        if (res.hasOwnProperty('data') && res.data) {
          // 不走审批
          resolve(res)
          ElMessage.success(
            `${ResourceCreationName[createApi]}订单生成成功，请等待审批`
          )
        } else {
          // 提交订单
          queryPaymentOrder({ orderId })
            .then((res: any) => {
              if (res.code === 200) {
                ElMessage.success(`${ResourceCreationName[createApi]}请求成功`)
                resolve(res)
              }
            })
            .catch(err => {
              rejects(err)
            })
        }
      }
    })
  })
}
