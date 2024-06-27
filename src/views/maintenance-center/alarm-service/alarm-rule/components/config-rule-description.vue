<template>
  <div>
    <el-form
      ref="formRef"
      :model="form"
      label-position="left"
      label-width="180"
      :rules="rules"
    >
      <el-form-item label="规则名称" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入规则名称"
          :disabled="isEdit"
          class="custom-input"
        />
      </el-form-item>

      <el-form-item label="指标类型" required>
        <el-radio-group
          v-model="form.metricType"
          class="ideal-default-margin-right"
        >
          <el-radio-button
            v-for="(item, index) of indexTypeList"
            :key="index"
            :label="item.value"
            :disabled="isEdit"
          >
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <template v-if="form.metricType === 'SINGLE_METRIC'">
        <el-form-item label="监控指标" prop="monitorReferAttr">
          <el-cascader
            v-model="form.monitorReferAttr"
            :options="indicatorList"
            :props="cascaderProps"
            :show-all-levels="false"
            placeholder="请选择监控指标"
            class="custom-input"
          />
        </el-form-item>

        <el-form-item label="告警级别以及阈值配置" class="single-config">
          <el-container
            v-for="(ele, index) in form.singleRules"
            :key="index"
            class="ideal-large-margin-top"
            :style="{
              border: ele.checked
                ? '1px solid var(--el-color-danger)'
                : '1px solid #ccc'
            }"
          >
            <el-aside width="10%">
              <el-divider
                direction="vertical"
                :style="'border:' + '3px' + ' ' + 'solid' + ' ' + ele.color"
              />
              <span>{{ ele.reportLevelText }}</span>
            </el-aside>
            <el-main>
              <el-row :gutter="5">
                <el-col :span="3">监控指标</el-col>
                <el-col :span="7">
                  <el-select
                    v-model="ele.valueAttr"
                    placeholder="请选择比较的值"
                    clearable
                  >
                    <el-option
                      v-for="(item, idx) of comparisonValues"
                      :key="idx"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option> </el-select
                ></el-col>
                <el-col :span="7">
                  <el-select
                    v-model="ele.comparisonOperator"
                    placeholder="请选择比较方法"
                    @change="comparisonOperatorChange($event, index)"
                  >
                    <el-option
                      v-for="(item, idx) of comparisonList"
                      :key="idx"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option> </el-select
                ></el-col>
                <el-col :span="7"
                  ><el-input-number
                    v-model="ele.thresholdValue"
                    controls-position="right"
                    :min="0"
                    style="width: 80%"
                  ></el-input-number>
                  {{ ele.unit }}
                </el-col>
              </el-row>
              <el-row :gutter="5" style="margin-top: 5px">
                <el-col :span="3">监控周期</el-col>
                <el-col :span="7">
                  <el-input-number
                    v-model="ele.monitorInterval"
                    controls-position="right"
                    :min="1"
                    :precision="0"
                  ></el-input-number>
                </el-col>
                <el-col :span="7">
                  <el-select
                    v-model="ele.monitorIntervalUnit"
                    placeholder="请选择时间单位"
                    clearable
                  >
                    <el-option
                      v-for="(item, idx) of unitList"
                      :key="idx"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option> </el-select
                ></el-col>
                <el-col :span="7">
                  连续触发<el-input-number
                    v-model="ele.tolerateTimes"
                    controls-position="right"
                    :min="1"
                    style="width: 50%; margin: 0 5px"
                  ></el-input-number
                  >次</el-col
                >
              </el-row>
            </el-main>
          </el-container>

          <div class="el-form-item__error">{{ validateText }}</div>
        </el-form-item>
      </template>

      <template v-else>
        <el-form-item label="告警级别" prop="reportLevel">
          <el-select
            v-model="form.reportLevel"
            placeholder="请选择告警级别"
            class="custom-input"
          >
            <el-option
              v-for="(item, idx) of alarmLevelList"
              :key="idx"
              :label="item.label"
              :value="item.value"
            >
              <div class="flex-row flex-row-center">
                <div
                  class="round-dot"
                  :style="{ background: item.color }"
                ></div>
                <span>{{ item.label }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="多指标告警阈值配置" prop="multiRules">
          <multiple-alarm-config
            ref="multipleAlarmConfigRef"
            :indicator-list="indicatorList"
            :default-rules="form.multiRules"
          ></multiple-alarm-config>
        </el-form-item>

        <el-form-item label="告警规则触发满足条件" prop="triggerData">
          <trigger-condition
            ref="triggerConditionRef"
            :default-rules="form.triggerData"
          ></trigger-condition>
        </el-form-item>

        <el-form-item label="多指标规则触发配置" required>
          <el-radio-group
            v-model="form.triggerType"
            class="ideal-default-margin-right"
            required
          >
            <el-radio
              v-for="(item, index) of triggerConfigList"
              :key="index"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </template>
    </el-form>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  indexTypeList,
  comparisonValues,
  comparisonList,
  unitList,
  indicatorProps,
  triggerConfigList,
  alarmLevelList,
  getIndicatorInfo,
  alarmLevelConfig,
  hasEmptyValue,
  countNonNullValues,
  validateRule
} from './common'
import multipleAlarmConfig from './multiple-alarm-config.vue'
import triggerCondition from './trigger-condition.vue'
import { EventEnum, OperateEventEnum } from '@/utils/enum'
import type { FormRules, FormInstance } from 'element-plus'
import { nameRuleThree } from '@/utils/validate'

interface ruleProps {
  indicatorList: Array<any>
  rowData?: any
  operateType?: OperateEventEnum | undefined
}

const props = withDefaults(defineProps<ruleProps>(), {
  indicatorList: () => [],
  rowData: null,
  operateType: undefined
})

const isEdit = computed(() => {
  return props.operateType === OperateEventEnum.edit
}) //是否编辑模式

const formRef = ref()
const form: { [key: string]: any } = reactive({
  name: '',
  monitorReferAttr: [],
  metricType: 'SINGLE_METRIC',
  triggerType: 'SINGLE',
  reportLevel: '',
  singleRules: [], //单指标规则数据
  multiRules: []
})

const comparisonOperatorChange = (val: string, index: number) => {
  form.singleRules.forEach((ele: any, idx: number) => {
    if (idx !== index) {
      ele.comparisonOperator = val
    }
  })
}
// 自定义校验
const checkName = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!value.length) {
    callback(new Error('请填写名称，不可为空'))
  }
  nameRuleThree({ maxLength: 20, minLength: 1 }, value, callback)
}

const validateText = ref('')
//校验单指标
const checkSingleData = () => {
  const arr = form.singleRules.filter((item: any) => {
    return !hasEmptyValue(item, 'single')
  })
  form.singleRules.forEach((ele: any) => {
    ele.checked =
      countNonNullValues(ele, 'single') >= 2 &&
      countNonNullValues(ele, 'single') < 6
  })
  const isComplete = !form.singleRules.some((ele: any) => ele.checked)
  if (!arr.length) {
    validateText.value = '请至少配置一条阈值规则'
  } else if (!isComplete) {
    validateText.value = '请配置完整的阈值规则'
  } else {
    validateText.value = ''
  }
}
//校验多指标
const checkMulti = (rule: any, value: any, callback: (e?: Error) => any) => {
  validateRule(
    'multi',
    { max: 4, min: 1 },
    multipleAlarmConfigRef.value.ruleData,
    callback
  )
}
//校验告警规则触发满足条件
const checkTrigger = (rule: any, value: any, callback: (e?: Error) => any) => {
  validateRule(
    'trigger',
    { max: 3, min: 1 },
    triggerConditionRef.value.ruleData,
    callback
  )
}
const rules = reactive<FormRules>({
  name: [{ required: true, validator: checkName, trigger: 'blur' }],
  monitorReferAttr: [
    { required: true, message: '请选择监控指标', trigger: 'change' }
  ],
  reportLevel: [
    { required: true, message: '请选择告警级别', trigger: 'change' }
  ],
  multiRules: [{ required: true, validator: checkMulti, trigger: 'change' }],
  triggerData: [{ required: true, validator: checkTrigger, trigger: 'change' }]
})

const { t } = useI18n()

//  监控指标
const cascaderProps = {
  value: 'code',
  label: 'des',
  children: 'metrics'
}

const alarmLevelDataInit = (): indicatorProps[] => {
  const array: any = []
  for (let i = 0; i < 4; i++) {
    array.push({
      valueAttr: '',
      comparisonOperator: '',
      unit: '', //监控指标单位
      monitorInterval: null,
      thresholdValue: null,
      monitorIntervalUnit: '',
      tolerateTimes: null,
      color: alarmLevelConfig[i].color,
      reportLevelText: alarmLevelConfig[i].reportLevelText,
      reportLevel: alarmLevelConfig[i].reportLevel
    })
  }
  return array
}

onMounted(() => {
  form.singleRules = alarmLevelDataInit()
  if (isEdit.value) {
    //回显form表单
    Object.keys(form).forEach((item: string) => {
      if (props.rowData.hasOwnProperty(item)) {
        form[item] = props.rowData[item]
      }
    })
    //回显单指标表格数据
    if (props.rowData.metricType === 'SINGLE_METRIC') {
      form.singleRules.forEach((ele: any) => {
        const index = props.rowData.childRules.findIndex(
          (item: any) => item.reportLevel === ele.reportLevel
        )
        if (index !== -1) {
          Object.keys(ele).forEach((key: string) => {
            if (props.rowData.childRules[index].hasOwnProperty(key)) {
              ele[key] = props.rowData.childRules[index][key]
            }
          })
        }
      })
    } else {
      //回显多指标表格数据
      form.multiRules = props.rowData.childRules
      form.triggerData = [props.rowData.childRules[0]]
      form.triggerType = props.rowData.childRules[0].triggerType
    }
  }
})

watch(
  () => form.monitorReferAttr,
  val => {
    const indicatorInfo = getIndicatorInfo(props.indicatorList, form)
    form.singleRules.forEach((ele: any) => {
      ele.unit = indicatorInfo.unit
    })
  }
)

const multipleAlarmConfigRef = ref() //多指标告警阈值配置组件
const triggerConditionRef = ref() //告警规则触发满足条件组件

// 点击事件
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success, v: indicatorProps[], i: any, type: string): void
}
const emit = defineEmits<EventEmits>()
const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  emit(EventEnum.cancel)
}

// 新建
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate((valid: boolean) => {
    if (form.metricType === 'SINGLE_METRIC') {
      checkSingleData()
    } else {
    }

    if (valid && !validateText.value) {
      let rules: any = []
      if (form.metricType === 'SINGLE_METRIC') {
        rules = form.singleRules.filter((item: any) => {
          return !hasEmptyValue(item, 'single')
        })
      } else {
        const rule = multipleAlarmConfigRef.value.ruleData
        const triggerData = triggerConditionRef.value.ruleData
        rules = rule.map((element: any) => {
          const { monitorInterval, monitorIntervalUnit, tolerateTimes } =
            triggerData[0]
          return {
            ...element,
            monitorInterval,
            monitorIntervalUnit,
            tolerateTimes
          }
        })
      }
      emit(EventEnum.success, rules, form, isEdit.value ? 'edit' : 'create')
      formEl.resetFields()
    }
  })
}
</script>

<style scoped lang="scss">
:deep(.el-input-number) {
  width: 100%;
}
.el-container {
  // border: 1px solid #ccc;
  box-sizing: border-box;
}
.el-main {
  padding: 5px;
}
.custom-input {
  width: $formInputWidth;
}
:deep(.el-divider--vertical) {
  height: 100%;
  margin-left: 0px;
  box-sizing: border-box;
}
.flex-row-center {
  align-items: center;
}
.round-dot {
  width: 10px;
  height: 10px;
  border-radius: 10px;
  margin-right: 5px;
}
:deep(.single-config) {
  .el-form-item__label {
    &:before {
      content: '*';
      color: var(--el-color-danger);
    }
  }
}
</style>
