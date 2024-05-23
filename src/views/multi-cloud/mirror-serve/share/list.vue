<template>
  <div class="key-pair">
    <accept-mirror
      v-if="waitList.length"
      class="ideal-middle-margin-top"
      :data-array="waitList"
      @clickRefresh="clickRefresh"
    />

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
      <template #osType>
        <el-table-column label="操作系统类型" show-overflow-tooltip width="120">
          <template #default="props">
            <div class="flex-row">
              <svg-icon
                v-if="props.row?.systemType"
                :icon="props.row?.systemType"
                class="ideal-svg-margin-right"
              />
              <div>{{ props.row?.osType }}</div>
            </div>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" fixed="right" width="185">
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

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import dialogBox from './dialog-box.vue'
import acceptMirror from './components/accept-mirror.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum, FiltrateEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp,
  IdealSearch,
  IdealSearchResult
} from '@/types'
import { mirrorPageUrl, mirrorPage } from '@/api/java/compute'

// 搜索
const typeArray = ref<IdealSearch[]>([
  { label: '名称', prop: 'name', type: FiltrateEnum.input }
])
const onClickSearch = (v: IdealSearchResult[]) => {
  state.queryForm = {
    visibility: 'shared',
    shareStatus: 'WAITING' // WAITING是等待被拒绝或被接受，ACCEPTED接受，REJECTED拒绝
  }
  if (v.length) {
    v.forEach((item: IdealSearchResult) => {
      state.queryForm[item.prop] = item.value
    })
  }
  getDataList()
}

onMounted(() => {
  getMirrorList()
})
const waitList = ref<any[]>([]) // 等待被拒绝或被接受镜像
const getMirrorList = () => {
  const params = {
    visibility: 'shared',
    shareStatus: 'WAITING' // WAITING是等待被拒绝或被接受，ACCEPTED接受，REJECTED拒绝
  }
  mirrorPage(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        waitList.value = data.data.map((item: any) => {
          item.systemType = `os-${item?.osType.toLowerCase()}`
          return item
        })
      } else {
        waitList.value = []
      }
    })
    .catch(_ => {
      waitList.value = []
    })
}
const clickRefresh = () => {
  getMirrorList()
  getDataList()
}

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: mirrorPageUrl,
  deleteUrl: '',
  queryForm: {
    visibility: 'shared'
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
        item.systemType = `os-${item?.osType.toLowerCase()}`
        item.mirrorType =
          item?.imageType === 'SystemDiskImage' ? '系统镜像' : '云盘镜像' // system系统镜像、volume云盘镜像
      })
    }
  }
)
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: '云平台类别', prop: 'cloudPlatformCategory', width: '120' },
  { label: '云平台类型', prop: 'cloudPlatformType', width: '120' },
  { label: '云平台名称', prop: 'cloudPlatformName', width: '120' },
  { label: '资源池名称', prop: 'resourcePoolName', width: '120' },
  { label: '操作系统类型', prop: 'osType', useSlot: true },
  { label: '操作系统', prop: 'platform' },
  { label: '镜像类型', prop: 'mirrorType' },
  { label: '系统盘(GiB)', prop: 'size', width: '120' },
  { label: '源项目ID', prop: 'projectId' }
]

const operateBtns: IdealTableColumnOperate[] = [
  { title: '申请服务器', prop: 'apply' },
  { title: '拒绝', prop: 'refuse' },
  { title: '复制', prop: 'copy' }
]
const router = useRouter()
const clickOperateEvent = (command: string | number | object, row: any) => {
  if (command === 'apply') {
    router.push({ path: '/multi-cloud/cloud-host/create' })
  }
}
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '已拒绝镜像',
    prop: 'refused',
    type: 'primary',
    iconColor: 'white'
  },
  { title: '拒绝', prop: 'refuse', disabled: true, disabledText: '请选择镜像' }
])
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'refuse') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.create
  } else if (value === 'refused') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.refused
  }
}
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
}
</script>

<style scoped lang="scss">
.key-pair {
  width: 100%;
}
</style>
