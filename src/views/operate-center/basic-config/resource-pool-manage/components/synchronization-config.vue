<template>
  <div>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="120px"
      label-position="left"
    >
      <div class="flex-row ideal-header-container">
        <el-divider direction="vertical" />
        <div>基本信息</div>
      </div>

      <el-form-item label="策略名称" prop="name" class="ideal-default-margin-top">
        <el-input v-model="form.name" class="input-width" />
      </el-form-item>

      <el-form-item label="同步资源" prop="resourceType">
        <el-select
          v-model="form.resourceType"
          class="input-width"
          placeholder="请选择"
          :disabled="isDisabled"
        >
          <el-option
            v-for="(item, index) in resourceTypeList"
            :key="index"
            :label="item.name"
            :value="item.uuid"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="同步资源归属" prop="projectId">
        <el-select
          v-model="form.projectId"
          placeholder="请选择项目"
          class="input-width"
        >
          <el-option
            v-for="(item, index) in projectList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="同步区域" prop="regionId">
        <el-select
          v-model="form.regionId"
          placeholder="请选择区域"
          class="input-width"
        >
          <el-option
            v-for="(item, index) in regionList"
            :key="index"
            :label="item.cnName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <div class="flex-row ideal-header-container">
        <el-divider direction="vertical" />
        <div>同步配置</div>
      </div>

      <el-form-item label="同步方式" prop="type" class="ideal-default-margin-top">
        <el-radio-group v-model="form.type">
          <el-radio
            v-for="(item, index) of typeList"
            :key="index"
            :label="item.value"
            @change="changeType"
            >{{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="form.type === '1'" label="时间">
        <div>
          <div class="flex-row">
            <el-select
              v-model="form.timeUnit"
              class="select-width ideal-default-margin-right"
              placeholder="请选择"
              @change="changeTimeUnit"
            >
              <el-option label="每天" value="4" />
              <el-option label="每周" value="3" />
              <el-option label="每月" value="2" />
              <el-option label="每年" value="1" />
            </el-select>

            <el-date-picker
              v-if="form.timeUnit === '1'"
              v-model="form.specificYear"
              type="date"
              placeholder="请选择日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />

            <el-select
              v-if="form.timeUnit === '2'"
              v-model="form.syncDay"
              style="width: 130px"
              class="ideal-default-margin-right"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) of 31"
                :key="index"
                :label="item"
                :value="item"
              />
            </el-select>

            <el-select
              v-if="form.timeUnit === '3'"
              v-model="form.syncDay"
              style="width: 130px"
              class="ideal-default-margin-right"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) of dateOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>

          <el-time-picker
            v-model="form.syncTime"
            format="HH:mm:ss"
            value-format="HH:mm:ss"
            style="margin-top: 10px"
            :style="{
              width:
                form.timeUnit === '2' || form.timeUnit === '3'
                  ? '120px'
                  : '260px'
            }"
          >
          </el-time-picker>
        </div>
      </el-form-item>

      <el-form-item v-if="form.type === '2'" label="频率">
        <el-input-number
          v-model="form.frequency"
          class="ideal-default-margin-right"
          :min="1"
          controls-position="right"
        />
        <el-select
          v-model="form.timeUnit"
          style="width: 210px; margin-top: 10px"
          placeholder="请选择"
        >
          <el-option label="分钟" value="6" />
          <el-option label="小时" value="5" />
        </el-select>
      </el-form-item>
    </el-form>
    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm(formRef)">取 消</el-button>
      <el-button type="primary" @click="submitForm(formRef)"> 确 定 </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { EventEnum } from '@/utils/enum'
import { showLoading, hideLoading, compareDiffDictionary } from '@/utils/tool'
import {
  addResourceConfigApi,
  editResourceConfigApi
} from '@/api/java/operate-center'
import { resourcePoolTypeList, resourcePoolRegionList } from '@/api/java/public'
import { queryProjectListApi } from '@/api/java/business-center'

//获取今天的日期
const today: Date = new Date()
//时间转换处理
const dateFormat = (date: any) => {
  const year: number = date.getFullYear() // 获取年份（四位数）
  const month: string = (date.getMonth() + 1).toString().padStart(2, '0') // 获取月份并补零
  const day: string = date.getDate().toString().padStart(2, '0') // 获取日期并补零
  return year + '-' + month + '-' + day
}
// 属性值
interface DialogProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: null
})
const vdcId = useRoute().query.vdcId
const id = useRoute().query.id
const resourcePoolId = useRoute().query.id
const isDisabled = computed(() => !!props.rowData.id)

const formRef = ref<FormInstance>()
const form = reactive({
  name: '', //策略名称
  resourceType: '', // 同步资源
  projectId: '', //同步资源归属
  regionId: '', //同步区域
  type: '0', // 同步方式
  timeUnit: '', //同步时间单位
  syncTime: '', // 同步时间
  syncDay: '', // 同步天数 同步时间单位 周：1-7；月：1-31；年：例如03-19
  frequency: 0, // 频率
  specificWeek: '', // 周
  specificMonth: '', // 月
  specificYear: ''
})

//表单校验
const checkTime = (rule: any, value: any, callback: any) => {
  if (!form.syncTime || !form.timeUnit) {
    return callback(new Error('请选择同步时间'))
  } else {
    callback()
  }
}
const rules = reactive<FormRules>({
  name: [{ required: true, message: '策略名称不能为空', trigger: 'blur' }],
  resourceType: [
    { required: true, message: '请选择资源类型', trigger: 'blur' }
  ],
  projectId: [{ required: true, message: '请选择资源归属', trigger: 'change' }],
  regionId: [{ required: true, message: '同步区域不能为空', trigger: 'blur' }],
  time: [{ required: true, validator: checkTime, trigger: 'blur' }]
})

const isEdit = computed(() => Object.keys(props.rowData).length > 0) // 是否编辑页面
onMounted(() => {
  if (isEdit.value) {
    getEditData()
  }
  getResourcePoolType()
  getProjectList()
  getResourcePoolRegion()
})
//获取项目列表
const projectList = ref<any[]>([])
const getProjectList = async () => {
  const res: any = await queryProjectListApi({ vdcId })
  if (res.code === 200) {
    projectList.value = res.data
  } else {
    projectList.value = []
  }
}
// 资源类型
const resourceTypeList = ref<any[]>([])
const getResourcePoolType = () => {
  resourcePoolTypeList()
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        resourceTypeList.value = data
      } else {
        resourceTypeList.value = []
      }
    })
    .catch(_ => {
      resourceTypeList.value = []
    })
}
// 区域
const regionList = ref<any[]>([])
const getResourcePoolRegion = () => {
  resourcePoolRegionList({ id: resourcePoolId })
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        regionList.value = data
      } else {
        regionList.value = []
      }
    })
    .catch(_ => {
      regionList.value = []
    })
}
// 表单深拷贝, 比较表单是否修改
const originDic = ref()
const getEditData = () => {
  form.name = props.rowData.name
  form.resourceType = props.rowData.resourceType
  form.projectId = props.rowData.project?.id
  form.regionId = props.rowData.region
  form.timeUnit = String(props.rowData.timeUnit)
  form.type = String(props.rowData.type)
  if (form.timeUnit === '2' || form.timeUnit === '3' || form.timeUnit === '4') {
    form.syncTime = props.rowData.syncTime
  } else if (form.timeUnit === '5' || form.timeUnit === '6') {
    form.frequency = Number(props.rowData.syncTime)
  }
  if (form.timeUnit === '2' || form.timeUnit === '3') {
    form.syncDay = props.rowData.syncDay
  }

  originDic.value = Object.assign({}, form)
}
const dateOptions: any = ref([
  { label: '周一', value: '1' },
  { label: '周二', value: '2' },
  { label: '周三', value: '3' },
  { label: '周四', value: '4' },
  { label: '周五', value: '5' },
  { label: '周六', value: '6' },
  { label: '周日', value: '7' }
])
const typeList = [
  { label: '无', value: '0' },
  { label: '定义同步时间', value: '1' },
  { label: '定义同步频率', value: '2' }
]
const changeType = () => {
  form.timeUnit = ''
  form.syncTime = ''
  form.syncDay = ''
}
const changeTimeUnit = () => {
  form.syncDay = ''
}

//成功/取消枚举值
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
//表单提交方法
const emit = defineEmits<EventEmits>()

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  await formEl.validate(async (valid: any) => {
    if (valid) {
      if (props.rowData.id) {
        handleEdit()
      } else {
        handleCreate()
      }
    } else {
      console.log('error submit!')
    }
  })
}
// 创建
const handleCreate = () => {
  const params: { [key: string]: any } = {
    name: form.name,
    vdcId,
    resourcePoolId,
    resourceType: form.resourceType,
    project: {
      id: form.projectId
    },
    region: {
      id: form.regionId
    },
    type: form.type,
    timeUnit: form.timeUnit // 同步时间单位 1年，2月，3周，4天，5时，6分钟
  }
  if (form.timeUnit === '2' || form.timeUnit === '3' || form.timeUnit === '4') {
    params.syncTime = form.syncTime
  } else {
    params.syncTime = form.frequency
  }
  if (form.timeUnit === '2' || form.timeUnit === '3') {
    params.syncDay = form.syncDay
  }

  showLoading()
  addResourceConfigApi(params)
    .then((res: any) => {
      const { code } = res
      if (code === 200) {
        ElMessage.success('资源同步配置成功')
        emit(EventEnum.success)
      } else {
        ElMessage.error('资源同步配置失败')
      }
      hideLoading()
    })
    .catch(_ => {
      hideLoading()
    })
}
const handleEdit = () => {
  // 筛选表单修改项
  const tempDic = compareDiffDictionary(originDic.value, form)
  let params: {[key: string]: any} = {
    id: props.rowData.id
  }
  for(const key in tempDic) {
    if (key === 'frequency') {
      params.syncTime = form.frequency
    } else {
      params[key] = tempDic[key]
    }
  }
  showLoading()
  editResourceConfigApi(params)
    .then((res: any) => {
      const { code } = res
      if (code === 200) {
        ElMessage.success('资源同步配置成功')
        emit(EventEnum.success)
      } else {
        ElMessage.error('资源同步配置失败')
      }
      hideLoading()
    })
    .catch(_ => {
      hideLoading()
    })
}
//表单取消方法
const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  emit(EventEnum.cancel)
}
</script>

<style lang="scss" scoped>
.select-width {
  width: 100px;
}
.input-width {
  width: 100%;
}
.btn-list {
  text-align: right;
}
:deep .el-date-editor {
  width: 140px;
  margin-right: 10px;
}
// 修改分割线颜色
:deep(.el-divider--vertical) {
  border-left: 2px var(--el-color-primary) solid;
}
</style>
