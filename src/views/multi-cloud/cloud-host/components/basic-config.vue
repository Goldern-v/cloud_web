<template>
  <div class="basic-config">
    <el-form
      ref="formRef"
      :model="basicData.form"
      :rules="rules"
      label-position="left"
    >
      <el-card>
        <el-form-item label="区域" prop="regionId">
          <el-select v-model="basicData.form.regionId" style="width: 20%">
            <el-option
              v-for="(item, index) of regionList"
              :key="index"
              :label="item.cnName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="可用区" prop="availableZone">
          <el-radio-group v-model="basicData.form.availableZone" class="ideal-default-margin-right">
            <el-radio-button
              v-for="(item, index) of availableZoneList"
              :key="index"
              :label="item.code"
              >{{ item.name }}
            </el-radio-button>
          </el-radio-group>

          <svg-icon
            icon="question-icon"
            class-name="question-icon"
            @click="handleAvailableArea"
          />
        </el-form-item>

        <el-form-item label="项目" prop="projectId">
          <el-select v-model="basicData.form.projectId" style="width: 20%">
            <el-option
              v-for="(item, index) of projectList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="计费模式" prop="billingMode">
          <el-radio-group v-model="basicData.form.billingMode" class="ideal-default-margin-right">
            <el-radio-button
              v-for="(item, index) of state.billingModeList"
              :key="index"
              :label="item.label"
            >
              {{ item.value }}
            </el-radio-button>
          </el-radio-group>

          <svg-icon
            icon="question-icon"
            class-name="question-icon"
            @click="handleBilling"
          />
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="实例筛选">
          <el-radio-group v-model="basicData.form.instance">
            <el-radio-button
              v-for="(item, index) of state.instanceList"
              :key="index"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="isBusinessScene" label="业务场景">
          <el-radio-group v-model="basicData.form.scene">
            <el-radio-button
              v-for="(item, index) of state.sceneList"
              :key="index"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="isBusinessScene" label="子场景">
          <div class="flex-column">
            <div class="flex-row">
              <el-radio-group v-model="basicData.form.subscene" class="ideal-default-margin-right">
                <el-radio-button
                  v-for="(item, index) of state.subsceneList"
                  :key="index"
                  :label="item.value"
                >
                  {{ item.label }}
                </el-radio-button>
              </el-radio-group>

              <el-tooltip
                popper-class="custom-tooltip"
                effect="dark"
                content="子场景"
                placement="right"
              >
                <svg-icon icon="question-icon"></svg-icon>
              </el-tooltip>
            </div>

            <div class="flex-row specification-table-tip">
              <div>
                搭配NVIDIA智能
                网卡，适用于深度学习训练、科学计算、计算流体动力学、计算金融、地震分析、分子建模、基因组学等领域。
              </div>
              <svg-icon icon="close-icon"></svg-icon>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="CPU架构" prop="cpuArchitecture">
          <el-radio-group
            v-model="basicData.form.cpuArchitecture"
            class="ideal-default-margin-right"
          >
            <el-radio-button
              v-for="(item, index) of state.cpuArchitectureList"
              :key="index"
              :label="item.cpuArchitecture"
            >
              {{ item.cpuArchitectureName }}
            </el-radio-button>
          </el-radio-group>

          <svg-icon
            icon="question-icon"
            class-name="question-icon"
            @click="handleArchitecture"
          />
        </el-form-item>

        <el-form-item label="规格" required>
          <div class="flex-column" style="width: 100%">
            <div class="flex-row">
              <span class="ideal-default-margin-right">vCPU</span>
              <el-select
                v-model="state.filter.cpu"
                clearable
                placeholder="选择"
                :popper-append-to-body="false"
                class="ideal-default-margin-right"
                style="width: 10%"
              >
                <el-option
                  v-for="item of vCPUList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>

              <span class="ideal-default-margin-right">内存</span>
              <el-select
                v-model="state.filter.ram"
                clearable
                placeholder="选择"
                :popper-append-to-body="false"
                class="ideal-default-margin-right"
                style="width: 20%"
              >
                <el-option
                  v-for="item of memoryList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>

              <span class="ideal-default-margin-right">规格名称</span>
              <el-input
                v-model="state.filter.name"
                class="custom-input ideal-default-margin-right"
                style="width: 200px"
                @blur="specNameBlur"
              />

              <el-checkbox v-model="state.filter.status" label="隐藏售罄规格" />
            </div>

            <el-radio-group
              v-if="state.specsTypeList?.length"
              v-model="basicData.form.specsType"
              class="ideal-large-margin-top"
            >
              <el-radio-button
                v-for="(item, index) of state.specsTypeList"
                :key="index"
                :label="item.code"
              >
                {{ item.name }}
              </el-radio-button>
            </el-radio-group>

            <el-radio-group
              v-if="state.instanceSpecsList?.length"
              v-model="basicData.form.instanceSpecs"
              class="ideal-large-margin-top"
            >
              <el-radio-button
                v-for="(item, index) of state.instanceSpecsList"
                :key="index"
                :label="item"
              >
                {{ item }}
              </el-radio-button>
            </el-radio-group>

            <div v-if="showTip" class="flex-row specification-table-tip">
              <div>
                GPU驱动加速，在重载计算场景，提供强大的浮点计算能力，从容应对高实时、高并发的海量计算场景。
              </div>
              <svg-icon
                icon="close-icon"
                style="cursor: pointer"
                @click="clickCloseTip"
              ></svg-icon>
            </div>

            <el-form-item prop="currentSpec" class="spec-table-list">
              <ideal-table-list
                row-key="id"
                :loading="state.tableState?.dataListLoading"
                :table-data="state.tableState?.dataList"
                :table-headers="tableHeaders"
                :is-radio="true"
                :show-border="true"
                :show-pagination="false"
                :default-first="true"
                max-height="285"
                @clickTableCellRow="clickTableCellRow"
              >
                <template #vcpus>
                  <el-table-column label="vCPUs" sortable prop="vcpu">
                    <template #default="props">
                      <div>{{ props.row.vcpus }}</div>
                    </template>
                  </el-table-column>
                </template>
                <template #ram>
                  <el-table-column label="内存" sortable prop="ram">
                    <template #default="props">
                      <div>{{ props.row.ram }}GiB</div>
                    </template>
                  </el-table-column>
                </template>
                <template #cpuName>
                  <el-table-column label="CPU" sortable prop="cpu">
                    <template #default="props">
                      <div>{{ props.row.cpuName }}</div>
                    </template>
                  </el-table-column>
                </template>
                <template #maxBandwidth>
                  <el-table-column
                    label="基准/最大带宽"
                    sortable
                    prop="maxBandwidth"
                  >
                    <template #default="props">
                      <div>{{ props.row.maxRate }}</div>
                    </template>
                  </el-table-column>
                </template>
                <template #private>
                  <el-table-column label="内网收发包" sortable prop="private">
                    <template #default="props">
                      <div>{{ props.row.maxPps }}</div>
                    </template>
                  </el-table-column>
                </template>
                <template #price>
                  <el-table-column label="规格参考价" sortable prop="price">
                    <template #default="props">
                      <div>{{ props.row.price }}</div>
                    </template>
                  </el-table-column>
                </template>
              </ideal-table-list>
              <div v-if="basicData.form.currentSpec" class="flex-row ideal-large-margin-top">
                <div>当前规格：</div>
                <div class="flex-column">
                  <div>
                    {{ basicData.form.currentSpec.name }} |
                    {{ basicData.form.currentSpec.vcpus }} |
                    {{ basicData.form.currentSpec.ram }}GiB
                  </div>
                  <div class="ideal-warning-text">
                    您当前选择规格，仅支持使用SCSI磁盘模式挂载磁盘，不支持使用VBD磁盘模式挂载磁盘，磁盘标识为wwn号
                  </div>
                  <div class="custom-danger-text">
                    {{ checkInfo }}
                  </div>
                </div>
              </div>
            </el-form-item>
          </div>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="镜像" required>
          <div class="flex-column" style="width: 100%">
            <div class="flex-row">
              <el-form-item prop="mirrorType">
                <el-radio-group
                  v-model="basicData.form.mirrorType"
                  class="ideal-default-margin-right"
                  @change="changeMirrorType"
                >
                  <el-radio-button
                    v-for="(item, index) of state.mirrorTypeList"
                    :key="index"
                    :label="item.label"
                  >
                    {{ item.value }}
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
            </div>

            <div
              class="flex-row ideal-large-margin-top flex-row-start-center"
              style="width: 30%"
            >
              <el-select
                v-if="basicData.form.mirrorType === 'public'"
                v-model="basicData.form.system"
                placeholder="请选择操作系统"
                class="ideal-default-margin-right"
                style="width: 50%"
              >
                <el-option
                  v-for="(item, index) of state.systemList"
                  :key="index"
                  :label="item.platform"
                  :value="item.platform"
                />
              </el-select>

              <el-form-item prop="mirror" style="width: 50%">
                <el-select
                  v-model="basicData.form.mirror"
                  placeholder="请选择"
                  class="ideal-default-margin-right"
                >
                  <el-option
                    v-for="item of state.mirrorList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>

              <svg-icon
                icon="refresh-icon"
                style="cursor: pointer"
                @click="clickImageRefresh"
              ></svg-icon>

              <el-button
                v-if="basicData.form.mirrorType === 'private'"
                text
                type="primary"
                >新建私有镜像</el-button
              >
            </div>
          </div>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="系统盘" required>
          <div class="flex-column" style="width: 100%">
            <div class="flex-row">
              <el-form-item prop="systemDisk" style="width: 15%">
                <el-select
                  v-model="basicData.form.systemDisk"
                  placeholder="请选择"
                  class="ideal-default-margin-right"
                >
                  <el-option
                    v-for="(item, index) of state.systemDiskList"
                    :key="index"
                    :label="item.describe"
                    :value="item.type"
                  />
                </el-select>
              </el-form-item>
              <el-input-number
                v-model="basicData.form.systemDiskSize"
                class="ideal-default-margin-right"
                :min="basicData.form.systemDiskMinSize"
                :step="10"
              />
              <span class="ideal-default-margin-right">GiB</span>

              <svg-icon
                icon="question-icon"
                class-name="question-icon"
                @click="handleDisk"
              />
            </div>

            <div
              v-for="(item, index) of basicData.form.dataDisks"
              :key="index"
              class="flex-row ideal-large-margin-top"
            >
              <el-form-item style="width: 15%">
                <el-select
                  v-model="item.type"
                  placeholder="请选择"
                  class="ideal-default-margin-right"
                >
                  <el-option
                    v-for="(child, idx) of state.dataDiskList"
                    :key="idx"
                    :label="child.describe"
                    :value="child.type"
                  />
                </el-select>
              </el-form-item>
              <el-input-number
                v-model="item.size"
                class="ideal-default-margin-right"
                :min="basicData.form.dataDisksMinSize"
                :max="1000"
                :step="10"
              />
              <el-button
                text
                class="custom-text-button"
                @click="clickDeleteDataDisk(index)"
                >删除</el-button
              >
            </div>

            <div class="flex-row ideal-default-text ideal-large-margin-top">
              <el-button
                link
                type="primary"
                :disabled="!diskQuota"
                @click="clickAddDataDisk"
                >+增加一块数据盘</el-button
              >
              <span>你还可以增加{{ diskQuota }}块磁盘(云硬盘)</span>
            </div>
          </div>
        </el-form-item>
      </el-card>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { vCPUList, memoryList } from './common'
import type { IdealTableColumnHeaders } from '@/types'
import { useBasic } from './basic-config'
import { IHooksBasic } from './interface'

const formRef = ref<FormInstance>() // 校验表单
const rules = reactive<FormRules>({
  projectId: [{ required: true, message: '请选择项目', trigger: 'blur' }],
  regionId: [{ required: true, message: '请选择区域', trigger: 'blur' }],
  billingMode: [{ required: true, message: '请选择付费类型', trigger: 'blur' }],
  availableZone: [{ required: true, message: '请选择可用区', trigger: 'blur' }],
  cpuArchitecture: [
    { required: true, message: '请选择CPU架构', trigger: 'blur' }
  ],
  instanceName: [
    { required: true, message: '请输入实例名称', trigger: 'blur' }
  ],
  currentSpec: [{ required: true, message: '请选择规格', trigger: 'blur' }],
  mirrorType: [{ required: true, message: '请选择镜像类型', trigger: 'blur' }],
  mirror: [{ required: true, message: '请选择镜像', trigger: 'blur' }],
  systemDisk: [{ required: true, message: '请选择系统盘类型', trigger: 'blur' }]
})

const state: IHooksBasic = reactive({})
const basicData = useBasic(state)

const {
  regionList,
  availableZoneList,
  projectList,
  clickDeleteDataDisk,
  clickAddDataDisk,
  specNameBlur,
  clickTableCellRow,
  clickImageRefresh,
  checkInfo,
  changeMirrorType
} = basicData

// 规格列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '实例类型', prop: 'specsTypeName' },
  { label: '规格名称', prop: 'name' },
  { label: 'vCPUs', prop: 'vcpus', useSlot: true },
  { label: '内存', prop: 'ram', useSlot: true },
  { label: 'CPU', prop: 'cpuName', useSlot: true },
  { label: '基准/最大带宽', prop: 'maxBandwidth', useSlot: true },
  { label: '内网收发包', prop: 'private', useSlot: true },
  { label: '规格参考价', prop: 'price', useSlot: true }
]
// 是否是业务场景选择
const isBusinessScene = computed(() => basicData.form.instance === '2')
// 显示规格提示
const showTip = ref(true)
const clickCloseTip = () => {
  showTip.value = false
}
// 可以新增数据盘配额
const diskQuota = computed(() => {
  let result = 0
  if (state.dataDiskQuota) {
    result = state.dataDiskQuota - basicData.form.dataDisks.length
  }
  return result
})
// 事件
enum EventEnum {
  drawer = 'clickDrawer'
}
interface EventEmits {
  (e: EventEnum.drawer, v: string): void
}
const emit = defineEmits<EventEmits>()
// 计费模式抽屉
const handleBilling = () => {
  emit(EventEnum.drawer, 'billingMode')
}
const handleAvailableArea = () => {
  emit(EventEnum.drawer, 'availableArea')
}
const handleArchitecture = () => {
  emit(EventEnum.drawer, 'architecture')
}
const handleDisk = () => {
  emit(EventEnum.drawer, 'disk')
}

const form = toRefs(basicData.form)
defineExpose({
  formRef,
  form
})
</script>

<style lang="scss" scoped>
.basic-config {
  width: 100%;
  :deep(.el-form) {
    padding: 0;
  }
  .flex-row-start-center {
    justify-content: flex-start;
    align-items: center;
  }
  .specification-table-tip {
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: var(--custom-information-bg-color);
    margin: 20px 0 0;
  }
  .spec-table-list {
    width: 100%;
    :deep(.el-table) {
      height: 320px;
    }
  }
  .storage-item-box {
    background-color: $gray1-light;
    .custom-text-button {
      background-color: transparent;
      color: var(--el-color-primary);
    }
  }
  :deep(.el-card__body) {
    padding: 20px 20px 0;
  }
  :deep(.question-icon) {
    width: 15px;
    height: 15px;
  }
  .custom-danger-text {
    color: $errorColor;
    font-size: $defaultFontSize;
  }
}
</style>
<style lang="scss">
.custom-tooltip {
  max-width: 260px;
}
</style>
