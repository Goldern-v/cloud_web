<template>
  <div class="add-extension">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
    >
      <el-form-item label="安全组">
        <div>{{ form.safeGroup }}</div>
      </el-form-item>

      <el-form-item label="扩展网卡">
        <div style="width:100%;">
          <ideal-select-search
            class="ideal-default-margin-top"
            :options="searchOptions"
            @clickSearch="clickSearch"
            @clickReset="clickReset"
          />

          <ideal-table-list
            :table-data="state.dataList"
            :table-headers="tableHeaders"
            :show-pagination="false"
            :is-multiple="true">
            <template #status>
              <el-table-column label="状态" width="120">
                <template #default="props">
                  <ideal-status-icon
                    v-if="props.row.status"
                    :status-icon="props.row.statusType"
                    :status-text="props.row.statusDes"
                  />
                </template>
              </el-table-column>
            </template>
          </ideal-table-list>
          <el-text v-if="!selected" type="danger">您还没有选择扩展网卡。</el-text>
        </div>
      </el-form-item>
        
    </el-form>

    <div class="flex-row footer-button">
      <el-button @click="cancelForm(formRef)"
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
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { EventEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders } from '@/types'

const { t } = useI18n()
const formRef = ref<FormInstance>()
const form = reactive({
  safeGroup: 'Sys-defaultAccess', // 安全组
  extension: '' // 扩展网卡
})
const rules = reactive<FormRules>({})

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const { getDataList } = useCrud(state)
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '私有IP地址', prop: 'privateIp' },
  { label: 'IPv6地址', prop: 'ipv6' },
  { label: '子网', prop: 'subnet' },
  { label: '关联服务器名称', prop: 'relateServer' },
]
const selected = ref(false)
watch(() => state.dataListSelections, value => {
  selected.value = false
  if (value?.length) {
    selected.value = true
  }
})
// 搜索
const clickSearch = (search: string, type: string) => {
  state.queryForm.type = type
  state.queryForm.search = search
  getDataList()
}
// 重置
const clickReset = () => {
  state.page = 1
  state.queryForm = {}
  getDataList()
}
// 列表下拉搜索
const searchOptions = [
  { label: '名称', prop: 'name' },
  { label: 'ID', prop: 'uuid' }
]

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
.add-extension {
  width: 100%;
  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
