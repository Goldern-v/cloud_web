<template>
  <div class="key-pair-create">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
    >
      <el-form-item label="区域" prop="regionId">
        <el-select v-model="form.regionId" style="width: 100%">
          <el-option
            v-for="(item, index) of regionList"
            :key="index"
            :label="item.cnName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="项目" prop="projectId">
        <el-select v-model="form.projectId" style="width: 100%">
          <el-option
            v-for="(item, index) of projectList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" clearable style="width: 100%"/>
      </el-form-item>

      <el-form-item label="公钥" prop="publicKey">
        <el-input v-model="form.publicKey" type="textarea" style="width: 100%"/>
      </el-form-item>

      <el-form-item>
        <div class="flex-column" style="width: 100%;">
          <div class="flex-row key-pair-create__tip">
            <svg-icon icon="info-warning" color="#F3AD3C" class="ideal-svg-margin-right"></svg-icon>
            <span
              >未开通账号密钥对的用户该参数无效，默认会创建SSH_RSA_2048的密钥对。当前仅RSA算法支持windows系统，其他算法不支持windows获取密码。</span
            >
          </div>

          <div class="flex-row">
            <el-checkbox v-model="form.agree" label="我同意将密钥对公钥托管到理想多云。" />
          </div>
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
import { ElMessage } from 'element-plus/es'
import type { FormRules, FormInstance } from 'element-plus'
import { forbiddenNumberOrCN } from '@/utils/validate'
import { EventEnum } from '@/utils/enum'
import store from '@/store'
import { useRegion } from '@/utils/common/region'
import { keyPairCreate } from '@/api/java/compute'

const { t } = useI18n()
const formRef = ref<FormInstance>()
const form = reactive({
  projectId: '', // 资源归属(项目)
  regionId: '', // 区域
  regionName: '',
  name: '', // 密钥对名称
  publicKey: '', // 公钥
  agree: false
})

const checkName = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (value === '') {
    callback(new Error('请输入密钥名称'))
  } else {
    forbiddenNumberOrCN(rule, value, callback)
  }
}
const rules = reactive<FormRules>({
  regionId: [ { required: true, message: '请选择区域', trigger: 'blur' }],
  projectId: [ { required: true, message: '请选择项目', trigger: 'blur' }],
  name: [ { required: true, validator: checkName, trigger: 'blur' }],
  publicKey: [ { required: true, message: '请输入公钥', trigger: 'blur' }]
})

// 区域、项目
const { regionList, projectList } = useRegion(form)

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
      if (!form.agree) {
        return ElMessage.warning('请阅读协议并勾选同意。')
      }
      handleCreate()
    } else {
      console.log('error submit!')
      return false
    }
  })
}
const { resourcePool } = storeToRefs(store.resourceStore)
const handleCreate = () => {
  const params = {
    name: form.name,
    publicKey: form.publicKey,
    resourcePoolId: resourcePool.value.resourcePoolId,
    poolTypeUuid: resourcePool.value.cloudPlatformType,
    regionId: form.regionId,
    projectId: form.projectId,
    vdcId: store.userStore.user.vdcId
  }
  keyPairCreate(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('新增成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error('新增失败')
    }
  })
}
</script>

<style scoped lang="scss">
.key-pair-create {
  width: 100%;
  .footer-button {
    justify-content: flex-end;
    align-items: center;
    padding-right: 17px;
  }
  .input-width {
    width: 70%;
  }
  .key-pair-create__tip {
    background-color: #FEFBED;
    padding: 10px 20px;
    margin-top: 10px;
  }
}
</style>
