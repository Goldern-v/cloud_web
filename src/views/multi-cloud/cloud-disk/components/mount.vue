<template>
  <div class="mount">
    <div class="flex-row mount-tip">
      <svg-icon
        icon="info-warning"
        color="var(--el-color-primary)"
        class="ideal-svg-margin-right"
      ></svg-icon>
      <div>
        <div class="mount-content">
          磁盘需与云服务器位于同一区域、同一可用区，才可挂载至云服务器上。
        </div>
        <div class="mount-content">
          挂载成功后，您需要登录服务器对挂载的磁盘进行<el-text type="primary"
            >分区格式化和挂载重新分区</el-text
          >操作。
        </div>
        <div class="mount-content">
          挂载为系统盘的磁盘必须是启动盘，且磁盘镜像必须与挂载的云服务器镜像相同。
        </div>
        <div class="mount-content">
          SCSI模式的共享云硬盘挂载至云服务器时，所有云服务器需在同一个云服务器组中。
        </div>
      </div>
    </div>

    <div class="flex-row ideal-default-margin-top">
      磁盘:
      <div>
        {{ rowData.name }} | {{ rowData.availableZone }} ｜
        {{ rowData.volumeMode }} ｜ {{ rowData.shareable ? '共享' : '非共享' }}
      </div>
    </div>

    <el-radio-group v-model="type" class="ideal-default-margin-top">
      <el-radio-button
        v-for="(item, index) of typeList"
        :key="index"
        :label="item.label"
      >
        {{ item.value }}
      </el-radio-button>
    </el-radio-group>

    <div class="flex-row mount-search ideal-default-margin-top">
      <ideal-select-search
        :options="searchOptions"
        @clickSearch="clickSearch"
        @clickReset="clickReset"
      />
    </div>

    <ideal-table-list
      row-key="uuid"
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :show-pagination="false"
      :is-radio="true"
      @clickTableCellRow="clickTableCellRow"
    >
      <template #status>
        <el-table-column label="状态" width="120">
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
import { ElMessage } from 'element-plus'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { EventEnum, BillingEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders } from '@/types'
import { RESOURCE_STATUS, RESOURCE_STATUS_ICON } from '@/utils/dictionary'
import { showLoading, hideLoading } from '@/utils/tool'
import store from '@/store'
import { cloudHostListUrl } from '@/api/java/compute'
import { cloudDiskAttach } from '@/api/java/store'

interface MountProp {
  rowData?: any
}
const props = withDefaults(defineProps<MountProp>(), {
  rowData: () => ({})
})

const { t } = useI18n()

onMounted(() => {
  state.queryForm = Object.assign({}, commonParams())
})

const commonParams = (): { [key: string]: any } => {
  return {
    resourcePoolId: props.rowData.resourcePoolId,
    regionId: props.rowData.regionId,
    projectId: props.rowData.projectId,
    availableZone: props.rowData.availableZone
  }
}

// 磁盘挂载类型
const type = ref('cloudHost')
const typeList = [
  { label: 'cloudHost', value: '弹性云服务器' },
  { label: 'bareMetal', value: '裸金属服务器' }
]
watch(
  () => type.value,
  value => {
    if (value === 'cloudHost') {
      state.dataListUrl = cloudHostListUrl
    } else if (value === 'bareMetal') {
      state.dataListUrl = ''
      state.dataList = [] // 后面有裸金属服务器接口再删除此行代码
    }
    getDataList()
  }
)

// 搜索
const clickSearch = (search: string, type: string) => {
  state.queryForm = Object.assign({}, commonParams())
  if (type) {
    state.queryForm[type] = search
  }
  getDataList()
}
// 重置
const clickReset = () => {
  state.page = 1
  state.queryForm = Object.assign({}, commonParams())
  getDataList()
}
// 列表下拉搜索
const searchOptions = [
  { label: '名称', prop: 'name' },
  { label: 'ID', prop: 'id' }
]
// 列表
const state: IHooksOptions = reactive({
  dataListUrl: cloudHostListUrl,
  isPage: false
})
const { getDataList } = useCrud(state)

watch(
  () => state.dataList,
  value => {
    if (value?.length) {
      value.forEach((item: any) => {
        item.encryptionDisk = item.encrypted === 1 ? '是' : '否'
        item.diskAttribute = item.bootable === 1 ? '系统盘' : '数据盘'
        item.billingDes = item.billType === BillingEnum.ON_DEMAND ? '按需' : '包年包月'
        item.statusText = RESOURCE_STATUS[item.status.toUpperCase()]
        item.statusIcon = RESOURCE_STATUS_ICON[item.status.toUpperCase()]
        handleIp(item)
      })
    }
  }
)

const handleIp = (item: any) => {
  if (item?.nicList?.length) {
    const privateArr = item.nicList.map((child: any) => {
      return child?.fixedIp
    })
    const publicArr = item.nicList.map((child: any) => {
      return child?.eip?.ipAddress
    })
    item.privateIp = privateArr.join(',')
    item.eip = publicArr.join(',')
  }
}

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: '计费模式', prop: 'billingDes' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '镜像', prop: 'image.osVersion' },
  { label: '私有IP地址', prop: 'privateIp' },
  { label: '弹性公网IP', prop: 'eip' },
  { label: '可用区', prop: 'availableZone' }
]
// 当前选择结果
const currentRow = ref()
// 列表选择
const clickTableCellRow = (row: any) => {
  currentRow.value = row
}
// 方法
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const cancelForm = () => {
  emit(EventEnum.cancel)
}

const submitForm = () => {
  if (!currentRow.value) {
    const tip =
      type.value === 'cloudHost' ? '请选择云主机' : '请选择裸金属服务器'
    return ElMessage.warning(tip)
  }

  const params = {
    projectId: props.rowData.projectId,
    regionId: props.rowData.regionId,
    resourcePoolId: props.rowData.resourcePoolId,
    id: props.rowData.id, // 云硬盘id(非uuid)
    instanceId: currentRow.value.id // 云主机id(非uuid)
  }
  showLoading('挂载中...')
  cloudDiskAttach(params)
    .then((res: any) => {
      const { code, eventFlowId } = res
      if (code === 200) {
        if (eventFlowId.length) {
          // 保存事件流id
          eventFlowId.forEach((item: string) => {
            store.resourceStore.eventFlow.push({ eventFlowId: item })
          })
        }
        ElMessage.success('挂载成功')
        emit(EventEnum.success)
      } else {
        ElMessage.error('挂载失败')
      }
      hideLoading()
    })
    .catch(_ => {
      hideLoading()
    })
}
</script>

<style scoped lang="scss">
.mount {
  width: 100%;
  .mount-tip {
    background-color: var(--el-color-primary-light-9);
    border-radius: $circleRadiusSize;
    border: 1px solid var(--el-color-primary);
    padding: 10px;
  }
  .mount-content {
    height: 20px;
    line-height: 20px;
  }
  .mount-search {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
