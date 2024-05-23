import { BillingEnum, OperateEventEnum } from '@/utils/enum'
import type {
  IdealTableColumnOperate,
  IdealTableColumnHeaders,
  IdealButtonEventProp
} from '@/types'
import { useResourcePool } from '@/utils/common/resource'
const { isPublicHuawei, isPrivateHuawei, isAliyun } = useResourcePool()

// 云主机核数
export const vCPUList = [
  { id: '1', name: '1核' },
  { id: '2', name: '2核' },
  { id: '4', name: '4核' },
  { id: '8', name: '8核' },
  { id: '16', name: '16核' },
  { id: '32', name: '32核' }
]
// 云主机内存
export const memoryList = [
  { id: '1', name: '1G' },
  { id: '2', name: '2G' },
  { id: '4', name: '4G' },
  { id: '8', name: '8G' },
  { id: '16', name: '16G' },
  { id: '32', name: '32G' },
  { id: '64', name: '64G' },
  { id: '128', name: '128G' }
]
// 弹性云主机购买时长
export const timeValues = [
  { label: '1个月', value: 1, title: '1' },
  { label: '2个月', value: 2, title: '2' },
  { label: '3个月', value: 3, title: '3' },
  { label: '4个月', value: 4, title: '4' },
  { label: '5个月', value: 5, title: '5' },
  { label: '6个月', value: 6, title: '6' },
  { label: '7个月', value: 7, title: '7' },
  { label: '8个月', value: 8, title: '8' },
  { label: '9个月', value: 9, title: '9' },
  { label: '10个月', value: 10, title: '10' },
  { label: '11个月', value: 11, title: '11' },
  { label: '一年', value: 12, title: '一年' },
  { label: '两年', value: 13, title: '两年' },
  { label: '三年', value: 14, title: '三年' }
]
// 实例筛选
export const instanceList = [
  { label: '规格类型选择', value: '1' }
  // { label: '业务场景选择', value: '2' }
]
// 业务场景选择
export const sceneList = [
  { label: 'web应用', value: '1' },
  { label: '网站应用/电商', value: '2' },
  { label: '游戏', value: '3' },
  { label: '数据库', value: '4' },
  { label: '数据分析', value: '5' },
  { label: '高性能计算', value: '6' },
  { label: '图形渲染', value: '7' },
  { label: 'AI/机器学习', value: '8' }
]
// 计费模式数组
export const billingModeList = [
  { label: BillingEnum.ON_DEMAND, value: '按需收费' },
  { label: BillingEnum.PACKAGE, value: '包年包月' }
]
// 子场景
export const subsceneList = [
  { label: 'AI训练 ', value: '1' },
  { label: 'AI推理', value: '2' }
]
// 镜像类型
export const mirrorTypeList = [
  { label: 'public', value: '公有镜像' },
  { label: 'private', value: '私有镜像' },
  { label: 'shared', value: '共享镜像' }
]
// 登录凭证
export const loginCredentialsList: any = [
  { label: '密码', value: '1' },
  { label: '密钥对', value: '2' },
  { label: '创建后设置', value: '3' }
]
// 云备份
export const cloudBackupList: any = [
  { label: '现在购买', value: '1' },
  { label: '使用已有', value: '2' },
  { label: '暂不购买', value: '3' }
]
// ip生成方式
export const ipGenerateList: any = [
  { label: '自动生成IP地址', value: '1' },
  { label: '手动分配IP地址', value: '2' }
]
// 线路
export const lineList: any = [
  { label: '全动态BGP', value: '5_bgp' },
  { label: '静态BGP', value: '5_sbgp' }
]
// 公网带宽
export const bandwidthTypeList: any = [
  { label: '按带宽计费', value: 'bandwidth' },
  { label: '按流量计费', value: 'traffic' },
  { label: '加入共享带宽', value: 'shareBandwidth' }
]
// 按带宽计费时带宽大小
export const bandWidthList: any = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '100', value: 100 },
  { label: '200', value: 200 }
]
// 按流量计费时带宽大小
export const flowBandWidthList: any = [
  { label: '5', value: 5 },
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '50', value: 50 },
  { label: '100', value: 100 }
]
export const cloudBackupRepositoryUnit: any = [{ label: 'GB', value: '1' }]
// 基本配置
export const basicList = [
  { label: '计费模式', value: 'billingModeName' },
  { label: '区域', value: 'regionName' },
  { label: '可用区', value: 'availableZoneName' },
  { label: '规格', value: 'specification' },
  { label: '镜像', value: 'mirrorName' },
  { label: '系统盘', value: 'systemDiskName' }
]
// 网络配置
export const networkList = [
  { label: '虚拟私有云', value: 'vpcInfo' },
  { label: '安全组', value: 'safeGroupInfo' },
  { label: '子网', value: 'subnetInfo' },
  { label: '弹性公网IP', value: 'eipInfo' }
]
// 高级配置
export const highList = () => {
  if (isPublicHuawei.value) {
    return [
      { label: '云服务器名称', value: 'cloudHostName' },
      { label: '登录凭证', value: 'loginCredentialsName' },
      { label: '云备份存储库', value: 'cloudBackupRepositoryName' },
      { label: '备份策略', value: 'backupPolicyInfo' },
      { label: '云服务器组', value: 'cloudGroupTypeInfo' }
    ]
  } else if (isPrivateHuawei.value || isAliyun.value) {
    return [
      { label: '云服务器名称', value: 'cloudHostName' },
      { label: '登录凭证', value: 'loginCredentialsName' },
      { label: '云服务器组', value: 'cloudGroupTypeInfo' }
    ]
  } else {
    return []
  }
}

// 处理开关机
export const handleStartupAndShutdown = (
  status: string,
  array: IdealTableColumnOperate[]
): IdealTableColumnOperate[] => {
  const index = array.findIndex(item => item.prop === 'instanceStatus')
  const operate = ['shutdown', 'reboot', 'login'] //关机状态需禁用操作
  array[index]?.children?.forEach((item: any) => {
    if (item.prop === 'powerOn' && status === 'RUNNING') {
      item.disabled = true
      item.disabledText = '当前云服务器运行中，不能再开机'
    } else if (operate.includes(item.prop) && status === 'SHUTDOWN') {
      item.disabled = true
      item.disabledText = `当前云服务器已关机，不能进行${item.title}操作`
    }
  })
  //关机状态禁用远程登录
  array.forEach(item => {
    item.disabled = operate.includes(item.prop) && status === 'SHUTDOWN'
    item.disabledText = `当前云服务器已关机，不能进行${item.title}操作`
  })
  return array
}
// 判断计费类型,按需计费不显示续订和退订
export const handleOperateButton = (
  item: any,
  array: IdealTableColumnOperate[]
): IdealTableColumnOperate[] => {
  // ON_DEMAND按需 添加删除操作 PACKAGE包年包月 添加退订操作
  if (item.billType === BillingEnum.ON_DEMAND) {
    const index = array.findIndex(item => item.prop === 'instanceStatus')
    array[index].children?.push({ title: '删除', prop: 'delete' })
  } else {
    const index = array.findIndex(item => item.prop === 'resourceAdjust')
    array[index].children?.unshift({ title: '退订', prop: 'unsubscribe' })
    array[index].children?.unshift({ title: '续订', prop: 'renew' })
  }
  return array
}
// 根据状态设置操作禁用状态
export const setOperateBtns = (
  disabled: boolean,
  disabledText: string,
  array: IdealTableColumnOperate[]
): IdealTableColumnOperate[] => {
  const arr: IdealTableColumnOperate[] = []
  array.forEach((item: any) => {
    if (!item.children) {
      item.disabled = disabled
      item.disabledText = disabledText
    }
    if (item.children && item.children.length > 0) {
      setOperateBtns(disabled, disabledText, item.children)
    }
    arr.push(item)
  })
  return arr
}

export const handleOperateByCloud = (
  cloudCategory: string, //云类别
  cloudType: string, //云类型
  status: string, //状态
  array: IdealTableColumnOperate[]
): IdealTableColumnOperate[] => {
  const privateHuawei = RegExp(/HUAWEI/).test(cloudType) && RegExp(/PRIVATE/).test(cloudCategory)
  //华为私有云只有在关机状态下才能执行删除、退订、变配等操作
  if (privateHuawei) {
    const restrictOperate = ['delete', 'unsubscribe']
    const index = array.findIndex(item => item.prop === 'instanceStatus')
    array[index]?.children?.forEach((item: any) => {
      if (restrictOperate.includes(item.prop) && status !== 'SHUTDOWN') {
        item.disabled = true
        item.disabledText = `华为私有云仅支持关机下进行${item.title}操作`
      }
    })
  }

  const aliyun = RegExp(/ALI/).test(cloudType) && RegExp(/PUBLIC/).test(cloudCategory)
  const publicTencent = RegExp(/TENCENT/).test(cloudType) && RegExp(/PUBLIC/).test(cloudCategory)
  //阿里云支持关机状态下执行变配操作
  if (privateHuawei || aliyun || publicTencent) {
    let tip = ''
    if (privateHuawei) {
      tip = '华为私有云'
    } else if (aliyun) {
      tip = '阿里云'
    } else if (publicTencent) {
      tip = '腾讯公有云'
    }
    const index = array.findIndex(item => item.prop === 'resourceAdjust')
    array[index]?.children?.forEach((item: any) => {
      if (item.prop === 'variation' && status !== 'SHUTDOWN') {
        item.disabled = true
        item.disabledText = `${tip}仅支持关机下进行${item.title}操作`
      }
    })
  }
  
  // 腾讯云支持关机状态下执行重置密码、变配
  if (publicTencent) {
    array.forEach((item: any) => {
      if (item.prop === 'reset' && status !== 'SHUTDOWN') {
        item.disabled = true
        item.disabledText = `腾讯云仅支持关机下进行${item.title}操作`
      }
    })
  }

  const publicCtyun = RegExp(/CTYUN/).test(cloudType) && RegExp(/PUBLIC/).test(cloudCategory)
  // 天翼云支持开机状态下执行重置密码
  if (publicCtyun) {
    array.forEach((item: any) => {
      if (item.prop === 'reset' && status !== 'RUNNING') {
        item.disabled = true
        item.disabledText = `天翼公有云仅支持开机下进行${item.title}操作`
      }
    })

    const restrictOperate = ['delete', 'unsubscribe']
    const index = array.findIndex(item => item.prop === 'instanceStatus')
    array[index]?.children?.forEach((item: any) => {
      if (restrictOperate.includes(item.prop) && status !== 'SHUTDOWN') {
        item.disabled = true
        item.disabledText = `天翼公有云仅支持关机下进行${item.title}操作`
      }
    })
  }

  return array
}
// 获取列表操作类型
type eventType = string | number | object
export const getDialogType = (type: eventType): OperateEventEnum | string => {
  let str: OperateEventEnum | string = ''
  if (type === 'delete') {
    str = OperateEventEnum.delete
  } else if (type === 'variation') {
    str = OperateEventEnum.variation
  } else if (type === 'expand') {
    str = OperateEventEnum.expand
  } else if (type === 'adjust') {
    str = OperateEventEnum.adjust
  } else if (type === 'unsubscribe') {
    str = OperateEventEnum.unsubscribe
  } else if (type === 'renew') {
    str = OperateEventEnum.renew
  } else if (type === 'reboot') {
    str = OperateEventEnum.reboot
  } else if (type === 'shutdown') {
    str = OperateEventEnum.shutdown
  } else if (type === 'powerOn') {
    str = OperateEventEnum.powerOn
  } else if (type === 'hangUp') {
    str = OperateEventEnum.hangUp
  } else if (type === 'recover') {
    str = OperateEventEnum.recover
  } else if (type === 'reset') {
    str = OperateEventEnum.reset
  } else if (type === 'associateTag') {
    str = OperateEventEnum.associate
  }
  return str
}
// 列表表头
export const headerArray: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true, check: true, disabled: true },
  {
    label: '操作系统',
    prop: 'osType',
    useSlot: true,
    check: true,
    disabled: false
  },
  {
    label: '状态',
    prop: 'status',
    useSlot: true,
    check: true,
    disabled: false
  },
  { label: '规格', prop: 'spec', useSlot: true, check: true, disabled: false },
  {
    label: '云平台类别',
    prop: 'pool.cloudCategoryName',
    width: '150',
    check: true,
    disabled: false
  },
  {
    label: '云平台类型',
    prop: 'pool.cloudTypeName',
    width: '150',
    check: true,
    disabled: false
  },
  {
    label: '云平台名称',
    prop: 'pool.cloudPlatform.name',
    width: '150',
    check: true,
    disabled: false
  },
  {
    label: '资源池名称',
    prop: 'pool.name',
    width: '150',
    check: true,
    disabled: false
  },
  { label: '所属项目', prop: 'project.name', check: true, disabled: false },
  {
    label: 'IP地址',
    prop: 'ipAddress',
    useSlot: true,
    check: true,
    disabled: false
  },
  { label: '计费模式', prop: 'billingDes', check: true, disabled: false },
  {
    label: '创建时间',
    prop: 'createTime.date',
    width: '150',
    check: true,
    disabled: false
  },
  {
    label: '到期时间',
    prop: 'expiredDate',
    width: '150',
    check: true,
    disabled: false
  },
  {
    label: '标签',
    prop: 'tag',
    check: true,
    disabled: false,
    width: '150',
    useSlot: true
  },
  { label: '可用区', prop: 'availableZone', check: true, disabled: false }
]
// 左侧按钮事件
export const leftButtons: IdealButtonEventProp[] = [
  {
    title: '新建弹性云服务器',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  // {
  //   title: '开机',
  //   prop: 'powerOn',
  //   disabled: true,
  //   disabledText: '请选择云主机'
  // },
  // {
  //   title: '关机',
  //   prop: 'shutdown',
  //   disabled: true,
  //   disabledText: '请选择云主机'
  // },
  // {
  //   title: '重启',
  //   prop: 'reboot',
  //   disabled: true,
  //   disabledText: '请选择云主机'
  // },
  // {
  //   title: '一键重装',
  //   prop: 'reinstall',
  //   disabled: true,
  //   disabledText: '请选择云主机'
  // },
  // {
  //   title: '远程登录',
  //   prop: 'telnet',
  //   disabled: true,
  //   disabledText: '请选择云主机'
  // },
  {
    title: '批量解绑标签',
    prop: 'unbindTag'
  }
]
export const rightButtons: IdealButtonEventProp[] = [
  {
    prop: 'download',
    icon: 'download-icon'
  },
  {
    prop: 'setting',
    icon: 'setting-icon'
  }
]
// 根据行数据云类型判断返回操作
export const useOperate = () => {
  const getOperate = (item: any): IdealTableColumnOperate[] => {
    if (item?.cloudType.toUpperCase() === 'VMWARE') {
      return vmwareOperate
    }
    return operateBtns
  }
  return {
    getOperate
  }
}
// 列表行数据操作事件
const operateBtns: IdealTableColumnOperate[] = [
  { title: '远程登录', prop: 'login' },
  { title: '创建镜像', prop: 'createMirror' },
  {
    title: '实例状态',
    prop: 'instanceStatus',
    children: [
      { title: '重启', prop: 'reboot' },
      { title: '开机', prop: 'powerOn' },
      { title: '关机', prop: 'shutdown' }
    ]
  },
  {
    title: '资源调整',
    prop: 'resourceAdjust',
    children: [
      { title: '变配', prop: 'variation' }
      // { title: '扩容云硬盘', prop: 'expand' },(暂时屏蔽)
      // { title: '调整网络', prop: 'adjust' } (暂时屏蔽)
    ]
  },
  // { title: '创建相同配置', prop: 'createSameConfig' },(暂时屏蔽)
  { title: '重置密码', prop: 'reset' },
  { title: '标签管理', prop: 'associateTag' }
]
// vmware操作
const vmwareOperate: IdealTableColumnOperate[] = [
  { title: '标签管理', prop: 'associateTag' },
  { title: '创建镜像', prop: 'createMirror' },
  {
    title: '实例状态',
    prop: 'instanceStatus',
    children: [
      { title: '重启', prop: 'reboot' },
      { title: '开机', prop: 'powerOn' },
      { title: '关机', prop: 'shutdown' }
    ]
  },
  {
    title: '资源调整',
    prop: 'resourceAdjust',
    children: [{ title: '变配', prop: 'variation' }]
  }
]
