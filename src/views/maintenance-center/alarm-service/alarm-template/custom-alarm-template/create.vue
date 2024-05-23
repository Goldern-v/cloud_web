<template>
  <div class="custom-alarm-template-create">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
      class="template-create-form"
    >
      <el-form-item>
        <div class="flex-row ideal-header-container">
          <el-divider direction="vertical" />
          <div>模板信息</div>
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
          <div>监控对象</div>
        </div>
      </el-form-item>

      <el-form-item label="资源类型" prop="resourceType">
        <el-select
          v-model="form.resourceType"
          placeholder="请选择资源类型"
          class="custom-input"
          @change="handleResourceTypeChange"
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

      <el-form-item v-if="!isEdit" label="模板来源" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio-button
            v-for="(item, index) in resourceOptions"
            :key="index"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        v-if="form.type === 'DEFAULT'"
        label="模板导入"
        prop="template"
      >
        <el-select
          v-model="form.template"
          placeholder="请选择默认告警模版"
          class="custom-input"
        >
          <el-option
            v-for="(item, index) in templateList"
            :key="index"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="form.type === 'DEFAULT' ? '模板规则' : '规则描述'">
        <rule-description
          ref="ruleDescriptionRef"
          style="width: 60%"
          :default-rule="form.templateRuleData"
          :indicator-list="indicatorList"
        ></rule-description>
      </el-form-item>
    </el-form>

    <el-card>
      <div class="flex-row footer">
        <el-button type="primary" @click="submitForm(formRef)">{{
          t('save')
        }}</el-button>
        <el-button @click="cancelForm(formRef)">{{ t('back') }}</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import ruleDescription from '../../alarm-rule/components/rule-description.vue'
import { resourceOptions } from './common'
import { createData } from './create'

const { t } = useI18n()

const {
  formRef,
  form,
  rules,
  resourceList,
  indicatorList,
  templateList,
  defaultRule, //编辑时回显已存在自定义规则
  handleResourceTypeChange,
  submitForm,
  cancelForm,
  ruleDescriptionRef,
  isEdit
} = createData()

const thresholdRuleRef = ref() //阈值规则组件

onMounted(() => {})
</script>

<style scoped lang="scss">
.custom-alarm-template-create {
  padding: $idealPadding;
  :deep(.el-divider--vertical) {
    border-left: 1px var(--el-color-primary) var(--el-border-style);
  }
  .template-create-form {
    background-color: white;
    padding: $idealPadding;
  }
  :deep(.el-radio-button__inner) {
    width: 115px;
  }

  :deep(.svg-icon svg) {
    fill: var(--el-color-primary);
  }
  .custom-input {
    width: 20%;
  }
  .ideal-header-container {
    width: 100%;
  }
}
</style>
