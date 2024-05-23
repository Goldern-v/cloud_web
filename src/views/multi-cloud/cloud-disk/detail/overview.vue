<template>
  <div class="overview">
    <info :detail="detail" @clickRefreshDetail="clickRefreshDetail"/>

    <div class="overview-collapse ideal-large-margin-top">
      <div class="flex-row" style="align-items: center">
        <svg-icon
          icon="success-icon"
          class-name="success-icon"
          class="ideal-svg-margin-right"
        />
        <div>正在使用</div>
        <el-divider direction="vertical" />
        <div>
          <div class="flex-row">
            <div class="overview-collapse-label">云服务器</div>
            <el-button link type="primary" @click="clickToEcs">{{ mountCount }}</el-button>
          </div>
          <div class="flex-row">
            <div class="overview-collapse-label">备份</div>
            <el-button link type="primary">0</el-button>
          </div>
          <div class="flex-row">
            <div class="overview-collapse-label">快照</div>
            <el-button link type="primary">0</el-button>
          </div>
        </div>
      </div>

      <el-collapse accordion>
        <el-collapse-item name="1">
          <template #title>
            <div class="flex-row collapse-title" @click.stop>
              <span style="width: calc(100% - 50px); text-align: left"
                >云服务器</span
              >

              <el-tooltip
                popper-class="custom-tooltip"
                effect="dark"
                placement="top"
                :disabled="!isMounted"
              >
                <template #content>
                  <div>只有可用状态的非共享盘才能挂载。</div>
                </template>
                <el-button
                  link
                  type="primary"
                  style="width: 50px"
                  :disabled="isMounted"
                  @click="clickMountECS"
                  >挂载</el-button
                >
              </el-tooltip>
            </div>
          </template>
          <div v-if="isMounted" class="flex-row flex-row-center">
            <el-button link type="primary">{{ detail.instanceName }}</el-button>
            <el-button link type="primary" class="ideal-default-margin-right"
              >查看监控指标</el-button
            >
            <ideal-status-icon
              v-if="detail.status"
              :status-icon="detail.statusIcon"
              :status-text="detail.statusText"
            />
          </div>
          <div v-else>
            <div>您暂时没有挂载到云服务器。</div>
            <div>磁盘为云服务器提供块存储服务。</div>
          </div>
        </el-collapse-item>

        <el-collapse-item title="Feedback" name="2">
          <template #title>
            <div class="flex-row collapse-title" @click.stop>
              <span style="width: calc(100% - 80px); text-align: left"
                >备份</span
              >
              <el-button
                link
                type="primary"
                style="width: 80px"
                @click="clickBackupCreate"
                >创建备份</el-button
              >
            </div>
          </template>
          <div>
            <div>您暂时没有备份。</div>
            <div>云备份可以为磁盘创建在线备份，无需关闭云服务器。</div>
          </div>
        </el-collapse-item>

        <el-collapse-item title="Efficiency" name="3">
          <template #title>
            <div class="flex-row collapse-title" @click.stop>
              <span style="width: calc(100% - 80px); text-align: left"
                >快照</span
              >
              <el-button
                link
                type="primary"
                style="width: 80px"
                @click="clickSnapShootCreate"
                >创建快照</el-button
              >
            </div>
          </template>
          <div>
            <div>
              <div>您暂时没有创建快照。</div>
              <div>快照可快速保存指定时刻的磁盘数据。</div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      :row-data="detail"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    />
  </div>
</template>

<script setup lang="ts">
import dialogBox from '../dialog-box.vue'
import { cloudDiskDetail } from '@/api/java/store'
import { OperateEventEnum, BillingEnum } from '@/utils/enum'
import { RESOURCE_STATUS, RESOURCE_STATUS_ICON } from '@/utils/dictionary'

import info from './info.vue'

const route = useRoute()
const id = route.query.id
onMounted(() => {
  getDetail()
})
// 详情
const detail = ref<any>({})
// 挂载数
const mountCount = ref(0)
const isMounted = ref(false)
const getDetail = () => {
  cloudDiskDetail({ id })
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        detail.value = data
        detail.value.billingMode =
          data.billType === BillingEnum.ON_DEMAND ? '按需' : '包年包月'
        detail.value.createDate = data.createTime.date
        detail.value.shareableStr = data.shareable ? '是' : '否'
        detail.value.encryptedStr = data.encrypted ? '是' : '否'
        detail.value.diskAttribute = data.bootable === 1 ? '系统盘' : '数据盘'
        detail.value.statusText = RESOURCE_STATUS[data?.status]
        detail.value.statusIcon = RESOURCE_STATUS_ICON[data?.status]
        // 绑定云服务器id,判断云硬盘是否有挂载
        if (data.hasOwnProperty('instanceId') && data?.instanceId) {
          mountCount.value = 1
          isMounted.value = true
        }
      } else {
        detail.value = {}
      }
    })
    .catch(_ => {
      detail.value = {}
    })
}
// 名称修改后刷新
const clickRefreshDetail = () => {
  getDetail()
}
const clickToEcs = () => {
  emit('clickDetailType', 'ecs')
}

const clickMountECS = () => {
  showDialog.value = true
  dialogType.value = OperateEventEnum.mount
}
const clickBackupCreate = () => {
  console.log('---clickBackupCreate---')
}
const clickSnapShootCreate = () => {
  console.log('---clickSnapShootCreate---')
}
// 方法
interface EventEmits {
  (e: 'clickDetailType', v: string): void
}
const emit = defineEmits<EventEmits>()
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  resetDialog()
}
const clickRefreshEvent = () => {
  resetDialog()
  getDetail()
}
// 重置弹框
const resetDialog = () => {
  showDialog.value = false
  dialogType.value = '' // 防止再点击弹框时 有值
}
</script>

<style scoped lang="scss">
.overview {
  width: 100%;
  .flex-row-center {
    justify-content: flex-start;
    align-items: center;
  }
  .collapse-title {
    flex: 1;
    order: 1;
  }
  // 修改折叠框
  :deep(.el-collapse) {
    --el-collapse-header-bg-color: var(--el-color-primary-light-9);
    border-top: none;
    border-bottom: none;
  }
  :deep(.el-collapse-item__header) {
    padding-left: 10px;
  }
  :deep(.el-collapse-item__wrap) {
    border-bottom: none;
  }
  :deep(.el-collapse-item) {
    border: 1px solid $sub5-light;
    margin: 10px 0;
    border-radius: $circleRadiusSize;
  }
  :deep(.el-collapse-item__content) {
    padding: 10px;
  }
  .overview-collapse {
    background-color: white;
    padding: $idealPadding;
    // 修改等待连接结果图标大小
    :deep(.success-icon) {
      width: 22px !important;
      height: 22px !important;
    }
    // svg图片颜色
    :deep(.svg-icon svg) {
      fill: $success5-light;
    }
    :deep(.el-divider--vertical) {
      height: 4.5em;
      border-left: 1px solid $gray4-light;
    }
    .overview-collapse-label {
      width: 120px;
      padding: 5px 0;
    }
  }
}
</style>
