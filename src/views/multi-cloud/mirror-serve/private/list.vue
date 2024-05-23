<template>
  <div class="private-mirror">
    <div v-if="showTip" class="flex-row private-mirror-tip ideal-middle-margin-top ideal-middle-margin-bottom">
      <div class="flex-row">
        <span
          >镜像支持云服务器快速发放，建议您优化不支持该功能的镜像。请在详情页面查看镜像是否支持快速发放。</span
        >
        <span class="ideal-theme-text">了解更多</span>
      </div>
      <svg-icon icon="close-icon" @click="clickCloseTip" />
    </div>

    <!-- <div class="ideal-middle-margin-bottom">您还可以创建49个私有镜像。</div> -->

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
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      :is-multiple="true"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #name>
        <el-table-column label="名称/ID" width="280" show-overflow-tooltip>
          <template #default="props">
            <el-button
              link
              type="primary"
              :disabled="props.row?.statusIcon === 'loading'"
              @click="handleRedirectDetail(props.row)"
              >{{ props.row.name }}</el-button
            >

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
              v-if="props.row.status"
              :status-icon="props.row?.statusIcon"
              :status-text="props.row?.statusText"
            />
          </template>
        </el-table-column>
      </template>

      <template #systemType>
        <el-table-column label="操作系统" show-overflow-tooltip width="120">
          <template #default="props">
            <div class="flex-row">
              <svg-icon
                v-if="props.row?.systemType"
                :icon="props.row?.systemType"
                class="ideal-svg-margin-right"
              />
              <div>{{ props.row?.platform }}</div>
            </div>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" fixed="right" width="185">
          <template #default="props">
            <ideal-table-operate
              :buttons="props.row.operate"
              :max-buttons="3"
              @clickMoreEvent="clickOperateEvent($event, props.row)"
            >
            </ideal-table-operate>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      :row-data="rowData"
      :select-data="state.dataListSelections"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    />
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus/es'
import dialogBox from './dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import store from '@/store'
import { OperateEventEnum, FiltrateEnum } from '@/utils/enum'
import { existPropWithArray } from '@/utils/tool'
import { RESOURCE_STATUS, RESOURCE_STATUS_ICON } from '@/utils/dictionary'
import { showLoading, hideLoading } from '@/utils/tool'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp,
  IdealSearch,
  IdealSearchResult
} from '@/types'
import {
  mirrorPageUrl,
  privateMirrorUrl,
  mirrorBatchDelete
} from '@/api/java/compute'

const showTip = ref(true)
const clickCloseTip = () => {
  showTip.value = false
}

// 搜索
const typeArray = ref<IdealSearch[]>([
  { label: '名称', prop: 'name', type: FiltrateEnum.input },
  { label: 'ID', prop: 'uuid', type: FiltrateEnum.input }
])
const onClickSearch = (v: IdealSearchResult[]) => {
  state.queryForm = {
    visibility: 'private'
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
  deleteUrl: privateMirrorUrl,
  queryForm: {
    visibility: 'private'
  }
})
const {
  query,
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  deleteHandle,
  getDataList
} = useCrud(state)

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true },
  { label: '云平台类别', prop: 'cloudPlatformCategory', width: '120' },
  { label: '云平台类型', prop: 'cloudPlatformType', width: '120' },
  { label: '云平台名称', prop: 'cloudPlatformName', width: '120' },
  { label: '资源池名称', prop: 'resourcePoolName', width: '120' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '操作系统', prop: 'systemType', useSlot: true },
  { label: '镜像类型', prop: 'mirrorType' },
  { label: '磁盘容量(GiB)', prop: 'minDisk', width: '120' },
  { label: '创建时间', prop: 'createTime.date' },
  { label: '描述', prop: 'description' }
]
const operateBtns: IdealTableColumnOperate[] = [
  { title: '申请服务器', prop: 'apply' },
  { title: '修改', prop: 'replace' },
  { title: '共享', prop: 'share' },
  { title: '导出', prop: 'export' },
  { title: '复制', prop: 'copy' },
  { title: '删除', prop: 'delete' }
]
const rowData = ref()
const clickOperateEvent = (command: string | number | object, row: any) => {
  rowData.value = row
  if (command === 'replace') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.replace
  } else if (command === 'copy') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.copy
  } else if (command === 'delete') {
    deleteHandle(row.id, '/')
  } else if (command === 'share') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.share
  } else if (command === 'apply') {
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
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '创建私有镜像',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  // { title: '共享', prop: 'share', disabled: true, disabledText: '请选择一个或者多个镜像进行操作' },
  // { title: '跨域复制', prop: 'copy', disabled: true, disabledText: '暂不支持' },
  // { title: '导出', prop: 'export', disabled: true, disabledText: '请选择一个或者多个镜像进行操作' },
  {
    title: '删除',
    prop: 'delete',
    disabled: true,
    disabledText: '请选择一个或者多个镜像进行操作'
  }
])
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    showDialog.value = true
    dialogType.value = 'resourcePool'
  } else if (value === 'share') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.share
  } else if (value === 'copy') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.copy
  } else if (value === 'delete') {
    handleBatchDelete()
  }
}
const handleBatchDelete = () => {
  const arr = state.dataListSelections?.map((item: any) => item.id)
  const params = {
    ids: arr?.join(',')
  }
  showLoading('批量删除中...')
  mirrorBatchDelete(params)
    .then((res: any) => {
      const { code } = res
      if (code === 200) {
        ElMessage.success('删除成功')
        query()
      } else {
        ElMessage.error('删除失败')
      }
      hideLoading()
    })
    .catch(_ => {
      hideLoading()
    })
}
// 监听多选
watch(
  () => state.dataListSelections,
  value => {
    handleLeftButton(true)
    if (value?.length) {
      handleLeftButton(false)
    }
  }
)
const handleLeftButton = (disabled: boolean) => {
  leftButtons.value?.forEach((item: any, index: number) => {
    if (index === 0) {
      item.disabled = false
    } else {
      item.disabled = disabled
    }
  })
}
watch(
  () => state.dataList,
  value => {
    if (value?.length) {
      value.forEach((item: any) => {
        item.showCopy = false
        item.statusText = RESOURCE_STATUS[item?.status]
        item.statusIcon = RESOURCE_STATUS_ICON[item?.status]
        item.systemType = `os-${item?.platform.toLowerCase()}`
        item.mirrorType =
          item?.imageType === 'SystemDiskImage' ? '系统镜像' : '云盘镜像' // system系统镜像、volume云盘镜像
        item.operate = newOperate(item)
      })
      loopUpdateStatus()
    }
  }
)
// 轮询
const loopUpdateStatus = () => {
  if (!state.dataList?.length) {
    return
  }
  let timer: number | undefined
  const existLoading = existPropWithArray(
    'loading',
    state?.dataList,
    'statusIcon'
  ) // 操作正在进行中

  if (existLoading) {
    timer = setTimeout(() => {
      query()
    }, 5000)
  } else {
    if (timer) {
      clearTimeout(timer)
    }
  }
}
// 根据每行数据状态判断操作是否禁用
const newOperate = (item: any): IdealTableColumnOperate[] => {
  let resultArr: IdealTableColumnOperate[] = []
  const tempArr = JSON.parse(JSON.stringify(operateBtns))
  if (item.statusIcon === 'loading') {
    const tip = `${RESOURCE_STATUS[item.status]}不可操作`
    resultArr = setOperateBtns(true, tip, tempArr)
  } else {
    resultArr = setOperateBtns(false, '', tempArr)
  }
  return resultArr
}
// 根据状态设置操作禁用状态
const setOperateBtns = (
  disabled: boolean,
  disabledText: string,
  array: IdealTableColumnOperate[]
) => {
  const arr: IdealTableColumnOperate[] = []
  array.forEach((item: any) => {
    if (!item.children) {
      item.disabled = disabled
      item.disabledText = disabledText
    }
    if (item.children && item.children.length > 0) {
      setOperateBtns(disabled, disabledText, item.children)
    }
    if (item.prop === 'copy') {
      item.disabled = true
      item.disabledText = '暂不支持'
    }
    arr.push(item)
  })
  return arr
}

const router = useRouter()
const handleRedirectDetail = (row: any) => {
  router.push({
    path: '/multi-cloud/mirror-serve/private/detail',
    query: { id: row.id }
  })
}
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
  rowData.value = null
}
const clickRefreshEvent = () => {
  showDialog.value = false
  rowData.value = null
  query()
  if (dialogType.value === 'resourcePool') {
    router.push({ path: '/multi-cloud/mirror-serve/private/create' })
  }
}
</script>

<style scoped lang="scss">
.private-mirror {
  width: 100%;
  .private-mirror-tip {
    padding: 10px;
    background-color: var(--el-color-primary-light-9);
    justify-content: space-between;
    align-items: center;
  }
}
</style>
