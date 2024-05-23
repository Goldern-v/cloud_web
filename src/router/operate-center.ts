/**
 * 运营中心
 */
export const customMenu = [
  {
    path: 'basic-config/cloud-platform-manage/create',
    component: () =>
      import(
        '@/views/operate-center/basic-config/cloud-platform-manage/create.vue'
      ),
    name: 'cloud-platform-manage-create',
    meta: {
      title: '创建云平台',
      breadcrumb: ['运营中心', '基础设施配置', '创建云平台']
    }
  },
  {
    path: 'basic-config/cloud-platform-manage/detail',
    component: () =>
      import(
        '@/views/operate-center/basic-config/cloud-platform-manage/detail.vue'
      ),
    name: 'cloud-platform-manage-detail',
    meta: {
      title: '云平台管理详情',
      breadcrumb: ['运营中心', '基础设施配置', '云平台管理详情']
    }
  },
  {
    path: 'basic-config/resource-pool-manage/create',
    component: () =>
      import(
        '@/views/operate-center/basic-config/resource-pool-manage/create.vue'
      ),
    name: 'resource-pool-manage-create',
    meta: {
      title: '创建资源池',
      breadcrumb: ['运营中心', '基础设施配置', '创建资源池']
    }
  },
  {
    path: 'basic-config/resource-pool-manage/detail',
    component: () =>
      import(
        '@/views/operate-center/basic-config/resource-pool-manage/detail.vue'
      ),
    name: 'resource-pool-manage-detail',
    meta: {
      title: '资源池管理详情',
      breadcrumb: ['运营中心', '基础设施配置', '资源池管理详情']
    }
  },
  {
    path: 'billing-manage/price-model/create',
    component: () =>
      import('@/views/operate-center/billing-manage/price-model/create.vue'),
    name: 'price-model-create',
    meta: {
      title: '创建定价模型',
      breadcrumb: ['运营中心', '计费管理', '创建定价模型']
    }
  },
  {
    path: 'billing-manage/allocation-rule/create',
    component: () =>
      import(
        '@/views/operate-center/billing-manage/allocation-rule/create.vue'
      ),
    name: 'allocation-rule-create',
    meta: {
      title: '创建分摊规则',
      breadcrumb: ['运营中心', '计费管理', '创建分摊规则']
    }
  },
  {
    path: 'expense-center/expense-summary/detail',
    component: () =>
      import(
        '@/views/operate-center/expense-center/expense-summary/detail.vue'
      ),
    name: 'expense-summary-detail',
    meta: {
      title: '费用详情',
      breadcrumb: ['运营中心', '费用中心', '费用详情']
    }
  },
  {
    path: 'expense-center/expense-optimize/optimize-strategy/create',
    component: () =>
      import(
        '@/views/operate-center/expense-center/expense-optimize/optimize-strategy/create.vue'
      ),
    name: 'optimize-strategy-create',
    meta: {
      title: '新建优化策略',
      breadcrumb: ['运营中心', '费用中心', '新建优化策略']
    }
  },
  {
    path: 'expense-center/expense-optimize/optimize-strategy/edit',
    component: () =>
      import(
        '@/views/operate-center/expense-center/expense-optimize/optimize-strategy/create.vue'
      ),
    name: 'optimize-strategy-edit',
    meta: {
      title: '编辑优化策略',
      breadcrumb: ['运营中心', '费用中心', '编辑优化策略']
    }
  },
  {
    path: 'service-manage/service-config/detail',
    component: () =>
      import('@/views/operate-center/service-manage/service-config/detail.vue'),
    name: 'service-config-detail',
    meta: {
      title: '服务配置详情',
      breadcrumb: ['运营中心', '服务管理', '服务配置详情']
    }
  },
  {
    path: 'notice-announcement/announcement-manage/history/detail',
    component: () =>
      import(
        '@/views/operate-center/notice-announcement/announcement-manage/history/detail.vue'
      ),
    name: 'announcement-manage-history-detail',
    meta: {
      title: '公告详情',
      breadcrumb: ['运营中心', '通知公告', '公告详情']
    }
  },
  {
    path: 'notice-announcement/announcement-manage/publicity/detail',
    component: () =>
      import(
        '@/views/operate-center/notice-announcement/announcement-manage/publicity/detail.vue'
      ),
    name: 'announcement-manage-publicity-detail',
    meta: {
      title: '公告详情',
      breadcrumb: ['运营中心', '通知公告', '公告详情']
    }
  },
  {
    path: 'supplier/manage/information-manage-detail',
    component: () =>
      import(
        '@/views/operate-center/supplier/manage/information-manage/detail.vue'
      ),
    name: 'supplier-manage-information-detail',
    meta: {
      title: '信息管理详情',
      breadcrumb: ['运营商管理', '信息管理详情']
    }
  },
  {
    path: 'supplier/manage/approve-manage-detail',
    component: () =>
      import(
        '@/views/operate-center/supplier/manage/approve-manage/detail.vue'
      ),
    name: 'supplier-manage-approve-detail',
    meta: {
      title: '审批管理详情',
      breadcrumb: ['运营商管理', '审批管理详情']
    }
  },
  {
    path: 'supplier/manage/information-entry',
    component: () =>
      import(
        '@/views/operate-center/supplier/manage/information-manage/information-entry/index.vue'
      ),
    name: 'supplier-manage-information-entry',
    meta: {
      title: '信息录入',
      breadcrumb: ['运营商管理', '信息录入']
    }
  },
  {
    path: 'supplier/manage/node-info',
    component: () =>
      import(
        '@/views/operate-center/supplier/manage/information-manage/node-info/index.vue'
      ),
    name: 'supplier-manage-node-info',
    meta: {
      title: '节点信息',
      breadcrumb: ['运营商管理', '节点信息']
    }
  },
  {
    path: 'supplier/manage/device-info',
    component: () =>
      import(
        '@/views/operate-center/supplier/manage/information-manage/device-info/index.vue'
      ),
    name: 'supplier-manage-device-info',
    meta: {
      title: '设备信息',
      breadcrumb: ['运营商管理', '设备信息']
    }
  },
  {
    path: 'supplier/manage/port-info',
    component: () =>
      import(
        '@/views/operate-center/supplier/manage/information-manage/port-info/index.vue'
      ),
    name: 'supplier-manage-port-info',
    meta: {
      title: '端口信息',
      breadcrumb: ['运营商管理', '端口信息']
    }
  },
  {
    path: 'supplier/platform/create',
    component: () => import('@/views/operate-center/supplier/cloud/platform/create.vue'),
    name: 'supplier-platform-create',
    meta: {
      title: '创建云平台',
      breadcrumb: ['公有云管理', '云平台管理', '创建云平台']
    }
  },
  {
    path: 'supplier/platform/detail',
    component: () => import('@/views/operate-center/supplier/cloud/platform/detail.vue'),
    name: 'supplier-platform-detail',
    meta: {
      title: '云平台详情',
      breadcrumb: ['公有云管理', '云平台管理', '云平台详情']
    }
  },
  {
    path: 'supplier/pool/create',
    component: () => import('@/views/operate-center/supplier/cloud/pool/create.vue'),
    name: 'supplier-pool-create',
    meta: {
      title: '创建资源池',
      breadcrumb: ['公有云管理', '资源池管理', '创建资源池']
    }
  },
  {
    path: 'supplier/pool/detail',
    component: () => import('@/views/operate-center/supplier/cloud/pool/detail.vue'),
    name: 'supplier-pool-detail',
    meta: {
      title: '资源池详情',
      breadcrumb: ['公有云管理', '资源池管理', '资源池详情']
    }
  },
  {
    path: 'supplier/resource/aliyun/detail',
    component: () => import('@/views/operate-center/supplier/cloud/resource/aliyun/detail.vue'),
    name: 'supplier-resource-aliyun-detail',
    meta: {
      title: '阿里云资源详情',
      breadcrumb: ['公有云管理', '资源管理', '阿里云资源详情']
    }
  },
  {
    path: 'supplier/resource/amazon/detail',
    component: () => import('@/views/operate-center/supplier/cloud/resource/amazon/detail.vue'),
    name: 'supplier-resource-amazon-detail',
    meta: {
      title: '阿里云资源详情',
      breadcrumb: ['公有云管理', '资源管理', '阿里云资源详情']
    }
  },
  {
    path: 'supplier/account/role/auth',
    component: () => import('@/views/operate-center/supplier/account/role/auth.vue'),
    name: 'supplier-account-role-auth',
    meta: {
      title: '阿里云资源详情',
      breadcrumb: ['供应商账号管理', '角色管理', '授权']
    }
  }
]

export const operateCenterMenu = () => {
  const pathData = ['operate-center']
  const clouds = pathData.map(name => {
    name = name.toLowerCase().includes('operate') ? name : `${name}-center`
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
