<template>
  <div class="server">
    <ideal-search :type-array="typeArray" @clickSearch="onClickSearch" />

    <el-divider />

    <ideal-button-events
      :left-btns="attrData.leftButtons"
      @clickLeftEvent="clickLeftEvent"
    />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :is-multiple="true"
      :show-pagination="false"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #name>
        <el-table-column label="名称">
          <template #default="props">
            <el-button
              link
              type="primary"
              @click="toCloudHost(props.row, '')"
              >{{ props.row.name }}</el-button
            >
          </template>
        </el-table-column>
      </template>

      <template #status>
        <el-table-column label="状态">
          <template #default="props">
            <ideal-status-icon
              v-if="props.row.status"
              :status-icon="props.row.statusIcon"
              :status-text="props.row.statusText"
            />
          </template>
        </el-table-column>
      </template>

      <template #privateIp>
        <el-table-column label="私有IP地址">
          <template #default="props">
            <div>{{ props.row.ipv4Address }}</div>
            <div>{{ props.row.ipv6Address }}</div>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="225">
          <template #default="props">
            <ideal-table-operate
              :buttons="operateButtons"
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
      :multiple-selection="state.dataListSelections"
      :associated-server="state.dataList"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import dialogBox from '../dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum, FiltrateEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp,
  IdealSearch,
  IdealTextProp
} from '@/types'
import { queryRelevanceInstanceList } from '@/api/java/network'
import { RESOURCE_STATUS, RESOURCE_STATUS_ICON } from '@/utils/dictionary'

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
const route = useRoute()
const uuid = route.query.uuid as string
const cloudPlatformCategoryCode = route.query
  ?.cloudPlatformCategoryCode as string
const cloudPlatformTypeCode = route.query?.cloudPlatformTypeCode as string

onMounted(() => {})
// 列表
const state: IHooksOptions = reactive({
  dataListUrl: queryRelevanceInstanceList,
  deleteUrl: '',
  isPage: false,
  queryForm: { uuid }
})
const { selectionChangeHandle, getDataList } = useCrud(state)

interface ServerProp {
  pageNumber?: any[]
}
const props = withDefaults(defineProps<ServerProp>(), {
  pageNumber: () => []
})

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true },
  { label: '类型', prop: 'type' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '私有IP地址', prop: 'privateIp', useSlot: true }
]
const attrData = reactive({
  leftButtons: [] as IdealButtonEventProp[]
})
// 列表左侧按钮
attrData.leftButtons = [
  {
    title: '添加',
    prop: 'addServer',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  { title: '移出', prop: 'remove', disabled: true, disabledText: '请先选择' }
]
type leftBtnType = string | number | object
const clickLeftEvent = (value: leftBtnType) => {
  if (value === 'addServer') {
    showDialog.value = true
    dialogType.value = 'addServer'
  } else if (value === 'remove') {
    rowData.value = {}
    showDialog.value = true
    dialogType.value = OperateEventEnum.unbind
  }
}
watch(
  () => state.dataListSelections,
  value => {
    attrData.leftButtons[1].disabled = true
    if (value?.length) {
      attrData.leftButtons[1].disabled = false
    }
  }
)

watch(
  () => state.dataList,
  value => {
    if (value?.length) {
      value.forEach((item: any) => {
        item.statusIcon = RESOURCE_STATUS_ICON[item.status.toUpperCase()]
        item.statusText = RESOURCE_STATUS[item.status.toUpperCase()]
      })
    }
  }
)
const operateButtons = ref<IdealTableColumnOperate[]>([
  { title: '移出', prop: 'remove' },
  { title: '更改安全组', prop: 'changeSafeGroup' }
])
const rowData = ref({})
const clickOperateEvent = (command: string | number | object, row: any) => {
  rowData.value = row
  if (command === 'remove') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.unbind
  } else if (command === 'changeSafeGroup') {
    toCloudHost(row, 'safeGroup')
  }
}

const router = useRouter()
const toCloudHost = (row: any, type: string) => {
  router.push({
    path: '/multi-cloud/cloud-host/detail',
    query: {
      uuid: row?.uuid,
      cloudCategory: cloudPlatformCategoryCode,
      cloudType: cloudPlatformTypeCode,
      type
    }
  })
}

// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  getDataList()
}
// 更新tabs选项卡标题数量, total: 当前页面列表总数 index: 当前tabs选项卡
interface EventEmits {
  (e: 'updatePageNumber', total: number, index: number): void
}
const emit = defineEmits<EventEmits>()
watch(
  () => state.dataList,
  (newValue, oldValue) => {
    if (newValue !== oldValue && newValue?.length) {
      emit('updatePageNumber', newValue?.length, 0)
    }
  }
)
</script>

<style scoped lang="scss">
.server {
  padding: $idealPadding;
  background-color: white;
}
</style>
