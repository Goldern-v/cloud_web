import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import { OperateEventEnum, BillingEnum, FiltrateEnum } from '@/utils/enum'
import { existPropWithArray } from '@/utils/tool'
import { RESOURCE_STATUS, RESOURCE_STATUS_ICON } from '@/utils/dictionary'
import type {
  IdealButtonEventProp,
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealSearch,
  IdealSearchResult
} from '@/types'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  handleStartupAndShutdown,
  handleOperateButton,
  handleOperateByCloud,
  setOperateBtns,
  useOperate,
  headerArray,
  leftButtons,
  rightButtons,
  getDialogType
} from './components/common'
import {
  cloudHostUrl,
  recycleCloudHostUrl,
  cloudHostRemoteLogin
} from '@/api/java/compute'

export const useList = () => {
  const typeArray = ref<IdealSearch[]>([
    { label: '日期', prop: 'date', type: FiltrateEnum.date },
    { label: '名称', prop: 'name', type: FiltrateEnum.input },
    { label: 'ID', prop: 'uuid', type: FiltrateEnum.input },
    { label: 'VPC ID', prop: 'vpcId', type: FiltrateEnum.input }
  ])
  const onClickSearch = (v: IdealSearchResult[]) => {
    state.queryForm = {}
    if (v.length) {
      v.forEach((item: IdealSearchResult) => {
        if (item.prop === 'date' && item?.value) {
          // 日期
          const timeArray = item.value.split('/')
          state.queryForm.beginTime = timeArray[0]
          state.queryForm.endTime = timeArray[1]
        } else {
          state.queryForm[item.prop] = item.value
        }
      })
    }
    getDataList()
  }

  const route = useRoute()
  const exitSearchResult: any = ref([])
  onMounted(() => {
    tableHeaders.value = headerArray
    if (Object.keys(route.query).length) {
      for (let key in route.query) {
        if (key !== 'open') {
          exitSearchResult.value.push({
            label: key + '：' + route.query[key],
            prop: key,
            value: route.query[key]
          })
        }
      }
    }
  })

  const attrData = reactive({
    timeRanges: [] as any[], // 日期范围
    leftButtons: [] as IdealButtonEventProp[],
    rightButtons: [] as IdealButtonEventProp[],
    rowData: {}
  })
  // 列表
  const state: IHooksOptions = reactive({
    dataListUrl: cloudHostUrl,
    deleteUrl: recycleCloudHostUrl,
    queryForm: {},
    createdIsNeed: !Object.keys(route.query).length ? true : false
  })
  const {
    selectionChangeHandle,
    sizeChangeHandle,
    currentChangeHandle,
    getDataList,
    query
  } = useCrud(state)

  const { getOperate } = useOperate()
  watch(
    () => state.dataList,
    value => {
      if (value?.length) {
        value.forEach((item: any) => {
          item.showCopy = false // uuid拷贝
          if (item?.nicList && item?.nicList.length) {
            handleIpCopy(item?.nicList)
          }
          item.statusText = RESOURCE_STATUS[item?.status]
          item.statusIcon = RESOURCE_STATUS_ICON[item?.status]
          item.billingDes =
            item?.billType === BillingEnum.ON_DEMAND ? '按需' : '包年包月'
          item.osType = `os-${item?.image?.platform?.toLowerCase()}`
          item.expiredDate = item?.expiredTime?.date
            ? item?.expiredTime?.date
            : '--'
          const operateBtns = getOperate(item?.pool)
          item.operate = newOperate(item, operateBtns)
        })
        loopUpdateStatus()
      }
    }
  )
  // 处理公有ip和私有ip复制功能
  const handleIpCopy = (array: any[]) => {
    array.forEach((item: any) => {
      item.privateIpCopy = false // 私有ip拷贝
      if (item.eip) {
        // 防止后端不返回eip这个字段值
        item.eip.publicIpCopy = false // 公有ip拷贝
      }
    })
  }
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

  const tableHeaders = ref<IdealTableColumnHeaders[]>([])

  // 根据每行数据状态判断操作是否禁用
  const newOperate = (
    item: any,
    operateBtns: IdealTableColumnOperate[]
  ): IdealTableColumnOperate[] => {
    let resultArr: IdealTableColumnOperate[] = []
    const tempArr = JSON.parse(JSON.stringify(operateBtns))
    const arr = handleOperateButton(item, tempArr)
    if (item.statusIcon === 'loading') {
      const tip = `${RESOURCE_STATUS[item.status]}不可操作`
      resultArr = setOperateBtns(true, tip, arr)
    } else if (item.status === 'RUNNING' || item.status === 'SHUTDOWN') {
      resultArr = handleStartupAndShutdown(item.status, arr)
    } else {
      resultArr = setOperateBtns(false, '', arr)
    }
    const cloudCategory = item.pool?.cloudCategory.toUpperCase()
    const cloudType = item.pool?.cloudType.toUpperCase()
    // 根据不同云类型判断操作的禁用
    resultArr = handleOperateByCloud(cloudCategory, cloudType, item.status, arr)
    return resultArr
  }
  type eventType = string | number | object
  const clickOperateEvent = (command: eventType, row: any) => {
    attrData.rowData = row
    if (command === 'createMirror') {
      router.push({ path: '/multi-cloud/mirror-serve/private/create' })
    } else if (command === 'login') {
      remoteLogin(row)
    } else {
      dialogType.value = getDialogType(command)
    }
    showDialog.value = command !== 'login' && command !== 'createMirror'
  }
  // 远程登录
  const remoteLogin = (row: any) => {
    ElMessageBox.confirm('确认要对当前主机进行远程登录操作吗？', '远程登录', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      cloudHostRemoteLogin({ uuid: row.uuid }).then((res: any) => {
        const { code, data } = res
        if (code === 200) {
          const { remoteLoginUrl } = data

          const isPublicCtyun =
            RegExp(/CTYUN/).test(row?.pool?.cloudType) &&
            RegExp(/PUBLIC/).test(row?.pool?.cloudCategory)
          if (isPublicCtyun) {
            const novncRoute = router.resolve({
              path: '/ctyun/novnc',
              query: { remoteLoginUrl }
            })
            window.open(novncRoute.href, '_blank')
          } else {
            window.open(remoteLoginUrl, '_blank')
          }
        } else {
          ElMessage.error('远程登录地址请求失败')
        }
      })
    })
  }
  // 列表左侧按钮
  attrData.leftButtons = leftButtons

  const clickLeftEvent = (value: string | number | object) => {
    if (value === 'create') {
      handleCloudHostCreate()
    } else if (value === 'unbindTag') {
      dialogType.value = 'unbindTag'
      showDialog.value = true
    }
  }
  // 监控操作按钮是否可用
  watch(
    () => state.dataListSelections,
    value => {
      attrData.leftButtons?.forEach((item: any, index: number) => {
        if (index === 0) {
          item.disabled = false
        } else {
          item.disabled = true
          item.disabledText = '请选择云主机'
        }
      })
      if (value?.length) {
        const existLoading = existPropWithArray('loading', value, 'statusIcon') // 正在进行中
        const existActive = existPropWithArray('RUNNING', value, 'status') // 开机
        const existShutdown = existPropWithArray('SHUTDOWN', value, 'status') // 关机

        if (existLoading) {
          attrData.leftButtons?.forEach((item: any, index: number) => {
            if (index !== 0) {
              item.disabledText = '所选云服务器有不可操作的状态'
            }
          })
        } else if (existActive) {
          // 开机状态云服务器禁止开机操作
          attrData.leftButtons?.forEach((item: any) => {
            if (item.prop === 'powerOn') {
              item.disabled = true
              item.disabledText = '当前云服务器运行中，不能再开机'
            } else {
              item.disabled = false
            }
          })
        } else if (existShutdown) {
          // 关机状态云服务器禁止关机操作
          attrData.leftButtons?.forEach((item: any) => {
            if (item.prop === 'shutdown') {
              item.disabled = true
              item.disabledText = '当前云服务器关机，不能再关机'
            } else if (item.prop === 'reboot') {
              item.disabled = true
              item.disabledText = '当前云服务器关机，不能重启'
            } else {
              item.disabled = false
            }
          })
        } else {
          attrData.leftButtons?.forEach((item: any, index: number) => {
            if (index !== 0) {
              item.disabled = false
            }
          })
        }

        if (existActive && existShutdown) {
          // 开机状态云服务器禁止开机操作
          attrData.leftButtons?.forEach((item: any) => {
            if (
              item.prop === 'powerOn' ||
              item.prop === 'shutdown' ||
              item.prop === 'reboot'
            ) {
              item.disabled = true
              item.disabledText = '所选云服务器不能同时有正在运行和关机状态'
            }
          })
        }
      }
    }
  )

  // 列表右侧按钮
  attrData.rightButtons = rightButtons
  const clickRightEvent = (value: string | number | object) => {
    if (value === 'setting') {
      showDrawer.value = true
    }
  }
  const router = useRouter()
  // 新建弹性云服务器
  const handleCloudHostCreate = () => {
    showDialog.value = true
    dialogType.value = 'resourcePool'
  }

  // 详情
  const handleRedirectDetail = (row: any) => {
    router.push({
      path: '/multi-cloud/cloud-host/detail',
      query: {
        uuid: row?.uuid,
        cloudCategory: row?.pool?.cloudCategory,
        cloudType: row?.pool?.cloudType
      }
    })
  }
  const loopUpdateList = () => {
    let timer: number | undefined
    let loopNum = 3
    if (loopNum > 0) {
      timer = setTimeout(() => {
        getDataList()
        loopNum--
      }, 3000)
    } else {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }
  // 弹框
  const showDialog = ref(false)
  const dialogType = ref<OperateEventEnum | string>()

  // 抽屉是否显示
  const showDrawer = ref(false)
  // 自定义表头
  const onClickSubmit = (value: IdealTableColumnHeaders[]) => {
    const tempArr = value.filter((item: IdealTableColumnHeaders) => item.check)

    const array: IdealTableColumnHeaders[] = []
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
    headerArray,
    state,
    tableHeaders,
    sizeChangeHandle,
    currentChangeHandle,
    selectionChangeHandle,
    handleRedirectDetail,
    clickLeftEvent,
    clickRightEvent,
    clickOperateEvent,
    loopUpdateList,
    onClickSubmit,
    showDialog,
    dialogType,
    attrData,
    showDrawer,
    typeArray,
    onClickSearch,
    exitSearchResult
  }
}
