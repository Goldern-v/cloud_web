import store from '@/store'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders } from '@/types'

export const useCreate = (form: any) => {
  const { resourcePoolInfo, regionInfo } = storeToRefs(store.resourceStore)
  onBeforeMount(() => {
    if (store.resourceStore) {
      store.resourceStore.$subscribe(async(mutations: any, state: any) => {
        form.regionName = state?.regionInfo?.name
      })
    }
  })
  onMounted(async() => {
    // 右上角资源池区域是否选择
    if (regionInfo.value && resourcePoolInfo.value) {
      form.regionName = regionInfo.value.name
    }
  })

  // 选择情况
  const selectCase = reactive({
    existTemplate: false, // 配置膜拜 是否使用已有模版
    autoEip: false, // 弹性公网IP 是否自动分配
    isBandwidth: true, // 公网带宽 是否按带宽计费
    isFlow: false, // 公网带宽 是否按流量计费
    isShare: false, // 公网带宽 是否加入共享带宽
    isPublicMirror: true, // 镜像是否是公有镜像
    isKeyPair: true // 登录方式是否密钥对
  })
  // 监听配置模板
  watch(() => form.configTemplate, value => {
    selectCase.existTemplate = false
    if (value === 'already') {
      selectCase.existTemplate = true
    }
  })
  // 监听弹性公网IP
  watch(() => form.eipType, value => {
    selectCase.autoEip = false
    if (value === 'auto') {
      selectCase.autoEip = true
    }
  })
  // 监听公网带宽
  watch(() => form.bandwidthType, value => {
    selectCase.isBandwidth = false
    selectCase.isFlow = false
    selectCase.isShare = false
    if (value === 'bandwidth') {
      selectCase.isBandwidth = true
    } else if (value === 'traffic') {
      selectCase.isFlow = true
    } else if (value === 'shareBandwidth') {
      selectCase.isShare = true
    }
  })
  // 监听镜像
  watch(() => form.mirrorType, value => {
    selectCase.isPublicMirror = false
    if (value === 'public') {
      selectCase.isPublicMirror = true
    }
  })
  // 登录方式
  watch(() => form.loginMode, value => {
    selectCase.isKeyPair = false
    if (value === 'keyPair') {
      selectCase.isKeyPair = true
    }
  })
  // 刷新密钥对
  const clickRefreshKeyPair = () => {
    form.keyPair = ''
  }

  // 数据
  const selectData = reactive({
    labelArray,
    tableHeaders,
    mirrorTypeList,
    systemList: [] as any[], // 镜像系统类型
    mirrorList: [] as any[], // 镜像
    volumeTypeList: [] as any[], // 磁盘类型选择
    safeGroupies: [
      { name: 'default', enter: '入方向:TCP', exit: '出方向:--', value: '1' },
      { name: 'Sys-FullAccess', enter: '入方向:TCP', exit: '出方向:--', value: '2' },
      { name: 'Sys-qtx0ip', enter: '入方向:--', exit: '出方向:--', value: '3' }
    ], // 安全组
    lineList,
    bandwidthTypeList,
    bandWidthList,
    flowBandWidthList,
    shareBandwidth: [] as any[], // 共享带宽
    cpuArchitectures,
    loginModes,
    keyPairList: [] as any[] // 密钥对
  })

  // 列表
  const state: IHooksOptions = reactive({
    dataListUrl: '',
    deleteUrl: '',
    queryForm: {}
  })
  const {
    selectionChangeHandle,
    getDataList
  } = useCrud(state)
  state.dataList = [
    {
      uuid: '1',
      instanceName: '通用计算型s7',
      specName: 's7.small.1',
      vcpus: '1',
      memeory: '1',
      cpu: 'Inter Ice Lake',
      standard: '0.1',
      maxBandwidth: '0.8',
      intranet: '100000'
    },
    {
      uuid: '2',
      instanceName: '通用计算型s7',
      specName: 's7.medium.2',
      vcpus: '1',
      memeory: '2',
      cpu: 'Inter Ice Lake',
      standard: '0.1',
      maxBandwidth: '0.8',
      intranet: '100000'
    },
    {
      uuid: '3',
      instanceName: '通用计算型s7',
      specName: 's7.medium.4',
      vcpus: '1',
      memeory: '4',
      cpu: 'Inter Ice Lake',
      standard: '0.1',
      maxBandwidth: '0.8',
      intranet: '100000'
    }
  ]

  // 规格列表选择
  const clickTableCellRow = (row: any) => {
    form.spec = row
  }
  // 镜像刷新事件
  const clickImageRefresh = () => {
    form.system = ''
    form.mirror = ''
  }
  // 数据盘删除事件
  const clickDeleteDataDisk = (index: number) => {
    form.dataDisks.splice(index, 1)
  }
  // 数据盘新增事件
  const clickAddDataDisk = () => {
    form.dataDisks.push({ type: '', size: 1 })
  }
  // 可以新增数据盘配额
  const dataDiskQuota = computed(() => {
    const result = 10 - form.dataDisks.length
    return result
  })
  // 刷新共享带宽
  const clickRefreshBandwidth = () => {
    form.shareBandwidth = ''
  }

  return {
    selectCase,
    selectData,
    state,
    selectionChangeHandle,
    getDataList,
    clickTableCellRow,
    clickImageRefresh,
    clickDeleteDataDisk,
    clickAddDataDisk,
    dataDiskQuota,
    clickRefreshBandwidth,
    clickRefreshKeyPair
  }
}


// 选择的云服务器详情
const labelArray = [
  { label: '云服务器ID', prop: 'uuid' },
  { label: '计费模式', prop: 'billingMode' },
  { label: '规格', prop: 'spec' },
  { label: '镜像', prop: 'mirror' },
  { label: '系统盘', prop: 'system' },
  { label: '数据盘', prop: 'data' },
  { label: '安全组', prop: 'safeGroup' }
]
// 规格列表
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '实例名称', prop: 'instanceName' },
  { label: '规格名称', prop: 'specName' },
  { label: 'vCPUs', prop: 'vCPUs', useSlot: true },
  { label: 'CPU', prop: 'cpu' },
  { label: '基准/最大带宽', prop: 'standard', useSlot: true },
  { label: '内网收发包', prop: 'intranet' }
]
// 镜像类型
const mirrorTypeList = [
  { label: 'public', value: '公有镜像' },
  { label: 'private', value: '私有镜像' },
  { label: 'shared', value: '共享镜像' }
]
// 线路
const lineList: any = [
  { label: '全动态BGP', value: '5_bgp' },
  { label: '静态BGP', value: '5_sbgp' }
]
// 公网带宽
const bandwidthTypeList: any = [
  { label: '按带宽计费', value: 'bandwidth' },
  { label: '按流量计费', value: 'traffic' },
  { label: '加入共享带宽', value: 'shareBandwidth' }
]
// 按带宽计费时带宽大小
const bandWidthList: any = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '100', value: 100 },
  { label: '200', value: 200 }
]
// 按流量计费时带宽大小
const flowBandWidthList: any = [
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '50', value: 50 },
  { label: '100', value: 100 }
]
// CPU架构
const cpuArchitectures = [
  { value: 'x86计算', label: 'x86' },
  { value: '鲲鹏计算', label: 'bandwidth' }
]
// 登录方式
const loginModes: any = [
  { label: '密钥对', value: 'keyPair' },
  { label: '密码', value: 'pwd' }
]
