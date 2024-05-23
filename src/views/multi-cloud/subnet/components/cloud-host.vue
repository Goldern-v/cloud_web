<template>
  <div class="ideal-table-list__container cloud-host">
    <ideal-search :type-array="typeArray" @clickSearch="onClickSearch" />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :show-pagination="false"
    >
      <template #name>
        <el-table-column label="名称/ID" width="280" show-overflow-tooltip>
          <template #default="props">
            <el-button
              link
              type="primary"
              :disabled="props.row.statusIcon === 'loading'"
              @click="toInstance(props.row)"
            >
              {{ props.row.name }}
            </el-button>
            <ideal-text-copy
              :row="props.row"
              @mouseEnterEvent="value => (props.row.showCopy = value)"
              @mouseLeaveEvent="value => (props.row.showCopy = value)"
            />
          </template>
        </el-table-column>
      </template>

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

      <template #spec>
        <el-table-column label="规格" show-overflow-tooltip>
          <template #default="props">
            <div v-if="props.row.flavor.uuid">{{ props.row.flavor.uuid }}</div>
            <div v-if="props.row.flavor.vcpus">
              {{ props.row.flavor.vcpus }}核｜{{ props.row.flavor.ram }}G
            </div>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>
  </div>
</template>

<script setup lang="ts">
import type {
  IdealTableColumnHeaders,
  IdealSearch,
  IdealTextProp
} from '@/types'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { FiltrateEnum, BillingEnum } from '@/utils/enum'
import { RESOURCE_STATUS_ICON, RESOURCE_STATUS } from '@/utils/dictionary'

interface detailProps {
  detailInfo?: any // 行数据
}
const props = withDefaults(defineProps<detailProps>(), {
  detailInfo: () => ({})
})

/**
 * 搜索
 */
const typeArray = ref<IdealSearch[]>([
  { label: '名称', prop: 'name', type: FiltrateEnum.input },
  { label: 'ID', prop: 'id', type: FiltrateEnum.input }
])
const onClickSearch = (v: IdealTextProp[]) => {
  state.queryForm = {}
  if (v.length) {
    v.forEach((item: IdealTextProp) => {
      state.dataList = originalData.value?.filter((ele: any) =>
        ele[item.prop].includes(item.value)
      )
    })
  } else {
    state.dataList = originalData.value
  }
}
/**
 * 列表
 */
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const { sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)

// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '规格', prop: 'spec', useSlot: true },
  { label: 'IPV4地址', prop: 'ipv4' },
  { label: 'IPV6地址', prop: 'ipv6' },
  { label: '虚拟IP', prop: 'virtualIp' },
  { label: '付费模式', prop: 'billMode' },
  { label: '到期时间', prop: 'expirationDate' }
]

const originalData: any = ref([]) //记录一下原始数据，用来前端自己做过滤
watch(
  () => props.detailInfo,
  val => {
    val.instanceDtoList?.forEach((item: any) => {
      item.statusIcon = RESOURCE_STATUS_ICON[item.status]
      item.statusText = RESOURCE_STATUS[item.status]
      item.billMode =
        item.billType === BillingEnum.PACKAGE ? '包年包月' : '按需计费'
      item.ipv4 = val.nicDtoList[0].fixedIp
      item.ipv6 = item.ipv6 ? item.ipv6 : '--'
      item.expirationDate = item.expirationDate ? item.expirationDate : '--'
      item.virtualIp = item.virtualIp ? item.virtualIp : '--'
    })
    state.dataList = val.instanceDtoList
    originalData.value = JSON.parse(JSON.stringify(val.instanceDtoList))
  },
  { deep: true }
)

const route = useRoute()
const cloudPlatformTypeCode = route.query?.cloudPlatformTypeCode //云类型
const cloudPlatformCategoryCode = route.query?.cloudPlatformCategoryCode //云类别

const router = useRouter()
const toInstance = (row: any) => {
  router.push({
    path: '/multi-cloud/cloud-host/detail',
    query: {
      uuid: row?.uuid,
      cloudCategory: cloudPlatformCategoryCode,
      cloudType: cloudPlatformTypeCode
    }
  })
}
</script>

<style scoped lang="scss">
.cloud-host {
  width: 100%;
  padding: 20px;
  .cloud-host__search {
    align-items: center;
    justify-content: flex-start;
  }
}
</style>
