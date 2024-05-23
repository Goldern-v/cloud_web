<template>
  <div class="ideal-large-margin bpm-form-edit">
    <!-- 表单设计器 -->
    <div class="edit-conetent">
      <FcDesigner ref="designer" height="780px">
        <template #handle>
          <el-button round size="small" type="primary" @click="handleSave">
            <svg-icon
              icon="circle-add"
              color="white"
              class="ideal-svg-margin-right"
            ></svg-icon>
            保存
          </el-button>
        </template>
      </FcDesigner>
    </div>

    <!-- 表单保存的弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="保存表单"
      width="50%"
      :append-to-body="true"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item label="表单名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入表单名" />
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
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            placeholder="请输入备注"
            type="textarea"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button :disabled="formLoading" type="primary" @click="submitForm"
          >确 定</el-button
        >
        <el-button @click="dialogVisible = false">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ElMessage } from 'element-plus/es'
import { mockDataDetail } from '../testData'
import FcDesigner from '@form-create/designer'
import { encodeConf, encodeFields, setConfAndFields } from '@/utils/form-create'
import {
  bpmFormUpdate,
  bpmFormCreate,
  bpmFormQueryDetail
} from '@/api/java/bpm/form'
import { FormVO } from '@/types/bpm-form'
const router = useRouter()
const { query } = useRoute() // 路由信息
const designer = ref() // 表单设计器
const dialogVisible = ref(false) // 弹窗是否展示
const formLoading = ref(false) // 表单的加载中：提交的按钮禁用
// 提交表单数据
const formData = ref({
  name: '',
  status: 0,
  remark: ''
})
const formRules = reactive({
  name: [{ required: true, message: '表单名不能为空', trigger: 'blur' }],
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

/** 处理保存按钮 */
const handleSave = () => {
  dialogVisible.value = true
}

/** 提交表单 */
const submitForm = async () => {
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
    const data = formData.value as FormVO
    data.conf = encodeConf(designer) // 表单配置
    data.fields = encodeFields(designer) // 表单字段
    let isCreate = query.type === 'create'
    let api = { bpmFormUpdate, bpmFormCreate }
    api[isCreate ? 'bpmFormCreate' : 'bpmFormUpdate'](data)
      .then((res: any) => {
        let data = res
        if (data.code === 200) {
          ElMessage.success(`${isCreate ? '新建' : '编辑'}表单成功`)
          dialogVisible.value = false
          router.push('/bpm-manage/form/list')
          return
        }
        ElMessage.error(`${isCreate ? '新建' : '编辑'}表单失败`)
      })
      .catch((err: any) => {
        ElMessage.error(`${isCreate ? '新建' : '编辑'}表单失败`)
      })
  } finally {
    formLoading.value = false
  }
}

/** 初始化 **/
onMounted(async () => {
  // 新增表单
  const type = query.type as string
  if (type === 'create') {
    return
  }
  // 修改表单
  let id = query.id as string
  getFormDataById(id)
})

/**
 * 根据id查询表单数据回显
 * @param id 表单id
 */
const getFormDataById = (id: string): void => {
  bpmFormQueryDetail({ id }).then((res: any) => {
    if (res.code === 200) {
      formData.value = res.data
      setConfAndFields(designer, res.data.conf, res.data.fields)
    }
  })
}
</script>

<style scoped lang="scss">
.bpm-form-edit {
  padding: 20px;
  box-sizing: border-box;
  background-color: #fff;
  .edit-conetent {
    padding: 20px;
    box-sizing: border-box;
    border: 1px solid #eee;
    :deep .form-create {
      height: initial;
      width: initial;
    }
    :deep .el-header {
      height: 50px;
    }
    :deep .el-main .el-form {
      height: 100%;
      .drag-tool {
        outline: 1px dashed #2e73ff !important;
      }
    }
  }
}
</style>
@/api/java/form/bpm
