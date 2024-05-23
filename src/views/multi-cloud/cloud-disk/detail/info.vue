<template>
  <div class="info">
    <div class="info-item ideal-large-margin-top">
      <div>基本信息</div>
      <ideal-detail-info
        :label-array="basicArray"
        :item-number="2"
        :detail-info="detail"
        label-position="left"
        class="ideal-default-margin-top"
      >
        <template #id>
          <div class="flex-row" @mouseenter="mouseCopyIdEnter" @mouseleave="mouseCopyIdLeave">
            <div>{{ detail.uuid }}</div>
            <svg-icon v-if="showCopyId" icon="copy-icon" class="ideal-svg-margin-left" @click="clickCopy(detail.uuid)"></svg-icon>
          </div>
        </template>

        <template #name>
          <div v-if="!editName" class="flex-row" @mouseenter="mouseEditNameEnter" @mouseleave="mouseEditNameLeave">
            <div>{{ detail.name }}</div>
            <svg-icon v-if="showEditName" icon="edit-pen" class="ideal-svg-margin-left" @click="clickEditName"/>
          </div>
          <div v-else class="flex-row" style="align-items: center;">
            <el-input v-model="newName" style="width: 210px;"/>
            <svg-icon icon="circle-tick" class="ideal-svg-margin-left" class-name="circle-tick" @click="clickNameSubmit"/>
            <svg-icon icon="circle-close" class="ideal-svg-margin-left" class-name="circle-close" @click="clickNameCancel"/>
          </div>
        </template>
      </ideal-detail-info>
    </div>

    <div class="info-item ideal-large-margin-top">
      <div>配置信息</div>
      <ideal-detail-info
        :label-array="configArray"
        :item-number="2"
        :detail-info="detail"
        label-position="left"
        class="ideal-default-margin-top"
      ></ideal-detail-info>
    </div>

    <div class="info-item ideal-large-margin-top">
      <div>计费信息</div>
      <ideal-detail-info
        :label-array="billingArray"
        :item-number="2"
        :detail-info="detail"
        label-position="left"
        class="ideal-default-margin-top"
      ></ideal-detail-info>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { clickCopy } from '@/utils/tool'
import { BillingEnum } from '@/utils/enum'
import { cloudDiskRename } from '@/api/java/store'

interface InfoProps {
  detail?: any
}
const props = withDefaults(defineProps<InfoProps>(), {
  detail: () => ({})
})

const route = useRoute()
const id = route.query.id

watch(() => props.detail, value => {
  if (value) {
    if (value.billType === BillingEnum.PACKAGE) {
      billingArray.value.push({ label: '到期时间', prop: 'expiredTime' })
    }
  }
})

// 鼠标移入移出显示复制图标
const showCopyId = ref(false)
const mouseCopyIdEnter = () => {
  showCopyId.value = true
}
const mouseCopyIdLeave = () => {
  showCopyId.value = false
}
// 鼠标移入移出显示编辑图标
const showEditName = ref(false)
const mouseEditNameEnter = () => {
  showEditName.value = true
}
const mouseEditNameLeave = () => {
  showEditName.value = false
}
// 名称
const editName = ref(false)
const newName = ref('')
const clickEditName = () => {
  editName.value = true
  showEditName.value = false
  newName.value = props.detail?.name
}
const clickNameSubmit = () => {
  if (!newName.value) { return }
  editName.value = false
  const param = {
    id,
    name: newName.value,
    regionId: props.detail.regionId,
    resourcePoolId: props.detail.resourcePoolId,
    projectId: props.detail.projectId
  }
  cloudDiskRename(param).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('名称修改成功')
      showEditName.value = false
      emit('clickRefreshDetail')
    } else {
      ElMessage.error('名称修改失败')
    }
  })
}
const clickNameCancel = () => {
  editName.value = false
}

// 基本信息
const basicArray = ref([
  { label: 'ID', prop: 'id', useSlot: true },
  { label: '名称', prop: 'name', useSlot: true },
  { label: '区域', prop: 'regionName' },
  { label: '可用区', prop: 'availableZone' },
  { label: '磁盘类型', prop: 'volumeTypeName' },
  { label: '容量(GiB)', prop: 'size' },
  { label: '磁盘属性', prop: 'diskAttribute' },
  { label: '创建时间', prop: 'createDate' }
])
// 配置信息
const configArray = ref([
  { label: '共享盘', prop: 'shareableStr' },
  { label: '磁盘模式', prop: 'volumeMode' },
  { label: '加密', prop: 'encryptedStr' }
])
// 计费信息
const billingArray = ref([
  { label: '计费模式', prop: 'billingMode' }
])

// 方法
interface EventEmits {
  (e: 'clickRefreshDetail'): void
}
const emit = defineEmits<EventEmits>()
</script>

<style scoped lang="scss">
.info {
  width: 100%;
  .info-item {
    background-color: white;
    border-radius: $circleRadiusSize;
    padding: $idealPadding;
  }
  :deep(.circle-tick) {
    fill: $success4-light;
  }
  :deep(.circle-close) {
    fill: $error4-light;
  }
}
</style>
