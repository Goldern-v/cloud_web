<template>
  <div>
    <div class="unbind">
      <div class="flex-row">
        <img src="@/assets/warning.png" style="width: 25px" alt="" />
        <span class="warning_title"
          >确定要将以下服务器从安全组{{ securityGroupName }}中移出吗</span
        >
      </div>
      <div class="flex-row warning_desc">
        服务器移出安全组后，将不再受到本安全组访问规则的保护
      </div>
      <ideal-table-list
        :table-data="tableArray"
        :table-headers="tableHeader"
        :show-pagination="false"
      >
        <template #privateIp>
          <el-table-column label="私有IP地址">
            <template #default="props">
              <div>{{ props.row.ipv4Address }}</div>
              <div>{{ props.row.ipv6Address }}</div>
            </template>
          </el-table-column>
        </template>
      </ideal-table-list>
    </div>

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
import { EventEnum } from '@/utils/enum'
import { showLoading, hideLoading } from '@/utils/tool'
import { safeGroupRemoveInstance } from '@/api/java/network'

const { t } = useI18n()
interface PowerOnProps {
  tableArray?: any // 行数据
}
const props = withDefaults(defineProps<PowerOnProps>(), {
  tableArray: () => []
})

const route = useRoute()
const detailInfo = JSON.parse(route.query.data as any)
const securityGroupName = detailInfo.name

const tableHeader: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: '类型', prop: 'type' },
  { label: '私有IP地址', prop: 'privateIp', useSlot: true }
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

//公共参数
const commonParams = () => {
  const params = {
    resourcePoolId: detailInfo.resourcePoolId,
    regionId: detailInfo.regionId,
    projectId: detailInfo.projectId
  }
  return params
}

const submitForm = () => {
  const instanceDtoList = props.tableArray.map((item: any) => item.uuid)
  const params = {
    name: detailInfo.name,
    uuid: detailInfo.uuid,
    instanceDtoList,
    ...commonParams()
  }
  showLoading('解绑中...')
  safeGroupRemoveInstance(params)
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
.unbind {
  width: 100%;
  padding: 15px 0;
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
