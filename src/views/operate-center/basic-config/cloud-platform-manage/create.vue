<template>
  <div class="ideal-large-margin cloud-platform-manage__create">
    <div v-if="!selectCloudType && !isEdit">
      <cloud-type @clickCloudSelect="clickCloudSelect"></cloud-type>
    </div>

    <div v-else>
      <public-huawei-cloud
        v-if="isPublicHuawei"
        :cloud-category="category"
        :cloud-type="selectCloudType"
      />

      <public-ctyun
        v-else-if="isPublicCtyun"
        :cloud-category="category"
        :cloud-type="selectCloudType"
      />

      <public-aliyun
        v-else-if="isPublicAliyun"
        :cloud-category="category"
        :cloud-type="selectCloudType"
      />

      <public-tencent
        v-else-if="isPublicTencent"
        :cloud-category="category"
        :cloud-type="selectCloudType"
      />

      <public-amazon
        v-else-if="isPublicAmazon"
        :cloud-category="category"
        :cloud-type="selectCloudType"
      />

      <public-zenlayer 
        v-else-if="isPublicZenlayer"
        :cloud-category="category"
        :cloud-type="selectCloudType"
      />

      <private-ctyun
        v-else-if="isPrivateCtyun"
        :cloud-category="category"
        :cloud-type="selectCloudType"
      />

      <private-vmware
        v-else-if="isPrivateVmware"
        :cloud-category="category"
        :cloud-type="selectCloudType"
      />
      
      <private-huawei
        v-else-if="isPrivateHuawei"
        :cloud-category="category"
        :cloud-type="selectCloudType"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import cloudType from './components/cloud-type.vue'
import publicHuaweiCloud from './public/huawei-cloud.vue'
import publicCtyun from './public/ctyun.vue'
import publicAliyun from './public/aliyun.vue'
import publicTencent from './public/tencent.vue'
import publicAmazon from './public/amazon.vue'
import publicZenlayer from './public/zenlayer.vue'
import privateCtyun from './private/ctyun.vue'
import privateVmware from './private/vmware.vue'
import privateHuawei from './private/huawei.vue'
import { isEmpty, isUnDef } from '@/utils/is'

const route = useRoute()
const id = route.query.id
const isEdit = !isEmpty(id) && !isUnDef(id)

// 公有云还是私有云等
const category = ref('')
// 选择的云平台类型
const selectCloudType = ref('')

onMounted(() => {
  if (isEdit) {
    getEditData()
  }
})
// 编辑数据
const getEditData = () => {
  selectCloudType.value = (route.query.cloudType as string)
  category.value = (route.query.cloudCategory as string)
}
// 公有云 华为云
const isPublicHuawei = computed(
  () =>
    RegExp(/HUAWEI/).test(selectCloudType.value) &&
    RegExp(/PUBLIC/).test(category.value)
)
// 公有云 天翼云
const isPublicCtyun = computed(
  () =>
    RegExp(/CTYUN/).test(selectCloudType.value) &&
    RegExp(/PUBLIC/).test(category.value)
)
// 公有云 阿里云
const isPublicAliyun = computed(
  () =>
    RegExp(/ALI/).test(selectCloudType.value) &&
    RegExp(/PUBLIC/).test(category.value)
)
// 公有云 腾讯云
const isPublicTencent = computed(
  () =>
    RegExp(/TENCENT/).test(selectCloudType.value) &&
    RegExp(/PUBLIC/).test(category.value)
)
// 公有云 亚马逊云
const isPublicAmazon = computed(
  () =>
    RegExp(/AWS/).test(selectCloudType.value) &&
    RegExp(/PUBLIC/).test(category.value)
)
// 公有云 zenlayer
const isPublicZenlayer = computed(
  () =>
    RegExp(/ZENLAYER/).test(selectCloudType.value) &&
    RegExp(/PUBLIC/).test(category.value)
)
// 私有云 天翼云
const isPrivateCtyun = computed(
  () =>
    RegExp(/CTYUN/).test(selectCloudType.value) &&
    RegExp(/PRIVATE/).test(category.value)
)
// 私有云 VMWARE
const isPrivateVmware = computed(
  () =>
    RegExp(/VMWARE/).test(selectCloudType.value) &&
    RegExp(/PRIVATE/).test(category.value)
)
// 私有云 华为云
const isPrivateHuawei = computed(
  () =>
    RegExp(/HUAWEI/).test(selectCloudType.value) &&
    RegExp(/PRIVATE/).test(category.value)
)
// 云平台类型选择
const clickCloudSelect = (value: any, row: any) => {
  if (value) {
    category.value = row.cloudCategory
    selectCloudType.value = value.cloudType
  }
}

</script>

<style scoped lang="scss">
.cloud-platform-manage__create {
  background-color: white;
  // padding: 20px;
  box-sizing: border-box;
}
</style>
