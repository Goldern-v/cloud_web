<template>
  <div class="overview">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
      class="overview-form"
    >
      <div class="flex-row header__title">
        <el-divider direction="vertical" />
        <div>基本信息</div>
      </div>

      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" class="vbf-item" clearable />
      </el-form-item>

      <el-form-item v-if="form.parent" label="上级VDC" prop="vpc">
        <el-select
          v-model="form.parent.name"
          class="vbf-item"
          placeholder="请选择"
          disabled
        >
          <el-option
            v-for="(item, index) of vpcList"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="描述" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="请输入描述"
          class="vbf-item"
        >
        </el-input>
      </el-form-item>

      <!-- <div class="flex-row header__title">
        <el-divider direction="vertical" />
        <div>资源共享</div>
      </div>

      <el-form-item label="资源共享">
        <el-tooltip
          effect="dark"
          placement="right"
          content="注意此配置保存后将不可更改">
          <el-switch
            v-model="form.shared"
            :active-value="1"
            :inactive-value="0"
          />
        </el-tooltip>
      </el-form-item> -->
    </el-form>

    <div class="flex-row footer-button">
      <!-- <el-button type="primary" @click="submitForm(formRef)">{{
        t('save')
      }}</el-button> -->
      <el-button @click="cancelForm(formRef)">{{ t('back') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus/es'
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum } from '@/utils/enum'
import { vdcDetailApi, editVpcApi } from '@/api/java/business-center'

// 属性值
interface DialogProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: {}
})
const { t } = useI18n()
const route = useRoute()
const vdcId = route.query.id

onMounted(() => {
  detailInfo()
})

const form = reactive({
  name: '',
  id: '',
  remark: '',
  parent: {
    name: ''
  },
  shared: 0
})
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请填写名称', trigger: 'blur' }]
})
const vpcList = ref<any>([])
const formRef = ref()

const editVpc = () => {
  let obj = {
    name: form.name,
    id: form.id,
    remark: form.remark,
    shared: form.shared
  }
  formRef.value.validate(async (valid: any) => {
    if (valid) {
      const res: any = await editVpcApi(obj)
      if (res.code === 200) {
        ElMessage.success('修改成功')
      } else {
        ElMessage.error('修改失败')
      }
      detailInfo()
    }
  })
}
// vdc详情
const detailInfo = async () => {
  const res: any = await vdcDetailApi(vdcId)
  if (res.code === 200) {
    form.name = res.data.name
    form.id = res.data.id
    form.remark = res.data.remark
    form.parent.name = res.data.parent.name
    form.shared = res.data.shared
  }
}

// 方法
interface EmitEvent {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EmitEvent>()

const router = useRouter()
const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  router.back()
}
// 编辑概览
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate(async (valid: boolean) => {
    if (!valid) {
      return
    }
    editVpc()
  })
}
</script>

<style lang="scss" scoped>
.overview {
  width: 100%;
  .footer-button {
    margin-top: 5px;
    padding: 20px;
    background-color: white;
    justify-content: flex-start;
    align-items: center;
  }
  // 修改分割线颜色
  :deep(.el-divider--vertical) {
    border-left: 2px var(--el-color-primary) solid;
  }
  .header__title {
    background-color: var(--el-color-primary-light-9);
    line-height: $headerContainerHeight;
    height: $headerContainerHeight;
    align-items: center;
    margin-bottom: 10px;
  }
  .overview-form {
    background-color: white;
    padding: 20px;
    .vbf-item {
      width: 352px;
    }
  }
}
</style>
