<template>
  <div class="balance-config">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
      class="balance-config-form"
    >
      <div class="flex-row header__title">
        <el-divider direction="vertical" />
        <div class="header__title-text">余额充值</div>
        <div class="ideal-tip-text">
          平台和运营管理员可以为一级VDC进行余额充值和配置。
        </div>
      </div>

      <el-form-item label="现金余额">
        <el-input
          v-model="form.cash"
          class="input-width"
          onkeyup="value=value.replace(/\D/g,'')"
        >
          <template #prepend>￥</template>
        </el-input>
      </el-form-item>
      <el-form-item label="可用额度">
        <el-input
          v-model="form.available"
          class="input-width"
          onkeyup="value=value.replace(/\D/g,'')"
        >
          <template #prepend>￥</template>
        </el-input>
      </el-form-item>
      <el-form-item label="充值金额">
        <el-input
          v-model="form.recharge"
          class="input-width"
          onkeyup="value=value.replace(/\D/g,'')"
        >
          <template #prepend>￥</template>
        </el-input>
      </el-form-item>
      <el-form-item label="告警阈值">
        <el-input
          v-model="form.alarmThreshold"
          class="input-width"
          onkeyup="value=value.replace(/\D/g,'')"
        >
          <template #prepend>%</template>
        </el-input>
      </el-form-item>

      <div class="flex-row header__title">
        <el-divider direction="vertical" />
        <div class="header__title-text">余额配置</div>
        <div class="ideal-tip-text">
          平台和运营管理员可以为下级VDC进行余额充值和配置。
        </div>
      </div>
    </el-form>

    <div class="balance-config-button">
      <el-button type="primary" @click="clickAdd">
        <svg-icon icon="circle-add" class="ideal-svg-margin-right"></svg-icon>
        添加一条
      </el-button>
    </div>

    <ideal-table-list
      class="balance-config-table"
      :table-data="dataList"
      :table-headers="tableHeaders"
      :show-pagination="false"
    >
      <template #vdc>
        <el-table-column label="选择VDC">
          <template #default="props">
            <el-select
              v-model="props.row.vdc"
              class="vbf-item"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) of vdcList"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
      </template>
      <template #govern>
        <el-table-column label="已支配金额￥">
          <template #default="props">
            <el-input
              v-model="props.row.govern"
              onkeyup="value=value.replace(/\D/g,'')"
            />
          </template>
        </el-table-column>
      </template>
      <template #balance>
        <el-table-column label="剩余金额￥">
          <template #default="props">
            <el-input
              v-model="props.row.balance"
              onkeyup="value=value.replace(/\D/g,'')"
            />
          </template>
        </el-table-column>
      </template>
      <template #alarmThreshold>
        <el-table-column label="告警阈值%">
          <template #default="props">
            <el-input
              v-model="props.row.alarmThreshold"
              onkeyup="value=value.replace(/\D/g,'')"
            />
          </template>
        </el-table-column>
      </template>
      <template #operation>
        <el-table-column label="操作" width="120">
          <template #default="props">
            <el-button link type="primary" @click="clickDelete(props.$index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <div class="flex-row footer-button">
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('save')
      }}</el-button>
      <el-button @click="cancelForm(formRef)">{{ t('back') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import type { IdealTableColumnHeaders } from '@/types'

const { t } = useI18n()

const formRef = ref<FormInstance>()
const form = reactive({
  cash: '', // 现金余额
  available: '', // 可用额度
  recharge: '', // 充值金额
  alarmThreshold: '' // 告警阈值
})
const rules = reactive<FormRules>({})

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '选择VDC', prop: 'vdc', useSlot: true },
  { label: '支配金额￥', prop: 'govern', useSlot: true },
  { label: '剩余金额￥', prop: 'balance', useSlot: true },
  { label: '告警阈值%', prop: 'alarmThreshold', useSlot: true }
]
const dataList: any = ref([])
const vdcList: any = ref([])

const clickAdd = () => {
  dataList.value.push({ vdc: '', govern: '', balance: '', alarmThreshold: '' })
}
const clickDelete = (index: number) => {
  dataList.value.splice(index, 1)
}

const router = useRouter()
const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  router.back()
}
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate((valid: boolean) => {
    if (!valid) {
      return
    }
  })
}
</script>

<style scoped lang="scss">
.balance-config {
  width: 100%;
  .balance-config-form {
    padding: 20px;
    background-color: white;
    .input-width {
      width: 300px;
    }
    .header__title {
      background-color: var(--el-color-primary-light-9);
      line-height: $headerContainerHeight;
      height: $headerContainerHeight;
      align-items: center;
      margin-bottom: 10px;
      :deep(.el-divider--vertical) {
        border-left: 2px var(--el-color-primary) solid;
      }
      .header__title-text {
        font-size: 16px;
        font-weight: 500;
        color: #000000;
        margin-right: 10px;
      }
    }
  }
  .balance-config-button {
    width: 100%;
    padding-left: 20px;
    background-color: white;
  }
  .balance-config-table {
    padding: 20px;
  }
  .footer-button {
    margin-top: 5px;
    padding: 20px;
    background-color: white;
    justify-content: flex-start;
    align-items: center;
  }
}
</style>
