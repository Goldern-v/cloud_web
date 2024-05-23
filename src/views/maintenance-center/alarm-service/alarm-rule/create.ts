import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { nameRuleThree } from '@/utils/validate'
import { IdealTableColumnHeaders } from '@/types'
import {
  getResourceTypeList,
  queryCreateRulesMonitoring,
  editCreateRulesMonitoring,
  getAlarmTemplateList,
  getContactGroupList
} from '@/api/java/maintenance-center'
import { handleMonitorReferAttr } from './components/common'
export const createData = () => {
  /*
   *表单
   */
  const formRef = ref<FormInstance>()
  const pastTimeRef = ref<any>()
  const predictedTimeRef = ref<any>(null)
  const exampleRef = ref<any>(null)
  const notificationRestrictionsRef = ref<any>(null)
  const limitationRef = ref<any>(null)
  const form = reactive({
    name: '',
    remark: '',
    resourceType: '', //资源类型
    range: 'ALL_INSTANCE', //资源范围
    instance: ref([]), //关联实例
    ruleSource: 'custom', //告警类型
    templateImport: '', //模板导入
    type: 'HISTORY', //告警类型
    enableNotification: false,
    noticeWay: ref([]), //通知方式
    group: '', //联系人组
    contacts: '', //联系人
    resourceUuids: [], //实例
    resourcePoolId: '', //资源池Id
    alarmContactGroup: [], //告警联系组
    effectTime: [] as any[], //生效时间
    templateRuleData: [] as any[] //模版规则
  })
  //  编辑回显
  const route = useRoute()
  const detailed: any = ref()
  const isEdit = route.query.type === 'edit'
  // 关联实例
  const instanceList = ref<any[]>([])
  // 监控指标
  const indicatorList = ref<any[]>([])

  //查询资源类型列表
  const resourceList = ref<any[]>([])
  const getExpenseType: any = () => {
    getResourceTypeList()
      .then((res: any) => {
        const { code, data } = res
        if (code === 200) {
          resourceList.value = data
          form.resourceType = data[0].code
          editEvent()
        } else {
          resourceList.value = []
        }
      })
      .catch(_ => {
        resourceList.value = []
      })
  }

  // 初始页面判断是否是编辑
  const editEvent = () => {
    if (isEdit) {
      detailed.value = JSON.parse(route.query.data as any)
      form.name = detailed.value.name
      form.resourceType = detailed.value.resourceType
      form.range = detailed.value.range
      instanceList.value = detailed.value.resourceInfos //已关联的实例
      form.resourceUuids = detailed.value.resourceUuids //实例
      form.remark = detailed.value.remark //描述
      form.ruleSource = 'custom' //规则来源
      form.type = detailed.value.type //告警类型
      form.enableNotification = !!detailed.value.enableNotification //告警类型
      form.alarmContactGroup = detailed.value.contactGroupIds
      form.effectTime = [
        detailed.value.notificationStartTime,
        detailed.value.notificationEndTime
      ]
    }
  }

  // 自定义校验
  const checkName = (rule: any, value: any, callback: (e?: Error) => any) => {
    if (!value.length) {
      callback(new Error('请填写名称，不可为空'))
    }
    nameRuleThree({ maxLength: 20, minLength: 1 }, value, callback)
  }
  const checkExample = (
    rule: any,
    value: any,
    callback: (e?: Error) => any
  ) => {
    if (form.range === 'ALL_INSTANCE') {
      callback()
    } else if (!value.length) {
      callback(new Error('请选择实例'))
    } else {
      callback()
    }
  }
  // 通知配置
  const checkNoticeConfig = (
    rule: any,
    value: any,
    callback: (e?: Error) => any
  ) => {}
  // 预测告警
  const checkForecast = (
    rule: any,
    value: any,
    callback: (e?: Error) => any
  ) => {
    const prediction = pastTimeRef.value.ruleData
    if (!prediction[0].monitorReferAttr?.length) {
      callback(new Error('请选择监控指标'))
    } else if (
      prediction[0].preIntervalUnit === prediction[0].nowIntervalUnit &&
      prediction[0].nowInterval >= prediction[0].preInterval
    ) {
      callback(new Error('预测时间周期要小于过去时间'))
    } else {
      callback()
    }
  }
  //预测告警
  const rules = reactive<FormRules>({
    name: [{ required: true, validator: checkName, trigger: 'blur' }],
    resourceType: [
      { required: true, message: '请选择资源类型', trigger: 'change' }
    ],
    templateSource: [
      { required: true, message: '请选择模板来源', trigger: 'change' }
    ],
    templateImport: [
      { required: true, message: '请选择模板', trigger: 'change' }
    ],
    templateRuleData: [
      { required: true, message: '请至少添加一条模版规则', trigger: 'change' }
    ],
    range: [{ required: true, message: '请选择资源范围', trigger: 'change' }],
    resourceUuids: [
      { required: true, validator: checkExample, trigger: 'change' }
    ],
    noticeWay: [
      {
        type: 'date',
        required: true,
        message: '至少选择一种通知方式',
        trigger: 'change'
      }
    ],
    group: [{ required: true, message: '请选择告警组', trigger: 'change' }],
    contacts: [{ required: true, message: '请选择告警人', trigger: 'change' }],
    ruleSource: [
      { required: true, message: '请选择规则来源', trigger: 'change' }
    ],
    type: [{ required: true, message: '请选择告警类型', trigger: 'change' }],
    enableNotification: [
      { required: true, message: '请选择告警类型', trigger: 'change' }
    ],
    forecast: [{ required: true, validator: checkForecast, trigger: 'change' }]
    // noticeConfig: [
    //   { required: true, validator: checkNoticeConfig, trigger: 'change' }
    // ],
  })

  // 获取监控指标
  watch(
    () => form.resourceType,
    newValue => {
      if (newValue) {
        indicatorList.value = resourceList.value.find(
          (item: any) => item.code === newValue
        ).sections
      }
    }
  )

  watch(
    () => form.ruleSource,
    newValue => {
      if (newValue === 'template-import') {
        queryDefaultTemplate()
      } else {
        form.templateImport = ''
        form.templateRuleData = []
      }
    }
  )
  const templateList: any = ref([])
  //查询默认模版
  const queryDefaultTemplate = () => {
    const params = {
      resourceType: form.resourceType,
      type: 'DEFAULT'
    }
    getAlarmTemplateList(params).then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        templateList.value = data
      } else {
        templateList.value = []
      }
    })
  }
  //查询模版下规则
  watch(
    () => form.templateImport,
    val => {
      if (val) {
        if (val) {
          form.templateRuleData = templateList.value.find(
            (item: any) => item.id === val
          ).historyRuleConfigs
        } else {
          form.templateRuleData = []
        }
      }
    }
  )

  watch(
    () => form.enableNotification,
    value => {
      if (value) {
        queryContactGroup()
      }
    }
  )

  // 创建联系组弹窗
  const showDialog = ref(false)
  const createContactGroup = () => {
    showDialog.value = true
  }
  const clickCloseEvent = () => {
    showDialog.value = false
  }
  const clickRefreshEvent = () => {
    queryContactGroup()
  }

  const contactGroupList: any = ref([])
  //查询联系组
  const queryContactGroup = () => {
    const params = {
      pageSize: 999,
      pageNum: 1
    }
    getContactGroupList(params)
      .then((res: any) => {
        const { code, data } = res
        if (code === 200) {
          contactGroupList.value = data.data
        }
      })
      .catch(_ => {
        contactGroupList.value = []
      })
  }
  const deleteTemplateRule = (index: number) => {
    /* TODO document why this arrow function is empty */
    form.templateRuleData.splice(index, 1)
  }

  const handleSwitchChange = (val: boolean) => {
    form.alarmContactGroup = []
    form.effectTime = []
  }

  const ruleDescriptionRef = ref() //规则描述组件

  /**
   * 保存/取消
   */

  const router = useRouter() // 路由
  const cancelForm = (formEl: FormInstance | undefined) => {
    if (!formEl) {
      return
    }
    formEl.resetFields()
    router.back()
  }

  // 新建
  const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) {
      return
    }
    formEl.validate(valid => {
      if (valid) {
        let rules: any = []
        //自定义创建
        if (form.ruleSource === 'custom') {
          const ruleData = ruleDescriptionRef.value.ruleData
          ruleData.forEach((item: any) => {
            rules.push(...item.childRules)
          })
        } else {
          //模版规则导入
          rules = form.templateRuleData
        }
        const historyConfigs = rules.map((item: any) => {
          const {
            name,
            monitorReferAttr,
            metricType,
            comparisonOperator,
            thresholdValue,
            monitorInterval,
            monitorIntervalUnit,
            reportLevel,
            valueAttr,
            tolerateTimes
          } = item

          const obj: { [key: string]: any } = {
            name,
            monitorReferAttr: handleMonitorReferAttr(monitorReferAttr), //监控指标
            comparisonOperator,
            thresholdValue,
            monitorInterval,
            monitorIntervalUnit,
            valueAttr,
            reportLevel,
            tolerateTimes
          }
          if (form.ruleSource === 'custom') {
            obj.metricType = metricType //指标类型 SINGLE_METRIC:单指标 MULTIPLE_METRICS：多指标
          } else {
            obj.metricType = 'SINGLE_METRIC' //模版导入规则均为单指标类型
          }
          if (metricType === 'MULTIPLE_METRICS') {
            obj.triggerType = item.triggerType //多指标规则触发配置
          }
          return obj
        })
        const {
          name,
          resourceType,
          remark,
          range,
          enableNotification,
          alarmContactGroup,
          effectTime
        } = form
        if (effectTime[0] && effectTime[1] && effectTime[0] === effectTime[1]) {
          return ElMessage.error('生效时间不能为同一时间')
        }
        const params: { [key: string]: any } = {
          name,
          resourceType,
          remark,
          range,
          type: 'HISTORY',
          enableNotification,
          historyConfigs,
          contactGroupIds: alarmContactGroup,
          notificationStartTime: effectTime[0],
          notificationEndTime: effectTime[1]
        }
        if (form.range === 'MULTI_INSTANCE') {
          // 实例
          // 关联实例
          params.resourceUuids = form.resourceUuids
        }
        if (isEdit) {
          // 编辑
          params.id = detailed.value.id
          editCreateRulesMonitoring(params).then((res: any) => {
            const { code } = res
            if (code === 200) {
              ElMessage.success('编辑规则成功')
              router.push({
                path: '/maintenance-center/alarm-service/alarm-rule/index'
              })
            }
          })
        } else {
          // 创建
          queryCreateRulesMonitoring(params).then((res: any) => {
            const { code } = res
            if (code === 200) {
              ElMessage.success('规则创建成功')
              router.push({
                path: '/maintenance-center/alarm-service/alarm-rule/index'
              })
            }
          })
        }
      }
    })
  }

  const tableHeaders: IdealTableColumnHeaders[] = [
    { label: '规则名称', prop: 'name' },
    { label: '规则描述', prop: 'overview' },
    { label: '告警级别', prop: 'reportLevelDes' }
  ]

  return {
    limitationRef,
    exampleRef,
    isEdit,
    detailed,
    getExpenseType,
    notificationRestrictionsRef,
    predictedTimeRef,
    pastTimeRef,
    indicatorList,
    formRef,
    form,
    rules,
    resourceList,
    instanceList,
    tableHeaders,
    deleteTemplateRule,
    cancelForm,
    submitForm,
    templateList,
    contactGroupList,
    ruleDescriptionRef,
    createContactGroup,
    showDialog,
    clickCloseEvent,
    clickRefreshEvent,
    handleSwitchChange
  }
}
