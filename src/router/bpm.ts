/**
 * 流程管理路由
 */
export const bpmRouter = [
  {
    path: 'form/list',
    component: () => import('@/views/bpm/form/list.vue'),
    name: 'bpm-form-list',
    meta: { title: '流程表单', breadcrumb: ['运营中心', '流程配置', '流程管理', '流程表单'] }
  },
  {
    path: 'form/create',
    component: () => import('@/views/bpm/form/edit/edit.vue'),
    name: 'bpm-form-create',
    meta: { title: '流程表单新建', breadcrumb: ['运营中心', '流程配置', '流程管理', '流程表单新建'] }
  },
  {
    path: 'user-group/list',
    component: () => import('@/views/bpm/user-group/list.vue'),
    name: 'user-group-list',
    meta: { title: '用户分组' }
  },
  {
    path: 'task/my-process',
    component: () => import('@/views/bpm/task-my-process/list.vue'),
    name: 'my-process-list',
    meta: { title: '我的流程', breadcrumb: ['运营中心', '流程配置', '任务管理', '我的流程'] }
  },
  {
    path: 'task/my-process/create',
    component: () => import('@/views/bpm/task-my-process/create.vue'),
    name: 'my-process-create',
    meta: { title: '我的流程-新建', breadcrumb: ['运营中心', '流程配置', '任务管理', '我的流程-新建'] }
  },
  {
    path: 'task/my-process/detail',
    component: () => import('@/views/bpm/task-my-process/detail.vue'),
    name: 'my-process-detail',
    meta: { title: '我的流程-详情', breadcrumb: ['运营中心', '流程配置', '任务管理', '我的流程-详情'] }
  },
  {
    path: 'task/todo',
    component: () => import('@/views/bpm/task-todo/list.vue'),
    name: 'task-todo',
    meta: { title: '待办任务', breadcrumb: ['运营中心', '流程配置', '任务管理', '待办任务'] }
  },
  {
    path: 'task/done',
    component: () => import('@/views/bpm/task-done/list.vue'),
    name: 'task-done',
    meta: { title: '已办任务', breadcrumb: ['运营中心', '流程配置', '任务管理', '已办任务'] }
  },
  {
    path: 'model/list',
    component: () => import('@/views/bpm/model/list.vue'),
    name: 'model-list',
    meta: { title: '流程模型', breadcrumb: ['运营中心', '流程配置', '流程管理', '流程模型'] }
  },
  {
    path: 'model/taskAssignRule/list',
    component: () => import('@/views/bpm/model/views/taskAssignRule.vue'),
    name: 'taskAssignRule-list',
    meta: { title: '分配规则', breadcrumb: ['运营中心', '流程配置', '流程管理', '分配规则'] }
  },
  {
    path: 'model/processDefinition/list',
    component: () => import('@/views/bpm/model/views/processDefinition.vue'),
    name: 'processDefinition-list',
    meta: { title: '流程定义', breadcrumb: ['运营中心', '流程配置', '流程管理', '流程定义'] }
  },
  {
    path: 'model/edit',
    component: () => import('@/views/bpm/model/editor/index.vue'),
    name: 'BpmModelEditor',
    meta: { title: '设计流程', breadcrumb: ['运营中心', '流程配置', '流程管理', '设计流程'] }
  },
  {
    path: 'config/list',
    component: () => import('@/views/bpm/config/list.vue'),
    name: 'BpmConfigList',
    meta: { title: '配置列表', breadcrumb: ['运营中心', '流程配置', '配置管理'] }
  }
]

export const bpmMenu = () => {
  const pathData = ['bpm-manage']
  const clouds = pathData.map(name => {
    name = name.toLowerCase().includes('bpm') ? name : `${name}-manage`
    return {
      path: `/${name}`,
      component: () => import('../layout/index.vue'),
      meta: {
        title: name,
        role: ['admin', 'user']
      },
      children: bpmRouter
    }
  })
  return clouds
}
