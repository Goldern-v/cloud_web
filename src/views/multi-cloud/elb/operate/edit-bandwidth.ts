import type { IdealTableColumnHeaders } from '@/types'
export const bandwidthInfo = () => {
  const detailInfo: any = ref({})
  const route = useRoute()
  onMounted(() => {
    detailInfo.value = JSON.parse(route.query.data as any)
    console.log(detailInfo.value, '----------')

    configForm.bandwidthName = detailInfo.value.name
  })
  const configItems = [
    { label: '带宽大小(Mbit/s)', prop: 'bandwidthSize' },
    { label: '计费方式', prop: 'billingMode' },
    { label: '带宽类型', prop: 'bandwidthType' }
  ]
  const chargeModeList = [
    { label: 1, name: '按带宽计费' },
    { label: 0, name: '按流量计费' }
  ]
  const sizeList: any = ref()
  const configForm = reactive({
    bandwidthName: '',
    billingMode: 1,
    bandwidthSize: ''
  })
  watch(
    () => configForm.billingMode,
    value => {
      sizeList.value =
        value === 1 ? [1, 2, 5, 10, 100, 200] : [5, 10, 20, 50, 100]
      configForm.bandwidthSize = sizeList.value[0]
    },
    { immediate: true }
  )

  const basicData: any = ref([])
  const tableHeaders: IdealTableColumnHeaders[] = [
    { label: '产品', prop: 'productType' },
    { label: '配置', prop: 'config', useSlot: true },
    { label: '变更前', prop: 'billingModeText' },
    { label: '变更后', prop: 'count' },
    { label: '价格', prop: 'price' }
  ]

  return {
    configItems,
    detailInfo,
    chargeModeList,
    sizeList,
    configForm,
    basicData,
    tableHeaders
  }
}
