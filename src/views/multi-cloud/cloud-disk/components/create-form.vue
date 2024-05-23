<template>
  <div class="create-form">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-card>
        <el-form-item label="区域" prop="regionId">
          <el-select v-model="form.regionId" style="width: 20%;">
            <el-option
              v-for="(item, index) of regionList"
              :key="index"
              :label="item.cnName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="可用区">
          <div class="flex-column">
            <el-radio-group v-model="form.availableZone" class="ideal-default-margin-right">
              <el-radio-button
                v-for="(item, index) of availableZoneList"
                :key="index"
                :label="item.code"
              >
                {{ item.name }}
              </el-radio-button>
            </el-radio-group>

            <div class="ideal-warning-text">
              当前可用区内无云服务器。
              磁盘只能挂载到同一可用区的云服务器内，创建后不支持更换可用区，请谨慎选择。
            </div>
          </div>
        </el-form-item>

        <el-form-item label="项目" prop="projectId">
          <el-select v-model="form.projectId" style="width: 20%;">
            <el-option
              v-for="(item, index) of projectList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="计费方式">
          <div class="flex-column">
            <el-radio-group v-model="form.billType">
              <el-radio-button
                v-for="item of selectData.billTypeList"
                :key="item.label"
                type="text"
                :label="item.label"
                >{{ item.value }}
              </el-radio-button>
            </el-radio-group>

            <div class="ideal-tip-text">
              包年包月是预付费模式，按订单的购买周期计费，适用于可预估资源使用周期的场景，价格比按需计费模式更优惠。
            </div>
          </div>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="数据源（可选）">
          <!-- <div v-if="showDataOriginType"></div> -->

          <el-popover
            ref="dataOriginTypeRef"
            placement="bottom-start"
            :width="150"
            trigger="click"
            @hide="clickHide"
          >
            <template #reference>
              <el-button link type="primary" @click="selectDataOriginType"
                >选择数据源
                <svg-icon
                  :icon="showDataOriginType ? 'down-arrow' : 'up-arrow'"
                  class="ideal-svg-margin-left"
                />
              </el-button>
            </template>

            <div v-if="showDataOriginType">
              <div
                v-for="(item, index) of selectData.dataOriginTypeList"
                :key="index"
                @click="clickDataOriginType(index)"
              >
                <span style="height: 30px; line-height: 30px; cursor: pointer">
                  {{ item.label }}
                </span>
              </div>
            </div>
          </el-popover>
        </el-form-item>

        <el-form-item label="数据盘">
          <el-select
            v-model="form.dataVolume"
            placeholder="请选择数据源"
            style="width: 20%;"
            class="ideal-default-margin-right"
          >
            <el-option
              v-for="(item, idx) of selectData.dataVolumeList"
              :key="idx"
              :label="item.describe"
              :value="item.type"
            >
            </el-option>
          </el-select>

          <el-input-number
            v-model="form.dataVolumeSize"
            class="ideal-default-margin-right"
            :min="selectData.minDiskSize"
            :max="30000"
          />
          <span class="ideal-default-margin-right">GiB</span>
        </el-form-item>

        <el-form-item label="当前已选">
          <div v-if="form.dataVolume">
            {{ form.dataVolumeName }} | {{ form.dataVolumeSize }}GiB
          </div>
        </el-form-item>

        <el-form-item label="云备份">
          <div class="flex-column">
            <div class="flex-row">
              <el-radio-group v-model="form.cloudBackupType" class="ideal-default-margin-right">
                <el-radio-button
                  v-for="(item, index) in selectData.cloudBackupTypeList"
                  :key="index"
                  :label="item.value"
                >
                  {{ item.label }}
                </el-radio-button>
              </el-radio-group>

              <el-tooltip
                popper-class="custom-tooltip"
                effect="dark"
                content="当前已选"
                placement="right"
              >
                <svg-icon icon="question-icon"></svg-icon>
              </el-tooltip>
            </div>
            <div class="ideal-tip-text">
              使用云备份服务，需购买备份存储库，存储库是存放服务器产生的备份副本的容器。
            </div>
          </div>
        </el-form-item>

        <el-form-item v-if="selectCase.isNowBuy" label="云备份存储库名称">
          <el-input v-model="form.cloudBackupPoolName" style="width: 20%;" />
        </el-form-item>

        <el-form-item v-if="selectCase.isNowBuy" label="云备份存储库容量">
          <div>
            <div class="flex-row">
              <el-input-number
                v-model="form.cloudBackupPoolSize"
                class="ideal-default-margin-right"
                :min="10"
                :max="100"
              />
              <span class="ideal-default-margin-right">GiB</span>
            </div>

            <div class="ideal-tip-text">
              为了保证连续性，建议云备份存储库空间不小于待备份磁盘容量。
            </div>
          </div>
        </el-form-item>

        <el-form-item v-if="selectCase.isAlready" label="云备份存储库">
          <div class="flex-column" style="width: 100%">
            <div class="flex-row">
              <el-select
                v-model="form.cloudBackupPool"
                placeholder="请选择"
                class="ideal-default-margin-right"
                style="width: 20%;"
              >
                <el-option
                  v-for="item of selectData.cloudBackupPoolList"
                  :key="item.uuid"
                  :label="item.name"
                  :value="item.uuid"
                />
              </el-select>

              <svg-icon
                icon="refresh-icon"
                style="cursor: pointer"
                @click="clickRefreshPool"
              ></svg-icon>
            </div>
          </div>
        </el-form-item>

        <el-form-item
          v-if="selectCase.isNowBuy || selectCase.isAlready"
          label="备份策略"
        >
          <div class="flex-column" style="width: 100%">
            <div class="flex-row">
              <el-select
                v-model="form.backupPolicy"
                placeholder="请选择"
                class="ideal-default-margin-right"
                style="width: 20%;"
              >
                <el-option
                  v-for="item of selectData.backupPolicyList"
                  :key="item.uuid"
                  :label="item.name"
                  :value="item.uuid"
                />
              </el-select>

              <svg-icon
                icon="refresh-icon"
                style="cursor: pointer"
                @click="clickRefreshPolicy"
              ></svg-icon>
            </div>
          </div>
        </el-form-item>

        <el-form-item>
          <template #label>
            <div
              class="flex-row"
              style="cursor: pointer"
              @click="clickMoreEvent"
            >
              <div>更多</div>
              <svg-icon
                :icon="showMore ? 'up-arrow' : 'down-arrow'"
                class="ideal-svg-margin-left"
              />
            </div>
          </template>
          <div class="flex-row">
            <svg-icon
              v-if="form.isShare"
              icon="check"
              class="ideal-svg-margin-right"
            />
            <div>共享盘</div>
            <div class="ideal-svg-margin-left ideal-svg-margin-right">|</div>
            <svg-icon
              v-if="form.isSCSI"
              icon="check"
              class="ideal-svg-margin-left ideal-svg-margin-right"
            />
            <div>SCSI</div>
            <div class="ideal-svg-margin-left ideal-svg-margin-right">|</div>
            <svg-icon
              v-if="form.isEncrypt"
              icon="check"
              class="ideal-svg-margin-left ideal-svg-margin-right"
            />
            <div>加密</div>
          </div>
        </el-form-item>

        <el-form-item v-if="showMore" label="高级配置">
          <div class="flex-row">
            <el-checkbox v-model="form.isShare" label="共享盘" />
            <el-tooltip
              popper-class="custom-tooltip"
              effect="dark"
              placement="right"
            >
              <template #content>
                <div>
                  共享磁盘是一种支持多个云服务器并发读写访问的数据块级存储设备，具备多挂载点、高并发性、高性能、高可靠性等特点。单个共享磁盘最多可同时挂载给16台云服务器。
                </div>
              </template>
              <svg-icon
                icon="question-icon"
                class-name="question-icon"
                class="ideal-svg-margin-right"
              />
            </el-tooltip>

            <el-checkbox v-model="form.isSCSI" label="SCSI" />
            <el-tooltip
              popper-class="custom-tooltip"
              effect="dark"
              placement="right"
            >
              <template #content>
                <div>
                  默认模式为VBD，如果选择了SCSI，能支持SCSI指令透传，可应用于需要支持SCSI指令的场景。
                </div>
                <div>
                  SCSI模式磁盘支持的云服务器类型和对云服务器主机软件的要求。
                </div>
                <div>裸金属服务器仅支持使用SCSI模式磁盘。</div>
              </template>
              <svg-icon
                icon="question-icon"
                class-name="question-icon"
                class="ideal-svg-margin-right"
              />
            </el-tooltip>

            <el-checkbox v-model="form.isEncrypt" label="加密" />
            <el-tooltip
              popper-class="custom-tooltip"
              effect="dark"
              placement="right"
            >
              <template #content>
                <div>
                  磁盘加密功能，为您的数据提供强大的安全防护。加密磁盘生成的快照及通过这些快照创建的磁盘将自动继承加密功能。
                </div>
              </template>
              <svg-icon
                icon="question-icon"
                class-name="question-icon"
                class="ideal-svg-margin-right"
              />
            </el-tooltip>
          </div>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="磁盘名称" prop="ebsName">
          <div class="flex-column">
            <el-input
              v-model.trim="form.ebsName"
              placeholder="请输入名称"
              style="width: 20%"
            />

            <div class="ideal-tip-text">
              创建多块磁盘时，该参数值用作磁盘前缀，磁盘名称由该前缀和四位数字组成。例如，输入my_disk且创建2块磁盘时，磁盘名称为my_disk-0001和my_disk-0002。
            </div>
          </div>
        </el-form-item>

        <el-form-item v-if="selectCase.isPackage" label="购买时长">
          <div class="flex-column">
            <el-radio-group v-model="form.buyTime" class="ideal-default-margin-right">
              <el-radio-button
                v-for="(item, index) in selectData.timeList"
                :key="index"
                :label="item.value"
              >
                {{ item.label }}
              </el-radio-button>
            </el-radio-group>

            <div class="flex-row">
              <el-checkbox v-model="form.isAuto" label="自动续费" />
            </div>
          </div>
        </el-form-item>

        <el-form-item label="购买数量">
          <el-input-number
            v-model="form.count"
            class="ideal-default-margin-right"
            :min="1"
            :max="10"
          />
          <div class="ideal-tip-text">
            您还可以创建400个磁盘。<span class="ideal-warning-text"
              >一次最多可创建100个磁盘。</span
            >如需申请更多配额请点击申请扩大配额。
          </div>
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
import dialogBox from '../dialog-box.vue'
import type { FormRules, FormInstance } from 'element-plus'
import { generateCode } from '@/utils/tool'
import { useCreate } from './create-form'
import { BillingEnum } from '@/utils/enum'

const formRef = ref<FormInstance>()
const form = reactive({
  resourceId: '', // 资源池id
  billType: BillingEnum.PACKAGE, // 付费类型
  regionId: '', // 区域id
  projectId: '', // 项目id
  regionName: '',
  availableZone: '', // 可用区
  dataOrigin: '', // 数据源
  dataVolume: '', // 系统盘
  dataVolumeName: '',
  dataVolumeSize: 0, // 系统盘大小
  cloudBackupType: 'notYet', // 云备份
  cloudBackupPoolName: 'vault-' + generateCode(4), // 云备份存储库名称
  cloudBackupPoolSize: 0, // 云备份存储库容量
  cloudBackupPool: '', // 云备份存储库
  backupPolicy: '', // 备份策略
  isShare: false, // 是否共享
  isSCSI: false, // 是否scsi
  isEncrypt: false, // 是否加密
  ebsName: 'volume-' + generateCode(4), // 云硬盘名称
  buyTime: '1', // 购买时长
  isAuto: false, // 开启详情监控
  count: 0, // 购买数量
  cloudProjectId: '' // 底层项目id
})
const rules = reactive<FormRules>({
  projectId: [{ required: true, message: '请选择项目', trigger: 'blur' }],
  regionId: [{ required: true, message: '请选择区域', trigger: 'blur' }]
})

const showMore = ref(false)
const clickMoreEvent = () => {
  showMore.value = !showMore.value
}

const {
  regionList,
  availableZoneList,
  projectList,
  selectData,
  selectCase,
  clickRefreshPolicy,
  clickRefreshPool 
} = useCreate(form)

const dataOriginTypeRef = ref()
const clickDataOriginType = (index: number) => {
  dialogType.value = selectData.dataOriginTypeList[index].value
  showDialog.value = true
  dataOriginTypeRef.value.hide()
}
const showDataOriginType = ref(false)
const selectDataOriginType = () => {
  showDataOriginType.value = true
}
const clickHide = () => {
  showDataOriginType.value = false
}

// 弹框
const showDialog = ref(false)
const dialogType = ref('')
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
}

defineExpose({
  selectCase,
  formRef,
  form
})
</script>

<style scoped lang="scss">
.create-form {
  width: 100%;
  :deep(.el-form) {
    padding: 0;
  }
  :deep(.el-card__body) {
    padding: 20px 20px 0;
  }
  :deep(.question-icon) {
    margin-top: 7px;
    width: 18px;
    height: 18px;
  }
  :deep(.el-checkbox:last-of-type) {
    margin-right: 30px;
  }
  :deep(.el-select__wrapper) {
    min-height: 34px;
  }
}
</style>
<style lang="scss">
.custom-tooltip {
  max-width: 260px;
}
</style>
