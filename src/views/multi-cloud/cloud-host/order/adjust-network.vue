<template>
  <div class="adjust-network">
    <div class="adjust-network-original">
      <div class="flex-row adjust-network__tip">
        <svg-icon
          icon="info-warning"
          color="#F3AD3C"
          class="ideal-svg-margin-right"
        ></svg-icon>
        <span>以下弹性云主机将进行调整网络操作</span>
      </div>

      <ideal-table-list
        :table-data="originalData"
        :table-headers="originalHeader"
        :show-pagination="false"
      >
        <template #name>
          <el-table-column label="名称/ID" show-overflow-tooltip>
            <template #default="props">
              <div>{{ props.row.name }}</div>
              <div>{{ props.row.id }}</div>
            </template>
          </el-table-column>
        </template>
      </ideal-table-list>
    </div>

    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="云硬盘">
        <ideal-table-list
          row-key="name"
          :table-data="state.dataList"
          :table-headers="tableHeaders"
          :is-radio="true"
          :show-pagination="false"
        >
          <template #status>
            <el-table-column label="状态">
              <template #default="props">
                <ideal-status-icon
                  :status-icon="props.row.statusType"
                  :status-text="props.row.status"
                ></ideal-status-icon>
              </template>
            </el-table-column>
          </template>
        </ideal-table-list>
      </el-form-item>

      <el-form-item label="弹性IP" prop="adjustNetworkSize">
        <el-input-number v-model="form.eipSize" :min="1" :max="1000" />
      </el-form-item>
    </el-form>

    <div class="flex-row footer-button">
      <div>配置费用: <span class="footer-button-price">0.06元/时/M</span></div>
      <div class="flex-row">
        <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
        <el-button type="primary" @click="submitForm(formRef)">{{
          t('confirm')
        }}</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum } from '@/utils/enum'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { FormRules, FormInstance } from 'element-plus'

interface AdjustNetworkProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<AdjustNetworkProps>(), {
  rowData: () => ({})
})

const { t } = useI18n()
// 原有规格数据
const originalData: any = ref([
  // props.rowData
  {
    name: 'est1.1',
    id: '3435335355ss',
    spec: 's6.2xlarge.2',
    config: '8核｜16G'
  }
])
const originalHeader: IdealTableColumnHeaders[] = [
  { label: '云主机名称/ID', prop: 'name', useSlot: true },
  { label: '实例规格', prop: 'spec' },
  { label: '实例配置', prop: 'config' }
]
// 表单
const formRef = ref<FormInstance>()
const form = reactive({
  spec: '',
  eipSize: 0
})
const rules = reactive<FormRules>({
  adjustNetworkSize: [
    { required: true, message: '请选择扩容容量', trigger: 'blur' }
  ]
})
// 网络列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const { getDataList } = useCrud(state)
state.dataList = [
  {
    name: 'ebs-1hve',
    status: '运行中',
    statusType: 'status-success',
    ip: '192.168.2.3/10',
    id: '1233224',
    bandwidth: '100'
  },
  {
    name: 'ebs-2hve',
    status: '运行中',
    statusType: 'status-success',
    ip: '192.168.2.3/10',
    id: '5334267',
    bandwidth: '200'
  },
  {
    name: 'ebs-3hve',
    status: '运行中',
    statusType: 'status-success',
    ip: '192.168.2.3/10',
    id: '9754692',
    bandwidth: '150'
  }
]
// 升级表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: 'IP名称', prop: 'name' },
  { label: '弹性公网IP', prop: 'ip' },
  { label: 'ID', prop: 'id' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '带宽大小', prop: 'bandwidth' }
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
  formEl.validate((valid: boolean) => {
    if (!valid) {
      return
    }
    console.log('submit!')
    emit(EventEnum.success)
  })
}
</script>

<style scoped lang="scss">
.adjust-network {
  width: 100%;
  .adjust-network-original {
    padding: 0 17px;
    .adjust-network__tip {
      background-color: #fefbed;
      padding: 20px;
      align-items: center;
      margin: 10px 0;
    }
  }
  .footer-button {
    justify-content: space-between;
    align-items: center;
    .footer-button-price {
      color: var(--el-color-primary);
    }
  }
}
</style>
