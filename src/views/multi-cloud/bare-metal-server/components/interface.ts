import { IHooksOptions } from '@/hooks/interface'
export interface IHooksBasic {
  regionList?: any[]
  billingModeList?: any[]
  availableZoneList? : any[]
  instanceList?: any[]
  subsceneList?: any[]
  sceneList?: any[]
  cpuArchitectureList?: any[]
  specsTypeList?: any[]
  instanceSpecsList?: any[]
  mirrorTypeList?: any[]
  systemList?: any[]
  mirrorList?: any[]
  systemDiskList?: any[]
  dataDiskList?: any[]
  dataDiskQuota?: number
  filter?: any
  tableState?: IHooksOptions
  // form?: any
}

export interface IHooksNetwork {
  vpcList?: any[]
  subnetList?: any[]
  expandSubnetList?: any[]
  networkCardList?: any[]
  enhanceCardList?: any[]
  ipGenerateList?: any[]
  safeGroupList?: any[]
  mergeData?: any[]
  lineList?: any[]
  exitEipList?: any[]
  bandwidthTypeList?: any[]
  flowBandWidthList?: any[]
  bandWidthList?: any[]
  shareBandwidth?: any[]
  tableState?: IHooksOptions
  form?: any
}

export interface IHooksHigh {
  loginCredentialsList?: any[]
  keyPairList?: any[]
  form?: any
}
