export const nextTypeList = [
  { label: '弹性云服务器', value: 'ECS' },
  { label: '网卡', value: 'ENI' },
  { label: '虚拟IP', value: 'VIP' },
  { label: 'NAT网关', value: 'NAT' },
  { label: '对等连接', value: 'PEERING' },
  { label: '虚拟专用网络', value: 'VPN' },
  { label: '云专线', value: 'DC' },
  { label: '云连接', value: 'CC' },
  { label: 'VPC终端节点', value: 'EGW' },
  { label: '企业路由器', value: 'ER' }
]

export const destinationTypeList = [{ label: 'IP地址', value: 'ipAddress' }]

export const nextTypeText: any = {
  ECS: '弹性云服务器',
  ENI: '网卡',
  VIP: '虚拟IP',
  NAT: 'NAT网关',
  PEERING: '对等连接',
  VPN: '虚拟专用网络',
  DC: '云专线',
  CC: '云连接',
  EGW: 'VPC终端节点',
  ER: '企业路由器'
}

interface nextProps {
  nextHop?: string
  nextHopName?: string
}
export const getNextHop = (item: any) => {
  let nextObj: nextProps = {}
  if (Array.isArray(item.nextHop)) {
    nextObj.nextHop = item.nextHop[1]
    nextObj.nextHopName = `${item.nextHop[0]}(${item.nextHop[1]})`
  } else {
    nextObj.nextHop = item.nextHop
    nextObj.nextHopName = item.nextHopName
  }
  return nextObj
}
