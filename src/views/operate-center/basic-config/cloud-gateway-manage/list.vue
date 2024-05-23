<template>
  <div class="ideal-main-container cloud-gateway-manage">
    <ideal-search
      ref="searchRef"
      :type-array="typeArray"
      @clickSearch="onClickSearch"
    />

    <el-divider />

    <div class="flex-row cloud-gateway-manage__button">
      <el-button type="primary" @click="clickCloudPlatformCreate">
        <svg-icon icon="circle-add" class="ideal-svg-margin-right"></svg-icon>
        创建云网关
      </el-button>

      <el-button><svg-icon icon="refresh-icon"></svg-icon></el-button>
    </div>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :total="state.total"
      :pagination-type="PaginationTypeEnum.totalSizes"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #name>
        <el-table-column label="名称">
          <template #default="props">
            <div
              class="custom-color cloud-gateway-manage__table-name"
              @click="clickDetail(props.row)"
            >
              {{ props.row.name }}
            </div>
          </template>
        </el-table-column>
      </template>

      <template #statusText>
        <el-table-column label="状态">
          <template #default="props">
            <ideal-status-icon
              :status-icon="props.row.statusIcon"
              :status-text="props.row.statusText"
            ></ideal-status-icon>
          </template>
        </el-table-column>
      </template>

      <template #onlyRead>
        <el-table-column label="只读状态">
          <template #default="props">
            <el-switch v-model="props.row.onlyRead" />
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
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus/es'
import dialogBox from './dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealSearch,
  IdealSearchResult
} from '@/types'
import {
  FiltrateEnum,
  PaginationTypeEnum,
  OperateEventEnum
} from '@/utils/enum'

// 搜索
const typeArray = ref<IdealSearch[]>([
  { label: '名称', prop: 'name', type: FiltrateEnum.input }
])
const onClickSearch = (v: IdealSearchResult[]) => {
  state.queryForm = {}
  if (v.length) {
    v.forEach((item: IdealSearchResult) => {
      state.queryForm[item.prop] = item.value
    })
  }
  getDataList()
}

const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {},
  primaryKey: 'uuid'
})
state.dataList = [
  {
    name: 'Vsphere云网关',
    description: 'xxx',
    label: '区域：广州',
    version: '7.2.0-58',
    statusIcon: 'status-success',
    statusText: '在线',
    lastTime: '2023-5-12 19:04:30',
    hostName: 'Compute-hkahs'
  },
  {
    name: 'Vsphere云网关',
    description: 'xxx',
    label: '区域：广州',
    version: '7.2.0-58',
    statusIcon: 'status-exception',
    statusText: '离线',
    lastTime: '2023-5-12 19:04:30',
    hostName: 'Compute-hkahs'
  }
]

const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList
} = useCrud(state) // 后期调接口用上面的，这块需删除
watch(
  () => state.dataListSelections,
  value => {
    console.log('-多选结果-----', value)
  }
)

const operateBtns: IdealTableColumnOperate[] = [
  { type: '', title: '安装脚本', prop: 'install' },
  { type: '', title: '升级', prop: 'upgrade' },
  { type: '', title: '删除', prop: 'delete' }
]

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true },
  { label: '描述', prop: 'description' },
  { label: '标签', prop: 'label' },
  { label: '版本', prop: 'version' },
  { label: '状态', prop: 'statusText', useSlot: true },
  { label: '上次连接时间', prop: 'lastTime' },
  { label: '主机名称', prop: 'hostName' }
]

const clickOperateEvent = (command: string | number | object, row: object) => {
  if (command === 'install') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.install
  } else if (command === 'upgrade') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.upgrade
  } else if (command === 'delete') {
    ElMessageBox.confirm('确定要删除当前云网关吗？', '删除', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        ElMessage.success('Delete completed')
      })
      .catch(() => {
        ElMessage.info('Delete canceled')
      })
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

const router = useRouter()
// 创建云平台
const clickCloudPlatformCreate = () => {
  showDialog.value = true
  dialogType.value = OperateEventEnum.create
}
// 详情
const clickDetail = (rowData: any) => {
  router.push({
    path: '/operate-center/basic-config/cloud-platform-manage/detail'
  })
}
</script>

<style scoped lang="scss">
.cloud-gateway-manage {
  padding: $idealPadding;
  background-color: white;
  box-sizing: border-box;
  :deep(.el-select .el-input) {
    width: 200px;
  }
  .cloud-gateway-manage__button {
    justify-content: space-between;
    align-items: center;
  }
  .custom-color {
    color: var(--el-color-primary);
  }
  .cloud-gateway-manage__table-name {
    cursor: pointer;
  }
}
</style>
