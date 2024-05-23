<template>
  <div class="ip-input">
    <ul class="ip-address">
      <li v-for="(item, index) of ipAddress" :key="index">
        <el-input
          ref="ipInputRef"
          v-model="item.value"
          @input="(val: any) => checkIpVal(val, item, index)"
          @keyup="turnIpPosition(item, index, $event)"
        />
        <div v-if="index !== ipAddress.length - 1" class="dot">.</div>
      </li>
    </ul>

    <div v-if="portSplit" class="ip-port">
      <span class="split">{{ portSplit }}</span>
      <el-input
        v-if="!selectCidr"
        ref="ipPortRef"
        v-model="ipPort"
        class="port"
        oninput="value=value.replace(/[^\d]/g,'')"
        :maxlength="3"
        :min="1"
        :max="255"
        @input="checkIp(ipPort)"
      />

      <el-select v-else v-model="ipPort" style="width: 80px">
        <el-option
          v-for="(item, index) of portOptions"
          :key="index + 'selectSearch'"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>
    </div>
  </div>
</template>
<script setup lang="ts">
/**
 * ip地址输入框
 */
import { IpVersionEnum } from '@/utils/enum'
interface IdealIpInput {
  ipValue?: any // ip地址
  ipType?: IpVersionEnum // ipv4/ipv6
  disabled?: boolean // 全部封印
  portDisabled?: boolean // 端口封印
  ipDisabled?: { [key: number]: string } // ip封印
  portSplit?: string // 端口分隔符
  selectCidr?: string //选择的网段
  portOptions?: any[] //端口范围
}

const props = withDefaults(defineProps<IdealIpInput>(), {
  ipValue: '',
  ipType: IpVersionEnum.ipv4,
  disabled: false,
  portDisabled: false,
  ipDisabled: () => ({}),
  portSplit: '',
  selectCidr: '',
  portOptions: () => [
    8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
    27, 28
  ]
})

const isIPv4 = computed(() => props.ipType === IpVersionEnum.ipv4) // ipv4
const ipAddress = ref<any>([]) // ip输入框
onMounted(() => {
  initIpAddress()
  initIp()
})
// 初始化ip输入框
const initIp = () => {
  if (!props.ipValue) {
    return
  }
  let ipNums = null
  if (props.portSplit) {
    let ipList = props.ipValue.split(props.portSplit)
    ipPort.value = ipList[1]
    ipNums = ipList[0]
  } else {
    ipPort.value = ''
    ipNums = props.ipValue
  }
  if (!ipNums) {
    return
  }
  let ipNumList = isIPv4.value ? ipNums.split('.') : ipNums.split(':')
  ipAddress.value.forEach((item: any, index: number) => {
    item.value = ipNumList[index]
  })
}

const initIpAddress = () => {
  if (!props.selectCidr) {
    let num = isIPv4.value ? 4 : 8
    for (let i = 0; i < num; i++) {
      const item = {
        value: '',
        disabledState: () => {
          if (props.disabled) {
            return true
          }
          return props.ipDisabled[i]
        }
      }
      ipAddress.value.push(item)
    }
  }
}

// 检查ip输入为0-255  ipv4 0~255  ipv6 0~ffff
const checkIpVal = (val: any, item: any, index: number) => {
  //确保每个值都处于0-255
  // 处理非数字
  if (isIPv4.value) {
    val = val.toString().replace(/[^0-9]/g, '')
    val = parseInt(val, 10)
  } else {
    val = val.replace(/[^a-f0-9]/g, '')
  }

  if (isNaN(val) && isIPv4.value) {
    val = ''
  } else if (isIPv4.value) {
    val = val < 0 ? 0 : val
    val = val > 255 ? 255 : val
  } else {
    val = val < 0 ? 0 : val
    val = parseInt(val, 16) > parseInt('ffff', 16) ? 'ffff' : val
  }
  item.value = val
}

const ipInputRef = ref()
const ipPortRef = ref()
const ipPort = ref()
// 光标位置判断
const turnIpPosition = (item: any, index: number, event: any) => {
  let e = event || window.event
  if (e.keyCode === 37) {
    // 左箭头向左跳转，左一不做任何措施
    if (index !== 0 && e.currentTarget.selectionStart === 0) {
      ipInputRef.value[index - 1].focus()
    }
  } else if (e.keyCode === 39) {
    // 右箭头向右跳转，右一不做任何措施
    if (
      isIPv4.value
        ? index !== 3
        : index !== 4 &&
          e.currentTarget.selectionStart === item.value.toString().length
    ) {
      ipInputRef.value[index + 1].focus()
    }
  } else if (e.keyCode === 8) {
    // 删除键把当前数据删除完毕后会跳转到前一个input，左一不做任何处理
    if (index !== 0 && item.value === '') {
      ipInputRef.value[index - 1].focus()
    }
  } else if (e.keyCode === 13 || e.keyCode === 32 || e.keyCode === 190) {
    // 回车键、空格键、冒号均向右跳转，右一不做任何措施
    if (isIPv4.value ? index !== 3 : index !== 4) {
      ipInputRef.value[index + 1].focus()
    }
  } else if (
    isIPv4.value
      ? item.value.toString().length >= 3
      : item.value.toString().length >= 4
  ) {
    // 满3位，光标自动向下一个文本框 ipv4
    // 满4位，光标自动向下一个文本框 ipv6
    let maxNumber = 7 // 最大索引(ipv4: 3, ipv6: 7)
    if (isIPv4.value) {
      maxNumber = 3
    }

    if (index < maxNumber) {
      ipInputRef.value[index + 1].focus()
    } else {
      if (props.portSplit.length) {
        // 根据端口分隔符判断端口输入框是否存在
        ipPortRef.value.focus()
      }
    }
  }
}

const isIPv6 = computed(() => props.ipType === IpVersionEnum.ipv6)
const checkIp = (val: any) => {
  if (isNaN(val)) {
    ipPort.value = ''
  } else if (isIPv4.value) {
    ipPort.value = val < 0 ? 0 : val
    ipPort.value = val > 32 ? 32 : val
  } else if (isIPv6.value) {
    ipPort.value = val < 0 ? 0 : val
    ipPort.value = val > 128 ? 128 : val
  }
}
interface EventType {
  (e: 'input', v: string): void
  (e: 'listenChange', v: string): void
}
const emit = defineEmits<EventType>()
const ip = ref('000000000000')
watch(
  () => ipAddress,
  () => {
    let str = ''
    ipAddress.value.forEach((v: any, i: number) => {
      if (isIPv4.value) {
        str += formatter(v.value)
      } else {
        if (i === ipAddress.value.length - 1) {
          str += ipAddress.value[i].value.toString()
        } else {
          str += ipAddress.value[i].value.toString() + ':' //特殊处理传后端
        }
      }
    })

    if (isIPv4.value) {
      ip.value = str
      str = str ? strInsert(str, 3) : str
    } else {
      if (str.split(':').length === 0) {
        ip.value = ''
      } else {
        ip.value = str + props.portSplit
      }
    }
    emit('input', str)
    emit('listenChange', str)
  },
  { deep: true }
)

// 格式化补零方法
const formatter = (val: any) => {
  let value = val.toString()
  if (isIPv4.value) {
    // ipv4 ipv6切换的时候防止ipv4
    ipPort.value = parseInt(ipPort.value) > 32 ? 32 : ipPort.value || 0
    if (value.length === 2) {
      value = '0' + value
    } else if (value.length === 1) {
      value = '00' + value
    } else if (value.length === 0) {
      value = '000' + value
    }
  }
  return value
}
// 获取ip地址
const strInsert = (str: string, length: number) => {
  let reg = new RegExp('\\d{1,' + length + '}', 'g')
  let ma = str.toString().match(reg)
  let result = ''
  if (isIPv4.value && ma?.length) {
    for (let i = 0; i < ma.length; i++) {
      ma[i] = `${parseInt(ma[i])}`
    }
    if (props.portSplit) {
      return ma.join('.') + props.portSplit + ipPort.value
    }
    result = isIPv4.value ? ma.join('.') : ma.join(':')
  }
  return result
}

watch(ipPort, value => {
  let port = null
  port = value.toString().replace(/[^0-9]/g, '')
  port = parseInt(port, 10)
  if (isNaN(port)) {
    ipPort.value = 0
  } else {
    ipPort.value = port
  }
  let str = ''
  if (isIPv4.value) {
    str = ip.value ? strInsert(ip.value, 3) : ''
  } else {
    str = ip.value + ipPort.value
  }
  emit('input', str)
  emit('listenChange', str)
})

watch(
  () => props.selectCidr,
  val => {
    if (val) {
      ipAddress.value = []
      const address = val.split('/')[0]
      ipPort.value = parseInt(val.split('/')[1])
      address.split('.').forEach((ele: any, index: any) => {
        const item = {
          value: parseInt(ele),
          disabledState: props.disabled ? true : props.ipDisabled[index]
        }
        ipAddress.value.push(item)
      })
    }
  },
  { immediate: true }
)
</script>
<style lang="scss" scoped>
.ip-address,
.ip-input,
.ip-input li {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.dot {
  padding: 0 2px;
}
.ip-input {
  :deep(.el-input__inner) {
    width: 60px;
    padding: 0;
    text-align: center;
  }
  .ip-port {
    display: flex;
    flex-direction: row;
    align-items: center;
    .split {
      padding: 0 4px;
      font-size: 20px;
    }
  }
}
</style>
