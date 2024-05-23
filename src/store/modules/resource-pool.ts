import { defineStore } from 'pinia'
import { IdealEventFlow } from '@/types'

// 资源池信息
export const resourceStore = defineStore(
  'resourceStore',
  () => {
    interface ResourcePoolProp {
      categoryId?: string // 云平台类别
      cloudPlatformType?: string // 云平台类型
      resourcePoolId?: string // 资源池
      cloudPlatformId?: string // 云平台id
      cloudPlatformName?: string // 云平台名称
      vdcId?: string
    }
    // 底层项目id
    const cloudProjectId = ref('')
    // 项目id
    const projectId = ref('')
    // 区域code
    const regionCode = ref('')
    // 区域id
    const regionId = ref('')
    //可用区
    const availableZone = ref('')

    const resourcePool = ref<ResourcePoolProp>()

    // 事件流(审核通过后资源开通进度)
    const eventFlow = ref<IdealEventFlow[]>([])
    return {
      cloudProjectId,
      projectId,
      resourcePool,
      regionCode,
      regionId,
      eventFlow,
      availableZone
    }
  },
  {
    persist: {
      storage: sessionStorage,
      key: 'resourceStore' // 修改存储中使用的键名称，默认为当前 Store的 id
    }
  }
)
