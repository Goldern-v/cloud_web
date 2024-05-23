<template>
  <div>
    <el-card class="ideal-large-margin-top">
      <el-form
        ref="configFormRef"
        :model="configForm"
        :rules="rules"
        label-position="left"
      >
        <el-form-item>
          <div class="flex-row ideal-header-container">
            <el-divider direction="vertical" />
            <div>配置信息</div>
          </div>
        </el-form-item>

        <el-form-item label="网络地址类型" prop="ipType">
          <el-radio-group v-model="configForm.ipType">
            <el-radio-button
              v-for="(item, index) in ['ipv4']"
              :key="index"
              :label="item"
            >
              {{ item }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="网络段方式" prop="networkMode">
          <el-radio-group v-model="configForm.networkMode">
            <el-radio
              v-for="(item, index) in [{ label: 'CIDR', value: 'cidr' }]"
              :key="index"
              :label="item.value"
              >{{ item.label }}</el-radio
            >
          </el-radio-group>
          <el-tooltip placement="right">
            <template #content>
              网络段方式 CIDR：无类别域间路由，可填写192.168.1.0/24。 注意：
              不可将网关（例如：xxx.xxx.xxx.1）、广播地址（例如：xxx.xxx.xxx.255）和网络地址（例如：xxx.xxx.xxx.0）等包含在添加的IP段中。
            </template>
            <svg-icon
              icon="question-icon"
              class="ideal-svg-margin-left"
            ></svg-icon>
          </el-tooltip>
        </el-form-item>

        <section v-if="configForm.networkMode === 'range'">
          <el-form-item label="起始IP" required prop="startIP">
            <el-input
              v-model.trim="configForm.startIP"
              placeholder=""
              class="custom-input"
            ></el-input>
            <el-tooltip placement="right" content="示例：192.168.0.100">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="结束IP" required prop="endIP">
            <el-input
              v-model.trim="configForm.endIP"
              placeholder=""
              class="custom-input"
            ></el-input>
          </el-form-item>
          <el-form-item label="子网掩码" required prop="subnetMask">
            <el-input
              v-model.trim="configForm.subnetMask"
              placeholder=""
              class="custom-input"
            ></el-input>
            <el-tooltip placement="right" content="示例：192.168.0.200">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="网关" required prop="gateWay">
            <el-input
              v-model.trim="configForm.gateWay"
              placeholder=""
              class="custom-input"
            ></el-input>
          </el-form-item>
        </section>

        <el-form-item
          v-if="configForm.networkMode === 'cidr'"
          label="CIDR"
          prop="cidr"
        >
          <el-input
            v-model.trim="configForm.cidr"
            placeholder="示例:192.168.1.0/24"
            class="custom-input"
          ></el-input>
          <el-tooltip placement="right" content="示例：192.168.1.0/24">
            <svg-icon
              icon="question-icon"
              class="ideal-svg-margin-left"
            ></svg-icon>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="网关" prop="gateWay">
          <el-input
            v-model.trim="configForm.gateWay"
            placeholder=""
            class="custom-input"
          ></el-input>
          <el-tooltip placement="right" content="示例：192.168.1.1">
            <svg-icon
              icon="question-icon"
              class="ideal-svg-margin-left"
            ></svg-icon>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="DHCP服务">
          <el-switch
            v-model="configForm.enableDhcp"
            disabled
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
          <el-tooltip placement="right">
            <template #content>
              <div>DHCP 服务</div>
              <div>
                1.DHCP服务是云平台内置的分布式服务，仅对云平台内部的云主机提供分配
                IP地址的服务，与用户已有的 DHCP 服务器不会产生冲突。
              </div>
              <div>
                2.默认启用DHCP服务，为云主机提供自动分配 IP，DHCP 服务
                IP支持自定义设置，也可由系统随机指定。
              </div>
              <div>
                3.关闭DHCP服务后，使用此网络的云主机将无法自动获取IP，需手动配置，此时
                DHCP 服务 IP不支持自定义设置，也不可由系统随机指定。
              </div>
            </template>
            <svg-icon
              icon="question-icon"
              class="ideal-svg-margin-left"
            ></svg-icon>
          </el-tooltip>
        </el-form-item>
        <el-form-item v-if="0" label="DHCP服务IP">
          <el-input
            v-model.trim="configForm.dhcp"
            placeholder=""
            class="custom-input"
          ></el-input>
          <el-tooltip placement="right">
            <template #content>
              <div>DHCP 服务 IP</div>
              <div>
                1.DHCP 服务 IP 是 DHCP 服务所占用的 IP，DHCP 服务将通过该 IP
                为该三层网络中的云主机分配 IP 地址；
              </div>
              <div>
                2.若首次创建三层网络并启用 DHCP 服务，或对已启用 DHCP
                服务的三层网络添加首个网络段，支持自定义设置 DHCP 服务 IP；
              </div>
              <div>
                3.若三层网络已存在 DHCP 服务 IP，添加网络段不允许自定义设置 DHCP
                服务 IP； 4.DHCP 服务 IP 可以在添加的 IP
                范围之内或之外，但必须在添加的 IP 范围所属的 CIDR
                内，且未被占用；
              </div>
            </template>
            <svg-icon
              icon="question-icon"
              class="ideal-svg-margin-left"
            ></svg-icon>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="DNS" prop="dns">
          <el-input
            v-model.trim="configForm.dns"
            placeholder="非必填，如果有值会校验正确格式"
            class="custom-input"
          ></el-input>
          <el-tooltip placement="right">
            <template #content>
              DNS 用于设置三层网络的 DNS 解析服务，例如，指定223.5.5.5。
            </template>
            <svg-icon
              icon="question-icon"
              class="ideal-svg-margin-left"
            ></svg-icon>
          </el-tooltip>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'

const configForm = reactive({
  ipType: 'ipv4',
  networkMode: 'cidr',
  startIP: '',
  endIP: '',
  subnetMask: '',
  cidr: '',
  gateWay: '',
  enableDhcp: '',
  dhcp: '',
  dns: ''
})

const rules = reactive<FormRules>({})
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
