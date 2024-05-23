import { IdealCycleSelect } from '@/types'

export const useCreate = (form: any) => {
  // 选择情况
  const selectCase = reactive({
    isAlarmPolicy: true, // 策略类型是否为告警策略
    isTimingPolicy: false, // 策略类型是否为定时策略
    isCyclePolicy: false, // 策略类型是否为周期策略
    isCreateAlarm: true, // 告警规则是否创建
    isTriggerBandwidth: true, // 触发条件 - 出入网带宽
    isTriggerFlow: false, // 触发条件 - 出入网流量
    isTriggerRate: false, // 出网带宽使用率
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

  // 选择数据
  const selectData = reactive({
    policyTypes,
    alarmRules,
    triggerTypes,
    valueTypes,
    symbols,
    bandwidthUnits,
    monitorCycles,
    monitorTypes,
    actionTypes,
    actionTypeUnits
  })
  
  return {
    selectCase,
    selectData
  }
}

/**
 * 常量数据
*/
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
// 监控类型
const monitorTypes = [
  { label: 'system', value: '系统监控' },
  { label: 'custom', value: '自定义监控' }
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
  { label: '增加', value: '1' },
  { label: '减少', value: '2' }
]
const actionTypeUnits = [
  { label: '个实例', value: '1' }
]
