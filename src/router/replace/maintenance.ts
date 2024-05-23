import cache from '@/utils/cache'
export const replaceMaintenancePath = (path: string): string => {
  let result = ''
  switch (path) {
    case JumpEnum.INSTANCE_MONITOR:
      result = cache.getMonitorSidebar()
      break
    case JumpEnum.ALARM_RULE_CREATE:
    case JumpEnum.ALARM_RULE_DETAIL:
      result = PathEnum.ALARM_RULE_LIST
      break
    case JumpEnum.ALARM_SHIED_CREATE:
      result = PathEnum.ALARM_SHIED_LIST
      break
    case JumpEnum.ALARM_TEMPLATE_CREATE:
      result = PathEnum.ALARM_TEMPLATE_LIST
      break
    default:
      result = path
      break
  }
  return result
}

// 运维中心列表菜单
const PathEnum = {
  ALARM_RULE_LIST: '/maintenance-center/alarm-service/alarm-rule/index', // 告警规则
  ALARM_SHIED_LIST: '/maintenance-center/alarm-service/alarm-shield/index', // 告警屏蔽
  ALARM_TEMPLATE_LIST: '/maintenance-center/alarm-service/alarm-template/index' // 告警模版
}

// 运维中心跳转菜单
const JumpEnum = {
  INSTANCE_MONITOR: '/maintenance-center/monitor-chart/index', // 产品监控
  ALARM_RULE_CREATE: '/maintenance-center/alarm-service/alarm-rule/create', // 告警规则创建
  ALARM_RULE_DETAIL: '/maintenance-center/alarm-service/alarm-rule/detail', // 告警规则详情
  ALARM_SHIED_CREATE: '/maintenance-center/alarm-service/alarm-shield/create', // 告警屏蔽创建
  ALARM_TEMPLATE_CREATE:
    '/maintenance-center/alarm-service/custom-alarm-template/create' // 告警屏蔽创建
}
