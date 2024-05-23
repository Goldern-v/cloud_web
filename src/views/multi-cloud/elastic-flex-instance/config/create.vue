<template>
  <div class="ideal-large-margin create">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-card>
        <el-form-item label="计费模式" prop="billingMode">
          <el-radio-group v-model="form.billingMode">
            <el-radio-button label="onDemand">按需计费</el-radio-button>
          </el-radio-group>

          <el-tooltip
            popper-class="custom-tooltip"
            effect="dark"
            placement="right"
          >
            <template #content>
              <div>按需计费是后付费模式，按弹性云服务器的实际使用时长计费， 可以随时开通/删除弹性云服务器。</div>
            </template>
            <svg-icon icon="question-icon" class="ideal-svg-margin-left"/>
          </el-tooltip>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="区域" prop="regionName">
          <div>
            <div>{{ form.regionName }}</div>
            <div class="ideal-tip-text">不同区域的云服务产品之间内网互不相通；请就近选择靠近您业务的区域，可减少网络时延，提高访问速度。</div>
          </div>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="名称" prop="name">
          <div>
            <el-input v-model="form.name"/>
            <div class="ideal-tip-text">使用该配置创建的云服务器名称为伸缩配置名称加八位随机码。</div>
          </div>
        </el-form-item>

        <el-form-item label="配置模板" prop="configTemplate">
          <div>
            <el-radio-group v-model="form.configTemplate">
              <el-radio-button label="new">使用新模版</el-radio-button>
              <el-radio-button label="already">使用已有云服务器规格为模版</el-radio-button>
            </el-radio-group>

            <div v-if="selectCase.existTemplate">
              <div class="flex-row">
                <div class="ideal-tip-text">使用已有的弹性云服务器快速创建相同规格的伸缩配置，</div>
                <div class="ideal-warning-text">请注意此时伸缩配置中镜像、磁盘均为原始状态，不携带当前云服务器创建后产生的任何数据。</div>
              </div>

              <el-button link type="primary" @click="clickSelectCloudHost">请选择云服务器</el-button>

              <ideal-detail-info
                v-if="isSelect"
                class="detail-info"
                :label-array="selectData.labelArray"
                :item-number="1"
                :detail-info="rowData"
                label-position="left"
              ></ideal-detail-info>
            </div>
          </div>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="CPU架构">
          <el-radio-group v-model="form.cpuArchitecture">
            <el-radio-button v-for="(item,index) of selectData.cpuArchitectures" :key="index" :label="item.label">{{ item.value }}</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="规格">
          <div>
            <select-spec />
            <el-form-item prop="spec">
              <ideal-table-list
                row-key="uuid"
                :loading="state.dataListLoading"
                :table-data="state.dataList"
                :table-headers="selectData.tableHeaders"
                :is-multiple="true"
                :show-pagination="false"
                @clickTableCellRow="clickTableCellRow"
                @handleSelectionChange="selectionChangeHandle">
                <template #vCPUs>
                  <el-table-column label="vCPUs" >
                    <template #default="props">
                      <div>{{ props.row.vcpus }}vCPUs | {{ props.row.memory }}GiB</div>
                    </template>
                  </el-table-column>
                </template>

                <template #standard>
                  <el-table-column label="基准/最大带宽" >
                    <template #default="props">
                      <div>{{ props.row.standard }}/{{ props.row.maxBandwidth }}Gbit/s</div>
                    </template>
                  </el-table-column>
                </template>
              </ideal-table-list>
            </el-form-item>
            <div class="ideal-tip-text">已选规格优先使用当前选中的规格进行伸缩，您可以点击已选规格查看规格信息。 您还可以选择10个规格。</div>
          </div>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="镜像" required>
          <div class="flex-column">
            <div class="flex-row">
              <el-form-item prop="mirrorType">
                <el-radio-group
                  v-model="form.mirrorType"
                  class="ideal-default-margin-right"
                >
                  <el-radio-button
                    v-for="(item, index) of selectData.mirrorTypeList"
                    :key="index"
                    :label="item.label"
                  >
                    {{ item.value }}
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
            </div>

            <div class="flex-row ideal-large-margin-top flex-row-start-center">
              <el-select
                v-if="selectCase.isPublicMirror"
                v-model="form.system"
                placeholder="请选择操作系统"
                class="ideal-default-margin-right"
              >
                <el-option
                  v-for="item of selectData.systemList"
                  :key="item.platform"
                  :label="item.platform"
                  :value="item.platform"
                />
              </el-select>

              <el-form-item prop="mirror">
                <el-select
                  v-model="form.mirror"
                  placeholder="请选择"
                  class="ideal-default-margin-right"
                >
                  <el-option
                    v-for="item of selectData.mirrorList"
                    :key="item.uuid"
                    :label="item.osVersion"
                    :value="item.uuid"
                  />
                </el-select>
              </el-form-item>

              <svg-icon
                icon="refresh-icon"
                style="cursor: pointer"
                @click="clickImageRefresh"
              ></svg-icon>
            </div>
          </div>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="磁盘" required>
          <div>
            <el-radio-group v-model="form.disk">
              <el-radio-button label="cloudDisk">云硬盘</el-radio-button>
            </el-radio-group>

            <div class="flex-row ideal-large-margin-top">
              <div class="ideal-default-margin-right">系统盘</div>
              <el-form-item prop="systemDisk">
                <el-select
                  v-model="form.systemDisk"
                  placeholder="请选择"
                  class="ideal-default-margin-right"
                >
                  <el-option
                    v-for="(item, index) of selectData.volumeTypeList"
                    :key="index"
                    :label="item.describe"
                    :value="item.type"
                  />
                </el-select>
              </el-form-item>

              <el-input-number
                v-model="form.systemDiskSize"
                :min="100"
                :max="1000"
              />
            </div>

            <div
              v-for="(item, index) of form.dataDisks"
              :key="index"
              class="flex-row ideal-large-margin-top"
            >
              <div class="ideal-default-margin-right">数据盘</div>
              <el-select
                v-model="item.type"
                placeholder="请选择"
                class="ideal-default-margin-right"
              >
                <el-option
                  v-for="(item, index) of selectData.volumeTypeList"
                  :key="index"
                  :label="item.describe"
                  :value="item.type"
                />
              </el-select>
              <el-input-number
                v-model="item.size"
                class="ideal-default-margin-right"
                :min="150"
                :max="1000"
              />
              <el-button
                link
                type="primary"
                @click="clickDeleteDataDisk(index)"
                >删除</el-button
              >
            </div>

            <div class="flex-row ideal-default-text ideal-large-margin-top">
              <el-button
                link
                type="primary"
                :disabled="!dataDiskQuota"
                @click="clickAddDataDisk"
                >+增加一块数据盘</el-button
              >
              <span>你还可以增加{{ dataDiskQuota }}块磁盘(云硬盘)</span>
            </div>
          </div>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="安全组">
          <div style="width:50%;">
            <div class="flex-row">
              <el-select
                v-model="form.safeGroup"
                multiple
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, index) of selectData.safeGroupies"
                  :key="index"
                  :label="`${item.name}(${item.enter} | ${item.exit})`"
                  :value="item.value"
                >
                  {{ item.name }}({{ item.enter }} | {{ item.exit }})
                </el-option>
              </el-select>
            </div>
            <div class="ideal-tip-text">安全组类似防火墙功能，是一个逻辑上的分组，用于设置网络访问控制。</div>
          </div>
        </el-form-item>

        <el-form-item label="弹性公网IP">
          <div class="flex-column">
            <div class="flex-row">
              <el-radio-group v-model="form.eipType">
                <el-radio-button label="noUse">不使用</el-radio-button>
                <el-radio-button label="auto">自动分配</el-radio-button>
              </el-radio-group>

              <el-tooltip
                popper-class="custom-tooltip"
                effect="dark"
                content="弹性公网IP提供外网访问能力，可以灵活绑定及解绑，随时修改带宽。未绑定弹性公网IP的云服务器无法直接访问外网，无法直接对外进行互相通信。"
                placement="right"
              >
                <svg-icon icon="question-icon"></svg-icon>
              </el-tooltip>
            </div>

            <div v-if="!selectCase.autoEip" class="ideal-tip-text">
              不使用弹性公网IP的云服务器不能与互联网互通，仅可作为私有网络中部署业务或者集群所需云服务器进行使用。
            </div>
          </div>
        </el-form-item>

        <el-form-item v-if="selectCase.autoEip" label="线路">
          <el-radio-group
            v-model="form.line"
          >
            <el-radio-button
              v-for="(item, index) of selectData.lineList"
              :key="index"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="selectCase.autoEip" label="公网带宽">
          <div class="flex-column">
            <el-radio-group
              v-model="form.bandwidthType"
              class="ideal-default-margin-right"
            >
              <el-radio-button
                v-for="(item, index) of selectData.bandwidthTypeList"
                :key="index"
                :label="item.value"
              >
                {{ item.label }}
              </el-radio-button>
            </el-radio-group>

            <div class="ideal-tip-text">
              指定带宽上限，按实际使用的出公网流量计费，与使用时间无关。
            </div>
          </div>
        </el-form-item>

        <el-form-item
          v-if="selectCase.autoEip && selectCase.isBandwidth"
          label="带宽"
        >
          <el-radio-group
            v-model="form.bandwidthSize"
            class="ideal-default-margin-right"
          >
            <el-radio-button
              v-for="(item, index) in selectData.bandWidthList"
              :key="index"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>

          <div>自定义：</div>
          <el-input-number
            v-model="form.bandwidthSize"
            class="ideal-default-margin-right"
            :min="1"
            :max="2000"
          />
          <div class="ideal-warning-text">带宽范围：1-2,000 Mbit/s</div>
        </el-form-item>

        <el-form-item
          v-if="selectCase.autoEip && selectCase.isFlow"
          label="带宽"
        >
          <el-radio-group
            v-model="form.bandwidthSize"
            class="ideal-default-margin-right"
          >
            <el-radio-button
              v-for="(item, index) in selectData.flowBandWidthList"
              :key="index"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>

          <div>自定义：</div>
          <el-input-number
            v-model="form.bandwidthSize"
            class="ideal-default-margin-right"
            :min="1"
            :max="300"
          />
          <div class="ideal-warning-text">带宽范围：1-3,00 Mbit/s</div>
        </el-form-item>

        <el-form-item
          v-if="selectCase.autoEip && selectCase.isShare"
          label="带宽名称"
        >
          <el-select
            v-model="form.shareBandwidth"
            placeholder="请选择带宽名称"
            class="ideal-default-margin-right"
          >
            <el-option
              v-for="item of selectData.shareBandwidth"
              :key="item.uuid"
              :label="item.name"
              :value="item.uuid"
            />
          </el-select>
          <svg-icon
            icon="refresh-icon"
            style="cursor: pointer"
            class="ideal-svg-margin-right"
            @click="clickRefreshBandwidth"
          />
          <el-button link type="primary">新建共享带宽</el-button>
          <el-tooltip
            popper-class="custom-tooltip"
            effect="dark"
            content="弹性公网IP加入到包年包月的共享带宽，如果到期后不续费，则会自动给弹性公网IP分配一个按流量计费的独享带宽。"
            placement="right"
          >
            <svg-icon icon="question-icon"></svg-icon>
          </el-tooltip>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="登录方式">
          <div class="flex-column">
            <el-radio-group
              v-model="form.loginMode"
              class="ideal-default-margin-right"
            >
              <el-radio-button
                v-for="(item, index) of selectData.loginModes"
                :key="index"
                :label="item.value"
              >
                {{ item.label }}
              </el-radio-button>
            </el-radio-group>

            <div
              v-if="selectCase.isKeyPair"
              class="ideal-warning-text"
            >
              请妥善保管密钥对的私钥文件，登录、重装和切换云服务器操作系统时，均需要使用该文件。
            </div>
          </div>
        </el-form-item>

        <el-form-item v-if="!selectCase.isKeyPair" label="用户名">
          <div>root</div>
        </el-form-item>

        <el-form-item
          v-if="!selectCase.isKeyPair"
          label="密码"
          prop="pwd"
        >
          <div class="flex-column" style="width: 100%">
            <el-input
              v-model="form.pwd"
              class="custom-input"
              show-password
              autocomplete="new-password"
            />
            <div>请牢记密码，如忘记密码可登录ECS控制台重置密码。</div>
          </div>
        </el-form-item>

        <el-form-item
          v-if="!selectCase.isKeyPair"
          label="确认密码"
          prop="againPwd"
        >
          <el-input
            v-model="form.againPwd"
            class="custom-input"
            show-password
            autocomplete="new-password"
          />
        </el-form-item>

        <el-form-item v-if="selectCase.isKeyPair" label="密钥对">
          <el-select
            v-model="form.keyPair"
            placeholder="请选择密钥对"
            class="ideal-default-margin-right"
          >
            <el-option
              v-for="item in selectData.keyPairList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
          <svg-icon
            icon="refresh-icon"
            style="cursor: pointer"
            class="ideal-svg-margin-right"
            @click="clickRefreshKeyPair"
          ></svg-icon>
          <el-button link type="primary">新建密钥对</el-button>
        </el-form-item>
      </el-card>
    </el-form>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    />
  </div>
</template>

<script setup lang="ts">
import selectSpec from './components/select-spec.vue'
import dialogBox from './dialog-box.vue'
import { generateCode } from '@/utils/tool'
import type { FormRules, FormInstance } from 'element-plus'
import { isEmpty, isUnDef } from '@/utils/is'
import { OperateEventEnum, EmitsEnum } from '@/utils/enum'
import { useCreate } from './create'
import emits from '@/utils/emits'

const formRef = ref<FormInstance>()
const form = reactive({
  billingMode: 'onDemand', // 计费模式
  regionName: '', // 区域
  name: 'as-config-' + generateCode(8), // 名称
  configTemplate: 'new', // 配置模板
  cpuArchitecture: 'x86', // CPU架构
  mirrorType: 'public', // 镜像(公有/私有)
  system: '', // 镜像系统类型
  mirror: '', // 镜像
  disk: 'cloudDisk', // 磁盘
  systemDisk: '', // 系统盘
  systemDiskSize: 100,
  dataDisks: [] as any[],
  eipType: 'noUse', // 弹性公网IP
  line: '', // 线路
  bandwidthType: '', // 公网带宽
  bandwidthSize: 5,
  shareBandwidth: '', // 共享带宽名称
  loginMode: '', // 登录方式
  keyPair: '', // 密钥对
  pwd: '', // 密码
  againPwd: '', 
  spec: '',  // 规格
  safeGroup: [] as any[] // 安全组
})
const rules = reactive<FormRules>({
  billingMode: [{ required: true, message: '请选择计费模式', trigger: 'blur' }],
  regionName: [{ required: true, message: '请选择区域', trigger: 'blur' }],
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  configTemplate: [{ required: true, message: '请选择配置模板', trigger: 'blur' }],

  spec: [{ required: true, message: '请选择规格', trigger: 'blur' }],
  mirrorType: [{ required: true, message: '请选择镜像', trigger: 'blur' }],
  disk: [{ required: true, message: '请选择磁盘', trigger: 'blur' }],
  safeGroup: [{ required: true, message: '请选择安全组', trigger: 'blur' }]
})
const {
  selectCase,
  selectData,
  state,
  selectionChangeHandle,
  clickTableCellRow,
  clickImageRefresh,
  clickDeleteDataDisk,
  clickAddDataDisk,
  dataDiskQuota,
  clickRefreshBandwidth,
  clickRefreshKeyPair
} = useCreate(form)
// 选择云服务器
const clickSelectCloudHost = () => {
  showDialog.value = true
  dialogType.value = OperateEventEnum.check
}
const rowData = ref()
const isSelect = computed(() => !isEmpty(rowData.value) && !isUnDef(rowData.value))
emits.on(EmitsEnum.HandleSuccess, (data: any) => {
  rowData.value = data?.row
})
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum>()
const clickCloseEvent = () => {
  resetDialog()
}
const clickRefreshEvent = () => {
  resetDialog()
}
// 重置弹框
const resetDialog = () => {
  showDialog.value = false
  dialogType.value = undefined // 防止再点击弹框时 有值
}
onUnmounted(() => {
  // 取消事件订阅
  emits.off(EmitsEnum.HandleSuccess)
})
</script>

<style scoped lang="scss">
.create {
  box-sizing: border-box;
}
</style>
<style lang="scss">
.custom-tooltip {
  max-width: 260px;
}
</style>
