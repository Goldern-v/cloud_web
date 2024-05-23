<template>
  <div class="ideal-main-container backup-policy">
    <div class="ideal-tip-text">你还可以创建31个备份策略。</div> 
    <div class="ideal-tip-text ideal-default-margin-top">备份策略需要绑定存储库才生效，请到存储库列表确认是否已经绑定。</div>
    <el-button type="primary" class="ideal-default-margin-top" @click="clickPolicyCreate">创建策略</el-button>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle">
      <template #name>
        <el-table-column label="名称/ID" show-overflow-tooltip>
          <template #default="props">
            <div>{{ props.row.name }}</div>
            <div>{{ props.row.uuid }}</div>
          </template>
        </el-table-column>
      </template>

      <template #enable>
        <el-table-column label="是否启用">
          <template #default="props">
            <ideal-status-icon
              v-if="props.row.enable"
              :status-icon="props.row.statusIcon"
              :status-text="props.row.enable"
            ></ideal-status-icon>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="185">
          <template #default="props">
            <ideal-table-operate
              :buttons="operateBtns"
              @clickMoreEvent="clickOperateEvent($event, props.row)"
            >
            </ideal-table-operate>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate
} from '@/types'

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
  { name: 'defaultPolicy', uuid: '0af2e923-982b-39ad-9402ba9e', backupTime: '23:12', backupCycle: '星期一', rule: '--', enable: '启用', statusIcon: 'status-success' }
]
// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true },
  { label: '是否启用', prop: 'enable', useSlot: true },
  { label: '备份时间', prop: 'backupTime' },
  { label: '备份周期', prop: 'backupCycle' },
  { label: '保留规则', prop: 'rule' }
]
// 列表行数据操作事件
const operateBtns: IdealTableColumnOperate[] = [
  { title: '停用', prop: 'hangUp' },
  { title: '编辑', prop: 'edit' },
  { title: '删除', prop: 'delete' }
]
const clickOperateEvent = (command: string | number | object, row: any) => {
  
}
const router = useRouter()
const clickPolicyCreate = () => {
  router.push({ path: '/multi-cloud/cloud-backup-policy/create' })
}
</script>

<style scoped lang="scss">
.backup-policy {
  padding: $idealPadding;
}
</style>