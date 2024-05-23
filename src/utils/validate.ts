import { i18n } from '@/i18n'

export const isExternalLink = (path: string): boolean => {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export const validateEmail = (
  rule: any,
  value: any,
  callback: (e?: Error) => any
) => {
  const reg =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error(i18n.global.t('error.email')))
  }
}

export const validatePassword = (
  rule: any,
  value: any,
  callback: (e?: Error) => any
) => {
  if (value.length < 4) {
    callback(new Error(i18n.global.t('error.password', { len: 4 })))
  } else {
    callback()
  }
}

export const validateMobile = (mobile: string): boolean => {
  return /^1[3456789]\d{9}$/.test(mobile)
}

// 禁用纯中文或纯数字
export const forbiddenNumberOrCN = (
  rule: any,
  value: any,
  callback: (e?: Error) => any
) => {
  let reg = new RegExp('^[^\u4e00-\u9fa5]{2,63}$')
  if (reg.test(value)) {
    if (!value.match(/[^\d]+/g)) {
      callback(new Error('不能使用纯数字'))
    } else {
      callback()
    }
  } else {
    callback(new Error('不能使用中文或者纯数字,且长度为2-63字符'))
  }
}

// 只能由数字、字母、-组成，不能以数字和-开头、以-结尾
export const nameRuleOne = (
  rule: any,
  value: any,
  callback: (e?: Error) => any
) => {
  const reg = /^[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9]$/
  if (value.length > rule.maxLength || value.length < rule.minLength) {
    callback(new Error(`名称长度为${rule.minLength}-${rule.maxLength}字符`))
  } else if (!reg.test(value)) {
    callback(new Error('只能由数字、字母、-组成，不能以数字和-开头、以-结尾'))
  } else {
    callback()
  }
}
// 名称由字母、数字、中划线、下划线、小数点组成，且必须以字母或者数字开头和结尾
export const nameRuleTwo = (
  rule: any,
  value: any,
  callback: (e?: Error) => any
) => {
  const reg = /^[a-zA-Z0-9][a-zA-Z0-9-_.]{0,}[a-zA-Z0-9]$/
  if (value.length > rule.maxLength || value.length < rule.minLength) {
    callback(new Error(`名称长度为${rule.minLength}-${rule.maxLength}字符`))
  } else if (!reg.test(value)) {
    callback(new Error('只能由数字、字母、-组成，不能以数字和-开头、以-结尾'))
  } else {
    callback()
  }
}
//支持中英文、数字
export const nameRuleThree = (
  rule: any,
  value: any,
  callback: (e?: Error) => any
) => {
  const reg = /^[a-zA-Z0-9\u4e00-\u9fa5]{0,}$/
  if (value.length > rule.maxLength || value.length < rule.minLength) {
    callback(new Error(`名称长度为${rule.minLength}-${rule.maxLength}字符`))
  } else if (!reg.test(value)) {
    callback(new Error('只支持中英文、数字'))
  } else {
    callback()
  }
}
// 密码
export const passwordRule = (rule: any, value: any, callback: (e?: Error) => any) => {
  const reg = /^[^/](?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]/
  if (value.length > rule.maxLength || value.length < rule.minLength) {
    callback(new Error(`密码长度为${rule.minLength}-${rule.maxLength}字符`))
  } else if (!reg.test(value)) {
    callback(new Error('密码只能包含大写字母、小写字母、数字和特殊字符（!@$%^-_=+[{}]:,./?）且至少包含四种字符中的三种且不能以斜线号（/）开头，不能包含连续字符'))
  } else {
    callback()
  }
}
