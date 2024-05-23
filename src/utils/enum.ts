/**
 * 通用枚举
 */
// 全局事件总线(注: 组件销毁时记得取消事件订阅)
export enum EmitsEnum {
  CHBChangeBillingMode = 'cloudHostBackupChangeBillingMode', // 云主机备份修改计费模式(CHB: cloud-host-backup) 实在不知道该怎么取名好了就用这简称,有合适的可以帮忙改了🫡
  CDBChangeBillingMode = 'cloudDiskBackupChangeBillingMode', // 云硬盘备份修改计费模式(CDB: cloud-disk-backup)
  HandleSuccess = 'clickSuccessEvent' // 成功点击事件
}
// 确认和取消事件
export enum EventEnum {
  cancel = 'clickCancelEvent',
  success = 'clickSuccessEvent',
  close = 'clickCloseEvent',
  refresh = 'clickRefreshEvent'
}
// ip类型
export enum IpVersionEnum {
  ipv4 = 'Ipv4',
  ipv6 = 'Ipv6'
}
// 计费类型
export enum BillingEnum {
  PACKAGE = 'PACKAGE', // 包年包月
  ON_DEMAND = 'ON_DEMAND' // 按需
}
// 搜索框类型
export enum SearchTypeEnum {
  select, // 下拉框选择搜索
  title // 内容标题搜索
}
// 搜索框筛选条件类型
export enum FiltrateEnum {
  date = 'datePicker',
  list = 'tableList',
  checkBox = 'checkBox',
  input = 'input',
  treeSelect = 'treeSelect'
}
// 分页类型
export enum PaginationTypeEnum {
  total, // 只显示总数
  totalSizes, // 显示总数和分页大小
  totalJump, // 显示总数和跳转
  sizes, // 分页大小
  sizesJump, // 显示分页大小和跳转
  jump, // 跳转
  all
}
// 更多操作下拉框类型
export enum MoreOperateEnum {
  dropdown, // 下拉菜单
  cascaderPanel // 级联面板
}
// 操作事件枚举
export enum OperateEventEnum {
  add, //添加
  create, // 创建
  apply, // 申请
  delete, // 删除
  release, //释放
  clear, // 清除
  destroy, // 销毁
  open, // 开启
  close, // 关闭
  mount, // 挂载
  uninstall, // 卸载
  bind, // 绑定
  unbind, // 解绑
  powerOn, // 开机
  shutdown, //关机
  reboot, // 重启
  hangUp, // 挂起
  variation, // 变配
  expand, // 扩容
  renew, // 续订
  upgrade, // 升级
  reduce, // 降低
  unsubscribe, // 退订
  adjust, // 调整
  associate, // 关联
  autoBind, // 自动绑定
  forward, // 向前
  backwards, // 向后
  batch, //批量
  change, // 修改更新
  check, // 查看
  config, //配置
  copy, // 复制
  edit, // 编辑
  import, // 导入
  export, // 导出
  reset, // 重置
  sync, // 同步
  recover, // 恢复
  install, // 安装脚本
  monitor, // 监控
  replace, // 更换
  immediate, // 立即
  enable, // 启用
  forbidden, // 禁用
  share, // 共享
  refuse, // 拒绝
  refused, // 已拒绝
  upload, // 上传
  download, // 下载
  detail, // 详情
  remove, // 移除
  shiftIn, // 移入
  shiftOut, // 移出
  openIpv6, //开启Ipv6转换
  closeIpv6, //关闭Ipv6转换
  oneKey // 一键放通(华为云特有功能)
}

//资源类型(资源进行标签管理操作时需传资源类型resourceTypeCode字段)
export enum resourceTypeEnum {
  ECS = 'ECS', //云主机
  EBS = 'EBS', //云硬盘
  CBR = 'CBR', //云备份
  BMS = 'BMS', //裸金属,
  VPC = 'VPC', //虚拟私有云
  EIP = 'EIP', //弹性ip
  SUBNET = 'SUBNET', //子网,
  IMAGE = 'IMAGE', //镜像
  SECURITY_GROUP = 'SECURITY_GROUP', //安全组
  VIP = 'VIP', //虚拟ip
  ELB = 'ELB', //负载均衡
  BANDWIDTH = 'BANDWIDTH', //共享带宽
  PEERING = 'PEERING', //对等连接
  ROUTE_TABLE = 'ROUTE_TABLE', //路由表
  VOLUME_BACKUP = 'VOLUME_BACKUP', //云盘备份
  VOLUME_SNAPSHOT = 'VOLUME_SNAPSHOT', //云盘快照
  INSTANCE_SNAPSHOT = 'INSTANCE_SNAPSHOT', //云主机快照
  INSTANCE_BACKUP = 'INSTANCE_BACKUP' //云主机备份
}
