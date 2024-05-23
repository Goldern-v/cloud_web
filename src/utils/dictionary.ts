// 规格类型
export const specTypeDic: { [key: string]: any } = {
  normal: '通用计算型',
  entry: '通用入门型',
  entry_t7: '通用入门型',
  entry_smb: '通用入门型',
  cpuv1: '计算I型',
  cpuv2: '计算II型',
  computingv3: '通用计算增强型',
  kunpeng_computing: '鲲鹏通用计算增强型',
  kunpeng_highmem: '鲲鹏内存优化型',
  highmem: '内存优化型',
  saphana: '大内存型',
  diskintensive: '磁盘增强型',
  highio: '超高I/O型',
  ultracpu: '超高性能计算型',
  gpu: 'GPU加速型',
  fpga: 'FPGA加速型',
  ascend: 'AI加速'
}
//磁盘类型
export const diskTypeDic: { [key: string]: any } = {
  SAS: '高IO',
  SSD: '超高IO',
  GPSSD: '通用型SSD',
  ESSD: '极速IO',
  GPSSD2: '通用型SSD V2',
  SATA: '普通IO'
}

// 资源状态值
export const RESOURCE_STATUS: { [key: string]: any } = {
  CREATE_ING: '正在创建',
  DELETE_ING: '正在删除',
  DELETE: '已删除',
  UNSUBSCRIBE_ING: '正在退订',
  UPGRADE_ING: '正在变配',
  RENEW_SUBSCRIBE_ING: '正在续订',
  RECYCLE_ING: '正在进入回收站',
  RECOVER_ING: '正在恢复中',
  MIGRATE_ING: '正在迁移',
  REBUILD_ING: '正在重装',
  MOUNT_ING: '正在挂载',
  MOUNT: '已挂载',
  UNMOUNT_ING: '正在卸载',
  STARTING_UP: '正在开机',
  SHUTDOWN_ING: '正在关机',
  SHUTDOWN: '关机',
  RESTARTING: '正在重启',
  RUNNING: '正在运行',
  SUSPEND_ING: '正在暂停中',
  SUSPEND: '暂停',
  AVAILABLE: '可用',
  IN_USE: '正在使用',
  BIND: '已绑定',
  UNBIND: '未绑定',
  BACKUP_ING: '正在备份',
  FREEZE: '冻结',
  ENABLE: '已启用',
  DISABLE: '已禁用',
  ERROR: '异常',
  RECYCLED: '回收站中',
  UNDEFINED: '未知状态',
  SHARE_ING: '共享中',
  UN_SHARE: '取消共享中',
  WAITING: '等待',
  ACCEPTED: '接受',
  REJECTED: '拒绝',
  ACTIVATE: '激活',
  OFF: '关闭',
  NORMAL: '正常',
  OPEN: '开启 ',
  CLOSE: '关闭',
  ERROR_CLOSE: '异常关闭',
  SYNCING: '同步中',
  FAIL: '失败'
}
// 状态需显示的图标
export const RESOURCE_STATUS_ICON: { [key: string]: any } = {
  CREATE_ING: 'loading',
  DELETE_ING: 'loading',
  DELETE: 'status-error',
  UNSUBSCRIBE_ING: 'loading',
  UPGRADE_ING: 'loading',
  RENEW_SUBSCRIBE_ING: 'loading',
  RECYCLE_ING: 'loading',
  RECOVER_ING: 'loading',
  MIGRATE_ING: 'loading',
  REBUILD_ING: 'loading',
  MOUNT_ING: 'loading',
  MOUNT: 'status-success',
  UNMOUNT_ING: 'loading',
  STARTING_UP: 'loading',
  SHUTDOWN_ING: 'loading',
  SHUTDOWN: 'status-error',
  RESTARTING: 'loading',
  RUNNING: 'status-success',
  SUSPEND_ING: 'loading',
  SUSPEND: 'status-time',
  AVAILABLE: 'status-success',
  IN_USE: 'status-success',
  BIND: 'status-success',
  UNBIND: 'status-error',
  BACKUP_ING: 'loading',
  FREEZE: 'status-exception',
  ENABLE: 'status-success',
  DISABLE: 'status-error',
  ERROR: 'status-exception',
  RECYCLED: 'status-exception',
  UNDEFINED: 'status-exception',
  SHARE_ING: 'status-success',
  UN_SHARE: 'status-error',
  WAITING: 'loading',
  ACCEPTED: 'status-success',
  REJECTED: 'status-error',
  ACTIVATE: 'status-success',
  OFF: 'status-error',
  NORMAL: 'status-success',
  OPEN: 'status-success ',
  CLOSE: 'status-error',
  ERROR_CLOSE: 'status-error',
  SYNCING: 'loading',
  FAIL: 'status-error'
}
// 订单状态值
export const ORDER_STATUS_ICON: { [key: string]: any } = {
  APPROVE_STATUS_ING: 'loading', // 正在审批中
  APPROVE_STATUS_AGREE: 'status-success', // 审批通过
  APPROVE_STATUS_REJECT: 'status-error', // 审批未通过
  APPROVE_STATUS_NONE: 'status-success', // 无需审批
  ORDER_STATUS_CREATING: 'loading', // 创建中
  ORDER_STATUS_FINISH: 'status-success', // 已完成
  ORDER_STATUS_ERROR: 'status-exception', // 订单异常
  ORDER_STATUS_PAYING: 'loading',
  ORDER_STATUS_APPROVE: 'loading', //待审批
  ORDER_STATUS_CANCELED: 'status-error' //已取消
}
// VDC配额
export const quota: { [key: string]: any } = {
  CPU: 'cpu核数',
  MEMORY: '内存',
  BLOCK_STORAGE: '块存储',
  FILE_STORAGE: '文件存储',
  OBS_STORAGE: '对象存储',
  VM: '虚机数量',
  EIP: '弹性ip',
  VPC: '虚拟私有云',
  SUBNET: '子网'
}

// 资源创建地址
export const ResourceCreationApi: { [key: string]: any } = {
  ECS: '/api/instance/create', //云主机创建
  ECSRENEW: '/api/instance/renew', // // 云主机续订
  ECSTD: '/api/instance/unsubscribe', //云主机退订
  EBS: '/api/volume/provision', //云硬盘创建
  EBSRENEW: '/api/volume/renew', // 云硬盘续订
  EBSTD: '/api/volume/unsubscribe', //云硬盘退订
  CBR: '', //云备份
  BMS: '', //裸金属,
  VPC: '', //虚拟私有云
  EIP: '/api/eip/provision', //弹性ip创建
  EIPTD: '/api/eip/unsubscribe', //弹性ip退订
  EIP_RESIZE: '/api/eip/resize', //弹性ip变配(修改带宽)
  SUBNET: '', //子网,
  IMAGE: '', //镜像
  SECURITY_GROUP: '', //安全组
  VIP: '', //虚拟ip
  ELB: '', //负载均衡
  BANDWIDTH: '', //共享带宽
  PEERING: '', //对等连接
  ROUTE_TABLE: '', //路由表
  VOLUME_BACKUP: '', //云盘备份
  VOLUME_SNAPSHOT: '', //云盘快照
  INSTANCE_SNAPSHOT: '', //云主机快照
  INSTANCE_BACKUP: '' //云主机备份
}
// 资源创建名称和类型
export const ResourceCreationName: { [key: string]: any } = {
  ECS: '云主机订购',
  ECSRENEW: '云主机续订',
  ECSTD: '云主机退订',
  EBS: '云硬盘订购',
  EBSRENEW: '云硬盘续订',
  EBSTD: '云硬盘退订',
  CBR: '云备份',
  BMS: '裸金属',
  VPC: '虚拟私有云',
  EIP: '弹性IP订购',
  EIPTD: '弹性IP退订',
  EIP_RESIZE: '弹性IP变配',
  SUBNET: '子网',
  IMAGE: '镜像',
  SECURITY_GROUP: '安全组',
  VIP: '虚拟ip',
  ELB: '负载均衡',
  BANDWIDTH: '共享带宽',
  PEERING: '对等连接',
  ROUTE_TABLE: '路由表',
  VOLUME_BACKUP: '云盘备份',
  VOLUME_SNAPSHOT: '云盘快照',
  INSTANCE_SNAPSHOT: '云主机快照',
  INSTANCE_BACKUP: '云主机备份'
}

//网卡类型
export const NicTypeDic: { [key: string]: any } = {
  MAIN_CARD: '主弹性网卡',
  EXTEND_CARD: '扩展网卡',
  BACKUP_CARD: '辅助弹性网卡'
}
