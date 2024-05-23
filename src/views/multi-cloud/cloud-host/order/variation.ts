import { resourceTypeEnum } from '@/utils/enum'
import { queryCloudHostDetail } from '@/api/java/compute'

export const useVariation = (rowData: any, form: any) => {
  onMounted(() => {
    getDetailData()
  })
  //查询云主机详情
  const detailData: any = ref({})
  const getDetailData = () => {
    queryCloudHostDetail({ uuid:rowData.uuid })
      .then((res: any) => {
        const { code, data } = res
        if (code === 200) {
          detailData.value = data
        } else {
          detailData.value = {}
        }
      })
      .catch(_ => {
        detailData.value = {}
      })
  }

  // 变配参数
  const getParams = (): {[key: string]: any} => {
    //系统盘
    const rootVolume: {[key: string]: any} = {
      volumetype: detailData.value?.systemVolume?.volumeType,
      size: detailData.value?.systemVolume?.size
    }
    //云主机订单对象
    const compute: {[key: string]: any} = {
      imageId: rowData?.image?.id,
      flavorId: form.spec?.id,
      name: rowData?.name,
      isAutoRenew: false,
      rootVolume
    }
    const params: {[key: string]: any} = {
      resourcePoolId: rowData?.pool?.id, //资源池id
      cloudPlatformId: detailData.value.cloudPlatform?.id, // 云平台类型id
      vdcId: rowData?.vdc?.id,
      resourceType: resourceTypeEnum.ECS,
      type: 'VARIATION', // 订单类别 SUBSCRIBE订购、RENEW续订、VARIATION变配、UNSUBSCRIBE退订
      availableZone: rowData?.availableZone,
      billType: rowData?.billType,
      count: 1,
      regionId: rowData?.regionId,
      projectId: rowData?.project?.id,
      instanceResourceName: rowData?.name,
      isAutoRenew: false, //是否自动支付
      billResourceId: rowData?.billResourceId,
      uuid: rowData?.uuid,
      id: rowData?.id,
      compute
    }
    return params
  }

  // getParams返回参数满足大多数云, commonParams用于后期根据其他云判断进行参数处理
  const commonParams = (): {[key: string]: any} => {
    const params: {[key: string]: any} = getParams()
    return params
  }

  return {
    detailData,
    commonParams
  }
}