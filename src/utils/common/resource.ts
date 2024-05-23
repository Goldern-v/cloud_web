import store from '@/store'
import { platformCategoryType } from '@/api/java/public'
import { resourcePoolSelect } from '@/api/java/operate-center'

export const useResourcePool = () => {
  const { resourcePool } = storeToRefs(store.resourceStore)

  // 公有云
  const isPublic = computed(
    () => RegExp(/PUBLIC/).test(resourcePool.value.categoryId)
  )

  //华为公有云
  const isPublicHuawei = computed(
    () =>
      RegExp(/PUBLIC/).test(resourcePool.value.categoryId) &&
      RegExp(/HUAWEI/).test(resourcePool.value.cloudPlatformType)
  )

  // 阿里云
  const isAliyun = computed(
    () =>
      RegExp(/PUBLIC/).test(resourcePool.value.categoryId) &&
      RegExp(/ALI/).test(resourcePool.value.cloudPlatformType)
  )

  // 腾讯云
  const isTencent = computed(
    () =>
      RegExp(/PUBLIC/).test(resourcePool.value.categoryId) &&
      RegExp(/TENCENT/).test(resourcePool.value.cloudPlatformType)
  )

  // 天翼公有云
  const isCtyun = computed(
    () =>
      RegExp(/PUBLIC/).test(resourcePool.value.categoryId) &&
      RegExp(/CTYUN/).test(resourcePool.value.cloudPlatformType)
  )

  // 私有云 VMWARE
  const isPrivateVmware = computed(
    () =>
      RegExp(/PRIVATE/).test(resourcePool.value.categoryId) &&
      RegExp(/VMWARE/).test(resourcePool.value.cloudPlatformType)
  )

  // 华为私有云
  const isPrivateHuawei = computed(
    () =>
      RegExp(/PRIVATE/).test(resourcePool.value.categoryId) &&
      RegExp(/HUAWEI/).test(resourcePool.value.cloudPlatformType)
  )

  return {
    isPublic,
    isPublicHuawei,
    isAliyun,
    isTencent,
    isCtyun,
    isPrivateVmware,
    isPrivateHuawei
  }
}

// 获取云平台类别(包含云平台类型和资源池)
export const usePlatform = () => {
  onMounted(() => {
    getCategoryType()
    getResourcePool()
  })
  // 云平台类别
  const categoryList = ref<any[]>([])
  // 云平台类型
  const typeList = ref<any[]>([])

  const getCategoryType = () => {
    platformCategoryType()
      .then((res: any) => {
        const { data, code } = res
        if (code === 200) {
          categoryList.value = data?.categories
          typeList.value = data?.types
        } else {
          categoryList.value = []
          typeList.value = []
        }
      })
      .catch(_ => {
        categoryList.value = []
        typeList.value = []
      })
  }
  const resourcePoolList = ref<any[]>([])
  const getResourcePool = () => {
    resourcePoolSelect()
      .then((res: any) => {
        const { data, code } = res
        if (code === 200) {
          resourcePoolList.value = data
        } else {
          resourcePoolList.value = []
        }
      })
      .catch(_ => {
        resourcePoolList.value = []
      })
  }
  return {
    categoryList,
    typeList,
    resourcePoolList
  }
}
