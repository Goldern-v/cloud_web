import { IHooksBasic } from './interface'
import { useCrud } from '@/hooks'
import { queryZoneList, queryUserProject } from '@/api/java/public'
import store from '@/store'
import { BillingEnum } from '@/utils/enum'
import { billingModeList, mirrorTypeList } from './common'
import { queryVolumeType } from '@/api/java/public'
import { specListUrl, queryImageList } from '@/api/java/compute'

export const useBasic = (options: IHooksBasic) => {
  const defaultOptions: IHooksBasic = {
    billingModeList, // 计费模式
    availableZoneList: [], // 可用区
    mirrorTypeList, // 镜像类型
    systemList: [], // 镜像系统类型
    mirrorList: [], // 镜像
    systemDiskList: [], // 系统盘类型
    dataDiskList: [], // 数据盘类型
    dataDiskQuota: 7, // 数据盘配额
    tableState: {} // 规格列表对象
  }
  // 表单
  const form = reactive({
    regionId: '', // 区域
    regionName: '',
    resourceId: '', // 资源池id
    billingMode: BillingEnum.ON_DEMAND, // 计费模式
    billingModeName: '按需计费', // (供确认配置界面使用)
    availableZone: '', // 可用区
    availableZoneName: '', // (供确认配置界面使用)
    currentSpec: null as any, // 规格选择
    specification: '', // (供确认配置界面使用)
    mirrorType: 'public', // 镜像(公有/私有)
    system: '', // 镜像系统类型
    mirror: '', // 镜像
    mirrorName: '', // (供确认配置界面使用)
    systemDisk: '', // 系统盘
    systemDiskName: '', // (供确认配置界面使用)
    systemDiskSize: 1, // 系统盘大小
    dataDisks: [] as any[], // 数据盘
    cloudProjectId: '', // 底层项目id
    projectId: '' // 云管项目id
  })

  const mergeDefaultOptions = (options: any, props: any): IHooksBasic => {
    for (const key in options) {
      if (!Object.getOwnPropertyDescriptor(props, key)) {
        props[key] = options[key]
      }
    }
    return props
  }

  // 覆盖默认值
  const state = mergeDefaultOptions(defaultOptions, options)

  const { resourcePoolInfo, regionInfo } = storeToRefs(store.resourceStore)
  onBeforeMount(() => {
    if (store.resourceStore) {
      store.resourceStore.$subscribe(async(mutations: any, state: any) => {
        resetForm()
        form.resourceId = state?.resourcePoolInfo?.id
        form.regionName = state?.regionInfo?.name
        form.regionId = state?.regionInfo?.code
        getUserProject()
        getZoneList()
      })
    }
  })

  // 资源池区域切换时重置表单
  const resetForm = () => {
    form.regionId = ''
    form.regionName = ''
    form.resourceId = ''
    form.billingMode = BillingEnum.ON_DEMAND
    form.availableZone = ''
    form.currentSpec = null as any
    form.mirrorType = 'public'
    form.system = ''
    form.mirror = ''
    form.systemDisk = ''
    form.systemDiskSize = 1
    form.dataDisks = [] as any[]
    form.cloudProjectId = ''
    form.projectId = ''
  }
  onMounted(async() => {
    // 右上角资源池区域是否选择
    if (regionInfo.value && resourcePoolInfo.value) {
      form.regionId = regionInfo.value.code
      form.resourceId = resourcePoolInfo.value.id
      form.regionName = regionInfo.value.name
      getUserProject()
      getZoneList()
    }
  })
  watch(
    () => [
      form.regionId,
      form.availableZone,
      form.cloudProjectId,
      form.billingMode
    ],
    (newValue, oldValue) => {
      // 区域和可用区选择修改后调磁盘类型
      if (newValue[0] && newValue[1] && newValue[2]) {
        getVolumeType()
      }
      if (newValue[3] !== oldValue[3]) {
        const result = billingModeList.find(
          (item: any) => item.label === newValue[3]
        )
        form.billingModeName = result?.value as string
      }
    }
  )
  // 区域选择
  const clickSelectRegion = (regionId: string | undefined) => {
    if (regionId) {
      form.regionId = regionId
    }
  }
  // 项目信息
  const getUserProject = () => {
    if (!form.regionId && !form.resourceId) {
      return
    }
    const params = {
      region: form.regionId,
      userId: store.userStore.user.id,
      cloudResourcePoolId: form.resourceId
    }
    queryUserProject(params)
      .then((res: any) => {
        const { code, data } = res
        if (code === 200) {
          form.cloudProjectId = data.cloudProjectId
          form.projectId = data.id
        } else {
          form.cloudProjectId = ''
          form.projectId = ''
        }
        store.resourceStore.cloudProjectId = form.cloudProjectId // 底层项目id
        store.resourceStore.projectId = form.projectId // 云管项目id
      })
      .catch(_ => {
        form.cloudProjectId = ''
        form.projectId = ''
      })
  }
  // 查询可用区
  const getZoneList = () => {
    if (!form.regionId) {
      return
    }
    const params = {
      region: form.regionId
    }
    queryZoneList(params)
      .then((res: any) => {
        const { code, data } = res
        if (code === 200) {
          state.availableZoneList = data
          if (data.length) {
            form.availableZone = data[0].code
          }
        } else {
          state.availableZoneList = []
        }
      })
      .catch(_ => {
        state.availableZoneList = []
      })
  }
  // 监听可用区选择,获取名称(确认配置所需)
  watch(
    () => form.availableZone,
    value => {
      if (value) {
        const result = state.availableZoneList?.find(
          (item: any) => item.code === value
        )
        form.availableZoneName = result?.name
      }
    }
  )
  // 规格列表
  state.tableState = {
    dataListUrl: specListUrl,
    isPage: false,
    createdIsNeed: false,
    queryForm: {
      resourcePoolId: toRef(form, 'resourceId'), // 资源池id
      region: toRef(form, 'regionId'), // 区域
      availabilityZone: toRef(form, 'availableZone'), // 可用区
      projectId: toRef(form, 'projectId'), // 项目id
    }
  }
  const { getDataList } = useCrud(state.tableState)

  watch(
    () => [
      form.regionId,
      form.availableZone
    ],
    (newValue, oldValue) => {
      // 判断新旧值是否相等
      const isSame = newValue.every(
        (row: any, index: number) => row === oldValue[index]
      )
      // 区域id,cpu架构,可用区 存在调用规格列表(防止3个值初始化赋值时导致多次调用规格列表)
      const isExist = newValue[0] && newValue[1]
      if (!isSame && isExist) {
        getDataList()
      }
    }
  )
  // 监听规格列表默认选第一条
  watch(
    () => state.tableState?.dataList,
    value => {
      if (value && value.length > 0) {
        form.currentSpec = value[0]
        form.specification = `${value[0].specsTypeName} | ${value[0].name} | ${value[0].vcpus}vCPUs | ${value[0].ram}GiB`
      }
    }
  )
  // 规格列表选择
  const clickTableCellRow = (row: any) => {
    form.currentSpec = row
    form.specification = `${row.specsTypeName} | ${row.name} | ${row.vcpus}vCPUs | ${row.ram}GiB`
  }
  // 监听选择值,调用镜像
  watch(
    () => [form.regionId, form.currentSpec],
    (newValue, oldValue) => {
      // 判断新旧值是否相等,相等则未重选
      const isSame = newValue.every(
        (row: any, index: number) => row === oldValue[index]
      )
      const isSelect = newValue.every((row: any) => row)
      if (!isSame && isSelect) {
        getImageList()
      }
    }
  )
  // 查询镜像
  const getImageList = () => {
    const params: { [key: string]: any } = {
      resourcePoolId: form.resourceId, // 资源池id
      cloudPlatform: resourcePoolInfo.value.vendorCode, // 云平台类型
      region: form.regionId, // 区域
      projectId: form.projectId, // 云管id
      flavorId: form.currentSpec?.uuid, // 规格id
    }
    queryImageList(params)
      .then((res: any) => {
        const { code, data } = res
        if (code === 200) {
          state.systemList = data
        } else {
          state.systemList = []
        }
      })
      .catch(_ => {
        state.systemList = []
      })
  }
  watch(
    () => [form.system, form.mirror],
    (newValue, oldValue) => {
      // 操作系统重选后重置镜像选择
      if (newValue[0] !== oldValue[0]) {
        const result = state.systemList?.find(
          (item: any) => item.platform === newValue[0]
        )
        state.mirrorList = result?.imageInfos
        form.mirror = ''
      }
      // 获取镜像名称(确认配置所需)
      if (newValue[1] !== oldValue[1]) {
        const result = state.mirrorList?.find(
          (item: any) => item.uuid === newValue[1]
        )
        form.mirrorName = result?.osVersion
      }
    }
  )
  // 镜像刷新事件
  const clickImageRefresh = () => {
    form.system = ''
    form.mirror = ''
    getImageList()
  }
  // 查询磁盘类型
  const getVolumeType = () => {
    if (!form.regionId && !resourcePoolInfo.value) {
      return
    }
    const params: { [key: string]: any } = {
      cloudPlatformType: resourcePoolInfo.value.vendorCode, // 云平台类型
      resourcePoolId: form.resourceId, // 资源池id
      projectId: form.projectId, // 项目id
      regionId: form.regionId, // 区域
      availabilityZone: form.availableZone // 可用区，不传查询默认值
    }
    queryVolumeType(params)
      .then((res: any) => {
        const { code, data } = res
        if (code === 200) {
          state.systemDiskList = data
          state.dataDiskList = data
        } else {
          state.systemDiskList = []
          state.dataDiskList = []
        }
      })
      .catch(_ => {
        state.systemDiskList = []
        state.dataDiskList = []
      })
  }
  const sysName = ref('')
  watch(
    () => [form.systemDisk, form.systemDiskSize],
    (newValue, oldValue) => {
      if (newValue[0] !== oldValue[0]) {
        const result = state.systemDiskList?.find(
          (item: any) => item.type === newValue[0]
        )
        sysName.value = result?.describe
      }
      form.systemDiskName = `${sysName.value}，${newValue[1]}GiB，${newValue[0]}`
    }
  )
  // 数据盘删除事件
  const clickDeleteDataDisk = (index: number) => {
    form.dataDisks.splice(index, 1)
  }
  // 数据盘新增事件
  const clickAddDataDisk = () => {
    form.dataDisks.push({ type: '', size: 1 })
  }

  return {
    clickSelectRegion,
    clickDeleteDataDisk,
    clickAddDataDisk,
    clickTableCellRow,
    clickImageRefresh,
    form
  }
}
