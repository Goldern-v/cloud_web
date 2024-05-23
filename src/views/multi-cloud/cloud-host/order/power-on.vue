<template>
  <div class="power-on">
    <div v-if="shutdownData?.length">
      <div>
        确定要对以下<span style="font-weight: bolder"
          >{{ shutdownData.length }}台云服务器</span
        >进行开机操作吗？
      </div>

      <ideal-table-list
        :table-data="shutdownData"
        :table-headers="originalHeader"
        :show-pagination="false"
      >
        <template #name>
          <el-table-column label="名称/ID" show-overflow-tooltip>
            <template #default="props">
              <div>{{ props.row.name }}</div>
              <div>{{ props.row.id }}</div>
            </template>
          </el-table-column>
        </template>
        <template #status>
          <el-table-column label="状态">
            <template #default="props">
              <ideal-status-icon
                :status-icon="props.row.statusIcon"
                :status-text="props.row.statusText"
              ></ideal-status-icon>
            </template>
          </el-table-column>
        </template>
      </ideal-table-list>
    </div>

    <div v-if="powerOnData?.length">
      <div class="ideal-large-margin-top">
        以下<span style="font-weight: bolder"
          >{{ powerOnData.length }}台云服务器</span
        >无法进行开机操作,单击<el-text
          type="primary"
          @click="showDetail = !showDetail"
          >这里</el-text
        >{{ showDetail ? '隐藏' : '显示' }}详情
      </div>

      <ideal-table-list
        v-if="showDetail"
        :table-data="powerOnData"
        :table-headers="originalHeader"
        :show-pagination="false"
      >
        <template #name>
          <el-table-column label="名称/ID" show-overflow-tooltip>
            <template #default="props">
              <div>{{ props.row.name }}</div>
              <div>{{ props.row.id }}</div>
            </template>
          </el-table-column>
        </template>
        <template #status>
          <el-table-column label="状态">
            <template #default="props">
              <ideal-status-icon
                :status-icon="props.row.statusIcon"
                :status-text="props.row.statusText"
              ></ideal-status-icon>
            </template>
          </el-table-column>
        </template>

        <!-- <template #remark>
          <el-table-column label="备注">
            <div>只有当云服务器处于关机状态，才能执行此操作。</div>
          </el-table-column>
        </template> -->
      </ideal-table-list>
    </div>

    <div class="flex-row footer-button">
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button
        type="primary"
        :disabled="!shutdownData.length"
        @click="submitForm"
        >{{ t('confirm') }}</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum } from '@/utils/enum'
import store from '@/store'
import { showLoading, hideLoading } from '@/utils/tool'
import { cloudHostStart } from '@/api/java/compute'

const { t } = useI18n()
interface PowerOnProps {
  tableArray?: any[]
}
const props = withDefaults(defineProps<PowerOnProps>(), {
  tableArray: () => []
})
const originalHeader: IdealTableColumnHeaders[] = [
  { label: '名称/ID', prop: 'name', useSlot: true },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '备注', prop: 'desc' }
]

const showDetail = ref(true)

const powerOnData = computed(() =>
  props.tableArray?.filter((item: any) => item.status === 'RUNNING')
) //开机状态云主机
const shutdownData = computed(() =>
  props.tableArray?.filter((item: any) => item.status === 'SHUTDOWN')
) //关机状态云主机

watch(
  () => props.tableArray,
  arr => {
    if (arr.length) {
      arr.forEach((item: any) => {
        if (item.status === 'RUNNING') {
          item.desc = '只有当云服务器处于关机状态，才能执行此操作。'
        } else {
          item.desc = item.remark
        }
      })
    }
  },
  { deep: true, immediate: true }
)
// 点击事件
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const cancelForm = () => {
  emit(EventEnum.cancel)
}

const submitForm = () => {
  showLoading('开机中...')
  cloudHostStart({ uuid: shutdownData.value[0].uuid })
    .then((res: any) => {
      const { msg, code, status, data, eventFlowId } = res
      if (code === 200 && status) {
        if (eventFlowId.length) {
          // 保存事件流id
          eventFlowId.forEach((item: string) => {
            store.resourceStore.eventFlow.push({ eventFlowId: item })
          })
        }
        ElMessage.success(data)
        emit(EventEnum.success)
      } else {
        ElMessage.error(msg || '开机失败')
      }
      hideLoading()
    })
    .catch(_ => {
      hideLoading()
    })
}
</script>

<style scoped lang="scss">
.power-on {
  width: 100%;
  .footer-button {
    justify-content: flex-end;
    align-items: center;
    margin-top: 10px;
  }
  .el-text {
    cursor: pointer;
  }
}
</style>
