<template>
  <div class="create-form">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-card>
        <el-form-item label="计费模式">
          <div>
            <el-radio-group v-model="form.billingMode" class="ideal-default-margin-right">
              <el-radio-button
                v-for="(item, index) of billingModes"
                :key="index"
                :label="item.label"
              >
                {{ item.value }}
              </el-radio-button>
            </el-radio-group>

            <div v-if="isPackage" class="ideal-tip-text">
              包年包月是预付费模式，适用于可预估资源使用周期的场景，价格比按需计费模式更优惠。
            </div>
          </div>
        </el-form-item>

        <el-form-item label="区域">
          <div>
            <div>{{ form.regionName }}</div>
            <div class="ideal-tip-text">
              不同区域的资源之间内网不互通。请选择靠近您客户的区域，可以降低网络时延、提高访问速度。
            </div>
          </div>
        </el-form-item>

        <el-form-item label="项目">
          <el-select v-model="form.project">
            <el-option
              v-for="(item, index) of projects"
              :key="index"
              :label="item.platform"
              :value="item.platform"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="可用区" prop="availableZone">
          <div>
            <el-radio-group v-model="form.availableZone" class="ideal-default-margin-right">
              <el-radio-button
                v-for="(item, index) of availableZones"
                :key="index"
                :label="item.code"
                >{{ item.name }}
              </el-radio-button>
            </el-radio-group>

            <div class="ideal-tip-text">
              同一区域不同可用区之间文件系统与云服务器互通。
            </div>
          </div>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="文件系统类型">
          <el-radio-group v-model="form.fileType" class="ideal-default-margin-right">
            <el-radio-button
              v-for="(item, index) of fileTypes"
              :key="index"
              :label="item.label"
              >{{ item.value }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="存储类型">
          <div style="width: 100%">
            <storage-class :type="form.fileType" @clickSelect="clickFileType"/>
          </div>
        </el-form-item>

        <el-form-item
          v-if="isHpcCache"
          label="带宽大小（MB/s）"
        >
          <el-select
            v-model="form.bandwidthSize"
            placeholder="请选择"
            style="width: 120px"
          >
            <el-option
              v-for="(item, index) of bandwidthSizes"
              :key="index"
              :label="item.platform"
              :value="item.platform"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="容量（TB）">
          <div>
            <el-tooltip
              effect="dark"
              placement="top-start"
              popper-class="custom-tooltip"
              :content="capacity.content"
            >
              <el-input-number
                v-model="form.size"
                :min="capacity.min"
                :max="capacity.max"
                :precision="capacity.precision"
                :step="capacity.step"
              />
            </el-tooltip>

            <div class="ideal-tip-text">
              按量付费是在固定容量规格基础进行按小时计费，不是按实际写入存储量计费。
            </div>
          </div>
        </el-form-item>

        <el-form-item v-if="isHpc" label="带宽大小（MB/s）">
          <div>300</div>
        </el-form-item>

        <el-form-item label="协议类型">
          <el-radio-group v-model="form.protocolType">
            <el-radio-button
              v-for="(item, index) of protocolTypes"
              :key="index"
              :label="item.label"
              >{{ item.value }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="选择网络">
          <div>
            <div class="flex-row">
              <el-select
                v-model="form.vpc"
                placeholder="请选择vpc"
                style="width: 120px"
              >
                <el-option
                  v-for="(item, index) of vpcList"
                  :key="index"
                  :label="item.platform"
                  :value="item.platform"
                />
              </el-select>
              <svg-icon
                icon="refresh-icon"
                class="ideal-svg-margin-right ideal-svg-margin-left"
              />

              <el-select
                v-model="form.subnet"
                placeholder="请选择子网"
                style="width: 120px"
              >
                <el-option
                  v-for="(item, index) of subnetList"
                  :key="index"
                  :label="item.platform"
                  :value="item.platform"
                />
              </el-select>
              <svg-icon icon="refresh-icon" class="ideal-svg-margin-left" />
            </div>

            <div class="flex-row ideal-tip-text">
              云服务器无法访问不在同一VPC下的文件系统，请选择与云服务器相同的VPC。如需创建新的虚拟私有云，可前往<el-button
                link
                type="primary"
                >创建虚拟私有云</el-button
              >。
            </div>
          </div>
        </el-form-item>

        <el-form-item label="安全组">
          <div>
            <div class="flex-row">
              <el-select
                v-model="form.safeGroup"
                placeholder="请选择安全组"
                style="width: 120px"
              >
                <el-option
                  v-for="(item, index) of safeGroups"
                  :key="index"
                  :label="item.platform"
                  :value="item.platform"
                />
              </el-select>
              <el-button link type="primary">查看安全组</el-button>
              <svg-icon icon="refresh-icon" class="ideal-svg-margin-left" />
            </div>

            <div class="ideal-tip-text">
              为保证能正常使用文件系统，我们默认帮您开通安全组的111、445、2049、2051、2052、20048端口。
            </div>
            <div class="ideal-error-text">
              推荐您绑定独立的安全组到文件系统，避免与业务系统安全组混用，提升系统安全性。
            </div>
          </div>
        </el-form-item>
      </el-card>

      <el-card v-if="isGeneral" class="ideal-large-margin-top">
        <el-form-item label="云备份">
          <div>
            <div class="ideal-tip-text">
              使用云备份服务，需购买备份存储库，存储库是存放磁盘产生的备份副本的容器。
            </div>

            <el-radio-group v-model="form.cloudBackup">
              <el-radio-button
                v-for="(item, index) of cloudBackups"
                :key="index"
                :label="item.label"
                >{{ item.value }}
              </el-radio-button>
            </el-radio-group>
          </div>
        </el-form-item>

        <el-form-item v-if="isUsed" label="云备份存储库">
          <el-select
            v-model="form.cloudBackupPool"
            placeholder="请选择"
            style="width: 210px"
          >
            <el-option
              v-for="(item, index) of cloudBackupPools"
              :key="index"
              :label="item.platform"
              :value="item.platform"
            />
          </el-select>
          <svg-icon icon="refresh-icon" class="ideal-svg-margin-left" />
        </el-form-item>

        <el-form-item v-if="isBuyNow" label="存储库名称">
          <el-input v-model="form.poolName" style="width: 210px" />
        </el-form-item>

        <el-form-item
          v-if="isBuyNow"
          label="存储库容量（GB）"
        >
          <el-tooltip
            effect="dark"
            placement="top-start"
            popper-class="custom-tooltip"
            content="输入值必须在1,000到65,536之间。"
          >
            <el-input-number
              v-model="form.poolSize"
              :min="1000"
              :max="65536"
              :step="10"
            />
          </el-tooltip>
        </el-form-item>

        <el-form-item
          v-if="isUsed || isBuyNow"
          label="备份策略"
        >
          <el-select
            v-model="form.backupPolicy"
            placeholder="请选择"
            style="width: 210px"
          >
            <el-option
              v-for="(item, index) of backupPolicies"
              :key="index"
              :label="item.platform"
              :value="item.platform"
            />
          </el-select>
          <svg-icon
            v-if="isBuyNow"
            icon="refresh-icon"
            class="ideal-svg-margin-left"
          />
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item>
          <template #label>
            <div
              class="flex-row"
              style="cursor: pointer"
              @click="clickHighConfig"
            >
              <div>高级配置</div>
              <svg-icon
                :icon="showHighConfig ? 'down-arrow' : 'up-arrow'"
                class="ideal-svg-margin-left"
              />
            </div>
          </template>

          <div class="ideal-tip-text">加密 | 标签</div>
        </el-form-item>

        <el-form-item v-if="showHighConfig" label="加密">
          <el-checkbox v-model="form.encrypt" label="KMS加密" />
        </el-form-item>

        <el-form-item v-if="showHighConfig" label="标签">
          <div class="ideal-tip-text">
            如果您需要使用同一标签标识多种云资源，即所有服务均可在标签输入框下拉选择同一标签，建议在TMS中创建预定义标签。
            <el-button type="primary" link>查看预定义标签</el-button>
            <div
              v-for="(item, index) of form.tags"
              :key="index"
              class="flex-row tag-box"
            >
              <el-input
                v-model="item.key"
                placeholder="标签键"
                class="ideal-default-margin-right"
                style="width: 210px"
              />
              <el-input
                v-model="item.value"
                placeholder="标签值"
                class="ideal-default-margin-right"
                style="width: 210px"
              />
              <svg-icon
                v-if="form.tags.length > 1"
                icon="delete-icon"
                color="var(--el-color-primary)"
                @click="clickDeleteTag(index)"
              />
            </div>
            <div class="flex-row">
              <el-button
                link
                type="primary"
                :disabled="!availableQuota"
                @click="clickAddTag"
                >添加标签</el-button
              >
              <div>您还可以添加{{ availableQuota }}个标签</div>
            </div>
          </div>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="名称">
          <el-input v-model="form.name" />
        </el-form-item>

        <el-form-item v-if="isPackage" label="购买量">
          <div class="flex-column">
            <el-radio-group
              v-model="form.buyTime"
              class="ideal-default-margin-right"
            >
              <el-radio-button
                v-for="(item, index) in timeList"
                :key="index"
                :label="item.value"
              >
                {{ item.label }}
              </el-radio-button>
            </el-radio-group>

            <div class="flex-row">
              <el-checkbox v-model="form.isAuto" label="自动续费"/>
            </div>
          </div>
        </el-form-item>
      </el-card>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import storageClass from './storage-class.vue'
import type { FormRules, FormInstance } from 'element-plus'
import { generateCode } from '@/utils/tool'
import store from '@/store'
import { BillingEnum } from '@/utils/enum'
import { useCreate } from './create-form'

const formRef = ref<FormInstance>() // 校验表单
const form = reactive({
  billingMode: BillingEnum.ON_DEMAND, // 计费模式
  regionName: '', // 区域
  project: '', // 项目
  availableZone: '', // 可用区
  fileType: 'hpc', // 文件系统类型
  storageClassItem: null, // 存储类型
  bandwidthSize: '', // 带宽大小
  size: 1, // 容量（TB）
  protocolType: 'nfs', // 协议类型
  vpc: '',
  subnet: '',
  safeGroup: '', // 安全组
  cloudBackupPool: '', // 云备份存储库
  poolName: 'vault-turbo-' + generateCode(4), // 存储库名称
  poolSize: 1000, // 存储库容量
  backupPolicy: '', // 备份策略
  encrypt: false, // 加密
  tags: [{ key: '', value: '' }], // 标签
  cloudBackup: 'notYet', // 云备份
  name: 'sfs-turbo-' + generateCode(4), // 名称
  buyTime: '', // 购买量
  isAuto: false // 自动续费
})
const rules = reactive<FormRules>({})

// 存储类型选择
const clickFileType = (item: any) => {
  form.storageClassItem = item
}

const { resourcePoolInfo, regionInfo } = storeToRefs(store.resourceStore)
onBeforeMount(() => {
  if (store.resourceStore) {
    store.resourceStore.$subscribe(async (mutations: any, state: any) => {
      form.regionName = state?.regionInfo?.name
    })
  }
})
onMounted(async () => {
  // 右上角资源池区域是否选择
  if (regionInfo.value && resourcePoolInfo.value) {
    form.regionName = regionInfo.value.name
  }
})

const {
  isPackage,
  billingModes,
  projects,
  availableZones,
  fileTypes,
  isHpc,
  isHpcCache,
  isGeneral,
  capacity,
  bandwidthSizes,
  protocolTypes,
  vpcList,
  subnetList,
  safeGroups,
  cloudBackupPools,
  backupPolicies,
  showHighConfig,
  clickHighConfig,
  availableQuota,
  clickAddTag,
  clickDeleteTag,
  cloudBackups,
  isUsed,
  isBuyNow,
  timeList
} = useCreate(form)

defineExpose({
  formRef,
  form
})
</script>

<style scoped lang="scss">
.create-form {
  box-sizing: border-box;
  :deep(.el-form) {
    padding: 0;
  }
  :deep(.el-card__body) {
    padding: 20px 20px 0;
  }
  .tag-box {
    margin-bottom: 10px;
  }
}
</style>
