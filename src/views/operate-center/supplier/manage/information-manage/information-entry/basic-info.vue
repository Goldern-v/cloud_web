<template>
  <div class="basic-info">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="供应商名称" prop="vendorId">
        <el-select
          v-model="form.vendorId"
          placeholder="请选择供应商"
          class="custom-input"
          :disabled="isEditSupplier"
        >
          <el-option
            v-for="(item, index) of supplierList"
            :key="index"
            :label="item.username"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="描述" prop="remark">
        <el-input
          v-model="form.remark"
          class="custom-input"
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 6 }"
          placeholder="请输入描述信息"
        >
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { getSupplierList } from '@/api/java/operate-center'
import { ElMessage } from 'element-plus'

const form: { [key: string]: any } = reactive({
  vendorId: '',
  remark: ''
})
const formRef = ref<FormInstance>()

const rules = reactive<FormRules>({
  vendorId: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }]
})

const route = useRoute()
const isEditSupplier = computed(() => route.query?.type === 'edit') //编辑供应商录入信息

onMounted(() => {
  querySupplier()
})
const supplierList: any = ref([])

const querySupplier = async () => {
  try {
    const res = await getSupplierList()
    supplierList.value = res.data
    if (isEditSupplier.value) {
      form.vendorId = parseInt(route.query?.vendorId as string)
    }
  } catch (err: any) {
    ElMessage.error(err)
  }
}
defineExpose({ form, formRef })
</script>

<style scoped lang="scss">
.basic-info {
  width: 100%;
  :deep(.el-form) {
    padding: 0;
  }
  .custom-input {
    width: 20%;
  }
}
</style>
