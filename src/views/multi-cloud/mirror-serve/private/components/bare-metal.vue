<template>
  <div class="bare-metal">
    <div class="bare-metal__tip">
      <div>只有关机状态下的快速发放型裸金属服务器（操作系统安装在云硬盘中）才可以用来创建私有镜像。如果选择的裸金属服务器状态是“运行中”，请先关机。请勿在创建镜像过程中对所选择的裸金属服务器及其相关资源进行其他操作。</div>
      <div>请确认裸金属服务器各项属性已配置正确。</div>
    </div>

    <div class="flex-row">
      <el-select
        v-model="bareMetalStatus"
        placeholder="请选择"
        class="ideal-default-margin-right"
      >
        <el-option
          v-for="item of statusOptions"
          :key="item.prop"
          :label="item.label"
          :value="item.prop"
        />
      </el-select>
      
      <ideal-select-search
        :options="searchOptions"
        prefix-title="名称查询"
        @clickSearch="clickSearch"
        @clickReset="clickReset"
      />
    </div>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :is-radio="true"
      row-key="uuid"
      :show-pagination="false"
      @clickTableCellRow="clickTableCellRow"
    >
      <template #expandTable>
        <el-table-column type="expand">
          <div style="padding: 0 5%;">已挂载磁盘信息</div>
          <ideal-table-list 
            style="width: 100%;padding: 0 5%;"
            :loading="volume.dataListLoading"
            :table-data="volume.dataList"
            :table-headers="volumeTableHeaders"
            :show-pagination="false">
            <template #name>
              <el-table-column label="名称">
                <template #default="child">
                  <div>{{ child.row.name }}</div>
                </template>
              </el-table-column>
            </template>
          </ideal-table-list>
        </el-table-column>
      </template>

      <template #name>
        <el-table-column label="名称">
          <template #default="props">
            <div>{{ props.row.name }}</div>
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
    <el-button type="primary" link>购买裸金属服务器</el-button>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders } from '@/types'

// 云服务器搜索条件
const bareMetalStatus = ref('1')
const statusOptions = [
  { label: '所有状态', prop: '1' },
  { label: '运行中', prop: '2' },
  { label: '关机', prop: '3' },
  { label: '创建中', prop: '4' },
  { label: '故障', prop: '5' }
]
const searchOptions = [
  { label: '名称', prop: 'name' },
  { label: '私有IP地址', prop: 'ip' },
  { label: 'ID', prop: 'id' }
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
  { name: '测试1', uuid: '0923-0923-3452-453a', status: '运行中', statusType: 'status-success', system: 'Ubuntu 18.04 server 64bit', ip: '192.168.0.23', createTime: '2023-08-31 10:09:20' }
]
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true },
  { label: '操作系统', prop: 'system' },
  { label: '运行状态', prop: 'status', useSlot: true },
  { label: '创建时间', prop: 'createTime' }
]
const clickTableCellRow = (row: any) => {
  emit('clickTableCell', row)
}
// 已挂载磁盘信息列表 
const volume: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
useCrud(volume)

volume.dataList = [
  { name: '测试1',  size: '40', volumeType: '通用型SSD', volume: '系统盘', encrypt: '否' }
]
const volumeTableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true },
  { label: '容量(GiB)', prop: 'size' },
  { label: '磁盘类型', prop: 'volumeType' },
  { label: '磁盘属性', prop: 'volume' },
  { label: '加密盘', prop: 'encrypt' }
]
// 方法
interface EventEmits {
  (e: 'clickTableCell', v: any): void
}
const emit = defineEmits<EventEmits>()

</script>

<style scoped lang="scss">
.bare-metal {
  width: 100%;
  .bare-metal__tip {
    background-color: var(--el-color-primary-light-9);
    padding: 10px 20px;
    align-items: center;
    margin-bottom: 10px;
  }
}
</style>