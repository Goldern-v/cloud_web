<template>
  <div class="create">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-card>
        <div class="flex-row create-notice">
          <div class="ideal-default-margin-right">快照须知</div>
          <div>
            <div>
              只有可用或正在使用状态的磁盘才能创建快照。快照免费试用期间，单个磁盘最大支持创建7个快照。
            </div>
            <div>
              加密磁盘的快照数据以加密方式存放，非加密磁盘的快照数据以非加密方式存放。
            </div>
          </div>
        </div>

        <el-form-item label="区域" class="ideal-large-margin-top">
          <el-select v-model="form.area" placeholder="请选择">
            <el-option
              v-for="item of areaList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="快照名称" prop="name">
          <el-input v-model="form.name" style="width: 200px" />
        </el-form-item>

        <el-form-item label="选择磁盘" required>
          <div style="width: 100%">
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
                :options="searchOptions"
                @clickSearch="clickSearch"
                @clickReset="clickReset"
              />
            </div>

            <el-form-item prop="disk">
              <ideal-table-list
                row-key="uuid"
                :loading="state.dataListLoading"
                :table-data="state.dataList"
                :table-headers="tableHeaders"
                :page="state.page"
                :is-radio="true"
                :show-pagination="false"
                @clickTableCellRow="clickTableCellRow"
              >
                <template #status>
                  <el-table-column label="状态">
                    <template #default="props">
                      <ideal-status-icon
                        v-if="props.row.status"
                        :status-icon="props.row.statusType"
                        :status-text="props.row.status"
                      />
                    </template>
                  </el-table-column>
                </template>
              </ideal-table-list>
            </el-form-item>

            <div v-if="form.disk" class="ideal-default-margin-top">
              当前选择磁盘<span class="create-select-disk">{{ diskInfo }}</span>
            </div>
            <el-text v-if="form.disk" type="info"
              >该磁盘已创建0个快照，还可以创建7个快照。</el-text
            >
          </div>
        </el-form-item>
      </el-card>
    </el-form>

    <div :class="showSidebar ? 'create-footer' : 'create-footer-small'">
      <div class="flex-row create-footer-button">
        <el-button type="primary" @click="submitForm(formRef)"
          >立即创建</el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { IdealTableColumnHeaders } from '@/types'
import store from '@/store'

const formRef = ref<FormInstance>()
const form = reactive({
  area: '', // 区域
  name: 'snapshot-' + Math.random().toString(36).substring(9), // 快照名称
  disk: ''
})
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  disk: [{ required: true, message: '请选择磁盘', trigger: 'blur' }]
})
const areaList: any = []

const showSidebar = computed(() => store.appStore.sidebarOpened)

// 状态
const status = ref('1')
const statusList: any = [
  { label: '所有状态', value: '1' },
  { label: '可用', value: '2' },
  { label: '正在使用', value: '3' }
]
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
// 列表下拉搜索
const searchOptions = [
  { label: '磁盘名称', prop: 'name' },
  { label: '磁盘ID', prop: 'id' }
]
// 列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const { getDataList } = useCrud(state)
state.dataList = [
  {
    name: 'vpn跳板-不要动',
    uuid: 'e916a919-9dae-439f-a24a-becdfa7ab9ce',
    status: '正在使用',
    statusStr: 'using',
    statusType: 'status-success',
    spec: '通用型SSD | 40 GiB',
    attribute: '系统盘',
    mode: 'VBD',
    encrypt: '否',
    availableZone: '可用区4'
  }
]
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '磁盘名称', prop: 'name' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '磁盘规格', prop: 'spec' },
  { label: '磁盘属性', prop: 'attribute' },
  { label: '磁盘模式', prop: 'mode' },
  { label: '加密盘', prop: 'encrypt' },
  { label: '可用区', prop: 'availableZone' }
]
const diskInfo = ref('')
const clickTableCellRow = (row: any) => {
  form.disk = row
  diskInfo.value = `${row.name} | ${row.uuid}`
}
// 提交
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate((valid: boolean) => {
    if (!valid) {
      return
    }
  })
}
</script>

<style scoped lang="scss">
$bottomHeight: 60px;
.create {
  margin: $idealMargin $idealMargin 80px;
  :deep(.el-form) {
    padding: 0;
  }
  .create-notice {
    border: 1px solid $sub3-light;
    border-radius: $circleRadiusSize;
    padding: $idealPadding;
  }
  .create-select-disk {
    font-weight: 500;
    font-size: 14px;
    margin-left: 10px;
  }
  .create-footer,
  .create-footer-small {
    position: fixed;
    width: calc(100% - $sidebarWidth);
    bottom: 0;
    left: $sidebarWidth;
    background: #fff;
    z-index: 2000;
    box-shadow: 5px 5px 17px 9px #e5e9ea;
    text-align: center;
    overflow: hidden;
    height: $bottomHeight;
    line-height: $bottomHeight;
    .create-footer-button {
      justify-content: flex-end;
      align-items: center;
      height: 100%;
      margin-right: $idealMargin;
    }
  }
  .create-footer-small {
    width: calc(100% - $sidebarSmallWidth);
    left: $sidebarSmallWidth;
  }
}
</style>
