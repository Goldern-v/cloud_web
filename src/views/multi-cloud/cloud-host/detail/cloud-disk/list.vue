<template>
  <div class="cloud-disk">
    <div class="ideal-tip-text">
      如果在云服务器中查询不到新挂载的磁盘或磁盘扩容的容量，请重启云服务器更新磁盘信息。
      <span class="ideal-theme-text">挂载后处理 | 扩容后处理</span>
    </div>

    <ideal-button-events
      class="ideal-default-margin-top"
      :left-btns="leftButtons"
      @clickLeftEvent="clickLeftEvent"
    />

    <el-collapse accordion>
      <el-collapse-item v-for="(item,index) of dataArray" :key="index" :name="index">
        <template #title>
          <div class="flex-row collapse-title" @click.stop>
            <span style="width: 40%;text-align: left;">{{ item.name }}</span>

            <ideal-button-events
              style="width: 60%"
              :right-btns="item.operate"
              :right-max-buttons="5"
              @clickRightEvent="clickRightEvent($event, item)"
            >
            </ideal-button-events>
          </div>
        </template>

        <el-descriptions :column="2">
          <el-descriptions-item
            v-for="(child, idx) of diskArray"
            :key="idx"
            :label="child.label"
            >{{ item[child.prop] }}</el-descriptions-item
          >
        </el-descriptions>

      </el-collapse-item>
    </el-collapse>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      :row-data="rowData"
      :detail="detailInfo"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    />
  </div>
</template>

<script setup lang="ts">
import dialogBox from './dialog-box.vue'
import type { IdealButtonEventProp, IdealTextProp } from '@/types'
import { OperateEventEnum, BillingEnum } from '@/utils/enum'
import { RESOURCE_STATUS, RESOURCE_STATUS_ICON, diskTypeDic } from '@/utils/dictionary'
import { cloudDiskList } from '@/api/java/store'

interface DetailProps {
  detailInfo?: any // 行数据
}
const props = withDefaults(defineProps<DetailProps>(), {
  detailInfo: () => ({})
})

onMounted(() => {
  queryCloudDisk()
})

const dataArray = ref<any[]>([])
const queryCloudDisk = () => {
  const params = {
    resourcePoolId: props.detailInfo?.pool?.id, // 资源池id
    regionId: props.detailInfo?.regionId, // 区域
    availableZone: props.detailInfo?.availableZone, // 可用区
    projectId: props.detailInfo?.project?.id, // 项目id
    instanceId: props.detailInfo?.id,
    status: 'IN_USE'
  }

  cloudDiskList(params).then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      dataArray.value = data
      handleData()
    } else {
      dataArray.value = []
    }
  }).catch(_ => {
    dataArray.value = []
  })
}
const handleData = () => {
  if (!dataArray.value.length) { return }
  dataArray.value.forEach((item: any) => {
    item.billTypeText = item.billType === BillingEnum.ON_DEMAND ? '按需' : '包年包月'
    item.encryptionDisk = item.encrypted ? '是' : '否'
    item.createDate = item.createTime.date
    item.shareableText = item.shareable ? '共享盘':'普通云硬盘'
    item.diskAttribute = item.bootable ? '是' : '否'
    item.volumeTypeName = diskTypeDic[item.volumeType]
    item.statusText = RESOURCE_STATUS[item.status.toUpperCase()]
    item.statusIcon = RESOURCE_STATUS_ICON[item.status.toUpperCase()]
    item.operate = newOperate(item)
  })
}
// 根据每行数据状态判断操作是否禁用
const newOperate = (item: any): IdealButtonEventProp[] => {
  const tempArr: IdealButtonEventProp[] = JSON.parse(JSON.stringify(rightButtons.value))

  if (!item?.available &&
    item?.instanceStatus !== 'SHUTDOWN' &&
    props.detailInfo.pool.cloudCategory === 'PRIVATE' &&
    props.detailInfo.pool.cloudType === 'HUAWEI_CLOUD') {
      tempArr.forEach((row: IdealButtonEventProp) => {
        if (row.prop === 'uninstall') {
          row.disabled = true
          row.disabledText = `挂载云主机只有关机状态，云硬盘才支持卸载。`
        }
      })
  }

  if (item?.bootable === 1) {
    tempArr.forEach((child: IdealButtonEventProp) => {
      if (child.prop === 'uninstall' || child.prop === 'expand') {
        child.disabled = true
        child.disabledText = child.prop === 'uninstall' ? '系统盘禁止卸载。' : '系统盘禁止扩容。'
      }
    })
  }

  return tempArr
}

// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '新增磁盘',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white'
  },
  { title: '挂载磁盘', prop: 'mount' }
])
const router = useRouter()
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    router.push({ path: '/multi-cloud/cloud-disk/create' })
  } else if (value === 'mount') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.mount
  }
}
// 列表右侧按钮
const rightButtons = ref<IdealButtonEventProp[]>([
  { title: '查看监控数据', prop: 'checkMonitor', text: true, type: 'primary' },
  { title: '创建备份', prop: 'createBackup', text: true, type: 'primary' },
  { title: '创建快照', prop: 'createSnapShoot', text: true, type: 'primary' },
  { title: '扩容', prop: 'expand', text: true, type: 'primary' },
  { title: '卸载', prop: 'uninstall', text: true, type: 'primary' }
])
const rowData = ref()
const clickRightEvent = (value: string | number | object, row: any) => {
  rowData.value = row
  if (value === 'uninstall') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.uninstall
  } else if (value === 'expand') {
    const data = JSON.stringify(row)
    router.push({ path: '/multi-cloud/cloud-disk/expand', query: { data } })
  } else if (value === 'checkMonitor') {
    emit('clickTabsEvent', 'monitor')
  } else if (value === 'createBackup') {
    router.push({ path: '/multi-cloud/cloud-disk-backup-storage/create' })
  } else if (value === 'createSnapShoot') {
    router.push({ path: '/multi-cloud/cloud-disk-snapshot/create' })
  }
}
// 云硬盘信息
const diskArray: IdealTextProp[] = [
  { label: 'ID', prop: 'id' },
  { label: '名称', prop: 'name' },
  { label: '容量(GiB)', prop: 'size' },
  { label: '类型', prop: 'volumeTypeName' },
  { label: '设备类型', prop: 'volumeMode' },
  { label: '计费模式', prop: 'billTypeText' },
  { label: '可用区', prop: 'availableZone' },
  { label: '系统盘', prop: 'diskAttribute' },
  { label: '共享盘', prop: 'shareableText' },
  { label: '加密盘', prop: 'encryptionDisk' },
  { label: '创建时间', prop: 'createDate' }
]
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  resetDialog()
}
const clickRefreshEvent = () => {
  resetDialog()
  queryCloudDisk()
}
// 重置弹框
const resetDialog = () => {
  showDialog.value = false
  dialogType.value = '' // 防止再点击弹框时 有值
}
// 点击事件
interface EventEmits {
  (e: 'clickTabsEvent', v: string): void
}
const emit = defineEmits<EventEmits>()
</script>

<style scoped lang="scss">
.cloud-disk {
  width: calc(100% - 40px);
  padding: 20px;
  background-color: white;
  .collapse-title {
    flex: 1;
    order: 1;
  }
  // 修改折叠框
  :deep(.el-collapse) {
    --el-collapse-header-bg-color: var(--el-color-primary-light-9);
    border-top: none;
    border-bottom: none;
  }
  :deep(.el-collapse-item__header) {
    padding-left: 10px;
  }
  :deep(.el-collapse-item__wrap) {
    border-bottom: none;
  }
  :deep(.el-collapse-item) {
    border: 1px solid $sub5-light;
    margin: 10px 0;
    border-radius: $circleRadiusSize;
  }
  :deep(.el-collapse-item__content) {
    padding: 10px;
  }
  // 修改描述列表
  :deep(.el-descriptions__label:not(.is-bordered-label)) {
    color: #8b8b8b;
    font-size: $defaultFontSize;
  }
  :deep(.el-descriptions__content:not(.is-bordered-label)) {
    color: #000;
    font-size: $defaultFontSize;
  }
}
</style>
