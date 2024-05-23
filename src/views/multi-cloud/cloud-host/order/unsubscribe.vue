<template>
  <div class="unsubscribe">
    <div class="unsubscribe-original">
      <div class="flex-row unsubscribe__tip">
        <svg-icon
          icon="info-warning"
          color="#F3AD3C"
          class="ideal-svg-margin-right"
        ></svg-icon>
        <span>是否确定退订弹性云主机？</span>
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

      <div class="unsubscribe-explain">
        说明：只退还实例后将根据系统配置进入回收站保留，不解除主机和数据盘、弹性IP的关联关系。选择同时退订共享数据盘后，会自动解除云硬盘和其他云主机的挂载关系。
        退订后会自动删除使用该资源所创建的快照。
      </div>
    </div>

    <el-form
      v-if="!publicTencent"
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
            ref="diskTableListRef"
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

    <div class="flex-row footer-button">
      <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import ipAddress from '../components/ip-address.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum, resourceTypeEnum, BillingEnum } from '@/utils/enum'
import type { FormRules, FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { diskTypeDic } from '@/utils/dictionary'
import {
  queryCloudHostDetail,
  unsubscribeCloudHost,
  submitCloudHostOrder
} from '@/api/java/compute'
import store from '@/store'
import { approvalProcess } from '@/utils/tool'

const { t } = useI18n()
interface UnsubscribeProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<UnsubscribeProps>(), {
  rowData: () => ({})
})
// 原有规格数据
const originalData = ref<any[]>([])
// 腾讯公有云退订时不显示数据盘和弹性IP解绑
const publicTencent = ref(false)
onMounted(() => {
  originalData.value = [props.rowData]
  queryDetailData()
  publicTencent.value = RegExp(/TENCENT/).test(props.rowData?.pool?.cloudType) && RegExp(/PUBLIC/).test(props.rowData?.pool?.cloudCategory)
})
const originalHeader: IdealTableColumnHeaders[] = [
  { label: '名称/ID', prop: 'name', useSlot: true },
  { label: '状态', prop: 'status', useSlot: true },
  { label: 'IP地址', prop: 'ipAddress', useSlot: true },
  { label: '规格', prop: 'spec', useSlot: true },
  { label: '时间', prop: 'createTime.date' }
]
const diskTableListRef = ref()
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
            eipList.push(
              Object.assign(item.eip, {
                intranetIp: item.fixedIp
              })
            )
          }
        })
        diskState.dataList = data.volumeList
        diskState.dataList?.forEach((item: any) => diskTableListRef.value.IdealTableList.toggleRowSelection(item, true))
        eipState.dataList = eipList
        detailData.value = data
      } else {
        diskState.dataList = []
        eipState.dataList = []
      }
    })
    .catch(_ => {})
}

const formRef = ref<FormInstance>()
const form = reactive({
  disk: '',
  eip: ''
})
const rules = reactive<FormRules>({})

// 数据盘列表
const diskState: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const diskCrud = useCrud(diskState)
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

// 弹性IP表头
const eipHeaders: IdealTableColumnHeaders[] = [
  { label: 'IP名称/ID', prop: 'ipName', useSlot: true },
  { label: 'IP地址', prop: 'ipAddress' },
  { label: '基准/最大带宽', prop: 'bandwidth', useSlot: true },
  { label: '已绑定内网IP', prop: 'intranetIp' }
]
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
      let resourceIdList: any = [
        { resourceUuid: props.rowData.uuid, mainResource: true }
      ]
      diskState.dataListSelections?.forEach((item: any) => {
        resourceIdList.push({
          resourceUuid: item.uuid,
          mainResource: false
        })
      })
      eipState.dataListSelections?.forEach((item: any) => {
        resourceIdList.push({
          resourceUuid: item.uuid,
          mainResource: false
        })
      })
      const params = {
        resourceIdList,
        unsubscribeType: 1,
        resourceType: resourceTypeEnum.ECS,
        type: 'UNSUBSCRIBE', // 订单类别 SUBSCRIBE订购、RENEW续订、VARIATION变配、UNSUBSCRIBE退订
        resourcePoolId: props.rowData.pool?.id,
        poolTypeUuid: '',
        regionId: props.rowData.regionId,
        projectId: props.rowData.project?.id,
        vdcId: props.rowData.vdc?.id,
        cloudPlatformId: detailData.value.cloudPlatform?.id
      }
      unsubscribeCloudHost(params).then((res: any) => {
        const { code, data } = res
        const orderId: any = data
        if (code === 200) {
          approvalProcess('ECSTD', store.userStore.user.vdcId, orderId).then(
            (res: any) => {
              if (res.code === 200) {
                emit(EventEnum.success)
              }
            }
          )
        } else {
          ElMessage.error(data.msg || '退订失败')
        }
      })
    } else {
      console.log('error submit!')
      return false
    }
  })
}
const submitOrder = () => {
  let params = {
    billType: props?.rowData?.billingMode
      ? BillingEnum.PACKAGE
      : BillingEnum.ON_DEMAND,
    resourceId: props?.rowData?.billResourceId,
    orderType: 'UNSUBSCRIBE',
    vdcId: props?.rowData?.vdcId
  }
  submitCloudHostOrder(params).then((res: any) => {
    const { data, code } = res
    if (code === 200) {
      ElMessage.success('退订成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error(data.msg || '退订失败')
    }
  })
}
</script>

<style scoped lang="scss">
.unsubscribe {
  width: 100%;
  .unsubscribe-original {
    padding: 0 17px;
    .unsubscribe__tip {
      background-color: #fefbed;
      padding: 20px;
      align-items: center;
    }
    .unsubscribe-explain {
      color: #f3ad3c;
      margin: 10px 0;
    }
  }
  .unsubscribe-form {
    :deep(.el-table) {
      height: 196px;
    }
  }
  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
