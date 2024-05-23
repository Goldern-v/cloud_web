<template>
  <div class="router-specification-create">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-card>
        <el-form-item>
          <div class="flex-row ideal-header-container">
            <el-divider direction="vertical" />
            <div>资源信息</div>
          </div>
        </el-form-item>

        <ideal-region-project
          class="region-input"
          @selectRegion="selectRegion"
          @selectProject="selectProject"
        ></ideal-region-project>

        <el-form-item>
          <div class="flex-row ideal-header-container">
            <el-divider direction="vertical" />
            <div>配置信息</div>
          </div>
        </el-form-item>

        <el-form-item label="名称" prop="name">
          <el-input
            v-model="form.name"
            class="custom-input"
            show-word-limit
            maxlength="32"
          ></el-input>
          <el-tooltip placement="right">
            <template #content>
              {{ vmwarePrompt.MAZ_MIDDLE_NAME }}
            </template>
            <svg-icon
              icon="question-icon"
              class="ideal-svg-margin-left"
            ></svg-icon>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="简介" prop="desc">
          <el-input
            v-model="form.desc"
            class="custom-input"
            :rows="4"
            type="textarea"
            show-word-limit
            maxlength="128"
          ></el-input>
          <el-tooltip placement="right">
            <template #content>{{ vmwarePrompt.DESC }}</template>
            <svg-icon
              icon="question-icon"
              class="ideal-svg-margin-left"
            ></svg-icon>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="DNS">
          <el-input v-model="form.dns" class="custom-input" />
          <el-tooltip
            content="用于设置VPC路由器的DNS解析服务，例如，IPv4指定223.5.5.5；IPv6指定240C::6644。"
            placement="right"
          >
            <svg-icon
              icon="question-icon"
              class="ideal-svg-margin-left"
            ></svg-icon>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="路由器规格" prop="listener">
          <div v-if="defaultConfig?.tags?.length === 0" class="selectBtn">
            <el-button
              style="width: 100%; height: 100%; color: black"
              type="text"
              >选择路由器规格</el-button
            >
          </div>
          <div v-else>
            <el-tag
              v-for="tag in defaultConfig.tags"
              :key="tag.name"
              closable
              :disable-transitions="false"
              :type="tag.type"
              @close="handleClose(tag)"
              >{{ tag.name }}</el-tag
            >
          </div>
        </el-form-item>
      </el-card>
    </el-form>
    <footer-submit> </footer-submit>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import dialogBox from './dialog-box.vue'
import type { FormRules, FormInstance } from 'element-plus'
import { vmwarePrompt } from '@/utils/prompt'
import footerSubmit from './components/footer-submit.vue'
import { OperateEventEnum } from '@/utils/enum'

const formRef = ref<FormInstance>()

const form = reactive({
  regionName: '',
  regionId: '',
  projectId: '',
  name: '',
  desc: '',
  cpu: '',
  mem: '',
  dns: ''
})

const rules = reactive<FormRules>({})

interface IHooksBasic {
  imgList?: any[]
  imageFlag?: boolean
  manageFlag?: boolean
  publicFlag?: boolean
  manageList?: any[]
  publicList?: any[]
  tags?: any[]
}
const defaultConfig: IHooksBasic = reactive({
  imgList: [],
  imageFlag: false,
  manageFlag: false,
  publicFlag: false,
  manageList: [],
  publicList: [],
  tags: []
})

const selectRegion = (regionInfo: any) => {
  form.regionName = regionInfo.cnName
  form.regionId = regionInfo.id
}

const selectProject = (projectInfo: any) => {
  form.projectId = projectInfo.id
}

const handleClose = (tag: any) => {
  defaultConfig.tags?.splice(defaultConfig.tags.indexOf(tag), 1)
}
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  if (dialogType.value === 'resourcePool') {
  } else {
    // getDataList()
  }
}
</script>

<style scoped lang="scss">
.router-specification-create {
  box-sizing: border-box;
  margin: $idealMargin $idealMargin 80px;
  .custom-input {
    width: 20%;
  }
  .ideal-header-container {
    width: 100%;
  }
  :deep(.el-divider--vertical) {
    border-left: 2px var(--el-color-primary) solid;
  }
  :deep .region-input {
    .el-select {
      width: 20%;
    }
  }
}
</style>
