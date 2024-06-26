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
const handleFloat = (value: string, decimal: number) : string => {
  const reg = new RegExp(`^\\d*(\\.?\\d{0,${decimal}})`)
  const arr =  value
    .replace(/[^\d^\.]+/g, "") // 第二步：把不是数字，不是小数点的过滤掉
    .replace(/^0+(\d)/, "$1") // 第三步：第一位0开头，0后面为数字，则过滤掉，取后面的数字
    .replace(/^\./, "0.") // 第四步：如果输入的第一位为小数点，则替换成 0. 实现自动补全
    .match(reg)
  return arr?.length ? arr[0] : ''
}

