import type { App } from 'vue'
import type { DirectiveBinding } from 'vue'

/**
 * v-input.float="{ decimal:2 }"
 */

export const input = (app: App) => {
  app.directive('input', {
    beforeMount(el: HTMLElement, binding: DirectiveBinding) {
      el.addEventListener('input', (event: any) => {
        const target = event.target as HTMLInputElement

        // 整数
        if (binding.modifiers.int) {
          target.value = target.value.replace(/\D/, '')
        }
        // 小数
        if (binding.modifiers.float) {
          let decimal = 2
          if (binding.value.decimal) {
            decimal = binding.value.decimal
          }
          target.value = handleFloat(target.value, decimal)
        }
      })
    }
  })
}

/**
 * 处理小数
 * value: 输入值 decimal: 小数位数
 */
const handleFloat = (value: string, decimal: number): string => {
  const reg = new RegExp(`^\\d*(\\.?\\d{0,${decimal}})`)
  const arr = value
    .replace(/[^\d^\.]+/g, '') // 第二步:把不是数字，不是小数点的过滤掉
    .replace(/^0+(\d)/, '$1') // 第三步:第一位0开头，0后面为数字，则过滤掉，取后面的数字
    .replace(/^\./, '0.') // 第四步:如果输入的第一位为小数点，则替换成 0. 实现自动补全
    .match(reg)
  return arr?.length ? arr[0] : ''
}

export const numberFloat = (app: App) => {
  app.directive('number-float', {
    beforeMount(el, binding) {
      const obj = binding.value.obj
      const key = binding.value.key

      const inputHandler = e => {
        let value = e.target.value

        // 移除非数字字符，允许小数点，但只允许一个
        value = value.replace(/[^0-9.]/g, '')

        // 允许小数点最多两位
        if (value.includes('.')) {
          const [integerPart, decimalPart] = value.split('.')
          value = integerPart + '.' + decimalPart.slice(0, 2)
        }

        // 如果值为空，则设置为 0
        if (value.charAt(0) === '.') {
          value = ''
        }
        obj[key] = value
      }
      const compositionend = (e: any) => {
        console.log(e, 'compositionend')
        const str = e.data
        const regex = new RegExp(str, 'g')
        obj[key] = obj[key].replace(regex, '')
      }
      el.__inputHandler = inputHandler // 将处理函数保存在元素的属性中
      el.__compositionend = compositionend // 将处理函数保存在元素的属性中

      el.addEventListener('input', inputHandler)
      el.addEventListener('compositionend', compositionend)
    },
    beforeUnmount(el) {
      if (el.__inputHandler) {
        el.removeEventListener('input', el.__inputHandler)
        delete el.__inputHandler // 清除保存的处理函数引用
      }
      if (el.__compositionend) {
        el.removeEventListener('compositionend', el.__compositionend)
        delete el.__compositionend // 清除保存的处理函数引用
      }
    }
  })
}
export const numberOnly = (app: App) => {
  app.directive('number-only', {
    beforeMount(el, binding) {
      const obj = binding.value.obj
      const key = binding.value.key

      const inputHandler = e => {
        obj[key] = e.target.value.replace(/[^0-9]/g, '')
      }
      const compositionend = (e: any) => {
        const str = e.data
        const regex = new RegExp(str, 'g')
        obj[key] = obj[key].replace(regex, '')
      }
      el.__inputHandler = inputHandler // 将处理函数保存在元素的属性中
      el.__compositionend = compositionend // 将处理函数保存在元素的属性中

      el.addEventListener('input', inputHandler)
      el.addEventListener('compositionend', compositionend)
    },
    beforeUnmount(el) {
      if (el.__inputHandler) {
        el.removeEventListener('input', el.__inputHandler)
        delete el.__inputHandler // 清除保存的处理函数引用
      }
      if (el.__compositionend) {
        el.removeEventListener('compositionend', el.__compositionend)
        delete el.__compositionend // 清除保存的处理函数引用
      }
    }
  })
}
