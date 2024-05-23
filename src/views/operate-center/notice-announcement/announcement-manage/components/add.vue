<template>
  <div>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入标题"/>
      </el-form-item>

      <el-form-item label="公告正文" prop="content">
        <el-input v-model="form.content" placeholder="请输入公告正文"/>
      </el-form-item>

      <el-form-item label="公告类型" required>
        <div class="flex-row" style="width: 100%;">
          <el-form-item prop="announcementTypeId" style="width: 30%;">
            <el-select v-model="form.announcementTypeId" placeholder="请选择公告类型" class="ideal-default-margin-right">
              <el-option
                v-for="(item, idx) of typeList"
                :key="idx"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <div class="ideal-default-margin-right">定时发送</div>
          <el-checkbox v-model="timing" label="是否开启"/>

          <el-date-picker
            v-if="timing"
            v-model="form.schedule"
            type="datetime"
            placeholder="请选择定时发送时间"
            class="ideal-default-margin-left"
            style="width: 35%;"
          />
        </div>
      </el-form-item>

      <el-form-item label="公示时间" prop="duration">
        <el-input
          v-model="form.duration"
          style="width: 200px"
          placeholder="公示时间"
        >
          <template #append>天</template>
        </el-input>
      </el-form-item>
    </el-form>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum } from '@/utils/enum'
import { compareDiffDictionary } from '@/utils/tool'
import { announcementTypeList, announcementManageAdd, announcementManageEdit } from '@/api/java/operate-center'

const { t } = useI18n()

// 属性值
interface AddProps {
  isEdit?: boolean
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<AddProps>(), {
  isEdit: false,
  rowData: null
})

const formRef = ref<FormInstance>()
const form = reactive({
  title: '', // 标题
  content: '', // 公告正文
  announcementTypeId: '', // 公告类型
  schedule: '', // 定时发送时间
  duration: '' // 公示时间
})
const rules = reactive<FormRules>({
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入公告正文', trigger: 'blur' }],
  announcementTypeId: [{ required: true, message: '请选择公告类型', trigger: 'blur' }],
  duration: [{ required: true, message: '请输入公示时间', trigger: 'blur' }]
})
const timing = ref(false) // 定时发送是否开启
onMounted(() => {
  getTypeList()
  if (props.isEdit) {
    formEdit()
  }
})
// 公告类型
const typeList = ref<any[]>([])
const getTypeList = () => {
  announcementTypeList().then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      typeList.value = data
    } else {
      typeList.value = []
    }
  }).catch(_ => {
    typeList.value = []
  })
}
// 表单深拷贝, 比较表单是否修改
const originDic = ref()

const formEdit = () => {
  form.title = props.rowData?.title
  form.content = props.rowData?.content
  form.announcementTypeId = props.rowData?.announcementTypeId
  timing.value = !!props.rowData?.schedule // 有值则定时发送时间
  form.schedule = props.rowData?.schedule
  form.duration = props.rowData?.duration

  originDic.value = Object.assign({}, form)
}
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
      handleSubmit()
    }
  })
}
const handleSubmit = () => {
  if (props.isEdit) {
    edit()
  } else {
    add()
  }
}
const add = () => {
  const params = {...form}
  announcementManageAdd(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('添加成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error('添加失败')
    }
  })
}
const edit = () => {
  // 筛选表单修改项
  const tempDic = compareDiffDictionary(originDic.value, form)
  const params = {
    id: props.rowData.id,
    ...tempDic
  }
  announcementManageEdit(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('编辑成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error('编辑失败')
    }
  })
}
</script>

<style scoped lang="scss">

</style>
