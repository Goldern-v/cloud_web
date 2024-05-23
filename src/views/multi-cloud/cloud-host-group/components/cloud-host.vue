<template>
  <div class="cloud-host">
    <!-- <el-button :disabled="!selected">移出</el-button> -->
    <ideal-table-list
      row-key="id"
      :show-pagination="false"
      :table-headers="tableHeaders"
      :table-data="dataArray"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #name>
        <el-table-column label="名称">
          <template #default="props">
            <el-button link type="primary">{{ props.row.name }}</el-button>
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
            ></ideal-status-icon>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="120">
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
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import type { IdealTableColumnHeaders, IdealTableColumnOperate } from '@/types'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { RESOURCE_STATUS, RESOURCE_STATUS_ICON } from '@/utils/dictionary'
import { instanceGroupDetail, instanceGroupRemoveServerGroup } from '@/api/java/compute'

interface CloudHostProps {
  id?: string
}
const props = withDefaults(defineProps<CloudHostProps>(), {
  id: ''
})

onMounted(() => {
  getDetail()
})
// 当前云服务器组信息
const detailData = ref()
// 已添加云服务列表
const dataArray = ref<any[]>([])
const getDetail = () => {
  const params = {
    id: props.id
  }
  instanceGroupDetail(params).then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      detailData.value = data
      dataArray.value = data?.instances.map((item: any) => {
        item.statusText = RESOURCE_STATUS[item?.status]
        item.statusIcon = RESOURCE_STATUS_ICON[item?.status]
        return item
      })
    }
  })
}

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})

const selected = ref(false)
watch(() => state.dataListSelections, value => {
  selected.value = false
  if (value?.length) {
    selected.value = true
  }
})
const {
  selectionChangeHandle,
  getDataList
} = useCrud(state)

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true },
  { label: 'ID', prop: 'id' },
  { label: '可用区', prop: 'availableZone' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '镜像', prop: 'image.osVersion' }
]
const operateBtns: IdealTableColumnOperate[] = [
  { type: 'primary', title: '移除云服务器组', prop: 'delete' }
]
const clickOperateEvent = (command: string | number | object, row: any) => {
  if (command === 'delete') {
    handleDelete(row)
  }
}
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认移除该云服务器吗？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  }).then(() => {
    const params = {
      id: detailData.value?.id, // 云服务器组id
      instanceUuid: row?.uuid, // 云主机uuid
      resourcePoolId: detailData.value?.resourcePoolId, // 资源池id
      regionId: detailData.value?.regionId, // 区域id
      projectId: detailData.value?.projectId, // 项目id
      vdcId: detailData.value?.vdcId
    }
    instanceGroupRemoveServerGroup(params).then((res: any) => {
      const { code } = res
      if (code === 200) {
        ElMessage.success('删除成功')
        getDetail()
        emit('clickSuccessEvent')
      } else {
        ElMessage.error('删除失败')
      }
    })
  })
}
interface EmitsEvent {
  (e: 'clickSuccessEvent'): void
}
const emit = defineEmits<EmitsEvent>()

</script>

<style scoped lang="scss">
.cloud-host {
  width: 100%;
}
</style>
