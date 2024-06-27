<template>
  <div class="copy-single">
    <div class="copy-single-tip ideal-middle-margin-bottom">
      复制的镜像大小不能超过128GiB。
    </div>
    <div class="copy-single-detail ideal-middle-margin-bottom">
      <div class="copy-single-title">镜像详情</div>
      <ideal-detail-info
        :label-array="labelArray"
        :detail-info="rowData"
        label-position="left"
      >
        <template #createTime>
          <div>{{ rowData.createTime.date }}</div>
        </template>
      </ideal-detail-info>
    </div>

    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="复制类型">
        <el-radio-group v-model="form.copyType">
          <el-radio-button label="local">本区域内复制</el-radio-button>
          <el-radio-button label="cross">跨区域复制</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" style="width: 70%" />
      </el-form-item>

      <el-form-item
        v-if="form.copyType === 'cross'"
        label="目的区域"
        prop="goalRegion"
      >
        <el-select v-model="form.goalRegion" style="width: 70%">
          <el-option
            v-for="(item, index) of goalRegionList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="form.copyType === 'cross'"
        label="目的项目"
        prop="project"
      >
        <el-select v-model="form.project" style="width: 70%">
          <el-option
            v-for="(item, index) of projectList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-if="form.copyType === 'cross'" label="IAM委托" prop="iam">
        <el-select v-model="form.iam" style="width: 70%">
          <el-option
            v-for="(item, index) of iamList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="描述">
        <el-input
          v-model="form.description"
          type="textarea"
          style="width: 70%"
          maxlength="1024"
          show-word-limit
        />
      </el-form-item>

      <el-form-item v-if="form.copyType === 'local'" label="加密">
        <el-checkbox v-model="form.encrypt" label="KMS加密" />
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

interface CopyProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<CopyProps>(), {
  rowData: null
})

const { t } = useI18n()

// 镜像详情
const labelArray = ref([
  { label: '名称', prop: 'name' },
  { label: '镜像类型', prop: 'mirrorType' },
  { label: '镜像大小', prop: 'size' },
  { label: '操作系统类型', prop: 'osType' },
  { label: '操作系统', prop: 'osVersion' },
  { label: '创建时间', prop: 'createTime', useSlot: true }
])

// 表单
const formRef = ref<FormInstance>()
const form = reactive({
  copyType: 'local', // 复制类型
  name: '', // 本区域复制 名称
  goalRegion: '', // 目的区域
  project: '', // 目的项目
  iam: '', // IAM委托
  description: '',
  encrypt: false
})
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  goalRegion: [{ required: true, message: '请选择目的区域', trigger: 'blur' }],
  project: [{ required: true, message: '请选择目的项目', trigger: 'blur' }],
  iam: [{ required: true, message: '请选择IAM委托', trigger: 'blur' }]
})

const goalRegionList = ref<any[]>([])
const projectList = ref<any[]>([])
const iamList = ref<any[]>([])

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
.copy-single {
  width: 100%;
  .copy-single-tip {
    border: 1px solid var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
    padding: 10px;
  }
  .copy-single-detail {
    background-color: $gray1-light;
    padding: 10px;
    .copy-single-title {
      font-size: $mediumFontSize;
      font-weight: 500;
    }
  }
}
</style>
