/**
 * 公有云路由
 */
export const customMenu = [
  {
    path: 'cloud-host/create',
    component: () => import('@/views/multi-cloud/cloud-host/create.vue'),
    name: 'cloud-host-create',
    meta: {
      title: '创建云服务器',
      breadcrumb: ['资源中心', '计算资源', '创建云服务器']
    }
  },
  {
    path: 'cloud-host/detail',
    component: () => import('@/views/multi-cloud/cloud-host/detail/index.vue'),
    name: 'cloud-host-detail',
    meta: {
      title: '云服务器详情',
      breadcrumb: ['资源中心', '计算资源', '云服务器详情']
    }
  },
  {
    path: 'cloud-disk/create',
    component: () => import('@/views/multi-cloud/cloud-disk/create.vue'),
    name: 'cloud-disk-create',
    meta: {
      title: '创建云硬盘',
      breadcrumb: ['资源中心', '存储资源', '创建云硬盘']
    }
  },
  {
    path: 'cloud-disk/expand',
    component: () => import('@/views/multi-cloud/cloud-disk/expand.vue'),
    name: 'cloud-disk-expand',
    meta: {
      title: '扩容磁盘',
      breadcrumb: ['资源中心', '存储资源', '扩容磁盘']
    }
  },
  {
    path: 'cloud-disk/detail',
    component: () => import('@/views/multi-cloud/cloud-disk/detail/index.vue'),
    name: 'cloud-disk-detail',
    meta: {
      title: '磁盘详情',
      breadcrumb: ['资源中心', '存储资源', '磁盘详情']
    }
  },
  {
    path: 'elastic-ip/create',
    component: () => import('@/views/multi-cloud/elastic-ip/create.vue'),
    name: 'elastic-ip-create',
    meta: {
      title: '创建弹性IP',
      breadcrumb: ['资源中心', '网络资源', '创建弹性IP']
    }
  },
  {
    path: 'elastic-ip/detail',
    component: () => import('@/views/multi-cloud/elastic-ip/detail/index.vue'),
    name: 'elastic-ip-detail',
    meta: {
      title: '弹性IP详情',
      breadcrumb: ['资源中心', '网络资源', '弹性IP详情']
    }
  },
  {
    path: 'elastic-ip/edit',
    component: () =>
      import('@/views/multi-cloud/elastic-ip/operate/edit-bandwidth.vue'),
    name: 'elastic-ip-edit',
    meta: {
      title: '修改带宽',
      breadcrumb: ['资源中心', '网络资源', '修改带宽']
    }
  },
  {
    path: 'elastic-ip/renew',
    component: () => import('@/views/multi-cloud/elastic-ip/operate/renew.vue'),
    name: 'elastic-ip-renew',
    meta: {
      title: '续订',
      breadcrumb: ['资源中心', '网络资源', '续订']
    }
  },
  {
    path: 'elastic-ip/batch-edit',
    component: () =>
      import('@/views/multi-cloud/elastic-ip/operate/batch-edit-bandwidth.vue'),
    name: 'elastic-ip-batch-edit',
    meta: {
      title: '修改带宽',
      breadcrumb: ['资源中心', '网络资源', '修改带宽']
    }
  },
  {
    path: 'vpc/create',
    component: () => import('@/views/multi-cloud/vpc/create.vue'),
    name: 'vpc-create',
    meta: {
      title: '创建虚拟私有云',
      breadcrumb: ['资源中心', '网络资源', '创建虚拟私有云']
    }
  },
  {
    path: 'vpc/detail',
    component: () => import('@/views/multi-cloud/vpc/detail/list.vue'),
    name: 'vpc-detail',
    meta: {
      title: '虚拟私有云详情',
      breadcrumb: ['资源中心', '网络资源', '虚拟私有云详情']
    }
  },
  {
    path: 'share-bandwidth/create',
    component: () => import('@/views/multi-cloud/share-bandwidth/create.vue'),
    name: 'share-bandwidth-create',
    meta: {
      title: '创建共享带宽',
      breadcrumb: ['资源中心', '网络资源', '创建共享带宽']
    }
  },
  {
    path: 'subnet/detail',
    component: () => import('@/views/multi-cloud/subnet/detail.vue'),
    name: 'subnet-detail',
    meta: {
      title: '子网详情',
      breadcrumb: ['资源中心', '网络资源', '子网详情']
    }
  },
  {
    path: 'route-table/detail',
    component: () => import('@/views/multi-cloud/route-table/detail.vue'),
    name: 'route-table-detail',
    meta: {
      title: '路由表详情',
      breadcrumb: ['资源中心', '网络资源', '路由表详情']
    }
  },
  {
    path: 'peer-connection/detail',
    component: () => import('@/views/multi-cloud/peer-connection/detail.vue'),
    name: 'peer-connection-detail',
    meta: {
      title: '对等连接详情',
      breadcrumb: ['资源中心', '网络资源', '对等连接详情']
    }
  },
  {
    path: 'elastic-net-card/detail',
    component: () =>
      import('@/views/multi-cloud/elastic-net-card/detail/index.vue'),
    name: 'elastic-net-card-detail',
    meta: {
      title: '弹性网卡详情',
      breadcrumb: ['资源中心', '网络资源', '弹性网卡详情']
    }
  },
  {
    path: 'mirror-serve/private/create',
    component: () =>
      import('@/views/multi-cloud/mirror-serve/private/create.vue'),
    name: 'mirror-private-create',
    meta: {
      title: '创建私有镜像',
      breadcrumb: ['资源中心', '网络资源', '创建私有镜像']
    }
  },
  {
    path: 'mirror-serve/private/detail',
    component: () =>
      import('@/views/multi-cloud/mirror-serve/private/detail.vue'),
    name: 'mirror-private-detail',
    meta: {
      title: '私有镜像详情',
      breadcrumb: ['资源中心', '网络资源', '私有镜像详情']
    }
  },
  {
    path: 'cloud-backup-policy/create',
    component: () =>
      import('@/views/multi-cloud/cloud-backup-policy/create.vue'),
    name: 'cloud-backup-policy-create',
    meta: {
      title: '创建策略',
      breadcrumb: ['资源中心', '网络资源', '创建策略']
    }
  },
  {
    path: 'cloud-host-backup-storage/create',
    component: () =>
      import('@/views/multi-cloud/cloud-host-backup/storage/create.vue'),
    name: 'cloud-host-backup-storage-create',
    meta: {
      title: '创建云服务器备份存储库',
      breadcrumb: ['资源中心', '网络资源', '创建云服务器备份存储库']
    }
  },
  {
    path: 'cloud-host-backup-storage/execute-backup',
    component: () =>
      import(
        '@/views/multi-cloud/cloud-host-backup/storage/execute-backup.vue'
      ),
    name: 'cloud-host-backup-storage-execute-backup',
    meta: {
      title: '执行备份',
      breadcrumb: ['资源中心', '网络资源', '执行备份']
    }
  },
  {
    path: 'cloud-host-backup-storage/detail',
    component: () =>
      import('@/views/multi-cloud/cloud-host-backup/storage/detail/index.vue'),
    name: 'cloud-host-backup-storage-detail',
    meta: {
      title: '云备份存储库详情',
      breadcrumb: ['资源中心', '网络资源', '云备份存储库详情']
    }
  },
  {
    path: 'share-bandwidth/change',
    component: () => import('@/views/multi-cloud/share-bandwidth/change.vue'),
    name: 'share-bandwidth-change',
    meta: {
      title: '修改带宽',
      breadcrumb: ['资源中心', '网络资源', '修改带宽']
    }
  },
  {
    path: 'share-bandwidth/detail',
    component: () => import('@/views/multi-cloud/share-bandwidth/detail.vue'),
    name: 'share-bandwidth-detail',
    meta: {
      title: '带宽详情',
      breadcrumb: ['资源中心', '网络资源', '带宽详情']
    }
  },
  {
    path: 'safe-group/detail',
    component: () => import('@/views/multi-cloud/safe-group/detail/index.vue'),
    name: 'safe-group-detail',
    meta: {
      title: '安全组详情',
      breadcrumb: ['资源中心', '网络资源', '安全组详情']
    }
  },
  {
    path: 'disk-backup-policy/create',
    component: () =>
      import('@/views/multi-cloud/disk-backup-policy/create.vue'),
    name: 'disk-backup-policy-create',
    meta: {
      title: '创建策略',
      breadcrumb: ['资源中心', '计算资源', '创建策略']
    }
  },
  {
    path: 'elastic-flex-bandwidth/create',
    component: () =>
      import('@/views/multi-cloud/elastic-flex-bandwidth/create.vue'),
    name: 'elastic-flex-bandwidth-create',
    meta: {
      title: '创建伸缩带宽策略',
      breadcrumb: ['资源中心', '计算资源', '创建伸缩带宽策略']
    }
  },
  {
    path: 'elastic-flex-bandwidth/detail',
    component: () =>
      import('@/views/multi-cloud/elastic-flex-bandwidth/detail.vue'),
    name: 'elastic-flex-bandwidth-detail',
    meta: {
      title: '伸缩带宽策略详情',
      breadcrumb: ['资源中心', '计算资源', '伸缩带宽策略详情']
    }
  },
  {
    path: 'elastic-flex-group/create',
    component: () =>
      import('@/views/multi-cloud/elastic-flex-instance/group/create.vue'),
    name: 'elastic-flex-group-create',
    meta: {
      title: '新建弹性伸缩组',
      breadcrumb: ['资源中心', '计算资源', '新建弹性伸缩组']
    }
  },
  {
    path: 'elastic-flex-group/detail',
    component: () =>
      import(
        '@/views/multi-cloud/elastic-flex-instance/group/detail/index.vue'
      ),
    name: 'elastic-flex-group-detail',
    meta: {
      title: '弹性伸缩组详情',
      breadcrumb: ['资源中心', '计算资源', '弹性伸缩组详情']
    }
  },
  {
    path: 'elastic-flex-policy/detail',
    component: () =>
      import(
        '@/views/multi-cloud/elastic-flex-instance/group/detail/flex-policy/detail.vue'
      ),
    name: 'elastic-flex-policy-detail',
    meta: {
      title: '伸缩策略详情',
      breadcrumb: ['资源中心', '计算资源', '伸缩策略详情']
    }
  },
  {
    path: 'elastic-flex-config/create',
    component: () =>
      import('@/views/multi-cloud/elastic-flex-instance/config/create.vue'),
    name: 'elastic-flex-config-create',
    meta: {
      title: '新建伸缩配置',
      breadcrumb: ['资源中心', '计算资源', '新建伸缩配置']
    }
  },
  {
    path: 'cloud-disk-snapshot/create',
    component: () =>
      import('@/views/multi-cloud/cloud-disk-snapshot/create.vue'),
    name: 'cloud-disk-snapshot-create',
    meta: {
      title: '创建快照',
      breadcrumb: ['资源中心', '存储资源', '创建快照']
    }
  },
  {
    path: 'cloud-disk-backup-storage/create',
    component: () =>
      import('@/views/multi-cloud/cloud-disk-backup/storage/create.vue'),
    name: 'cloud-disk-backup-storage-create',
    meta: {
      title: '创建云硬盘备份存储库',
      breadcrumb: ['资源中心', '存储资源', '创建云硬盘备份存储库']
    }
  },
  {
    path: 'cloud-disk-backup-storage/detail',
    component: () =>
      import('@/views/multi-cloud/cloud-disk-backup/storage/detail.vue'),
    name: 'cloud-disk-backup-storage-detail',
    meta: {
      title: '云硬盘备份存储库详情',
      breadcrumb: ['资源中心', '存储资源', '云硬盘备份存储库详情']
    }
  },
  {
    path: 'cloud-disk-backup-storage/expand',
    component: () =>
      import('@/views/multi-cloud/cloud-disk-backup/storage/expand.vue'),
    name: 'cloud-disk-backup-storage-expand',
    meta: {
      title: '扩容云硬盘备份存储库',
      breadcrumb: ['资源中心', '存储资源', '扩容云硬盘备份存储库']
    }
  },
  {
    path: 'cloud-disk-backup-storage/reduce',
    component: () =>
      import('@/views/multi-cloud/cloud-disk-backup/storage/reduce.vue'),
    name: 'cloud-disk-backup-storage-reduce',
    meta: {
      title: '缩容云硬盘备份存储库',
      breadcrumb: ['资源中心', '存储资源', '缩容云硬盘备份存储库']
    }
  },
  {
    path: 'cloud-disk-backup-storage/transform',
    component: () =>
      import('@/views/multi-cloud/cloud-disk-backup/storage/transform.vue'),
    name: 'cloud-disk-backup-storage-transform',
    meta: {
      title: '按需转包年/包月',
      breadcrumb: ['资源中心', '存储资源', '按需转包年/包月']
    }
  },
  {
    path: 'object-storage/bucket/create',
    component: () =>
      import('@/views/multi-cloud/object-storage/bucket/create.vue'),
    name: 'object-storage-bucket-create',
    meta: {
      title: '创建桶',
      breadcrumb: ['资源中心', '存储资源', '创建桶']
    }
  },
  {
    path: 'object-storage/bucket/detail',
    component: () =>
      import('@/views/multi-cloud/object-storage/bucket/detail/index.vue'),
    name: 'object-storage-bucket-detail',
    meta: {
      title: '桶详情',
      breadcrumb: ['资源中心', '存储资源', '桶详情']
    }
  },
  {
    path: 'elastic-file/create',
    component: () => import('@/views/multi-cloud/elastic-file/create.vue'),
    name: 'elastic-file-create',
    meta: {
      title: '创建弹性文件',
      breadcrumb: ['资源中心', '存储资源', '创建弹性文件']
    }
  },
  {
    path: 'elastic-file/detail',
    component: () => import('@/views/multi-cloud/elastic-file/detail.vue'),
    name: 'elastic-file-detail',
    meta: {
      title: '弹性文件详情',
      breadcrumb: ['资源中心', '存储资源', '弹性文件详情']
    }
  },
  {
    path: 'bare-metal-server/create',
    component: () => import('@/views/multi-cloud/bare-metal-server/create.vue'),
    name: 'bare-metal-server-create',
    meta: {
      title: '购买裸金属服务器',
      breadcrumb: ['资源中心', '存储资源', '购买裸金属服务器']
    }
  },
  {
    path: 'acl/detail',
    component: () => import('@/views/multi-cloud/acl/detail/index.vue'),
    name: 'acl-detail',
    meta: {
      title: '网络ACL详情',
      breadcrumb: ['资源中心', '网络资源', '网络ACL详情']
    }
  },
  {
    path: 'elb/detail',
    component: () => import('@/views/multi-cloud/elb/detail/index.vue'),
    name: 'elb-detail',
    meta: {
      title: '弹性负载均衡详情',
      breadcrumb: ['资源中心', '网络资源', '弹性负载均衡详情']
    }
  },
  {
    path: 'elb/create',
    component: () => import('@/views/multi-cloud/elb/create.vue'),
    name: 'elb-create',
    meta: {
      title: '购买弹性负载均衡',
      breadcrumb: ['资源中心', '网络资源', '购买弹性负载均衡']
    }
  },
  {
    path: 'elb/add-listener',
    component: () =>
      import('@/views/multi-cloud/elb/operate/add-listener/index.vue'),
    name: 'elb-add-listener',
    meta: {
      title: '添加监听器',
      breadcrumb: ['资源中心', '网络资源', '添加监听器']
    }
  },
  {
    path: 'elb/edit-bandwidth',
    component: () =>
      import('@/views/multi-cloud/elb/operate/edit-bandwidth.vue'),
    name: 'elb-edit-bandwidth',
    meta: {
      title: '修改带宽',
      breadcrumb: ['资源中心', '网络资源', '修改带宽']
    }
  },
  {
    path: 'elb-server-group/create',
    component: () => import('@/views/multi-cloud/elb-server-group/create.vue'),
    name: 'elb-server-group-create',
    meta: {
      title: '创建后端服务器组',
      breadcrumb: ['资源中心', '网络资源', '创建后端服务器组']
    }
  },
  {
    path: 'elb-server-group/detail',
    component: () =>
      import('@/views/multi-cloud/elb-server-group/detail/index.vue'),
    name: 'elb-server-group-detail',
    meta: {
      title: '后端服务器组详情',
      breadcrumb: ['资源中心', '网络资源', '后端服务器组详情']
    }
  },
  {
    path: 'ip-address-group/detail',
    component: () =>
      import('@/views/multi-cloud/ip-address-group/detail/index.vue'),
    name: 'ip-address-group-detail',
    meta: {
      title: 'IP地址组详情',
      breadcrumb: ['资源中心', '网络资源', 'IP地址组详情']
    }
  },
  {
    path: 'dns/manage-analyze',
    component: () =>
      import(
        '@/views/multi-cloud/public-net-domain-name/manage-analyze/index.vue'
      ),
    name: 'manage-analyze',
    meta: {
      title: '管理分析',
      breadcrumb: ['资源中心', '网络资源', '公网域名', '管理解析']
    }
  },
  {
    path: 'dns/batch-operate',
    component: () =>
      import(
        '@/views/multi-cloud/public-net-domain-name/batch-operate/index.vue'
      ),
    name: 'batch-operate',
    meta: {
      title: '批量操作',
      breadcrumb: ['资源中心', '网络资源', '公网域名', '批量操作']
    }
  },
  {
    path: 'public-network/create',
    component: () => import('@/views/multi-cloud/public-network/create.vue'),
    name: 'public-network-create',
    meta: {
      title: '创建公有网络',
      breadcrumb: ['资源中心', '网络资源', '公有网络', '创建公有网络']
    }
  },
  {
    path: 'manage-network/create',
    component: () => import('@/views/multi-cloud/manage-network/create.vue'),
    name: 'manage-network-create',
    meta: {
      title: '创建管理网络',
      breadcrumb: ['资源中心', '网络资源', '管理网络', '创建管理网络']
    }
  },
  {
    path: 'manage-network/detail',
    component: () =>
      import('@/views/multi-cloud/manage-network/detail/list.vue'),
    name: 'manage-network-detail',
    meta: {
      title: '管理网络详情',
      breadcrumb: ['资源中心', '网络资源', '管理网络', '管理网络详情']
    }
  },
  // {
  //   path: 'router-specification/create',
  //   component: () =>
  //     import('@/views/multi-cloud/router-specification/create.vue'),
  //   name: 'router-specification-create',
  //   meta: {
  //     title: '创建路由器规格',
  //     breadcrumb: ['资源中心', '网络资源', '路由器规格', '创建路由器规格']
  //   }
  // },
  // {
  //   path: 'router-specification/detail',
  //   component: () =>
  //     import('@/views/multi-cloud/router-specification/detail.vue'),
  //   name: 'router-specification-detail',
  //   meta: {
  //     title: '路由器规格详情',
  //     breadcrumb: ['资源中心', '网络资源', '路由器规格', '路由器规格详情']
  //   }
  // },
  // {
  //   path: 'vpc-router/create',
  //   component: () => import('@/views/multi-cloud/vpc-router/create.vue'),
  //   name: 'vpc-router-create',
  //   meta: {
  //     title: '创建VPC路由器',
  //     breadcrumb: ['资源中心', '网络资源', 'VPC路由器', '创建VPC路由器']
  //   }
  // },
  // {
  //   path: 'vpc-router/detail',
  //   component: () => import('@/views/multi-cloud/vpc-router/detail/list.vue'),
  //   name: 'vpc-router-detail',
  //   meta: {
  //     title: 'VPC路由器详情',
  //     breadcrumb: ['资源中心', '网络资源', 'VPC路由器', 'VPC路由器详情']
  //   }
  // },
  {
    path: 'task/detail',
    component: () => import('@/views/multi-cloud/task/detail.vue'),
    name: 'task-detail',
    meta: {
      title: '任务详情',
      breadcrumb: ['资源中心', '任务']
    }
  }
]

export const publicMenu = () => {
  const pathData = ['multi-cloud']
  const clouds = pathData.map(name => {
    name = name.toLowerCase().includes('cloud') ? name : `${name}-cloud`
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
