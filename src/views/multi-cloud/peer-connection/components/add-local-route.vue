<template>
  <div class="add-local-route">
    <div class="flex-row add-local-route__warning-tip">
      <svg-icon icon="info-warning" color="var(--el-color-primary)" class="ideal-svg-margin-right"></svg-icon>
      <div>目的地址为对端VPC网段或子网网段。目的地址与全部本端VPC已建立对等连接子网不能重叠、相同。</div>
    </div>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
    >
      <el-form-item label="IP类型" prop="ipType">
        <el-radio-group
          v-model="form.ipType"
        >
          <el-radio-button
            v-for="(item, index) in ipTypeList"
            :key="index"
            :label="item.label"
          >
          {{ item.value }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="子网IPv4网段" prop="ipv4SubnetNetwork">
        <div class="flex-column" style="align-items: flex-start;">
          <ideal-ip-input
            :ip-value="form.ipv4SubnetNetwork"
            port-split="/"
            class="ideal-default-margin-top"
            @listenChange="ipv4ChangeEvent"
          ></ideal-ip-input>

          <div class="ideal-tip-text">每次最多支持添加20条路由，还可以添加18条</div>
          <el-button link type="primary">添加目的地址</el-button>
        </div>
      </el-form-item>

      <el-form-item label="下一跳地址">
        <div class="ideal-default-margin-right">{{ form.nextAddress }}</div>
        <el-tooltip
          popper-class="custom-tooltip"
          effect="dark"
          content="下一跳地址"
          placement="right"
        >
          <svg-icon icon="question-icon"></svg-icon>
        </el-tooltip>
      </el-form-item>

      <el-form-item>
        <el-divider border-style="dashed"/>
      </el-form-item>

      <el-form-item>
        <template #label>
          <div class="flex-row">
            <div style="width: 100px;">隐藏本端VPC</div>
            <svg-icon icon="down-arrow"></svg-icon>
          </div>
        </template>
      </el-form-item>

      <el-form-item label="VPC名称">
        <div>{{ form.vpcName }}</div>
      </el-form-item>
    </el-form>

    <ideal-table-list
      style="padding: 0 20px;"
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :show-pagination="false">
    </ideal-table-list>

    <div class="flex-row peer-connection--button">
      <el-button type="info" @click="cancelForm(formRef)"
        >{{ t('cancel') }}</el-button
      >
      <el-button type="primary" @click="submitForm(formRef)"
        >{{ t('confirm') }}</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import type { IdealTableColumnHeaders } from '@/types'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()
const formRef = ref<FormInstance>()
const form = reactive({
  ipType: '', //IP类型
  ipv4SubnetNetwork: '', // 子网IPv4网段
  nextAddress: 'dd4c04c-b849-4729-8a07-7a291ac069a7', // 下一跳地址
  vpcName: 'dd4c04c-b849-4729-8a07-7a291ac069a7', // VPC名称
})
const ipTypeList = ref<any>([
  { value: 'IPV4', label: 'IPV4' },
  { value: 'IPV6', label: 'IPV6' }
])

const rules = reactive<FormRules>({
  ipType: [{ required: true, message: '请选择IP类型', trigger: 'blur'}],
  ipv4SubnetNetwork: [{ required: true, message: '请输入子网IPv4网段', trigger: 'blur'}]
})
// 子网IPv4网段输入
const ipv4ChangeEvent = (val: string) => {
  form.ipv4SubnetNetwork = val
}
// 列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const {} = useCrud(state)

state.dataList = [
  { subnet: 'local', network: '192.168.0.11' }
]
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '子网', prop: 'subnet' },
  { label: '网段', prop: 'network' }
]
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
  formEl.validate((valid: any) => {
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
.add-local-route {
  width: 100%;
  :deep(.el-form) {
    padding: 0 20px;
  }
  .add-local-route__warning-tip {
    background-color: var(--custom-information-bg-color);
    padding: 20px;
    margin-bottom: 20px;
  }
  .peer-connection--button {
    margin-top: 20px;
    justify-content: flex-end;
    align-items: center;
  }
  .vpc-create-button {
    color: var(--el-color-primary);
  }
  .peer-connection__tip {
    background-color: $gray1-light;
    padding: 10px;
    align-items: center;
    width: 100%;
  }
  .peer-connection-input {
    width: 100%;
  }
}
</style>
<style lang="scss">
.custom-tooltip {
  max-width: 260px;
}
</style>
