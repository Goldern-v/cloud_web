<template>
  <div class="create">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-card>
        <el-form-item label="区域">
          <div>
            <div>{{ form.regionName }}</div>
            <div class="ideal-tip-text">
              不同区域的云服务产品之间内网互不相通；请就近选择靠近您业务的区域，可减少网络延迟，提高访问速度。
            </div>
          </div>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="策略名称">
          <el-input v-model="form.name" style="width: 20%;"/>
        </el-form-item>

        <el-form-item label="资源类型">
          <el-radio-group v-model="form.resourceType">
            <el-radio-button
              v-for="(item, index) of selectData.resourceTypes"
              :key="index"
              :label="item.label"
            >
              {{ item.value }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="selectCase.isEip" label="弹性公网IP">
          <div style="width: 100%;">
            <div class="flex-row">
              <el-select
                v-model="form.eip"
                placeholder="请选择"
                class="ideal-default-margin-right"
                style="width: 20%;"
              >
                <el-option
                  v-for="(item, index) of selectData.eipList"
                  :key="index"
                  :label="item.platform"
                  :value="item.platform"
                />
              </el-select>

              <svg-icon icon="refresh-icon" class="ideal-svg-margin-right" />
              <el-button link type="primary">购买弹性公网IP</el-button>
            </div>

            <div>
              当前带宽大小 1Mbit/s 当前您仅可对按需付费模式的弹性IP进行伸缩。
            </div>
          </div>
        </el-form-item>

        <el-form-item v-else label="共享带宽">
          <div style="width: 100%;">
            <div class="flex-row">
              <el-select
                v-model="form.shareBandwidth"
                placeholder="请选择"
                class="ideal-default-margin-right"
                style="width: 20%;"
              >
                <el-option
                  v-for="(item, index) of selectData.shareBandwidths"
                  :key="index"
                  :label="item.platform"
                  :value="item.platform"
                />
              </el-select>

              <svg-icon icon="refresh-icon" class="ideal-svg-margin-right" />
              <el-button link type="primary">新建共享带宽</el-button>
            </div>

            <div>当前您仅可对按需付费模式的共享带宽进行伸缩。</div>
          </div>
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

            <div v-if="selectCase.isAlarmPolicy" class="ideal-warning-text">
              伸缩带宽策略受告警规则状态影响，中途停用或处于停用状态下的告警规则会导致该伸缩带宽策略失效。
            </div>
          </div>
        </el-form-item>
      </el-card>

      <el-card v-if="selectCase.isAlarmPolicy" class="ideal-large-margin-top">
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

        <template v-if="selectCase.isCreateAlarm">
          <el-form-item label="告警规则名称">
            <el-input v-model="form.alarmRuleName" style="width: 20%;"/>
          </el-form-item>

          <el-form-item label="触发条件">
            <el-select
              v-model="form.triggerType"
              placeholder="请选择"
              class="ideal-default-margin-right"
              style="width: 15%;"
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
              style="width: 10%;"
            >
              <el-option
                v-for="(item, index) of selectData.valueTypes"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>

            <el-select v-model="form.symbol" placeholder="请选择" class="ideal-default-margin-right" style="width: 15%;">
              <el-option
                v-for="(item, index) of selectData.symbols"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>

            <el-input v-model="form.triggerSize" class="ideal-default-margin-right" style="width: 20%;"/>

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
        </template>
        <template v-else>
          <el-form-item label="告警规则名称">
            <el-select
              v-model="form.alarmRuleSelect"
              placeholder="请选择"
              class="ideal-default-margin-right"
              style="width: 20%;"
            >
              <el-option
                v-for="(item, index) of selectData.alarmRuleSelects"
                :key="index"
                :label="item.platform"
                :value="item.platform"
              />
            </el-select>

            <svg-icon icon="refresh-icon" class="ideal-svg-margin-right" />
            <el-button link type="primary">购买弹性公网IP</el-button>
          </el-form-item>
        </template>
      </el-card>

      <el-card v-else-if="selectCase.isTimingPolicy" class="ideal-large-margin-top">
        <el-form-item label="时区">
          <div>GMT+08:00</div>
        </el-form-item>

        <el-form-item label="触发时间">
          <div>
            <el-date-picker
              v-model="form.triggerTime"
              type="datetime"
              placeholder="请选择"
            />

            <div class="ideal-tip-text">请确保触发时间晚于默认时间，并且晚于当前时间。</div>
          </div>
        </el-form-item>
      </el-card>

      <el-card v-else-if="selectCase.isCyclePolicy" class="ideal-large-margin-top">
        <el-form-item label="重复周期">
          <el-select
            v-model="form.repeatCycle"
            placeholder="请选择"
            class="ideal-default-margin-right"
          >
            <el-option
              v-for="(item, index) of selectData.repeatCycles"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item v-if="selectCase.isWeekCycle" label="选择星期">
          <ideal-cycle-select 
            :data-array="selectData.weekCycles"
            @clickCycleSelect="clickWeekCycleSelect"/>
        </el-form-item>

        <el-form-item v-else-if="selectCase.isMonthCycle" label="选择日期">
          <ideal-cycle-select 
            :data-array="selectData.monthCycles"
            @clickCycleSelect="clickMonthCycleSelect"/>
        </el-form-item>

        <el-form-item label="时区">
          <div>GMT+08:00</div>
        </el-form-item>

        <el-form-item label="触发时间">
          <el-time-picker v-model="form.triggerHour" />
        </el-form-item>

        <el-form-item label="生效时间">
          <div style="width: 20%;">
            <el-date-picker
              v-model="form.effectTime"
              type="daterange"
              range-separator="-"
              start-placeholder="请选择开始日期"
              end-placeholder="请选择结束日期"
            />
          </div>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="执行动作">
          <div style="width: 100%;">
            <div class="flex-row">
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
              <div>Mbit/s</div>
            </div>

            <div class="ideal-tip-text">由于带宽在不同的取值范围内步长不同，最终调整后的带宽会根据实际步长自动调整为就近值。</div>
          </div>
        </el-form-item>

        <el-form-item v-if="!selectCase.isSetAction" label="限制值">
          <el-input v-model="form.limitValue" class="ideal-default-margin-right" style="width: 20%;"/>
          <div>Mbit/s</div>
          <el-tooltip
            popper-class="custom-tooltip"
            effect="dark"
            content="执行动作为增加时，限制值表示带宽可调整的上限，执行动作为减少时，限制值表示带宽可调整的下限。"
            placement="right"
          >
            <svg-icon icon="question-icon" class="ideal-svg-margin-left"/>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="冷却时间(秒)">
          <el-input v-model="form.coolingTime" style="width: 20%;"/>

          <el-tooltip
            popper-class="custom-tooltip"
            effect="dark"
            content="冷却时间是指冷却伸缩活动的时间，在每次伸缩活动完成之后，系统开始计算冷却时间。在冷却时间内，会拒绝由告警策略触发的伸缩活动，其他类型的伸缩活动不受限制。"
            placement="right"
          >
            <svg-icon icon="question-icon" class="ideal-svg-margin-left"/>
          </el-tooltip>
        </el-form-item>
      </el-card>
    </el-form>

    <footer-view @clickCreateEvent="clickCreateEvent"></footer-view>
  </div>
</template>

<script setup lang="ts">
import footerView from './components/footer.vue'
import type { FormRules, FormInstance } from 'element-plus'
import { useCreate } from './create'
import store from '@/store'

const formRef = ref<FormInstance>()
const form = reactive({
  regionName: '',
  name: 'as-policy-' + Math.random().toString(36).substring(7), // 策略名称
  resourceType: 'eip', // 资源类型
  eip: '', // 弹性公网IP
  shareBandwidth: '', // 共享带宽
  policyType: 'alarm', // 策略类型
  alarmRule: 'create', // 告警规则
  alarmRuleName: '', // 告警规则名称
  triggerType: 'enterBandwidth', // 触发条件 (出入网-带宽、流量)
  valueType: 'maxValue', // 触发条件 (最大值最小值等)
  symbol: '1', // 触发条件 (大于小于等)
  triggerSize: '', // 触发条件 (大小)
  bandwidthUnit: '', // 触发条件 (单位)
  monitorCycle: '', // 监控周期
  continuous: '', // 连续出现次数
  alarmRuleSelect: '', // 告警规则名称
  triggerTime: '', // 触发时间
  repeatCycle: 'day', // 重复周期
  selectWeek: '', // 选择星期
  selectDate: '', // 选择日期
  triggerHour: '', // 触发时间
  effectTime: '', // 生效时间
  actionType: '1', // 执行动作
  actionSize: '',
  limitValue: '', // 限制值
  coolingTime: '' // 冷却时间(秒)
})
const rules = reactive<FormRules>({
  // vpc: [{ required: true, message: '请选择虚拟私有云', trigger: 'blur' }],
})

onBeforeMount(() => {
  if (store.resourceStore) {
    store.resourceStore.$subscribe(async(mutations: any, state: any) => {
      form.regionName = state?.regionInfo?.name
    })
  }
})
const { resourcePoolInfo, regionInfo } = storeToRefs(store.resourceStore)
onMounted(() => {
  // 右上角资源池区域是否选择
  if (regionInfo.value && resourcePoolInfo.value) {
    form.regionName = regionInfo.value.name
  }
})

const { 
  selectCase,
  selectData,
  clickMonthCycleSelect,
  clickWeekCycleSelect
} = useCreate(form)

// 创建
const clickCreateEvent = () => {}
</script>

<style scoped lang="scss">
.create {
  margin: $idealMargin $idealMargin 80px;
  :deep(.el-form) {
    padding: 0;
  }
}
</style>
<style lang="scss">
.custom-tooltip {
  max-width: 260px;
}
</style>
