<template>
  <div class="flex-row safe-group">
    <div class="safe-group-left">
      <el-select
        v-model="safeSelect"
        clearable
        placeholder="选择"
        class="custom-select"
      >
        <el-option
          v-for="item in safeSelectList"
          :key="item.id"
          :label="item.ipAddress"
          :value="item.id"
        />
      </el-select>

      <div class="flex-row safe-group-left-box">
        <div class="flex-row safe-group-left-box-item">
          <el-divider direction="vertical" />
          <div>全部安全组({{ dataList.length }})</div>
        </div>

        <div class="flex-row safe-group-left-box-item">
          <el-button>排序</el-button>
          <el-button @click="clickReplace">更换安全组</el-button>
        </div>
      </div>

      <el-divider />

      <el-scrollbar class="safe-group-left-scrollbar">
        <div
          v-for="(item, index) of dataList"
          :key="index"
          class="flex-row scrollbar-item"
          :class="{ 'scrollbar-item-active': currentIndex === index }"
          @click="clickSafeGroup(index)"
        >
          <div class="ideal-theme-text" @click="clickDetail(item)">
            {{ item?.name }}
          </div>
          <el-button link type="primary" @click="clickConfig(item)"
            >配置规则</el-button
          >
        </div>
      </el-scrollbar>
    </div>

    <div class="safe-group-right">
      <div class="safe-group-right-title">安全组规则</div>

      <el-tabs v-model="activeName" class="safe-group-right-tabs">
        <el-tab-pane label="入方向规则" name="ingress"></el-tab-pane>
        <el-tab-pane label="出方向规则" name="exit"></el-tab-pane>
      </el-tabs>

      <el-divider />

      <ideal-table-list
        class="safe-group-right-table"
        :table-data="ruleList"
        :table-headers="tableHeaders"
        :show-pagination="false"
        :show-border="true"
        :merge-data="mergeData"
        :merge-column="[0]"
      >
      </ideal-table-list>
    </div>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      :detail="detailInfo"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import dialogBox from './dialog-box.vue'
import { OperateEventEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders } from '@/types'
import { cloudHostSecurityDetail } from '@/api/java/compute'

interface DetailProps {
  detailInfo?: any // 行数据
}
const props = withDefaults(defineProps<DetailProps>(), {
  detailInfo: () => ({})
})

const dataList = ref<any[]>([]) // 安全组详情
const ruleList = ref<any[]>([]) // 安全组规则列表
const ingressList = ref<any[]>([]) // 入方向规则数据
const egressList = ref<any[]>([]) // 出方向规则数据

// 安全组选择
const safeSelect = ref('')
const safeSelectList = ref<any[]>([])

onMounted(() => {
  if (props.detailInfo?.nicList && props.detailInfo?.nicList.length) {
    safeSelectList.value = props.detailInfo?.nicList.map((item: any) => {
      item.ipAddress = `${item.fixedIp}(${
        item.mainCard === '1' ? '主' : '扩展'
      })`
      return item
    })
    safeSelect.value = props.detailInfo?.nicList[0].id
  }
  getSecurityDetail()
})

watch(
  () => props.detailInfo,
  val => {
    getSecurityDetail()
  }
)
const getSecurityDetail = () => {
  if (!props.detailInfo.uuid) {
    return
  }
  const params = {
    instanceUuid: props.detailInfo.uuid
  }
  cloudHostSecurityDetail(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        dataList.value = data
        if (data.length) {
          ingressList.value = data[0].rules.filter(
            (item: any) => item.direction === 'ingress'
          )
          egressList.value = data[0].rules.filter(
            (item: any) => item.direction !== 'ingress'
          )
          ruleList.value = ingressList.value
          mergeTable()
        }
      } else {
        dataList.value = []
        ingressList.value = []
        egressList.value = []
        ruleList.value = []
      }
    })
    .catch(_ => {
      dataList.value = []
      ingressList.value = []
      egressList.value = []
      ruleList.value = []
    })
}
// 处理入方向规则数据
watch(
  () => ingressList.value,
  value => {
    if (value?.length) {
      value.forEach((item: any) => {
        item.strategy = item?.action === 'allow' ? '允许' : '拒绝'
        item.protocolPort = handleProtocolPort(item)
        item.address = handleAddress(item)
      })
    }
  },
  { deep: true }
)
const handleAddress = (item: any): string => {
  let result = item.securitygroupName
  if (item?.remoteIpPrefix) {
    result = item.remoteIpPrefix
  }
  return result
}
const handleProtocolPort = (item: any): string => {
  let result = '--'
  if (!item?.protocol) {
    return result
  }

  if (item.protocol === 'all') {
    result = '全部'
  } else {
    const port = item?.multiport === 'all' ? '全部' : item?.multiport || '--'
    result = item?.protocol?.toUpperCase() + ':' + port
  }
  return result
}
// 处理出方向规则数据
watch(
  () => egressList.value,
  value => {
    if (value?.length) {
      value.forEach((item: any) => {
        item.strategy = item?.action === 'allow' ? '允许' : '拒绝'
        item.protocolPort = handleProtocolPort(item)
        item.address = handleAddress(item)
      })
    }
  },
  { deep: true }
)
// 当前安全组索引
const currentIndex = ref(0)
// 安全组点击
const clickSafeGroup = (index: number) => {
  currentIndex.value = index
  ingressList.value = dataList.value[index].rules.filter(
    (item: any) => item.direction === 'ingress'
  )
  egressList.value = dataList.value[index].rules.filter(
    (item: any) => item.direction === 'egress'
  )
  if (activeName.value === 'ingress') {
    ruleList.value = ingressList.value
  } else {
    ruleList.value = egressList.value
  }
}
// 选择的安全组
const safeCount = ref(10)
// 安全组规则方向选择
const activeName = ref('ingress')
watch(
  () => activeName.value,
  value => {
    if (value === 'ingress') {
      ruleList.value = ingressList.value
      tableHeaders.value[5].label = '源地址'
    } else {
      ruleList.value = egressList.value
      tableHeaders.value[5].label = '目标地址'
    }
    mergeTable()
  }
)
/**
 * 列表
 */
// 列表表头
const tableHeaders = ref<IdealTableColumnHeaders[]>([
  { label: '安全组名称', prop: 'securitygroupName' },
  { label: '优先级', prop: 'priority' },
  { label: '策略', prop: 'strategy' },
  { label: '协议端口', prop: 'protocolPort' },
  { label: '类型', prop: 'ethertype' },
  { label: '源地址', prop: 'address' }
])

/**
 * 列表合并
 */
const mergeData: any = ref([])
const pos = ref(0)
const mergeTable = () => {
  if (!ruleList.value) {
    return
  }

  mergeData.value = []
  for (let i = 0; i < ruleList.value.length; i++) {
    if (i === 0) {
      mergeData.value.push(1)
      pos.value = 0
    } else {
      // 安全组名称合并
      if (
        ruleList.value[i].securitygroupName ===
        ruleList.value[i - 1].securitygroupName
      ) {
        mergeData.value[pos.value] += 1
        mergeData.value.push(0)
      } else {
        mergeData.value.push(1)
        pos.value = i
      }
    }
  }
}
const router = useRouter()
const clickDetail = (row: any) => {
  jumpRoute(row, 'basicInfo')
}
const clickConfig = (row: any) => {
  jumpRoute(row, 'enterRule')
}

const route = useRoute()
const jumpRoute = (data: any, type: string) => {
  const {
    id, //安全组id
    uuid, //安全组uuid
    name,
    resourcePoolId,
    regionId,
    projectId
  } = data
  const params = Object.assign(
    {},
    {
      id,
      uuid,
      name,
      cloudPlatformTypeCode: route.query.cloudType,
      cloudPlatformCategoryCode: route.query.cloudCategory,
      resourcePoolId,
      regionId,
      projectId,
      type
    }
  )
  router.push({
    path: '/multi-cloud/safe-group/detail',
    query: { ...params }
  })
}
// 更换安全组
const clickReplace = () => {
  showDialog.value = true
  dialogType.value = 'replaceSafeGroup'
}
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
}
</script>

<style scoped lang="scss">
.safe-group {
  width: 100%;
  .safe-group-left {
    width: calc(30%);
    margin-right: 10px;
    background-color: white;
    .custom-select {
      width: calc(100% - 40px);
      margin: 20px;
    }
    .safe-group-left-box {
      justify-content: space-between;
      align-items: center;
      margin: 0 20px;

      .safe-group-left-box-item {
        justify-content: flex-start;
        align-items: center;
      }
    }
    .safe-group-left-scrollbar {
      height: calc(
        100vh - var(--navigation-bar-height) - var(--theme-header-height) - 40px -
          20px - 40px - 20px - 40px - 20px - 128px
      );
      .scrollbar-item,
      .scrollbar-item-active {
        cursor: pointer;
        align-items: center;
        justify-content: space-between;
        height: 40px;
        margin: 10px 20px;
        padding: 0 10px;
        text-align: center;
        border-radius: $circleRadiusSize;
      }
      .scrollbar-item-active {
        background-color: var(--el-color-primary-light-9);
      }
    }
  }
  .safe-group-right {
    width: 70%;
    background-color: white;
    :deep(.el-tabs__nav-wrap::after) {
      background-color: white;
    }
    .safe-group-right-title {
      margin: 10px;
    }
    .safe-group-right-tabs {
      margin: 20px 20px 0;
    }
    .safe-group-right-table {
      padding: 0 20px;
      height: 200px;
    }
  }
  :deep(.el-table) {
    height: calc(
      100vh - var(--navigation-bar-height) - var(--theme-header-height) - 40px -
        20px - 40px - 20px - 40px - 20px - 138px
    ) !important;
    margin-bottom: 10px;
  }
}
</style>
