<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="选择实例"
      width="30%"
      :append-to-body="true"
      :before-close="handleClose"
    >
      <el-steps :active="currentStep">
        <el-step
          v-for="(item, index) in steps"
          :key="index"
          :title="item.title"
        >
          <template #icon>
            <div class="step-icon"></div>
          </template>
        </el-step>
      </el-steps>

      <!-- 资源池 -->
      <div v-if="currentStep == 0" class="step-content">
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-width="80px"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
        >
          <el-form-item label="云平台类别" prop="category">
            <el-select
              v-model="ruleForm.category"
              placeholder="请选择云平台类别"
            >
              <el-option
                v-for="(item, idx) of resourcePoolData"
                :key="idx"
                :label="item.name"
                :value="item.cloudCategory"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="云平台类型" prop="type">
            <el-select v-model="ruleForm.type" placeholder="请选择云平台类型">
              <el-option
                v-for="(item, idx) of resourcePoolTypeData"
                :key="idx"
                :label="item.name"
                :value="item.cloudType"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="资源池" prop="resourceBundleId">
            <el-select
              v-model="ruleForm.resourceBundleId"
              placeholder="请选择云资源池"
            >
              <el-option
                v-for="(item, idx) of cloudResourcePools"
                :key="idx"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <!-- 列表 -->
      <div v-if="currentStep == 1">
        <ideal-table-list
          :loading="state.dataListLoading"
          :table-data="state.dataList"
          :table-headers="exampleHeaders"
          :page="state.page"
          :total="state.total"
          :is-multiple="isMulti"
          :is-radio="!isMulti"
          style="padding: 10px 0 0 0"
          @clickSizeChange="sizeChangeHandle"
          @clickTableCellRow="clickTableCellRow"
          @handleSelectionChange="selectionChangeHandle"
        >
          <template v-if="props.resourceType === 'ESC'" #IP>
            <el-table-column label="IP地址" width="120">
              <template #default="scope">
                <span>{{ scope.row.ip }}</span>
              </template>
            </el-table-column>
          </template>
        </ideal-table-list>
      </div>

      <div class="button-group">
        <el-button @click="clickCancelEvent">取消</el-button>
        <el-button
          v-if="currentStep === 0"
          type="primary"
          @click="nextStep(ruleFormRef)"
          >下一步</el-button
        >
        <el-button v-if="currentStep > 0" @click="prevStep">上一步</el-button>
        <el-button
          v-if="currentStep === steps.length - 1"
          type="primary"
          @click="submitForm"
          >完成
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { EventEnum } from '@/utils/enum'
import { IdealTableColumnHeaders } from '@/types'
import { resourcePoolGrade } from '@/api/java/public'
import store from '@/store'
import type { FormInstance, FormRules } from 'element-plus'
import { getAssociatedInstanceList } from '@/api/java/maintenance-center'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import { ElMessage } from 'element-plus/es'
import { isEmpty } from '@/utils/is'
// 方法
interface EventEmits {
  (e: EventEnum.close): void
  (e: EventEnum.success, value: any): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()

// 定义from表单的类型
interface RuleForm {
  category: string
  type: string
  resourceBundleId: string
}
const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  category: '',
  type: '',
  resourceBundleId: ''
})

// 校验
const rules = reactive<FormRules<RuleForm>>({
  category: [
    { required: true, message: '请选择云平台类别', trigger: 'change' }
  ],
  type: [{ required: true, message: '请选择云平台类型', trigger: 'change' }],
  resourceBundleId: [
    { required: true, message: '请选择云资源池', trigger: 'change' }
  ]
})

// 传值
const props = defineProps({
  detailInfo: {
    type: Object,
    required: true
  },
  isEdit: {
    type: Boolean,
    required: false
  },
  resourceType: {
    type: String,
    required: false,
    default: ''
  },
  //单选或多选
  selectType: {
    type: String,
    required: false,
    default: 'multi' //默认多选
  }
})

const isMulti = computed(() => props.selectType === 'multi')
/**
 * 列表
 */
const state: IHooksOptions = reactive({
  dataListUrl: getAssociatedInstanceList,
  createdIsNeed: false,
  queryForm: {
    support: props.resourceType
  }
})
const { sizeChangeHandle, getDataList, selectionChangeHandle } = useCrud(state)

const instanceInfo = ref()
const clickTableCellRow = (row: any) => {
  instanceInfo.value = row
}

// 弹窗属性
const dialogVisible = ref(true)
// 步骤属性
const currentStep = ref(0)
// 步骤标题
const steps = [
  { title: '选资源池', component: 'StepOneComponent' },
  { title: '选择实例', component: 'StepTwoComponent' }
  // 更多步骤...
]

// 表格头
const exampleHeaders: IdealTableColumnHeaders[] = [
  { label: '实例ID', prop: 'uuid' },
  { label: '主机名称', prop: 'name' },
  { label: 'IP地址', prop: 'IP', useSlot: true }
]
onMounted(() => {
  resourcePool()
})
// 资源池列表
const resourcePoolData: any = ref([])
const resourcePoolTypeData: any = ref([])
const cloudResourcePools: any = ref([])

// 获取资源池列表
const resourcePool = () => {
  const vdcId = store.userStore.user.vdcId
  resourcePoolGrade({ vdcId }).then((res: any) => {
    const { data, code } = res
    if (code === 200 && data.length > 0) {
      resourcePoolData.value = data
      resourcePoolTypeData.value =
        resourcePoolData.value.length > 0
          ? resourcePoolData.value[0].cloudPlatformTypes
          : []
      if (props.isEdit && props.detailInfo.resourceInfos.length > 0) {
        // 编辑回显
        echo()
      }
    }
  })
}

watch(
  () => ruleForm.category,
  val => {
    ruleForm.type = ''
    ruleForm.resourceBundleId = ''
    if (val) {
      resourcePoolTypeData.value = resourcePoolData.value.find(
        (item: any) => item.cloudCategory === val
      ).cloudPlatformTypes
    } else {
      cloudResourcePools.value = []
    }
  }
)

watch(
  () => ruleForm.type,
  val => {
    ruleForm.resourceBundleId = ''
    if (val) {
      cloudResourcePools.value = resourcePoolTypeData.value.find(
        (item: any) => item.cloudType === val
      ).cloudResourcePools
    } else {
      cloudResourcePools.value = []
    }
  }
)
//
const echo = () => {
  // 找到resourcePoolData下面的cloudPlatformTypes下面的cloudResourcePools的id
  // 判断是否与详情里的返回的resourcePoolId相等
  resourcePoolData.value.forEach((item: any) => {
    if (item.cloudPlatformTypes.length > 0) {
      item.cloudPlatformTypes.forEach((obj: any) => {
        if (obj.cloudResourcePools.length > 0) {
          obj.cloudResourcePools.forEach((everyone: any) => {
            // console.log(everyone.id,props.detailInfo.resourceInfos[0]id);
            // console.log(everyone.id == props.detailInfo.resourceInfos[0].id);
            if (everyone.id == props.detailInfo.resourceInfos[0].id) {
              ruleForm.category = item.cloudCategory
              ruleForm.type = obj.cloudType
              ruleForm.resourceBundleId = everyone.id
            }
          })
        }
      })
    }
  })
}

watch(
  () => state.dataList,
  value => {
    if (value?.length && props.isEdit) {
      // props.detailInfo.resourceUuids.forEach((e: any) => {
      //   state.dataList = value.find((item: any) => item.uuid === e.uuid)
      // })
    }
  }
)
// 上一步
const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value -= 1
  }
}
// 下一步
const nextStep = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate((valid: boolean) => {
    if (valid && currentStep.value < steps.length - 1) {
      currentStep.value += 1
      state.queryForm.resourcePoolId = ruleForm.resourceBundleId
      getDataList()
    }
  })
}
// 关闭弹框
const handleClose = () => {
  dialogVisible.value = false
  emit(EventEnum.close)
}
// 完成
const dataList: any = ref([])
const submitForm = () => {
  dataList.value = state.dataListSelections || []
  if (
    (isMulti.value && state.dataListSelections?.length === 0) ||
    (!isMulti.value && isEmpty(instanceInfo.value))
  ) {
    ElMessage.warning('请选择实例')
    return
  } else {
    store.commonStore.setTempArray(state.dataList)
    // 存储多选数据
    if (isMulti.value) {
      store.commonStore.setSelectArray(state.dataListSelections || [])
    } else {
      // 存储单选数据
      store.commonStore.setTempObject(instanceInfo.value)
    }

    emit(EventEnum.success, ruleForm.resourceBundleId)
  }
}
// 弹框取消
const clickCancelEvent = () => {
  emit(EventEnum.close)
}
defineExpose({
  dataList
})
</script>

<style lang="scss" scoped>
.button-group {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
  margin-bottom: 10px;
}
.step-content {
  padding: 20px;
}
.step-icon {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid $brand5-light;
}
:deep .el-step__title.is-process {
  font-weight: normal;
  font-size: 12px;
  color: $brand5-light;
}
:deep .el-step__title.is-finish {
  font-size: 12px;
}
:deep .el-step__title.is-wait {
  font-weight: normal;
  font-size: 12px;
  color: $brand5-light;
}
:deep .el-step__line {
  background-color: $brand5-light;
  height: 1.5px !important;
}
</style>
