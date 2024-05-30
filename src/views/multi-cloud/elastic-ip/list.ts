import { useCrud } from '@/hooks'
import { existPropWithArray } from '@/utils/tool'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum, BillingEnum, FiltrateEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp,
  IdealSearch,
  IdealTextProp
} from '@/types'
import { RESOURCE_STATUS, RESOURCE_STATUS_ICON } from '@/utils/dictionary'
import { queryEipPage } from '@/api/java/network'
export const eipList = () => {
  onMounted(() => {
    tableHeaders.value = headerArray
  })

  /**
   * 搜索
   */
  const typeArray = ref<IdealSearch[]>([
    { label: '名称', prop: 'name', type: FiltrateEnum.input },
    { label: 'ID', prop: 'id', type: FiltrateEnum.input }
  ])
  const onClickSearch = (v: IdealTextProp[]) => {
    state.queryForm = {}
    if (v.length) {
      v.forEach((item: IdealTextProp) => {
        state.queryForm[item.prop] = item.value
      })
    }
    getDataList()
  }

  /**
   * 列表
   */
  const state: IHooksOptions = reactive({
    dataListUrl: queryEipPage,
    deleteUrl: '',
    queryForm: {}
  })
  // 列表表头
  const tableHeaders = ref<IdealTableColumnHeaders[]>([])
  const headerArray: IdealTableColumnHeaders[] = [
    {
      label: '弹性公网IP',
      prop: 'eip',
      useSlot: true,
      check: true,
      disabled: true
    },
    {
      label: '状态',
      prop: 'status',
      useSlot: true,
      check: true,
      disabled: false
    },
    {
      label: '类型',
      prop: 'eipTypeCN',
      check: true,
      disabled: false,
      width: '150'
    },
    {
      label: '带宽',
      prop: 'bandwidthName',
      useSlot: true,
      check: true,
      disabled: false
    },
    {
      label: '带宽详情',
      prop: 'bandwidthDetail',
      useSlot: true,
      check: true,
      disabled: false
    },
    {
      label: '已绑定实例',
      prop: 'instance',
      useSlot: true,
      check: true,
      disabled: false
    },
    {
      label: '计费模式',
      prop: 'billingMode',
      useSlot: true,
      check: true,
      disabled: false
    },
    {
      label: '云平台类别',
      prop: 'cloudPlatformCategory',
      width: '150',
      check: true,
      disabled: false
    },
    {
      label: '云平台类型',
      prop: 'cloudPlatformType',
      width: '150',
      check: true,
      disabled: false
    },
    {
      label: '云平台名称',
      prop: 'cloudPlatformName',
      width: '150',
      check: true,
      disabled: false
    },
    {
      label: '资源池名称',
      prop: 'resourcePoolName',
      width: '150',
      check: true,
      disabled: false
    },
    {
      label: '所属项目',
      prop: 'projectName',
      check: true,
      disabled: false,
      width: '150'
    },
    {
      label: '标签',
      prop: 'tag',
      useSlot: true,
      check: true,
      disabled: false,
      width: '150'
    }
  ]

  const {
    selectionChangeHandle,
    sizeChangeHandle,
    currentChangeHandle,
    getDataList,
    query
  } = useCrud(state)

  watch(
    () => state.dataList,
    arr => {
      arr?.forEach((item: any) => {
        item.showCopy = false
        item.statusIcon = RESOURCE_STATUS_ICON[item.status.toUpperCase()]
        item.statusText = RESOURCE_STATUS[item.status.toUpperCase()]
        item.tag = item.cloudLabelIds?.length
        item.operate = newOperate(item)
      })
      loopUpdateStatus()
    }
  )

  // 轮询
  const loopUpdateStatus = () => {
    if (!state.dataList?.length) {
      return
    }
    let timer: number | undefined
    const existLoading = existPropWithArray(
      'loading',
      state?.dataList,
      'statusIcon'
    ) // 操作正在进行中
    if (existLoading) {
      timer = setTimeout(() => {
        query()
      }, 5000)
    } else {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }

  const operateButtons: IdealTableColumnOperate[] = [
    { type: 'primary', title: '绑定', prop: 'bind' },
    { type: 'primary', title: '解绑', prop: 'unbind' },
    { type: 'primary', title: '修改带宽', prop: 'edit' },
    { type: 'primary', title: '标签管理', prop: 'associateTag' }
  ]

  //列表操作
  const rowData: any = ref() // 当前行数据
  const router = useRouter()
  const clickOperateEvent = (command: string | number | object, row: any) => {
    rowData.value = row
    showDialog.value = command !== 'edit' && command !== 'renew'
    if (command === 'bind') {
      dialogType.value = OperateEventEnum.bind
    } else if (command === 'unbind') {
      dialogType.value = OperateEventEnum.unbind
    } else if (command === 'edit') {
      const data = JSON.stringify(row)
      router.push({
        path: '/multi-cloud/elastic-ip/edit',
        query: {
          id: row.id
        }
      })
    } else if (command === 'release') {
      dialogType.value = OperateEventEnum.release
    } else if (command === 'shift-out') {
      dialogType.value = OperateEventEnum.shiftOut
    } else if (command === 'shift-in') {
      dialogType.value = OperateEventEnum.shiftIn
    } else if (command === 'openIpv6') {
      dialogType.value = OperateEventEnum.openIpv6
    } else if (command === 'closeIpv6') {
      dialogType.value = OperateEventEnum.closeIpv6
    } else if (command === 'associateTag') {
      dialogType.value = OperateEventEnum.associate
    } else if (command === 'unsubscribe') {
      dialogType.value = OperateEventEnum.unsubscribe
    } else if (command === 'renew') {
      const data = JSON.stringify(row)
      router.push({
        path: '/multi-cloud/elastic-ip/renew',
        query: {
          data
        }
      })
    }
  }

  // 根据每行数据状态判断操作是否禁用或存在
  const newOperate = (item: any): IdealTableColumnOperate[] => {
    let resultArr: IdealTableColumnOperate[] = []
    const tempArr = JSON.parse(JSON.stringify(operateButtons))
    const arr = handleOperateButton(item, tempArr)
    if (item.statusIcon === 'loading') {
      const tip = `${RESOURCE_STATUS[item.status]}不可操作`
      resultArr = setOperateBtns(true, tip, arr)
    } else if (item.status === 'UNBIND' || 'BIND') {
      resultArr = handleBindOrNot(item.status, arr)
    } else {
      resultArr = setOperateBtns(false, '', arr)
    }
    return handleOperateByResourcePool(item, resultArr)
  }

  // 判断计费类型,按需计费不显示续订和退订，根据不同值显示不同操作
  const handleOperateButton = (
    item: any,
    array: IdealTableColumnOperate[]
  ): IdealTableColumnOperate[] => {
    //ON_DEMAND按需 添加删除操作 PACKAGE包年包月 添加退订操作
    if (item.billType === BillingEnum.ON_DEMAND) {
      array.splice(3, 0, { title: '释放', prop: 'release' })
    } else {
      array.splice(3, 0, { title: '续订', prop: 'renew' })
      array.splice(4, 0, { title: '退订', prop: 'unsubscribe' })
    }
    //华为公有云有以下功能
    if (
      item.cloudPlatformCategoryCode === 'PUBLIC' &&
      item.cloudPlatformTypeCode === 'HUAWEI_CLOUD'
    ) {
      if (
        item.bandwidth?.chargeMode === 'bandwidth' ||
        item.bandwidth?.chargeMode === 'traffic'
      ) {
        array.splice(4, 0, {
          type: 'primary',
          title: '加入共享带宽',
          prop: 'shift-in'
        })
      } else {
        array.splice(4, 0, {
          type: 'primary',
          title: '移出共享带宽',
          prop: 'shift-out'
        })
      }
      if (item.ipVersion === '4') {
        array.splice(5, 0, { title: '开启IPv6转换', prop: 'openIpv6' })
      } else {
        array.splice(5, 0, { title: '关闭IPv6转换', prop: 'closeIpv6' })
      }
    }
    return array
  }

  // 根据状态设置操作禁用状态
  const setOperateBtns = (
    disabled: boolean,
    disabledText: string,
    array: IdealTableColumnOperate[]
  ) => {
    const arr: IdealTableColumnOperate[] = []
    array.forEach((item: any) => {
      if (!item.children) {
        item.disabled = disabled
        item.disabledText = disabledText
      }
      if (item.children && item.children.length > 0) {
        setOperateBtns(disabled, disabledText, item.children)
      }
      arr.push(item)
    })
    return arr
  }
  //绑定解绑按钮的禁用
  const handleBindOrNot = (
    status: string,
    array: IdealTableColumnOperate[]
  ): IdealTableColumnOperate[] => {
    array.forEach((item: any) => {
      if (item.prop === 'unbind' && status === 'UNBIND') {
        item.disabled = true
        item.disabledText = '当前弹性IP未绑定实例,不可解绑'
      } else if (item.prop === 'bind' && status === 'BIND') {
        item.disabled = true
        item.disabledText =
          '仅当弹性公网IP地址处在未绑定状态时，才能执行此操作。'
      }
    })
    return array
  }

  //华为公有云支持修改带宽，阿里云按需的弹性ip支持变配，包年包月不支持
  const handleOperateByResourcePool = (
    item: any,
    array: IdealTableColumnOperate[]
  ) => {
    let resultArr: IdealTableColumnOperate[] = []
    //华为私有云
    const publicHuawei =
      item.cloudPlatformCategoryCode === 'PRIVATE' &&
      item.cloudPlatformTypeCode === 'HUAWEI_CLOUD'
    //阿里云
    const aliyun =
      item.cloudPlatformCategoryCode === 'PUBLIC' &&
      item.cloudPlatformTypeCode === 'ALI_CLOUD'
    if (publicHuawei || (aliyun && item.billType === BillingEnum.PACKAGE)) {
      resultArr = array.filter(item => item.prop !== 'edit')
    } else {
      resultArr = array
    }
    return resultArr
  }

  /**
   * 列表顶部按钮
   */
  const leftButtons = ref<IdealButtonEventProp[]>([
    {
      title: '创建弹性公网IP',
      prop: 'create',
      type: 'primary',
      icon: 'circle-add',
      iconColor: 'white'
    },
    // {
    //   title: '解绑',
    //   prop: 'unbind',
    //   disabled: true,
    //   disabledText: '请选择弹性公网IP'
    // },
    // {
    //   title: '修改带宽',
    //   prop: 'editBandwidth',
    //   disabled: true,
    //   disabledText: '请选择弹性公网IP'
    // },
    // {
    //   title: '续费',
    //   prop: 'renew',
    //   disabled: true,
    //   disabledText: '请选择弹性公网IP'
    // },
    // {
    //   title: '释放',
    //   prop: 'change-to-package',
    //   disabled: true,
    //   disabledText: '请选择弹性公网IP'
    // },
    // {
    //   title: '退订',
    //   prop: 'openIpv6',
    //   disabled: true,
    //   disabledText: '请选择弹性公网IP'
    // },
    {
      title: '批量解绑标签',
      prop: 'unbindTag'
    }
  ])

  const multipleSelection: any = ref([])
  watch(
    () => state.dataListSelections,
    arr => {
      multipleSelection.value = arr
      leftButtons?.value.forEach((item: any, index: number) => {
        item.disabled = index !== 0
        item.disabledText = '请选择弹性IP'
      })
      if (arr?.length) {
        leftButtons?.value.forEach((item: any) => {
          item.disabled = false
          item.disabledText = ''
        })
      }
    },
    { deep: true }
  )

  const clickLeftEvent = (command: string | number | object) => {
    showDialog.value = command !== 'create'
    if (command === 'create') {
      createEip()
    } else if (command === 'unbindTag') {
      dialogType.value = 'unbindTag'
    } else if (command === 'unbind') {
      dialogType.value = OperateEventEnum.batch + OperateEventEnum.unbind
    } else if (command === 'editBandwidth') {
      dialogType.value = OperateEventEnum.edit
    } else if (command === 'renew') {
      dialogType.value = OperateEventEnum.renew
    } else if (command === 'release') {
      dialogType.value = OperateEventEnum.batch + OperateEventEnum.release
    }
  }

  const rightButtons = ref<IdealButtonEventProp[]>([
    {
      prop: 'refresh',
      icon: 'refresh-icon'
    },
    {
      prop: 'setting',
      icon: 'setting-icon'
    }
  ])
  const clickRightEvent = (value: string | number | object) => {
    if (value === 'setting') {
      drawerType.value = 'setting'
      showDrawer.value = true
    } else if (value === 'refresh') {
      getDataList()
    }
  }

  //创建
  const createEip = () => {
    showDialog.value = true
    dialogType.value = 'resourcePool'
  }
  // 详情
  const toDetail = (row: any) => {
    const {
      bindInstanceType,
      ipAddress,
      id,
      uuid,
      cloudPlatformCategoryCode,
      cloudPlatformTypeCode
    } = row
    router.push({
      path: '/multi-cloud/elastic-ip/detail',
      query: {
        bindInstanceType,
        ipAddress,
        id,
        uuid,
        cloudPlatformCategoryCode,
        cloudPlatformTypeCode
      }
    })
  }
  //跳转云主机
  const toInstance = (row: any) => {
    router.push({
      path: '/multi-cloud/cloud-host/detail',
      query: {
        uuid: row?.bindInstanceUuid,
        cloudCategory: row?.cloudPlatformCategoryCode,
        cloudType: row?.cloudPlatformTypeCode
      }
    })
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
    if (dialogType.value === 'resourcePool') {
      router.push({ path: '/multi-cloud/elastic-ip/create' })
    } else {
      getDataList()
    }
  }
  /**
   * 抽屉
   */
  // 抽屉是否显示
  const showDrawer = ref(false)
  // 抽屉类型
  const drawerType = ref('')
  const onClickSubmit = (value: IdealTableColumnHeaders[]) => {
    const tempArr = value.filter((item: IdealTableColumnHeaders) => item.check)

    let array: IdealTableColumnHeaders[] = []
    headerArray.forEach((item: IdealTableColumnHeaders) => {
      tempArr.forEach((child: IdealTableColumnHeaders) => {
        if (child.prop === item.prop) {
          array.push(item)
        }
      })
    })
    tableHeaders.value = array
  }

  return {
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
    toInstance,
    getDataList
  }
}
