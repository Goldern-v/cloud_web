<template>
  <div class="alarm-rule-create">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
      class="rule-create-form"
    >
      <el-form-item>
        <div class="flex-row ideal-header-container">
          <el-divider direction="vertical" />
          <div>规则信息</div>
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
          placeholder="请选择"
          class="custom-input"
          :disabled="isEdit"
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

      <el-form-item label="资源范围" prop="range">
        <el-radio-group v-model="form.range">
          <el-radio-button
            v-for="(item, index) in resourceRangeList"
            :key="index"
            :label="item.value"
            :disabled="isEdit"
          >
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="关联实例" prop="example">
        <el-input
          v-if="form.range === 'ALL_INSTANCE'"
          v-model="form.instance"
          placeholder="选定类型下全部资源"
          class="custom-input"
          disabled
        >
        </el-input>

        <template v-if="form.range === 'MULTI_INSTANCE'">
          <el-select
            v-model="form.resourceUuids"
            multiple
            collapse-tags
            collapse-tags-tooltip
            placeholder="请选择"
            class="custom-input ideal-default-margin-right"
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
              :disabled="!form.resourceType"
              @click="openSelectExample"
              >选择实例</el-button
            >
          </el-tooltip>
        </template>
      </el-form-item>

      <el-form-item>
        <div class="flex-row ideal-header-container">
          <el-divider direction="vertical" />
          <div>告警规则</div>
        </div>
      </el-form-item>

      <el-form-item v-if="!isEdit" label="规则来源" prop="ruleSource">
        <el-radio-group v-model="form.ruleSource">
          <el-radio-button
            v-for="(item, index) in ruleSourceList"
            :key="index"
            :label="item.value"
            :disabled="isEdit"
          >
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <template v-if="form.ruleSource === 'custom'">
        <el-form-item label="规则描述" prop="ruleDescription">
          <rule-description
            ref="ruleDescriptionRef"
            style="width: 60%"
            :indicator-list="indicatorList"
          ></rule-description>
        </el-form-item>
      </template>

      <template v-if="form.ruleSource === 'template-import'">
        <el-form-item label="模板导入" prop="templateImport">
          <el-select
            v-model="form.templateImport"
            placeholder="请选择"
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

        <el-form-item label="模板规则" prop="templateRuleData">
          <ideal-table-list
            :table-data="form.templateRuleData"
            :table-headers="tableHeaders"
            :show-pagination="false"
            style="width: 60%"
          >
            <template #operation>
              <el-table-column label="操作" width="120">
                <template #default="props">
                  <svg-icon
                    icon="delete-icon"
                    @click="deleteTemplateRule(props.$index)"
                  ></svg-icon>
                </template>
              </el-table-column>
            </template>
          </ideal-table-list>
        </el-form-item>
      </template>

      <el-form-item>
        <div class="flex-row ideal-header-container">
          <el-divider direction="vertical" />
          <div>告警通知</div>
        </div>
      </el-form-item>
      <el-form-item label="发送通知" prop="enableNotification">
        <el-switch
          v-model="form.enableNotification"
          @change="handleSwitchChange"
        />
      </el-form-item>

      <template v-if="form.enableNotification">
        <el-form-item label="告警联系组">
          <el-select
            v-model="form.alarmContactGroup"
            placeholder="请选择告警联系组"
            multiple
            class="custom-input"
          >
            <el-option
              v-for="(item, index) in contactGroupList"
              :key="index"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>

          <el-text
            type="primary"
            style="margin-left: 5px"
            @click="createContactGroup"
            >新建联系组</el-text
          >
        </el-form-item>

        <el-form-item label="生效时间">
          <div>
            <el-time-picker
              v-model="form.effectTime"
              is-range
              range-separator="--"
              start-placeholder="请选择开始时间"
              end-placeholder="请选择结束时间"
              format="HH:mm:ss"
              value-format="HH:mm:ss"
            />
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

    <!-- 选择实例弹窗 -->
    <instance
      v-if="showSelectExample"
      ref="exampleRef"
      :detail-info="detailed || {}"
      :resource-type="form.resourceType"
      :is-edit="isEdit"
      @clickCloseEvent="closeSelectExample"
      @clickSuccessEvent="clickSuccessEvent"
    ></instance>

    <!-- 新建联系组 -->
    <dialog-box
      v-if="showDialog"
      type="createContactGroup"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    >
    </dialog-box>
  </div>
</template>

<script setup lang="ts">
import dialogBox from '../alarm-notification/dialog-box.vue'
import ruleDescription from './components/rule-description.vue'
import { createData } from './create'
import instance from './components/instance.vue'
import { resourceRangeList, ruleSourceList } from './components/common'

const { t } = useI18n()
const {
  exampleRef,
  isEdit,
  detailed,
  getExpenseType,
  indicatorList,
  contactGroupList,
  formRef,
  form,
  rules,
  tableHeaders,
  resourceList,
  instanceList,
  deleteTemplateRule,
  cancelForm,
  submitForm,
  ruleDescriptionRef,
  templateList,
  createContactGroup,
  showDialog,
  clickCloseEvent,
  clickRefreshEvent,
  handleSwitchChange
} = createData()

onMounted(() => {
  getExpenseType()
})

// 弹窗状态
const showSelectExample = ref(false)
//  弹窗打开
const openSelectExample = () => {
  document.getElementById('instance-select-btn')?.blur()
  showSelectExample.value = true
}
//  弹窗关闭
const closeSelectExample = () => {
  showSelectExample.value = false
}
const clickSuccessEvent = (value: any) => {
  form.resourcePoolId = value
  showSelectExample.value = false
  instanceList.value = exampleRef.value.dataList
  const list: any = ref([])
  instanceList.value.forEach((item: any) => {
    list.value.push(item.uuid)
  })
  form.resourceUuids = list
}
</script>

<style scoped lang="scss">
.alarm-rule-create {
  padding: $idealPadding;
  :deep(.el-divider--vertical) {
    border-left: 1px var(--el-color-primary) var(--el-border-style);
  }
  .rule-create-form {
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
  .ideal-header-container {
    width: 100%;
  }
}
.contacts .el-form-item__content {
  :deep(.el-form-item__error) {
    padding-left: 10px !important;
  }
}
.ideal-table-list__container {
  padding: 0;
}
</style>
