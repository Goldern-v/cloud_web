<template>
  <div class="basic-info">
    <ideal-detail-info
      :label-array="labelArray"
      label-position="left"
      :show-colon="false"
      :detail-info="bandwidthInfo"
      class="ideal-detail-info"
    >
      <template #ipAddress>
        <div class="flex-row" style="align-items: center">
          <span>{{ detailInfo.ipAddress }}</span>
          <el-text type="primary"
            >查看全部<span v-show="ipAddressNum > 0"
              >({{ ipAddressNum }})</span
            ></el-text
          >
        </div>
      </template>
      <template #bandwidthSize>
        <div class="flex-row" style="align-items: center">
          <span>{{ bandwidthInfo.size }}</span>
          <el-text type="primary">修改</el-text>
        </div>
      </template>

      <template #billMode>
        <div>
          {{ detailInfo.billType === 'ON_DEMAND' ? '按需计费' : '包年包月' }}
        </div>
      </template>

      <template #bandwidthType>
        <div>
          {{ detailInfo.shareType === 'WHOLE' ? '共享' : '独享' }}
        </div>
      </template>
    </ideal-detail-info>
    <!-- <div class="basic-info_monitor">
      <div class="flex-row basic-info_monitor-title">
        <span>监控信息</span>
        <el-tooltip effect="dark" placement="right" content="">
          <svg-icon icon="question-icon"></svg-icon>
        </el-tooltip>
      </div>
      <monitor></monitor>
    </div> -->
  </div>
</template>
<script lang="ts" setup>
import monitor from './monitor.vue'
import { queryEipDetail } from '@/api/java/network'

const labelArray: any = ref([])

const bandwidthLabel = [
  { label: '带宽名称', prop: 'name', isEdit: true },
  { label: '公网IP地址', prop: 'ipAddress', useSlot: true },
  { label: '带宽ID', prop: 'id', isCopy: true },
  { label: '计费模式', prop: 'billMode', useSlot: true },
  { label: '计费方式', prop: 'chargeModeCN' },
  { label: '带宽大小', prop: 'bandwidthSize', useSlot: true },
  { label: '带宽类型', prop: 'bandwidthType', useSlot: true }
]

const route = useRoute()
const id = route.query?.id as string
const cloudPlatformCategoryCode = route.query
  ?.cloudPlatformCategoryCode as string //云类别
const cloudPlatformTypeCode = route.query?.cloudPlatformTypeCode as string //云类型

onMounted(() => {
  queryEipInfo()
  if (
    RegExp(/PUBLIC/).test(cloudPlatformCategoryCode) &&
    RegExp(/ALI_CLOUD/).test(cloudPlatformTypeCode)
  ) {
    labelArray.value = bandwidthLabel.filter(
      item => item.prop !== 'bandwidthType'
    )
  } else {
    labelArray.value = bandwidthLabel
  }
})

const detailInfo: any = ref({})
const bandwidthInfo: any = ref({})
const queryEipInfo = () => {
  queryEipDetail({ id }).then((res: any) => {
    const { data, code } = res
    if (code === 200) {
      bandwidthInfo.value = data.bandwidth
      detailInfo.value = data
    } else {
      detailInfo.value = {}
    }
  })
}
const ipAddressNum = ref(1)
</script>
<style lang="scss" scoped>
.basic-info {
  margin: $idealMargin 0;
  background-color: #fff;
  padding: $idealPadding;
  span {
    margin-right: 5px;
  }
  .el-text {
    cursor: pointer;
  }
  .basic-info_monitor {
    padding: 0 20px;
    .basic-info_monitor-title {
      padding: 20px 0;
    }
  }
}
</style>
