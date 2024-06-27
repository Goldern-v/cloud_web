<template>
  <div class="copy">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="计费模式" prop="billingMode">
        <el-radio-group v-model="form.billingMode">
          <el-radio-button label="onDemand">按需计费</el-radio-button>
        </el-radio-group>

        <el-tooltip
          popper-class="custom-tooltip"
          effect="dark"
          content="计费模式"
          placement="right"
        >
          <svg-icon icon="question-icon" class="ideal-svg-margin-left" />
        </el-tooltip>
      </el-form-item>

      <el-form-item label="名称" prop="name">
        <div>
          <el-input v-model="form.name" />
          <div class="ideal-tip-text">
            使用该配置创建的云服务器名称为伸缩配置名称加八位随机码。
          </div>
        </div>
      </el-form-item>

      <el-form-item label="规格" required>
        <div style="width: 100%">
          <div class="flex-row" style="width: 100%">
            <el-select
              v-model="specType"
              placeholder="请选择"
              class="ideal-default-margin-right"
              style="width: 20%"
            >
              <el-option
                v-for="(item, index) of specTypes"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>

            <div class="flex-row" style="width: 30%">
              <div style="width: 100px">规格名称</div>
              <el-input v-model="specName">
                <template #suffix>
                  <svg-icon icon="search-icon" />
                </template>
              </el-input>
            </div>
          </div>

          <el-form-item prop="spec" required>
            <ideal-table-list
              row-key="uuid"
              :loading="state.dataListLoading"
              :table-data="state.dataList"
              :table-headers="tableHeaders"
              :page="state.page"
              :is-radio="true"
              :show-pagination="false"
              @clickTableCellRow="clickTableCellRow"
              @clickSizeChange="sizeChangeHandle"
              @clickCurrentChange="currentChangeHandle"
              @handleSelectionChange="selectionChangeHandle"
            >
              <template #vCPUs>
                <el-table-column label="vCPUs">
                  <template #default="props">
                    <div>
                      {{ props.row.vcpus }}vCPUs | {{ props.row.memory }}GiB
                    </div>
                  </template>
                </el-table-column>
              </template>

              <template #standard>
                <el-table-column label="基准/最大带宽">
                  <template #default="props">
                    <div>
                      {{ props.row.standard }}/{{
                        props.row.maxBandwidth
                      }}Gbit/s
                    </div>
                  </template>
                </el-table-column>
              </template>
            </ideal-table-list>
          </el-form-item>
        </div>
      </el-form-item>

      <el-form-item label="镜像" required>
        <div class="flex-column">
          <div class="flex-row">
            <el-form-item prop="mirrorType">
              <el-radio-group
                v-model="form.mirrorType"
                class="ideal-default-margin-right"
              >
                <el-radio-button
                  v-for="(item, index) of mirrorTypeList"
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
              v-if="form.mirrorType === 'public'"
              v-model="form.system"
              placeholder="请选择"
              class="ideal-default-margin-right"
            >
              <el-option
                v-for="item of systemList"
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
                  v-for="item of mirrorList"
                  :key="item.uuid"
                  :label="item.osVersion"
                  :value="item.uuid"
                />
              </el-select>
            </el-form-item>

            <el-button v-if="form.mirrorType === 'private'" text type="primary"
              >新建私有镜像</el-button
            >
          </div>
        </div>
      </el-form-item>

      <el-form-item label="磁盘" prop="disk">
        <div>
          <el-radio-group v-model="form.disk">
            <el-radio-button label="cloudDisk">云硬盘</el-radio-button>
          </el-radio-group>

          <div
            v-for="(item, index) of form.dataDisks"
            :key="index"
            class="flex-row ideal-large-margin-top"
          >
            <el-select
              v-model="item.type"
              placeholder="请选择"
              class="ideal-default-margin-right"
            >
              <el-option
                v-for="(item, index) of dataDiskList"
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
            <el-button link type="primary" @click="clickDeleteDataDisk(index)"
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

      <el-form-item label="安全组" prop="safeGroup">
        <el-select
          v-model="form.safeGroup"
          placeholder="请选择"
          class="ideal-default-margin-right"
        >
          <el-option
            v-for="item of safeGroupList"
            :key="item.platform"
            :label="item.platform"
            :value="item.platform"
          />
        </el-select>

        <svg-icon icon="refresh-icon" />

        <el-button link type="primary">新建安全组</el-button>

        <el-tooltip
          popper-class="custom-tooltip"
          effect="dark"
          content="安全组"
          placement="right"
        >
          <svg-icon icon="question-icon" class="ideal-svg-margin-left" />
        </el-tooltip>
      </el-form-item>
    </el-form>

    <div class="flex-row footer-button">
      <el-button type="info" @click="cancelForm(formRef)">{{
        t('cancel')
      }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { generateCode } from '@/utils/tool'
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum } from '@/utils/enum'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders } from '@/types'

const { t } = useI18n()
const formRef = ref<FormInstance>()
const form = reactive({
  billingMode: '', // 计费模式
  name: 'as-config-' + generateCode(8), // 名称
  spec: '', // 规格
  mirrorType: '', // 镜像类型
  system: '', // 镜像操作系统
  mirror: '', // 镜像
  disk: '', // 磁盘
  dataDisks: [] as any[],
  safeGroup: '' // 安全组
})
const rules = reactive<FormRules>({
  billingMode: [{ required: true, message: '请选择计费模式', trigger: 'blur' }],
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  spec: [{ required: true, message: '请选择规格', trigger: 'blur' }],
  mirrorType: [{ required: true, message: '请选择镜像', trigger: 'blur' }],
  disk: [{ required: true, message: '请选择磁盘', trigger: 'blur' }],
  safeGroup: [{ required: true, message: '请选择安全组', trigger: 'blur' }]
})

// 规格
const specType = ref('')
const specTypes = ref<any[]>([])
const specName = ref('')

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList
} = useCrud(state)
state.dataList = [
  {
    uuid: '1',
    instanceName: '通用计算型s7',
    specName: 's7.small.1',
    vcpus: '1',
    memeory: '1',
    cpu: 'Inter Ice Lake',
    standard: '0.1',
    maxBandwidth: '0.8',
    intranet: '100000'
  }
]
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '实例名称', prop: 'instanceName' },
  { label: '规格名称', prop: 'specName' },
  { label: 'vCPUs', prop: 'vCPUs', useSlot: true },
  { label: 'CPU', prop: 'cpu' },
  { label: '基准/最大带宽', prop: 'standard', useSlot: true },
  { label: '内网收发包', prop: 'intranet' }
]
// 规格列表选择
const clickTableCellRow = (row: any) => {
  form.spec = row
}
// 镜像类型
const mirrorTypeList = [
  { label: 'public', value: '公有镜像' },
  { label: 'private', value: '私有镜像' },
  { label: 'shared', value: '共享镜像' }
]
const systemList = ref<any[]>([])
const mirrorList = ref<any[]>([])
// 数据盘
const dataDiskList = ref<any[]>([])
// 数据盘删除事件
const clickDeleteDataDisk = (index: number) => {
  form.dataDisks.splice(index, 1)
}
// 数据盘新增事件
const clickAddDataDisk = () => {
  form.dataDisks.push({ type: '', size: 1 })
}
// 可以新增数据盘配额
const diskQuota = computed(() => {
  const result = 10 - form.dataDisks.length
  return result
})
// 安全组
const safeGroupList = ref<any[]>([])
// 点击事件
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  emit(EventEnum.cancel)
}

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate((valid: boolean) => {
    if (!valid) {
      return
    }
    console.log('submit!')
    emit(EventEnum.success)
  })
}
</script>

<style scoped lang="scss">
.copy {
  width: 100%;
  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
<style lang="scss">
.custom-tooltip {
  max-width: 260px;
}
</style>
