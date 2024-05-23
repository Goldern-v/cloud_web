<template>
  <div class="alarm-shield">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
      class="alarm-shield-form"
    >
      <el-form-item>
        <div class="flex-row ideal-header-container">
          <el-divider direction="vertical" />
          <div>策略信息</div>
        </div>
      </el-form-item>

      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" class="custom-input" />
      </el-form-item>

      <el-form-item label="描述" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="请输入内容"
          class="custom-input"
        >
        </el-input>
      </el-form-item>

      <el-form-item>
        <div class="flex-row ideal-header-container">
          <el-divider direction="vertical" />
          <div>屏蔽对象</div>
        </div>
      </el-form-item>

      <el-form-item label="屏蔽方式" prop="maskMode" required>
        <el-radio-group v-model="form.maskMode" @change="changeMaskMode">
          <el-radio-button
            v-for="(item, index) in maskModeOptions"
            :key="index"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="资源类型" prop="resourceType">
        <el-select
          v-model="form.resourceType"
          placeholder="请选择"
          class="custom-input"
        >
          <el-option
            v-for="(item, index) in resourceList"
            :key="index"
            :label="item.des"
            :value="item.code"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="form.maskMode === 'BY_RESOURCES'"
        label="资源范围"
        prop="resourceRange"
        required
      >
        <el-radio-group
          v-model="form.resourceRange"
          @change="handleRangeChange"
        >
          <el-radio-button
            v-for="(item, index) in resourceRangeOptions"
            :key="index"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="关联实例" prop="multiInstance">
        <!-- 资源屏蔽全部实例 -->
        <el-input
          v-if="
            form.maskMode === 'BY_RESOURCES' &&
            form.resourceRange === 'ALL_INSTANCE'
          "
          v-model="form.allResource"
          placeholder="选定类型下全部资源"
          class="custom-input"
          disabled
        >
        </el-input>

        <!-- 资源屏蔽多个实例 -->
        <template v-else>
          <el-select
            v-if="
              form.maskMode === 'BY_RESOURCES' &&
              form.resourceRange === 'MULTI_INSTANCE'
            "
            v-model="form.multiInstance"
            placeholder="请选择"
            multiple
            collapse-tags
            collapse-tags-tooltip
            class="custom-input"
          >
            <el-option
              v-for="(item, index) in multiInstanceList"
              :key="index"
              :label="item.name"
              :value="item.uuid"
              disabled
            >
            </el-option>
          </el-select>
          <!-- 规则屏蔽关联单实例 -->
          <el-select
            v-else
            v-model="form.instance"
            placeholder="请选择"
            class="custom-input"
          >
            <el-option
              v-for="(item, index) in instanceList"
              :key="index"
              :label="item.name"
              :value="item.uuid"
              disabled
            >
            </el-option>
          </el-select>

          <el-tooltip
            class="box-item"
            effect="dark"
            content="请先选择资源类型"
            placement="right"
            :disabled="!!form.resourceType"
          >
            <el-button
              id="instance-select-btn"
              type="primary"
              class="ideal-default-margin-left"
              :disabled="!form.resourceType"
              @click="handleSelectInstance"
              >选择实例</el-button
            >
          </el-tooltip>
        </template>
      </el-form-item>

      <el-form-item
        v-if="form.maskMode === 'BY_ALTER_CONFIGS'"
        label="选择告警规则"
        prop="alarmRule"
      >
        <el-select
          v-model="form.alarmRule"
          placeholder="请选择"
          multiple
          class="custom-input ideal-default-margin-right"
        >
          <el-option
            v-for="(item, index) in ruleList"
            :key="index"
            :label="item.name"
            :value="item.instanceId"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="form.maskMode === 'BY_ALTER_CONFIGS'"
        label="阈值规则"
      >
        <ideal-table-list
          ref="ruleTableRef"
          :table-data="tableData"
          :table-headers="tableHeaders"
          :show-pagination="false"
          :merge-column="[0]"
          :merge-data="mergeData"
          style="width: 60%"
        >
        </ideal-table-list>
      </el-form-item>

      <el-form-item>
        <div class="flex-row ideal-header-container">
          <el-divider direction="vertical" />
          <div>屏蔽时间配置</div>
        </div>
      </el-form-item>

      <el-form-item label="屏蔽时间" prop="shieldTimeType" required>
        <el-radio-group v-model="form.shieldTimeType">
          <el-radio-button
            v-for="(item, index) in shieldTimeTypeOptions"
            :key="index"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        v-if="form.shieldTimeType === 'CLEAR_TIME'"
        label="指定时间"
        prop="assignTime"
      >
        <div class="flex-row">
          <el-date-picker
            v-model="form.assignTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY-MM-DD HH:mm:ss"
            style="width: 300px"
          >
          </el-date-picker>
        </div>
      </el-form-item>

      <template v-if="form.shieldTimeType === 'PERIOD_TIME'">
        <el-form-item label="循环时间段" prop="timeRange">
          <el-time-picker
            v-model="form.startCycleTime"
            value-format="HH:mm:ss"
            format="HH:mm:ss"
            placeholder="开始时间"
          />
          <span style="margin: 0 10px">--</span>
          <el-time-picker
            v-model="form.endCycleTime"
            value-format="HH:mm:ss"
            format="HH:mm:ss"
            placeholder="结束时间"
          />
        </el-form-item>

        <el-form-item label="循环时间范围" prop="date">
          <div class="flex-column">
            <div class="flex-row">
              <el-checkbox v-model="form.timeRange" label="选择循环日期" />
              （不勾选即对所有的日期的时间段生效）
            </div>
            <el-date-picker
              v-if="form.timeRange"
              v-model="form.date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
            >
            </el-date-picker>
          </div>
        </el-form-item>
      </template>
    </el-form>

    <el-card>
      <div class="flex-row footer">
        <el-button type="primary" @click="submitForm(formRef)">{{
          t('save')
        }}</el-button>
        <el-button @click="cancelForm(formRef)">{{ t('back') }}</el-button>
      </div>
    </el-card>

    <instance
      v-if="showSelectExample"
      ref="exampleRef"
      :detail-info="detailInfo || {}"
      :resource-type="form.resourceType"
      :is-edit="isEdit"
      :select-type="selectType"
      @clickCloseEvent="closeSelectExample"
      @clickSuccessEvent="clickSuccessEvent"
    ></instance>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus/es'
import type { FormInstance, FormRules } from 'element-plus'
import { OperateEventEnum } from '@/utils/enum'
import { IdealTableColumnHeaders } from '@/types'
import store from '@/store'
import { nameRuleThree } from '@/utils/validate'
import {
  getResourceTypeList,
  alarmShieldCreate,
  getAlarmAssignResource,
  alarmShieldUpdate
} from '@/api/java/maintenance-center'
import instance from '../alarm-rule/components/instance.vue'

const { t } = useI18n()
/*
 *表单
 */
const formRef = ref<FormInstance>()
const form = reactive({
  name: '',
  remark: '',
  maskMode: 'BY_RESOURCES', //屏蔽方式
  resourceType: '', //资源类型
  resourceRange: 'ALL_INSTANCE', //资源范围
  allResource: '', //选定类型下所有资源
  instance: '', //规则屏蔽所关联的单实例
  multiInstance: [], //资源屏蔽关联多实例
  shieldTimeType: 'CLEAR_TIME', //告警类型
  assignTime: [] as any[],
  startCycleTime: '00:00:00',
  endCycleTime: '23:59:59',
  timeRange: false,
  date: [] as any[],
  alarmRule: [] as any[]
})

//表单校验
const checkName = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!value.length) {
    callback(new Error('请输入名称'))
  }
  nameRuleThree({ maxLength: 20, minLength: 1 }, value, callback)
}

const checkInstance = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!value && form.resourceRange === 'instance') {
    callback(new Error('请选择实例'))
  } else {
    callback()
  }
}

const checkTimeRange = (
  rule: any,
  value: any,
  callback: (e?: Error) => any
) => {
  if (!form.startCycleTime || !form.endCycleTime) {
    callback(new Error('请选择循环时间段'))
  } else {
    callback()
  }
}
const rules = reactive<FormRules>({
  name: [{ required: true, validator: checkName, trigger: 'blur' }],
  resourceType: [
    { required: true, message: '请选择资源类型', trigger: 'change' }
  ],
  resourceRange: [
    { required: true, message: '请选择资源范围', trigger: 'change' }
  ],
  multiInstance: [
    { required: true, validator: checkInstance, trigger: 'change' }
  ],
  alarmRule: [{ required: true, message: '请选择告警规则', trigger: 'change' }],
  assignTime: [
    { required: true, message: '请输入指定时间', trigger: 'change' }
  ],
  timeRange: [{ required: true, validator: checkTimeRange, trigger: 'change' }]
})

const route = useRoute()
const detailInfo = ref<any>()
const isEdit = route.query.type === 'edit'
onMounted(() => {
  resourceTypeList()
  if (isEdit) {
    editEvent()
  }
})
// 表单深拷贝, 比较表单是否修改
const originDic = ref()

const editEvent = () => {
  detailInfo.value = JSON.parse(route.query.data as any)
  form.name = detailInfo.value.name
  form.remark = detailInfo.value.remark
  form.maskMode = detailInfo.value.type
  form.resourceType = detailInfo.value.resourceType
  form.resourceRange = detailInfo.value.range
  form.shieldTimeType = detailInfo.value.shieldTimeType
  if (detailInfo.value.shieldTimeType === 'CLEAR_TIME') {
    // 指定时间
    form.assignTime = [
      detailInfo.value.startTimeDes,
      detailInfo.value.endTimeDes
    ]
  } else if (detailInfo.value.shieldTimeType === 'PERIOD_TIME') {
    // 周期时间
    form.startCycleTime = detailInfo.value.plannedStart
    form.endCycleTime = detailInfo.value.plannedEnd
  }
  if (detailInfo.value.resourceInfos?.length) {
    if (
      detailInfo.value.type === 'BY_RESOURCES' &&
      detailInfo.value.range === 'MULTI_INSTANCE'
    ) {
      multiInstanceList.value = detailInfo.value.resourceInfos
      form.multiInstance = detailInfo.value.resourceUuids
    } else if (detailInfo.value.type === 'BY_ALTER_CONFIGS') {
      instanceList.value = detailInfo.value.resourceInfos
      form.instance = detailInfo.value.resourceUuids[0]
    }
  }
  if (detailInfo.value.resourceUuids?.length) {
    getAlarmStrategy(detailInfo.value.resourceUuids[0])
  }
  if (detailInfo.value.plannedStartDate && detailInfo.value.plannedEndDate) {
    form.timeRange = true
    form.date = [
      detailInfo.value.plannedStartDate,
      detailInfo.value.plannedEndDate
    ]
  }

  originDic.value = Object.assign({}, form)
}
//查询资源类型列表
const resourceList: Ref<any[]> = ref([])
const resourceTypeList = () => {
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
watch(
  () => form.resourceType,
  value => {
    if (value) {
      store.commonStore.setType(value)
    }
  }
)

const handleRangeChange = (value: string) => {
  form.multiInstance = []
  multiInstanceList.value = []
}
const maskModeOptions = [
  { label: '资源屏蔽', value: 'BY_RESOURCES' },
  { label: '规则屏蔽', value: 'BY_ALTER_CONFIGS' }
]

const resourceRangeOptions = [
  { label: '全部资源', value: 'ALL_INSTANCE' },
  { label: '实例', value: 'MULTI_INSTANCE' }
]

const changeMaskMode = () => {
  form.multiInstance = []
  form.instance = ''
  form.alarmRule = []
  store.commonStore.tempArray = []
}

// 关联实例
const instanceList = ref<any[]>([]) //单实例列表
const multiInstanceList = ref<any[]>([]) //多实例列表

watch(
  () => store.commonStore.tempArray,
  value => {
    instanceList.value = value
    multiInstanceList.value = value
  }
)
// 监听单实例实例选择关联实例
watch(
  () => store.commonStore.tempObject,
  value => {
    if (value) {
      form.instance = value.uuid
      getAlarmStrategy(value.uuid)
    }
  }
)

watch(
  () => store.commonStore.selectArray,
  value => {
    if (value) {
      form.multiInstance = value.map((item: any) => item.uuid)
    }
  }
)
const ruleTableRef = ref()
// 告警规则
const ruleList = ref<any[]>([])
const getAlarmStrategy = (uuid: string) => {
  if (form.maskMode !== 'BY_ALTER_CONFIGS') {
    return
  }
  getAlarmAssignResource(uuid, { resourceType: form.resourceType })
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        ruleList.value = data
        // 规则屏蔽编辑时,回显阈值规则
        if (isEdit) {
          form.alarmRule = detailInfo.value.alertConfigInstanceIds
        }
      } else {
        ruleList.value = []
      }
    })
    .catch(_ => {
      ruleList.value = []
    })
}

const tableData: any = ref([])
watch(
  () => form.alarmRule,
  val => {
    let arr: any = []
    tableData.value = []
    //找到规则所对应的阈值规则
    arr = ruleList.value.filter((item: any) => val.includes(item.instanceId))
    //扁平化获取historyConfigs项并去重
    tableData.value = [
      ...new Set(arr.flatMap((obj: any) => obj.historyConfigs))
    ]
    mergeTable()
  }
)

/**
 * 列表合并
 */
const pos = ref(0)
const mergeData: any = ref([])
const mergeTable = () => {
  if (!tableData.value) {
    return
  }
  mergeData.value = []
  for (let i = 0; i < tableData.value.length; i++) {
    if (i === 0) {
      mergeData.value.push(1)
      pos.value = 0
    } else {
      if (tableData.value[i].name == tableData.value[i - 1].name) {
        mergeData.value[pos.value] += 1
        mergeData.value.push(0)
      } else {
        mergeData.value.push(1)
        pos.value = i
      }
    }
  }
}

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '规则名称', prop: 'name' },
  { label: '规则描述', prop: 'overview' },
  { label: '告警级别', prop: 'reportLevelDes' }
]
const shieldTimeTypeOptions = [
  { label: '指定时间', value: 'CLEAR_TIME' },
  { label: '周期时间', value: 'PERIOD_TIME' },
  { label: '永久生效', value: 'FOREVER_TIME' }
]
/**
 * 弹框
 */
// 选择类型(单选或所选  资源屏蔽多选，规则屏蔽单选)
const selectType = computed(() => {
  return form.maskMode === 'BY_RESOURCES' ? 'multi' : 'single'
})
const showSelectExample = ref(false)
const handleSelectInstance = () => {
  document.getElementById('instance-select-btn')?.blur()
  showSelectExample.value = true
}
const exampleRef = ref()
//  弹窗关闭
const closeSelectExample = () => {
  showSelectExample.value = false
}
const clickSuccessEvent = (value: any) => {
  showSelectExample.value = false
}

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
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate(valid => {
    if (valid) {
      let params: { [key: string]: any } = handleParams()
      if (isEdit) {
        params.id = detailInfo.value.id
        console.log(params)
        alarmShieldUpdate(params).then((res: any) => {
          const { code } = res
          if (code === 200) {
            ElMessage.success('编辑成功')
            router.push({
              path: '/maintenance-center/alarm-service/alarm-shield/index'
            })
          }
        })
      } else {
        alarmShieldCreate(params).then((res: any) => {
          const { code } = res
          if (code === 200) {
            ElMessage.success('创建成功')
            router.push({
              path: '/maintenance-center/alarm-service/alarm-shield/index'
            })
          }
        })
      }
    }
  })
}
const handleParams = () => {
  const params: { [key: string]: any } = {
    name: form.name,
    remark: form.remark,
    shieldTimeType: form.shieldTimeType, // 屏蔽时间
    range: form.resourceRange, // 资源范围
    resourceType: form.resourceType, // 资源类型
    type: form.maskMode // 屏蔽类型
  }

  if (form.resourceRange === 'MULTI_INSTANCE') {
    params.resourceUuids = form.multiInstance // 资源屏蔽时 传入多实例uuid
  }
  if (form.maskMode === 'BY_ALTER_CONFIGS') {
    params.resourceUuids = [form.instance] // 规则屏蔽时 传入单实例uuid
  }
  // 屏蔽时间
  if (form.shieldTimeType === 'CLEAR_TIME') {
    // 指定时间 时间戳
    const beginTimestamp = new Date(form.assignTime[0]).getTime()
    const endTimestamp = new Date(form.assignTime[1]).getTime()
    params.startTime = beginTimestamp
    params.endTime = endTimestamp
  } else if (form.shieldTimeType === 'PERIOD_TIME') {
    // 周期时间
    params.plannedStart = form.startCycleTime
    params.plannedEnd = form.endCycleTime
    if (form.timeRange) {
      params.plannedStartDate = form.date[0]
      params.plannedEndDate = form.date[1]
    }
  }

  if (form.maskMode === 'BY_ALTER_CONFIGS') {
    params.alertConfigInstanceIds = form.alarmRule
  }
  return params
}
</script>

<style scoped lang="scss">
.alarm-shield {
  margin: $idealMargin;
  :deep(.el-divider--vertical) {
    border-left: 1px var(--el-color-primary) var(--el-border-style);
  }
  .alarm-shield-form {
    background-color: white;
    padding: $idealPadding;
  }
  .custom-input {
    width: $formInputWidth;
  }
  :deep(.el-radio-button__inner) {
    width: 115px;
  }
  :deep(.svg-icon svg) {
    fill: var(--el-color-primary);
  }
  :deep(.el-date-editor--time) {
    width: 115px;
  }
  .ideal-header-container {
    width: 100%;
  }
}
</style>
