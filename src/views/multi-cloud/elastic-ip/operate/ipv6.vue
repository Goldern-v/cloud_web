<template>
  <div class="ipv6-container">
    <div class="flex-row">
      <img src="@/assets/warning.png" alt="" style="width: 25px" />
      <span class="warning_title"
        >确定要{{ showOpenIpv6 ? '开启' : '关闭' }}IPv6转换吗 ?</span
      >
    </div>

    <template v-if="showOpenIpv6">
      <div class="warning_desc">
        开启IPv6转换后，将提供IPv4和IPv6弹性公网IP地址，原有IPV4业务可以快速为IPV6用户提供访问能力。公测期间IPV6转换功能免费。开启IPv6转换后，还需配置安全组，在安全组的出方向和入方向中放通198.19.0.0/16网段的IP地址。
        <el-link type="primary" class="ideal-default-text">了解更多</el-link>
      </div>
      <ideal-table-list
        :table-data="tableData"
        :table-headers="openIpv6TableHeader"
        :show-pagination="false"
      >
      </ideal-table-list>
    </template>

    <template v-else>
      <div class="warning_desc">
        关闭IPv6转换后，将会删除IPv6地址，如需使用请重新开启。
      </div>
      <ideal-table-list
        :table-data="tableData"
        :table-headers="closeIpv6TableHeader"
        :show-pagination="false"
      >
      </ideal-table-list>
    </template>

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
import { showLoading, hideLoading } from '@/utils/tool'
import { cloudHostStart } from '@/api/java/compute'
import { OperateEventEnum, EventEnum } from '@/utils/enum'

const { t } = useI18n()
interface PowerOnProps {
  rowData?: any // 行数据
  dialogType: OperateEventEnum | string | undefined
}
const props = withDefaults(defineProps<PowerOnProps>(), {
  rowData: () => ({})
})

// 开启Ipv6转换
const showOpenIpv6 = computed(
  () => props.dialogType === OperateEventEnum.openIpv6
)

// 原有规格数据
const tableData = ref<any[]>([])
onMounted(() => {
  tableData.value = [props.rowData]
})

const openIpv6TableHeader: IdealTableColumnHeaders[] = [
  { label: '弹性公网IP', prop: 'ip' },
  { label: '类型', prop: 'eipType' },
  { label: '已绑定实例', prop: 'instance' }
]
const closeIpv6TableHeader: IdealTableColumnHeaders[] = [
  { label: '弹性公网IP', prop: 'ip' },
  { label: 'IPv6地址', prop: 'ipv6' },
  { label: '类型', prop: 'eipType' },
  { label: '已绑定实例', prop: 'instance' }
]

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
  showLoading('开启中...')
  cloudHostStart(props?.rowData?.uuid)
    .then((res: any) => {
      const { msg, code, status } = res
      if (code === 200 && status) {
        ElMessage.success('开启成功')
        emit(EventEnum.success)
      } else {
        ElMessage.error(msg || '开启失败')
      }
      hideLoading()
    })
    .catch(_ => {
      hideLoading()
    })
}
</script>

<style scoped lang="scss">
.ipv6-container {
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
  .warning_desc {
    margin: 10px 0;
  }
}
</style>
