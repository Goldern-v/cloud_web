import service from '@/utils/request'
import { FormVO, FormSearch } from '@/types/bpm-form'
import { bpm } from '../prefix'

/**
 * 流程表单API
 */

// 表单-列表
export const bpmFormListUrl = bpm + `/form/page`
export const bpmFormQueryList = (params: FormSearch) => {
  return service.get(bpm + `/form/page`, { params })
}

// 表单-详情
export const bpmFormQueryDetail = (params: FormSearch) => {
  return service.get(bpm + `/form/get`, { params })
}

// 表单-编辑
export const bpmFormUpdate = (data: FormVO) => {
  return service.put(bpm + `/form/update`, { ...data })
}

// 表单-新建
export const bpmFormCreate = (data: FormVO) => {
  return service.post(bpm + `/form/create`, { ...data })
}

// 表单-删除
export const bpmFormDeleteUrl = bpm + `/form/delete`
export const bpmFormDelete = (params: FormSearch) => {
  return service.get(bpm + `/form/delete`, { params })
}
