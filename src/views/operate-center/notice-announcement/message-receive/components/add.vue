<template>
  <div>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="接收人类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择接收人类型">
          <el-option
            v-for="(item, idx) of types"
            :key="idx"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="接收人姓名" prop="name">
        <el-select
          v-model="form.name"
          multiple
          collapse-tags
          collapse-tags-tooltip
          placeholder="请选择接收人姓名"
        >
          <el-option
            v-for="(item, idx) of receivers"
            :key="idx"
            :label="item[nameKey]"
            :value="item.id"
          />
        </el-select>
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
import { ElMessage } from 'element-plus'
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum } from '@/utils/enum'
import { getPlatformUserList } from '@/api/java/maintenance-center'
import {
  receiverManageList,
  messageReceiveConfigAdd,
  messageReceiveConfigAddBatch
} from '@/api/java/operate-center'

const { t } = useI18n()

// 属性值
interface AddProps {
  isBatch?: boolean // 是否多选
  selectArray?: any[] // 多选数据
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<AddProps>(), {
  isBatch: false,
  selectArray: () => [],
  rowData: null
})

const formRef = ref<FormInstance>()
const form = reactive({
  type: '',
  name: [] as any[]
})
const rules = reactive<FormRules>({
  type: [{ required: true, message: '请选择接收人类型', trigger: 'blur' }],
  name: [{ required: true, message: '请选择接收人姓名', trigger: 'blur' }]
})
const types = [
  { label: '平台用户', value: '1' },
  { label: '配置接收人', value: '2' }
]
const nameKey = ref('')
// 监听接收人类型
watch(
  () => form.type,
  value => {
    form.name = []
    if (value === '1') {
      getPlatformUser()
      nameKey.value = 'username'
    } else if (value === '2') {
      getReceiverList()
      nameKey.value = 'name'
    }
  }
)
const receivers = ref<any[]>([])
const getPlatformUser = () => {
  getPlatformUserList()
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        receivers.value = data
      } else {
        receivers.value = []
      }
    })
    .catch(_ => {
      receivers.value = []
    })
}
const getReceiverList = () => {
  receiverManageList()
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        receivers.value = data
      } else {
        receivers.value = []
      }
    })
    .catch(_ => {
      receivers.value = []
    })
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
  formEl.validate((valid: boolean) => {
    if (valid) {
      handleSubmit()
    }
  })
}
const handleSubmit = () => {
  if (props.isBatch) {
    addBatch()
  } else {
    add()
  }
}
const add = () => {
  messageReceiveConfigAdd(form.name, props.rowData.id).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('添加成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error('添加失败')
    }
  })
}
const addBatch = () => {
  const list: any[] = []
  props.selectArray.forEach((item: any) => {
    const dic = {
      id: item.id,
      userIdList: form.name
    }
    list.push(dic)
  })
  messageReceiveConfigAddBatch(list).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('添加成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error('添加失败')
    }
  })
}
</script>

<style scoped lang="scss"></style>
