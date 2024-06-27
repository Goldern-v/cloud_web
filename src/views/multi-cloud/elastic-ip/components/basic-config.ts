import { useResourcePool } from '@/utils/common/resource'
import { BillingEnum } from '@/utils/enum'
import { IHooksBasic } from './interface'
import type { FormRules, FormInstance } from 'element-plus'
import store from '@/store'
import { queryExternalNetList } from '@/api/java/network'

export const useBasic = (options: IHooksBasic) => {
  const basicConfig: IHooksBasic = {
    regionList: [], // 区域
    chargeModeList: [
      { label: BillingEnum.PACKAGE, name: '包年包月' },
      { label: BillingEnum.ON_DEMAND, name: '按需计费' }
    ], //计费模式
    projectList: [], // 资源归属
    highConfig: false, //是否显示高级配置
    lineList: [], //线路
    bandwidthTypeOption: [], //公网带宽
    bandwidthList: [], //共享带宽
    sizeList: [], //带宽大小
    duration: [], //订购时长
    exNetList: [], //外部网络
    eipTypeDes: '', //eip线路描述
    bandwidthDes: '' //带宽描述
  }

  const mergeDefaultOptions = (options: any, props: any): IHooksBasic => {
    for (const key in options) {
      if (!Object.getOwnPropertyDescriptor(props, key)) {
        props[key] = options[key]
      }
    }
    return props
  }

  // 覆盖默认值
  const state = mergeDefaultOptions(basicConfig, options)

  const eipFormRef = ref<FormInstance>()
  const eipForm = reactive({
    billingMode: BillingEnum.PACKAGE, // 付费类型
    regionId: '', //区域id
    resourcePoolId: '', // 资源池id
    regionName: '', //区域名称
    bandwidthType: 'bandwidth', // 带宽类型
    bandwidthName: 'bandwidth-' + Math.random().toString(36).substring(9),
    bandwidth: '', //共享带宽
    bandwidthSize: 1, //带宽大小
    eipName: 'eip-' + Math.random().toString(36).substring(9),
    orderNum: 0,
    line: '', //线路
    eipPurchaseDuration: 1, //购买时长
    autoRenewal: false, //自动续费
    eipPurchaseVolume: 1, //购买量
    openIpv6: false, // ipv6转换
    projectId: '', //项目id
    tagIds: [], //标签id
    tagNames: [], //标签名称
    externalNetwork: '', //外部网络
    maxSize: 200, //支持创建带宽大小最大值
    labelNum: 10 //可添加标签数
  })

  const isPackage = computed(() => eipForm.billingMode === BillingEnum.PACKAGE) //是否包年包月

  const selectRegion = (regionInfo: any) => {
    eipForm.regionName = regionInfo.cnName
    eipForm.regionId = regionInfo.id
  }

  const selectProject = (projectInfo: any) => {
    eipForm.projectId = projectInfo.id
  }

  const bandwidthSize = ref(5)
  const eipNum = ref(20)
  const eipMaximum = ref(20)

  const { resourcePool } = store.resourceStore

  const { isPublicHuawei, isPrivateHuawei, isPublic, isAliyun, isTencent } =
    useResourcePool()

  const isHuawei = computed(() => isPublicHuawei.value || isPrivateHuawei.value)
  const bandwidthType = [
    { name: '按带宽计费', label: 'bandwidth' },
    { name: '按流量计费', label: 'traffic' },
    { name: '加入共享带宽', label: 'shareBandwidth' }
  ]
  onMounted(() => {
    if (isAliyun.value) {
      state.eipTypeDes = 'BGP(多线)'
      state.bandwidthDes =
        '按带宽计费\n流量较大或稳定的场景\n\n按流量计费\n流量较小或流量波动较大的场景'
      state.lineList = [{ label: 'BGP', name: 'BGP多线' }]
      state.bandwidthTypeOption = bandwidthType.filter(
        item => item.label !== 'shareBandwidth'
      )
      eipForm.maxSize = 200
    } else if (isTencent.value) {
      state.eipTypeDes = '普通线路 BGP IP，用于平衡网络质量与成本'
      state.bandwidthDes =
        '按带宽计费\n流量较大或稳定的场景\n\n按流量计费\n流量较小或流量波动较大的场景\n\n 加入共享带宽\n多业务流量错峰分布场景\n'
      state.lineList = [{ label: 'BGP', name: '常规BGP' }]
      state.bandwidthTypeOption = bandwidthType
      eipForm.maxSize = 200
    } else {
      state.eipTypeDes = '不低于99.95%可用性保障'
      state.bandwidthDes =
        '按带宽计费\n流量较大或稳定的场景\n\n按流量计费\n流量较小或流量波动较大的场景\n\n 加入共享带宽\n多业务流量错峰分布场景\n'
      state.lineList = [
        { label: '5_bgp', name: '全动态BGP' },
        { label: '5_sbgp', name: '静态BGP' }
      ]
      state.bandwidthTypeOption = bandwidthType
      eipForm.maxSize = 2000
    }
    eipForm.line = state.lineList[0].label
  })

  //不同eip的线路，订购时长会随之变化
  const durationOptions = (eipType: string) => {
    const num = eipType === '5_bgp' ? 14 : 12
    return Array.from({ length: num }, (v, k) => k + 1).map((item: number) => {
      return {
        desc: item < 10 ? item + '个月' : item - 9 + '年',
        label: item < 10 ? item : 12 * (item - 9)
      }
    })
  }
  watch(
    () => [eipForm.bandwidthType, eipForm.line],
    ([bandwidthType, line]) => {
      state.sizeList =
        bandwidthType === 'bandwidth'
          ? [1, 2, 5, 10, 100, 200]
          : [5, 10, 20, 50, 100]
      eipForm.bandwidthSize = state.sizeList[0]
      state.duration = durationOptions(line)
    },
    { immediate: true }
  )

  const selectTag = (tags: any) => {
    eipForm.tagIds = tags.map((item: any) => item.id)
    eipForm.tagNames = tags.map((item: any) => item.name)
  }

  //华为私有云存在外部网络参数
  watch(
    () => [eipForm.regionId, eipForm.projectId],
    ([region, project]) => {
      if (isPrivateHuawei.value && region && project) {
        getExternalNetList()
      }
    }
  )

  //查询外部网络
  const getExternalNetList = async () => {
    const res = await queryExternalNetList({
      resourcePoolId: resourcePool.resourcePoolId, //资源池id
      poolTypeUuid: resourcePool.cloudPlatformType, //资源池类型
      regionId: eipForm.regionId,
      projectId: eipForm.projectId,
      serviceType: 'Internet' //Location vpc Internet eip
    })
    state.exNetList = res.data.networks
    eipForm.externalNetwork = res.data.networks[0]?.name
  }

  return {
    selectRegion,
    selectProject,
    isPackage,
    eipForm,
    eipFormRef,
    bandwidthSize,
    eipNum,
    eipMaximum,
    selectTag,
    isHuawei
  }
}
