import { IHooksNetwork } from './interface'
import { useCrud } from '@/hooks'
import store from '@/store'
import { ElMessage } from 'element-plus'
import {
  ipGenerateList,
  lineList,
  bandwidthTypeList,
  bandWidthList,
  flowBandWidthList
} from './common'
import { checkIpAddress } from '@/api/java/public'
import {
  queryNetworkList,
  safeGroupRuleUrl,
  querySafeGroupList,
  queryEipList,
  queryBandWidth,
  querySubnet
} from '@/api/java/compute'

export const useNetwork = (options: IHooksNetwork) => {
  const defaultOptions: IHooksNetwork = {
    vpcList: [], // 虚拟私有云
    subnetList: [], // 子网
    expandSubnetList: [], // 扩展网卡子网
    enhanceCardList: [], // 增强高速网卡
    networkCardList: [], // 网卡
    ipGenerateList, // ip生成方式
    safeGroupList: [], // 安全组
    mergeData: [],
    lineList, // 线路
    bandwidthTypeList, // 公网带宽
    bandWidthList, // 带宽计费时带宽大小
    flowBandWidthList, // 流量计费时带宽大小
    exitEipList: [], // 已有ip
    shareBandwidth: [], // 带宽名称(共享带宽)
    tableState: {},
    form: {}
  }

  const mergeDefaultOptions = (options: any, props: any): IHooksNetwork => {
    for (const key in options) {
      if (!Object.getOwnPropertyDescriptor(props, key)) {
        props[key] = options[key]
      }
    }
    return props
  }
  // 覆盖默认值
  const state = mergeDefaultOptions(defaultOptions, options)

  // storeToRefs防止右上角切换资源池时数据未同步响应
  const { regionInfo, resourcePoolInfo, projectId } = storeToRefs(
    store.resourceStore
  )

  if (store.resourceStore) {
    // 监听pinia
    store.resourceStore.$subscribe((mutations: any, state: any) => {
      resetForm()
      // 监听资源池是否有默认区域
      if (state?.resourcePoolInfo && state?.regionInfo) {
        getNetworkList()
        getSafeGroup()
        getEipList()
      }
    })
  }
  onMounted(() => {
    if (regionInfo.value && resourcePoolInfo.value && projectId.value) {
      state.form.regionId = regionInfo.value.code
      state.form.resourceId = resourcePoolInfo.value.id
      state.form.projectId = projectId.value
      getNetworkList()
      getSafeGroup()
      getEipList()
      initEipInfo()
    }
  })
  // 配置界面 弹性公网ip信息
  const initEipInfo = () => {
    if (state.form.ipMode === '1') {
      const lineItem = lineList.find(
        (row: any) => row.value === state.form.line
      )
      const bandwidthItem = bandwidthTypeList.find(
        (row: any) => row.value === state.form.bandwidthType
      )
      state.form.eipInfo = `${lineItem?.label}|计费方式：${bandwidthItem?.label}|带宽：${state.form.bandwidthSize}`
      if (state.form.bandwidthType === 'shareBandwidth') { // 加入共享带宽
        const shareItem = state.shareBandwidth?.find((row: any) => row.uuid === state.form.shareBandwidth)
        state.form.eipInfo = `${lineItem?.label}|计费方式：${bandwidthItem?.label}|带宽：${shareItem?.name}`
      }
    } else if (state.form.ipMode === '2') {
      const lineItem = state.exitEipList?.find(
        (row: any) => row.uuid === state.form.exitEip
      )
      state.form.eipInfo = lineItem?.name
    } else {
      state.form.eipInfo = '暂不够买'
    }
  }
  watch(
    () => state.form.ipMode,
    value => {
      if (value) {
        initEipInfo()
      }
    }
  )
  // 资源池区域切换时重置表单
  const resetForm = () => {
    state.form.vpc = ''
    state.form.vpcInfo = ''
    state.form.subnet = ''
    state.form.expand = []
    state.form.safeGroup = []
    state.form.safeGroupInfo = ''
    state.form.direction = 'ingress'
    state.form.ipMode = '1'
    state.form.line = '5_bgp'
    state.form.exitEip = ''
    state.form.bandwidthType = 'bandwidth'
    state.form.bandwidthSize = 5
    state.form.shareBandwidth = ''
  }
  // 网络
  const getNetworkList = () => {
    const params = {
      region: regionInfo.value.code, // 区域
      projectId: store.resourceStore.projectId, // 项目id
      vdcId: store.userStore.user.vdcId, // vdc的主键值
      resourcePoolId: resourcePoolInfo.value.id // 资源池id
    }
    queryNetworkList(params)
      .then((res: any) => {
        const { code, data } = res
        if (code === 200) {
          state.vpcList = data
        } else {
          state.vpcList = []
        }
      })
      .catch(_ => {
        state.vpcList = []
      })
  }
  // 监听虚拟私有云选择
  watch(
    () => state.form.vpc,
    value => {
      if (value) {
        state.form.subnet = ''
        state.subnetList = []
        const result = state.vpcList?.find((item: any) => item.uuid === value)
        if (result) {
          state.form.subnet = result.subnetList[0].uuid
          state.subnetList = result.subnetList
        }
        state.form.vpcInfo = `${result.name}(${result.cidr})`

        getSubnetList()
      }
    }
  )
  const clickRefreshVpc = () => {
    state.form.vpc = ''
    state.form.subnet = ''
    getNetworkList()
  }
  watch(
    () => state.form.subnet,
    value => {
      if (value && state.subnetList) {
        const result = state.subnetList.find((item: any) => item.uuid === value)
        state.form.subnetInfo = result.name
      }
    }
  )
  const clickRefreshSubnet = () => {
    state.form.subnet = ''
  }
  // 扩展网卡-子网
  const getSubnetList = () => {
    const params = {
      networkUuid: state.form.vpc,
      ...commonParams()
    }
    querySubnet(params).then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        state.expandSubnetList = data
      } else {
        state.expandSubnetList = []
      }
    })
  }
  // 添加网卡
  const onClickAddNetworkCard = () => {
    // 子网 ip生成方式 手动ip地址 manualIp
    state.form.expand.push({ subnet: '', autoIp: '', manualIp: '192.168.1.0' })
  }
  // 删除网卡
  const clickExpandDelete = (index: number) => {
    state.form.expand.splice(index, 1)
  }
  // 增强高速网卡
  const clickAddEnhanceCard = () => {
    state.form.enhanceCard.push({ value: '' })
  }
  const clickDeleteEnhanceCard = (index: number) => {
    state.form.enhanceCard.splice(index, 1)
  }
  // 监听ip地址是否可用
  const listenIpAddress = (value: string, index: number) => {
    state.form.expand[index].manualIp = value // 更新ip地址
    const params = {
      ipAddress: value,
      ...commonParams()
    }
    checkIpAddress(params).then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        // data = true 表示未使用，data = false 表示已使用
        if (!data) {
          ElMessage.error('该IP地址已使用！')
        }
      }
    })
  }
  // 安全组
  const getSafeGroup = () => {
    const params = commonParams()
    querySafeGroupList(params).then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        state.safeGroupList = data
      } else {
        state.safeGroupList = []
      }
    })
  }
  watch(
    () => state.form.safeGroup,
    value => {
      if (value && state.safeGroupList?.length) {
        const arr: any[] = []
        state.safeGroupList.forEach((item: any) => {
          if (value.includes(item.uuid)) {
            arr.push(item.name)
          }
        })
        state.form.safeGroupInfo = arr.join(',')
      }
    }
  )
  const clickRefreshSafeGroup = () => {
    state.form.safeGroup = []
    getSafeGroup()
  }
  // 安全组规则
  state.tableState = {
    dataListUrl: safeGroupRuleUrl,
    isPage: false,
    queryForm: {
      resourcePoolId: toRef(state.form, 'resourceId'), // 资源池id
      region: toRef(state.form, 'regionId'), // 区域
      projectId: toRef(state.form, 'projectId'), // 项目id
      direction: toRef(state.form, 'direction'),
      securitygroupId: '' // 安全组id
    }
  }
  watch(
    () => state.form.safeGroup,
    value => {
      if (value.length) {
        state.tableState!.queryForm.securitygroupId = value.join(',')
        getDataList()
      }
    }
  )
  const { getDataList } = useCrud(state.tableState)
  watch(
    () => state.tableState?.dataList,
    value => {
      if (value) {
        mergeTable()
      }
    }
  )
  /**
   * 列表合并
   */
  const pos = ref(0)
  const mergeTable = () => {
    if (!state.tableState?.dataList) {
      return
    }

    state.mergeData = []
    for (let i = 0; i < state.tableState.dataList.length; i++) {
      if (i === 0) {
        state.mergeData.push(1)
        pos.value = 0
      } else {
        // 安全组名称合并
        if (
          state.tableState.dataList[i].name ===
          state.tableState.dataList[i - 1].name
        ) {
          state.mergeData[pos.value] += 1
          state.mergeData.push(0)
        } else {
          state.mergeData.push(1)
          pos.value = i
        }
      }
    }
  }
  // 弹性IP
  const getEipList = () => {
    const params = {
      resourceStatus: 'DOWN', // 状态(固定传DOWN调未绑定资源)
      ...commonParams()
    }
    queryEipList(params).then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        state.exitEipList = data
      } else {
        state.exitEipList = []
      }
    })
  }
  const clickRefreshEip = () => {
    state.form.exitEip = ''
    getEipList()
  }
  // 监听公网带宽类型选择
  watch(
    () => [state.form.line, state.form.bandwidthType, state.form.bandwidthSize, state.form.shareBandwidth],
    (newValue, oldValue) => {
      initEipInfo()
      // 选择共享带宽或者线路切换
      if (newValue[1] === 'shareBandwidth' || newValue[0] !== oldValue[0]) {
        getBandWidth()
      }
    }
  )
  // 查询带宽列表
  const getBandWidth = () => {
    const params = {
      // bandwidthType: state.form.line, // 带宽类型
      shareType: 'WHOLE', // 带宽 分享类型: WHOLE 共享带宽; PER 独占带宽
      ...commonParams()
    }
    queryBandWidth(params).then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        state.shareBandwidth = data
      } else {
        state.shareBandwidth = []
      }
    })
  }
  const clickRefreshBandwidth = () => {
    state.form.shareBandwidth = ''
    getBandWidth()
  }
  // 公共传参
  const commonParams = () => {
    return {
      region: regionInfo.value.code, // 区域
      projectId: store.resourceStore.projectId, // 项目id
      resourcePoolId: resourcePoolInfo.value.id // 资源池id
    }
  }

  return {
    onClickAddNetworkCard,
    clickExpandDelete,
    listenIpAddress,
    getDataList,
    clickRefreshSubnet,
    clickRefreshVpc,
    clickRefreshSafeGroup,
    clickRefreshEip,
    clickRefreshBandwidth,
    clickAddEnhanceCard,
    clickDeleteEnhanceCard
  }
}
