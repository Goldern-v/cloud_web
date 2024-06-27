<template>
  <div class="main-netcard-bind">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item>
        <div class="flex-row main-netcard-bind__warning-tip">
          <svg-icon
            icon="info-warning"
            color="var(--el-color-primary)"
            class="ideal-svg-margin-right"
          ></svg-icon>
          <div>弹性网卡绑定服务器后，建议您设置网卡多队列以提升网络性能。</div>
        </div>
      </el-form-item>

      <el-form-item label="弹性网卡">
        <div>{{ form.netcard }}</div>
      </el-form-item>

      <el-form-item label="虚拟私有云">
        <div>{{ form.vpc }}</div>
      </el-form-item>

      <el-form-item label="选择实例">
        <div class="flex-column" style="width: 100%">
          <el-radio-group
            v-model="form.type"
            class="ideal-default-margin-right"
            style="margin-bottom: 10px"
          >
            <el-radio-button
              v-for="(item, index) in typeList"
              :key="index"
              :label="item.label"
            >
              {{ item.value }}
            </el-radio-button>
          </el-radio-group>

          <el-input v-model="searchValue" placeholder="请输入内容">
            <template #prepend>
              <div>模糊查询</div>
            </template>
            <template #suffix>
              <svg-icon
                icon="search-icon"
                @click="clickInstanceSearch"
              ></svg-icon>
            </template>
          </el-input>

          <ideal-table-list
            :table-data="state.dataList"
            :table-headers="tableHeaders"
            :is-multiple="true"
            :show-pagination="false"
          >
            <template #name>
              <el-table-column label="名称">
                <template #default="props">
                  <div class="ideal-theme-text">{{ props.row.name }}</div>
                </template>
              </el-table-column>
            </template>

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
        </div>
      </el-form-item>
    </el-form>

    <div class="flex-row main-netcard-bind--button">
      <el-button type="info" @click="cancelForm(formRef)">{{
        t('cancel')
      }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()
const formRef = ref<FormInstance>()
const form = reactive({
  netcard: 'subnet-e883', // 弹性网卡
  vpc: 'rtb-vpc-27d6(默认路由表)', // 虚拟私有云
  type: ''
})
const typeList: any = ref([
  { label: 'ECS', value: '云服务器' },
  { label: 'BMS', value: '裸金属服务器' }
])
const rules = reactive<FormRules>({})
// 安全组搜索
const searchValue = ref('')
// 安全组列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const {} = useCrud(state)

state.dataList = [
  {
    name: 'default',
    status: '关机',
    statusType: 'status-error',
    privateIp: '192.168.0.13',
    ipv6Address: '--',
    subnet: 'subnet-default'
  }
]
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '私有IP地址', prop: 'privateIp' },
  { label: 'IPV6地址', prop: 'ipv6Address' },
  { label: '子网', prop: 'subnet' }
]
const clickInstanceSearch = () => {}

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
.main-netcard-bind {
  width: 100%;
  :deep(.el-form) {
    padding: 0;
  }
  .main-netcard-bind__warning-tip {
    background-color: var(--custom-information-bg-color);
    padding: 20px;
    margin-bottom: 20px;
    width: 100%;
  }
  .main-netcard-bind--button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
