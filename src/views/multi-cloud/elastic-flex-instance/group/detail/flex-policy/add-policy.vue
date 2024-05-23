<template>
  <div class="add">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="策略名称">
        <el-input v-model="form.name" style="width: 20%;"/>
      </el-form-item>

      <el-form-item label="策略类型">
        <div>
          <el-radio-group v-model="form.policyType">
            <el-radio-button
              v-for="(item, index) of selectData.policyTypes"
              :key="index"
              :label="item.label"
            >
              {{ item.value }}
            </el-radio-button>
          </el-radio-group>

          <div class="ideal-warning-text">伸缩带宽策略受告警规则状态影响，中途停用或处于停用状态下的告警规则会导致该伸缩策略失效。</div>
        </div>
      </el-form-item>

      <el-form-item label="告警规则">
        <el-radio-group v-model="form.alarmRule">
          <el-radio-button
            v-for="(item, index) of selectData.alarmRules"
            :key="index"
            :label="item.label"
          >
            {{ item.value }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="告警规则名称">
        <el-input v-model="form.alarmRuleName" style="width: 20%;"/>
      </el-form-item>

      <el-form-item label="监控类型">
        <el-radio-group v-model="form.monitorType">
          <el-radio-button
            v-for="(item, index) of selectData.monitorTypes"
            :key="index"
            :label="item.label"
          >
            {{ item.value }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="触发条件">
        <div>
          <div class="flex-row">
            <el-select
              v-model="form.triggerType"
              placeholder="请选择"
              class="ideal-default-margin-right"
              style="width: 25%;"
            >
              <el-option
                v-for="(item, index) of selectData.triggerTypes"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>

            <el-select
              v-model="form.valueType"
              placeholder="请选择"
              class="ideal-default-margin-right"
              style="width: 20%;"
            >
              <el-option
                v-for="(item, index) of selectData.valueTypes"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>

            <el-select v-model="form.symbol" placeholder="请选择" class="ideal-default-margin-right" style="width: 10%;">
              <el-option
                v-for="(item, index) of selectData.symbols"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>

            <el-input v-model="form.triggerSize" class="ideal-default-margin-right" style="width: 10%;"/>

            <el-select
              v-if="selectCase.isTriggerBandwidth"
              v-model="form.bandwidthUnit"
              placeholder="请选择"
              class="ideal-default-margin-right"
            >
              <el-option
                v-for="(item, index) of selectData.bandwidthUnits"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <div v-else-if="selectCase.isTriggerFlow">byte</div>
            <div v-else-if="selectCase.isTriggerRate">%</div>
          </div>

          <div class="ideal-tip-text">不同操作系统的监控指标有所不同。</div>
          <div class="ideal-tip-text">如果使用Agent监控指标，请确认伸缩组中实例均已安装了Agent插件。</div>
        </div>
      </el-form-item>

      <el-form-item label="监控周期">
        <el-select
          v-model="form.monitorCycle"
          placeholder="请选择"
          class="ideal-default-margin-right"
          style="width: 20%;"
        >
          <el-option
            v-for="(item, index) of selectData.monitorCycles"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="连续出现次数">
        <el-input v-model="form.continuous" style="width: 20%;"/>

        <el-tooltip
          popper-class="custom-tooltip"
          effect="dark"
          content="连续出现次数指探测结果连续几次符合您设置的规则，才会触发告警。例如设置为3，则表示连续3次超过阈值后才会触发告警。"
          placement="right"
        >
          <svg-icon icon="question-icon" class="ideal-svg-margin-left"/>
        </el-tooltip>
      </el-form-item>

      <el-form-item label="执行动作">
        <el-select
          v-model="form.actionType"
          placeholder="请选择"
          class="ideal-default-margin-right"
        >
          <el-option
            v-for="(item, index) of selectData.actionTypes"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <el-input v-model="form.actionSize" class="ideal-default-margin-right" style="width: 20%;"/>
        
        <el-select
          v-model="form.actionTypeUnit"
          placeholder="请选择"
          class="ideal-default-margin-right"
        >
          <el-option
            v-for="(item, index) of selectData.actionTypeUnits"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <div class="flex-row footer-button">
      <el-button type="info" @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { generateCode } from '@/utils/tool'
import { EventEnum } from '@/utils/enum'
import { useCreate } from './add-policy'

const { t } = useI18n()
const formRef = ref<FormInstance>()
const form = reactive({
  name: 'as-policy-' + generateCode(4), // 策略名称
  policyType: 'alarm', // 策略类型
  alarmRule: 'create', // 告警规则
  alarmRuleName: 'as-alarm-' + generateCode(4), // 告警规则名称
  monitorType: 'system', // 监控类型
  triggerType: 'enterBandwidth', // 触发条件 (出入网-带宽、流量)
  valueType: 'maxValue', // 触发条件 (最大值最小值等)
  symbol: '1', // 触发条件 (大于小于等)
  triggerSize: '', // 触发条件 (大小)
  bandwidthUnit: '', // 触发条件 (单位)
  monitorCycle: '', // 监控周期
  continuous: '', // 连续出现次数
  actionType: '', // 执行动作
  actionSize: '',
  actionTypeUnit: ''
})
const rules = reactive<FormRules>({
  // vpc: [{ required: true, message: '请选择虚拟私有云', trigger: 'blur' }],
})

const { 
  selectCase,
  selectData
} = useCreate(form)

// 点击事件
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  emit(EventEnum.cancel)
}

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate(valid => {
    if (valid) {
      console.log('submit!')
      emit(EventEnum.success)
    } else {
      console.log('error submit!')
      return false
    }
  })
}
</script>

<style scoped lang="scss">
.add {
  width: 100%;
  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
<style lang="scss">
.custom-tooltip {
  max-width: 260px;
}
</style>
