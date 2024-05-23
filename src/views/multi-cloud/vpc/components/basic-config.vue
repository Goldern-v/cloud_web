<template>
  <div class="basic-config">
    <el-form
      ref="basicInfoRef"
      :model="basicInfo"
      :rules="rules"
      label-position="left"
    >
      <el-card>
        <el-form-item>
          <div class="flex-row ideal-header-container">
            <el-divider direction="vertical" />
            <div>基本信息</div>
          </div>
        </el-form-item>

        <ideal-region-project
          class="region-input"
          @selectRegion="selectRegion"
          @selectProject="selectProject"
        ></ideal-region-project>

        <el-form-item
          v-if="isPrivateHuawei"
          label="外部网络"
          prop="externalNetwork"
        >
          <el-select
            v-model="basicInfo.externalNetwork"
            placeholder="请选择外部网络"
            class="custom-input"
          >
            <el-option
              v-for="(item, index) of state.exNetList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="名称" prop="vpcName">
          <el-input
            v-model.trim="basicInfo.vpcName"
            placeholder="请输入名称"
            class="custom-input"
          />
        </el-form-item>

        <el-form-item label="IPv4网段">
          <div class="flex-column" style="width: 100%">
            <ideal-ip-input
              :ip-value="basicInfo.ipv4Cidr"
              port-split="/"
              :select-cidr="basicInfo.ipv4Cidr"
              @listenChange="ipv4ChangeEvent"
            ></ideal-ip-input>
            <div class="ideal-tip-text">
              建议使用网段:10.0.0.0/8-24
              <span @click="selectCidr(1)">( 选择 )</span>
              172.16.0.0/12-24
              <span @click="selectCidr(2)">( 选择 )</span>192.168.0.0/16-24
              <span @click="selectCidr(3)">( 选择 )</span>
            </div>
            <div class="flex-row custom-warning-box">
              <svg-icon
                icon="info-warning"
                color="var(--el-color-primary)"
              ></svg-icon>
              <span
                >该VPC网段 ({{ basicInfo.ipv4Cidr }})
                与当前区域下其他VPC网段重叠，如需使用VPC互通服务，建议您修改VPC网段。查看区域下已有vpc网段</span
              >
            </div>
          </div>
        </el-form-item>

        <el-divider border-style="dashed" />

        <el-form-item label="高级配置">
          <template #label>
            <div class="flex-row">
              <div>高级配置</div>
              <svg-icon
                v-if="!state.vpcHighConfig"
                icon="down-arrow"
                class="ideal-svg-margin-left"
                @click="state.vpcHighConfig = !state.vpcHighConfig"
              ></svg-icon>
              <svg-icon
                v-if="state.vpcHighConfig"
                icon="down-arrow"
                class="ideal-svg-margin-left"
                @click="state.vpcHighConfig = !state.vpcHighConfig"
              ></svg-icon>
            </div>
          </template>
          <div>标签 <span v-if="!isPrivateHuawei">｜ 描述</span></div>
        </el-form-item>
        <template v-if="state.vpcHighConfig">
          <el-form-item label="标签">
            <div class="flex-column" style="width: 20%">
              <ideal-tag-multiple-select>
                <!-- @selectTag="selectTag" -->
              </ideal-tag-multiple-select>
              <div class="ideal-tip-text">您可以至多添加10个标签</div>
            </div>
          </el-form-item>
          <el-form-item v-if="!isPrivateHuawei" label="描述">
            <el-input
              v-model="basicInfo.vpcDesc"
              type="textarea"
              class="custom-input"
            />
          </el-form-item>
        </template>
      </el-card>

      <subnet-config
        v-for="(item, index) in basicInfo.subnetFormData"
        :key="index"
        :subnet-item="item"
        :subnet-index="index"
        :available-zone-list="state.availableZoneList"
        @reduceSubnet="reduceSubnet"
        @subnetIp4vChange="subnetIp4vChange"
        @gatewayChange="gatewayChange"
      ></subnet-config>

      <el-card class="ideal-large-margin-top">
        <div class="flex-row custom-add-button" @click="addSUbnet">
          <svg-icon icon="circle-add" class="ideal-default-margin-right"></svg-icon>
          <el-button
            id="add-btn"
            :disabled="basicInfo.subnetFormData.length > 2"
            link
            >添加子网</el-button
          >
          <div
            v-if="basicInfo.subnetFormData.length > 2"
            class="ideal-warning-text ideal-default-margin-left"
          >
            一次最多添加三个子网
          </div>
        </div>
      </el-card>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import store from '@/store'
import { generateCode } from '@/utils/tool'
import { IHooksBasic } from './interface'
import subnetConfig from './subnet-config.vue'
import { useResourcePool } from '@/utils/common/resource'
import { queryExternalNetList } from '@/api/java/network'

const { isPrivateHuawei } = useResourcePool()
/**
 * 表单
 */
const basicInfoRef = ref<FormInstance>()
const basicInfo = reactive({
  regionId: '', // 区域id
  regionName: '', //区域名称
  projectId: '', // 资源归属(项目)
  cloudProjectId: '', //底层项目id
  externalNetwork: '', //外部网络
  vpcName: 'vpc-' + generateCode(4), // vpc名称
  ipv4Cidr: '192.168.0.0/16', // ipv4网段
  vpcDesc: '',
  tagIds: [], //标签
  subnetFormData: [
    {
      subnetName: 'subnet-' + generateCode(4),
      subnetIp4vCidr: '192.168.0.0/24',
      openIpv6: false,
      gateway: '192.168.0.1',
      availableZone: '',
      dnsServer: '', //DNS服务器地址
      subnetDesc: ''
    }
  ]
})

const rules = reactive<FormRules>({
  vpcName: [{ required: true, message: '请输入vpc名称', trigger: 'blur' }],
  availableZone: [{ required: true, message: '选择可用区', trigger: 'blur' }],
  subnetName: [{ required: true, message: '请输入子网名称', trigger: 'blur' }]
})

const basicConfig: IHooksBasic = {
  vpcHighConfig: false, //是否显示vpc高级配置
  regionInfo: {},
  tagNum: 10, //可添加标签数
  portOptions: [
    12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 29
  ], //可选择的端口
  exNetList: [] //外部网络列表
}
const state = reactive(basicConfig)

//获取区域信息
const selectRegion = (regionInfo: any) => {
  state.regionInfo = regionInfo
  basicInfo.regionName = regionInfo?.cnName
  basicInfo.regionId = regionInfo?.id
  state.availableZoneList = regionInfo.availableZones
  if (regionInfo.availableZones?.length) {
    basicInfo.subnetFormData[0].availableZone =
      regionInfo?.availableZones[0]?.code
  }
}
//获取项目信息
const selectProject = (projectInfo: any) => {
  basicInfo.projectId = projectInfo.id
  basicInfo.cloudProjectId = projectInfo.cloudProjectId
}
// ipv4网段改变事件
const ipv4ChangeEvent = (val: string) => {
  basicInfo.ipv4Cidr = val
}

watch(
  () => [basicInfo.regionId, basicInfo.projectId],
  ([region, project]) => {
    if (isPrivateHuawei.value && region && project) {
      getExternalNetList()
    }
  }
)
const { resourcePool } = store.resourceStore
//查询外部网络
const getExternalNetList = async () => {
  const res = await queryExternalNetList({
    resourcePoolId: resourcePool.resourcePoolId, //资源池id
    poolTypeUuid: resourcePool.cloudPlatformType, //资源池类型
    regionId: basicInfo.regionId,
    projectId: basicInfo.projectId,
    serviceType: 'Location' //Location vpc Internet eip
  })
  state.exNetList = res.data.networks
  basicInfo.externalNetwork = res.data.networks[0]?.id
}
/**
 * 多个子网
 */
//添加一条子网
const addSUbnet = () => {
  const target = document.getElementById('add-btn') as HTMLElement
  target.blur()
  const length = basicInfo.subnetFormData.length
  const arr = basicInfo.ipv4Cidr.split('.')
  basicInfo.subnetFormData.push({
    subnetName: 'subnet-' + generateCode(4),
    subnetIp4vCidr: `${arr[0]}.${arr[1]}.${length}.${arr[3].split('/')[0]}/24`,
    openIpv6: false,
    gateway: `${arr[0]}.${arr[1]}.${length}.1`,
    availableZone: state.availableZoneList[0]?.code,
    dnsServer: '', //DNS服务器地址
    subnetDesc: ''
  })
}
//删除一条子网
const reduceSubnet = (index: number) => {
  basicInfo.subnetFormData.splice(index, 1)
}
const subnetIp4vChange = (val: any, index: number) => {
  basicInfo.subnetFormData[index].subnetIp4vCidr = val
}
const gatewayChange = (val: any, index: number) => {
  basicInfo.subnetFormData[index].gateway = val
}

const cidr: any = {
  1: '10.0.0.0/8',
  2: '172.16.0.0/12',
  3: '192.168.0.0/16'
}
const selectCidr = (index: number) => {
  basicInfo.ipv4Cidr = cidr[index]
  const arr = basicInfo.ipv4Cidr.split('.')
  basicInfo.subnetFormData.forEach((item: any, idx: number) => {
    item.subnetIp4vCidr = `${arr[0]}.${arr[1]}.${idx}.${
      arr[3].split('/')[0]
    }/24`
    item.gateway = `${arr[0]}.${arr[1]}.${idx}.1`
  })
}

defineExpose({
  basicInfoRef,
  basicInfo
})
</script>

<style scoped lang="scss">
.basic-config {
  width: 100%;
  margin-bottom: 65px;
  :deep(.el-form) {
    padding: 0;
  }
  :deep .el-form-item--default .el-form-item__label {
    width: 120px;
  }
  .custom-warning-box {
    background-color: var(--custom-information-bg-color);
    padding: 5px 20px;
  }
  .custom-add-button {
    justify-content: flex-start;
    align-items: center;
  }
  .custom-input {
    width: 20%;
  }
  :deep .region-input {
    .el-select {
      width: 20%;
    }
  }
  .custom-input + .custom-input {
    margin-left: 10px;
  }
  .ideal-tip-text {
    span {
      color: var(--el-color-primary);
      margin-right: 10px;
      cursor: pointer;
    }
  }
  :deep(.el-divider--vertical) {
    border-left: 2px var(--el-color-primary) solid;
  }
  .ideal-header-container {
    width: 100%;
  }
}
</style>
<style lang="scss">
.basic-config__tooltip {
  width: 260px;
}
</style>
