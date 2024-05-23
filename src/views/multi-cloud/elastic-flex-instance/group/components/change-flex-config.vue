<template>
  <div class="change">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="计费模式" prop="billingMode">
        <el-radio-group v-model="form.billingMode">
          <el-radio-button label="onDemand">按需计费</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="名称" prop="name">
        <div>
          <el-input v-model="form.name"/>
          <div class="ideal-tip-text">使用该配置创建的云服务器名称为伸缩配置名称加八位随机码。</div>
        </div>
      </el-form-item>

      <el-form-item label="CPU架构">
        <el-radio-group v-model="form.cpuArchitecture">
          <el-radio-button
            v-for="(item, index) of cpuArchitectures"
            :key="index"
            :label="item.label">{{ item.value }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="规格" required>
        <div>
          <change-spec />
          <el-form-item prop="spec">
            <ideal-table-list
              row-key="uuid"
              :loading="state.dataListLoading"
              :table-data="state.dataList"
              :table-headers="tableHeaders"
              :page="state.page"
              :is-radio="true"
              :show-pagination="false"
              @clickTableCellRow="clickTableCellRow"
              @clickSizeChange="sizeChangeHandle"
              @clickCurrentChange="currentChangeHandle"
              @handleSelectionChange="selectionChangeHandle">
              <template #vCPUs>
                <el-table-column label="vCPUs" >
                  <template #default="props">
                    <div>{{ props.row.vcpus }}vCPUs | {{ props.row.memory }}GiB</div>
                  </template>
                </el-table-column>
              </template>

              <template #standard>
                <el-table-column label="基准/最大带宽" >
                  <template #default="props">
                    <div>{{ props.row.standard }}/{{ props.row.maxBandwidth }}Gbit/s</div>
                  </template>
                </el-table-column>
              </template>
            </ideal-table-list>
          </el-form-item>
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
import changeSpec from './change-spec.vue'
import type { FormRules, FormInstance } from 'element-plus'
import { generateCode } from '@/utils/tool'
import { EventEnum } from '@/utils/enum'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders } from '@/types'

const { t } = useI18n()
const formRef = ref<FormInstance>()
const form = reactive({
  billingMode: 'onDemand', // 计费模式
  name: 'as-config-' + generateCode(8), // 名称
  cpuArchitecture: '', // CPU架构
  spec: '' // 规格
})
const rules = reactive<FormRules>({
  billingMode: [{ required: true, message: '请选择计费模式', trigger: 'blur' }],
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  spec: [{ required: true, message: '请选择规格', trigger: 'blur' }],
})
const cpuArchitectures = ref<any[]>([
  { label: '1', value: 'x86计算' },
  { label: '2', value: '鲲鹏计算' }
])
// 列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList
} = useCrud(state)
state.dataList = [
  {
    uuid: '1',
    instanceName: '通用计算型s7',
    specName: 's7.small.1',
    vcpus: '1',
    memeory: '1',
    cpu: 'Inter Ice Lake',
    standard: '0.1',
    maxBandwidth: '0.8',
    intranet: '100000'
  }
]
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '实例名称', prop: 'instanceName' },
  { label: '规格名称', prop: 'specName' },
  { label: 'vCPUs', prop: 'vCPUs', useSlot: true },
  { label: 'CPU', prop: 'cpu' },
  { label: '基准/最大带宽', prop: 'standard', useSlot: true },
  { label: '内网收发包', prop: 'intranet' }
]
// 规格列表选择
const clickTableCellRow = (row: any) => {
  form.spec = row
}
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
.change {
  width: 100%;
  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
