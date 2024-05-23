<template>
  <div class="approve">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
      class="approve-form"
    >
      <div class="flex-row header__title">
        <el-divider direction="vertical" />
        <div class="header__title-text">审批配置</div>
        <div class="ideal-tip-text">
          您可以为VDC配置服务申请流程，留空为无限制。若您想自行设定VDC下用户服务审批流程，可在运营中心下流程配置进行操作。
        </div>
      </div>
      <el-form-item label="选择审批流程">
        <approve-select
          :config-approve="configApprove"
          @select-approve="selectApprove"
        >
        </approve-select>
      </el-form-item>

      <div class="flex-row header__title">
        <el-divider direction="vertical" />
        <div class="header__title-text">计费配置</div>
        <div class="ideal-tip-text">
          您可以为VDC配置是否开启资源计费。开启后，VDC下资源创建会产生费用消费；若选择不开启，资源开通不产生任何费用。
        </div>
      </div>

      <el-form-item label="计费配置">
        <el-switch v-model="form.billing" />
      </el-form-item>
    </el-form>

    <div class="flex-row footer-button">
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('save')
      }}</el-button>
      <el-button @click="cancelForm(formRef)">{{ t('back') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus/es'
import type { FormRules, FormInstance } from 'element-plus'
import {
  bpmConfigListApi,
  bpmConfigSetVdc,
  bpmConfigByVdc
} from '@/api/java/bpm/config'
import approveSelect from './approve-select.vue'
// 路由
const route = useRoute()
const vdcId = route.query.id
const vdcCode = route.query.code
const { t } = useI18n()

const formRef = ref<FormInstance>()
const form = reactive({
  type: '',
  approve: [] as any,
  billing: false
})
const rules = reactive<FormRules>({
  approve: [{ required: true, message: '请选择审批流程', trigger: 'change' }]
})

const selectApproveList: any = ref([])
const selectApprove = (approveIds: any[], approveList: any[]) => {
  form.approve = approveIds
  selectApproveList.value = approveList
}
const router = useRouter()

/**
 * 获取已绑定的配置
 */
const configApprove: any = ref([])
const getApproveByVdc = () => {
  let params = {
    id: vdcId
  }
  bpmConfigByVdc(params).then((res: any) => {
    if (res.code === 200) {
      if (res.data.length) {
        configApprove.value = res.data || []
      }
    }
  })
}

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
  formEl.validate(valid => {
    if (valid) {
      addVdcApprove()
    } else {
      console.log('error submit!')
      return false
    }
  })
}
const addVdcApprove = () => {
  const arr: any = []
  const bpmvdcConfigs = selectApproveList.value
    .filter((item: any) => item.id)
    .map((item: any) => {
      return {
        configId: item.id,
        status: item.status,
        vdcId: vdcId
      }
    })
  let params = {
    vdcId: vdcId,
    bpmvdcConfigs
  }
  bpmConfigSetVdc(params).then((res: any) => {
    if (res.code === 200) {
      ElMessage.success('保存成功')
      router.push({
        path: '/business-center/organization-manage/vdc-manage/list'
      })
    } else {
      ElMessage.error('保存失败')
    }
  })
}
const editVdcapprove = () => {
  // const res: any = editVdcapproveApi(form)
  // if (res.code == 200) {
  //   ElMessage.success('保存成功')
  //   router.push({
  //     path: '/business-center/organization-manage/vdc-manage/list'
  //   })
  // } else {
  //   ElMessage.error('保存失败')
  // }
}

onMounted(() => {
  getApproveByVdc()
})
</script>
<style lang="scss" scoped>
.approve {
  width: 100%;
  .approve-form {
    padding: 20px;
    background-color: white;
    .input-width {
      width: 300px;
    }
    .header__title {
      background-color: var(--el-color-primary-light-9);
      height: $headerContainerHeight;
      line-height: $headerContainerHeight;
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
  .approve-progress-input {
    width: 350px;
    height: var(--el-input-height);
    line-height: var(--el-input-height);
    border: 1px solid var(--el-border-color-hover);
    border-radius: 3px;
    padding: 0 10px;
  }
  :deep .first-order {
    justify-content: space-between;
    width: 130px;
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
