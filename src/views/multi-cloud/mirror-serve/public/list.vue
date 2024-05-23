<template>
  <div class="public-mirror">
    <ideal-search
      ref="searchRef"
      class="ideal-middle-margin-top"
      :type-array="typeArray"
      @clickSearch="onClickSearch"
    />

    <el-divider />

    <ideal-button-events
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    />

    <ideal-table-list
      row-key="id"
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      :is-radio="true"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
      @clickTableCellRow="clickTableCellRow"
    >
      <template #osType>
        <el-table-column label="操作系统" width="120">
          <template #default="props">
            <div class="flex-row">
              <svg-icon
                v-if="props.row?.systemType"
                :icon="props.row?.systemType"
                class="ideal-svg-margin-right"
              />
              <div>{{ props.row.platform }}</div>
            </div>
          </template>
        </el-table-column>
      </template>

      <template #status>
        <el-table-column label="状态" width="120">
          <template #default="props">
            <ideal-status-icon
              v-if="props.row?.status"
              :status-icon="props.row?.statusIcon"
              :status-text="props.row?.statusText"
            />
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" fixed="right" width="120">
          <template #default="props">
            <ideal-table-operate
              :buttons="operateBtns"
              @clickMoreEvent="clickOperateEvent($event, props.row)"
            >
            </ideal-table-operate>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <div class="flex-row public-mirror-info">
      <div style="width: 100%">
        <div
          v-if="rowData"
          class="flex-row public-mirror-info-box"
          @click="clickMirrorDetail"
        >
          <div>已选择：{{ rowData?.name }}</div>
          <svg-icon :icon="arrowIcon" />
        </div>
        <div v-else style="text-align: left">未选择</div>

        <ideal-detail-info
          v-if="showDetail"
          :label-array="labelArray"
          :item-number="2"
          :detail-info="rowData"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import store from '@/store'
import { RESOURCE_STATUS, RESOURCE_STATUS_ICON } from '@/utils/dictionary'
import { FiltrateEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp,
  IdealSearch,
  IdealSearchResult
} from '@/types'
import { mirrorPageUrl } from '@/api/java/compute'

// 搜索
const typeArray = ref<IdealSearch[]>([
  { label: '名称', prop: 'name', type: FiltrateEnum.input }
])
const onClickSearch = (v: IdealSearchResult[]) => {
  state.queryForm = {
    visibility: 'public'
  }
  if (v.length) {
    v.forEach((item: IdealSearchResult) => {
      state.queryForm[item.prop] = item.value
    })
  }
  getDataList()
}

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: mirrorPageUrl,
  deleteUrl: '',
  queryForm: {
    visibility: 'public'
  }
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList
} = useCrud(state)

watch(
  () => state.dataList,
  value => {
    if (value?.length) {
      value.forEach((item: any) => {
        item.statusText = RESOURCE_STATUS[item?.status]
        item.statusIcon = RESOURCE_STATUS_ICON[item?.status]
        item.systemType = `os-${item?.platform.toLowerCase()}`
        item.mirrorType =
          item?.imageType === 'SystemDiskImage' ? '系统镜像' : '云盘镜像' // system系统镜像、volume云盘镜像
        item.createDate = item?.createTime?.date
      })
    }
  }
)

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: '云平台类别', prop: 'cloudPlatformCategory' },
  { label: '云平台类型', prop: 'cloudPlatformType' },
  { label: '云平台名称', prop: 'cloudPlatformName' },
  { label: '资源池名称', prop: 'resourcePoolName' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '操作系统', prop: 'osType', useSlot: true },
  { label: '镜像类型', prop: 'mirrorType' },
  { label: '磁盘容量(GiB)', prop: 'size', width: '120' }
]

const operateBtns: IdealTableColumnOperate[] = [
  { title: '申请服务器', prop: 'apply' }
]
const router = useRouter()
const clickOperateEvent = (command: string | number | object, row: any) => {
  if (command === 'apply') {
    const dic = {
      categoryId: row?.cloudPlatformCategoryCode,
      cloudPlatformType: row?.cloudPlatformTypeCode,
      resourcePoolId: row?.resourcePoolId,
      cloudPlatformId: row?.cloudPlatformId,
      vdcId: row?.vdc?.id
    }
    store.resourceStore.resourcePool = dic
    router.push({
      path: '/multi-cloud/cloud-host/create',
      query: { platform: row?.platform, imageId: row?.id, imageType: row?.visibility }
    })
  }
}
// 列表左侧按钮
const leftButtons: IdealButtonEventProp[] = [
  {
    title: '导出',
    prop: 'export',
    type: 'primary',
    iconColor: 'white'
  }
]
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'export') {
  }
}
// 当前行数据
const rowData = ref()
// 列表选择
const clickTableCellRow = (row: any) => {
  rowData.value = row
}
// 是否显示镜像详情
const showDetail = ref(false)
const arrowIcon = ref('up-arrow')
// 查看选择镜像详情
const clickMirrorDetail = () => {
  if (!rowData.value) {
    return
  }
  showDetail.value = !showDetail.value
  if (showDetail.value) {
    arrowIcon.value = 'down-arrow'
  } else {
    arrowIcon.value = 'up-arrow'
  }
}
const labelArray = ref([
  { label: '名称', prop: 'name' },
  { label: '镜像ID', prop: 'id' },
  { label: '系统盘(GiB)', prop: 'size' },
  { label: '操作系统', prop: 'osType' },
  { label: '最小内存', prop: 'minRam' },
  { label: '创建时间', prop: 'createDate' },
  { label: '最大内存', prop: '' },
  { label: '描述', prop: '' },
  { label: '架构类型', prop: 'architecture' }
])
</script>

<style scoped lang="scss">
.public-mirror {
  width: 100%;
  :deep(.el-select .el-input) {
    width: 160px;
  }
  :deep(.el-input-group) {
    width: 380px;
  }
  .public-mirror-info {
    position: fixed;
    width: calc(100% - $sidebarWidth);
    bottom: 0px;
    left: $sidebarWidth;
    background: #fff;
    z-index: 2000;
    box-shadow: 5px 5px 17px 9px #e5e9ea;
    text-align: center;
    overflow: hidden;
    padding: 10px 20px;
    .public-mirror-info-box {
      width: calc(100% - 40px);
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
    }
  }
}
</style>
