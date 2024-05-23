<template>
  <div class="ecs">
    <div class="ecs__tip">
      <div>当前关机或开机状态的弹性云服务器才可以用来创建私有镜像。</div>
      <div>创建镜像前，请确保弹性云服务器已完成相关配置。</div>
      <div>
        请勿在创建镜像过程中对所选择的弹性云服务器及相关资源进行其他操作。
      </div>
    </div>

    <div class="flex-row">
      <ideal-select-search
        :options="searchOptions"
        prefix-title="名称查询"
        @clickSearch="clickSearch"
        @clickReset="clickReset"
      />
    </div>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :is-radio="true"
      row-key="uuid"
      :show-pagination="false"
      @clickTableCellRow="clickTableCellRow"
      @expandChange="clickExpandChange"
    >
      <template #expandTable>
        <el-table-column type="expand">
          <div style="padding: 0 5%">已挂载磁盘信息</div>
          <ideal-table-list
            style="width: 100%; padding: 0 5%"
            :loading="volume.dataListLoading"
            :table-data="volume.dataList"
            :table-headers="volumeTableHeaders"
            :show-pagination="false"
          >
          </ideal-table-list>
        </el-table-column>
      </template>

      <template #name>
        <el-table-column label="名称">
          <template #default="props">
            <div>{{ props.row.name }}</div>
          </template>
        </el-table-column>
      </template>

      <template #osType>
        <el-table-column label="操作系统" show-overflow-tooltip>
          <template #default="props">
            <div class="flex-row">
              <svg-icon
                v-if="props.row.image.osType"
                :icon="props.row.osType"
                class="ideal-svg-margin-right"
              />
              <div>{{ props.row.image.osType }}</div>
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

      <template #privateIp>
        <el-table-column label="私有IP地址">
          <template #default="props">
            <div v-for="(item, index) of props.row.nicList" :key="index">
              {{ item.fixedIp }}
            </div>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>
    <el-button type="primary" link @click="clickToCloudHost"
      >购买弹性云服务器</el-button
    >
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders } from '@/types'
import store from '@/store'
import {
  RESOURCE_STATUS,
  RESOURCE_STATUS_ICON,
  diskTypeDic
} from '@/utils/dictionary'
import { cloudHostListUrl } from '@/api/java/compute'
import { cloudDiskListUrl } from '@/api/java/store'

interface EcsProps {
  regionId?: string
  projectId?: string
}
const props = withDefaults(defineProps<EcsProps>(), {
  regionId: '',
  projectId: ''
})
const { resourcePool } = storeToRefs(store.resourceStore)

const initQueryForm = () => {
  state.queryForm = {
    resourcePoolId: resourcePool.value.resourcePoolId,
    regionId: props.regionId,
    projectId: props.projectId
  }
}
watch(
  () => [props.regionId, props.projectId],
  (newValue, oldValue) => {
    if (newValue !== oldValue && newValue[0] && newValue[1]) {
      initQueryForm()
      query()
    }
  }
)

const searchOptions = [
  { label: '名称', prop: 'name' },
  { label: 'ID', prop: 'uuid' }
]
// 搜索
const clickSearch = (search: string, type: string) => {
  state.queryForm = {}
  if (type) {
    state.queryForm[type] = search
  }
  query()
}
// 重置
const clickReset = () => {
  state.page = 1
  state.queryForm = {}
  query()
}

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: cloudHostListUrl,
  isPage: false,
  createdIsNeed: false,
  queryForm: {}
})
const { query } = useCrud(state)

const isPublicCtyun =
  RegExp(/CTYUN/).test(resourcePool.value.cloudPlatformType) &&
  RegExp(/PUBLIC/).test(resourcePool.value.categoryId)
watch(
  () => state.dataList,
  value => {
    if (value?.length) {
      value.forEach((item: any) => {
        item.statusText = RESOURCE_STATUS[item?.status]
        item.statusIcon = RESOURCE_STATUS_ICON[item?.status]
        item.osType = `os-${item?.image?.osType.toLowerCase()}`
        if (isPublicCtyun) {
          // 天翼云开机状态, 云主机禁选
          item.radioDisabled = item.status !== 'SHUTDOWN'
        } else {
          item.radioDisabled = false
        }
      })
    }
  }
)
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true },
  { label: '操作系统', prop: 'osType', useSlot: true },
  { label: '运行状态', prop: 'status', useSlot: true },
  { label: '私有IP地址', prop: 'privateIp', useSlot: true },
  { label: '创建时间', prop: 'createTime.date' }
]
// 云服务器选择
const clickTableCellRow = (row: any) => {
  emit('clickTableCell', row)
}
// 云服务器扩展
const clickExpandChange = (row: any) => {
  volume.queryForm.instanceId = row.id
  volumeCrud.query()
}
// 已挂载磁盘信息列表
const volume: IHooksOptions = reactive({
  dataListUrl: cloudDiskListUrl,
  isPage: false,
  createdIsNeed: false,
  queryForm: {
    resourcePoolId: resourcePool.value.resourcePoolId, // 资源池id
    regionId: props.regionId, // 区域
    projectId: props.projectId // 项目id
  }
})
const volumeCrud = useCrud(volume)

watch(
  () => volume.dataList,
  value => {
    if (value?.length) {
      value.forEach((item: any) => {
        item.volumeTypeName = diskTypeDic[item.volumeType]
        item.diskAttribute = item?.bootable ? '系统盘' : '数据盘'
        item.encryptedType = item.encrypted ? '是' : '否'
      })
    }
  }
)

const volumeTableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: '容量(GiB)', prop: 'size' },
  { label: '磁盘类型', prop: 'volumeTypeName' },
  { label: '磁盘属性', prop: 'diskAttribute' },
  { label: '加密盘', prop: 'encryptedType' }
]
const router = useRouter()
const clickToCloudHost = () => {
  router.push({ path: '/multi-cloud/cloud-host/create' })
}
// 方法
interface EventEmits {
  (e: 'clickTableCell', v: any): void
}
const emit = defineEmits<EventEmits>()
</script>

<style scoped lang="scss">
.ecs {
  width: 100%;
  .ecs__tip {
    background-color: var(--el-color-primary-light-9);
    padding: 10px 20px;
    align-items: center;
    margin-bottom: 10px;
  }
}
</style>
