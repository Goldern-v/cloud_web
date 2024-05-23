<template>
  <div class="resource-bind">
    <div class="flex-row resource-bind-center">
      <div class="flex-row resource-bind-center ideal-default-margin-right">
        <region-filter
          ref="resourceFilterRef"
          class="resource-filter"
          prefix-title="资源池筛选"
          @clickSelectTable="clickSelectTable"
          @clickSelectResource="clickSelectResource"
        >
        </region-filter>
      </div>

      <ideal-select-search
        :options="searchOptions"
        default-assign
        @selectChange="selectChange"
      >
      </ideal-select-search>
    </div>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :is-multiple="true"
      :pagination-type="PaginationTypeEnum.total"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #status>
        <el-table-column label="状态">
          <template #default="props">
            <ideal-status-icon
              :status-icon="props.row.statusIcon"
              :status-text="props.row.statusText"
            ></ideal-status-icon>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <div>已选择{{ multipleResource?.length }} / {{ tableLength }}</div>

    <div class="flex-row footer-button">
      <el-button type="info" @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders } from '@/types'
import { PaginationTypeEnum, EventEnum } from '@/utils/enum'
import regionFilter from './region-filter.vue'
import { RESOURCE_STATUS, RESOURCE_STATUS_ICON } from '@/utils/dictionary'
import store from '@/store'
import { ElMessage } from 'element-plus'
import { cloudHostUrl } from '@/api/java/compute'
import { cloudDiskPageUrl } from '@/api/java/store'
import {
  resourceLabelBind,
  queryResourceTypeList,
  queryUnbindResourceList
} from '@/api/java/business-center'

interface DialogProps {
  rowData?: any //多选
}
const props = withDefaults(defineProps<DialogProps>(), {
  rowData: () => ({})
})
const { t } = useI18n()

const { resourcePoolInfo, regionInfo } = store.resourceStore

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: queryUnbindResourceList,
  createdIsNeed: false,
  deleteUrl: '',
  isPage: false,
  queryForm: {}
})

onMounted(() => {
  queryResourceType()
})

const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList
} = useCrud(state)
// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '资源ID', prop: 'id' },
  { label: '资源名称', prop: 'name' },
  { label: '产品类型', prop: 'resourceType' },
  { label: '状态', prop: 'status', useSlot: true }
]

const searchOptions = ref([]) //可绑定的资源类型
const currentResource: any = ref('') //选定资源类型
//资源类型变化
const selectChange = (resource: any) => {
  currentResource.value = resource
}
//查询可绑定的资源类型
const queryResourceType = () => {
  queryResourceTypeList().then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      searchOptions.value = data.map((item: any) => {
        return {
          label: item.name,
          prop: item.code
        }
      })
      currentResource.value = data[0].code
    } else {
      searchOptions.value = []
    }
  })
}

const selectResourcePool: any = ref({}) //选定资源池信息
const clickSelectResource = (type: string, resourcePoolInfo: any) => {
  selectResourcePool.value = resourcePoolInfo
}

const selectRegion: any = ref({}) //选定的区域信息
const clickSelectTable = (type: string, regionInfo: any) => {
  selectRegion.value = regionInfo
}

watch(
  () => [selectResourcePool, selectRegion, currentResource],
  ([resourcePool, region, resource]) => {
    if (resourcePool.value?.id && region.value?.code && resource.value) {
      state.queryForm.resourceBundleId = resourcePool.value?.id
      state.queryForm.region = region.value?.id
      state.queryForm.resourceType = resource.value
      state.queryForm.cloudLabelId = props.rowData.id
      getDataList()
    }
  },
  { deep: true }
)

const tableLength = ref(0)
watch(
  () => state.dataList,
  value => {
    if (value?.length) {
      tableLength.value = value.length
      value.forEach((item: any) => {
        item.statusText = RESOURCE_STATUS[item.status.toUpperCase()]
        item.statusIcon = RESOURCE_STATUS_ICON[item.status]
      })
    }
  }
)

const multipleResource: any = ref([])
watch(
  () => state.dataListSelections,
  value => {
    if (value) {
      multipleResource.value = value
    }
  }
)

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
  const bindResourceUuIds = multipleResource.value.map((item: any) => {
    return item.id
  })
  const params = {
    cloudLabelIds: [props.rowData.id],
    resourceBundleId: multipleResource.value[0].resourceBundleId,
    resourceTypeCode: multipleResource.value[0].resourceType,
    region: regionInfo.id,
    bindResourceUuIds
  }
  resourceLabelBind(params).then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      ElMessage.success('资源绑定成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error('资源绑定失败')
    }
  })
}
</script>
<style scoped lang="scss">
.resource-bind {
  width: 100%;
  .resource-bind-center {
    align-items: center;
  }
  .footer-button {
    justify-content: flex-end;
    align-items: center;
    margin-top: 10px;
  }
}
</style>
