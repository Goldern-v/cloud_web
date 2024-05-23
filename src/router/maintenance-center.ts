/**
 * 运维中心
 */
export const customMenu = [
  {
    path: 'monitor-chart/index',
    component: () =>
      import('@/views/maintenance-center/monitor-chart/index.vue'),
    name: 'monitor-chart',
    meta: {
      title: '云主机监控图表',
      breadcrumb: ['运维中心', '主机监控', '云主机监控图表']
    }
  },
  {
    path: 'alarm-service/custom-alarm-template/create',
    component: () =>
      import(
        '@/views/maintenance-center/alarm-service/alarm-template/custom-alarm-template/create.vue'
      ),
    name: 'custom-alarm-template-create',
    meta: {
      title: '创建自定义模板',
      breadcrumb: ['运维中心', '告警服务', '创建自定义模板']
    }
  },
  {
    path: 'alarm-service/alarm-rule/create',
    component: () =>
      import('@/views/maintenance-center/alarm-service/alarm-rule/create.vue'),
    name: 'alarm-rule-create',
    meta: {
      title: '创建告警规则',
      breadcrumb: ['运维中心', '告警服务', '创建告警规则']
    }
  },
  {
    path: 'alarm-service/alarm-rule/detail',
    component: () =>
      import(
        '@/views/maintenance-center/alarm-service/alarm-rule/detail/index.vue'
      ),
    name: 'alarm-rule-detail',
    meta: {
      title: '告警规则详情',
      breadcrumb: ['运维中心', '告警服务', '告警规则详情']
    }
  },
  {
    path: 'alarm-service/alarm-shield/create',
    component: () =>
      import(
        '@/views/maintenance-center/alarm-service/alarm-shield/create.vue'
      ),
    name: 'alarm-shield-create',
    meta: {
      title: '创建告警屏蔽策略',
      breadcrumb: ['运维中心', '告警屏蔽', '创建告警屏蔽策略']
    }
  }
]

export const maintenanceCenterMenu = () => {
  const pathData = ['maintenance-center']
  const clouds = pathData.map(name => {
    name = name.toLowerCase().includes('maintenance') ? name : `${name}-center`
    return {
      path: `/${name}`,
      component: () => import('../layout/index.vue'),
      meta: {
        title: name,
        role: ['admin', 'user']
      },
      children: customMenu
    }
  })
  return clouds
}
