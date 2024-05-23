<template>
  <div class="script">
    <div v-if="isInstall">
      <div>
        请使用平台管理员权限的用户在主机中执行以下脚本，安装云网关的代理
      </div>
      <el-input
        v-model="scriptStr"
        type="textarea"
        autosize
        disabled
      ></el-input>
    </div>

    <div v-else-if="isUpgrade">
      <div>
        请使用平台管理员权限的用户，在安装该云网关的主机中执行以下脚本，进行升级。升级前，请确保没有通过该云网关转发和执行的云资源部署或运维任务，否则这些任务将执行失败。升级完成后，云网关将自动连接平台并更新版本和状态，您可在列表中进行查看。
      </div>
      <el-input
        v-model="scriptStr"
        type="textarea"
        autosize
        disabled
      ></el-input>
    </div>

    <div class="flex-row script-footer">
      <el-button type="primary" @click="cancelForm">取消</el-button>
      <el-button type="primary" @click="submitForm">复制脚本</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus/es'
import { OperateEventEnum, EventEnum } from '@/utils/enum'
import { clickCopy } from '@/utils/tool'

// 属性值
interface DialogProps {
  type: OperateEventEnum | undefined // 操作按钮类型
}
const props = withDefaults(defineProps<DialogProps>(), {})

const isInstall = computed(() => props.type === OperateEventEnum.install)
const isUpgrade = computed(() => props.type === OperateEventEnum.upgrade)

const scriptStr = computed(() => {
  let str = ''
  if (props.type === OperateEventEnum.install) {
    str =
      'export INSTALL_PATH=/usr/local/src CONTROLLER_URL=https://console.smartcmp.cloud CLIENT_KEY=9d50e4ab12ae4c95b1b7ca1f04f35cc0;mkdir -p $INSTALL_PATH;cd $INSTALL_PATH;curl -LO https://mirrors-cloudchef.oss-cn-shanghai.aliyuncs.com/software/gateway/gateway.tar.gz;tar -zxf gateway.tar.gz;cd $INSTALL_PATH/gateway;/bin/sh cloud_gateway _install.sh -p $INSTALL_PATH -c $CONTROLLER_URL -k $CLIENT_KEY'
  } else if (props.type === OperateEventEnum.upgrade) {
    str =
      'export INSTALL_PATH=/usr/local/src CONTROLLER_URL=https://console.smartcmp.cloud CLIENT_KEY=9d50e4ab12ae4c95b1b7ca1f04f35cc0;mkdir -p $INSTALL_PATH;cd $INSTALL_PATH;curl -LO https://mirrors-cloudchef.oss-cn-shanghai.aliyuncs.com/software/gateway/gateway.tar.gz;tar -zxf gateway.tar.gz;cd $INSTALL_PATH/gateway;/bin/sh cloud_gateway_install.sh -p $INSTALL_PATH -c $CONTROLLER_URL -k $CLIENT_KEY'
  }
  return str
})

interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const cancelForm = () => {
  emit(EventEnum.cancel)
}

const submitForm = () => {
  clickCopy(scriptStr.value)
}
</script>

<style scoped lang="scss">
.script {
  width: calc(100% - 40px);
  padding: 20px;
  .script-footer {
    justify-content: flex-end;
    align-items: center;
    margin-top: 10px;
  }
}
</style>
