<template>
  <div class="private-key-pair">
    <ideal-search
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
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #operation>
        <el-table-column label="操作" fixed="right" width="185">
          <template #default="props">
            <ideal-table-operate
              :buttons="operateBtns"
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
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    />
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import dialogBox from './dialog-box.vue'
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
import { keyPairPageUrl, keyPairDelete } from '@/api/java/compute'

onMounted(() => {
  // 根据路由是否有open值,判断是否从服务目录跳转过来
  const route = useRoute()
  if (route.query.open) {
    showDialog.value = true
    dialogType.value = OperateEventEnum.create
  }
})

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

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: keyPairPageUrl,
  queryForm: {}
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList
} = useCrud(state)

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: '指纹', prop: 'fingerprint' },
  { label: '云平台类别', prop: 'cloudPlatformCategory' },
  { label: '云平台类型', prop: 'cloudPlatformType' },
  { label: '云平台名称', prop: 'cloudPlatformName' },
  { label: '资源池', prop: 'resourcePoolName' },
  { label: '创建时间', prop: 'createTime.date' }
]
const operateBtns: IdealTableColumnOperate[] = [
  { title: '删除', prop: 'delete' },
  { title: '导出私钥', prop: 'export' },
  { title: '清除私钥', prop: 'clear' }
]
const clickOperateEvent = (command: string | number | object, row: object) => {
  if (command === 'export') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.export
  } else if (command === 'clear') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.clear
  } else if (command === 'delete') {
    deleteKeyPair(row)
  }
}
const deleteKeyPair = (row: any) => {
  ElMessageBox.confirm('是否删除该密钥对？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const params = {
        id: row?.id, // 密钥对id
        resourcePoolId: row?.resourcePoolId, // 资源池id
        poolTypeUuid: row?.cloudPlatformTypeCode, // 资源池类型
        regionId: row?.regionId, // 区域id
        projectId: row?.projectId, // 项目id  
        vdcId: row?.vdcId
      }
      keyPairDelete(params).then((res: any) => {
        const { code } = res
        if (code === 200) {
          ElMessage.success('删除成功')
          getDataList()
        } else {
          ElMessage.error('删除失败')
        }
      })
    })
}
// 列表左侧按钮
const leftButtons: IdealButtonEventProp[] = [
  {
    title: '创建密钥对',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  }
]
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    showDialog.value = true
    dialogType.value = 'resourcePool'
  } else if (value === 'import') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.import
  } else if (value === 'upgrade') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.upgrade
  }
}
// 弹框
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
    getDataList()
  }
}
</script>

<style scoped lang="scss">
.private-key-pair {
  padding: 10px 20px 20px;
}
</style>
