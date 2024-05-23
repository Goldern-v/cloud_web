<template>
  <div class="config-add">
    <div v-if="type === 'delete'" class="delete-mag">
      请确认实收删除【{{ rowData.configName }}】配置？
    </div>
    <el-form
      v-else
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="160px"
    >
      <el-form-item label="配置名称" prop="configName">
        <el-input v-model="formData.configName" placeholder="请输入配置名称" />
      </el-form-item>

      <el-form-item label="流程定义" prop="processDefinitionId">
        <el-select
          style="width: 100%"
          v-model="formData.processDefinitionId"
          placeholder="请选择流程定义"
          class="my-process-state"
        >
          <el-option
            v-for="item in approveList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="请求URL" prop="requestUrl">
        <el-input v-model="formData.requestUrl" placeholder="请输入请求URL" />
      </el-form-item>

      <el-form-item label="请求成功回调地址" prop="completedCallBackUrl">
        <el-input
          v-model="formData.completedCallBackUrl"
          placeholder="请输入请求成功回调地址"
        />
      </el-form-item>
      <el-form-item
        label="请求成功回调方法类型"
        prop="completedCallBackMethodType"
      >
        <el-radio-group v-model="formData.completedCallBackMethodType">
          <el-radio v-for="item in methodType" :key="item" :label="item" />
        </el-radio-group>
      </el-form-item>

      <el-form-item label="请求失败回调地址" prop="cancelCallBackUrl">
        <el-input
          v-model="formData.cancelCallBackUrl"
          placeholder="请输入请求失败回调地址"
        />
      </el-form-item>

      <el-form-item
        label="请求失败回调方法类型"
        prop="cancelCallBackMethodType"
      >
        <el-radio-group v-model="formData.cancelCallBackMethodType">
          <el-radio v-for="item in methodType" :key="item" :label="item" />
        </el-radio-group>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio
            v-for="dict in statusList"
            :key="dict.value"
            :label="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div class="config-add-btns">
      <el-button :disabled="formLoading" type="primary" @click="submitForm"
        >确 定</el-button
      >
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { bpmConfigAddApi, bpmConfigDeleteApi } from '@/api/java/bpm/config'
import { bpmMyprocessSelectList } from '@/api/java/bpm/task'
import { ElMessage } from 'element-plus'
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { EventEnum } from '@/utils/enum'
interface DialogProps {
  rowData?: any // 行数据
  type?: string
}
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: null,
  type: 'create'
})
// 方法
interface EventEmits {
  (e: EventEnum.close): void
  (e: EventEnum.refresh): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()
const router = useRouter()
const { query } = useRoute() // 路由信息
const formLoading = ref(false) // 表单的加载中：提交的按钮禁用

// 提交表单数据
const formData = ref({
  configName: '',
  status: 0,
  requestUrl: '',
  processDefinitionId: '',
  completedCallBackUrl: '',
  completedCallBackMethodType: 'get',
  cancelCallBackUrl: '',
  cancelCallBackMethodType: 'get'
})
const formRules = reactive({
  configName: [{ required: true, message: '配置名不能为空', trigger: 'blur' }],
  processDefinitionId: [
    { required: true, message: '流程定义不能为空', trigger: 'blur' }
  ],
  status: [{ required: true, message: '开启状态不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref
// 表单状态
const statusList = reactive([
  {
    value: 0,
    label: '开启'
  },
  {
    value: 1,
    label: '关闭'
  }
])

const methodType: string[] = reactive(['get', 'post', 'put', 'delete'])

const approveList = ref<any[]>([])
/**
 * 获取流程
 */
const getApproveList = () => {
  let params = {
    pageNum: 1,
    pageSize: 9999
  }
  bpmMyprocessSelectList(params).then((res: any) => {
    if (res.code === 200) {
      approveList.value = res.data
    }
  })
}
/** 处理保存按钮 */
const cancel = () => {
  emit(EventEnum.close)
}

/** 提交表单 */
const submitForm = async () => {
  if (props.type === 'delete') {
    formLoading.value = true
    deleteOption()
  }
  // 校验表单
  if (!formRef) {
    return
  }
  const valid = await formRef.value.validate()
  if (!valid) {
    return
  }
  // 提交请求
  formLoading.value = true
  try {
    let isCreate = props.type === 'create'
    let api = { bpmConfigAddApi }
    let data = {
      processDefinitionName: '',
      ...formData.value
    }
    let approve = approveList.value.find(
      v => v.id === formData.value.processDefinitionId
    )
    if (approve) {
      data.processDefinitionName = approve.name
    }
    bpmConfigAddApi(data)
      .then((res: any) => {
        let data = res
        if (data.code === 200) {
          ElMessage.success(`${isCreate ? '新建' : '编辑'}配置成功`)
          emit(EventEnum.refresh)
          cancel()
          return
        }
        ElMessage.error(`${isCreate ? '新建' : '编辑'}配置失败`)
      })
      .catch((err: any) => {
        ElMessage.error(`${isCreate ? '新建' : '编辑'}配置失败`)
      })
  } finally {
    formLoading.value = false
  }
}

const deleteOption = () => {
  bpmConfigDeleteApi({ id: props.rowData.id }).then((res: any) => {
    if (res.code === 200) {
      ElMessage.success(`删除配置成功`)
      return emit(EventEnum.refresh)
    }
    ElMessage.error(`删除配置失败`)
  })
}

/** 初始化 **/
onMounted(async () => {
  getApproveList()
  // 新增表单
  const type = props.type
  if (type === 'create') {
    return
  }
  formData.value = { ...props.rowData }
})
</script>

<style scoped lang="scss">
.config-add {
  .config-add-btns {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
