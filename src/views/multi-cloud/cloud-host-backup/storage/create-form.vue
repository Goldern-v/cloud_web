<template>
  <div class="create-form">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-card>
        <el-form-item label="计费模式">
          <div>
            <div class="flex-row">
              <el-radio-group v-model="form.billingMode" class="ideal-default-margin-right">
                <el-radio-button
                  v-for="(item, index) of billingModeList"
                  :key="index"
                  :label="item.label"
                >
                  {{ item.value }}
                </el-radio-button>
              </el-radio-group>

              <el-tooltip
                popper-class="custom-tooltip"
                effect="dark"
                content="计费模式"
                placement="right"
              >
                <svg-icon icon="question-icon"></svg-icon>
              </el-tooltip>
            </div>

            <div class="ideal-tip-text">
              包年包月是预付费模式，按订单的购买周期计费，适用于可预估资源使用周期的场景，价格比按需计费模式更优惠。
            </div>
          </div>
        </el-form-item>

        <el-form-item label="区域">
          <div>
            <el-radio-group v-model="form.region">
              <el-radio-button label="上海一"></el-radio-button>
            </el-radio-group>
            <div class="ideal-tip-text">
              不同区域的资源之间内网不互通。请选择靠近您客户的区域，可以降低网络延迟、提供访问速度。
            </div>
          </div>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="保护类型">
          <div>
            <el-radio-group v-model="form.protectType">
              <el-radio-button label="备份"></el-radio-button>
            </el-radio-group>
            <div class="ideal-tip-text">
              创建的存储库类型将为备份存储库，用于存放受保护资源产生的备份副本。
            </div>
          </div>
        </el-form-item>

        <el-form-item label="选择服务器">
          <el-radio-group v-model="form.selectServer" class="ideal-default-margin-right">
            <el-radio-button
              v-for="(item, index) of selectArray"
              :key="index"
              :label="item.label"
            >
              {{ item.value }}
            </el-radio-button>
          </el-radio-group>

          <el-tooltip
            popper-class="custom-tooltip"
            effect="dark"
            content="服务器"
            placement="right"
          >
            <svg-icon icon="question-icon"></svg-icon>
          </el-tooltip>
        </el-form-item>

        <el-form-item v-if="form.selectServer === '1'">
          <el-row style="width: 100%">
            <el-col :span="14">
              <el-form-item label="服务器列表" />
            </el-col>

            <el-col :span="10">
              <el-form-item>
                <template #label>
                  <div>已选择服务器({{ state?.dataListSelections?.length }})</div>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item v-if="form.selectServer === '1'">
          <el-row style="width: 100%">
            <el-col :span="14">
              <div>
                <div class="flex-row" style="justify-content: flex-end">
                  <el-select
                    v-model="status"
                    placeholder="请选择"
                    style="width: 120px"
                    class="ideal-default-margin-right"
                  >
                    <el-option
                      v-for="item of statusList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>

                  <ideal-select-search
                    @clickSearch="clickSearch"
                    @clickReset="clickReset"
                  />
                </div>

                <ideal-table-list
                  ref="tableRef"
                  :loading="state.dataListLoading"
                  :table-data="state.dataList"
                  :table-headers="tableHeaders"
                  :page="state.page"
                  :show-pagination="false"
                  :is-multiple="true"
                  @handleSelectionChange="selectionChangeHandle"
                >
                  <template #name>
                    <el-table-column
                      label="名称/ID"
                      show-overflow-tooltip
                    >
                      <template #default="props">
                        <el-button link type="primary">{{
                          props.row.name
                        }}</el-button>
                        <div class="cloud-host-table-id">
                          {{ props.row.id }}
                        </div>
                      </template>
                    </el-table-column>
                  </template>

                  <template #status>
                    <el-table-column label="状态">
                      <template #default="props">
                        <ideal-status-icon
                          v-if="props.row.status"
                          :status-icon="props.row.statusType"
                          :status-text="props.row.status"
                        ></ideal-status-icon>
                      </template>
                    </el-table-column>
                  </template>
                </ideal-table-list>
              </div>
            </el-col>

            <el-col :span="10">
              <div class="ideal-default-margin-left">
                <div class="flex-row" style="justify-content: flex-end">
                  <ideal-select-search
                    @clickSearch="clickSearch"
                    @clickReset="clickReset"
                  />
                </div>

                <ideal-table-list
                  :table-data="state.dataListSelections"
                  :table-headers="selectedHeaders"
                  :page="state.page"
                  :show-pagination="false"
                >
                  <template #name>
                    <el-table-column
                      label="名称/ID"
                      show-overflow-tooltip
                    >
                      <template #default="props">
                        <el-button link type="primary">{{
                          props.row.name
                        }}</el-button>
                        <div class="cloud-host-table-id">
                          {{ props.row.id }}
                        </div>
                      </template>
                    </el-table-column>
                  </template>

                  <template #operation>
                    <el-table-column label="操作" width="185">
                      <template #default="props">
                        <svg-icon
                          icon="delete-icon"
                          @click="clickDeleteSelected(props.row)"
                        />
                      </template>
                    </el-table-column>
                  </template>
                </ideal-table-list>
              </div>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="存储库容量" required>
          <div>
            <div class="flex-row">
              <el-form-item prop="repositorySize">
                <el-input-number
                  v-model="form.repositorySize"
                  class="ideal-default-margin-right"
                  :min="10"
                />
              </el-form-item>

              <el-select
                v-model="form.repositoryUnit"
                placeholder="请选择"
                style="width: 100px"
              >
                <el-option
                  v-for="(item, idx) of repositoryUnits"
                  :key="idx"
                  :label="item.label"
                  :value="item.label"
                />
              </el-select>
            </div>

            <div class="ideal-tip-text">
              当前所选磁盘空间为40GB。为了保证连续性，建议存储空间不小于所选备份服务器磁盘空间。
            </div>

            <div class="ideal-error-text">
              当备份总容量超出存储库容量时，备份将会失败。
            </div>
          </div>
        </el-form-item>

        <el-form-item label="自动备份">
          <div style="width: 100%">
            <el-radio-group v-model="form.autoBackup" class="ideal-default-margin-right">
              <el-radio-button
                v-for="(item, index) of selectArray"
                :key="index"
                :label="item.label"
              >
                {{ item.value }}
              </el-radio-button>
            </el-radio-group>

            <div class="ideal-tip-text">
              将备份策略绑定到存储库中，按照备份策略进行自动备份。
            </div>

            <div class="flex-row">
              <div class="ideal-default-margin-right">备份策略</div>

              <el-select
                v-model="form.backupPolicy"
                placeholder="请选择"
                class="ideal-default-margin-right"
                style="width: 50%"
              >
                <el-option
                  v-for="(item, idx) of backupPolicies"
                  :key="idx"
                  :label="item.label"
                  :value="item.label"
                />
              </el-select>

              <svg-icon icon="refresh-icon" class="ideal-svg-margin-right" />

              <el-button link type="primary">创建策略</el-button>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="自动绑定">
          <el-radio-group v-model="form.autoBind" class="ideal-default-margin-right">
            <el-radio-button
              v-for="(item, index) of selectArray"
              :key="index"
              :label="item.label"
            >
              {{ item.value }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="标签">
          <div style="width: 100%">
            <div>
              标签仅供资源管理使用，暂不支持话单计费。如果您需要使用同一标签识别多种云资源，即所有服务均可在标签输入框下拉选择同一标签，建议在TMS中创建预定义标签。
            </div>

            <div
              v-for="(item, index) of form.tags"
              :key="index"
              class="flex-row create-form-tags"
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
              <el-button link type="primary" @click="clickAddTag"
                >添加标签</el-button
              >
              <div>您还可以添加10个标签。</div>
            </div>
          </div>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="存储库名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>

        <el-form-item v-if="isPackage" label="购买时长">
          <div class="flex-column">
            <el-radio-group v-model="form.buyTime" class="ideal-default-margin-right">
              <el-radio-button
                v-for="(item, index) in timeValues"
                :key="index"
                :label="item.value"
              >
                {{ item.label }}
              </el-radio-button>
            </el-radio-group>

            <el-checkbox v-model="form.autoRenew" label="自动续费" />
          </div>
        </el-form-item>
      </el-card>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { EmitsEnum, BillingEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders } from '@/types'
import emits from '@/utils/emits'

const formRef = ref<FormInstance>()
const form = reactive({
  billingMode: BillingEnum.PACKAGE, // 计费模式
  region: '', // 区域
  protectType: '', // 保护类型
  selectServer: '', // 选择服务器
  repositorySize: 10, // 存储库容量
  repositoryUnit: 'GB', // 存储库容量单位
  autoBackup: '', // 自动备份
  backupPolicy: '', // 备份策略
  autoBind: '', // 自动绑定
  tags: [{ key: '', value: '' }],
  name: '', // 存储库名称
  buyTime: 1,
  autoRenew: false // 自动续费
})
const rules = reactive<FormRules>({
  repositorySize: [
    { required: true, message: '请选择存储库容量大小', trigger: 'blur' }
  ],
  name: [{ required: true, message: '请选择存储库名称', trigger: 'blur' }]
})

onMounted(() => {
  form.name = 'vault-' + Math.random().toString(36).substring(9)
})

const isPackage = computed(() => form.billingMode === BillingEnum.PACKAGE)
watch(() => form.billingMode, value => {
  emits.emit(EmitsEnum.CHBChangeBillingMode, { billingMode: value })
})
const billingModeList = [
  { label: BillingEnum.PACKAGE, value: '包年包月' },
  { label: BillingEnum.ON_DEMAND, value: '按需收费' }
]
const selectArray = [
  { label: '1', value: '立即配置' },
  { label: '2', value: '暂不配置' }
]
const repositoryUnits = [{ label: 'GB' }]
const backupPolicies: any = []
// 添加标签
const clickAddTag = () => {
  form.tags.push({ key: '', value: '' })
}
const clickDeleteTag = (index: number) => {
  if (form.tags.length === 1) {
    return
  }
  form.tags.splice(index, 1)
}
// 购买时长
const timeValues = [
  { label: '1月', value: 1 },
  { label: '2月', value: 2 },
  { label: '3月', value: 3 },
  { label: '4月', value: 4 },
  { label: '5月', value: 5 },
  { label: '6月', value: 6 },
  { label: '7月', value: 7 },
  { label: '8月', value: 8 },
  { label: '9月', value: 9 },
  { label: '10月', value: 10 },
  { label: '11月', value: 11 },
  { label: '1年', value: 12 },
  { label: '2年', value: 13 },
  { label: '3年', value: 14 },
  { label: '4年', value: 15 },
  { label: '5年', value: 16 }
]
// 列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  isPage: false,
  queryForm: {}
})
const { getDataList, selectionChangeHandle } = useCrud(state)
state.dataList = [
  {
    name: 'ecs-08f2',
    uuid: '09a9db7e-0ae8-30ab-32a21e2f',
    status: '关机',
    statusType: 'status-error',
    type: '弹性云服务器',
    availableZone: '可用区3',
    bindStatus: '否',
    selected: 1
  },
  {
    name: 'ecs-09ab',
    uuid: '20a1db7e-0a18-30ab-32a21e2f',
    status: '关机',
    statusType: 'status-error',
    type: '弹性云服务器',
    availableZone: '可用区3',
    bindStatus: '否',
    selected: 1
  }
]
// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '类型', prop: 'type' },
  { label: '可用区', prop: 'availableZone' },
  { label: '绑定状态', prop: 'bindStatus' }
]
// 已选云服务器
const selectedHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true },
  { label: '已选磁盘', prop: 'selected' }
]
// 云服务器列表
const tableRef = ref()
// 已选服务器删除
const clickDeleteSelected = (item: any) => {
  tableRef.value.IdealTableList.toggleRowSelection(item, false)
}
// 搜索
const clickSearch = (search: string, type: string) => {
  state.queryForm.type = type
  state.queryForm.search = search
  getDataList()
}
// 重置
const clickReset = () => {
  state.page = 1
  state.queryForm = {}
  getDataList()
}
const status = ref()
const statusList = ref<any>([])

defineExpose({
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
  :deep(.el-table) {
    height: 196px;
  }
  :deep(.el-table__header) {
    height: 49px;
  }
  :deep(.el-table tr) {
    height: 49px;
  }
  .create-form-tags {
    margin: 10px 0 0;
    align-items: center;
    justify-content: flex-start;
  }
}
</style>
<style lang="scss">
.custom-tooltip {
  max-width: 260px;
}
</style>
