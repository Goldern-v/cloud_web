<template>
  <div v-if="dataArray.length > 0">
    <el-tooltip
      popper-class="custom-tooltip"
      effect="dark"
      placement="top"
      :disabled="dataArray.length === 1"
    >
      <template #content>
        <div v-for="(item, idx) of ipArray" :key="idx">
          {{ item }}
        </div>
      </template>

      <div>
        <div v-if="dataArray[0].fixedIp" class="flex-row">
          <div>私</div>
          <ideal-text-copy
            :row="dataArray[0]"
            show-key="privateIpCopy"
            label-key="fixedIp"
            copy-key="fixedIp"
            @mouseEnterEvent="listenEnterPrivate"
            @mouseLeaveEvent="listenLeavePrivate"
          />
        </div>

        <div v-if="dataArray[0].eip.ipAddress" class="flex-row">
          <div>公</div>
          <ideal-text-copy
            :row="dataArray[0].eip"
            show-key="publicIpCopy"
            label-key="ipAddress"
            copy-key="ipAddress"
            @mouseEnterEvent="listenEnterPublic"
            @mouseLeaveEvent="listenLeavePublic"
          />
        </div>
      </div>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
interface IpAddressProp {
  dataArray?: any[]
}
const props = withDefaults(defineProps<IpAddressProp>(), {
  dataArray: () => []
})

onMounted(() => {
  handleIp()
})
const ipArray = ref<any[]>([])
// 处理ip地址,将公有ip和私有ip放到一个数组 在el-tooltip显示
const handleIp = () => {
  props.dataArray.forEach((item: any) => {
    if (item?.fixedIp) {
      ipArray.value.push(`私有ip ${item.fixedIp}`)
    }
    if (item?.eip?.ipAddress) {
      ipArray.value.push(`公有ip ${item.eip.ipAddress}`)
    }
  })
}

const listenEnterPrivate = (value: boolean) => {
  emit(EventType.privateEnter, value)
}

const listenLeavePrivate = (value: boolean) => {
  emit(EventType.privateLeave, value)
}
const listenEnterPublic = (value: boolean) => {
  emit(EventType.publicEnter, value)
}

const listenLeavePublic = (value: boolean) => {
  emit(EventType.publicLeave, value)
}

// 事件
enum EventType {
  privateEnter = 'mouseEnterPrivate',
  privateLeave = 'mouseLeavePrivate',
  publicEnter = 'mouseEnterPublic',
  publicLeave = 'mouseLeavePublic'
}
interface EventEmits {
  (e: EventType.privateEnter, v: boolean): void
  (e: EventType.privateLeave, v: boolean): void
  (e: EventType.publicEnter, v: boolean): void
  (e: EventType.publicLeave, v: boolean): void
}
const emit = defineEmits<EventEmits>()
</script>

<style lang="scss">
.custom-tooltip {
  max-width: 260px;
}
</style>
