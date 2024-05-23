import { BillingEnum } from '@/utils/enum'
export const useCreate = (form: any) => {
  // 计费模式
  const billingModes = [
    { label: BillingEnum.ON_DEMAND, value: '按需收费' },
    { label: BillingEnum.PACKAGE, value: '包年包月' }
  ]
  const isPackage = computed(() => form.billingMode === BillingEnum.PACKAGE)
  // 项目
  const projects = ref<any[]>([])
  // 可用区
  const availableZones = ref<any[]>([
    { code: '1', name: '可用区1'}
  ])
  // 文件系统类型
  const fileTypes = ref<any[]>([])
  const fileTypeArray = [
    { value: 'HPC型', label: 'hpc' },
    { value: 'HPC缓存型', label: 'hpcCache' },
    { value: '通用型', label: 'general' }
  ]
  fileTypes.value = fileTypeArray
  // 包年包月不含HPC缓存型
  watch(() => form.billingMode, value => {
    fileTypes.value = fileTypeArray
    if (value === BillingEnum.PACKAGE) {
      const arr = fileTypeArray.filter((item: any) => item.label !== 'hpcCache')
      fileTypes.value = arr
    }
  })
  // HPC型
  const isHpc = computed(() => form.fileType === 'hpc')
  // HPC缓存型
  const isHpcCache = computed(() => form.fileType === 'hpcCache')
  // 通用型
  const isGeneral = computed(() => form.fileType === 'general')
  // 容量
  const capacity = reactive({
    content: '输入值必须在1.2到1,023.6之间。',
    min: 1.2,
    max: 1023.6,
    precision: 1,
    step: 1.2
  })
  // 监听文件系统类型, 修改容量最大值最小值
  watch(() => form.fileType, value => {
    if (value === 'hpc') {
      capacity.content = '输入值必须在1.2到1,023.6之间。'
      capacity.min = 1.2
      capacity.max = 1023.6
      capacity.precision = 1
      capacity.step = 1.2
      form.size = 1.2
    } else if (value === 'hpcCache' || value === 'general') {
      capacity.content = '输入值必须在4到1,024之间。'
      capacity.min = 4
      capacity.max = 1024
      capacity.precision = 0
      capacity.step = 1
      form.size = 4
    }
  })
  // 带宽大小
  const bandwidthSizes = ref<any[]>([])
  // 协议类型
  const protocolTypes = [
    { value: 'NFS', label: 'nfs' }
  ]
  const vpcList = ref<any[]>([])
  const subnetList = ref<any[]>([])
  // 安全组
  const safeGroups = ref<any[]>([])
  // 云备份存储库
  const cloudBackupPools = ref<any[]>([])
  // 备份策略
  const backupPolicies = ref<any[]>([])
  // 高级配置
  const showHighConfig = ref(false)
  const clickHighConfig = () => {
    showHighConfig.value = !showHighConfig.value
  }
  // 标签配额
  const availableQuota = computed(() => {
    let result = 10 - form.tags.length
    if (result < 0) {
      result = 0
    }
    return result
  })
  // 添加标签
  const clickAddTag = () => {
    form.tags.push({ key: '', value: '' })
  }
  const clickDeleteTag = (index: number) => {
    if (form.tags.length === 1) { return }
    form.tags.splice(index, 1)
  }
  // 云备份
  const cloudBackups = [
    { value: '暂不够买', label: 'notYet' },
    { value: '使用已有', label: 'used' },
    { value: '现在购买', label: 'buyNow' }
  ]
  const isUsed = computed(() => form.cloudBackup === 'used')
  const isBuyNow = computed(() => form.cloudBackup === 'buyNow')
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

  return {
    isPackage,
    billingModes,
    projects,
    availableZones,
    fileTypes,
    isHpc,
    isHpcCache,
    isGeneral,
    capacity,
    bandwidthSizes,
    protocolTypes,
    vpcList,
    subnetList,
    safeGroups,
    cloudBackupPools,
    backupPolicies,
    showHighConfig,
    clickHighConfig,
    availableQuota,
    clickAddTag,
    clickDeleteTag,
    cloudBackups,
    isUsed,
    isBuyNow,
    timeList
  }
}
