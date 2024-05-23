<template>
  <div class="reboot">
    <div v-if="powerOnData?.length">
      <div>确定要对以下{{ powerOnData.length }}台云服务器进行重启操作吗?</div>

      <ideal-table-list
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
      </ideal-table-list>
    </div>

    <div v-if="shutdownData?.length">
      <div class="ideal-large-margin-top">
        以下<span style="font-weight: bolder"
          >{{ shutdownData.length }}台云服务器</span
        >无法进行重启操作,单击<el-text
          type="primary"
          @click="showDetail = !showDetail"
          >这里</el-text
        >{{ showDetail ? '隐藏' : '显示' }}详情
      </div>

      <ideal-table-list
        v-if="showDetail"
        :table-data="shutdownData"
        :table-headers="originalHeader"
        :show-pagination="false"
      >
        <template #name>
          <el-table-column label="名称/ID" show-overflow-tooltip>
            <template #default="props">
              <div>{{ props.row.name }}</div>
              <div>{{ props.row.uuid }}</div>
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

    <el-checkbox v-model="forcedRestart" label="强制重启" />

    <div class="reboot__tip">
      强制重启会导致云服务器中未保存的数据丢失，请谨慎操作。
    </div>

    <div class="flex-row footer-button">
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button
        type="primary"
        :disabled="!powerOnData.length"
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
import { cloudHostRestart } from '@/api/java/compute'

const { t } = useI18n()
interface RebootProps {
  tableArray?: any[]
}
const props = withDefaults(defineProps<RebootProps>(), {
  tableArray: () => []
})

const originalHeader: IdealTableColumnHeaders[] = [
  { label: '名称/ID', prop: 'name', useSlot: true },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '备注', prop: 'desc' }
]
const forcedRestart = ref(false)

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
        if (item.status === 'SHUTDOWN') {
          item.desc = '只有当云服务器处于开机状态，才能执行此操作。'
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
  showLoading('重启中...')
  cloudHostRestart({ uuid: props?.tableArray[0].uuid })
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
        ElMessage.error(msg || '重启失败')
      }
      hideLoading()
    })
    .catch(_ => {
      hideLoading()
    })
}
</script>

<style scoped lang="scss">
.reboot {
  width: 100%;
  .reboot__tip {
    background-color: #fefbed;
    padding: 20px;
    align-items: center;
    margin: 10px 0;
  }
  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
