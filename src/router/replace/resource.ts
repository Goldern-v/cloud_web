export const replaceResourcePath = (path: string): string => {
  let result = ''
  switch (path) {
    /**
     * 资源中心
     */
    // 云主机
    case JumpEnum.CLOUD_HOST_CREATE:
    case JumpEnum.CLOUD_HOST_DETAIL:
      result = PathEnum.CLOUD_HOST_LIST
      break
    // 云硬盘
    case JumpEnum.CLOUD_DISK_CREATE:
    case JumpEnum.CLOUD_DISK_EXPAND:
    case JumpEnum.CLOUD_DISK_DETAIL:
      result = PathEnum.CLOUD_DISK_LIST
      break
    // 私有镜像
    case JumpEnum.MIRROR_SERVE_PRIVATE_CREATE:
    case JumpEnum.MIRROR_SERVE_PRIVATE_DETAIL:
      result = PathEnum.MIRROR_SERVE_LIST
      break
    // 云主机备份存储库
    case JumpEnum.CLOUD_HOST_BACKUP_STORAGE_CREATE:
    case JumpEnum.CLOUD_HOST_BACKUP_STORAGE_DETAIL:
    case JumpEnum.CLOUD_HOST_BACKUP_STORAGE_EXECUTE:
      result = PathEnum.CLOUD_HOST_BACKUP_LIST
      break
    // 云主机备份策略
    case JumpEnum.CLOUD_HOST_BACKUP_POLICY_CREATE:
      result = PathEnum.CLOUD_HOST_BACKUP_POLICY_LIST
      break
    // 裸金属服务器
    case JumpEnum.BARE_METAL_SERVER_CREATE:
      result = PathEnum.BARE_METAL_SERVER_LIST
      break
    // 弹性伸缩带宽
    case JumpEnum.ELASTIC_FLEX_BANDWIDTH_CREATE:
    case JumpEnum.ELASTIC_FLEX_BANDWIDTH_DETAIL:
      result = PathEnum.ELASTIC_FLEX_BANDWIDTH_LIST
      break
    // 弹性伸缩实例
    case JumpEnum.ELASTIC_FLEX_GROUP_CREATE:
    case JumpEnum.ELASTIC_FLEX_GROUP_DETAIL:
    case JumpEnum.ELASTIC_FLEX_POLICY_DETAIL:
    case JumpEnum.ELASTIC_FLEX_CONFIG_CREATE:
      result = PathEnum.ELASTIC_FLEX_INSTANCE_LIST
      break
    // 云硬盘备份策略
    case JumpEnum.CLOUD_DISK_BACKUP_POLICY_CREATE:
      result = PathEnum.CLOUD_DISK_BACKUP_POLICY_LIST
      break
    // 云硬盘快照
    case JumpEnum.CLOUD_DISK_SNAPSHOT_CREATE:
      result = PathEnum.CLOUD_DISK_SNAPSHOT_LIST
      break
    // 云硬盘备份存储库
    case JumpEnum.CLOUD_DISK_BACKUP_STORAGE_CREATE:
    case JumpEnum.CLOUD_DISK_BACKUP_STORAGE_DETAIL:
    case JumpEnum.CLOUD_DISK_BACKUP_STORAGE_EXPAND:
    case JumpEnum.CLOUD_DISK_BACKUP_STORAGE_REDUCE:
    case JumpEnum.CLOUD_DISK_BACKUP_STORAGE_TRANSFORM:
      result = PathEnum.CLOUD_DISK_BACKUP_STORAGE_LIST
      break
    // VPC
    case JumpEnum.VPC_CREATE:
    case JumpEnum.VPC_DETAIL:
      result = PathEnum.VPC_LIST
      break
    // 子网
    case JumpEnum.SUBNET_DETAIL:
      result = PathEnum.SUBNET_LIST
      break
    // 路由表
    case JumpEnum.ROUTE_TABLE_DETAIL:
      result = PathEnum.ROUTE_TABLE_LIST
      break
    // 对等连接
    case JumpEnum.PEER_CONNECTION_DETAIL:
      result = PathEnum.PEER_CONNECTION_LIST
      break
    // 弹性网卡
    case JumpEnum.ELASTIC_NET_CARD_DETAIL:
      result = PathEnum.ELASTIC_NET_CARD_LIST
      break
    // 弹性IP
    case JumpEnum.EIP_CREATE:
    case JumpEnum.EIP_DETAIL:
    case JumpEnum.EIP_EDIT:
    case JumpEnum.EIP_RENEW:
      result = PathEnum.EIP_LIST
      break
    // 共享带宽
    case JumpEnum.SHARE_BANDWIDTH_CREATE:
    case JumpEnum.SHARE_BANDWIDTH_DETAIL:
    case JumpEnum.SHARE_BANDWIDTH_CHANGE:
      result = PathEnum.SHARE_BANDWIDTH_LIST
      break
    // 负载均衡
    case JumpEnum.ELB_CREATE:
    case JumpEnum.ELB_DETAIL:
    case JumpEnum.ELB_ADD_LISTENER:
    case JumpEnum.ELB_EDIT_BANDWIDTH:
      result = PathEnum.ELB_LIST
      break
    // ACL
    case JumpEnum.ACL_DETAIL:
      result = PathEnum.ACL_LIST
      break
    //后端服务器组
    case JumpEnum.ELB_SERVER_GROUP_CREATE:
    case JumpEnum.ELB_SERVER_GROUP_DETAIL:
      result = PathEnum.ELB_SERVER_GROUP_LIST
      break
    //安全组
    case JumpEnum.SAFE_GROUP_DETAIL:
      result = PathEnum.SAFE_GROUP_LIST
      break
    // 对象存储
    case JumpEnum.BUCKET_CREATE:
    case JumpEnum.BUCKET_DETAIL:
      result = PathEnum.BUCKET_LIST
      break
    // 弹性文件
    case JumpEnum.ELASTIC_FILE_CREATE:
    case JumpEnum.ELASTIC_FILE_DETAIL:
      result = PathEnum.ELASTIC_FILE_LIST
      break
    //IP地址组
    case JumpEnum.IP_ADDRESS_GROUP_DETAIL:
      result = PathEnum.IP_ADDRESS_GROUP_LIST
      break
    //公网域名
    case JumpEnum.MANAGE_ANALYZE:
    case JumpEnum.BATCH_OPERATE:
      result = PathEnum.PUBLIC_NET_DOMAIN_NAME_LIST
      break
    //公有网络
    case JumpEnum.PUBLIC_NETWORK_CREATE:
      result = PathEnum.PUBLIC_NETWORK_LIST
      break
    //二层网络
    case JumpEnum.LAYER_TWO_NETWORK_CREATE:
      result = PathEnum.LAYER_TWO_NETWORK_LIST
      break
    //管理网络
    case JumpEnum.MANAGE_NETWORK_CREATE:
    case JumpEnum.MANAGE_NETWORK_DETAIL:
      result = PathEnum.MANAGE_NETWORK_LIST
      break
    //路由器规格
    case JumpEnum.ROUTER_SPEC_CREATE:
    case JumpEnum.ROUTER_SPEC_DETAIL:
      result = PathEnum.ROUTER_SPEC_LIST
      break
    //VPC路由器
    case JumpEnum.VPC_ROUTER_CREATE:
    case JumpEnum.VPC_ROUTER_DETAIL:
      result = PathEnum.VPC_ROUTER_LIST
      break
    // 任务
    case JumpEnum.TASK_DETAIL:
      result = PathEnum.TASK_LIST
      break
    default:
      result = path
      break
  }

  return result
}

// 资源中心列表菜单
const PathEnum = {
  CLOUD_HOST_LIST: '/multi-cloud/cloud-host/list', // 云主机
  CLOUD_DISK_LIST: '/multi-cloud/cloud-disk/list', // 云硬盘
  MIRROR_SERVE_LIST: '/multi-cloud/mirror-serve/index', // 镜像服务
  CLOUD_HOST_BACKUP_LIST: '/multi-cloud/cloud-host-backup/index', // 云主机备份
  CLOUD_HOST_BACKUP_POLICY_LIST: '/multi-cloud/cloud-backup-policy/list', // 云主机备份策略
  BARE_METAL_SERVER_LIST: '/multi-cloud/bare-metal-server/list', // 裸金属服务器
  ELASTIC_FLEX_BANDWIDTH_LIST: '/multi-cloud/elastic-flex-bandwidth/list', // 弹性伸缩带宽
  ELASTIC_FLEX_INSTANCE_LIST: '/multi-cloud/elastic-flex-instance/index', // 弹性伸缩实例
  CLOUD_DISK_BACKUP_POLICY_LIST: '/multi-cloud/disk-backup-policy/list', // 云硬盘备份策略
  CLOUD_DISK_SNAPSHOT_LIST: '/multi-cloud/cloud-disk-snapshot/list', // 云硬盘快照
  CLOUD_DISK_BACKUP_LIST: '/multi-cloud/cloud-disk-backup/index', // 云硬盘备份
  CLOUD_DISK_BACKUP_STORAGE_LIST: '/multi-cloud/cloud-disk-backup/index', // 云硬盘备份存储库
  VPC_LIST: '/multi-cloud/vpc/list', // VPC
  SUBNET_LIST: '/multi-cloud/subnet/list', // 子网
  ROUTE_TABLE_LIST: '/multi-cloud/route-table/list', // 路由表
  PEER_CONNECTION_LIST: '/multi-cloud/peer-connection/list', // 对等连接
  ELASTIC_NET_CARD_LIST: '/multi-cloud/elastic-net-card/list', //  弹性网卡
  EIP_LIST: '/multi-cloud/elastic-ip/list', // 弹性IP
  SHARE_BANDWIDTH_LIST: '/multi-cloud/share-bandwidth/list', // 共享带宽
  ELB_LIST: '/multi-cloud/elb/list', // 负载均衡
  SAFE_GROUP_LIST: '/multi-cloud/safe-group/list', // 安全组
  ACL_LIST: '/multi-cloud/acl/list', // acl
  BUCKET_LIST: '/multi-cloud/object-storage/bucket/list', // 桶列表
  ELASTIC_FILE_LIST: '/multi-cloud/elastic-file/list', // 弹性文件系统
  ELB_SERVER_GROUP_LIST: '/multi-cloud/elb-server-group/list', // 后端服务器组列表
  IP_ADDRESS_GROUP_LIST: '/multi-cloud/ip-address-group/list', // ip地址组
  PUBLIC_NET_DOMAIN_NAME_LIST: '/multi-cloud/public-net-domain-name/list', // 公网域名列表
  PUBLIC_NETWORK_LIST: '/multi-cloud/public-network/list', // 公有网络列表
  LAYER_TWO_NETWORK_LIST: '/multi-cloud/layer-two-network/list', // 二层网络列表
  MANAGE_NETWORK_LIST: '/multi-cloud/manage-network/list', // 管理网络列表
  ROUTER_SPEC_LIST: '/multi-cloud/router-specification/list', // 路由器规格列表
  VPC_ROUTER_LIST: '/multi-cloud/vpc-router/list', // 路由器规格列表
  TASK_LIST: '/multi-cloud/task/list' // 任务列表
}

// 资源中心跳转菜单
const JumpEnum = {
  CLOUD_HOST_CREATE: '/multi-cloud/cloud-host/create', // 云主机创建
  CLOUD_HOST_DETAIL: '/multi-cloud/cloud-host/detail', // 云主机详情
  CLOUD_DISK_CREATE: '/multi-cloud/cloud-disk/create', // 云硬盘创建
  CLOUD_DISK_EXPAND: '/multi-cloud/cloud-disk/expand', // 云硬盘扩容
  CLOUD_DISK_DETAIL: '/multi-cloud/cloud-disk/detail', // 云硬盘详情
  MIRROR_SERVE_PRIVATE_CREATE: '/multi-cloud/mirror-serve/private/create', // 私有镜像创建
  MIRROR_SERVE_PRIVATE_DETAIL: '/multi-cloud/mirror-serve/private/detail', // 私有镜像详情
  CLOUD_HOST_BACKUP_STORAGE_CREATE:
    '/multi-cloud/cloud-host-backup-storage/create', // 云主机备份存储库创建
  CLOUD_HOST_BACKUP_STORAGE_DETAIL:
    '/multi-cloud/cloud-host-backup-storage/detail', // 云主机备份存储库详情
  CLOUD_HOST_BACKUP_STORAGE_EXECUTE:
    '/multi-cloud/cloud-host-backup-storage/execute-backup', // 云主机备份存储库执行备份
  CLOUD_HOST_BACKUP_POLICY_CREATE: '/multi-cloud/cloud-backup-policy/create', // 云主机备份策略创建
  BARE_METAL_SERVER_CREATE: '/multi-cloud/bare-metal-server/create', // 裸金属服务器购买
  ELASTIC_FLEX_BANDWIDTH_CREATE: '/multi-cloud/elastic-flex-bandwidth/create', // 弹性伸缩带宽创建
  ELASTIC_FLEX_BANDWIDTH_DETAIL: '/multi-cloud/elastic-flex-bandwidth/detail', // 弹性伸缩带宽详情
  ELASTIC_FLEX_GROUP_CREATE: '/multi-cloud/elastic-flex-group/create', // 弹性伸缩组创建
  ELASTIC_FLEX_GROUP_DETAIL: '/multi-cloud/elastic-flex-group/detail', // 弹性伸缩组详情
  ELASTIC_FLEX_POLICY_DETAIL: '/multi-cloud/elastic-flex-policy/detail', // 伸缩策略详情
  ELASTIC_FLEX_CONFIG_CREATE: '/multi-cloud/elastic-flex-config/create', // 伸缩配置创建
  CLOUD_DISK_BACKUP_POLICY_CREATE: '/multi-cloud/disk-backup-policy/create', // 云硬盘备份策略创建
  CLOUD_DISK_SNAPSHOT_CREATE: '/multi-cloud/cloud-disk-snapshot/create', // 云硬盘快照创建
  CLOUD_DISK_BACKUP_STORAGE_CREATE:
    '/multi-cloud/cloud-disk-backup-storage/create', // 云硬盘备份存储库创建
  CLOUD_DISK_BACKUP_STORAGE_DETAIL:
    '/multi-cloud/cloud-disk-backup-storage/detail', // 云硬盘备份存储库详情
  CLOUD_DISK_BACKUP_STORAGE_EXPAND:
    '/multi-cloud/cloud-disk-backup-storage/expand', // 云硬盘备份存储库扩容
  CLOUD_DISK_BACKUP_STORAGE_REDUCE:
    '/multi-cloud/cloud-disk-backup-storage/reduce', // 云硬盘备份存储库缩容
  CLOUD_DISK_BACKUP_STORAGE_TRANSFORM:
    '/multi-cloud/cloud-disk-backup-storage/transform', // 云硬盘备份存储库按需转包年包月
  VPC_CREATE: '/multi-cloud/vpc/create', // VPC创建
  VPC_DETAIL: '/multi-cloud/vpc/detail', // VPC详情
  SUBNET_DETAIL: '/multi-cloud/subnet/detail', // 子网详情
  ROUTE_TABLE_DETAIL: '/multi-cloud/route-table/detail', // 路由表详情
  PEER_CONNECTION_DETAIL: '/multi-cloud/peer-connection/detail', // 对等连接详情
  ELASTIC_NET_CARD_DETAIL: '/multi-cloud/elastic-net-card/detail', // 弹性网卡详情
  EIP_CREATE: '/multi-cloud/elastic-ip/create', // 弹性IP创建
  EIP_DETAIL: '/multi-cloud/elastic-ip/detail', // 弹性IP详情
  EIP_EDIT: '/multi-cloud/elastic-ip/edit', // 弹性IP修改带宽
  EIP_RENEW: '/multi-cloud/elastic-ip/renew', // 弹性IP续订
  SHARE_BANDWIDTH_CREATE: '/multi-cloud/share-bandwidth/create', // 共享带宽创建
  SHARE_BANDWIDTH_CHANGE: '/multi-cloud/share-bandwidth/change', // 共享带宽修改
  SHARE_BANDWIDTH_DETAIL: '/multi-cloud/share-bandwidth/detail', // 共享带宽详情
  ELB_CREATE: '/multi-cloud/elb/create', // 负载均衡创建
  ELB_DETAIL: '/multi-cloud/elb/detail', // 负载均衡详情
  ELB_ADD_LISTENER: '/multi-cloud/elb/add-listener', // 添加监听器
  ELB_EDIT_BANDWIDTH: '/multi-cloud/elb/edit-bandwidth', // 修改带宽
  SAFE_GROUP_DETAIL: '/multi-cloud/safe-group/detail', // 安全组详情
  ACL_DETAIL: '/multi-cloud/acl/detail', // acl详情
  BUCKET_CREATE: '/multi-cloud/object-storage/bucket/create', // 创建桶
  BUCKET_DETAIL: '/multi-cloud/object-storage/bucket/detail', // 桶详情
  ELASTIC_FILE_CREATE: '/multi-cloud/elastic-file/create', // 弹性文件系统创建
  ELASTIC_FILE_DETAIL: '/multi-cloud/elastic-file/detail', // 弹性文件系统详情
  ELB_SERVER_GROUP_CREATE: '/multi-cloud/elb-server-group/create', // 创建后端服务器组
  ELB_SERVER_GROUP_DETAIL: '/multi-cloud/elb-server-group/detail', // 创建后端服务器组
  IP_ADDRESS_GROUP_DETAIL: '/multi-cloud/ip-address-group/detail', // ip地址组详情
  MANAGE_ANALYZE: '/multi-cloud/dns/manage-analyze', // （公网域名）管理解析
  BATCH_OPERATE: '/multi-cloud/dns/batch-operate', // （公网域名）批量操作
  PUBLIC_NETWORK_CREATE: '/multi-cloud/public-network/create', // 公有网络列表
  LAYER_TWO_NETWORK_CREATE: '/multi-cloud/layer-two-network/create', // 二层网络列表
  MANAGE_NETWORK_CREATE: '/multi-cloud/manage-network/create', // 管理网络创建
  MANAGE_NETWORK_DETAIL: '/multi-cloud/manage-network/detail', // 管理网络详情
  ROUTER_SPEC_CREATE: '/multi-cloud/router-specification/create', // 路由器规格创建
  ROUTER_SPEC_DETAIL: '/multi-cloud/router-specification/detail', // 路由器规格创建
  VPC_ROUTER_CREATE: '/multi-cloud/vpc-router/create', // vpc路由器创建
  VPC_ROUTER_DETAIL: '/multi-cloud/vpc-router/detail', // vpc路由器详情
  TASK_DETAIL: '/multi-cloud/task/detail' // 任务详情
}
