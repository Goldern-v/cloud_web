<template>
  <div class="create">
    <div class="flex-row tip">
      <svg-icon
        icon="info-warning"
        class-name="info-warning"
        class="ideal-svg-margin-right"
      />
      <div>
        【创建桶】、【获取桶列表】两个服务级的操作权限，需要您通过统一身份认证进行配置。
      </div>
    </div>

    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="策略名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>

      <el-form-item label="效力" prop="potency">
        <el-radio-group v-model="form.potency">
          <el-radio label="allow">允许</el-radio>
          <el-radio label="refuse">拒绝</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="被授权用户" prop="user">
        <el-checkbox-group v-model="form.user" style="padding-top: 10px">
          <el-checkbox style="display: block" label="所有账号" />
          <el-checkbox style="display: block" label="当前账号" />
          <el-checkbox style="display: block" label="其他账号" />
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="授权资源" prop="resource">
        <el-checkbox-group v-model="form.resource">
          <el-checkbox label="整个桶(包括桶内对象)" />
          <el-checkbox label="当前桶" />
          <el-checkbox label="指定对象" />
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="授权操作" prop="operator">
        <el-radio-group v-model="form.operator">
          <el-radio label="template">模版配置</el-radio>
          <el-radio label="custom">自定义配置</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="授权条件(可选)">
        <div>
          <div class="flex-row">
            <el-button class="ideal-default-margin-right">增加条件</el-button>
            <div>
              本规则生效的所需条件，以此限定规则的生效范围，通过键值表达式实现。
            </div>
          </div>

          <ideal-table-list
            :loading="state.dataListLoading"
            :table-data="state.dataList"
            :table-headers="tableHeaders"
            :page="state.page"
            :show-pagination="false"
            @clickSizeChange="sizeChangeHandle"
            @clickCurrentChange="currentChangeHandle"
            @handleSelectionChange="selectionChangeHandle"
          >
            <template #operation>
              <el-table-column label="操作" width="125" fixed="right">
                <template #default="props">
                  <ideal-table-operate
                    :buttons="operateBtns"
                    @clickMoreEvent="clickOperateEvent($event, props.row)"
                  >
                  </ideal-table-operate>
                </template>
              </el-table-column>
            </template>
          </ideal-table-list>
        </div>
      </el-form-item>
    </el-form>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum } from '@/utils/enum'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders, IdealTableColumnOperate } from '@/types'

const { t } = useI18n()

const formRef = ref<FormInstance>()
const form = reactive({
  name: '', // 策略名称
  potency: '', // 效力
  user: [] as any[], // 被授权用户
  resource: [] as any[], // 授权资源
  operator: '' // 授权操作
})
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入策略名称', trigger: 'blur' }],
  potency: [{ required: true, message: '请选择效力', trigger: 'blur' }],
  user: [{ required: true, message: '请选择被授权用户', trigger: 'blur' }],
  resource: [{ required: true, message: '请选择授权资源', trigger: 'blur' }],
  operator: [{ required: true, message: '请选择授权操作', trigger: 'blur' }]
})

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
  getDataList,
  deleteHandle
} = useCrud(state)

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '键', prop: 'key' },
  { label: '条件运算符', prop: 'operator' },
  { label: '值', prop: 'value' }
]
// 操作
const operateBtns: IdealTableColumnOperate[] = [
  // { title: '分享', prop: 'share' }
]
const clickOperateEvent = (command: string | number | object, row: any) => {}
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
    emit(EventEnum.success)
  })
}
</script>

<style scoped lang="scss">
.create {
  width: 100%;
  .tip {
    align-items: center;
    background-color: var(--el-color-primary-light-9);
    border: var(--el-color-primary);
    padding: 10px;
  }
  :deep(.info-warning) {
    color: var(--el-color-primary);
  }
}
</style>
