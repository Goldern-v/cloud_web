<template>
  <div class="ideal-main-container elastic-ip">
    <ideal-search :type-array="typeArray" @clickSearch="onClickSearch" />

    <el-divider />

    <ideal-button-events
      :left-btns="leftButtons"
      :right-btns="rightButtons"
      @clickLeftEvent="clickLeftEvent"
      @clickRightEvent="clickRightEvent"
    >
    </ideal-button-events>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      is-multiple
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #eip>
        <el-table-column label="弹性公网IP" width="270">
          <template #default="props">
            <div class="eip-table-title" @click="toDetail(props.row)">
              {{ props.row.ipAddress }}
            </div>

            <div class="eip-table-sub">
              {{ props.row.name }}
            </div>
            <ideal-text-copy
              :row="props.row"
              @mouseEnterEvent="value => (props.row.showCopy = value)"
              @mouseLeaveEvent="value => (props.row.showCopy = value)"
            />
          </template>
        </el-table-column>
      </template>

      <template #status>
        <el-table-column label="状态" width="150">
          <template #default="props">
            <ideal-status-icon
              v-if="props.row.status"
              :status-icon="props.row.statusIcon"
              :status-text="props.row.statusText"
            />
          </template>
        </el-table-column>
      </template>

      <template #bandwidthName>
        <el-table-column label="带宽" width="150">
          <template #default="props">
            <div class="eip-table-title" @click="toDetail(props.row)">
              {{ props.row.bandwidth?.name }}
            </div>
            <div v-if="props.row.shareType === 'WHOLE'">
              {{ props.row.shareTypeCN }}
            </div>
          </template>
        </el-table-column>
      </template>

      <template #bandwidthDetail>
        <el-table-column label="带宽详情" width="150">
          <template #default="props">
            <div class="eip-table-sub">
              {{ props.row.bandwidth?.chargeModeCN }}
            </div>

            <div class="eip-table-sub">
              {{ props.row.bandwidth?.size }}
              <span v-if="props.row.bandwidth?.size">Mbit/s</span>
            </div>
          </template>
        </el-table-column>
      </template>

      <template #instance>
        <el-table-column label="已绑定实例" width="150">
          <template #default="props">
            <div v-if="props.row.bindInstanceName">
              <el-tooltip
                effect="dark"
                placement="top-start"
                :content="props.row.bindInstanceName"
              >
                <div
                  class="eip-table-title eip-table-sub"
                  @click="toInstance(props.row)"
                >
                  {{ props.row.bindInstanceName }}
                </div>
              </el-tooltip>

              <div class="eip-table-sub">
                {{ props.row.bindInstanceType }}
              </div>
            </div>

            <div v-else class="ideal-warning-text">未绑定实例，扣费中</div>
          </template>
        </el-table-column>
      </template>

      <template #billingMode>
        <el-table-column label="计费模式" width="180">
          <template #default="props">
            <div @click="toDetail(props.row)">
              {{ props.row.billType === 'PACKAGE' ? '包年包月' : '按需' }}
            </div>

            <div class="eip-table-sub">
              {{ props.row.createTime?.date }}
            </div>

            <div v-if="props.row.expiredTime" class="eip-table-sub">
              {{ props.row.expiredTime }} 到期
            </div>
          </template>
        </el-table-column>
      </template>

      <template #tag>
        <el-table-column label="标签" width="150">
          <template #default="props">
            <ideal-tag-show
              :row="props.row"
              tag-key="cloudLabelDetails"
            ></ideal-tag-show>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="185" fixed="right">
          <template #default="props">
            <ideal-table-operate
              :max-buttons="3"
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
      :multiple-selection="multipleSelection"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>

    <ideal-set-table-header
      :show-drawer="showDrawer"
      :data-array="headerArray"
      @update:showDrawer="showDrawer = $event"
      @onClickSubmit="onClickSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import dialogBox from './dialog-box.vue'
import { eipList } from './list'

const {
  typeArray,
  onClickSearch,
  tableHeaders,
  state,
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  clickOperateEvent,
  leftButtons,
  clickLeftEvent,
  rightButtons,
  clickRightEvent,
  toDetail,
  clickCloseEvent,
  clickRefreshEvent,
  onClickSubmit,
  headerArray,
  showDialog,
  dialogType,
  rowData,
  multipleSelection,
  showDrawer,
  toInstance
} = eipList()
</script>

<style scoped lang="scss">
.elastic-ip {
  padding: $idealPadding;
  .elastic-ip__search {
    align-items: center;
    justify-content: space-between;
  }
  .eip-table-title {
    color: var(--el-color-primary);
    cursor: pointer;
  }
  .eip-table-sub {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
