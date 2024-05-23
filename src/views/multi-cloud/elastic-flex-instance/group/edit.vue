<template>
  <div class="edit">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" class="input-box"/>
      </el-form-item>

      <el-form-item label="最大实例数(台)" prop="maxNumber">
        <el-input v-model="form.maxNumber" class="input-box"/>
      </el-form-item>

      <el-form-item label="期望实例数(台)" prop="expectNumber">
        <el-input v-model="form.expectNumber" class="input-box"/>
      </el-form-item>

      <el-form-item label="最小实例数(台)" prop="minNumber">
        <el-input v-model="form.minNumber" class="input-box"/>
      </el-form-item>

      <el-form-item label="冷却时间(秒)" prop="coolingTime">
        <el-input v-model="form.coolingTime" class="input-box"/>
      </el-form-item>

      <el-form-item label="可用区" prop="availableArea">
        <el-select
            v-model="form.availableArea"
            multiple
            placeholder="请选择"
            class="input-box"
          >
            <el-option
              v-for="item in availableAreas"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
      </el-form-item>

      <el-form-item label="多可用区扩展策略" prop="expandPolicy">
        <el-radio-group v-model="form.expandPolicy">
          <el-radio label="1">均衡分布</el-radio>
          <el-radio label="2">选择优先</el-radio>
        </el-radio-group>

        <el-tooltip
          popper-class="custom-tooltip"
          effect="dark"
          content="均衡分布: 弹性云服务器扩容时优先保证选择的可用区列表中各可用区下弹性云服务器数量均衡，当无法在目标可用区下完成弹性云服务器扩容时，按照选择优先原则选择其他可用区。选择优先: 弹性云服务器扩容时目标可用区的选择按照选择的可用区列表的顺序进行优先级排序。"
          placement="right"
        >
          <svg-icon icon="question-icon" class="ideal-svg-margin-left" />
        </el-tooltip>
      </el-form-item>

      <el-form-item label="负载均衡">
        <div style="width: 100%;">
          <div class="flex-row">
            <el-radio-group v-model="form.lbsType">
              <el-radio-button label="noUse">不使用</el-radio-button>
              <el-radio-button label="used">使用弹性负载均衡</el-radio-button>
            </el-radio-group>

            <svg-icon v-if="useLbs" icon="refresh-icon" class="ideal-svg-margin-right ideal-svg-margin-left"/>
            <el-button v-if="useLbs" link type="primary">新建弹性负载均衡</el-button>
          </div>

          <lbs-group v-if="useLbs" style="width: 100%;"/>
        </div>
      </el-form-item>

      <el-form-item label="健康检查方式" prop="healthMode">
        <div style="width: 100%;">
          <div class="flex-row">
            <el-select
              v-model="form.healthMode"
              placeholder="请选择"
              class="input-box"
            >
              <el-option
                v-for="(item, index) of healthModes"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>

            <el-tooltip
              popper-class="custom-tooltip"
              effect="dark"
              content="健康检查会将异常的虚拟机从伸缩组中移除，并重新创建新的虚拟机。云服务器健康检查方式是对虚拟机的运行状态进行检查，如关机、删除都是虚拟机异常状态。ELB健康检查方式是根据ELB对虚拟机的健康检查结果进行的检查。"
              placement="right"
            >
              <svg-icon icon="question-icon" class="ideal-svg-margin-left" />
            </el-tooltip>
          </div>
        </div>
      </el-form-item>
    </el-form>

    <div class="flex-row footer-button">
      <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import lbsGroup from './components/lbs-group.vue'
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()
const formRef = ref<FormInstance>()
const form = reactive({
  name: '', // 名称
  maxNumber: '', // 最大实例数(台)
  expectNumber: '', // 期望实例数(台)
  minNumber: '', // 最小实例数(台)
  coolingTime: '', // 冷却时间
  availableArea: '', // 可用区
  expandPolicy: '', // 多可用区扩展策略
  lbsType: '', // 负载均衡
  healthMode: '' // 健康检查方式
})
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  maxNumber: [{ required: true, message: '请输入最大实例数', trigger: 'blur' }],
  expectNumber: [{ required: true, message: '请输入期望实例数', trigger: 'blur' }],
  minNumber: [{ required: true, message: '请输入最小实例数', trigger: 'blur' }],
  coolingTime: [{ required: true, message: '请输入冷却时间', trigger: 'blur' }],
  availableArea: [{ required: true, message: '请选择多可用区扩展策略', trigger: 'blur' }],
  healthMode: [{ required: true, message: '请选择健康检查方式', trigger: 'blur' }]
})
const availableAreas = ref<any[]>([])

const useLbs = computed(() => form.lbsType === 'used')

const healthModes = ref<any[]>([
  { label: '负载均衡健康检查', value: 'lbs' },
  { label: '云服务器健康检查', value: 'ecs' }
])

// 方法
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
      emit(EventEnum.success)
    } else {
      console.log('error submit!')
      return false
    }
  })
}
</script>

<style scoped lang="scss">
.edit {
  width: 100%;
  .input-box {
    width: 70%;
  }
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
