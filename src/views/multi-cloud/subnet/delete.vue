<template>
  <div class="delete-subnet">
    <div class="flex-row warning_desc">
      {{ inUse ? '无法' : '即将' }}删除子网<span>{{ props.rowData.name }}</span>
    </div>

    <el-alert v-if="inUse" type="error" show-icon>
      <template #title
        ><span class="ideal-tip-text"
          >子网已被下列资源使用，请删除以下资源后重试。</span
        ><el-text type="primary">了解更多</el-text></template
      >
    </el-alert>

    <div v-if="!inUse" class="ideal-tip-text">
      删除子网后无法恢复，请谨慎操作。
    </div>
  </div>

  <ideal-table-list
    :table-data="tableData"
    :table-headers="tableHeaders"
    :show-pagination="false"
  >
  </ideal-table-list>

  <div class="flex-row ideal-submit-button">
    <el-button type="info" @click="cancelForm">{{ t('cancel') }}</el-button>
    <el-button type="primary" :disabled="inUse" @click="submitForm">{{
      t('confirm')
    }}</el-button>
  </div>
</template>

<script setup lang="ts">
import type { IdealTableColumnHeaders } from '@/types'
import { ElMessage } from 'element-plus'
import { EventEnum } from '@/utils/enum'
import { showLoading, hideLoading } from '@/utils/tool'
import { querySubnetDetail, subnetDelete } from '@/api/java/network'
interface SubnetProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<SubnetProps>(), {
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

onBeforeMount(() => {
  queryDetail()
})
// 详情
const inUse = ref(false) //子网是否被其他资源使用
const queryDetail = () => {
  querySubnetDetail({ id: props.rowData.id, ...commonParams() }).then(
    (res: any) => {
      const { data, code } = res
      if (code === 200) {
        inUse.value = data.instanceDtoList?.length ? true : false
        if (data.instanceDtoList?.length > 0) {
          data.instanceDtoList?.forEach((item: any) => {
            item.resourceType = '弹性云主机'
            item.textType = 'primary'
          })
        }
        tableData.value = data.instanceDtoList?.length
          ? data.instanceDtoList
          : [props.rowData]
      } else {
        inUse.value = false
        tableData.value = [props.rowData]
      }
      tableHeaders.value = inUse.value ? subTableHeader : tableHeader
    }
  )
}

const tableData = ref<any[]>([])
const tableHeaders: any = ref([
  { label: '名称', prop: 'name' },
  { label: '网络ID', prop: 'uuid' },
  { label: '网段', prop: 'cidr' }
])
const tableHeader: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: '网络ID', prop: 'uuid' },
  { label: '网段', prop: 'cidr' }
]
const subTableHeader: IdealTableColumnHeaders[] = [
  { label: '云资源类型', prop: 'resourceType' },
  { label: '名称', prop: 'name', setTextType: true, textTypeProp: 'textType' }
]

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
    vpcId: props.rowData.vpcId,
    vdcId: props.rowData.vdcId,
    ...commonParams()
  }
  showLoading('删除中...')
  subnetDelete(params)
    .then((res: any) => {
      const { code } = res
      if (code === 200) {
        ElMessage.success('删除成功')
        emit(EventEnum.success)
      } else {
        ElMessage.success('删除失败')
      }
      hideLoading()
    })
    .catch(_ => {
      hideLoading()
    })
}
</script>

<style scoped lang="scss">
.delete-subnet {
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
}
</style>
