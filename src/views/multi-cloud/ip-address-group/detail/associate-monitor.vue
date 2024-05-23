<template>
  <div class="associate-monitor">
    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
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
import { IdealTableColumnHeaders, IdealTableColumnOperate } from '@/types'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'

/**
 * 列表
 */
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})

state.dataList = [
  {
    name: 'ipGroup-637ds',
    uuid: 'wq8x-2882dc- 9xqy',
    ipAddress: '192.168.10.10',
    createDate: '2023/10/11 11::36:30'
  }
]

// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '关联监听器', prop: 'ipAddress' },
  { label: '监听器协议/端口', prop: 'protocol' },
  { label: '访问策略', prop: 'strategy' }
]

const { sizeChangeHandle, currentChangeHandle } = useCrud(state)

// 列表操作
const operateBtns: IdealTableColumnOperate[] = []
const clickOperateEvent = (command: string | number | object, row: object) => {}
</script>

<style scoped lang="scss"></style>
