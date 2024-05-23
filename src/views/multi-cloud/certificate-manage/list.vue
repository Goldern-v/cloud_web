<template>
  <div class="ideal-main-container certificate-manage">
    <div class="flex-row certificate-manage__search">
      <ideal-select-search
        :search-type="SearchTypeEnum.title"
        prefix-title="模糊查询"
        @clickSearch="clickSearch"
        @clickReset="clickReset"
      >
      </ideal-select-search>
    </div>

    <el-divider />

    <ideal-button-events
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    >
    </ideal-button-events>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
      <template #name>
        <el-table-column label="名称/ID">
          <template #default="props">
            <div>
              {{ props.row.name }}
            </div>

            <ideal-text-copy
              :row="props.row"
              @mouseEnterEvent="value => (props.row.showCopy = value)"
              @mouseLeaveEvent="value => (props.row.showCopy = value)"
            />
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="185">
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
      :row-data="rowData"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import { OperateEventEnum, SearchTypeEnum } from '@/utils/enum'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import type {
  IdealButtonEventProp,
  IdealTableColumnHeaders,
  IdealTableColumnOperate
} from '@/types'
import dialogBox from './dialog-box.vue'

/**
 * 列表
 */
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})

state.dataList = [
  {
    name: 'cert-test',
    uuid: 'wq8x-2882dc- 9xj',
    certificateManage: '服务器证书',
    expireTime: '2020/11/12 10:26:13',
    expireTimeProp: 'error',
    domain: 'TCP',
    listener: 'listener-safe',
    port: 80,
    equalizer: '共享型',
    statusText: '异常',
    stateNum: 1,
    serverNum: 1
  }
]

const { sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)

// 搜索
const clickSearch = (search: string, type: string) => {
  state.queryForm.type = type
  state.queryForm.name = search
  getDataList()
}
// 重置
const clickReset = () => {
  state.page = 1
  state.queryForm = {}
  getDataList()
}

// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true },
  { label: '证书管理', prop: 'certificateManage' },
  {
    label: '过期时间',
    prop: 'expireTime',
    setTextType: true,
    textTypeProp: 'expireTimeProp'
  },
  { label: '域名', prop: 'domain' },
  { label: '监听器（前端协议/端口）', prop: 'listener' },
  { label: '描述', prop: 'equalizer' },
  { label: '更新时间', prop: 'lbs' },
  { label: '证书来源', prop: 'healthCheck' }
]

// 列表左侧按钮
const leftButtons: IdealButtonEventProp[] = [
  {
    title: '创建证书',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  }
]
const router = useRouter()
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    showDialog.value = true
    dialogType.value = 'resourcePool'
  }
}

const rowData = ref({})
// 列表操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '修改', prop: 'edit' },
  { title: '删除', prop: 'delete' }
]
const clickOperateEvent = (command: string | number | object, row: object) => {
  if (command === 'edit') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.edit
  }
}

/**
 * 弹窗
 */
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  if (dialogType.value === 'resourcePool') {
    dialogType.value = OperateEventEnum.create
  } else {
    showDialog.value = false
  }
}
</script>

<style scoped lang="scss">
.certificate-manage {
  padding: $idealPadding;
  .certificate-manage__search {
    align-items: center;
    justify-content: space-between;
  }
  .certificate-manage-table-title {
    color: var(--el-color-primary);
    cursor: pointer;
  }
}
</style>
