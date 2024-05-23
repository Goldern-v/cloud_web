<template>
  <div class="bind-eip">
    <p>
      辅助弹性网卡 <span class="ideal-large-margin-left assist-nic">{{ rowData.fixedIp }}</span>
    </p>

    <ideal-search
      :type-array="typeArray"
      class="ideal-large-margin-top"
      @clickSearch="onClickSearch"
    />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      is-radio
      max-height="300"
      :show-pagination="false"
      @clickTableCellRow="clickTableCellRow"
    >
      <template #eip>
        <el-table-column label="弹性公网IP" width="270">
          <template #default="props">
            <div class="eip-table-title">
              {{ props.row.ipAddress }}
            </div>

            <div class="eip-table-sub">
              {{ props.row.name }}
            </div>
          </template>
        </el-table-column>
      </template>

      <template #status>
        <el-table-column label="状态" width="150">
          <template #default="props">
            <ideal-status-icon
              v-if="props.row.status"
              :status-icon="props.row.statusIcon"
              :status-text="props.row.statusText"
            />
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { ElMessage } from 'element-plus/es'
import { EventEnum, FiltrateEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealSearch,
  IdealTextProp
} from '@/types'
import { IHooksOptions } from '@/hooks/interface'
import { queryEipList, eipRelevanceInstance } from '@/api/java/network'
import { showLoading, hideLoading } from '@/utils/tool'
import { RESOURCE_STATUS, RESOURCE_STATUS_ICON } from '@/utils/dictionary'
interface NicProps {
  rowData?: any
}

const props = withDefaults(defineProps<NicProps>(), {
  rowData: () => ({})
})

const { t } = useI18n()
/**
 * 搜索类型
 * @type {IdealSearch[]}
 */
const typeArray = ref<IdealSearch[]>([
  { label: '名称', prop: 'name', type: FiltrateEnum.input },
  { label: 'UUID', prop: 'uuid', type: FiltrateEnum.input }
])

const onClickSearch = (v: IdealTextProp[]) => {
  state.queryForm = {}
  if (v.length) {
    v.forEach((item: IdealTextProp) => {
      const temp = item.label.split('：')
      state.queryForm[item.prop] = temp[1]
    })
  }
  getDataList()
}
//公共参数
const commonParams = {
  resourcePoolId: props.rowData.resourcePoolId,
  regionId: props.rowData.regionId,
  projectId: props.rowData.projectId
}
const state: IHooksOptions = reactive({
  dataListUrl: queryEipList,
  deleteUrl: '',
  queryForm: {
    status: 'UNBIND',
    ...commonParams
  },
  isPage: false
})

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '弹性公网IP', prop: 'eip', useSlot: true },
  { label: 'IPv6地址', prop: 'ipv6' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '带宽类型', prop: 'bandwidthType' },
  { label: '带宽名称', prop: 'bandwidth.name' },
  { label: '类型', prop: 'eipTypeCN' },
  { label: '带宽大小(Mbit/s)', prop: 'bandwidth.size' }
]
const { sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)

watch(
  () => state.dataList,
  arr => {
    arr?.forEach((item: any) => {
      item.showCopy = false
      item.statusIcon = RESOURCE_STATUS_ICON[item.status.toUpperCase()]
      item.statusText = RESOURCE_STATUS[item.status.toUpperCase()]
      item.bandwidthType =
        item.bandwidth?.shareType === 'WHOLE' ? '共享带宽' : '独占带宽'
      item.ipv6 = item.ipVersion === '4' ? '--' : ''
    })
  }
)

const selectEip = ref('')
const clickTableCellRow = (v: any) => {
  selectEip.value = v.uuid
}

/**
 * 确定、取消
 */
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()
const cancelForm = () => {
  emit(EventEnum.cancel)
}
const submitForm = () => {
  if (!selectEip.value) {
    return ElMessage.warning('请选择一个弹性Ip进行绑定')
  }
  const params = {
    uuid: selectEip.value,
    bindnicUuid: props.rowData.uuid,
    ...commonParams
  }
  showLoading('绑定中...')
  eipRelevanceInstance(params)
    .then((res: any) => {
      const { code } = res
      if (code === 200) {
        ElMessage.success('绑定成功')
        emit(EventEnum.success)
      } else {
        ElMessage.success('绑定失败')
      }
      hideLoading()
    })
    .catch(_ => {
      hideLoading()
    })
}
</script>

<style scoped lang="scss">
.bind-eip {
  .assist-nic {
    font-weight: bolder;
    color: var(--el-text-color-primary);
  }
}
</style>
