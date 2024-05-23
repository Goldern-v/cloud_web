/**
 * 业务中心
 */
export const customMenu = [
  {
    path: 'work-order/mine/wait/detail',
    component: () =>
      import('@/views/business-center/work-order/mine/wait/detail.vue'),
    name: 'work-order-mine-wait-detail',
    meta: {
      title: '待办工单详情',
      breadcrumb: ['运维中心', '工单管理', '待办工单详情']
    }
  },
  {
    path: 'work-order/mine/finished/detail',
    component: () =>
      import('@/views/business-center/work-order/mine/finished/detail.vue'),
    name: 'work-order-mine-finished-detail',
    meta: {
      title: '已办工单详情',
      breadcrumb: ['运维中心', '工单管理', '已办工单详情']
    }
  },
  {
    path: 'order-manage/commission/approve/detail',
    component: () =>
      import(
        '@/views/business-center/order-manage/commission/approve/detail.vue'
      ),
    name: 'order-manage-wait-detail',
    meta: {
      title: '待审批订单详情',
      breadcrumb: ['运维中心', '订单管理', '待审批订单详情']
    }
  },
  {
    path: 'order-manage/commission/pay/detail',
    component: () =>
      import('@/views/business-center/order-manage/commission/pay/detail.vue'),
    name: 'order-manage-finished-detail',
    meta: {
      title: '待支付订单详情',
      breadcrumb: ['运维中心', '订单管理', '待支付订单详情']
    }
  },
  {
    path: 'order-manage/myOrder/detail',
    component: () =>
      import('@/views/business-center/order-manage/mine/detail.vue'),
    name: 'order-manage-history-detail',
    meta: {
      title: '我的订单详情',
      breadcrumb: ['运维中心', '订单管理', '我的订单详情']
    }
  },
  {
    path: 'organization-manage/vdc-manage/detail',
    component: () =>
      import(
        '@/views/business-center/organization-manage/vdc-manage/detail.vue'
      ),
    name: 'vdc-manage-detail',
    meta: {
      title: 'vdc管理详情',
      breadcrumb: ['运维中心', '组织管理', 'vdc管理详情']
    }
  },
  {
    path: 'organization-manage/project-manage/detail',
    component: () =>
      import(
        '@/views/business-center/organization-manage/project-manage/detail.vue'
      ),
    name: 'project-manage-detail',
    meta: {
      title: '项目管理详情',
      breadcrumb: ['运维中心', '组织管理', '项目管理详情']
    }
  },
  {
    path: 'organization-manage/user-manage/detail',
    component: () =>
      import(
        '@/views/business-center/organization-manage/user-manage/detail.vue'
      ),
    name: 'user-manage-detail',
    meta: {
      title: '用户管理详情',
      breadcrumb: ['运维中心', '组织管理', '用户管理详情']
    }
  },
  {
    path: 'organization-manage/sub-account-manage/detail',
    component: () =>
      import(
        '@/views/business-center/organization-manage/sub-account-manage/detail.vue'
      ),
    name: 'sub-account-manage-detail',
    meta: {
      title: '子用户管理详情',
      breadcrumb: ['运维中心', '组织管理', '子用户管理详情']
    }
  },
  {
    path: 'tag-manage/resource-tag/create',
    component: () =>
      import('@/views/business-center/tag-manage/resource-tag/create.vue'),
    name: 'resource-public-create',
    meta: {
      title: '新建公有标签',
      breadcrumb: ['运维中心', '标签管理', '新建公有标签']
    }
  },
  {
    path: 'system-config/ad-ldap/create',
    component: () =>
      import('@/views/business-center/system-config/ad-ldap/create.vue'),
    name: 'ad-ldap-create',
    meta: {
      title: '新建AD/LDAP',
      breadcrumb: ['运维中心', '系统设置', '新建AD/LDAP']
    }
  },
  {
    path: 'organization-manage/role-manage/create',
    component: () =>
      import(
        '@/views/business-center/organization-manage/role-manage/create.vue'
      ),
    name: 'role-manage-create',
    meta: {
      title: '新建角色',
      breadcrumb: ['运维中心', '角色管理', '新建角色']
    }
  }
]

export const businessCenterMenu = () => {
  const pathData = ['business-center']
  const clouds = pathData.map(name => {
    name = name.toLowerCase().includes('business') ? name : `${name}-center`
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
