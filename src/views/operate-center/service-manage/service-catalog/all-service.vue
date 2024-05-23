<template>
  <div class="service-catalog flex-row">
    <div
      v-for="(item, index) in serviceCatalogList"
      :key="index"
      class="flex-column service-catalog-box"
    >
      <div
        v-if="!item.whetherApply"
        style="width: 100%; height: 100%"
        @click="showApplyBtn(item)"
      >
        <div class="flex-row introduce-box">
          <div v-if="item.iconUrl" class="flex-row" style="align-items: center;">
            <el-image
              class="introduce-box-img"
              :src="item.iconUrl"
              fit="fill"
            />
          </div>

          <div class="introduce-box-title">
            <div >{{ item.name }}</div>
            <div class="ideal-tip-text" style="margin-top: 10px;">{{ item.remark }}</div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="apply-box flex-row"
        @click="onClickBlankSpace(item, $event)"
      >
        <el-button
          type="primary"
          size="large"
          @click="applyService(item, $event)"
        >
          <svg-icon icon="file-add" class="ideal-svg-margin-right"></svg-icon>
          申请</el-button
        >
      </div>
    </div>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      :row-data="currentItem"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>
<script lang="ts" setup>
import dialogBox from './dialog-box.vue'
import { OperateEventEnum } from '@/utils/enum'
import { serviceConfigList } from '@/api/java/operate-center'

interface ServiceCatalog {
  serviceCatalogType?: string //当前服务目录类别（计算，存储，网络）
}
const props = withDefaults(defineProps<ServiceCatalog>(), {
  serviceCatalogType: ''
})

onMounted(() => {
  getServiceCatalog()
})

const serviceCatalogList: any = ref<any[]>([])
watch(
  () => props.serviceCatalogType,
  value => {
    getServiceCatalog()
  }
)
// 查询目录
const getServiceCatalog = () => {
  const params = {
    serviceCategoryDefinitionId: props.serviceCatalogType
  }
  serviceConfigList(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        serviceCatalogList.value = data.map((item: any) => {
          item.whetherApply = false
          return item
        })
      } else {
        serviceCatalogList.value = []
      }
    })
    .catch(_ => {
      serviceCatalogList.value = []
    })
}

//显示申请按钮
const showApplyBtn = (item: any) => {
  item.whetherApply = true
}
//点击空白区域隐藏申请按钮
const onClickBlankSpace = (item: any, event: MouseEvent) => {
  item.whetherApply = false
}

const router = useRouter()
const currentItem = ref()
//申请服务
const applyService = (item: any, event: MouseEvent) => {
  showDialog.value = true
  dialogType.value = 'selectPool'
  currentItem.value = item
}
/**
 * 弹框
 */
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  dialogType.value = ''

  if (currentItem.value?.url) {
    const isDialog = currentItem.value?.url.includes('?')
    if (isDialog) {
      const open = 'true'
      router.push({ path: `/${currentItem.value.url}`, query: { open } })
    } else {
      router.push({ path: `/${currentItem.value.url}` })
    }
  }
}
</script>
<style lang="scss" scoped>
.service-catalog {
  width: 100%;
  flex-wrap: wrap;
  .service-catalog-box {
    width: calc(25% - 10px * 2 - $idealPadding * 2);
    margin: 10px;
    padding: $idealPadding;
    background-color: #f7f8fb;
    height: 170px;
    .introduce-box {
      align-items: center;
      font-size: $mediumFontSize;
      font-weight: 600;
      height: 100%;
      .introduce-box-img {
        width: 100px;
        height: 100px;
        margin-right: 5px;
        border-radius: 1px;
      }
      .introduce-box-title {
        margin-left: 10px;
        height: 100%;
      }
    }
    .ideal-svg-margin-right {
      margin-right: 18px;
    }
    .apply-box {
      width: 100%;
      height: 100%;
      justify-content: center;
      align-items: center;
    }
  }
  :deep .svg-icon svg {
    width: 1.5em;
    height: 1.5em;
  }
}
</style>
