<template>
  <div class="delete-elb">
    <div class="flex-row">
      <img src="@/assets/warning.png" style="width: 25px" alt="" />
      <span class="warning_title">确认删除以下弹性负载均衡器吗？</span>
    </div>
    <div class="flex-row custom-warning-box">
      <svg-icon
        icon="info-warning"
        color="var(--el-color-primary)"
        class="ideal-svg-margin-right"
      ></svg-icon>
      <div>
        确定删除后，负载均衡实例及其下配置(监听器、转发策略、后端服务器等)无法恢复，后端服务自动取消与后端服务器组的关联，请谨慎操作。
      </div>
    </div>
    <ideal-table-list
      :table-data="tableData"
      :table-headers="tableHeader"
      :show-pagination="false"
    >
      <template #expandTable>
        <el-table-column type="expand">
          <template #default="props">
            <ideal-table-list
              :table-data="props.row.eipList"
              :table-headers="expandTableHeaders"
              :show-pagination="false"
              style="padding-left: 60px"
              class="expand-table"
            >
              <template #eip>
                <el-table-column label="弹性公网IP">
                  <template #default="scope">
                    <div>
                      IPV4公网地址<span
                        class="ideal-default-margin-left"
                        style="color: var(--el-color-primary)"
                        >{{ scope.row.ipAddress }}</span
                      >
                    </div>
                    <div>
                      带宽大小<span class="ideal-default-margin-left">{{
                        scope.row.bandwidthSize
                      }}</span>
                    </div>
                    <div>
                      公网带宽<span class="ideal-default-margin-left">{{
                        scope.row.bandwidth
                      }}</span>
                    </div>
                    <div>
                      带宽计费<span class="ideal-default-margin-left">{{
                        scope.row.billingMode
                      }}</span>
                    </div>
                  </template>
                </el-table-column>
              </template>
            </ideal-table-list>
          </template>
        </el-table-column>
      </template>
      <template #serviceAddress>
        <el-table-column label="服务地址" width="200">
          <template #default="props">
            <p>
              {{ props.row.privateIp
              }}<span class="ideal-tip-text ideal-default-margin-left">(IPv4私有地址)</span>
            </p>
            <p>
              {{ props.row.publicIp
              }}<span class="ideal-tip-text ideal-default-margin-left">(IPv4公网地址)</span>
            </p>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <el-checkbox v-model="releaseEip"
      ><span class="ideal-warning-text"
        >释放该负载均衡绑定的弹性公网IP，如不释放可能会被其他资源绑定继续计费。</span
      ></el-checkbox
    >

    <div>如您确认要删除负载均衡实例及其下资源，请输入DELETE进行删除。</div>
    <el-input placeholder="DELETE" class="ideal-default-margin-top"></el-input>

    <div class="flex-row ideal-submit-button">
      <el-button type="info" @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum, OperateEventEnum } from '@/utils/enum'
import { showLoading, hideLoading } from '@/utils/tool'
import { eipUnbindInstance } from '@/api/java/network'
import store from '@/store'

const { t } = useI18n()
interface PowerOnProps {
  rowData?: any // 行数据
  multipleSelection?: string[] //多选
}
const props = withDefaults(defineProps<PowerOnProps>(), {
  rowData: () => ({}),
  multipleSelection: () => []
})

// 原有规格数据
const tableData = ref<any[]>([])
onMounted(() => {
  tableData.value = [props.rowData]
  console.log(tableData.value, '---------')
})
const tableHeader: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: '状态', prop: 'statusText' },
  { label: '服务地址', prop: 'serviceAddress', useSlot: true },
  { label: '可释放的弹性公网IP', prop: 'releaseEipNum' },
  { label: '删除监听器', prop: 'monitor' },
  { label: '删除后端服务器组', prop: 'serverGroup' }
]

const expandTableHeaders: IdealTableColumnHeaders[] = [
  { label: '弹性公网IP', prop: 'eip', useSlot: true },
  { label: '监听器(前端协议、端口)', prop: 'protocol' },
  { label: '后端服务器组(后端服务器数量)', prop: 'server-group' }
]

const releaseEip = ref('')

// 点击事件
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const cancelForm = () => {
  emit(EventEnum.cancel)
}

const { resourcePoolInfo, regionInfo } = storeToRefs(store.resourceStore)
//公共参数
const commonParams = () => {
  const params = {
    resourcePoolId: props.rowData.resourcePoolId,
    regionId: props.rowData.region,
    regionName: regionInfo.value?.name,
    projectId: props.rowData.projectId,
    vdcId: store.userStore.user.vdcId,
    vdcCode: store.userStore.user.vdcCode
  }
  return params
}

const submitForm = () => {
  const params = {
    eipUuid: props.rowData.uuid,
    ...commonParams()
  }
  showLoading('解绑中...')
  eipUnbindInstance(params)
    .then((res: any) => {
      const { msg, code, status } = res
      if (code === 200 && status) {
        ElMessage.success('解绑成功')
        emit(EventEnum.success)
      } else {
        ElMessage.error(msg || '解绑失败')
      }
      hideLoading()
    })
    .catch(_ => {
      hideLoading()
    })
}
</script>

<style scoped lang="scss">
.delete-elb {
  width: 100%;
  .footer-button {
    justify-content: flex-end;
    align-items: center;
    margin-top: 10px;
  }
  .warning_title {
    margin-left: 10px;
    font-weight: bolder;
    font-size: 14px;
    color: var(--el-text-color-primary);
  }
  .custom-warning-box {
    background-color: var(--custom-information-bg-color);
    border: 1px solid var(--el-color-primary);
    padding: 10px 20px;
    margin-top: 20px;
    align-items: baseline;
  }
  .ideal-warning-text {
    color: $errorColor;
  }
  // .expand-table {
  //   span {
  //     color: $gray7-light;
  //     font-size: $defaultFontSize;
  //     margin-left: 10px;
  //   }
  // }
}
</style>
