<template>
  <div class="ideal-large-margin detail">
    <ideal-detail-info
      :label-array="labelArray"
      :item-number="2"
      :detail-info="detailInfo"
      label-position="left"
      class="detail-header"
    >
      <template #status>
        <div class="flex-row" style="justify-content: flex-start;">
          <ideal-status-icon
            v-if="detailInfo?.status"
            :status-icon="detailInfo?.statusIcon"
            :status-text="detailInfo?.statusText"
          />
        </div>
      </template>
    </ideal-detail-info>

    <el-tabs v-model="activeName" class="detail-tab">
      <el-tab-pane
        v-for="item of tabControllers"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      >
      </el-tab-pane>
    </el-tabs>

    <component
      :is="tabs[activeName]"
    ></component>
  </div>
</template>

<script setup lang="ts">
import shareProject from './components/share-project.vue'
import tag from './components/tag.vue'
import { RESOURCE_STATUS, RESOURCE_STATUS_ICON } from '@/utils/dictionary'
import { privateMirrorDetail } from '@/api/java/compute'

const route = useRoute()
const imageId = (route.query.id as string)
onMounted(() => {
  getDetail()
})
// 详情
const detailInfo = ref<any>()
const getDetail = () => {
  privateMirrorDetail({ id: imageId }).then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      detailInfo.value = data
      detailInfo.value.statusText = RESOURCE_STATUS[data?.status]
      detailInfo.value.statusIcon = RESOURCE_STATUS_ICON[data?.status]
      detailInfo.value.mirrorType = data?.imageType === 'SystemDiskImage' ? '系统镜像' : '云盘镜像'
      detailInfo.value.createDate = data?.createTime.date
      detailInfo.value.minRamText = data?.minRam + 'GB'
      detailInfo.value.sizeText = data?.size + 'GB'
    } else {
      detailInfo.value = {}
    }
  }).catch(_ => {
    detailInfo.value = {}
  })
}

const labelArray = ref([
  { label: '名称', prop: 'name' },
  { label: '镜像ID', prop: 'id' },
  { label: '镜像类型', prop: 'mirrorType' },
  { label: '磁盘容量(GiB)', prop: 'minDisk' },
  { label: '操作系统', prop: 'osVersion' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '最小内存', prop: 'minRamText' },
  { label: '镜像大小', prop: 'sizeText' },
  { label: '创建时间', prop: 'createDate' },
  { label: '来源', prop: 'originAddress' },
  { label: '描述', prop: 'description' },
  { label: '操作系统类型', prop: 'osType' },
  { label: '架构类型', prop: 'architecture' }
])


// 标签页组件
const tabs: any = { shareProject, tag }
// tabs标签页
const tabControllers = ref([
  { label: '共享项目', name: 'shareProject' },
  { label: '标签', name: 'tag' }
])
const activeName = ref('shareProject')
</script>

<style scoped lang="scss">
.detail {
  box-sizing: border-box;
  .detail-header {
    width: calc(100% - 40px);
    background-color: white;
    padding: 20px;
  }
  .detail-tab {
    width: calc(100% - 40px);
    background-color: white;
    padding: 0 20px;
    margin-top: 20px;
  }
}
</style>
