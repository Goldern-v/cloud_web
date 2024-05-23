export const bandwidthInfo = () => {
  const typeList: any = [
    { label: 0, name: '计费方式和带宽大小' },
    { label: 1, name: '带宽大小' },
    { label: 2, name: '计费方式' }
  ]

  const chargeModeList = [
    { label: 1, name: '按带宽计费' },
    { label: 0, name: '按流量计费' }
  ]
  const configForm = reactive({
    bandwidthType: 0, //修改类型
    billingMode: 1, //计费模式
    bandwidthSize: '' //带宽大小
  })

  const sizeList: any = ref()
  watch(
    () => configForm.billingMode,
    value => {
      sizeList.value =
        value === 1 ? [1, 2, 5, 10, 100, 200] : [5, 10, 20, 50, 100]
      configForm.bandwidthSize = sizeList.value[0]
    },
    { immediate: true }
  )

  const modifiedData: any = ref([{}])

  return {
    configForm,
    typeList,
    chargeModeList,
    sizeList,
    modifiedData
  }
}
