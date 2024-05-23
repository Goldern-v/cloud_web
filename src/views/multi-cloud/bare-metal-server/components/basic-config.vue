<template>
  <div class="basic-config">
    <el-form
      ref="formRef"
      :model="basicData.form"
      :rules="rules"
      label-position="left"
    >
      <el-card>
        <el-form-item label="区域">
          <div>
            <div>{{ basicData.form.regionName }}</div>
            <div class="ideal-tip-text">不同区域的云服务产品之间内网互不相通；请就近选择靠近您业务的区域，可减少网络延迟，提高访问速度。</div>
          </div>
        </el-form-item>

        <el-form-item label="计费模式" prop="billingMode">
          <el-radio-group
            v-model="basicData.form.billingMode"
            class="ideal-default-margin-right"
          >
            <el-radio-button
              v-for="(item, index) of state.billingModeList"
              :key="index"
              :label="item.label"
            >
              {{ item.value }}
            </el-radio-button>
          </el-radio-group>

          <svg-icon icon="question-icon" @click="handleQuestion" />
        </el-form-item>

        <el-form-item label="可用区" prop="availableZone">
          <el-radio-group
            v-model="basicData.form.availableZone"
            class="ideal-default-margin-right"
          >
            <el-radio-button
              v-for="(item, index) of state.availableZoneList"
              :key="index"
              :label="item.code"
              >{{ item.name }}
            </el-radio-button>
          </el-radio-group>

          <el-tooltip
            popper-class="custom-tooltip"
            effect="dark"
            content="可用区"
            placement="right"
          >
            <svg-icon icon="question-icon"></svg-icon>
          </el-tooltip>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="规格" required>
          <div class="flex-column" style="width: 100%">
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
                  <el-table-column
                    label="vCPUs"
                    sortable
                    prop="vcpu"
                  >
                    <template #default="props">
                      <div>{{ props.row.vcpus }}</div>
                    </template>
                  </el-table-column>
                </template>
                <template #ram>
                  <el-table-column
                    label="内存"
                    sortable
                    prop="ram"
                  >
                    <template #default="props">
                      <div>{{ props.row.ram }}GiB</div>
                    </template>
                  </el-table-column>
                </template>
                <template #cpuName>
                  <el-table-column
                    label="CPU"
                    sortable
                    prop="cpu"
                  >
                    <template #default="props">
                      <div>{{ props.row.cpuName }}</div>
                    </template>
                  </el-table-column>
                </template>
              </ideal-table-list>
              <div
                v-if="basicData.form.currentSpec"
                class="flex-row ideal-large-margin-top"
              >
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
                </div>
              </div>
            </el-form-item>
          </div>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="镜像" required>
          <div class="flex-column">
            <div class="flex-row">
              <el-form-item prop="mirrorType">
                <el-radio-group
                  v-model="basicData.form.mirrorType"
                  class="ideal-default-margin-right"
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

              <el-tooltip
                popper-class="custom-tooltip"
                effect="dark"
                content="镜像"
                placement="right"
              >
                <svg-icon icon="question-icon"></svg-icon>
              </el-tooltip>
            </div>

            <div class="flex-row ideal-large-margin-top flex-row-start-center">
              <el-select
                v-if="basicData.form.mirrorType === 'public'"
                v-model="basicData.form.system"
                placeholder="请选择操作系统"
                class="ideal-default-margin-right"
              >
                <el-option
                  v-for="item of state.systemList"
                  :key="item.platform"
                  :label="item.platform"
                  :value="item.platform"
                />
              </el-select>

              <el-form-item prop="mirror">
                <el-select
                  v-model="basicData.form.mirror"
                  placeholder="请选择"
                  class="ideal-default-margin-right"
                >
                  <el-option
                    v-for="item of state.mirrorList"
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
          <div class="flex-column">
            <div class="flex-row">
              <el-form-item prop="systemDisk">
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
                :min="150"
                :max="1000"
              />
              <span class="ideal-default-margin-right">GiB</span>

              <el-tooltip
                popper-class="custom-tooltip"
                effect="dark"
                content="系统盘"
                placement="right"
              >
                <svg-icon icon="question-icon"></svg-icon>
              </el-tooltip>
            </div>

            <div
              v-for="(item, index) of basicData.form.dataDisks"
              :key="index"
              class="flex-row ideal-large-margin-top"
            >
              <el-select
                v-model="item.type"
                placeholder="请选择"
                class="ideal-default-margin-right"
              >
                <el-option
                  v-for="(item, index) of state.dataDiskList"
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
import type { IdealTableColumnHeaders } from '@/types'
import { useBasic } from './basic-config'
import { IHooksBasic } from './interface'

const formRef = ref<FormInstance>() // 校验表单
const rules = reactive<FormRules>({
  // billingMode: [{ required: true, message: '请选择付费类型', trigger: 'blur' }],
  // availableZone: [{ required: true, message: '请选择可用区', trigger: 'blur' }],
  // instanceName: [
  //   { required: true, message: '请输入实例名称', trigger: 'blur' }
  // ],
  // currentSpec: [{ required: true, message: '请选择规格', trigger: 'blur' }],
  // mirrorType: [{ required: true, message: '请选择镜像类型', trigger: 'blur' }],
  // mirror: [{ required: true, message: '请选择镜像', trigger: 'blur' }],
  // systemDisk: [{ required: true, message: '请选择系统盘类型', trigger: 'blur' }]
})

const state: IHooksBasic = reactive({})
const basicData = useBasic(state)

const {
  clickDeleteDataDisk,
  clickAddDataDisk,
  clickTableCellRow,
  clickImageRefresh
} = basicData

// 规格列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '实例类型', prop: 'specsTypeName' },
  { label: '规格名称', prop: 'name' },
  { label: 'vCPUs', prop: 'vcpus', useSlot: true },
  { label: '内存', prop: 'ram', useSlot: true },
  { label: 'CPU', prop: 'cpuName', useSlot: true }
]

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
  question = 'clickQuestion'
}
interface EventEmits {
  (e: EventEnum.question): void
}
const emit = defineEmits<EventEmits>()
// 显示抽屉
const handleQuestion = () => {
  emit(EventEnum.question)
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
    margin: 20px 0;
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
}
</style>
<style lang="scss">
.custom-tooltip {
  max-width: 260px;
}
</style>
