export const shareConStatus: { [key: string]: any } = {
  Initial: '申请中',
  Approved: '审批通过',
  Allocating: '正在分配资源',
  Allocated: '接入施工中',
  Confirmed: '等待用户确认',
  Enabled: '已开通',
  Rejected: '申请被拒绝',
  Canceled: '已取消',
  'Allocation Failed': '资源分配失败',
  Terminated: '已终止'
}

export const loaStatusFormat: { [key: string]: any } = {
  Applying: 'LOA 申请中',
  Accept: 'LOA 申请通过',
  Available: 'LOA 可用',
  Rejected: 'LOA 申请驳回',
  Completing: '专线施工中',
  Complete: '专线施工完成',
  Deleted: 'LOA 已删除'
}

export const portStatusFormat: { [key: string]: any } = {
  Initial: '申请中',
  Approved: '审批通过',
  Allocating: '正在分配资源',
  Allocated: '接入施工中',
  Confirmed: '等待用户确认',
  Enabled: '已开通',
  Rejected: '申请被拒绝',
  Canceled: '已取消',
  'Allocation Failed': '资源分配失败',
  Terminated: '已终止'
}

export const awsStatusFormat: { [key: string]: any } = {
  requested: '请求中',
  pending: '初始化中',
  available: '已启动',
  down: '已关闭',
  deleting: '删除中',
  deleted: '已删除',
  unknown: '不可用'
}
