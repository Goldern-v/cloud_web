import type { IdealTableColumnHeaders } from '@/types'
import { ElMessage } from 'element-plus/es'
import type { FormInstance, FormRules } from 'element-plus'
import { nameRuleThree } from '@/utils/validate'
import { vdcTreeList } from '@/api/java/public'
import {
  expenseTypeList,
  queryCloudPlatformList,
  resourcePoolSelect,
  addOptimizeStrategy,
  editOptimizeStrategy
} from '@/api/java/operate-center'
import {
  queryProjectListApi,
  getUserBasedOnVdc,
  getUserBasedOnProject
} from '@/api/java/business-center'

export const createData = () => {
  const tableHeaders: IdealTableColumnHeaders[] = [
    { label: '负载指标', prop: 'optimizingStrategyType', useSlot: true },
    { label: '阈值', prop: 'thresholdValue', useSlot: true },
    { label: '时间维度', prop: 'timeDimension', useSlot: true }
  ]
  //影响程度
  const degreeGrade: any = [
    { label: '低', value: 'LOW' },
    { label: '中', value: 'MIDDLE' },
    { label: '高', value: 'HIGH' },
    { label: '最高', value: 'HIGHEST' }
  ]
  //指标名称
  const indexList: any = [
    { label: 'CPU使用率', value: 'CPU_USAGE_RATE' },
    { label: '内存使用率', value: 'MEMORY_USAGE_RATE' },
    { label: '磁盘使用率', value: 'DISK_USAGE_RATE' },
    { label: '网络流入速率', value: 'NETWORK_FLOW_IN_RATE' },
    { label: '网络流出速率', value: 'NETWORK_FLOW_OUT_RATE' }
  ]
  //比较值
  const compareValues: any = [
    { label: '最大值', value: 'MAX_VALUE' },
    { label: '最小值', value: 'MIN_VALUE' },
    { label: '平均值', value: 'AVG_VALUE' }
  ]
  //比较方法
  const compareMethods: any = [
    { label: '大于', value: 'GREATER_THAN_SIGN' },
    { label: '大于等于', value: 'GREATER_THAN_EQUAL_SIGN' },
    { label: '小于', value: 'LESS_THAN_SIGN' },
    { label: '小于等于', value: 'LESS_THAN_EQUAL_SIGN' },
    { label: '等于', value: 'EQUAL_SIGN' }
  ]
  //时间维度
  const timeList: any = [
    { label: '1个小时', value: 1 },
    { label: '4个小时', value: 4 },
    { label: '12个小时', value: 12 },
    { label: '24个小时', value: 24 },
    { label: '3天', value: 72 },
    { label: '5天', value: 120 },
    { label: '7天', value: 168 }
  ]
  //作用维度
  const allDimension: any = [
    { label: '资源池', value: 'POOL_RESOURCE' },
    { label: 'VDC', value: 'VDC' },
    { label: '项目', value: 'PROJECT' }
  ]

  const suggestionList: any = [
    { label: '建议降配', value: 'DOWNSIZING' },
    { label: '建议升配', value: 'UPGRADING' },
    { label: '建议更换付费方式', value: 'CHANGE_BILL_MODE' },
    { label: '建议回收', value: 'RECYCLE' }
  ]
  const characterList: any = [] //角色

  //查询资源类型列表
  const resourceList: Ref<any[]> = ref([])
  const getExpenseType = () => {
    expenseTypeList()
      .then((res: any) => {
        const { code, data } = res
        if (code === 200) {
          resourceList.value = data
        } else {
          resourceList.value = []
        }
      })
      .catch(_ => {
        resourceList.value = []
      })
  }
  //查询云平台
  const platformList: any = ref([])
  const getCloudPlatformList = () => {
    queryCloudPlatformList()
      .then((res: any) => {
        const { code, data } = res
        if (code === 200) {
          platformList.value = data
        } else {
          platformList.value = []
        }
      })
      .catch(_ => {
        platformList.value = []
      })
  }
  //查询资源池
  const resourcePoolList: any = ref([])
  const getResourcePool = (params: any = {}) => {
    resourcePoolSelect(params)
      .then((res: any) => {
        const { code, data } = res
        if (code === 200) {
          resourcePoolList.value = data.filter((item: any) =>
            toRaw(platformRelevancePool.value).some(
              (ele: any) => ele.resourceBundleId === item.id
            )
          )
        } else {
          resourcePoolList.value = []
        }
      })
      .catch(_ => {
        resourcePoolList.value = []
      })
  }
  //查询vdc
  const vdcTree: Ref<any[]> = ref([])
  const defaultProps = {
    children: 'sons',
    label: 'name',
    value: 'id'
  }
  const getVdcTree = async () => {
    try {
      const res = await vdcTreeList()
      vdcTree.value = res.data.sons
      //编辑页面渲染vdc
      if (isEdit.value) {
        form.vdc =
          currentRow.value.scope === 'PROJECT'
            ? dimensionData.value.vdcId[0]
            : ''
        form.vdcMulti =
          currentRow.value.scope === 'VDC' ? dimensionData.value.vdcId : []
      }
    } catch (err: any) {
      ElMessage.error(err)
    }
  }
  //查询项目
  const projectList: any = ref([])
  const getProjectList = async (params: any) => {
    const res: any = await queryProjectListApi(params)
    if (res.code === 200) {
      const { data } = res
      projectList.value = data
      if (isEdit.value && currentRow.value.scope === 'PROJECT') {
        form.project = dimensionData.value.projectId || []
      }
    } else {
      projectList.value = []
    }
  }
  //查询用户
  const userList: any = ref([]) //用户
  //根据vdc筛选用户
  const getUserByVdc = async (id: any) => {
    const res: any = await getUserBasedOnVdc(id)
    if (res.code === 200) {
      const { data } = res
      userList.value = data
      form.user = isEdit.value ? currentRow.value.userId : ''
    } else {
      userList.value = []
    }
  }
  //根据项目筛选用户
  const getUserByProject = async (id: any) => {
    const res: any = await getUserBasedOnProject(id)
    if (res.code === 200) {
      const { data } = res
      userList.value = data
      form.user = isEdit.value ? currentRow.value.userId : ''
    } else {
      userList.value = []
    }
  }

  //查找单个 ID 对应的节点
  const findNodeById = (treeData: any, id: any) => {
    let result = null
    function traverse(nodes: any) {
      for (let node of nodes) {
        if (node.id === id) {
          result = node
          return
        }
        if (node.sons) {
          traverse(node.sons)
        }
      }
    }
    traverse(treeData)
    return result
  }

  const formRef = ref<FormInstance>()
  const form = reactive({
    name: '',
    description: '',
    resourceType: '', //资源类型
    influenceDegree: 'LOW', //影响程度
    enable: false,
    user: '',
    character: '',
    suggestion: '',
    duration: '', //资源停机超过时长
    dimension: 'POOL_RESOURCE', //维度
    platForm: '', //云平台单选
    resourcePool: [], //资源池
    vdcMulti: [], //vdc多选
    vdc: '', //vdc单选
    vdcName: '',
    project: []
  })

  const checkName = (rule: any, value: any, callback: (e?: Error) => any) => {
    if (!value.length) {
      callback(new Error('请填写名称，不可为空'))
    }
    nameRuleThree({ maxLength: 20, minLength: 1 }, value, callback)
  }
  const rules = reactive<FormRules>({
    name: [{ required: true, validator: checkName, trigger: 'blur' }],
    resourceType: [
      { required: true, message: '请选择资源池类型', trigger: 'change' }
    ],
    platForm: [{ required: true, message: '请选择云平台', trigger: 'change' }],
    resourcePool: [
      { required: true, message: '请选择资源池', trigger: 'change' }
    ],
    vdcMulti: [{ required: true, message: '请选择VDC', trigger: 'change' }],
    vdc: [{ required: true, message: '请选择VDC', trigger: 'change' }],
    project: [{ required: true, message: '请选择项目', trigger: 'change' }]
  })

  const route = useRoute()
  const isEdit = computed(() => route.query.type === 'edit') //是否编辑页面
  onMounted(() => {
    getExpenseType()
    console.log(isEdit)

    if (isEdit.value) {
      getEditData()
    }
  })

  const currentRow = ref<any>() // 行数据
  const dimensionData = ref<any>([]) //维度数据
  const getEditData = () => {
    currentRow.value = JSON.parse(route.query.data as any)
    dimensionData.value = currentRow.value.scopeDetail
      ? JSON.parse(currentRow.value.scopeDetail)
      : []
    const rowData = currentRow.value
    form.name = rowData.name
    form.description = rowData.remark
    form.resourceType = rowData.resourceType
    form.influenceDegree = rowData.incidenceType
    form.enable = rowData.enabled
    form.duration = rowData.resourceStopTimeout
    loadIndexData.value = rowData.optimizingStrategyItemsList
    form.dimension = rowData.scope
    form.suggestion = rowData.suggest
  }

  watch(
    () => form.dimension,
    dimension => {
      if (dimension === 'POOL_RESOURCE') {
        getCloudPlatformList()
      } else if (dimension === 'VDC' || dimension === 'PROJECT') {
        getVdcTree()
      }
    },
    { immediate: true }
  )
  const dimensionChange = () => {
    form.platForm = ''
    form.resourcePool = []
    form.vdcMulti = []
    form.vdc = ''
    form.project = []
    form.user = ''
  }

  const platformRelevancePool: any = ref([]) //平台所关联资源池
  watch(
    () => form.platForm,
    value => {
      if (value) {
        form.resourcePool = []
        platformRelevancePool.value = platformList.value.find(
          (item: any) => item.id === value
        ).cloudActResBundles
        getResourcePool()
      }
    },
    { immediate: true }
  )

  watch(
    () => form.resourcePool,
    resourcePool => {
      if (toRaw(resourcePool).length) {
        //根据所选资源池查询关联vdc信息,通过vdc去查询用户信息
        const arr: any = resourcePoolList.value.filter((item: any) =>
          toRaw(resourcePool).some((ele: any) => ele === item.id)
        )
        const vdcIds: any = [] //所选资源池关联的所有vdc的id
        arr.forEach((item: any) => {
          //判断关联vdc信息时候是否相同，不相同的情况下添加进去
          if (!vdcIds.some((ele: any) => ele === item.information.vdcId)) {
            vdcIds.push(item.information.vdcId)
          }
        })
        getUserByVdc(vdcIds.join(','))
      }
    },
    { immediate: true }
  )

  const vdcNode: any = [] //选中的vdc所在节点数据
  watch(
    () => [form.vdc, form.vdcMulti],
    ([vdc, vdcMulti]) => {
      if (form.dimension === 'VDC') {
        const arr: any = []
        form.vdcMulti.forEach((item: any) => {
          const node: any = findNodeById(vdcTree.value, item)
          arr.push(node)
        })
        vdcNode.value = arr
        if (toRaw(vdcMulti).length) {
          getUserByVdc(vdcMulti) //根据vdc去查用户
        }
      } else if (vdc && form.dimension === 'PROJECT') {
        const node: any = findNodeById(vdcTree.value, vdc)
        form.vdcName = node.name
        form.project = []
        getProjectList({
          vdcId: vdc
        }) //根据项目去查用户
      }
    },
    { immediate: true }
  )

  watch(
    () => form.project,
    project => {
      if (toRaw(project).length) {
        getUserByProject(project)
      }
    },
    { immediate: true }
  )

  //负载均衡指标
  const loadIndexData: any = ref([
    {
      optimizingStrategyType: '',
      operatorType: '',
      comparatorSign: '',
      thresholdValue: '',
      timeDimension: ''
    }
  ])
  //添加配置负载指标
  const clickAddIndex = () => {
    loadIndexData.value.push({
      optimizingStrategyType: '',
      operatorType: '',
      comparatorSign: '',
      thresholdValue: '',
      timeDimension: ''
    })
  }
  //删除配置负载指标
  const clickDeleteIndex = (index: number) => {
    loadIndexData.value.splice(index, 1)
  }

  //创建参数
  const getCreateParams = () => {
    const parentId: any = []
    const childrenId: any = []
    if (form.dimension === 'POOL_RESOURCE') {
      const platForm = platformList.value.filter(
        (item: any) => item.id === form.platForm
      )
      parentId.push({
        name: platForm[0].information.name,
        id: platForm[0].id
      })
      const resource = resourcePoolList.value.filter((item: any) =>
        form.resourcePool.some((ele: any) => ele === item.id)
      )
      resource.forEach((item: any) => {
        childrenId.push({
          name: item.information.name,
          id: item.id
        })
      })
    } else if (form.dimension === 'VDC') {
      vdcNode.value.forEach((item: any) => {
        parentId.push({
          name: item.name,
          id: item.id
        })
      })
    } else if (form.dimension === 'PROJECT') {
      parentId.push({
        name: form.vdcName,
        id: form.vdc
      })
      const project = projectList.value.filter((item: any) =>
        form.project.some((ele: any) => ele === item.id)
      )
      project.forEach((item: any) => {
        childrenId.push({
          name: item.name,
          id: item.id
        })
      })
    }

    const params = {
      name: form.name,
      resourceType: form.resourceType,
      incidenceType: form.influenceDegree,
      enabled: form.enable,
      resourceStopTimeout: form.duration,
      scope: form.dimension,
      userId: form.user,
      roleId: '',
      suggest: form.suggestion,
      remark: form.description,
      itemsList: toRaw(loadIndexData.value),
      scopeDto: {
        parentId,
        childrenId
      }
    }
    return params
  }

  //保存\取消
  const router = useRouter() // 路由
  const cancelForm = (formEl: FormInstance | undefined) => {
    if (!formEl) {
      return
    }
    formEl.resetFields()
    router.push({
      path: '/operate-center/expense-center/expense-optimize/list',
      query: {
        type: 'createReturn'
      }
    })
  }
  const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) {
      return
    }
    formEl.validate(valid => {
      if (valid) {
        if (isEdit.value) {
          const params = Object.assign(getCreateParams(), {
            id: currentRow.value.id
          })
          editOptimizeStrategy(params).then((res: any) => {
            const { code } = res
            if (code === 200) {
              ElMessage.success('更新优化策略成功')
              router.push({
                path: '/operate-center/expense-center/expense-optimize/list',
                query: {
                  type: 'createReturn'
                }
              })
            } else {
              ElMessage.error('更新优化策略失败')
            }
          })
        } else {
          const params = getCreateParams()
          addOptimizeStrategy(params).then((res: any) => {
            const { code } = res
            if (code === 200) {
              ElMessage.success('创建优化策略成功')
              router.push({
                path: '/operate-center/expense-center/expense-optimize/list',
                query: {
                  type: 'createReturn'
                }
              })
            } else {
              ElMessage.error('创建优化策略失败')
            }
          })
        }
      }
    })
  }

  return {
    tableHeaders,
    degreeGrade, //影响程度
    indexList, //负载指标
    compareValues, //比较值
    compareMethods, //比较方法
    timeList,
    allDimension, //所有维度
    resourceList, //资源类型
    platformList, //云平台
    resourcePoolList, //资源池
    vdcTree, //vdc数
    defaultProps, //vdc数的节点
    projectList, //项目
    userList, //用户
    characterList, //角色
    suggestionList,
    formRef,
    form,
    rules,
    clickAddIndex,
    clickDeleteIndex,
    loadIndexData,
    dimensionChange, //维度切换
    cancelForm,
    submitForm
  }
}
