import store from '@/store'
import { queryUserProject, cloudPlatformRegionAz } from '@/api/java/public'

// 获取区域、可用区、项目等信息
export const useRegion = (form: any) => {
  const { resourcePool } = storeToRefs(store.resourceStore)

  onMounted(() => {
    if (resourcePool.value) {
      getRegion()
    }
  })
  // 区域列表
  const regionList = ref<any[]>([])
  // 可用区列表
  const availableZoneList = ref<any[]>([])
  // 获取区域
  const getRegion = () => {
    const params = {
      cloudPlatformId: resourcePool.value.cloudPlatformId,
      cloudResourcePoolId: resourcePool.value.resourcePoolId
    }
    cloudPlatformRegionAz(params)
      .then((res: any) => {
        const { code, data } = res
        if (code === 200) {
          regionList.value = data
          if (data?.length) {
            form.regionId = data[0].id
            form.regionName = data[0].cnName
            availableZoneList.value = data[0].availableZones
          }
        } else {
          form.regionId = ''
          form.regionName = ''
          regionList.value = []
          availableZoneList.value = []
        }
      })
      .catch(_ => {
        form.regionId = ''
        form.regionName = ''
        regionList.value = []
        availableZoneList.value = []
      })
  }
  watch(
    () => form.regionId,
    value => {
      if (value) {
        const result = regionList.value?.find((item: any) => item.id === value)
        store.resourceStore.regionCode = result?.code
        store.resourceStore.regionId = result?.id
        form.regionName = result?.cnName
        availableZoneList.value = result.availableZones // 监听区域获取可用区
        getUserProject()
      }
    }
  )

  watch(
    () => form.availableZone,
    value => {
      if (value) {
        store.resourceStore.availableZone = value
      }
    }
  )
  // 项目列表
  const projectList = ref<any[]>([])
  // 项目信息
  const getUserProject = () => {
    if (!form.regionId && !form.resourceId) {
      return
    }
    const params = {
      userId: store.userStore.user.id,
      vdcId: store.userStore.user.vdcId
    }
    queryUserProject(params)
      .then((res: any) => {
        const { code, data } = res
        if (code === 200) {
          projectList.value = data
          if (data?.length) {
            form.projectId = data[0].id
          }
        } else {
          projectList.value = []
        }
      })
      .catch(_ => {
        projectList.value = []
      })
  }
  // 监听项目
  watch(
    () => form.projectId,
    value => {
      if (value) {
        const result = projectList.value?.find((item: any) => item.id === value)
        store.resourceStore.cloudProjectId = result?.cloudProjectId // 底层项目id
        store.resourceStore.projectId = result?.id // 云管项目id
      }
    }
  )

  return {
    regionList,
    availableZoneList,
    projectList
  }
}
