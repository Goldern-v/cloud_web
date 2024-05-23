import { IdealCycleSelect } from '@/types'

export const useCreate = (form: any) => {
  // 选择情况
  const selectCase = reactive({
    isEip: true, // 资源类型 是否选择弹性公网IP
    isAlarmPolicy: true, // 策略类型是否为告警策略
    isTimingPolicy: false, // 策略类型是否为定时策略
    isCyclePolicy: false, // 策略类型是否为周期策略
    isCreateAlarm: true, // 告警规则是否创建
    isTriggerBandwidth: true, // 触发条件 - 出入网带宽
    isTriggerFlow: false, // 触发条件 - 出入网流量
    isTriggerRate: false, // 出网带宽使用率
    isWeekCycle: false, // 重复周期-按周
    isMonthCycle: false, // 重复周期-按月
    isSetAction: true // 监听执行-设置为
  })
  // 监听资源类型
  watch(() => form.resourceType, value => {
    selectCase.isEip = false
    if (value === 'eip') {
      selectCase.isEip = true
    }
  })
  // 监听策略类型
  watch(() => form.policyType, value => {
    selectCase.isAlarmPolicy = false
    selectCase.isTimingPolicy = false
    selectCase.isCyclePolicy = false
    if (value === 'alarm') {
      selectCase.isAlarmPolicy = true
    } else if (value === 'timing') {
      selectCase.isTimingPolicy = true
    } else if (value === 'cycle') {
      selectCase.isCyclePolicy = true
    }
  })
  // 监听告警规则
  watch(() => form.alarmRule, value => {
    selectCase.isCreateAlarm = false
    if (value === 'create') {
      selectCase.isCreateAlarm = true
    }
  })
  // 监听触发条件
  watch(() => form.triggerType, value => {
    selectCase.isTriggerBandwidth = false
    selectCase.isTriggerFlow = false
    selectCase.isTriggerRate = false
    if (value === 'enterBandwidth' || value === 'exitBandwidth') {
      selectCase.isTriggerBandwidth = true
    } else if (value === 'enterFlow' || value === 'exitFlow') {
      selectCase.isTriggerFlow = true
    } else if (value === 'exitBandwidthRate') {
      selectCase.isTriggerRate = true
    }
  })
  // 监听重复周期
  watch(() => form.repeatCycle, value => {
    selectCase.isWeekCycle = false
    selectCase.isMonthCycle = false
    if (value === 'week') {
      selectCase.isWeekCycle = true
    } else if (value === 'month') {
      selectCase.isMonthCycle = true
    }
  })
  // 监听执行动作
  watch(() => form.actionType, value => {
    selectCase.isSetAction = false
    if (value === '1') {
      selectCase.isSetAction = true
    }
  })

  // 选择数据
  const selectData = reactive({
    resourceTypes,
    policyTypes,
    alarmRules,
    triggerTypes,
    valueTypes,
    symbols,
    bandwidthUnits,
    monitorCycles,
    actionTypes,
    repeatCycles,
    weekCycles,
    monthCycles,
    eipList: [] as any[], // 弹性公网IP 选择数据
    shareBandwidths: [] as any[], // 共享带宽 选择数据
    alarmRuleSelects: [] as any[], // 已有告警规则 选择数据
  })

  const clickMonthCycleSelect = (index: number) => {
    selectData.monthCycles[index].isSelect = !selectData.monthCycles[index].isSelect
  }
  const clickWeekCycleSelect = (index: number) => {
    selectData.weekCycles[index].isSelect = !selectData.weekCycles[index].isSelect
  }
  

  return {
    selectCase,
    selectData,
    clickMonthCycleSelect,
    clickWeekCycleSelect
  }
}

/**
 * 常量数据
*/
// 资源类型
const resourceTypes = [
  { value: '弹性公网IP', label: 'eip' },
  { value: '共享带宽', label: 'share' }
]
// 策略类型
const policyTypes = [
  { value: '告警策略', label: 'alarm' },
  { value: '定时策略', label: 'timing' },
  { value: '周期策略', label: 'cycle' }
]
// 告警规则
const alarmRules = [
  { value: '现在创建', label: 'create' },
  { value: '使用已有', label: 'already' }
]
// 触发条件
const triggerTypes = [
  { label: '入网带宽', value: 'enterBandwidth' },
  { label: '入网流量', value: 'enterFlow' },
  { label: '出网带宽', value: 'exitBandwidth' },
  { label: '出网流量', value: 'exitFlow' },
  { label: '出网带宽使用率', value: 'exitBandwidthRate' }
]
const valueTypes = [
  { label: '最大值', value: 'maxValue' },
  { label: '最小值', value: 'minValue' },
  { label: '平均值', value: 'averageValue' },
  { label: '求和值', value: 'subValue' },
  { label: '方差值', value: 'varianceValue' },
  { label: '原始值', value: 'originalValue' }
]
const symbols = [
  { label: '<', value: '1' },
  { label: '<=', value: '2' },
  { label: '>', value: '3' },
  { label: '>=', value: '4' },
  { label: '=', value: '5' }
]
const bandwidthUnits = [
  { label: 'bit/s', value: '1' },
  { label: 'Mbit/s', value: '2' }
]
// 监控周期
const monitorCycles = [
  { label: '5分钟', value: '1' },
  { label: '20分钟', value: '2' },
  { label: '1小时', value: '3' },
  { label: '4小时', value: '4' },
  { label: '24小时', value: '5' }
]
// 执行动作
const actionTypes = [
  { label: '设置为', value: '1' },
  { label: '增加', value: '2' },
  { label: '减少', value: '3' }
]
const repeatCycles = [
  { label: '按天', value: 'day' },
  { label: '按周', value: 'week' },
  { label: '按月', value: 'month' }
]
// 按周
const weekCycles: IdealCycleSelect[] = [
  { label: '星期一', value: 'monday', isSelect: false },
  { label: '星期二', value: 'tuesday', isSelect: false },
  { label: '星期三', value: 'wednesday', isSelect: false },
  { label: '星期四', value: 'thursday', isSelect: false },
  { label: '星期五', value: 'friday', isSelect: false },
  { label: '星期六', value: 'saturday', isSelect: false },
  { label: '星期天', value: 'sunday', isSelect: false }
]
// 按月
const monthCycles: IdealCycleSelect[] = [
  { label: '1', value: '1', isSelect: false },
  { label: '2', value: '2', isSelect: false },
  { label: '3', value: '3', isSelect: false },
  { label: '4', value: '4', isSelect: false },
  { label: '5', value: '5', isSelect: false },
  { label: '6', value: '6', isSelect: false },
  { label: '7', value: '7', isSelect: false },
  { label: '8', value: '8', isSelect: false },
  { label: '9', value: '9', isSelect: false },
  { label: '10', value: '10', isSelect: false },
  { label: '11', value: '11', isSelect: false },
  { label: '12', value: '12', isSelect: false },
  { label: '13', value: '13', isSelect: false },
  { label: '14', value: '14', isSelect: false },
  { label: '15', value: '15', isSelect: false },
  { label: '16', value: '16', isSelect: false },
  { label: '17', value: '17', isSelect: false },
  { label: '18', value: '18', isSelect: false },
  { label: '19', value: '19', isSelect: false },
  { label: '20', value: '20', isSelect: false },
  { label: '21', value: '21', isSelect: false },
  { label: '22', value: '22', isSelect: false },
  { label: '23', value: '23', isSelect: false },
  { label: '24', value: '24', isSelect: false },
  { label: '25', value: '25', isSelect: false },
  { label: '26', value: '26', isSelect: false },
  { label: '27', value: '27', isSelect: false },
  { label: '28', value: '28', isSelect: false },
  { label: '29', value: '29', isSelect: false },
  { label: '30', value: '30', isSelect: false },
  { label: '31', value: '31', isSelect: false },
]
