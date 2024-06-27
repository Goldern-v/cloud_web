<template>
  <div class="main-netcard-create">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" class="main-netcard-content" />
      </el-form-item>

      <el-form-item label="虚拟私有云" prop="vpc">
        <div class="flex-row main-netcard-content">
          <el-select
            v-model="form.vpc"
            placeholder="请选择"
            class="main-netcard-input"
          >
            <el-option
              v-for="(item, idx) of vpcList"
              :key="idx"
              :label="item.otherName"
              :value="item.otherId"
            >
              {{ item.otherName }}
            </el-option>
          </el-select>

          <svg-icon
            icon="refresh-icon"
            class="ideal-svg-margin-left"
          ></svg-icon>
        </div>
      </el-form-item>

      <el-form-item label="所属子网" prop="subnet">
        <div class="flex-column" style="width: 100%">
          <div class="flex-row main-netcard-content">
            <el-select
              v-model="form.subnet"
              placeholder="请选择"
              class="main-netcard-input"
            >
              <el-option
                v-for="(item, idx) of subnetList"
                :key="idx"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <svg-icon
              icon="refresh-icon"
              class="ideal-svg-margin-left"
            ></svg-icon>
          </div>

          <div class="ideal-theme-text">查看已有子网</div>
          <div>可用IP数：249</div>
        </div>
      </el-form-item>

      <el-form-item label="私有IP地址">
        <el-radio-group
          v-model="form.privateIp"
          class="ideal-default-margin-right"
        >
          <el-radio-button
            v-for="(item, index) in privateIpList"
            :key="index"
            :label="item.label"
          >
            {{ item.value }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="安全组">
        <el-input v-model="searchValue" placeholder="请输入内容">
          <template #prepend>
            <div>模糊查询</div>
          </template>
          <template #suffix>
            <svg-icon
              icon="search-icon"
              @click="clickSafeGroupSearch"
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
        </ideal-table-list>
      </el-form-item>
    </el-form>

    <div class="flex-row main-netcard-create--button">
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
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { FormRules, FormInstance } from 'element-plus'
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()
const formRef = ref<FormInstance>()
const form = reactive({
  name: '', // 名称
  vpc: '', // 虚拟私有云
  subnet: '', // 所属子网
  privateIp: '', // 私有IP地址
  safeGroup: '' // 安全组
})
const vpcList: any = []
const subnetList: any = []
const privateIpList: any = ref([
  { value: '自动分配IP地址', label: 'auto' },
  { value: '手动指定IP地址', label: 'manual' }
])

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  vpc: [{ required: true, message: '请选择虚拟私有云', trigger: 'blur' }],
  subnet: [{ required: true, message: '请选择所属子网', trigger: 'blur' }],
  safeGroup: [{ required: true, message: '请选择安全组', trigger: 'blur' }]
})
// 安全组搜索
const searchValue = ref('')
// 安全组列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const { getDataList } = useCrud(state)

state.dataList = [
  { name: 'default', rule: '入方向:放通;|出方向:放通' },
  { name: 'Sys-FullAccess', rule: '入方向:放通;|出方向:放通' }
]
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true },
  { label: '访问规则', prop: 'rule' }
]
// 搜索
const clickSafeGroupSearch = () => {
  state.queryForm = {}
  getDataList()
}
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
.main-netcard-create {
  width: 100%;
  :deep(.el-form) {
    padding: 0 20px;
  }
  .main-netcard-create--button {
    justify-content: flex-end;
    align-items: center;
    padding: 0 20px;
  }
  .main-netcard-content {
    width: 60%;
    justify-content: space-between;
  }
  .main-netcard-input {
    width: 92%;
  }
}
</style>
