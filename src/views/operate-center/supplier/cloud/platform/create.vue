<template>
  <div class="ideal-large-margin cloud-platform-manage__create">
    <div v-if="!selectCloudType && !isEdit">
      <cloud-type @clickCloudSelect="clickCloudSelect"></cloud-type>
    </div>

    <div v-else>
      <public-aliyun
        v-if="isPublicAliyun"
        :cloud-category="category"
        :cloud-type="selectCloudType"
      />

      <publicAmazon
        v-else-if="isPublicAmazon"
        :cloud-category="category"
        :cloud-type="selectCloudType"
      />

      <public-azure
        v-else-if="isPublicAzure"
        :cloud-category="category"
        :cloud-type="selectCloudType"
      />

      <public-google
        v-else-if="isPublicGoogle"
        :cloud-category="category"
        :cloud-type="selectCloudType"
      />

      <public-zenlayer 
        v-else-if="isPublicZenlayer"
        :cloud-category="category"
        :cloud-type="selectCloudType"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import cloudType from './cloud-type.vue'
import publicAliyun from './public/aliyun.vue'
import publicAmazon from './public/amazon.vue'
import publicAzure from './public/azure.vue'
import publicGoogle from './public/google.vue'
import publicZenlayer from './public/zenlayer.vue'
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
// 公有云 阿里云
const isPublicAliyun = computed(
  () =>
    RegExp(/ALI/).test(selectCloudType.value) &&
    RegExp(/PUBLIC/).test(category.value)
)

// 公有云 亚马逊
const isPublicAmazon = computed(
  () =>
    RegExp(/AWS/).test(selectCloudType.value) &&
    RegExp(/PUBLIC/).test(category.value)
)
// 公有云 微软云
const isPublicAzure = computed(
  () =>
    RegExp(/AZURE/).test(selectCloudType.value) &&
    RegExp(/PUBLIC/).test(category.value)
)

// 公有云 谷歌云
const isPublicGoogle = computed(
  () =>
    RegExp(/GOOGLE/).test(selectCloudType.value) &&
    RegExp(/PUBLIC/).test(category.value)
)
const isPublicZenlayer = computed(() => RegExp(/ZENLAYER/).test(selectCloudType.value) && RegExp(/PUBLIC/).test(category.value))

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
