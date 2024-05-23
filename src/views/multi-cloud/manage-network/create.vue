<template>
  <div class="manage-network-create">
    <el-card>
      <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
        <el-form-item>
          <div class="flex-row ideal-header-container">
            <el-divider direction="vertical" />
            <div>基本信息</div>
          </div>
        </el-form-item>

        <el-form-item label="名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入名称"
            class="custom-input"
          />
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

        <el-form-item label="简介" prop="">
          <el-input
            v-model="form.name"
            placeholder="请输入名称"
            class="custom-input"
          />
        </el-form-item>

        <el-form-item label="二层网络" prop="layer2Network">
          <div v-if="defaultConfig.tags?.length === 0" class="selectBtn">
            <el-button plain @click="selectLayer2Network"
              >选择二层网络</el-button
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

        <el-form-item prop="netType">
          <template #label>
            网络段方式
            <el-tooltip
              placement="right"
              effect="dark"
              popper-class="tooltipContent"
            >
              <template #content>
                <div>
                  1、IP范围：可填写类似172.20.12.2到172.20.12.255，子网掩码填写255.255.0.0，网关填写172.20.0.1。
                </div>
                <div>2、CIDR：无类别域间路由，可填写192.168.1.0/24。</div>
                <div>注意：</div>
                <div>
                  不可将网关（例如：xxx.xxx.xxx.1）、广播地址（例如：xxx.xxx.xxx.255）和网络地址（例如：xxx.xxx.xxx.0）等包含在添加的IP段中。
                </div>
              </template>
              <svg-icon
                icon="question-icon"
                class="ideal-svg-margin-left"
              ></svg-icon>
            </el-tooltip>
          </template>
          <el-radio-group v-model="form.netType">
            <el-radio
              v-for="(item, index) in defaultConfig.netTypeList"
              :key="index"
              :label="item.label"
            >
              {{ item.name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <section v-if="form.netType === 'ipScope'">
          <el-form-item label="起始IP" prop="startIp">
            <el-tooltip content="示例：192.168.0.100" placement="top">
              <el-input v-model.trim="form.startIp" class="custom-input" />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="结束IP" prop="endIp">
            <el-tooltip content="示例：192.168.0.200" placement="top">
              <el-input v-model.trim="form.endIp" class="custom-input" />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="子网掩码" prop="subnetMask">
            <el-tooltip content="示例：255.255.255.0" placement="top">
              <el-input v-model.trim="form.subnetMask" class="custom-input" />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="网关" prop="ipGateway">
            <el-tooltip content="示例：192.168.0.1" placement="top">
              <el-input v-model.trim="form.ipGateway" class="custom-input" />
            </el-tooltip>
          </el-form-item>
        </section>

        <section v-if="form.netType === 'cidr'">
          <el-form-item label="CIDR" prop="cidr">
            <el-tooltip content="示例：192.168.1.0/24" placement="top">
              <el-input v-model.trim="form.cidr" class="custom-input" />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="网关" prop="cidrGateway">
            <el-tooltip content="示例：192.168.0.1" placement="top">
              <el-input v-model.trim="form.cidrGateway" class="custom-input" />
            </el-tooltip>
          </el-form-item>
        </section>
      </el-form>
    </el-card>

    <el-footer
      height="60px"
      :class="showSidebar ? 'submit-footer' : 'submit-footer-small'"
    >
      <div class="flex-row flex-row_right">
        <div>
          <el-button id="submit-btn" type="primary" @click="onClickCreate"
            >立即创建</el-button
          >
        </div>
      </div>
    </el-footer>

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
import { OperateEventEnum } from '@/utils/enum'
import { vmwarePrompt } from '@/utils/prompt'
import store from '@/store'

const showSidebar = computed(() => store.appStore.sidebarOpened)

const formRef = ref()

const form = reactive({
  name: '',
  description: '',
  layer2: '',
  netType: 'ipScope',
  startIp: '',
  endIp: '',
  subnetMask: '',
  ipGateway: '',
  cidr: '',
  cidrGateway: ''
})

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  layer2Network: [
    { required: true, message: '请选择二层网络', trigger: 'blur' }
  ],
  startIp: [{ required: true, message: '请选择二层网络', trigger: 'blur' }],
  endIp: [{ required: true, message: '请选择二层网络', trigger: 'blur' }],
  subnetMask: [{ required: true, message: '请选择二层网络', trigger: 'blur' }],
  ipGateway: [{ required: true, message: '请选择二层网络', trigger: 'blur' }],
  cidr: [{ required: true, message: '请输入cidr', trigger: 'blur' }],
  cidrGateway: [{ required: true, message: '请输入网关', trigger: 'blur' }]
})

interface IHooksBasic {
  tags?: any[]
  layer2NetworkName?: string
  netTypeList?: any[]
}
const defaultConfig: IHooksBasic = reactive({
  tags: [], //自动分配VLAN ID的状态
  layer2NetworkName: '',
  netTypeList: [
    { name: 'IP范围', label: 'ipScope' },
    { name: 'CIDR', label: 'cidr' }
  ]
})

const selectLayer2Network = () => {
  showDialog.value = true
  dialogType.value = 'selectLayer2'
}
const handleClose = (tag: string) => {
  defaultConfig.tags?.splice(defaultConfig.tags.indexOf(tag), 1)
  defaultConfig.layer2NetworkName = ''
}

const onClickCreate = () => {}

// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
}
</script>

<style scoped lang="scss">
.manage-network-create {
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
  .submit-footer,
  .submit-footer-small {
    position: fixed;
    width: calc(100% - $sidebarWidth);
    bottom: 0;
    left: $sidebarWidth;
    background: #fff;
    z-index: 2000;
    box-shadow: 5px 5px 17px 9px #e5e9ea;
    text-align: center;
    overflow: hidden;
    .flex-row_right {
      height: 60px;
      line-height: 60px;
      justify-content: flex-end;
    }
  }
  .submit-footer-small {
    width: calc(100% - $sidebarSmallWidth);
    left: $sidebarSmallWidth;
  }
}
</style>
