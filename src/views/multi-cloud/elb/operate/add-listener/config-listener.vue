<template>
  <div class="listener">
    <el-form
      ref="basicInfoRef"
      :model="basicInfo"
      :rules="rules"
      label-position="left"
    >
      <el-card>
        <el-form-item label="名称" prop="name">
          <div class="flex-column">
            <el-input
              v-model.trim="basicInfo.name"
              placeholder="请输入名称"
              class="custom-input"
            />
          </div>
        </el-form-item>

        <el-form-item label="前端协议" prop="protocol">
          <div class="flex-column">
            <div class="ideal-tip-text">
              客户端与负载均衡监听器建立流量分发连接。四层监听请选择TCP、UDP;七层监听请选择HTTP、HTTPS.
            </div>
            <el-radio-group
              v-model="basicInfo.protocol"
              @change="protocolChange"
            >
              <el-radio-button
                v-for="(item, index) of protocolList"
                :key="index"
                :label="item"
              ></el-radio-button>
            </el-radio-group>
            <div class="ideal-tip-text">
              四层弹性负载均衡不支持分析访问日志记录
            </div>
          </div>
        </el-form-item>

        <el-form-item label="前端端口" prop="port">
          <el-input
            v-model.trim="basicInfo.port"
            placeholder="请输入端口"
            class="custom-input ideal-default-margin-right"
          />
          <span class="ideal-tip-text">取值范国1~65535</span>
        </el-form-item>

        <el-form-item v-if="basicInfo.protocol === 'HTTP'" label="重定向">
          <el-switch v-model="basicInfo.redirect"></el-switch>
          <el-tooltip
            popper-class="custom-tooltip"
            effect="dark"
            content=""
            placement="right"
          >
            <svg-icon
              icon="question-icon"
              class="ideal-svg-margin-left"
            ></svg-icon>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="访问控制">
          <el-select v-model="basicInfo.accessControl" class="ideal-default-margin-right">
            <el-option
              v-for="(item, index) in controlList"
              :key="index"
            ></el-option>
          </el-select>
          <el-tooltip
            popper-class="custom-tooltip"
            effect="dark"
            content=""
            placement="right"
          >
            <svg-icon icon="question-icon"></svg-icon>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="获取客户端IP">
          <div class="flex-column">
            <span>
              <el-switch v-model="basicInfo.clientIp" class="ideal-default-margin-right"></el-switch>
              <el-tooltip
                popper-class="custom-tooltip"
                effect="dark"
                content=""
                placement="right"
              >
                <svg-icon icon="question-icon"></svg-icon>
              </el-tooltip>
            </span>
            <div class="ideal-tip-text">
              开启【获取客户端IP】
              之后，不支持同空闲超时时间(秒)300服务器既作为后端服务器又作为客户端的场景
            </div>
          </div>
        </el-form-item>

        <el-divider border-style="dashed" />

        <el-form-item>
          <template #label>
            高级配置
            <svg-icon icon="edit-pen" class="ideal-svg-margin-left"></svg-icon>
          </template>
          <ideal-detail-info
            :label-array="configList"
            label-position="left"
            :show-colon="false"
            :detail-info="detailInfo"
            class="basic-info"
          >
          </ideal-detail-info>
        </el-form-item>
      </el-card>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { generateCode } from '@/utils/tool'

const basicInfo = reactive({
  name: 'listener-' + generateCode(4), // vpc名称
  protocol: 'TCP',
  port: '',
  accessControl: '',
  clientIp: false,
  redirect: false
})

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
})

const protocolList = ['TCP', 'UDP', 'HTTP', 'HTTPS']
const controlList: any = []

const arr = [
  { label: '空闲超时时间(秒)', prop: 'leisure' },
  { label: '描述', prop: 'description' }
]
const arr1 = [
  { label: '获取弹性公网IP', prop: 'eip' },
  { label: '空闲超时时间(秒)', prop: 'leisure' },
  { label: '请求超时时间(秒)', prop: 'request' },
  { label: '响应超时时间(秒)', prop: 'respond' },
  { label: '描述', prop: 'description' }
]

const configList: any = ref([])
onMounted(() => {
  configList.value = arr
})

const protocolChange = (val: string) => {
  configList.value = val === 'HTTP' ? arr1 : arr
}
const detailInfo = ref({
  eip: '未开启',
  leisure: '60',
  request: '60',
  respond: '60',
  description: '--'
})
</script>

<style scoped lang="scss">
.listener {
  width: 100%;
  :deep(.el-form) {
    padding: 0;
  }
  :deep(.ideal-detail-info) {
    padding: 0px;
    .ideal-detail-info-item {
      padding: 0px;
    }
  }
}
.custom-input {
  width: $formInputWidth;
}
</style>
