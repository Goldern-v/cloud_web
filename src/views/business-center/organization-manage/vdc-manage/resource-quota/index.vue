<template>
  <div class="resource-quota">
    <div class="resource-quota-table">
      <el-alert
        :closable="false"
        title="您可以为当前VDC配置资源配额，达到配额后用户将不能申请资源。VDC的资源配额与资源池的资源配额相互独立，可以同时使用。"
        type="warning"
        show-icon
      />

      <ideal-button-events
        :left-btns="leftButtons"
        class="ideal-large-margin-top"
        @clickLeftEvent="clickLeftEvent"
      />

      <ideal-table-list
        :table-data="state.dataList"
        :table-headers="tableHeaders"
        :total="state.total"
        :page="state.page"
        :show-pagination="false"
        max-height="600px"
        :merge-data="mergeData"
        :merge-column="[0]"
        @clickSizeChange="sizeChangeHandle"
        @clickCurrentChange="currentChangeHandle"
      >
        <template #type>
          <el-table-column label="资源类型">
            <template #default="props">
              <div>{{ props.row.name }}</div>
            </template>
          </el-table-column>
        </template>
        <template #use>
          <el-table-column label="已使用配额">
            <template #default="props">
              <span>{{ props.row.use }}</span>
              <span>{{ props.row.useUnit }}</span>
            </template>
          </el-table-column>
        </template>
        <template #usage>
          <el-table-column label="使用率">
            <template #default="props">
              <span>{{ props.row.usage }}</span>
              <span v-if="props.row.usage">%</span>
            </template>
          </el-table-column>
        </template>
        <template #total>
          <el-table-column label="总配额">
            <template #default="props">
              <el-input
                v-model="props.row.total"
                :disabled="!editMode"
                placeholder="无限制"
              ></el-input>
            </template>
          </el-table-column>
        </template>
      </ideal-table-list>
    </div>

    <div class="flex-row footer-button">
      <el-button type="primary" @click="clickSubmit">{{ t('save') }}</el-button>
      <el-button @click="clickCancel">{{ t('back') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus/es'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import type { IdealTableColumnHeaders, IdealButtonEventProp } from '@/types'
import { editVdcQuotaApi, getVdcQuotaApi } from '@/api/java/business-center.js'

const { t } = useI18n()

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '服务', prop: 'server' },
  { label: '', prop: 'type', useSlot: true },
  { label: '', prop: 'use', useSlot: true },
  { label: '', prop: 'usage', useSlot: true },
  { label: '', prop: 'total', useSlot: true }
]
const state: IHooksOptions = reactive({
  dataListUrl: getVdcQuotaApi,
  deleteUrl: '/sys/user',
  isPage: false,
  total: 7,
  queryForm: {
    vdcId: useRoute().query.id
  }
})
const { sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)

const originalData: any = ref([])
watch(
  () => state.dataList,
  arr => {
    if (arr?.length) {
      originalData.value = JSON.parse(JSON.stringify(arr)) // 保存一份原始数据
      mergeTable(arr)
    }
  }
)
/**
 * 列表合并
 */
const mergeData: any = ref([])
const pos = ref(0)
const mergeTable = (arr: any[]) => {
  mergeData.value = []
  for (let index = 0; index < arr?.length; index++) {
    if (index === 0) {
      mergeData.value.push(1)
      pos.value = 0
    } else {
      if (arr[index].server === arr[index - 1].server) {
        mergeData.value[pos.value] += 1
        mergeData.value.push(0)
      } else {
        mergeData.value.push(1)
        pos.value = index
      }
    }
  }
}
/**
 * 总配额是否可编辑
 */
const editMode = ref(false) //是否可编辑模式
const leftButtons = ref<IdealButtonEventProp[]>([])
const clickLeftEvent = (command: string | number | object) => {
  if (command === 'edit') {
    editMode.value = true
  } else if (command === 'cancel') {
    editMode.value = false
  }
}

watch(
  () => editMode.value,
  val => {
    if (!val) {
      leftButtons.value = [
        {
          title: '编辑',
          type: 'primary',
          prop: 'edit'
        }
      ]
    } else {
      leftButtons.value = [
        {
          title: '取消',
          prop: 'cancel'
        }
      ]
    }
  },
  { immediate: true }
)

const route = useRoute()
const router = useRouter()
const clickSubmit = async () => {
  let editData: any = [] //修改数据
  const vdcId = route.query.id
  state.dataList?.forEach((item: any, index: number) => {
    if (item.total !== originalData.value[index].total) {
      if (item.total) {
        editData.push({
          type: item.type,
          id: item.id,
          total: Number(item.total),
          vdcId
        })
      } else {
        editData.push({
          type: item.type,
          id: item.id,
          vdcId
        })
      }
    }
  })
  const res: any = await editVdcQuotaApi(editData)
  if (res.code === 200) {
    ElMessage.success('修改成功')
    router.back()
  } else {
    ElMessage.error('修改失败')
  }
}

const clickCancel = () => {
  router.back()
}
</script>

<style lang="scss" scoped>
.resource-quota {
  width: 100%;
  .resource-quota-table {
    padding: 20px;
    background-color: white;
  }
  .footer-button {
    margin-top: 5px;
    padding: 20px;
    background-color: white;
    justify-content: flex-start;
    align-items: center;
  }
}
:deep(.el-alert--warning.is-light) {
  background-color: var(--el-color-primary-light-9);
  padding: 20px 16px;
  .el-alert__content {
    color: #000;
  }
  .el-alert__icon {
    color: var(--el-color-primary);
  }
}
</style>
