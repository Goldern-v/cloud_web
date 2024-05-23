<template>
  <div class="basic-info">
    <div class="flex-row basic-info__head">
      <div class="flex-column basic-info__head-img">
        <img
          class="basic-info__head-img-box"
          src="@/assets/detail-info.png"
          alt=""
        />
        <el-divider border-style="dotted" />

        <div class="flex-row basic-info__head-operate">
          <ideal-status-icon
            :status-icon="detailInfo.statusIcon"
            :status-text="detailInfo.statusText"
          ></ideal-status-icon>
          <el-divider direction="vertical" />
          <svg-icon
            icon="monitor-icon"
            color="#858A99"
            class="ideal-svg-margin-right"
          ></svg-icon>
          <div>监控中</div>
        </div>
      </div>

      <ideal-detail-info
        :label-array="labelArray"
        :detail-info="detailInfo"
        label-position="left"
        class="basic-info__content"
        @edit-info="editInfo"
      >
        <template #status>
          <ideal-status-icon
            v-if="detailInfo.status"
            :status-icon="detailInfo.statusIcon"
            :status-text="detailInfo.statusText"
          />
        </template>

        <template #image>
          <el-text type="primary">{{ detailInfo.image?.osVersion }}</el-text>
        </template>

        <template #osType>
          <div>{{ detailInfo.image?.osType }}</div>
        </template>

        <template #vpc>
          <div>{{ detailInfo.vpc?.name }}</div>
        </template>
      </ideal-detail-info>
    </div>

    <div class="basic-info__list">
      <el-collapse accordion>
        <el-collapse-item name="1">
          <template #title>
            <span class="collapse-title" style="text-align: left">云硬盘</span>
          </template>
          <div v-if="diskInfo">
            <div class="ideal-tip-text basic-info-collapse-label">系统盘</div>
            <div class="flex-row flex-row-center">
              <div class="ideal-default-margin-right ideal-theme-text">{{ diskInfo?.name }}</div>
              <div>
                {{ diskInfo?.volumeTypeName }} | {{ diskInfo?.size }} GiB
              </div>

              <el-tooltip
                effect="dark"
                placement="top-start"
                content="系统盘禁止扩容"
                :disabled="!!!diskInfo?.bootable"
              >
                <el-button
                  link
                  type="primary"
                  :disabled="!!diskInfo?.bootable"
                  @click="clickExpand"
                  >扩容</el-button
                >
              </el-tooltip>
            </div>
          </div>
          <div v-else>未绑云硬盘</div>
        </el-collapse-item>

        <el-collapse-item name="2">
          <template #title>
            <span class="collapse-title" style="text-align: left">网卡</span>
          </template>
          <div v-if="nicList.length">
            <div v-for="(child, idx) of nicList" :key="idx">
              <div>{{ child.mainCard === '1' ? '主网卡' : '扩展网卡' }}</div>
              <div class="flex-row">
                {{ child?.subnetName }} | {{ child?.fixedIp }}
              </div>
            </div>
          </div>
          <div v-else>未绑定网卡</div>
        </el-collapse-item>

        <el-collapse-item name="3">
          <template #title>
            <span class="collapse-title" style="text-align: left">安全组</span>
          </template>
          <div v-if="safeGroups.length">
            <div v-for="(child, idx) of safeGroups" :key="idx">
              {{ child?.name }}
            </div>
          </div>
          <div v-else>未绑定安全组</div>
        </el-collapse-item>

        <el-collapse-item name="4">
          <template #title>
            <span class="collapse-title" style="text-align: left"
              >弹性公网IP</span
            >
          </template>
          <div class="flex-row">
            <div v-if="nicInfo?.publicIp">
              {{ nicInfo?.publicIp }} | {{ nicInfo?.bandwidthSize }} Mbit/s
            </div>
            <div v-else>
              <div>未绑定弹性公网IP</div>
              <div>
                如有互联网访问需求，请申请弹性公网IP并绑定到弹性云服务器上。
              </div>
            </div>
          </div>
        </el-collapse-item>

        <el-collapse-item name="5">
          <template #title>
            <span class="collapse-title" style="text-align: left">云备份</span>
          </template>
          <div>
            <div>暂无备份</div>
            <div>
              开启弹性云服务器备份保护，可以使用备份数据恢复服务器/磁盘的数据，确保业务安全。
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cloudHostEdit } from '@/api/java/compute'
import { showLoading, hideLoading } from '@/utils/tool'
import { ElMessage } from 'element-plus/es'
import { existPropWithArray } from '@/utils/tool'
import { EventEnum, BillingEnum } from '@/utils/enum'
import { diskTypeDic } from '@/utils/dictionary'

interface DetailProps {
  detailInfo?: any // 行数据
}
const props = withDefaults(defineProps<DetailProps>(), {
  detailInfo: () => ({})
})
// 方法
interface EventEmits {
  (e: EventEnum.success): void // 表单成功提交后刷新列表
}
const emit = defineEmits<EventEmits>()

const labelArray = ref([
  { label: '名称', prop: 'name', isEdit: true },
  { label: 'ID', prop: 'id', isCopy: true },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '规格', prop: 'spec' },
  { label: '镜像', prop: 'image', useSlot: true },
  { label: '操作系统', prop: 'osType', useSlot: true },
  { label: 'vpc', prop: 'vpc', useSlot: true },
  { label: '可用区', prop: 'availableZone' },
  { label: 'IP地址(私有)', prop: 'privateIp' },
  { label: 'IP地址(弹性IP)', prop: 'publicIp' },
  { label: '计费模式', prop: 'billMode' },
  { label: '描述', prop: 'remark', isEdit: true },
  { label: '新建时间', prop: 'createDate' }
])

// 云硬盘详情
const diskInfo = ref<any>()
const router = useRouter()
// 扩容
const clickExpand = () => {
  const data = JSON.stringify(diskInfo.value)
  router.push({ path: '/multi-cloud/cloud-disk/expand', query: { data } })
}
// 网卡详情
const nicInfo = ref<any>()
const nicList = ref<any[]>([])
// 安全组
const safeGroups = ref<any[]>([])
watch(
  () => props.detailInfo,
  value => {
    loopUpdateStatus()
    if (value?.billType === BillingEnum.PACKAGE) {
      labelArray.value.push({ label: '到期时间', prop: 'expiredTime' })
    }
    if (value) {
      if (value?.systemVolume) {
        diskInfo.value = value.systemVolume
        diskInfo.value.volumeTypeName =
          diskTypeDic[value?.systemVolume?.volumeType]
      }
      const nicArray = value?.nicList.map((item: any) => {
        item.publicIp = item?.eip?.ipAddress || ''
        item.bandwidthSize = item?.eip?.bandwidth?.size || ''
        return item
      })
      nicInfo.value = nicArray.length ? nicArray[0] : {}
      nicList.value = nicArray
      safeGroups.value = value?.securityGroups
    }
  }
)

//循环更新状态
const loopUpdateStatus = () => {
  if (props.detailInfo.status) {
    let timer: number | undefined
    const existLoading = existPropWithArray(
      'loading',
      [props.detailInfo],
      'statusIcon'
    ) // 操作正在进行中
    if (existLoading) {
      timer = setTimeout(() => {
        emit(EventEnum.success)
      }, 6000)
    } else {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }
}

//修改云主机
const editInfo = (val: any, config: any) => {
  const params: any = {
    remark: val.remark,
    uuid: val.uuid,
    regionId: val.regionId,
    resourcePoolId: val.pool.id,
    projectId: val.project.id
  }
  if (val.name !== props.detailInfo.name) {
    params.name = val.name
  }
  showLoading('更新中...')
  cloudHostEdit(params)
    .then((res: any) => {
      const { code, data, msg } = res
      if (code === 200) {
        ElMessage.success(data)
        config.showEdit = false
        emit(EventEnum.success)
      } else {
        ElMessage.error(msg)
      }
      hideLoading()
    })
    .catch(err => {
      hideLoading()
    })
}
</script>

<style scoped lang="scss">
.basic-info {
  width: 100%;
  .basic-info__head {
    width: calc(100% - $idealPadding * 2);
    padding: $idealPadding;
    background-color: white;
    .basic-info__head-img {
      width: 25%;
      justify-content: center;
      align-items: center;
      .basic-info__head-img-box {
        width: 180px;
        height: 150px;
      }
      .basic-info__head-operate {
        justify-content: center;
        align-items: center;
      }
    }
    .basic-info__content {
      width: 75%;
      padding: 0 20px;
    }
  }
  .basic-info__list {
    margin-top: $idealPadding;
    width: calc(100% - $idealPadding * 2);
    padding: $idealPadding;
    background-color: white;
  }
  .collapse-title {
    flex: 1;
    order: 1;
  }
  // 修改折叠框
  :deep(.el-collapse) {
    --el-collapse-header-bg-color: #eeeeee;
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
  .flex-row-center {
    justify-content: flex-start;
    align-items: center;
  }
  .basic-info-collapse-label {
    width: 120px;
  }
}
</style>
