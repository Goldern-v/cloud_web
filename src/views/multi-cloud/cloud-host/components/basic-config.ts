import { IHooksBasic } from './interface'
import { useCrud } from '@/hooks'
import { BillingEnum } from '@/utils/enum'
import { useRegion } from '@/utils/common/region'
import { queryVolumeType } from '@/api/java/public'
import { querySpecTypeList } from '@/api/java/operate-center'
import store from '@/store'
import { specListUrl, queryImageList, validateFlavor, queryPrivateImageList } from '@/api/java/compute'
import {
  instanceList,
  sceneList,
  billingModeList,
  subsceneList,
  mirrorTypeList
} from './common'
import { useResourcePool } from '@/utils/common/resource'

const { isAliyun, isTencent } = useResourcePool()

export const useBasic = (options: IHooksBasic) => {
  const defaultOptions: IHooksBasic = {
    billingModeList, // 计费模式
    instanceList, // 实例筛选
    sceneList, // 业务场景
    subsceneList, // 子场景
    cpuArchitectureList: [], // CPU架构
    specsTypeList: [], // 规格类型
    instanceSpecsList: [], // 规格实例类型
    mirrorTypeList, // 镜像类型
    systemList: [], // 镜像系统类型
    mirrorList: [], // 镜像
    systemDiskList: [], // 系统盘类型
    dataDiskList: [], // 数据盘类型
    dataDiskQuota: 7, // 数据盘配额
    filter: {
      // 规格条件筛选
      cpu: '',
      ram: '',
      name: '',
      status: false
    },
    tableState: {} // 规格列表对象
  }
  // 表单
  const form = reactive({
    projectId: '', // 资源归属(项目)
    regionId: '', // 区域
    regionName: '',
    resourceId: '', // 资源池id
    billingMode: BillingEnum.ON_DEMAND, // 计费模式
    billingModeName: '按需计费', // (供确认配置界面使用)
    availableZone: '', // 可用区
    availableZoneName: '', // (供确认配置界面使用)
    instance: '1', // 实例筛选
    scene: '', // 业务场景
    subscene: '', // 子场景
    cpuArchitecture: '', // CPU架构
    specsType: '', // 规格类型
    instanceSpecs: '', // 规格实例类型
    currentSpec: null as any, // 规格选择
    specification: '', // (供确认配置界面使用)
    mirrorType: 'public', // 镜像(公有/私有)
    system: '', // 镜像系统类型
    mirror: '', // 镜像
    mirrorName: '', // (供确认配置界面使用)
    systemDisk: '', // 系统盘
    systemDiskName: '', // (供确认配置界面使用)
    systemDiskSize: 10, // 系统盘大小
    systemDiskMinSize: 10, // 系统盘最小值
    dataDisks: [] as any[], // 数据盘
    dataDisksMinSize: 10 // 数据盘最小值
    // cloudProjectId: '', // 底层项目id
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

  const { resourcePool } = storeToRefs(store.resourceStore)

  // 区域、可用区、项目
  const { regionList, availableZoneList, projectList } = useRegion(form)

  const fromMirror = ref(false) // 是否从镜像服务进入
  const route = useRoute()
  onMounted(() => {
    if (resourcePool.value) {
      form.resourceId = resourcePool.value.resourcePoolId
    }
    fromMirror.value = !!(route.query?.platform as string)
    if (fromMirror.value) {
      form.mirrorType = route.query?.imageType as string
    }
  })

  watch(
    () => [
      form.regionId,
      form.availableZone,
      form.projectId,
      form.billingMode,
      form.currentSpec
    ],
    (newValue, oldValue) => {
      if (newValue[0] !== oldValue[0]) {
        const result = regionList.value?.find(
          (item: any) => item.id === newValue[0]
        )
        form.availableZone = result.availableZones.length
          ? result.availableZones[0].code
          : ''
        getArchitectureList() // cpu架构和规格
      }
      // 阿里云区域和可用区，计费模式选择修改后调磁盘类型
      if (isAliyun.value) {
        if (newValue[0] && newValue[1] && newValue[2] && newValue[4]) {
          getVolumeType()
        }
      }
      // 区域和可用区选择修改后调磁盘类型
      else {
        if (newValue[0] && newValue[1] && newValue[2]) {
          getVolumeType()
        }
      }
      if (newValue[3] !== oldValue[3]) {
        const result = billingModeList.find(
          (item: any) => item.label === newValue[3]
        )
        form.billingModeName = result?.value as string
      }
    }
  )
  // 监听可用区选择,获取名称(确认配置所需)
  watch(
    () => form.availableZone,
    value => {
      if (value) {
        const result = availableZoneList.value?.find(
          (item: any) => item.code === value
        )
        form.availableZoneName = result?.name
      }
    }
  )
  // CPU架构
  // 接口返回CPU架构和规格所需的类型等数据,所以需要依次监听选择获取数据
  const getArchitectureList = () => {
    if (!resourcePool.value.cloudPlatformId) {
      return
    }
    const params = {
      cloudPlatformId: resourcePool.value.cloudPlatformId // 云平台类型id
    }
    querySpecTypeList(params)
      .then((res: any) => {
        const { code, data } = res
        if (code === 200) {
          state.cpuArchitectureList = data
          if (data.length) {
            form.cpuArchitecture = data[0].cpuArchitecture
            state.specsTypeList = data[0].specsType
            state.instanceSpecsList = data[0].specsType[0].instanceSpecsClan
          }
        } else {
          state.cpuArchitectureList = []
          state.specsTypeList = []
          state.instanceSpecsList = []
        }
      })
      .catch(_ => {
        state.cpuArchitectureList = []
        state.specsTypeList = []
        state.instanceSpecsList = []
      })
  }
  // 监听架构选择
  watch(
    () => form.cpuArchitecture,
    (newValue, oldValue) => {
      if (newValue !== oldValue) {
        const result = state.cpuArchitectureList?.find(
          (item: any) => item.cpuArchitecture === newValue
        )
        state.specsTypeList = result?.specsType
        state.instanceSpecsList = result?.specsType[0].instanceSpecsClan
        // cpu架构重选后清空规格选择结果
        form.specsType = ''
        form.instanceSpecs = ''
      }
    }
  )
  // 规格实例名称
  watch(
    () => form.specsType,
    value => {
      if (value) {
        const result = state.specsTypeList?.find(
          (item: any) => item.code === value
        )
        state.instanceSpecsList = result?.instanceSpecsClan
        // 规格类型重选后清空规格名称选择
        form.instanceSpecs = ''
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
      availableZone: toRef(form, 'availableZone'), // 可用区
      // projectId: toRef(form, 'projectId'), // 项目id
      cpuArchitecture: toRef(form, 'cpuArchitecture'), // cpu架构
      specsType: toRef(form, 'specsType'), // 规格类型
      type: toRef(form, 'instanceSpecs'), // 规格实例名称类型
      vcpus: toRef(state.filter, 'cpu'), // cpu核数
      ram: toRef(state.filter, 'ram'), // 内存大小
      name: toRef(state.filter, 'name'), //规格名称
      imageId: toRef(form, 'mirror'), // 镜像id(从镜像服务进入,传镜像id,查询包含镜像的规格)
      status: '' // 规格状态值；normal 正常，sellout 售罄
    }
  }
  const { getDataList } = useCrud(state.tableState)

  watch(
    () => [
      form.regionId,
      form.cpuArchitecture,
      form.availableZone,
      form.specsType,
      form.instanceSpecs,
      state.filter.cpu,
      state.filter.ram
    ],
    (newValue, oldValue) => {
      // 判断新旧值是否相等
      const isSame = newValue.every(
        (row: any, index: number) => row === oldValue[index]
      )
      // 区域id,cpu架构,可用区 存在调用规格列表(防止3个值初始化赋值时导致多次调用规格列表)
      const isExist = newValue[0] && newValue[1] && newValue[2]
      if (!isSame && isExist) {
        getDataList()
      }
    }
  )
  // 规格是否售罄
  watch(
    () => state.filter.status,
    value => {
      if (value && state.tableState?.queryForm) {
        state.tableState.queryForm.status = value ? 'normal' : 'sellout'
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
  // 规格名称输入框失去焦点后再触发搜索
  const specNameBlur = () => {
    getDataList()
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
        // 从镜像服务跳转,镜像默认选中镜像服务列表的镜像,不改变
        if (!fromMirror.value) {
          form.system = ''
          form.mirror = ''
        }
        if (form.mirrorType === 'public') {
          getImageList()
        } else if (form.mirrorType === 'private') {
          getPrivateImage()
        }
      }
    }
  )

  watch(
    () => [form.billingMode, form.currentSpec],
    (newValue, oldValue) => {
      const isSame = newValue.every(
        (row: any, index: number) => row === oldValue[index]
      )
      const isSelect = newValue.every((row: any) => row)
      // 阿里公有云 腾讯公有云 需验证规格是否售罄
      if (!isSame && isSelect && (isAliyun.value || isTencent.value)) {
        getValidateFlavor(newValue)
      }
    }
  )

  const checkInfo = ref('') //校验规格是否可用
  const getValidateFlavor = (data: any) => {
    const params = {
      id: data[1]?.id,
      billType: data[0]
    }
    validateFlavor(params).then((res: any) => {
      const { data, code } = res
      if (code === 200) {
        checkInfo.value = data.notAvailableReason
      } else {
        checkInfo.value = ''
      }
    })
  }
  // 切换镜像
  const changeMirrorType = (type: string) => {
    form.system = ''
    state.systemList = []
    form.mirror = ''
    state.mirrorList = []
    if (type === 'public') {
      getImageList()
    } else if (type === 'private') {
      getPrivateImage()
    }
  }
  // 镜像公共参数
  const imageParams = (): { [key: string]: any } => {
    return {
      resourcePoolId: form.resourceId, // 资源池id
      cloudPlatform: resourcePool.value.cloudPlatformType, // 云平台类型
      regionId: form.regionId, // 区域
      flavorId: form.currentSpec?.id, // 规格id
      architecture: form.cpuArchitecture // 架构类型
    }
  }
  // 查询公有镜像
  const getImageList = () => {
    if (!form.projectId) {
      return
    }
    const params = imageParams()
    params.visibility = 'public'
    queryImageList(params)
      .then((res: any) => {
        const { code, data } = res
        if (code === 200) {
          state.systemList = data
          // 从镜像服务跳转
          if (fromMirror.value && data.length) {
            form.system = route.query?.platform as string // 镜像服务申请云服务器
            form.mirror = route.query?.imageId as string
          }
        } else {
          state.systemList = []
        }
      })
      .catch(_ => {
        state.systemList = []
      })
  }
  // 查询私有镜像
  const getPrivateImage = () => {
    const params = imageParams()
    params.visibility = 'private'
    queryPrivateImageList(params).then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        state.mirrorList = data
        // 从镜像服务跳转
        if (fromMirror.value && data.length) {
          form.mirror = route.query?.imageId as string
        }
      } else {
        state.mirrorList = []
      }
    }).catch(_ => {
      state.mirrorList = []
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
        if (!fromMirror.value) {
          form.mirror = ''
        }
      }
      // 获取镜像名称(确认配置所需)
      if (newValue[1] !== oldValue[1]) {
        const result = state.mirrorList?.find(
          (item: any) => item.id === newValue[1]
        )

        form.mirrorName = result?.name
        form.systemDiskSize = result?.minDisk // 系统盘最小值跟选择镜像的大小有关
        form.systemDiskMinSize = result?.minDisk
        // vmware 系统盘大小必须大于镜像大小
        if (resourcePool.value.cloudPlatformType.toUpperCase() === 'VMWARE') {
          form.systemDiskMinSize = Number(result?.minDisk) + 10
        }
        // 腾讯公有云 数据盘以镜像大小设置最小值
        if (isTencent.value) {
          form.dataDisksMinSize = result?.minDisk
        }
      }
    }
  )
  // 镜像刷新事件
  const clickImageRefresh = () => {
    form.system = ''
    form.mirror = ''
    if (form.mirrorType === 'public') {
      getImageList()
    } else if (form.mirrorType === 'private') {
      getPrivateImage()
    }
  }
  // 查询磁盘类型
  const getVolumeType = () => {
    if (!form.regionId && !resourcePool.value) {
      return
    }
    const params: { [key: string]: any } = {
      cloudPlatformType: resourcePool.value.cloudPlatformType, // 云平台类型
      resourcePoolId: form.resourceId, // 资源池id
      projectId: form.projectId, // 项目id
      regionId: form.regionId, // 区域
      availabilityZone: form.availableZone, // 可用区，不传查询默认值
      flavorId: form.currentSpec?.id // 规格
    }

    queryVolumeType(params)
      .then((res: any) => {
        const { code, data } = res
        if (code === 200) {
          state.systemDiskList = data[0].sysVolumeType
          state.dataDiskList = data[0].dataVolumeType
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
    form.dataDisks.push({ type: '', size: form.dataDisksMinSize })
  }

  return {
    regionList,
    availableZoneList,
    projectList,
    getArchitectureList,
    clickDeleteDataDisk,
    clickAddDataDisk,
    specNameBlur,
    clickTableCellRow,
    clickImageRefresh,
    form,
    checkInfo,
    changeMirrorType
  }
}
