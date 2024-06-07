<template>
  <div class="delete-safe-group">
    <div class="flex-row warning_desc">
      {{ inUse ? '无法' : '即将' }}删除安全组<span>{{
        props.rowData.name
      }}</span>
    </div>
    <el-alert v-if="inUse" type="error" show-icon>
      <template #title
        ><span class="ideal-tip-text"
          >安全组被实例关联或者被其他安全组规则关联时不能直接删除，请解除关联关系后再进行删除。</span
        ></template
      >
    </el-alert>

    <div v-if="!inUse" class="ideal-tip-text">
      删除安全组后无法恢复，请谨慎操作。
    </div>

    <ideal-table-list
      :table-data="tableData"
      :table-headers="tableHeaders"
      :show-pagination="false"
    >
      <template #reason>
        <el-table-column label="理由">
          <template #default="props">
            当前安全组被实例关联。<el-text
              type="primary"
              @click="toInstance(props.row)"
              >查看关联实例</el-text
            ></template
          >
        </el-table-column>
      </template>
    </ideal-table-list>

    <div class="flex-row ideal-submit-button">
      <el-button type="info" @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" :disabled="inUse" @click="submitForm">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum } from '@/utils/enum'
import { ElMessage } from 'element-plus/es'
import { safeGroupDelete } from '@/api/java/network'
interface SafeGroupProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<SafeGroupProps>(), {
  rowData: () => ({})
})

const { t } = useI18n()
//公共参数
const commonParams = () => {
  const params = {
    resourcePoolId: props.rowData.resourcePoolId,
    regionId: props.rowData.regionId,
    projectId: props.rowData.projectId
  }
  return params
}

const tableData = ref<any[]>([])
const tableHeaders: any = ref([])
const tableHeader: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: '描述', prop: 'description' }
]
const subTableHeader: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: '原因', prop: 'reason', useSlot: true }
]
const inUse = ref(false)
watch(
  () => props.rowData,
  val => {
    inUse.value = val.instanceList?.length > 0
    tableHeaders.value = inUse.value ? subTableHeader : tableHeader
    tableData.value = inUse.value ? val.instanceList : [val]
  },
  { deep: true, immediate: true }
)

const router = useRouter()
const toInstance = (row: any) => {
  router.push({
    path: '/multi-cloud/cloud-host/detail',
    query: {
      uuid: row.uuid,
      cloudCategory: props.rowData.cloudPlatformCategoryCode,
      cloudType: props.rowData.cloudPlatformTypeCode
    }
  })
}

// 点击事件
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const cancelForm = () => {
  emit(EventEnum.cancel)
}

const submitForm = () => {
  const params = {
    uuid: props.rowData.uuid,
    vdcId: props.rowData.vdcId,
    ...commonParams()
  }
  safeGroupDelete(params).then((res: any) => {
    let { code } = res
    if (code === 200) {
      emit(EventEnum.success)
      ElMessage.success('删除安全组成功')
    } else {
      ElMessage.error('删除安全组失败')
    }
  })
}
</script>

<style scoped lang="scss">
.delete-safe-group {
  .warning_desc {
    margin: 10px 0;
    font-size: 14px;
    align-items: center;
    span {
      font-weight: bolder;
      color: var(--el-text-color-primary);
      margin-left: 5px;
    }
  }
  .el-alert {
    padding: 12px;
  }
  .el-text {
    cursor: pointer;
  }
}
</style>
