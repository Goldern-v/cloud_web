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
        <el-form-item label="CPU" prop="cpu">
          <el-input-number
            v-model="form.cpu"
            :controls="false"
            :min="1"
          ></el-input-number>
          <span class="ideal-default-text" style="margin-left: 5px">核</span>
        </el-form-item>
        <el-form-item label="内存" prop="mem">
          <el-input-number
            v-model="form.mem"
            :controls="false"
            :min="1"
          ></el-input-number>
          <span class="ideal-default-text" style="margin-left: 5px">GB</span>
        </el-form-item>
        <el-form-item label="镜像" prop="image">
          <!-- <el-input class="custom-input" v-model="form.image"></el-input> -->
          <el-button
            v-if="!defaultConfig.imageFlag"
            class="marginL"
            @click="getImageList"
            >请选择镜像</el-button
          >
          <template v-if="defaultConfig.imageFlag">
            <el-tag
              v-for="tag in defaultConfig.imgList"
              :key="tag.name"
              class="marginL"
              closable
              @close="imgClose"
            >
              {{ tag.name }}
            </el-tag>
          </template>
        </el-form-item>
        <el-form-item label="管理网络" prop="manage">
          <!-- <el-input class="custom-input" v-model="form.manage"></el-input> -->
          <el-button
            v-if="!defaultConfig.manageFlag"
            class="marginL"
            :disabled="!defaultConfig.imageFlag"
            @click="getManageList"
            >请选择管理网络</el-button
          >
          <template v-if="defaultConfig.manageFlag">
            <el-tag
              v-for="tag in defaultConfig.manageList"
              :key="tag.name"
              class="marginL"
              closable
              @close="manageClose"
            >
              {{ tag.name }}
            </el-tag>
          </template>
        </el-form-item>
        <el-form-item label="公有网络" prop="public">
          <!-- <el-input class="marginL" v-model="form.public"></el-input> -->
          <el-button
            v-if="!defaultConfig.publicFlag"
            class="marginL"
            :disabled="!defaultConfig.imageFlag"
            @click="getPublicList"
            >请选择公有网络</el-button
          >
          <template v-if="defaultConfig.publicFlag">
            <el-tag
              v-for="tag in defaultConfig.publicList"
              :key="tag.name"
              class="marginL"
              closable
              @close="publicClose"
            >
              {{ tag.name }}
            </el-tag>
          </template>
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
  mem: ''
})

const rules = reactive<FormRules>({})

interface IHooksBasic {
  imgList?: any[]
  imageFlag?: boolean
  manageFlag?: boolean
  publicFlag?: boolean
  manageList?: any[]
  publicList?: any[]
}
const defaultConfig: IHooksBasic = reactive({
  imgList: [],
  imageFlag: false,
  manageFlag: false,
  publicFlag: false,
  manageList: [],
  publicList: []
})

const selectRegion = (regionInfo: any) => {
  form.regionName = regionInfo.cnName
  form.regionId = regionInfo.id
}

const selectProject = (projectInfo: any) => {
  form.projectId = projectInfo.id
}
//查询镜像列表
const getImageList = () => {
  showDialog.value = true
  dialogType.value = 'selectRouterImage'
}

const imgClose = () => {}

//查询管理网络列表
const getManageList = () => {}
const manageClose = () => {}

//查询管理网络列表
const getPublicList = () => {}
const publicClose = () => {}

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
