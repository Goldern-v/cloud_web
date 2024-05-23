<template>
  <div class="back-end-server">
    <el-card class="cloud-server">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="云服务器" name="cloud-server">
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
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card class="health-check ideal-large-margin-top">
      <p>配置健康检查</p>
      <el-form :model="form" label-position="left">
        <el-form-item label="是否开启">
          <div class="flex-column">
            <el-switch v-model="form.enable"></el-switch>
            <div>
              健康检查用于检查后端服务器的业务可用性，负载均衡能自动排除健康状况异常的后端服务器。
              <span style="color: var(--el-color-primary)">了解更多</span>
            </div>
          </div>
        </el-form-item>

        <el-form-item>
          <template #label>
            参数配置
            <svg-icon
              icon="edit-pen"
              class="ideal-svg-margin-left"
              @click="change"
            ></svg-icon>
          </template>
          <ideal-detail-info
            :label-array="labelArray"
            label-position="left"
            :show-colon="false"
            :detail-info="detailInfo"
            class="basic-info"
          >
          </ideal-detail-info>
        </el-form-item>
      </el-form>
    </el-card>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import type { TabsPaneContext } from 'element-plus'
import type {
  IdealButtonEventProp,
  IdealTableColumnHeaders,
  IdealTableColumnOperate
} from '@/types'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum } from '@/utils/enum'
import dialogBox from '../../dialog-box.vue'

const attrData = reactive({
  leftButtons: [] as IdealButtonEventProp[]
})
/**
 * 表格顶部按钮
 */
attrData.leftButtons = [{ title: '添加云服务器', prop: 'create' }]
const activeName = ref('cloud-server')
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
const clickLeftEvent = (command: string | number | object) => {
  if (command === 'create') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.add
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

/**
 * 配置检查表单
 */
const form = reactive({
  enable: ''
})
const change = () => {
  // modifiable.value = !modifiable.value
  console.log(modifiable.value)
}
const modifiable = ref(true)
watch(
  () => modifiable.value,
  () => {
    labelArray.forEach(ele => {
      console.log(ele, '----------')

      ele.isEdit = true
    })
  }
)

const labelArray = [
  { label: '健康检查协议', prop: 'protocol', isEdit: false },
  { label: '健康检查端口', prop: 'port', isEdit: false },
  { label: '检查间隔(秒)', prop: 'interval' },
  { label: '超时时间(秒)', prop: 'timeout' },
  { label: '最大重试次数', prop: 'time' }
]
const detailInfo = ref({
  protocol: 'TCP',
  port: '使用后端服务器默认端口业务',
  interval: '5',
  timeout: '3',
  time: '3'
})

/**
 * 弹窗
 */
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
}
</script>

<style scoped lang="scss">
.back-end-server {
  :deep(.ideal-detail-info) {
    padding: 0px;
    .ideal-detail-info-item {
      padding: 0px;
    }
  }
}
</style>
