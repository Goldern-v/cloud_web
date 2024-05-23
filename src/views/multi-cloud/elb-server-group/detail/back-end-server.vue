<template>
  <div class="back-end-server">
    <el-card>
      <div class="back-end-server_header flex-row">
        <div class="flex-row">
          <svg-icon
            icon="up-arrow"
            class="ideal-svg-margin-right"
            @click="showDetail = !showDetail"
          ></svg-icon
          >云服务器
        </div>
        <ideal-button-events
          :right-btns="attrData.rightButtons"
          @clickRightEvent="clickRightEvent"
        >
        </ideal-button-events>
      </div>

      <ideal-table-list
        v-if="showDetail"
        :loading="state.dataListLoading"
        :table-data="state.dataList"
        :table-headers="tableHeaders"
        :page="state.page"
        :is-multiple="true"
        @clickSizeChange="sizeChangeHandle"
        @clickCurrentChange="currentChangeHandle"
        @handleSelectionChange="selectionChangeHandle"
      >
        <template #name>
          <el-table-column label="名称/ID">
            <template #default="props">
              <el-text type="primary" @click="clickRedirectDetail(props.row)">
                {{ props.row.name }}
              </el-text>

              <ideal-text-copy
                :row="props.row"
                @mouseEnterEvent="value => (props.row.showCopy = value)"
                @mouseLeaveEvent="value => (props.row.showCopy = value)"
              />
            </template>
          </el-table-column>
        </template>

        <template #result>
          <el-table-column label="健康检查结果">
            <template #default="props">
              <div>
                <svg-icon
                  icon="info-warning"
                  color="#F3AD3C"
                  class="ideal-svg-margin-right"
                ></svg-icon>
                <el-text class="ideal-default-margin-right" type="primary">{{
                  props.row.result
                }}</el-text>
                <el-text type="primary">详情</el-text>
              </div>
            </template>
          </el-table-column>
        </template>
      </ideal-table-list>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import type { IdealButtonEventProp, IdealTableColumnHeaders } from '@/types'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'

const showDetail = ref(true)

const attrData: any = reactive({
  rightButtons: [] as IdealButtonEventProp[]
})

// 列表右侧按钮
attrData.rightButtons = [
  { title: '添加', prop: 'create', disabled: false },
  { title: '修改权重', prop: 'edit', disabled: true },
  { title: '移除', prop: 'remove', disabled: true }
]
const clickRightEvent = () => {}

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  queryForm: {}
})

state.dataList = [
  {
    name: '测试',
    uuid: 'edw45-whd78-3d8hds-38hfc',
    statusText: '关机',
    privateIp: '192.168.0.211',
    result: '异常'
  }
]

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称/ID', prop: 'name', useSlot: true },
  { label: '状态', prop: 'statusText' },
  { label: '私网IP地址', prop: 'privateIp' },
  { label: '健康检查结果', prop: 'result', useSlot: true },
  { label: '权重', prop: 'weight' },
  { label: '业务端口', prop: 'port' }
]

const { sizeChangeHandle, currentChangeHandle, selectionChangeHandle } =
  useCrud(state)

const router = useRouter()
const clickRedirectDetail = (row: any) => {
  const detail = JSON.stringify(row)
  router.push({
    path: '',
    query: {
      detail
    }
  })
}
</script>

<style scoped lang="scss">
.back-end-server {
  margin: $idealMargin 0;
  background-color: #fff;
  padding: $idealPadding;
  .back-end-server_header {
    align-items: center;
    justify-content: space-between;
  }
  .ideal-button-events__container {
    width: 90%;
  }
}
</style>
