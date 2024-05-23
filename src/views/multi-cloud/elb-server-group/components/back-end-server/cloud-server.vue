<template>
  <div class="cloud-server">
    <div style="margin-bottom: 20px">
      批量添加端口<el-input v-model="port" class="port-input ideal-default-margin-right"></el-input
      ><el-button>{{ t('confirm') }}</el-button>
    </div>
    <ideal-button-events
      :left-btns="attrData.leftButtons"
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
    >
      <template #cloudServer>
        <el-table-column label="云服务器">
          <template #default="props">
            <p>{{ props.row.name }}</p>
            <p class="ideal-tip-text">
              {{ props.row.cpu }}vCPUs | {{ props.row.memory }}GB
            </p>
            <p class="ideal-tip-text">{{ props.row.specification }}</p>
          </template>
        </el-table-column>
      </template>

      <template #servicePort>
        <el-table-column label="业务端口">
          <template #default="props">
            <el-input v-model="props.row.servicePort"></el-input>
          </template>
        </el-table-column>
      </template>

      <template #weight>
        <el-table-column label="权重">
          <template #default="props">
            <el-input v-model="props.row.weight"></el-input>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="185">
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
  </div>
</template>

<script setup lang="ts">
import type {
  IdealButtonEventProp,
  IdealTableColumnHeaders,
  IdealTableColumnOperate
} from '@/types'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum } from '@/utils/enum'

const { t } = useI18n()
const attrData = reactive({
  leftButtons: [] as IdealButtonEventProp[]
})
/**
 * 表格顶部按钮
 */
const port = ref('')
attrData.leftButtons = [{ title: '添加云服务器', prop: 'create' }]
interface EventEmits {
  (e: 'addResource', type: string): void
}
const emit = defineEmits<EventEmits>()
const clickLeftEvent = (command: string | number | object) => {
  if (command === 'create') {
    emit('addResource', 'cloudServer')
  }
}

/**
 * 云服务器列表
 */
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
state.dataList = [
  {
    name: '测试23',
    cpu: '2',
    memory: '4',
    specification: 'c7.large.2',
    privateIp: '192.168.0.211'
  }
]
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '云服务器', prop: 'cloudServer', useSlot: true },
  { label: '私网IP地址', prop: 'privateIp' },
  { label: '业务端口', prop: 'servicePort', useSlot: true },
  { label: '权重', prop: 'weight', useSlot: true }
]
const { sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)

const operateButtons: IdealTableColumnOperate[] = [
  { type: 'primary', title: '复制', prop: 'copy' },
  { type: 'primary', title: '删除', prop: 'delete' }
]

const clickOperateEvent = (command: string | number | object, row: object) => {}
</script>

<style scoped lang="scss">
.cloud-server {
  .port-input {
    width: 100px;
    margin-left: 100px;
  }
}
</style>
