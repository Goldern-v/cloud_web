import service from '@/utils/request'
import { bpm } from '../prefix'

/**
 * 任务管理--我的流程API
 */

// 我的流程-列表
export const bpmMyprocessListUrl = bpm + `/process-instance/my-page`
export const bpmMyprocessQueryList = (params: any) => {
  return service.get(bpm + `/process-instance/my-page`, { params })
}

// 我的流程-详情-表单
export const bpmMyprocessForm = (params: any) => {
  return service.get(bpm + `/process-instance/get`, { params })
}

// 我的流程-详情-模型
export const bpmMyprocessModel = (params: any) => {
  return service.get(bpm + `/activity/list`, { params })
}

// 我的流程-详情-模型
export const bpmMyprocessModelXml = (params: any) => {
  return service.get(bpm + `/process-definition/get-bpmn-xml`, { params })
}

// 我的流程-详情-审批流程
export const bpmMyprocessApprove = (params: any) => {
  return service.get(bpm + `/task/list-by-process-instance-id`, {
    params
  })
}

// 我的流程-编辑
export const bpmMyprocessUpdate = (data: any) => {
  return service.put(bpm + `/form/update`, { ...data })
}

// 我的流程-新建
export const bpmMyprocessCreate = (data: any) => {
  return service.post(bpm + `/form/create`, { ...data })
}

// 我的流程-取消
export const bpmMyprocessCancel = (data: any) => {
  return service.delete(bpm + `/process-instance/cancel`, { data })
}

// 我的流程-删除
export const bpmMyprocessDeleteUrl = bpm + `/form/delete`
export const bpmMyprocessDelete = (params: any) => {
  return service.get(bpm + `/form/delete`, { params })
}

// 我的流程-新建流程列表
export const bpmMyprocessCreateList = bpm + `/process-definition/page`
export const bpmMyprocessSelectList = (params: any) => {
  return service.get(bpm + `/process-definition/list`, { params })
}

// 我的流程-流程审批-通过
export const bpmProcessApprovePass = (data: any) => {
  return service.put(bpm + `/task/approve`, { ...data })
}

// 我的流程-流程审批-拒绝
export const bpmProcessApproveReject = (data: any) => {
  return service.put(bpm + `/task/reject`, { ...data })
}

// 我的流程-发起流程
export const bpmProcessCreate = (data: any) => {
  return service.post(bpm + `/process-instance/create`, { ...data })
}

// 我的流程-转派流程
export const bpmProcessSend = (data: any) => {
  return service.put(bpm + `/task/update-assignee`, { ...data })
}

/**
 * 待办API
 */

// 我的流程-新建流程列表
export const bpmTodoListUrl = bpm + `/task/todo-page`
export const bpmTodoList = (params: any) => {
  return service.get(bpm + `/task/todo-page`, { params })
}

/**
 * 已办api
 */

// 我的流程-新建流程列表
export const bpmDoneListUrl = bpm + `/task/done-page`
export const bpmDoneList = (params: any) => {
  return service.get(bpm + `/task/done-page`, { params })
}

/**
 * 实例
 */
export const bpmProcessInstance = (params: any) => {
  return service.get(bpm + `/process-instance/getProcessInstanceId`, {
    params
  })
}
