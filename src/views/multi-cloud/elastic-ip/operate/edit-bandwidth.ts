import type { IdealTableColumnHeaders } from '@/types'
import { ElMessage } from 'element-plus'
import { resourceTypeEnum, BillingEnum } from '@/utils/enum'
import { queryEipDetail, eipResize } from '@/api/java/network'
import { approvalProcess } from '@/utils/tool'
export const bandwidthInfo = () => {
  const route = useRoute()
  const id = route.query.id

  onMounted(() => {
    queryEipInfo()
  })

  const detailInfo: any = ref({}) //弹性IP详情
  //弹性Ip详细信息
  const queryEipInfo = () => {
    queryEipDetail({ id }).then((res: any) => {
      const { data, code } = res
      if (code === 200) {
        detailInfo.value = data
        getRenderData()
      } else {
        detailInfo.value = {}
      }
    })
  }

  const isPackage = computed(() => {
    return detailInfo.value.billing === BillingEnum.PACKAGE
  })

  const getRenderData = () => {
    if (isPackage.value) {
      chargeModeList.value = chargeMode.filter(
        (item: any) => item.label !== 'traffic'
      )
    } else {
      chargeModeList.value = chargeMode
    }
    detailInfo.value.bandwidthSize = detailInfo.value.bandwidth?.size
    detailInfo.value.billMode = detailInfo.value.bandwidth?.chargeModeCN
    detailInfo.value.bandwidthType =
      detailInfo.value.shareType === 'WHOLE' ? '共享带宽' : '独占带宽' // 带宽 分享类型: WHOLE 共享带宽; PER 独占带宽
    form.bandwidthName = detailInfo.value.bandwidth?.name
    form.billingMode = detailInfo.value.bandwidth?.chargeMode
    sizeList.value = detailInfo.value.bandwidth?.chargeMode
      ? [1, 2, 5, 10, 100, 200]
      : [5, 10, 20, 50, 100]
    form.bandwidthSize = detailInfo.value.bandwidth?.size
    if (
      (detailInfo.value.cloudPlatformTypeCode === 'ALI_CLOUD' ||
        detailInfo.value.cloudPlatformTypeCod === 'TENCENT') &&
      detailInfo.value.cloudPlatformCategoryCode === 'PUBLIC'
    ) {
      form.maxSize = 200
    } else {
      form.maxSize = 2000
    }
  }

  const chargeModeList: any = ref([])
  const chargeMode = [
    { label: 'bandwidth', name: '按带宽计费' },
    { label: 'traffic', name: '按流量计费' }
  ]
  const configItems = [
    { label: '带宽大小(Mbit/s)', prop: 'bandwidthSize' },
    { label: '计费方式', prop: 'billMode' },
    { label: '带宽类型', prop: 'bandwidthType' }
  ]

  const sizeList: any = ref()
  const form = reactive({
    bandwidthName: '',
    billingMode: '',
    bandwidthSize: 2,
    maxSize: 200 //支持最大带宽大小
  })

  watch(
    () => form.billingMode,
    value => {
      sizeList.value =
        value === 'bandwidth' ? [1, 2, 5, 10, 100, 200] : [5, 10, 20, 50, 100]
    }
  )
  const billChange = (val: string) => {
    sizeList.value =
      val === 'bandwidth' ? [1, 2, 5, 10, 100, 200] : [5, 10, 20, 50, 100]
    form.bandwidthSize = sizeList.value[0]
  }

  const confirmData: any = ref([])
  // 带宽配置头部信息
  const tableHeaders: IdealTableColumnHeaders[] = [
    { label: '产品', prop: 'productType' },
    { label: '配置', prop: 'config', useSlot: true },
    { label: '变更前', prop: 'beforeChange', useSlot: true },
    { label: '变更后', prop: 'afterChange', useSlot: true },
    { label: '价格', prop: 'price', useSlot: true }
  ]
  // 带宽配置信息
  const configList: IdealTableColumnHeaders[] = [
    { label: '名称', prop: 'name' },
    { label: 'ID', prop: 'id' },
    { label: '计费模式', prop: 'billMode' }
  ]
  //变更信息
  const beforeConfig: IdealTableColumnHeaders[] = [
    { label: '带宽大小', prop: 'lifeSize' },
    { label: '计费模式', prop: 'lifeMode' }
  ]

  const afterConfig: IdealTableColumnHeaders[] = [
    { label: '带宽大小', prop: 'presentSize' },
    { label: '计费模式', prop: 'presentMode' }
  ]

  const modeText: any = {
    bandwidth: '按带宽计费',
    traffic: '按流量计费'
  }

  const priceInfoRef = ref()
  watch(
    () => form.bandwidthSize,
    value => {
      if (value !== detailInfo.value.bandwidth?.size) {
        nextDisabled.value = false
      }
      const priceInfo = priceInfoRef.value.price
      confirmData.value = [
        {
          productType: '带宽',
          name: form.bandwidthName,
          id: detailInfo.value.bandwidth?.id, //带宽Id
          lifeSize: detailInfo.value.bandwidth?.size + 'Mbit/s',
          lifeMode: modeText[detailInfo.value.bandwidth?.chargeMode],
          presentSize: form.bandwidthSize + 'Mbit/s',
          presentMode: modeText[form.billingMode],
          price: `${priceInfo.toFixed(2)}元${!isPackage.value ? '/小时' : ''}`
        }
      ]
    }
  )

  const stepsIndex = ref(1)
  const clickPrevious = () => {
    if (stepsIndex.value === 1) {
      return
    }
    stepsIndex.value--
  }

  const nextDisabled = ref(false) //是否禁用下一步
  const clickNext = () => {
    if (stepsIndex.value === 1) {
      if (
        form.bandwidthSize === detailInfo.value.bandwidth?.size &&
        form.billingMode === detailInfo.value.bandwidth?.chargeMode
      ) {
        nextDisabled.value = true
        return ElMessage.warning('带宽规格未变更，与原有规格相同。')
      } else {
        nextDisabled.value = false
        stepsIndex.value++
      }
    }
  }

  //公共参数
  const commonParams = () => {
    const params = {
      resourcePoolId: detailInfo.value.resourcePoolId,
      regionId: detailInfo.value.regionId,
      projectId: detailInfo.value.projectId
    }
    return params
  }
  const router = useRouter()
  const clickComplete = () => {
    //带宽信息
    const bandwidth = {
      id: detailInfo.value.bandwidth?.id,
      uuid: detailInfo.value.bandwidth?.uuid,
      size: form.bandwidthSize, //带宽大小
      name: form.bandwidthName, //带宽名称
      chargeMode: form.billingMode, //带宽的计费模式
      sharetype: detailInfo.value.bandwidth?.shareType //带宽的共享类型
    }
    const params: any = {
      eipType: detailInfo.value.eipType, //弹性IP类型
      ipVersion: detailInfo.value.ipVersion,
      ipAddress: detailInfo.value.ipAddress,
      resourceType: resourceTypeEnum.EIP, //资源类型
      type: 'VARIATION', // 订单类别 SUBSCRIBE订购、RENEW续订、VARIATION变配、UNSUBSCRIBE退订
      billType: detailInfo.value?.billType, //弹性IP计费类型
      instanceResourceName: detailInfo.value.name,
      instanceResourceId: detailInfo.value.id,
      vdcId: detailInfo.value?.vdcId,
      billResourceId: detailInfo.value.billResourceId, //计费项id
      bandwidth,
      ...commonParams()
    }
    if (detailInfo.value?.billType === BillingEnum.PACKAGE) {
      params.billCycle = detailInfo.value.billCycle //弹性IP计费周期
      params.billCycleNum = detailInfo.value.billCycleNum //弹性IP计费周期
    }
    eipResize(params).then((res: any) => {
      const { data, code, msg } = res
      if (code === 200) {
        // 根据vdc判断是否走审批，传创建类型，vdcId和订单返回的订单号
        approvalProcess('EIP_RESIZE', detailInfo.value?.vdcId, data).then(
          (res: any) => {
            if (res.code === 200) {
              router.push({ path: '/multi-cloud/elastic-ip/list' })
            }
          }
        )
      } else {
        ElMessage.error('生成变配订单失败')
      }
    })
  }
  return {
    configItems,
    detailInfo,
    chargeModeList,
    sizeList,
    form,
    confirmData,
    tableHeaders,
    configList,
    nextDisabled,
    billChange,
    stepsIndex,
    clickPrevious,
    clickNext,
    clickComplete,
    beforeConfig,
    afterConfig,
    priceInfoRef
  }
}
