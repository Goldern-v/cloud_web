export const replaceBpmPath = (path: string): string => {
  let result = ''
  switch (path) {
    // 流程表单
    case JumpEnum.BPM_MANAGE_FORM_CREATE:
      result = PathEnum.BPM_MANAGE_FORM_LIST
      break
    // 流程模型
    case JumpEnum.BPM_MANAGE_MODEL_CREATE:
    case JumpEnum.BPM_MANAGE_MODEL_TASK_ASSIGN_RULE:
    case JumpEnum.BPM_MANAGE_MODEL_PROCESS_DEFINITION:
      result = PathEnum.BPM_MANAGE_MODEL_LIST
      break
    // 我的流程
    case JumpEnum.BPM_MANAGE_TASK_MY_PROCESS_CREATE:
    case JumpEnum.BPM_MANAGE_TASK_MY_PROCESS_DETAIL:
      result = PathEnum.BPM_MANAGE_TASK_MY_PROCESS
      break
    default:
      result = path
      break
  }
  return result
}

// 流程
const PathEnum = {
  BPM_MANAGE_FORM_LIST: '/bpm-manage/form/list', // 流程表单
  BPM_MANAGE_MODEL_LIST: '/bpm-manage/model/list', // 流程模型
  BPM_MANAGE_TASK_MY_PROCESS: '/bpm-manage/task/my-process' // 我的流程
}

// 流程
const JumpEnum = {
  BPM_MANAGE_FORM_CREATE: '/bpm-manage/form/create', // 流程表单 新增
  BPM_MANAGE_MODEL_CREATE: '/bpm-manage/model/edit', // 设计流程
  BPM_MANAGE_MODEL_TASK_ASSIGN_RULE: '/bpm-manage/model/taskAssignRule/list', // 分配规则
  BPM_MANAGE_MODEL_PROCESS_DEFINITION: '/bpm-manage/model/processDefinition/list', // 流程定义
  BPM_MANAGE_TASK_MY_PROCESS_CREATE: '/bpm-manage/task/my-process/create', // 我的流程新建
  BPM_MANAGE_TASK_MY_PROCESS_DETAIL: '/bpm-manage/task/my-process/detail'
}
