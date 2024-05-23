<template>
  <div class="bind">
    <div>
      如果需要使用备份创建镜像，请确保备份前已完成弹性云服务器优化并安装Cloud-init/Cloudbase-init工具(裸金属服务器的备份暂不支持创建镜像)：
    </div>
    <div>
      Linux:
      <el-text type="primary"
        >Linux弹性云服务器优化，Cloud-init工具</el-text
      >
    </div>
    <div>
      Windows:
      <el-text type="primary"
        >Windows弹性云服务器优化，Cloudbase-init工具</el-text
      >
    </div>

    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item>
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

      <el-form-item>
        <el-row style="width: 100%">
          <el-col :span="14">
            <div>
              <div class="flex-row" style="justify-content: flex-end">
                <el-select v-model="status" placeholder="请选择" class="ideal-default-margin-right">
                  <el-option
                    v-for="item of statusList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>

                <el-input v-model="searchValue" class="bind-search ideal-default-margin-right">
                  <template #prefix>
                    <el-select v-model="searchType" placeholder="请选择">
                      <el-option
                        v-for="item of searchList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                    <el-divider direction="vertical" />
                  </template>
                  <template #suffix>
                    <svg-icon icon="search-icon" style="cursor:pointer;" @click="clickSearch"/>
                  </template>
                </el-input>

                <el-button class="bind-refresh" @click="clickReset">
                  <svg-icon icon="refresh-icon"/>
                </el-button>
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
                        {{ props.row.uuid }}
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
            <div style="margin-left: 10px">
              <div class="flex-row" style="justify-content: flex-end">
                <el-input v-model="selectedSearch" class="bind-search">
                  <template #prefix>
                    <el-select v-model="selectedSearchType" placeholder="请选择">
                      <el-option
                        v-for="item of searchList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                    <el-divider direction="vertical" />
                  </template>
                  <template #suffix>
                    <svg-icon icon="search-icon" style="cursor:pointer;"/>
                  </template>
                </el-input>
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
    </el-form>

    <div class="flex-row footer-button">
      <el-button type="info" @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{ t('confirm') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum } from '@/utils/enum'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders } from '@/types'

const { t } = useI18n()
const searchValue = ref('')
const searchType = ref('')
// 已选磁盘搜索值
const selectedSearch = ref('')
const selectedSearchType = ref('')

const searchList = ref([
  { label: '名称', value: 'name' },
  { label: 'ID', value: 'id' }
])

const formRef = ref<FormInstance>()
const form = reactive({})
const rules = reactive<FormRules>({})
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
  searchValue.value = ''
  searchType.value = 'name'
  state.page = 1
  state.queryForm = {}
  getDataList()
}
const status = ref()
const statusList = ref<any>([])

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
  formEl.validate(valid => {
    if (valid) {
      console.log('submit!')
      emit(EventEnum.success)
    } else {
      console.log('error submit!')
      return false
    }
  })
}
</script>

<style scoped lang="scss">
.bind {
  width: 100%;
  .bind-search {
    width: 280px;
    :deep(.el-select) {
      --el-select-border-color-hover: transparent;
      --el-select-disabled-border: transparent;
      --el-select-close-hover-color: transparent;
      --el-select-multiple-input-color: transparent;
      --el-select-input-focus-border-color: transparent;
    }
    :deep(.el-input) {
      --el-input-border-color: transparent;
      height: 30px;
    }
  }
  .bind-refresh {
    width: 34px;
    height: 34px;
  }
  .ideal-default-margin-right {
    margin-right: 10px;
  }
  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
  :deep(.el-select .el-input) {
    width: 90px;
  }
  :deep(.el-input-group) {
    width: 220px;
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
}
</style>
