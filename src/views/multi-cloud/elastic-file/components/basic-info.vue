<template>
  <div class="basic-info">
    <ideal-detail-info
      :label-array="labelArray"
      :detail-info="detailInfo"
    >
      <template #name>
        <div class="flex-row basic-info-label">
          <template v-if="!nameEdit">
            <div>{{ detailInfo.name }}</div>
            <svg-icon icon="edit-pen" class="ideal-svg-margin-left" @click="clickNameEdit"/>
          </template>
          
          <template v-else>
            <el-input v-model="nameStr" style="width: 150px;"/>
            <svg-icon icon="check" class-name="check-svg" class="ideal-svg-margin-left" @click="clickNameEdit"/>
          </template>
        </div>
      </template>

      <template #sharePath>
        <div class="flex-row">
          <div>{{ detailInfo.sharePath }}</div>
          <svg-icon icon="copy-icon" class="ideal-svg-margin-left" @click="clickCopy(detailInfo.sharePath)"/>
        </div>
      </template>

      <template #uuid>
        <div class="flex-row">
          <div>{{ detailInfo.uuid }}</div>
          <svg-icon icon="copy-icon" class="ideal-svg-margin-left" @click="clickCopy(detailInfo.uuid)"/>
        </div>
      </template>

      <template #optionalSharePath>
        <div class="flex-row">
          <div>{{ detailInfo.optionalSharePath }}</div>
          <svg-icon icon="copy-icon" class="ideal-svg-margin-left" @click="clickCopy(detailInfo.optionalSharePath)"/>
        </div>
      </template>

      <template #vpc>
        <div class="ideal-theme-text">{{ detailInfo.vpc }}</div>
      </template>

      <template #subnet>
        <div class="ideal-theme-text">{{ detailInfo.subnet }}</div>
      </template>

      <template #safeGroup>
        <div class="flex-row basic-info-label">
          <template v-if="!safeGroupEdit">
            <div class="ideal-theme-text">{{ detailInfo.safeGroup }}</div>
            <svg-icon icon="edit-pen" class="ideal-svg-margin-left" @click="clickSafeGroupEdit"/>
          </template>
          
          <template v-else>
            <el-input v-model="safeGroupStr" style="width: 150px;"/>
            <svg-icon icon="check" class-name="check-svg" class="ideal-svg-margin-left" @click="clickSafeGroupEdit"/>
          </template>
        </div>
      </template>

      <template #mount>
        <div class="flex-row">
          <div class="ideal-tip-text">Linux挂载命令：</div>
          <div class="flex-row" style="align-items: flex-end;">
            <span>{{ detailInfo.mount }}</span>
            <svg-icon icon="copy-icon" class="ideal-svg-margin-left" @click="clickCopy(detailInfo.mount)"/>
          </div>
        </div>
      </template>
    </ideal-detail-info>
  </div>
</template>

<script setup lang="ts">
import { clickCopy } from '@/utils/tool'

const labelArray = ref([
  { label: '名称', prop: 'name', useSlot: true },
  { label: '共享路径', prop: 'sharePath', useSlot: true },
  { label: 'ID', prop: 'uuid', useSlot: true },
  { label: '可选共享路径', prop: 'optionalSharePath', useSlot: true },
  { label: '已用容量(GB)', prop: 'usedSize' },
  { label: '状态', prop: 'status' },
  { label: '总容量(GB)', prop: 'allSize' },
  { label: '文件系统类型', prop: 'fileType' },
  { label: '创建时间', prop: 'createTime' },
  { label: '计费模式', prop: 'billingMode' },
  { label: '区域', prop: 'area' },
  { label: '可用区', prop: 'availableArea' },
  { label: '虚拟私有云', prop: 'vpc', useSlot: true },
  { label: '子网', prop: 'subnet', useSlot: true },
  { label: '安全组', prop: 'safeGroup', useSlot: true },
  { label: '是否加密', prop: 'encrypt' },
  { label: '挂载命令', prop: 'mount', useSlot: true }
])
const detailInfo = ref({
  name: 'sfs-turbo-21f5',
  sharePath: 'path',
  uuid: 'af31e219-0c41-39b1-09af218e',
  optionalSharePath: '192.168.0.86 192.168.0.246 192.168.0.98',
  usedSize: '0.00',
  status: '可用',
  allSize: '3686.00',
  fileType: '20MB/s/TiB',
  createTime: '2023-11-20 15:30:21',
  billingMode: '按需计费',
  area: '上海一',
  availableArea: '可用区1',
  vpc: 'vpc-default',
  subnet: 'subnet-default(192.168.0.0/24)',
  safeGroup: 'default',
  encrypt: '否',
  mount: 'mount -t nfs -o overs=3,no lock 1643eba2-98fb-932a-1e59bf2a'
})
const nameEdit = ref(false)
const nameStr = ref('')
const clickNameEdit = () => {
  nameEdit.value = !nameEdit.value
}
const safeGroupEdit = ref(false)
const safeGroupStr = ref('')
const clickSafeGroupEdit = () => {
  safeGroupEdit.value = !safeGroupEdit.value
}
</script>

<style scoped lang="scss">
.basic-info {
  background-color: white;
  padding: $idealPadding 0;
  .basic-info-label {
    align-items: center;
  }
  :deep(.check-svg) {
    color: $successColor;
  }
}
</style>
