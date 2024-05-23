<template>
  <div class="resource-pool">
    <div class="resource-pool-table">
      <el-alert
        :closable="false"
        title="您可以看到此业务组关联的资源池，供用户申请云资源使用；全局资源池将自动关联VDC内。"
        type="warning"
        show-icon
      />
      <ideal-table-list
        :loading="state.dataListLoading"
        :table-data="state.dataList"
        :table-headers="tableHeaders"
        :total="state.total"
        :page="state.page"
        @clickSizeChange="sizeChangeHandle"
        @clickCurrentChange="currentChangeHandle"
        @handleSelectionChange="selectionChangeHandle"
      >
        <template #name>
          <el-table-column label="资源池名称">
            <template #default="props">
              <div>
                <img
                  :src="props.row.imageUrl"
                  alt=""
                  style="width: 40px; height: 40px"
                />
                <span>{{ props.row.name }}</span>
              </div>
            </template>
          </el-table-column>
        </template>
        <template #cloudTypeName>
          <el-table-column label="类型名称">
            <template #default="props">
              <div class="flex-row flex-row-center">
                <img :src="getImageUrl(props.row.cloudType)" alt="" />
                <!-- <img
                  v-if="RegExp(/HUAWEI_CLOUD/).test(props.row.cloudType)"
                  :src="huawei"
                  alt=""
                />
                <img
                  v-if="props.row.cloudType === 'Azure'"
                  :src="microsoft"
                  alt=""
                /> -->
                <span>{{ props.row.cloudTypeName }}</span>
              </div>
            </template>
          </el-table-column>
        </template>
        <template #status>
          <el-table-column label="状态">
            <template #default="props">
              <ideal-status-icon
                :status-icon="props.row.statusIcon"
                :status-text="props.row.statusDes"
              ></ideal-status-icon>
            </template>
          </el-table-column>
        </template>
      </ideal-table-list>
    </div>

    <div class="flex-row footer-button">
      <el-button type="primary" @click="clickSubmit">{{ t('save') }}</el-button>
      <el-button @click="clickCancel">{{ t('back') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import { resourcePoolList } from '@/api/java/operate-center'
import { RESOURCE_STATUS_ICON, RESOURCE_STATUS } from '@/utils/dictionary'
import type { IdealTableColumnHeaders } from '@/types'

// 属性值
interface ResourcePoolProps {
  item?: any // 行数据
}
const props = withDefaults(defineProps<ResourcePoolProps>(), {
  item: {}
})
const { t } = useI18n()
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '', prop: 'name', useSlot: true },
  { label: '资源池类别', prop: 'cloudCategoryName' },
  { label: '类型名称', prop: 'cloudTypeName', useSlot: true },
  { label: '', prop: 'status', useSlot: true }
]
const vdcId = useRoute().query.id
const ali = new URL('@/assets/ali.png', import.meta.url).href
const huawei = new URL('@/assets/huawei.png', import.meta.url).href
const microsoft = new URL('@/assets/ali.png', import.meta.url).href
const tencent = new URL('@/assets/tencent.png', import.meta.url).href

const getImageUrl = (type: string) => {
  let imgUrl = ''
  switch (type) {
    case 'HUAWEI_CLOUD':
      imgUrl = new URL('@/assets/huawei.png', import.meta.url).href
      break
    case 'ALI_CLOUD':
      imgUrl = new URL('@/assets/ali.png', import.meta.url).href
      break
    case 'TENCENT':
      imgUrl = new URL('@/assets/tencent.png', import.meta.url).href
      break
    case 'CTYUN':
      imgUrl = new URL('@/assets/ctyun.png', import.meta.url).href
      break
    default:
      imgUrl = ''
  }
  return imgUrl
}

const state: IHooksOptions = reactive({
  dataListUrl: resourcePoolList,
  queryForm: {
    vdcId,
    pageNum: 1,
    pageSize: 10
  }
})
const { selectionChangeHandle, sizeChangeHandle, currentChangeHandle } =
  useCrud(state)
const cloudObj: any = {
  HuaweiCloud: '华为云',
  Azure: '微软云',
  ALibabacloud: '阿里云'
}
watch(
  () => state.dataList,
  value => {
    if (value) {
      value.map((item: any) => {
        item.statusIcon = RESOURCE_STATUS_ICON[item.status]
        item.statusDes = RESOURCE_STATUS[item.status]
      })
    }
  }
)

const clickSubmit = () => {}
const router = useRouter()
const clickCancel = () => {
  router.back()
}
</script>

<style lang="scss" scoped>
.resource-pool {
  width: 100%;
  .resource-pool-table {
    padding: 20px;
    background-color: white;
  }
  .footer-button {
    margin-top: 5px;
    padding: 20px;
    background-color: white;
    justify-content: flex-start;
    align-items: center;
  }
  .align-item {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .flex-row-center {
    align-items: center;
  }
}
:deep(.el-alert--warning.is-light) {
  background-color: var(--el-color-primary-light-9);
  padding: 20px 16px;
  .el-alert__content {
    color: #000;
  }
  .el-alert__icon {
    color: var(--el-color-primary);
  }
}
</style>
