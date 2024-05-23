<template>
  <div>
    <el-form
      ref="resourceFormRef"
      :model="resourceForm"
      :rules="rules"
      label-position="left"
    >
      <el-card>
        <el-form-item>
          <div class="flex-row ideal-header-container">
            <el-divider direction="vertical" />
            <div>资源信息</div>
          </div>
        </el-form-item>

        <el-form-item label="名称" prop="name">
          <el-input
            v-model.trim="resourceForm.name"
            placeholder="输入内容不能为空"
            show-word-limit
            maxlength="32"
            class="custom-input"
          ></el-input>
          <el-tooltip placement="right">
            <svg-icon
              icon="question-icon"
              class="ideal-svg-margin-left"
            ></svg-icon>
            <template #content>
              <!-- <div
                slot="content"
                style="line-height: 25px"
                v-if="networkType === 'flatNetwork'"
              >
                1、云主机使用的私有网络，用于创建云主机，一般为内网。
                <br />2、云主机可使用扁平网络提供的分布式 EIP 访问公有网络。
                <br />3、如果使用扁平网络，此网络可与物理机网络直通，也可直接访问互联网。
                <br />4、{{ vmwarePrompt.MAZ_MIDDLE_NAME }}
              </div> -->
              <div style="line-height: 25px">
                <!-- v-if="networkType === 'publicNetwork'" -->
                1、一般表示可直接连通互联网的网络。
                <br />2、在 VPC 中可以提供网络服务。
                <br />3、可用于扁平网络创建使用公网的云主机。 <br />4、 可用于
                VPC 环境，单独创建使用公网的云主机。 <br />5、{{
                  vmwarePrompt.MAZ_MIDDLE_NAME
                }}
              </div>
            </template>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="简介" prop="description">
          <el-input
            v-model.trim="resourceForm.description"
            placeholder=""
            type="textarea"
            show-word-limit
            maxlength="128"
            class="custom-input"
          ></el-input>
          <el-tooltip placement="right">
            <svg-icon
              icon="question-icon"
              class="ideal-svg-margin-left"
            ></svg-icon>
            <template #content
              ><div>{{ vmwarePrompt.DESC }}</div></template
            >
          </el-tooltip>
        </el-form-item>
        <el-form-item label="二层网络" required prop="layer2">
          <el-button v-if="!resourceForm.layer2" plain @click="selectLayer2"
            >选择二层网络</el-button
          >
          <el-tag
            v-else
            type="info"
            closable
            @close="() => (resourceForm.layer2 = '')"
            >{{ layer2Name }}</el-tag
          >
        </el-form-item>
      </el-card>
    </el-form>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { OperateEventEnum, FiltrateEnum } from '@/utils/enum'
import { vmwarePrompt } from '@/utils/prompt'
import dialogBox from '../dialog-box.vue'
const resourceForm = reactive({
  name: '',
  description: '',
  layer2: ''
})

const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 2, max: 32, message: '长度为2~32个字符', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9-_.]{2,32}$/,
      message: vmwarePrompt.MAZ_MIDDLE_NAME,
      trigger: 'blur'
    }
  ]
})

const layer2Name = ref('')

const selectLayer2 = () => {
  showDialog.value = true
  dialogType.value = 'selectLayer2'
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
  }
}
</script>

<style scoped lang="scss">
.custom-input {
  width: 20%;
}
.ideal-header-container {
  width: 100%;
}
:deep(.el-divider--vertical) {
  border-left: 2px var(--el-color-primary) solid;
}
</style>
