import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { nameRuleThree } from '@/utils/validate'
import {
  getResourceTypeList,
  getAlarmTemplateList,
  alarmTemplateInfo
} from '@/api/java/maintenance-center'
import { handleMonitorReferAttr } from '../../alarm-rule/components/common'
import {
  alarmTemplateCreate,
  alarmTemplateUpdate
} from '@/api/java/maintenance-center'

export const createData = () => {
  /*
   *表单
   */
  const formRef = ref<FormInstance>()
  const form: { [key: string]: any } = reactive({
    name: '',
    remark: '',
    resourceType: '', //资源类型
    type: 'DEFAULT', //告警来源
    template: '', //模板导入
    templateRuleData: [] as any[], //默认模版规则
    alarmType: 'HISTORY' //告警类型
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
      { required: true, message: '请选择资源类型', trigger: 'change' }
    ],
    type: [{ required: true, message: '请选择模板来源', trigger: 'change' }],
    template: [{ required: true, message: '请选择模板', trigger: 'change' }]
  })

  const route = useRoute()

  const isEdit = computed(() => {
    return route.query.type === 'edit'
  }) //是否编辑页面
  onMounted(() => {
    getExpenseType()
    if (isEdit.value) {
      getEditData()
    }
  })

  const defaultRule: any = ref([])
  const getEditData = () => {
    const id = JSON.parse(route.query?.data as any).id
    alarmTemplateInfo(id).then((res: any) => {
      const { data, code } = res
      if (code === 200) {
        Object.keys(form).forEach((key: string) => {
          form[key] = data[key]
        })
      }
    })
  }

  //查询资源类型列表
  const resourceList: Ref<any[]> = ref([])
  const getExpenseType = () => {
    getResourceTypeList()
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

  const indicatorList: any = ref([])
  // 根据资源类型获取监控指标
  watch(
    () => [form.resourceType, form.type],
    (newVal, oldVal) => {
      if (newVal[0] !== oldVal[0]) {
        indicatorList.value = resourceList.value.find(
          (item: any) => item.code === newVal[0]
        ).sections
        form.template = ''
        form.templateRuleData = []
      }

      //查询默认模版规则
      if (newVal[0] && newVal[1] === 'DEFAULT') {
        queryDefaultTemplate()
      } else {
        form.templateRuleData = []
        templateList.value = []
      }
    }
  )
  const handleResourceTypeChange = (val: string) => {}
  //查询默认模版规则
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
  const templateList: any = ref([])

  //默认模版规则
  watch(
    () => form.template,
    val => {
      if (val) {
        console.log(val, '---template-----')

        form.templateRuleData = templateList.value.find(
          (item: any) => item.id === val
        ).historyRuleConfigs
        console.log(form.templateRuleData, '------------')
      }
    }
  )
  //删除默认模版规则
  const delTemplateRule = (index: number) => {
    form.templateRuleData.value.splice(index, 1)
  }

  /*
  保存/取消
  */
  const router = useRouter() // 路由
  const cancelForm = (formEl: FormInstance | undefined) => {
    if (!formEl) {
      return
    }
    formEl.resetFields()
    router.push({
      path: '/maintenance-center/alarm-service/alarm-template/index',
      query: {
        type: 'customAlarmTemplate'
      }
    })
  }
  const ruleDescriptionRef = ref()

  const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) {
      return
    }
    formEl.validate((valid: boolean) => {
      if (valid) {
        let rules: any = []
        const ruleData = ruleDescriptionRef.value.ruleData
        ruleData.forEach((item: any) => {
          rules.push(...item.childRules)
        })
        const historyRuleConfigs = rules.map((item: any) => {
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
        const params: { [key: string]: any } = {
          name: form.name,
          remark: form.remark,
          historyRuleConfigs
        }
        if (route.query.type === 'create') {
          params.resourceType = form.resourceType
          alarmTemplateCreate(params).then((res: any) => {
            const { code } = res
            if (code === 200) {
              ElMessage.success('创建自定义模版成功')
              router.push({
                path: '/maintenance-center/alarm-service/alarm-template/index',
                query: {
                  type: 'customAlarmTemplate'
                }
              })
            } else {
              ElMessage.error(res.msg || '创建自定义模版失败')
            }
          })
        } else {
          params.id = JSON.parse(route.query?.data as any).id
          alarmTemplateUpdate(params).then((res: any) => {
            const { code } = res
            if (code === 200) {
              ElMessage.success('修改自定义模版成功')
              router.push({
                path: '/maintenance-center/alarm-service/alarm-template/index',
                query: {
                  type: 'customAlarmTemplate'
                }
              })
            } else {
              ElMessage.error(res.msg || '修改自定义模版失败')
            }
          })
        }
      }
    })
  }

  return {
    formRef,
    form,
    rules,
    resourceList,
    indicatorList,
    templateList,
    delTemplateRule,
    defaultRule,
    handleResourceTypeChange,
    submitForm,
    cancelForm,
    ruleDescriptionRef,
    isEdit
  }
}
