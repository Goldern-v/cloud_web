<template>
  <div class="elastic-ip--bind">
    <el-form
      ref="formRef"
      :model="bindForm"
      label-position="left"
      :rules="rules"
    >
      <el-form-item label="弹性公网IP">
        {{ rowData.ipAddress }}
      </el-form-item>

      <el-form-item label="选择实例">
        <el-radio-group v-model="bindForm.instance" style="margin-bottom: 20px">
          <el-radio-button
            v-for="item of instanceList"
            :key="item.label"
            type="text"
            :label="item.label"
            >{{ item.name }}
          </el-radio-button>
        </el-radio-group>

        <el-input
          v-model="searchValue"
          placeholder="通过指定属性的关键字搜索"
          style="width: 80%; text-align: right"
        >
          <template #suffix>
            <svg-icon icon="search-icon"></svg-icon>
          </template>
        </el-input>
        <el-button class="ideal-svg-margin-left"
          ><svg-icon icon="refresh-icon"></svg-icon
        ></el-button>

        <ideal-table-list
          :table-data="state.dataList"
          :table-headers="tableHeaders"
          :total="state.total"
          :page="state.page"
          is-radio
          max-height="300"
          @clickSizeChange="sizeChangeHandle"
          @clickCurrentChange="currentChangeHandle"
          @clickTableCellRow="clickTableCellRow"
        >
          <template #name>
            <el-table-column label="名称/ID" width="150" show-overflow-tooltip>
              <template #default="props">
                <div class="cloud-host-table-title">
                  {{ props.row.name }}
                </div>

                <div class="flex-row">
                  <div class="cloud-host-table-id">{{ props.row.uuid }}</div>
                </div>
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
                />
              </template>
            </el-table-column>
          </template>

          <template #network>
            <el-table-column label="所属网络">
              <template #default="props">
                <p class="ideal-theme-text">{{ props.row.vpcName }}</p>
                <p class="ideal-theme-text">{{ props.row.subnet?.name }}</p>
              </template>
            </el-table-column>
          </template>

          <template #privateIp>
            <el-table-column label="私有IP地址">
              <template #default="props">
                <el-tooltip
                  effect="dark"
                  placement="top"
                  :disabled="props.row.nicList?.length === 1"
                >
                  <template #content>
                    <div v-for="(item, idx) of props.row.nicList" :key="idx">
                      {{ item.fixedIp }}
                    </div></template
                  >
                  <div>{{ props.row.nicList[0].fixedIp || '--' }}</div>
                </el-tooltip>
              </template>
            </el-table-column>
          </template>

          <template #publicIp>
            <el-table-column label="弹性公网IP">
              <template #default="props">
                <el-tooltip
                  effect="dark"
                  placement="top"
                  :disabled="props.row.nicList?.length === 1"
                >
                  <template #content>
                    <div v-for="(item, idx) of props.row.nicList" :key="idx">
                      {{ item.eip?.ipAddress }}
                    </div></template
                  >
                  <div>{{ props.row.nicList[0].eip?.ipAddress || '--' }}</div>
                </el-tooltip>
              </template>
            </el-table-column>
          </template>
        </ideal-table-list>
      </el-form-item>

      <el-form-item
        v-if="
          bindForm.instance === 'cloud-server' ||
          bindForm.instance === 'bare-metal'
        "
        label="网卡"
        prop="netCard"
      >
        <div class="flex-column">
          <el-select
            v-model="bindForm.netCard"
            placeholder="请选择网卡"
            style="width: 300px"
            class="custom-margin-right"
            @change="netChange"
          >
            <el-option
              v-for="item of netCardList"
              :key="item.label"
              :label="item.showInfo"
              :value="item.uuid"
            >
            </el-option>
          </el-select>
          <div
            v-if="Object.keys(selectInstanceInfo).length"
            class="detail-info ideal-default-margin-top"
          >
            <el-row>
              <el-col :span="8">已选实例</el-col>
              <el-col :span="16"
                ><span>{{ selectInstanceInfo.name }}</span></el-col
              >
            </el-row>
            <el-row>
              <el-col :span="8">网卡</el-col>
              <el-col :span="16"
                ><span>{{ selectNetInfo.showInfo }}</span></el-col
              >
            </el-row>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { FormRules, FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus/es'
import type { IdealTableColumnHeaders, IdealTextProp } from '@/types'
import { RESOURCE_STATUS, RESOURCE_STATUS_ICON } from '@/utils/dictionary'
import { EventEnum } from '@/utils/enum'
import { cloudHostUrl } from '@/api/java/compute'
import { queryNetCardPage } from '@/api/java/network'
import {
  queryUnbindNetCardList,
  eipRelevanceInstance
} from '@/api/java/network'
import { showLoading, hideLoading } from '@/utils/tool'

const { t } = useI18n()
interface eipInfo {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<eipInfo>(), {
  rowData: null
})

const formRef = ref<FormInstance>()
const bindForm = reactive({
  instance: 'cloud-server',
  netCard: ''
})

const instanceList = [
  { name: '云服务器', label: 'cloud-server' },
  //暂时未对接
  // { name: '裸金属服务器', label: 'bare-metal' },
  // { name: '虚拟Ip地址', label: 'virtual-ip-address' },
  { name: '辅助弹性网卡', label: 'assist-nic' }
]

const tableHeaders = ref<IdealTableColumnHeaders[]>([])
onMounted(() => {
  tableHeaders.value = serverHeaders
})

//公共参数
const commonParams = () => {
  const params = {
    resourcePoolId: props.rowData.resourcePoolId,
    regionId: props.rowData.regionId,
    projectId: props.rowData.projectId
  }
  return params
}
const state: IHooksOptions = reactive({
  dataListUrl: cloudHostUrl,
  deleteUrl: '',
  queryForm: {
    ...commonParams()
  }
})

const { getDataList, sizeChangeHandle, currentChangeHandle } = useCrud(state)

const searchValue = ref('')

const serverHeaders: IdealTableColumnHeaders[] = [
  { label: '名称/ID', prop: 'name', useSlot: true },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '弹性公网IP', prop: 'publicIp', useSlot: true },
  { label: '私有IP地址', prop: 'privateIp', useSlot: true }
]
const eipHeaders = [
  { label: 'IP地址', prop: 'fixedIp' },
  { label: '弹性公网IP', prop: 'mainFixedIp' },
  { label: '虚拟私有云', prop: 'vpcName' },
  { label: '子网', prop: 'subnet.name' }
]
const netCardHeaders = [
  { label: '私有IP地址', prop: 'fixedIp' },
  { label: '所属弹性网卡', prop: 'mainFixedIp' },
  { label: '所属网络', prop: 'network', useSlot: true }
]

watch(
  () => bindForm.instance,
  () => {
    if (bindForm.instance === 'cloud-server') {
      tableHeaders.value = serverHeaders
      state.dataListUrl = cloudHostUrl
    } else if (bindForm.instance === 'bare-metal') {
      tableHeaders.value = serverHeaders
      state.dataListUrl = ''
    } else if (bindForm.instance === 'virtual-ip-address') {
      tableHeaders.value = eipHeaders
      state.dataListUrl = ''
    } else if (bindForm.instance === 'assist-nic') {
      tableHeaders.value = netCardHeaders
      state.dataListUrl = queryNetCardPage
      state.queryForm.type = 'BACKUP_CARD'
    }
    getDataList()
  }
)
watch(
  () => state.dataList,
  value => {
    if (value?.length) {
      if (
        bindForm.instance === 'cloud-server' ||
        bindForm.instance === 'bare-metal'
      ) {
        value.forEach((item: any) => {
          item.statusIcon = RESOURCE_STATUS_ICON[item.status]
          item.statusText = RESOURCE_STATUS[item.status]
        })
      }
    }
  }
)

const rules = reactive<FormRules>({
  netCard: [{ required: true, message: '请选择网卡', trigger: 'change' }]
})

// 列表行点击事件
const selectInstanceInfo: any = ref({})
const clickTableCellRow = (val: any) => {
  selectInstanceInfo.value = val
  if (bindForm.instance === 'cloud-server') {
    netCardList.value = []
    selectNetInfo.value = ''
    bindForm.netCard = ''
    queryNetworkCard(val.uuid)
  }
}

// 网卡列表
const netCardList: any = ref([])
const queryNetworkCard = (val: string) => {
  const params = {
    instanceUuid: val,
    ...commonParams()
  }
  queryUnbindNetCardList(params).then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      data.forEach((item: any) => {
        item.showInfo = 'IP:' + item.fixedIp + ',MAC:' + item.macAddress
      })
      netCardList.value = data
      selectNetInfo.value = data[0]
      bindForm.netCard = data[0].uuid
    } else {
      netCardList.value = []
      selectNetInfo.value = ''
      bindForm.netCard = ''
    }
  })
}

//切换网卡
const selectNetInfo: any = ref({})
const netChange = (val: any) => {
  const data = netCardList.value.find((item: any) => item.uuid === val)
  data.showInfo = 'IP:' + data.fixedIp + ',MAC:' + data.macAddress
  selectNetInfo.value = data
}

interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()
const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  emit(EventEnum.cancel)
}
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate(valid => {
    if (valid) {
      if (
        bindForm.instance === 'cloud-server' ||
        bindForm.instance === 'assist-nic'
      ) {
        const params: { [key: string]: any } = {
          uuid: props.rowData.uuid,
          bindnicUuid:
            bindForm.instance === 'cloud-server'
              ? bindForm.netCard
              : selectInstanceInfo.value.uuid,
          ...commonParams()
        }
        //腾讯云绑定需传内网IP
        if (
          props.rowData.cloudPlatformCategoryCode === 'PUBLIC' &&
          props.rowData.cloudPlatformTypeCode === 'TENCENT_CLOUD'
        ) {
          params.nicFixedIp = selectNetInfo.value.fixedIp
        }
        showLoading('绑定中...')
        eipRelevanceInstance(params)
          .then((res: any) => {
            const { code } = res
            if (code === 200) {
              ElMessage.success('绑定成功')
              emit(EventEnum.success)
            } else {
              ElMessage.error('绑定失败')
            }
            hideLoading()
          })
          .catch(_ => {
            hideLoading()
          })
      }
    }
  })
}
</script>

<style scoped lang="scss">
.elastic-ip--bind {
  width: 100%;
  .search-input {
    margin-top: 20px;
  }
  .detail-info {
    span {
      font-weight: bold;
      color: $textColorPrimary;
    }
  }
}
</style>
