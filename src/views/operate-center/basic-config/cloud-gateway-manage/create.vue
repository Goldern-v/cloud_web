<template>
  <div class="cloud-gateway-manage__create">
    <el-steps :active="stepIndex">
      <el-step
        v-for="(item, index) of stepList"
        :key="index"
        :title="item.title"
      >
        <template #icon>
          <svg-icon v-if="index + 1 === stepIndex" icon="dot-solid"></svg-icon>
          <svg-icon v-else icon="dot-empty"></svg-icon>
        </template>
      </el-step>
    </el-steps>

    <div v-if="stepIndex === 1" class="cloud-gateway-manage__padding">
      <div class="flex-row cloud-gateway-manage__warning-tip">
        <svg-icon icon="info-warning" color="var(--el-color-primary)" class="ideal-svg-margin-right"></svg-icon>
        <span
          >您可以为每个网络隔离的数据中心、VPC或远程站点部署一个云网关。只需选择一台满足以下条件的主机，安装云网关代理：</span
        >
      </div>

      <el-divider />

      <div class="cloud-gateway-manage__title-item">
        1.该主机和其它您需要管理的内网主机在同一个网络内，能够互相连接；
      </div>
      <div class="cloud-gateway-manage__title-item">
        2.该主机需为Linux操作系统，建议使用CentOS或RHEL 7.x版本；
      </div>
      <div class="cloud-gateway-manage__title-item">
        3.该主机建议至少配置2核CPU和4GB内存，并且为云网关安装目录（默认为/usr/local/src）预留至少10GB空闲磁盘空间;
      </div>
      <div class="cloud-gateway-manage__title-item">
        4.该主机不需要配置公网IP，但需要能够访问公网。
      </div>
    </div>

    <div v-if="stepIndex === 2" class="cloud-gateway-manage__padding">
      <div class="flex-row cloud-gateway-manage__warning-tip">
        <svg-icon icon="info-warning" color="var(--el-color-primary)" class="ideal-svg-margin-right"></svg-icon>
        <span
          >请输入该云网关的名称和描述，以便进行标识。同时，请根据云网关所在地点或区域，选择适合的标签（平台会根据标签，选择合适的网络中转节点转发网络流量）。</span
        >
      </div>

      <el-divider />

      <el-form
        ref="createFormRef"
        :model="createForm"
        :rules="rules"
        label-position="left"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="createForm.name"></el-input>
        </el-form-item>

        <el-form-item label="描述">
          <el-input v-model="createForm.description" type="textarea"></el-input>
        </el-form-item>

        <el-form-item label="标签">
          <el-select
            v-model="createForm.tags"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, idx) of tagsList"
              :key="idx"
              :label="item.otherName"
              :value="item.otherId"
            >
              {{ item.otherName }}
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <div v-if="stepIndex === 3" class="cloud-gateway-manage__padding">
      <div class="flex-row cloud-gateway-manage__warning-tip">
        <svg-icon icon="info-warning" color="var(--el-color-primary)" class="ideal-svg-margin-right"></svg-icon>
        <span
          >请使用root或具有sudo权限的用户在主机中执行以下脚本，安装云网关的代理。</span
        >
      </div>

      <el-divider />

      <div class="cloud-gateway-manage__script">{{ scriptStr }}</div>

      <el-button class="cloud-gateway-manage__copy" @click="handleCopy"
        >复制脚本</el-button
      >
    </div>

    <div
      v-if="stepIndex === 4"
      class="flex-column cloud-gateway-manage__result cloud-gateway-manage__padding"
    >
      <svg-icon
        icon="success-icon"
        class-name="cloud-gateway-manage__success"
      ></svg-icon>
      <div>
        云网关代理安装成功后，将自动连接平台，您可在列表中查看连接状态。
      </div>
    </div>

    <div class="flex-row cloud-gateway-manage__footer">
      <el-button v-if="stepIndex === 1" @click="handleCancel">取消</el-button>
      <el-button v-else-if="stepIndex !== 1" @click="handlePrevious"
        >上一步</el-button
      >
      <el-button @click="handleNext">下一步</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus/es'
import type { FormRules, FormInstance } from 'element-plus'
import { clickCopy } from '@/utils/tool'

const stepIndex = ref(1)
const stepList = [
  { title: '安装前提条件', step: 0 },
  { title: '设置安装信息', step: 1 },
  { title: '下载安装脚本', step: 2 },
  { title: '等待连接结果', step: 3 }
]

const createFormRef = ref<FormInstance>()
const createForm = reactive({
  name: '',
  description: '',
  tags: ''
})
const rules = reactive<FormRules>({
  name: [
    {
      required: true,
      message: '请输入名称',
      trigger: 'blur'
    }
  ]
})
const tagsList: any = []
// 方法
// enum DialogEventEnum {
//   cancel = 'clickCancel',
//   previous = 'clickPrevious',
//   next = 'clickNext'
// }
// interface EventEmits {
//   (e: DialogEventEnum.cancel): void
//   (e: DialogEventEnum.previous): void
//   (e: DialogEventEnum.next): void
// }
// const emit = defineEmits<EventEmits>()

const handleCancel = () => {}
const handlePrevious = () => {
  if (stepIndex.value === 1) {
    return
  }
  stepIndex.value--
}
const handleNext = () => {
  if (stepIndex.value === 4) {
    return
  }
  stepIndex.value++
}
const scriptStr =
  'export INSTALL_PATH=/usr/local/src CONTROLLER_URL=https://console.smartcmp.cloud CLIENT_KEY=9d50e4ab12ae4c95b1b7ca1f04f35cc0;mkdir -p $INSTALL_PATH;cd $INSTALL_PATH;curl -LO https://mirrors-cloudchef.oss-cn-shanghai.aliyuncs.com/software/gateway/gateway.tar.gz;tar -zxf gateway.tar.gz;cd $INSTALL_PATH/gateway;/bin/sh cloud_gateway _install.sh -p $INSTALL_PATH -c $CONTROLLER_URL -k $CLIENT_KEY'
const handleCopy = () => {
  clickCopy(scriptStr)
}
</script>

<style scoped lang="scss">
.cloud-gateway-manage__create {
  width: 100%;
  .cloud-gateway-manage__padding {
    padding: 20px;
  }
  .cloud-gateway-manage__warning-tip {
    background-color: var(--custom-information-bg-color);
    padding: 20px;
    align-items: center;
  }
  .cloud-gateway-manage__script {
    padding: 10px;
    border: 1px solid $sub5-light;
    border-radius: $circleRadiusSize;
  }
  .cloud-gateway-manage__copy {
    margin: 10px 0;
  }
  .cloud-gateway-manage__title-item {
    margin: 10px 0;
  }
  .cloud-gateway-manage__footer {
    justify-content: flex-end;
    align-items: center;
    margin: 10px 0;
    padding: 10px 10px 10px 0;
    border-top: 1px solid $sub5-light;
  }
  .cloud-gateway-manage__result {
    align-items: center;
    justify-content: center;
    margin: 20px 0;
  }
  // 修改等待连接结果图标大小
  :deep(.cloud-gateway-manage__success) {
    width: 92px !important;
    height: 92px !important;
  }
  :deep(.el-input) {
    width: $formInputWidth;
  }
  :deep(.el-textarea__inner) {
    width: $formInputWidth;
  }
  :deep(.el-step__title.is-process) {
    font-weight: 400;
    color: var(--el-text-color-placeholder);
  }
  :deep(.el-step__head.is-process) {
    color: var(--el-text-color-placeholder);
  }
  :deep(.el-steps--horizontal) {
    padding: 10px 20px;
  }
  // svg图片颜色
  :deep(.svg-icon svg) {
    fill: var(--el-color-primary);
  }
}
</style>
