<template>
  <div class="basic-config">
    <el-form
      ref="basicFormRef"
      :model="basicForm"
      :rules="rules"
      label-position="left"
    >
      <el-card>
        <el-form-item>
          <p>基本信息</p>
        </el-form-item>

        <el-form-item label="计费方式" prop="billingMode">
          <el-radio-group v-model="basicForm.billingMode" class="custom-radio">
            <el-radio-button
              v-for="item of chargeModeList"
              :key="item.label"
              type="text"
              :label="item.label"
              >{{ item.name }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="区域">
          <div>{{ basicForm.regionName }}</div>
        </el-form-item>

        <el-form-item label="名称" prop="elbName">
          <el-input v-model="basicForm.elbName" class="custom-input" />
        </el-form-item>

        <el-form-item label="描述">
          <el-input
            v-model="basicForm.remark"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            class="custom-input"
          />
        </el-form-item>

        <el-form-item>
          <template #label>
            <div class="flex-row">
              <div>更多</div>
              <svg-icon
                v-if="!moreConfig"
                icon="down-arrow"
                class="ideal-svg-margin-left"
                @click="moreConfig = !moreConfig"
              ></svg-icon>
              <svg-icon
                v-if="moreConfig"
                icon="up-arrow"
                class="ideal-svg-margin-left"
                @click="moreConfig = !moreConfig"
              ></svg-icon>
            </div>
          </template>
          <div>标签</div>
        </el-form-item>
        <template v-if="moreConfig">
          <el-form-item label="标签管理">
            <el-select v-model="basicForm.label" class="custom-input">
              <el-option
                v-for="(item, index) in labelList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
      </el-card>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import store from '@/store'
import { generateCode } from '@/utils/tool'
import { BillingEnum } from '@/utils/enum'

const basicFormRef = ref<FormInstance>() // 校验表单

const { resourcePoolInfo, regionInfo } = storeToRefs(store.resourceStore)
const basicForm = reactive({
  billingMode: BillingEnum.PACKAGE,
  regionName: '',
  regionId: '',
  elbName: 'elb-' + generateCode(4),
  remark: '',
  label: ''
})
const rules = reactive<FormRules>({
  elbName: [{ required: true, message: '请输入名称', trigger: 'blur' }]
})

const chargeModeList = [
  { label: BillingEnum.PACKAGE, name: '包年包月' },
  { label: BillingEnum.ON_DEMAND, name: '按需计费' }
]

const labelList: any = ref([])
const moreConfig = ref(false)
const tagNum = ref(10)

watch(
  () => [regionInfo?.value, resourcePoolInfo?.value],
  ([region, resourcePool]) => {
    basicForm.regionName = region?.name
    basicForm.regionId = region?.code
  },
  { deep: true, immediate: true }
)

defineExpose({
  basicFormRef,
  basicForm
})
</script>

<style scoped lang="scss">
.basic-config {
  width: 100%;
  :deep(.el-radio-button__inner) {
    width: 105px;
  }
  .custom-input {
    width: $formInputWidth;
  }
  .skip-text {
    font-size: $defaultFontSize;
  }
}
</style>
