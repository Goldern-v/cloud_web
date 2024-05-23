<template>
  <div>
    <ideal-table-list
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      is-multiple
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
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
import type { IdealTableColumnHeaders } from '@/types'
import { IHooksOptions } from '@/hooks/interface'
import { ElMessage } from 'element-plus'
import { useCrud } from '@/hooks'
import { EventEnum } from '@/utils/enum'
import { showLoading, hideLoading } from '@/utils/tool'
import { projectListApi, userRelateProject } from '@/api/java/business-center'
import store from '@/store'

interface RoleProps {
  associatedProject?: any[] //已关联的项目
}

const props = withDefaults(defineProps<RoleProps>(), {
  associatedProject: () => []
})
const { t } = useI18n()

const route = useRoute()
const detailInfo = JSON.parse(route.query.detail as any)
const state: IHooksOptions = reactive({
  dataListUrl: projectListApi,
  deleteUrl: '',
  queryForm: {
    vdcId: detailInfo.vdcId
  }
})

const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList,
  query
} = useCrud(state)
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '项目', prop: 'name' },
  { label: '所属VDC', prop: 'vdc.name' },
  { label: '描述', prop: 'remark' }
]
watch(
  () => state.dataList,
  arr => {
    arr?.forEach((item: any) => {
      item.selectableDisabled = function () {
        return !props.associatedProject.some((ele: any) => ele.id === item.id)
      }
    })
  }
)
// 方法
interface EmitEvent {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EmitEvent>()
const cancelForm = () => {
  emit(EventEnum.cancel)
}

const submitForm = () => {
  const userId = detailInfo.id
  const arr = state.dataListSelections?.map((item: any) => {
    return {
      userId,
      projectId: item.id,
      vdcId: item.vdc?.id,
      vdcCode: item.vdc?.code,
      username: detailInfo.username
    }
  })
  showLoading('关联中...')
  userRelateProject(userId, arr)
    .then((res: any) => {
      const { data, code } = res
      if (code === 200) {
        ElMessage.success('关联项目成功')
        emit(EventEnum.success)
      } else {
        ElMessage.error('关联项目失败')
      }
      hideLoading()
    })
    .catch(err => {
      hideLoading()
    })
}
</script>

<style scoped lang="scss"></style>
