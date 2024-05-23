<template>
  <div class="execute-backup">
    <div>如果需要使用备份创建镜像，请确保备份前已完成弹性云服务器优化并安装Cloud-init/Cloudbase-init工具(裸金属服务器的备份暂不支持创建镜像)：</div>
    <div>
      Linux:
      <el-text type="primary">Linux弹性云服务器优化，Cloud-init工具</el-text>
    </div>
    <div>
      Windows:
      <el-text type="primary">Windows弹性云服务器优化，Cloudbase-init工具</el-text>
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

      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" style="width: 50%;"/>
      </el-form-item>

      <el-form-item label="描述">
        <el-input v-model="form.description" type="textarea" style="width: 50%;"/>
      </el-form-item>

      <el-form-item label="执行全量备份">
        <el-checkbox v-model="form.fullBackup" label="启用"/>
      </el-form-item>
    </el-form>

    <div class="footer-container">
      <div class="flex-row footer-button">
        <el-button @click="clickCancel">{{ t('cancel') }}</el-button>
        <el-button type="primary" @click="clickSure">{{ t('confirm') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()

const formRef = ref<FormInstance>()
const form = reactive({
  name: '',
  description: '',
  fullBackup: false
})
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
})

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

const router = useRouter()
const clickCancel = () => {
  router.back()
}
const clickSure = () => {}
</script>

<style scoped lang="scss">
.execute-backup {
  margin: $idealMargin $idealMargin 60px;
  width: calc(100% - 80px);
  padding: 20px;
  background-color: white;
  :deep(.el-table) {
    height: 196px;
  }
  :deep(.el-table__header) {
    height: 49px;
  }
  :deep(.el-table tr) {
    height: 49px;
  }
  .footer-container {
    position: fixed;
    width: calc(100% - $sidebarWidth);
    height: 60px;
    bottom: 0;
    left: $sidebarWidth;
    background: #fff;
    z-index: 2000;
    box-shadow: 5px 5px 17px 9px #e5e9ea;
    text-align: center;
    overflow: hidden;
    .footer-button {
      justify-content: flex-end;
      align-items: center;
      height: 100%;
      padding-right: 20px;
    }
  }
}
</style>
