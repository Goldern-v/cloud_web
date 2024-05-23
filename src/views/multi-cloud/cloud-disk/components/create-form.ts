import { BillingEnum } from '@/utils/enum'
import { useRegion } from '@/utils/common/region'
import store from '@/store'
import { useResourcePool } from '@/utils/common/resource'
import { queryVolumeType } from '@/api/java/public'
import {
  queryCloudBackupPolicy,
  queryCloudBackupRepository
} from '@/api/java/compute'

export const useCreate = (form: any) => {
  const { isAliyun } = useResourcePool()

  const selectData = reactive({
    billTypeList,
    dataOriginTypeList,
    cloudBackupTypeList,
    timeList,
    dataVolumeList: [] as any[], // 系统盘
    backupPolicyList: [] as any[], // 备份策略
    cloudBackupPoolList: [] as any[], // 云备份存储库
    minDiskSize: 10 // 系统盘最小容量
  })

  // 区域、可用区、项目
  const {
    regionList,
    availableZoneList,
    projectList
  } = useRegion(form)

  const { resourcePool, regionCode } = storeToRefs(store.resourceStore)
  onMounted(() => {
    // 阿里云没有包年包月
    if (isAliyun.value) {
      form.billType = BillingEnum.ON_DEMAND
      selectData.billTypeList = [{ label: BillingEnum.ON_DEMAND, value: '按需' }]
    }
    form.resourceId = resourcePool.value.resourcePoolId
  })

  watch(
    () => form.regionId,
    value => {
      if (value) {
        const result = regionList.value?.find(
          (item: any) => item.id === value
        )

        form.availableZone = result.availableZones.length ? result.availableZones[0].code : ''

        getCloudBackupPolicy()
      }
    }
  )

  watch(
    () => form.projectId,
    value => {
      if (value) {
        getCloudBackupPolicy()
      }
    }
  )
  // 监听
  watch(
    () => [
      form.regionId,
      form.availableZone,
      form.projectId,
      form.billType
    ],
    (newValue, oldValue) => {
      // 区域和可用区选择修改后调磁盘类型
      if (newValue[0] && newValue[1] && newValue[2]) {
        getVolumeType()
      }
      if (newValue[3] !== oldValue[3]) {
        const result = billTypeList.find(
          (item: any) => item.label === newValue[3]
        )
        form.billTypeName = result?.value as string
      }
    }
  )
  // 查询磁盘类型
  const getVolumeType = () => {
    const params: { [key: string]: any } = {
      resourcePoolId: form.resourceId, // 资源池id
      projectId: form.projectId, // 项目id
      regionId: form.regionId, // 区域
      availabilityZone: form.availableZone // 可用区，不传查询默认值
    }
    queryVolumeType(params)
      .then((res: any) => {
        const { code, data } = res
        if (code === 200) {
          if (data.length) {
            selectData.dataVolumeList = data[0]?.dataVolumeType
            if (data[0].dataVolumeType.length) {
              form.dataVolume = data[0].dataVolumeType[0].type
              form.dataVolumeName = data[0].dataVolumeType[0].describe
              form.dataVolumeSize = data[0].dataVolumeType[0].minSize
              selectData.minDiskSize = data[0].dataVolumeType[0].minSize
            }
          }
        } else {
          selectData.dataVolumeList = []
        }
      })
      .catch(_ => {
        selectData.dataVolumeList = []
      })
  }
  // 监听系统盘
  watch(
    () => form.dataVolume,
    value => {
      if (value) {
        const result = selectData.dataVolumeList.find(
          (item: any) => item.type === value
        )
        form.dataVolumeName = result?.describe
        selectData.minDiskSize = result?.minSize
        form.dataVolumeSize = result?.minSize
      }
    }
  )

  const selectCase = reactive({
    isPackage: true, // 是否按需
    isNotYet: true, // 暂不购买
    isAlready: false, // 使用已有
    isNowBuy: false // 现在购买
  })
  // 监听计费模式
  watch(
    () => form.billType,
    value => {
      selectCase.isPackage = false
      if (value === BillingEnum.PACKAGE) {
        selectCase.isPackage = true
      }
    }
  )
  // 监听云备份
  watch(
    () => form.cloudBackupType,
    value => {
      selectCase.isNowBuy = false
      selectCase.isAlready = false
      selectCase.isNotYet = false
      if (value === 'nowBuy') {
        selectCase.isNowBuy = true
      } else if (value === 'already') {
        selectCase.isAlready = true
        getCloudBackupPool()
      } else if (value === 'notYet') {
        selectCase.isNotYet = true
      }
    }
  )
  // 云备份策略
  const getCloudBackupPolicy = () => {
    const params = commonParams()
    // queryCloudBackupPolicy(params)
    //   .then((res: any) => {
    //     const { code, data } = res
    //     if (code === 200) {
    //       selectData.backupPolicyList = data
    //       form.backupPolicy = data.length ? data[0].uuid : ''
    //     } else {
    //       selectData.backupPolicyList = []
    //     }
    //   })
    //   .catch(_ => {
    //     selectData.backupPolicyList = []
    //   })
  }
  // 刷新备份策略
  const clickRefreshPolicy = () => {
    form.backupPolicy = ''
    getCloudBackupPolicy()
  }
  // 刷新云备份存储库
  const clickRefreshPool = () => {
    form.cloudBackupPool = ''
    getCloudBackupPool()
  }
  // 云备份存储库
  const getCloudBackupPool = () => {
    // const params = {
    //   resourceStatus: 'DOWN', // 状态(固定传DOWN调未绑定资源)
    //   ...commonParams()
    // }
    // queryCloudBackupRepository(params)
    //   .then((res: any) => {
    //     const { code, data } = res
    //     if (code === 200) {
    //       selectData.cloudBackupPoolList = data
    //       form.cloudBackupPool = data.length ? data[0].uuid : ''
    //     } else {
    //       selectData.cloudBackupPoolList = []
    //     }
    //   })
    //   .catch(_ => {
    //     selectData.cloudBackupPoolList = []
    //   })
  }

  // 公共传参
  const commonParams = () => {
    return {
      region: regionCode.value, // 区域
      projectId: form.projectId, // 项目id
      resourcePoolId: resourcePool.value.resourcePoolId // 资源池id
    }
  }

  return {
    regionList,
    availableZoneList,
    projectList,
    selectData,
    selectCase,
    getCloudBackupPolicy,
    clickRefreshPolicy,
    clickRefreshPool
  }
}

// 计费模式
const billTypeList = [
  { label: BillingEnum.PACKAGE, value: '包年包月' },
  { label: BillingEnum.ON_DEMAND, value: '按需' }
]
// 数据源（可选)
const dataOriginTypeList: any = [
  { label: '从备份创建', value: 'backup' },
  { label: '从快照创建', value: 'snapShoot' },
  { label: '从镜像创建', value: 'mirror' }
]
// 当前已选
const cloudBackupTypeList: any = [
  { label: '暂不购买', value: 'notYet' },
  { label: '使用已有', value: 'already' },
  { label: '现在购买', value: 'nowBuy' }
]
// 购买时长
const timeList: any = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6', value: 6 },
  { label: '7', value: 7 },
  { label: '8', value: 8 },
  { label: '9', value: 9 },
  { label: '10', value: 10 },
  { label: '11', value: 11 },
  { label: '一年', value: 12 },
  { label: '两年', value: 13 },
  { label: '三年', value: 14 }
]
