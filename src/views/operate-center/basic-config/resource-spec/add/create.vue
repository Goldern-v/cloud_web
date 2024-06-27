<template>
  <div class="resource-spec-create">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" class="custom-input-width"></el-input>
      </el-form-item>

      <el-form-item label="资源池绑定" prop="resourcePoolId">
        <el-select
          v-model="form.resourcePoolId"
          :disabled="isEdit"
          placeholder="请选择"
          class="custom-input-width"
          @change="clickResourcePool"
        >
          <el-option
            v-for="(item, idx) of resourcePoolIds"
            :key="idx"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="架构" prop="cpuArchitecture">
        <el-select
          v-model="form.cpuArchitecture"
          :disabled="isEdit"
          :placeholder="cpuArchitectureTip"
          class="custom-input-width"
          @change="clickCpuArchitecture"
        >
          <el-option
            v-for="(item, index) of cpuArchitectureList"
            :key="index"
            :label="item.cpuArchitectureName"
            :value="item.cpuArchitecture"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="规格类型" prop="specsType">
        <el-select
          v-model="form.specsType"
          :disabled="isEdit"
          :placeholder="specsTypeTip"
          class="custom-input-width"
        >
          <el-option
            v-for="(item, idx) of specsTypeList"
            :key="idx"
            :label="item.name"
            :value="item.code"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="描述">
        <el-input
          v-model="form.description"
          type="textarea"
          class="custom-input-width"
        ></el-input>
      </el-form-item>

      <el-form-item label="CPU" required>
        <div class="flex-row resource-spec__cpu">
          <el-form-item prop="vcpus" class="custom-input-width">
            <el-input
              v-model="form.vcpus"
              :disabled="isEdit"
              class="custom-input-width"
            ></el-input>
          </el-form-item>

          <el-select
            v-model="form.cpuUnit"
            placeholder="请选择"
            class="custom-input-unit"
          >
            <el-option
              v-for="(item, idx) of cpuUnitList"
              :key="idx"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </el-form-item>

      <el-form-item label="内存" required>
        <div class="flex-row resource-spec__cpu">
          <el-form-item prop="ram" class="custom-input-width">
            <el-input
              v-model="form.ram"
              :disabled="isEdit"
              class="custom-input-width"
            ></el-input>
          </el-form-item>

          <el-select
            v-model="form.memoryUnit"
            placeholder="请选择"
            class="custom-input-unit"
          >
            <el-option
              v-for="(item, idx) of memoryUnitList"
              :key="idx"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </el-form-item>
    </el-form>

    <div class="flex-row resource-spec-create__button">
      <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 创建和详情-基本信息
 */
import type { FormRules, FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus/es'
import { EventEnum } from '@/utils/enum'
import { compareDiffDictionary } from '@/utils/tool'
import {
  resourceSpecCreate,
  resourcePoolSelect,
  resourceSpecEdit,
  querySpecTypeList
} from '@/api/java/operate-center'

interface ResourceSpecProp {
  isEdit?: boolean
  rowData?: any
}

const props = withDefaults(defineProps<ResourceSpecProp>(), {
  isEdit: false,
  rowData: () => ({})
})

const { t } = useI18n()

const formRef = ref<FormInstance>()
const form = reactive({
  name: '', // 名称
  resourcePoolId: '', // 资源池绑定
  cpuArchitecture: '', //架构
  specsType: '', // 规格类型
  description: '',
  vcpus: '',
  cpuUnit: 'kernel',
  ram: '',
  memoryUnit: 'GB'
})

onMounted(() => {
  getResourcePool()
  // resourcePool()
})
const resourcePoolIds: any = ref([])
// 表单深拷贝, 比较表单是否修改
const originDic = ref()
// 资源池绑定查询
const getResourcePool = () => {
  resourcePoolSelect()
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        resourcePoolIds.value = data
        if (props.isEdit) {
          form.name = props.rowData.name
          form.resourcePoolId = props.rowData.pool.id
          form.cpuArchitecture = props.rowData.cpuArchitecture
          form.specsType = props.rowData.specsType
          form.vcpus = props.rowData.vcpus
          form.ram = props.rowData.ram

          originDic.value = Object.assign({}, form)
        }
      } else {
        resourcePoolIds.value = []
      }
    })
    .catch(_ => {
      resourcePoolIds.value = []
    })
}
const cpuArchitectureTip = ref('请先选择资源池绑定')
// 监听资源池池选择
watch(
  () => form.resourcePoolId,
  (newValue, oldValue) => {
    if (newValue && newValue !== oldValue) {
      // 获取所选数据的云平台类型id
      let result = resourcePoolIds.value.find(
        (item: any) => item.id === newValue
      )
      getSpecTypeList(result?.cloudPlatform?.id)
    }
    if (newValue) {
      cpuArchitectureTip.value = '请选择架构'
    } else {
      cpuArchitectureTip.value = '请先选择资源池绑定'
    }
  }
)
const clickResourcePool = () => {
  // 资源池重选后清空原来选择的架构和规格类型
  form.cpuArchitecture = ''
  form.specsType = ''
}
// 架构
const cpuArchitectureList: any = ref([])
// 查询架构和规格类型
const getSpecTypeList = (cloudPlatformId: string) => {
  let params = {
    cloudPlatformId
  }
  querySpecTypeList(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        cpuArchitectureList.value = data
        // 筛选规格类型列表
        let result = data.find(
          (item: any) => item.cpuArchitecture === form.cpuArchitecture
        )
        specsTypeList.value = result?.specsType
      } else {
        cpuArchitectureList.value = []
      }
    })
    .catch(_ => {
      cpuArchitectureList.value = []
    })
}
const specsTypeTip = ref('请先选择架构')
// 规格类型
const specsTypeList: any = ref([])
// 监听架构选择
watch(
  () => form.cpuArchitecture,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      let result = cpuArchitectureList.value.find(
        (item: any) => item.cpuArchitecture === newValue
      )
      specsTypeList.value = result?.specsType
    }
    if (newValue) {
      specsTypeTip.value = '请选择规格类型'
    } else {
      specsTypeTip.value = '请先选择架构'
    }
  }
)
const clickCpuArchitecture = () => {
  // 架构重选后清空规格类型选择
  form.specsType = ''
}
const cpuUnitList: any = [{ label: '核', value: 'kernel' }]
const memoryUnitList: any = [{ label: 'GB', value: 'GB' }]

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  resourcePoolId: [
    { required: true, message: '请选择资源池', trigger: 'blur' }
  ],
  cpuArchitecture: [{ required: true, message: '请选择架构', trigger: 'blur' }],
  specsType: [{ required: true, message: '请选择规格类型', trigger: 'blur' }],
  vcpus: [{ required: true, message: '请输入cpu', trigger: 'blur' }],
  ram: [{ required: true, message: '请输入内存', trigger: 'blur' }]
})
// 点击事件
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
      let params: { [key: string]: any } = {}

      if (props.isEdit) {
        // 筛选表单修改项, 编辑时只传修改项
        const tempDic = compareDiffDictionary(originDic.value, form)
        params = {
          id: props.rowData.id,
          ...tempDic
        }
        editEvent(params)
      } else {
        params = { ...form }
        crateEvent(params)
      }
    }
  })
}
const crateEvent = (params: any) => {
  resourceSpecCreate(params)
    .then((res: any) => {
      let { code } = res
      if (code === 200) {
        ElMessage.success('创建成功')
        emit(EventEnum.success)
      } else {
        ElMessage.error('创建失败')
      }
    })
    .catch(error => {
      ElMessage.error(error || '创建失败')
    })
}
const editEvent = (params: any) => {
  resourceSpecEdit(params)
    .then((res: any) => {
      let { code } = res
      if (code === 200) {
        ElMessage.success('编辑成功')
        emit(EventEnum.success)
      } else {
        ElMessage.error('编辑失败')
      }
    })
    .catch(error => {
      ElMessage.error(error || '编辑失败')
    })
}
</script>

<style scoped lang="scss">
.resource-spec-create {
  width: 100%;
  :deep(.el-form) {
    padding: 0 10px;
  }
  .resource-spec-create__button {
    justify-content: flex-end;
    align-items: center;
    padding-right: 10px;
  }
  .resource-spec__cpu {
    justify-content: space-between;
  }
  :deep(.el-divider--vertical) {
    border-left: 1px var(--el-color-primary) solid;
  }
  .custom-input-width {
    width: 100%;
  }
  .custom-input-unit {
    width: 120px;
    margin-left: 10px;
  }
  :deep(.el-select__wrapper) {
    min-height: 34px;
  }
}
</style>
