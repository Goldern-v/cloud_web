<template>
  <div class="refused">
    <div class="flex-row flex-row-center" style="padding: 0 17px 10px;">
      <div>已被拒绝镜像支持再次接受。</div>
      <svg-icon icon="refresh-icon" @click="clickRefresh"/>
    </div>

    <ideal-table-list
      :table-data="dataArray"
      :table-headers="tableHeaders"
      :show-pagination="false"
      style="padding: 0px 17px"
    ></ideal-table-list>

    <div class="flex-row footer-button">
      <el-button @click="cancelForm">{{ t('cancel') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { EventEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders } from '@/types'
import { mirrorPage } from '@/api/java/compute'

const { t } = useI18n()
const clickRefresh = () => {
  getMirrorList()
}
// 列表
onMounted(() => {
  getMirrorList()
})

const dataArray = ref<any[]>([]) // 等待被拒绝或被接受镜像
const getMirrorList = () => {
  const params = {
    visibility: 'shared',
    shareStatus: 'REJECTED' // WAITING是等待被拒绝或被接受，ACCEPTED接受，REJECTED拒绝
  }
  mirrorPage(params).then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      dataArray.value = data.data.map((item: any) => {
        item.systemType = `os-${item?.osType.toLowerCase()}`
        return item
      })
    } else {
      dataArray.value = []
    }
  }).catch(_ => {
    dataArray.value = []
  })
}

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: '镜像ID', prop: 'id' },
  { label: '操作系统类型', prop: 'osType' },
  { label: '操作系统', prop: 'osVersion' }
]
// 方法
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const cancelForm = () => {
  emit(EventEnum.cancel)
}
</script>

<style scoped lang="scss">
.refused {
  width: 100%;
  .flex-row-center {
    justify-content: space-between;
    align-items: center;
  }
  .footer-button {
    justify-content: flex-end;
    align-items: center;
    padding-right: 17px;
    margin-top: 10px;
  }
}
</style>