import service from '@/utils/request'
import { bpm } from '../prefix'

/**
 * 配置
 */

// 配置-列表
export const bpmConfigListUrl = bpm + `/config/base/page`
export const bpmConfigListApi = (params: any) => {
  return service.get(bpmConfigListUrl, { params })
}
// 配置-新增编辑
export const bpmConfigAddApi = (data: any) => {
  return service.post(bpm + `/config/base/`, { ...data })
}
// 配置-删除
export const bpmConfigDeleteApi = ({ id }: any) => {
  return service.delete(bpmConfigListUrl + id)
}

// 配置-设置vdc
export const bpmConfigSetVdc = (data: any) => {
  return service.post(bpm + `/config/vdc/`, { ...data })
}

// 配置-查询vdc绑定的配置
export const bpmConfigByVdc = ({ id }: any) => {
  return service.get(bpm + `/config/vdc/` + id)
}
