import { isEmpty } from '@/utils/is'
// 固定数据
export const resourceRangeList = [
  { label: '全部资源', value: 'ALL_INSTANCE' },
  { label: '实例', value: 'MULTI_INSTANCE' }
]
export const ruleSourceList = [
  { label: '自定义创建', value: 'custom' },
  { label: '模板导入', value: 'template-import' }
]
export const alarmTypeList = [
  { label: '阈值告警', value: 'HISTORY' },
  { label: '预测告警', value: 'INTERVAL' }
]
export const comparisonValues = [
  { label: '平均值', value: 'average' },
  { label: '最小值', value: 'min' },
  { label: '最大值', value: 'max' }
]
export const comparisonFormat: { [key: string]: string } = {
  average: '平均值',
  min: '最小值',
  max: '最大值'
}
// 阈值 比较方法
export const comparisonList = [
  { label: '大于', value: '>' },
  { label: '大于等于', value: '>=' },
  { label: '小于', value: '<' },
  { label: '小于等于', value: '<=' },
  { label: '等于', value: '=' }
]
// 时间单位
export const unitList = [
  { label: '分钟', value: 'MINUTE' },
  { label: '小时', value: 'HOUR' },
  { label: '日', value: 'DAY' }
]
export const unitFormat: { [key: string]: string } = {
  MINUTE: '分钟',
  HOUR: '小时',
  DAY: '日'
}
// 告警级别
export const alarmLevelList = [
  { label: '提醒', color: '#2AA471', value: 'LOG' },
  { label: '警告', color: '#F3AD3C', value: 'WARN' },
  { label: '严重', color: '#BE5A00', value: 'BAD' },
  { label: '致命', color: '#881F1C', value: 'CRITICIZE' }
]

export const alarmLevelFormat: { [key: string]: string } = {
  LOG: '提醒告警',
  WARN: '警告告警',
  BAD: '严重告警',
  CRITICIZE: '致命告警'
}

export const indexTypeList = [
  { label: '单指标', value: 'SINGLE_METRIC' },
  { label: '多指标', value: 'MULTIPLE_METRICS' }
]

export const triggerConfigList = [
  { label: '当所有指标都符合条件时告警', value: 'ALL' },
  { label: '有一个满足触发条件就告警', value: 'SINGLE' }
]
//告警级别配置
interface alarmLevelProps {
  color: string //告警级别颜色
  reportLevelText: string //告警级别描述
  reportLevel: string //告警级别绑定值
}
export const alarmLevelConfig: alarmLevelProps[] = [
  { color: '#881F1C', reportLevelText: '致命', reportLevel: 'CRITICIZE' },
  { color: '#BE5A00', reportLevelText: '严重', reportLevel: 'BAD' },
  { color: '#F3AD3C', reportLevelText: '警告', reportLevel: 'WARN' },
  { color: '#2AA471', reportLevelText: '提醒', reportLevel: 'LOG' }
]

//根据所选监控指标code找到对应的监控指标全部信息
export const getIndicatorInfo = (indicatorList: any, obj: any) => {
  let indicator: any = {}
  if (Array.isArray(obj?.monitorReferAttr)) {
    const index = indicatorList.findIndex(
      (item: any) => item.code === obj?.monitorReferAttr[0]
    )
    indicator = indicatorList[index]?.metrics.find(
      (ele: any) => ele.code === obj?.monitorReferAttr[1]
    )
  } else {
    const arr: any = []
    indicatorList.forEach((item: any) => {
      if (item.metrics) {
        arr.push(...item.metrics)
      }
    })
    indicator = arr.find((item: any) => item.code === obj?.monitorReferAttr)
  }
  return indicator
}

//处理监控指标绑定值
export const handleMonitorReferAttr = (item: any) => {
  let monitorReferAttr = ''
  if (Array.isArray(item)) {
    monitorReferAttr = item[item.length - 1]
  } else {
    monitorReferAttr = item
  }
  return monitorReferAttr
}

//单指标阈值规则必填的属性
const singleKey = [
  'valueAttr',
  'comparisonOperator',
  'thresholdValue',
  'monitorInterval',
  'monitorIntervalUnit',
  'tolerateTimes'
]
//多指标阈值规则必填的属性
const multiKey = [
  'monitorReferAttr',
  'valueAttr',
  'comparisonOperator',
  'thresholdValue'
]
//告警规则触发满足条件必填的属性
const triggerKey = ['monitorInterval', 'monitorIntervalUnit', 'tolerateTimes']

export const getCheckKey = (type: string) => {
  let arr: any = []
  if (type === 'single') {
    arr = singleKey
  } else if (type === 'multi') {
    arr = multiKey
  } else if (type === 'trigger') {
    arr = triggerKey
  }
  return arr
}
//用来校验阈值规则数量
export const hasEmptyValue = (obj: any, type: string) => {
  //需校验参数
  for (let key in obj) {
    if (
      getCheckKey(type).includes(key) &&
      obj.hasOwnProperty(key) &&
      (obj[key] === null || obj[key] === undefined)
    ) {
      return true
    }
  }
  return false
}
//校验阈值规则配置的几个必填属性值不为空的个数(用来校验阈值规则的完整性)
export const countNonNullValues = (obj: any, type: string) => {
  let count = 0
  for (let key in obj) {
    if (
      getCheckKey(type).includes(key) &&
      obj[key] !== null &&
      obj[key] !== undefined &&
      obj[key] !== ''
    ) {
      count++
    }
  }
  return count
}
//校验阈值规则
export const validateRule = (
  type: string,
  rule: any,
  value: any,
  callback: (e?: Error) => any
) => {
  const arr = value.filter((item: any) => {
    return !isEmpty(item)
  })
  value.forEach((ele: any) => {
    ele.checked =
      countNonNullValues(ele, type) >= rule.min &&
      countNonNullValues(ele, type) < rule.max
  })
  const isComplete = !value.some((ele: any) => ele.checked)
  const text = type === 'trigger' ? '触发满足条件' : '阈值规则'
  if (!arr.length) {
    callback(new Error('请至少配置一条' + text))
  } else if (!isComplete) {
    callback(new Error('请配置完整的' + text))
  } else {
    callback()
  }
}

export interface indicatorProps {
  valueAttr: string
  comparisonOperator: string
  monitorInterval: number | null
  thresholdValue: number | null
  monitorIntervalUnit: string
  tolerateTimes: number | null
  color: string
  level: string
}
