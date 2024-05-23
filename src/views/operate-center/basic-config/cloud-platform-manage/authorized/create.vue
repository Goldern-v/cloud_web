<template>
  <div>
    <public-aliyun
      v-if="isPublicAli"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <public-tencent
      v-else-if="isPublicTencent"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <public-huawei
      v-else-if="isPublicHuawei"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <public-ctyun
      v-else-if="isPublicCtyun"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <private-huawei
      v-else-if="isPrivateHuawei"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <private-vmware
      v-else-if="isPrivateVmware"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />

    <private-zstack
      v-else-if="isPrivateZstack"
      @clickCancelEvent="clickCancelEvent"
      @clickSuccessEvent="clickSuccessEvent"
    />
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { EventEnum } from '@/utils/enum'
import publicAliyun from './public/aliyun.vue'
import publicTencent from './public/tencent.vue'
import publicHuawei from './public/huawei.vue'
import publicCtyun from './public/ctyun.vue'
import privateHuawei from './private/huawei.vue'
import privateVmware from './private/vmware.vue'
import privateZstack from './private/zstack.vue'
import { cloudPlatformAuthAdd } from '@/api/java/operate-center'
import { useCommon } from '../common'

const route = useRoute()
const cloudPlatformId = route.query.id as string

const {
  isPublicAli,
  isPublicTencent,
  isPublicHuawei,
  isPublicCtyun,
  isPrivateHuawei,
  isPrivateVmware,
  isPrivateZstack
} = useCommon()

// 点击事件
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const clickCancelEvent = () => {
  emit(EventEnum.cancel)
}
const clickSuccessEvent = (dic: { [key: string]: any }) => {
  const params = Object.assign(dic, { cloudPlatformId })
  cloudPlatformAuthAdd(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('新增成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error('新增失败')
    }
  })
}
</script>

<style scoped lang="scss"></style>
