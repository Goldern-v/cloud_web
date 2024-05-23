<template>
  <div class="share-single">
    <el-descriptions title="镜像详情" :column="1">
      <el-descriptions-item label="镜像名称">{{ rowData.name }}</el-descriptions-item>
      <el-descriptions-item label="操作系统类型">{{ rowData.osType }}</el-descriptions-item>
      <el-descriptions-item label="操作系统">{{ rowData.osVersion }}</el-descriptions-item>
      <el-descriptions-item label="镜像大小">{{ rowData.minDisk }}</el-descriptions-item>
    </el-descriptions>

    <el-tabs v-model="activeName">
      <el-tab-pane label="共享镜像" name="share">
        <div class="ideal-middle-margin-bottom">请输入共享镜像接受者的项目ID。如果输入多个项目ID，请使用英文逗号间隔。</div>
        <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
          <el-form-item label="项目ID" prop="projectId">
            <el-input
              v-model="form.projectId"
              type="textarea"
              class="input-width"
            />
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="取消共享" name="cancel">
        <div class="ideal-middle-margin-bottom">取消共享后，该镜像将不再共享给选中的租户。</div>
        <ideal-table-list
          :loading="state.dataListLoading"
          :table-data="state.dataList"
          :table-headers="tableHeaders"
          :show-pagination="false"
          :is-multiple="true"
          style="padding: 0px 17px"
          @handleSelectionChange="selectionChangeHandle"
        >
          <template #status>
            <el-table-column label="状态">
              <template #default="props">
                <ideal-status-icon
                  v-if="props.row.shareStatus"
                  :status-icon="props.row.statusIcon"
                  :status-text="props.row.statusText"
                />
              </template>
            </el-table-column>
          </template>
        </ideal-table-list>
      </el-tab-pane>
    </el-tabs>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus/es'
import type { FormRules, FormInstance } from 'element-plus'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum } from '@/utils/enum'
import { RESOURCE_STATUS, RESOURCE_STATUS_ICON } from '@/utils/dictionary'
import { mirrorShare, mirrorShareRelationUrl, mirrorShareCancel } from '@/api/java/compute'

interface ShareProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<ShareProps>(), {
  rowData: null
})

const { t } = useI18n()

const activeName = ref('share')

// 表单
const formRef = ref<FormInstance>()
const form = reactive({
  projectId: '' // 项目ID
})
const rules = reactive<FormRules>({
  projectId: [{ required: true, message: '请输入项目ID', trigger: 'blur' }]
})

onMounted(() => {
  if (props.rowData) {
    state.queryForm.id = props.rowData.id
    query()
  }
})

// 项目列表(取消共享)
const state: IHooksOptions = reactive({
  dataListUrl: mirrorShareRelationUrl,
  isPage: false,
  createdIsNeed: false,
  primaryKey: 'projectId', // 筛选出项目Id
  queryForm: {}
})
const { query, selectionChangeHandle } = useCrud(state)
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '项目ID', prop: 'projectId' },
  { label: '状态', prop: 'status', useSlot: true }
]
watch(
  () => state.dataList,
  value => {
    if (value?.length) {
      value.forEach((item: any) => {
        item.showCopy = false
        item.statusText = RESOURCE_STATUS[item?.shareStatus]
        item.statusIcon = RESOURCE_STATUS_ICON[item?.shareStatus]
      })
    }
  }
)

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
  if (activeName.value === 'share') {
    if (!formEl) {
      return
    }
    formEl.validate(valid => {
      if (valid) {
        handleShare()
      } else {
        console.log('error submit!')
        return false
      }
    })
  } else {
    handleCancel()
  }
}
// 共享镜像
const handleShare = () => {
  const params: {[key: string]: any} = {}
  if (props.rowData) {
    params.id = props.rowData.id
    params.projectIds = form.projectId.split(',')
  }
  mirrorShare(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('共享成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error('共享失败')
    }
  })
}
// 取消镜像
const handleCancel = () => {
  const params: {[key: string]: any} = {}
  if (props.rowData && state?.dataListSelections) {
    params.id = props.rowData.id
    params.projectIds = state.dataListSelections
  }
  mirrorShareCancel(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('取消共享成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error('取消共享失败')
    }
  })
}
</script>

<style scoped lang="scss">
.share-single {
  width: 100%;
  :deep(.el-descriptions__body .el-descriptions__table .el-descriptions__cell) {
    font-size: $defaultFontSize;
  }
}
</style>
