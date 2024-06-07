<template>
  <div>
    <div class="delete-vpc">
      <div>
        <div class="flex-row warning_desc">
          {{ exitSubnet ? '无法' : '即将' }}删除虚拟私有云<span>{{
            rowData.name
          }}</span>
        </div>
        <el-alert v-if="exitSubnet" type="error" show-icon>
          <template #title
            ><span class="ideal-tip-text"
              >VPC已被下列资源使用，请删除以下资源后重试。</span
            ><el-text type="primary">了解更多</el-text></template
          >
        </el-alert>
        <div v-if="!exitSubnet" class="ideal-tip-text">
          删除VPC后无法恢复，请谨慎操作。
        </div>
      </div>
      <ideal-table-list
        :table-data="tableData"
        :table-headers="tableHeaders"
        :show-pagination="false"
      >
        <template #name>
          <el-table-column label="名称">
            <template #default="props">
              <div class="ideal-theme-text" @click="toDetail(props.row)">
                {{ props.row.name }}
              </div>
            </template>
          </el-table-column>
        </template>
      </ideal-table-list>
    </div>

    <div class="flex-row ideal-submit-button">
      <el-button type="info" @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" :disabled="exitSubnet" @click="submitForm">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum } from '@/utils/enum'
import { showLoading, hideLoading } from '@/utils/tool'
import { vpcDelete } from '@/api/java/network'

interface VpcProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<VpcProps>(), {
  rowData: () => ({})
})

const { t } = useI18n()

const exitSubnet = computed(() => {
  return props.rowData.subnetDtoList?.length
}) //vpc下是否存在子网
//自定义路由表
const customRouteTable = computed(() =>
  props.rowData.routeTableDtoList.filter((item: any) => !item.defaultRoute)
)
const exitCustomRouteTable = computed(() => customRouteTable.value.length) //vpc下是否存在自定义路由表

// 原有规格数据
const tableData = ref<any[]>([])
const tableHeaders: any = ref([])
const subTableHeader: IdealTableColumnHeaders[] = [
  { label: '云资源类型', prop: 'resourceType' },
  { label: '名称', prop: 'name', useSlot: true }
]
const tableHeader: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: 'ID', prop: 'uuid' },
  { label: 'IPv4网段', prop: 'cidr' }
]

onBeforeMount(() => {
  tableHeaders.value = exitSubnet.value ? subTableHeader : tableHeader
  if (exitSubnet.value || exitCustomRouteTable.value) {
    props.rowData.subnetDtoList?.forEach((item: any) => {
      item.resourceType = '子网'
      item.textType = 'primary'
    })
    customRouteTable.value?.forEach((item: any) => {
      item.resourceType = '自定义路由表'
      item.textType = 'primary'
    })
    tableData.value = props.rowData.subnetDtoList.concat(customRouteTable.value)
  } else {
    tableData.value = [props.rowData]
  }
})

const router = useRouter()
const toDetail = (row: any) => {
  const pathUrl = row.resourceType === '子网' ? 'subnet' : 'route-table'
  router.push({
    path: `/multi-cloud/${pathUrl}/list`,
    query: { vpcId: props.rowData.id }
  })
}
const commonParams = () => {
  const params = {
    resourcePoolId: props.rowData.resourcePoolId,
    regionId: props.rowData.regionId,
    projectId: props.rowData.projectId,
    vdcId: props.rowData.vdcId
  }
  return params
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
    id: props.rowData.id,
    ...commonParams()
  }
  showLoading('删除中...')
  vpcDelete(params)
    .then((res: any) => {
      const { code } = res
      if (code === 200) {
        ElMessage.success('删除成功')
        emit(EventEnum.success)
      } else {
        ElMessage.error('删除失败')
      }
      hideLoading()
    })
    .catch(_ => {
      hideLoading()
    })
}
</script>

<style scoped lang="scss">
.delete-vpc {
  width: 100%;
  .footer-button {
    justify-content: flex-end;
    align-items: center;
    margin-top: 10px;
  }
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
  .ideal-theme-text {
    cursor: pointer;
  }
}
</style>
