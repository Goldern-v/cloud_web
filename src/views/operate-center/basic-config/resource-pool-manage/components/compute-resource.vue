<template>
  <div class="compute-resource">
    <div class="compute-resource-container">
      <div class="flex-row info-form__tip ideal-middle-margin-bottom">
        <svg-icon
          icon="info-warning"
          color="var(--el-color-primary)"
          class="ideal-svg-margin-right"
        ></svg-icon>
        <span
          >您可以设置该资源池的计算资源配额，控制用户可以申请的资源数量。</span
        >
      </div>

      <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
        <el-form-item label="当前资源池" prop="regionId">
          <el-input v-model="form.resourcePool" style="width: 200px" disabled />

          <el-select v-model="form.regionId" class="ideal-default-margin-left" style="width: 200px;" placeholder="请选择">
            <el-option
              v-for="(item, idx) of regionList"
              :key="idx"
              :label="item.cnName"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <el-divider />

      <quota-view :data-array="dataArray" />
    </div>

    <div class="flex-row footer-button">
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
      <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import quotaView from './quota-view.vue'
import { cloudPlatformRegion } from '@/api/java/public'
/**
 * 计算资源
 */
import type { FormRules, FormInstance } from 'element-plus'

const { t } = useI18n()

const formRef = ref<FormInstance>()
const form = reactive({
  resourcePool: '',
  regionId: ''
})
const rules = reactive<FormRules>({
  regionId: [{ required: true, message: '请选择区域', trigger: 'blur' }]
})

const route = useRoute()
const cloudPlatformId = ref('')
onMounted(() => {
  cloudPlatformId.value = route.query.cloudPlatformId as string
  form.resourcePool = route.query.name as string
  if (cloudPlatformId.value) {
    getRegion()
  }
})

const regionList = ref<any[]>([])
// 获取区域
const getRegion = () => {
  const params = {
    cloudPlatformId: cloudPlatformId.value
  }
  cloudPlatformRegion(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        regionList.value = data
        if (data?.length) {
          form.regionId = data[0].code
        }
      }
    })
    .catch(_ => {
      regionList.value = []
    })
}

const dataArray = ref<any[]>([
  { label: '内存（GB）', already: '123', quota: '' },
  { label: 'vCPU（核）', already: '123', quota: '' },
  { label: '云服务器数量（台）', already: '123', quota: '' },
  { label: '密钥对（个）', already: '123', quota: '' },
  { label: '私有镜像（个）', already: '123', quota: '' },
  { label: '云服务器组（个）', already: '123', quota: '' },
  { label: '云服务器快照（个）', already: '123', quota: '' },
  { label: '云服务器备份策略（个）', already: '123', quota: '' },
  { label: '云服务器备份-存储库容量（GB）', already: '123', quota: '' },
  { label: '云服务器备份-备份数量（个）', already: '123', quota: '' },
  { label: '弹性伸缩-伸缩组数量（个）', already: '123', quota: '' },
  { label: '弹性伸缩-伸缩配置（个）', already: '123', quota: '' }
])

const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
}
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
}
</script>

<style scoped lang="scss">
.compute-resource {
  width: 100%;
  .compute-resource-container {
    padding: 0 $idealPadding $idealPadding;
    .info-form__tip {
      background-color: var(--custom-information-bg-color);
      padding: $idealPadding;
      align-items: center;
    }
  }
  .footer-button {
    border-top: 1px solid $gray3-light;
    justify-content: flex-start;
    padding: 10px 0 10px $idealPadding;
  }
}
</style>
