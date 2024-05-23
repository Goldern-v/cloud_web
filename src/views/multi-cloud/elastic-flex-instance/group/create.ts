import { OperateEventEnum } from '@/utils/enum'

export const useCreate = (form: any) => {
  // 选择情况
  const selectCase = reactive({
    useLbs: false, // 是否选择使用负载均衡
    isLbsCheck: true // 健康检查方式 负载均衡
  })
  // 监听负载均衡
  watch(() => form.lbsType, value => {
    selectCase.useLbs = false
    if (value === 'used') {
      selectCase.useLbs = true
    }
  })
  // 监听负载均衡
  watch(() => form.healthMode, value => {
    selectCase.isLbsCheck = false
    if (value === 'lbs') {
      selectCase.isLbsCheck = true
    }
  })
  // 选择数据
  const selectData = reactive({
    availableAreas: [] as any[], // 可用区
    vpcList: [] as any[], // 虚拟私有云
    subnetList: [] as any[], // 子网
    removePolicies, // 实例移除策略
    healthModes, // 健康检查方式
    healthIntervals, // 健康检查间隔
    delegations:  [] as any[] // 委托
  })
  const flexConfigRef = ref()
  const clickFlexConfig = () => {
    showDialog.value = true
    dialogType.value = OperateEventEnum.check
  }
  // 弹框
  const showDialog = ref(false)
  const dialogType = ref<OperateEventEnum>()
  const clickCloseEvent = () => {
    resetDialog()
  }
  const clickRefreshEvent = () => {
    resetDialog()
  }
  // 重置弹框
  const resetDialog = () => {
    showDialog.value = false
    dialogType.value = undefined // 防止再点击弹框时 有值
  }

  return {
    selectData,
    selectCase,
    showDialog,
    dialogType,
    clickFlexConfig,
    clickCloseEvent,
    clickRefreshEvent
  }
}
// 实例移除策略
const removePolicies = [
  { label: '根据较早创建的配置较早创建的实例', value: '1' },
  { label: '根据较早创建的配置较晚创建的实例', value: '2' },
  { label: '较早创建的实例', value: '3' },
  { label: '较晚创建的实例', value: '4' }
]
// 健康检查方式
const healthModes = [
  { label: '负载均衡健康检查', value: 'lbs' },
  { label: '云服务器健康检查', value: 'ecs' }
]
// 健康检查间隔
const healthIntervals = [
  { label: '10秒', value: '1' },
  { label: '1分钟', value: '2' },
  { label: '5分钟', value: '3' },
  { label: '15分钟', value: '4' },
  { label: '1小时', value: '5' },
  { label: '3小时', value: '6' }
]