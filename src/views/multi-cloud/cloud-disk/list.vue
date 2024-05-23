<template>
  <div class="ideal-main-container cloud-disk">
    <ideal-search ref="searchRef" :type-array="typeArray" @clickSearch="onClickSearch" />

    <el-divider />

    <ideal-button-events
      :left-btns="leftButtons"
      :right-btns="rightButtons"
      @clickLeftEvent="clickLeftEvent"
      @clickRightEvent="clickRightEvent"
    />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      :is-multiple="true"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #name>
        <el-table-column label="名称/ID" width="280" show-overflow-tooltip>
          <template #default="props">
            <el-button
              link
              type="primary"
              :disabled="props.row.statusIcon === 'loading'"
              @click="clickDetail(props.row)"
              >{{ props.row.name }}</el-button
            >

            <ideal-text-copy
              :row="props.row"
              @mouseEnterEvent="value => (props.row.showCopy = value)"
              @mouseLeaveEvent="value => (props.row.showCopy = value)"
            />
          </template>
        </el-table-column>
      </template>

      <template #status>
        <el-table-column label="状态" width="120">
          <template #default="props">
            <ideal-status-icon
              v-if="props.row.status"
              :status-icon="props.row.statusIcon"
              :status-text="props.row.statusText"
            />
          </template>
        </el-table-column>
      </template>

      <template #size>
        <el-table-column label="容量(GiB)">
          <template #default="props">
            <el-text>{{ props.row.size }}GiB</el-text>
          </template>
        </el-table-column>
      </template>

      <template #shareable>
        <el-table-column label="共享盘" show-overflow-tooltip>
          <template #default="props">
            <div class="cloud-disk-font-size">
              {{ props.row.shareable ? '共享盘' : '普通云硬盘' }}
            </div>
          </template>
        </el-table-column>
      </template>

      <template #billingMode>
        <el-table-column label="计费模式" width="150">
          <template #default="props">
            <el-tooltip
              effect="dark"
              placement="top-start"
              :content="'到期时间：' + props.row?.expiredTime"
              :disabled="props.row.billType !== BillingEnum.PACKAGE"
            >
              <el-button link type="primary" class="cloud-disk-font-size">{{
                props.row.billingMode
              }}</el-button>
            </el-tooltip>

            <div class="cloud-disk-font-size">
              {{ props.row.createTime.date }}
            </div>
          </template>
        </el-table-column>
      </template>

      <template #tag>
        <el-table-column label="标签" width="150">
          <template #default="props">
            <ideal-tag-show :row="props.row"></ideal-tag-show>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="props">
            <ideal-table-operate
              :buttons="props.row.operate"
              @clickMoreEvent="clickOperateEvent($event, props.row)"
            >
            </ideal-table-operate>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      :row-data="rowData"
      :select-data="state.dataListSelections"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    />
  </div>
</template>

<script setup lang="ts">
import dialogBox from './dialog-box.vue'
import { BillingEnum } from '@/utils/enum'
import { useList } from './list'

const {
  state,
  tableHeaders,
  showDialog,
  dialogType,
  leftButtons,
  clickLeftEvent,
  rightButtons,
  clickRightEvent,
  clickCloseEvent,
  clickRefreshEvent,
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  typeArray,
  onClickSearch,
  clickDetail,
  rowData,
  clickOperateEvent,
  searchRef
} = useList()

</script>

<style scoped lang="scss">
.cloud-disk {
  padding: $idealPadding;
  background-color: white;
  .cloud-disk-table-id {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 3px;
    font-size: $defaultFontSize;
  }
  .cloud-disk-font-size {
    font-size: $defaultFontSize;
  }
}
</style>
