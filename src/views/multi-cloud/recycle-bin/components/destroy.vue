<template>
  <div class="destroy">
    <div>确定要对以下云主机进行销毁操作吗?</div>
    <div>销毁云服务器会同时销毁系统盘及其对应的快照。</div>
    <div>
      销毁的云服务器和磁盘无法恢复。云服务器销毁完成后，对应的磁盘需要1分钟左右才能完成删除。此时不要对磁盘有任何操作，否则可能导致云服务器故障或磁盘删除失败，需要重新执行删除操作。
    </div>
    <div>
      销毁云服务器时保留关联的云服务器备份，该备份继续收费，可在<span
        style="color: var(--el-color-primary)"
        >云备份页面</span
      >执行删除操作。
    </div>

    <ideal-table-list
      :table-data="originalData"
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

      <template #ipAddress>
        <el-table-column label="IP地址" width="150" show-overflow-tooltip>
          <template #default="props">
            <ip-address
              :data-array="props.row.nicList"
              @mouseEnterPrivate="
                value => (props.row.nicList[0].privateIpCopy = value)
              "
              @mouseLeavePrivate="
                value => (props.row.nicList[0].privateIpCopy = value)
              "
              @mouseEnterPublic="
                value => (props.row.nicList[0].eip.publicIpCopy = value)
              "
              @mouseLeavePublic="
                value => (props.row.nicList[0].eip.publicIpCopy = value)
              "
            />
          </template>
        </el-table-column>
      </template>

      <template #spec>
        <el-table-column label="规格">
          <template #default="props">
            <div v-if="props.row.flavor.uuid">
              {{ props.row.flavor.uuid }}
            </div>
            <div v-if="props.row.flavor.vcpus">
              {{ props.row.flavor.vcpus }}核｜{{ props.row.flavor.ram }}G
            </div>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
      class="unsubscribe-form"
    >
      <el-form-item label="数据盘" prop="disk">
        <div class="flex-column" style="width: 100%">
          <div>选择需要同时退还挂载在实例上的数据盘</div>

          <ideal-table-list
            :loading="diskState.dataListLoading"
            :table-data="diskState.dataList"
            :table-headers="diskHeaders"
            :is-multiple="true"
            :show-pagination="false"
            @handleSelectionChange="diskCrud.selectionChangeHandle"
          >
            <template #diskName>
              <el-table-column
                label="云硬盘名称/ID"
                width="280"
                show-overflow-tooltip
              >
                <template #default="props">
                  <el-button link type="primary">{{
                    props.row.name
                  }}</el-button>

                  <ideal-text-copy
                    :row="props.row"
                    @mouseEnterEvent="value => (props.row.showCopy = value)"
                    @mouseLeaveEvent="value => (props.row.showCopy = value)"
                  />
                </template>
              </el-table-column>
            </template>
          </ideal-table-list>
        </div>
      </el-form-item>

      <el-form-item label="弹性IP" prop="eip">
        <div class="flex-column" style="width: 100%">
          <div>选择需要同时退还挂载在实例上的弹性IP</div>

          <ideal-table-list
            :loading="eipState.dataListLoading"
            :table-data="eipState.dataList"
            :table-headers="eipHeaders"
            :is-multiple="true"
            :show-pagination="false"
            @handleSelectionChange="eipCrud.selectionChangeHandle"
          >
            <template #ipName>
              <el-table-column
                label="IP名称/ID"
                width="280"
                show-overflow-tooltip
              >
                <template #default="props">
                  <el-button link type="primary">{{
                    props.row.name
                  }}</el-button>

                  <ideal-text-copy
                    :row="props.row"
                    @mouseEnterEvent="value => (props.row.showCopy = value)"
                    @mouseLeaveEvent="value => (props.row.showCopy = value)"
                  />
                </template>
              </el-table-column>
            </template>

            <template #bandwidth>
              <el-table-column label="带宽" prop="bandwidth" width="180">
                <template #default="props">
                  <div>最大{{ props.row.bandwidth?.size }} Mbit/s</div>
                </template>
              </el-table-column>
            </template>
          </ideal-table-list>
        </div>
      </el-form-item>
    </el-form>

    <div class="flex-row ideal-submit-button">
      <el-button type="info" @click="cancelForm(formRef)">{{
        t('cancel')
      }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum } from '@/utils/enum'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { FormRules, FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { diskTypeDic } from '@/utils/dictionary'
import ipAddress from '@/views/multi-cloud/cloud-host/components/ip-address.vue'
import { deleteCloudHost, queryCloudHostDetail } from '@/api/java/compute'

interface HangUpProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<HangUpProps>(), {
  rowData: () => ({})
})

const { t } = useI18n()

// 原有规格数据
const originalData: any = ref([])
const originalHeader: IdealTableColumnHeaders[] = [
  { label: '名称/ID', prop: 'name', useSlot: true },
  { label: '状态', prop: 'status', useSlot: true },
  { label: 'ip地址', prop: 'ipAddress', useSlot: true },
  { label: '到期时间', prop: 'dueTime' }
]

const formRef = ref<FormInstance>()
const form = reactive({
  disk: '',
  eip: ''
})

const rules = reactive<FormRules>({})
// 数据盘列表
const diskState: IHooksOptions = reactive({})
const diskCrud = useCrud(diskState)
// diskCrud.getDataList

// 数据盘表头
const diskHeaders: IdealTableColumnHeaders[] = [
  { label: '云硬盘名称/ID', prop: 'diskName', useSlot: true },
  { label: '挂载主机', prop: 'bindInstance' },
  { label: '磁盘类型', prop: 'volumeTypeText' },
  { label: '容量(GB)', prop: 'size' },
  { label: '共享盘', prop: 'share' }
]

// 弹性IP列表
const eipState: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const eipCrud = useCrud(eipState)
// eipCrud.getDataList
// 弹性IP表头
const eipHeaders: IdealTableColumnHeaders[] = [
  { label: 'IP名称/ID', prop: 'ipName', useSlot: true },
  { label: 'IP地址', prop: 'ipAddress' },
  { label: '基准/最大带宽', prop: 'bandwidth', useSlot: true },
  { label: '已绑定内网IP', prop: 'ipAddress' }
]

onMounted(() => {
  originalData.value = [props.rowData]
  queryDetailData()
})

//查询云主机详情
const detailData: any = ref({})
const queryDetailData = () => {
  queryCloudHostDetail({ uuid: props.rowData.uuid })
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        data.volumeList.forEach((item: any) => {
          item.volumeTypeText = diskTypeDic[item.volumeType]
          item.bindInstance = data.name
          item.share = item.shareable ? '是' : '否'
        })
        let eipList: any = []
        data.nicList.forEach((item: any) => {
          if (item.eip.ipAddress) {
            eipList.push(item.eip)
          }
        })
        diskState.dataList = data.volumeList
        eipState.dataList = eipList
      } else {
        diskState.dataList = []
        eipState.dataList = []
      }
    })
    .catch(_ => {})
}

// 点击事件
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
      const params: any = {
        id: props.rowData.id,
        uuid: props.rowData.uuid
      }
      if (diskState.dataListSelections?.length === diskState.dataList?.length) {
        params.deleteVolume = diskState.dataList?.length ? true : false //是否全部删除数据盘
      } else {
        const volumeIds = diskState.dataListSelections?.map((item: any) => {
          return item.uuid
        })
        params.volumeIds = volumeIds
      }
      if (eipState.dataListSelections?.length === eipState.dataList?.length) {
        params.deletePublicIp = eipState.dataList?.length ? true : false //是否全部删除绑定的弹性IP
      } else {
        const publicIpIds = eipState.dataListSelections?.map((item: any) => {
          return item.uuid
        })
        params.publicIpIds = publicIpIds
      }
      deleteCloudHost(params).then((res: any) => {
        const { code, data, msg } = res
        if (code === 200) {
          ElMessage.success(msg || '删除成功')
          emit(EventEnum.success)
        } else {
          ElMessage.error(data.msg || '删除失败')
        }
      })
    } else {
      console.log('error submit!')
      return false
    }
  })
}
</script>

<style scoped lang="scss">
.destroy {
  width: 100%;
  .footer-button {
    justify-content: flex-end;
    align-items: center;
    margin-top: 10px;
  }
}
</style>
