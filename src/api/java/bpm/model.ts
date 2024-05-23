import service from '@/utils/request'
import { bpm } from '../prefix'

export const getModelPage = bpm + `/model/page`

export const getModel = async (id: string) => {
  return service.get(bpm + '/model/get?id=' + id)
}

export const updateModel = async (data: any) => {
  return service.put(bpm + `/model/update`, data)
}

// 任务状态修改
export const updateModelState = async (id: number, state: number) => {
  const data = {
    id: id,
    state: state
  }
  return service.put(bpm + `/model/update-state`, data)
}

export const createModel = async (data: any) => {
  return service.post(bpm + `/model/create`, data)
}

export const deleteModel = bpm + '/model/delete'

export const deployModel = async (id: number) => {
  return service.post(bpm + '/model/deploy?id=' + id)
}

export const getSimpleForm = async () => {
  return service.get(bpm + '/form/list-all-simple')
}

export const getProcessDefinitionPage = bpm + '/process-definition/page'
