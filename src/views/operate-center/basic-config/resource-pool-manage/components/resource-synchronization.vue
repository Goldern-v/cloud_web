<template>
  <div class="resource-info">
    <div class="btn-list">
      <el-button type="primary" @click="addConfig">
        <svg-icon icon="setting-icon" class="ideal-svg-margin-right"></svg-icon>
        <span style="vertical-align: middle"> 同步配置 </span></el-button
      >
    </div>
    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :total="state.total"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
      <template #switch>
        <el-table-column label="同步开关">
          <template #default="props">
            <div><el-switch v-model="props.row.enable" @change="changeStatus(props.row)"></el-switch></div>
          </template>
        </el-table-column>
      </template>
      <template #status>
        <el-table-column label="同步状态" width="120">
          <template #default="props">
            <div class="flex-row">
              <ideal-status-icon
                :status-icon="props.row.statusIcon"
                :status-text="props.row.statusText"
              ></ideal-status-icon>
              <el-tooltip placement="top">
                <template #content>
                  <div>
                    同步云主机&nbsp;&nbsp;{{ props.row.syncTime
                    }}<br />
                  </div>
                </template>
                <svg-icon
                  icon="clock-icon"
                  color="#8B8B8B"
                  class="ideal-svg-margin-left"
                ></svg-icon>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </template>
      <template #operation>
        <el-table-column label="操作" fixed="right" width="180">
          <template #default="props">
            <ideal-table-operate
              :buttons="props.row.operate"
              @clickMoreEvent="clickOperateEvent($event, props.row)"
            />
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

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus/es'
import { OperateEventEnum } from '@/utils/enum'
import dialogBox from './dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { showLoading, hideLoading, existPropWithArray } from '@/utils/tool'
import { RESOURCE_STATUS, RESOURCE_STATUS_ICON } from '@/utils/dictionary'
import type { IdealTableColumnHeaders, IdealTableColumnOperate } from '@/types'
import {
  getResourceConfigApi,
  deleteResourceConfigApi,
  immediatelySyncApi,
  startResourceSyncApi,
  stopResourceSyncApi
} from '@/api/java/operate-center'

const resourcePoolId = useRoute().query.id
const state: IHooksOptions = reactive({
  dataListUrl: getResourceConfigApi,
  deleteUrl: deleteResourceConfigApi,
  queryForm: {
    resourcePoolId
  }
})
const { sizeChangeHandle, currentChangeHandle, deleteHandle, getDataList, query } = useCrud(state)

watch(
  () => state.dataList,
  value => {
    if (value) {
      value.map((item: any) => {
        item.statusText = RESOURCE_STATUS[item.syncStatus.toUpperCase()]
        item.statusIcon = RESOURCE_STATUS_ICON[item.syncStatus.toUpperCase()]
        item.configStatus = item.type ? '已设定' : '未设定'
        item.operate = newOperate(item)
      })
    }
    loopUpdateStatus()
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
      }, 30000)
    } else {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '同步配置名称', prop: 'name', width: '120' },
  { label: '同步资源', prop: 'resourceTypeName' },
  { label: '资源归属项目', prop: 'project.name', width: '120' },
  { label: '同步区域', prop: 'region.cnName' },
  { label: '配置状态', prop: 'configStatus' },
  { label: '同步开关', prop: 'switch', useSlot: true },
  { label: '同步状态', prop: 'status', useSlot: true },
  { label: '最近同步时间', prop: 'updateTime.date', width: '120' },
  { label: '创建人', prop: 'creator.name' },
  { label: '创建时间', prop: 'createTime.date' }
]
//新增配置
const addConfig = () => {
  showDialog.value = true
  dialogType.value = OperateEventEnum.create
  rowData = {}
}

let rowData = reactive({})
// 列表行数据操作事件
const operateBtns: IdealTableColumnOperate[] = [
  { title: '立即同步', prop: 'sync' },
  { title: '编辑', prop: 'edit' },
  { title: '删除', prop: 'delete' }
]
const clickOperateEvent = (command: string | number | object, row: any) => {
  rowData = row
  if (command === 'sync') {
    immediatelySync(row)
  } else if (command === 'edit') {
    editConfig(row)
  } else if (command === 'delete') {
    deleteHandle(row.id, '/')
  }
}
// 根据每行数据状态判断操作是否禁用
const newOperate = (item: any): IdealTableColumnOperate[] => {
  const resultArr: IdealTableColumnOperate[] = JSON.parse(
    JSON.stringify(operateBtns)
  )
  resultArr[1].disabled = item.syncStatus === 'SYNCING'
  resultArr[1].disabledText = item.syncStatus === 'SYNCING' ? '同步中不可编辑' : ''
  resultArr[2].disabled = item.syncStatus === 'SYNCING'
  resultArr[2].disabledText = item.syncStatus === 'SYNCING' ? '同步中不可删除' : ''
  return resultArr
}
//修改配置
const editConfig = (row: any) => {
  showDialog.value = true
  dialogType.value = OperateEventEnum.edit
}
// 开启/关闭同步开关
const changeStatus = (rowData: any) => {
  const params = {
    id: rowData.id
  }
  if (rowData.enable) {
    //开启
    handleOpen(params)
  } else {
    //关闭
    handleClose(params)
  }
}
const handleOpen = (params: any) => {
  startResourceSyncApi(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('开启成功')
      getDataList()
    } else {
      ElMessage.error('开启失败')
    }
  })
}
const handleClose = (params: any) => {
  stopResourceSyncApi(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('关闭成功')
      getDataList()
    } else {
      ElMessage.error('关闭失败')
    }
  })
}
//立即同步
const immediatelySync = async (rowData: any) => {
  ElMessageBox.confirm('是否执行此操作?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      showLoading()
      const params = {
        id: rowData.id
      }
      const res: any = await immediatelySyncApi(params)
      if (res.code === 200) {
        hideLoading()
        getDataList()
        ElMessage.success('同步成功')
      } else {
        hideLoading()
        ElMessage.error('同步失败')
      }
    })
}
/**
 * 弹框
 */
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum>()
const clickCloseEvent = () => {
  showDialog.value = false
}
//创建成功 刷新列表
const clickRefreshEvent = () => {
  showDialog.value = false
  getDataList()
}
</script>

<style lang="scss" scoped>
.resource-info {
  padding: 0 $idealPadding $idealPadding;
}
.btn-list {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>
