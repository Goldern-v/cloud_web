import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp
} from '@/types'
export const loadBalanceInfo = () => {
  /**
   * 列表
   */
  const state: IHooksOptions = reactive({
    dataListUrl: '',
    deleteUrl: '',
    queryForm: {}
  })

  state.dataList = [
    {
      name: 'elb-978a',
      uuid: 'bdhdc-wjswi-12nqwd-nxiqw',
      instanceType: '共享型',
      specification: '性能保障模式',
      ipAddress: '192.168.10.0',
      vpc: 'vpc default',
      privateIp: '192.168.0.199',
      publicIp: '1.04.55.154',
      statusText: '运行中',
      eipList: [
        {
          ipAddress: '1.94.45.229',
          bandwidthSize: '5Mbit/s'
        }
      ]
    }
  ]
  const {
    selectionChangeHandle,
    sizeChangeHandle,
    currentChangeHandle,
    getDataList
  } = useCrud(state)

  const multipleSelection: any = ref([])
  watch(
    () => state.dataListSelections,
    arr => {
      multipleSelection.value = arr
      attrData.leftButtons.forEach((item: any, index: number) => {
        item.disabled = index !== 0
        item.disabledText = '请选择一个或多个包年/包月的负载均衡器'
      })
      if (arr?.length) {
        attrData.leftButtons.forEach((item: any) => {
          item.disabled = false
          item.disabledText = ''
        })
      }
    },
    { deep: true }
  )

  watch(
    () => state.dataList,
    value => {
      if (value?.length) {
        value.forEach((item: any) => {
          item.showCopy = false
        })
      }
    }
  )

  // 搜索
  const clickSearch = (search: string, type: string) => {
    state.queryForm.type = type
    state.queryForm.search = search
    getDataList()
  }

  // 重置
  const clickReset = () => {
    state.page = 1
    state.queryForm = {}
    getDataList()
  }

  // 列表下拉搜索
  const searchOptions = [
    { label: '名称', prop: 'name' },
    { label: 'ID', prop: 'uuid' }
  ]

  const tableHeaders: IdealTableColumnHeaders[] = [
    { label: '名称', prop: 'name', useSlot: true },
    { label: '状态', prop: 'operatingStatus' },
    { label: '网络类型', prop: 'netType' },
    { label: '服务地址', prop: 'serviceAddress' },
    { label: '所属网络', prop: 'net' },
    { label: '监听器端口', prop: 'serviceAddress' },
    { label: '健康检查', prop: 'healthCheck' },
    { label: '公费计费信息', prop: 'billingInfo' },
    { label: '计费模式', prop: 'billingMode' },
    { label: '创建时间', prop: 'createDate' }
  ]
  //添加监听器
  const addListener = () => {
    router.push({
      path: '/multi-cloud/elb/add-listener'
    })
  }

  // 详情
  const handleRedirectDetail = (row: any) => {
    const data = JSON.stringify(row)
    router.push({
      path: '/multi-cloud/elb/detail',
      query: { detail: data }
    })
  }

  //列表操作按钮
  const operateBtns: IdealTableColumnOperate[] = [
    { title: '添加监听器', prop: 'add-listener' },
    { title: '修改IPv4带宽', prop: 'edit-bandwidth' },
    { title: '删除', prop: 'delete' },
    { title: '绑定IPv4公网IP', prop: 'bind-ipv4' },
    { title: '解绑IPv4公网IP', prop: 'unbind-ipv4' },
    { title: '停用', prop: 'out-of-service' },
    { title: '转包年/包月', prop: 'turn-package' },
    { title: '查看访问日志', prop: 'view-log' }
  ]

  const rowData = ref({})
  const clickOperateEvent = (
    command: string | number | object,
    row: object
  ) => {
    rowData.value = row
    let data = JSON.stringify(row)
    if (command === 'add-listener') {
      router.push({
        path: '/multi-cloud/elb/add-listener'
      })
    } else if (command === 'edit-bandwidth') {
      router.push({
        path: '/multi-cloud/elb/edit-bandwidth',
        query: {
          data
        }
      })
    } else if (command === 'delete') {
      showDialog.value = true
      dialogType.value = OperateEventEnum.delete
    } else if (command === 'bind-ipv4') {
      showDialog.value = true
      dialogType.value = OperateEventEnum.bind
    } else if (command === 'unbind-ipv4') {
      showDialog.value = true
      dialogType.value = OperateEventEnum.unbind
    } else if (command === 'out-of-service') {
      showDialog.value = true
      dialogType.value = OperateEventEnum.close
    } else if (command === 'view-log') {
      router.push({
        path: '/multi-cloud/elb/detail',
        query: { detail: data, type: 'log' }
      })
    }
  }

  // 列表左侧按钮
  const attrData = reactive({
    leftButtons: [] as IdealButtonEventProp[]
  })
  attrData.leftButtons = [
    {
      title: '购买弹性负载均衡',
      prop: 'create',
      type: 'primary',
      icon: 'circle-add',
      iconColor: 'white'
    },
    {
      title: '续费',
      prop: 'renew',
      disabled: true,
      disabledText: '请选择一个或多个需要转包年/包月的负载均衡器'
    },
    {
      title: '退订',
      prop: 'unsubscribe',
      disabled: true,
      disabledText: '请选择一个或多个需要转包年/包月的负载均衡器'
    },
    {
      title: '导出',
      prop: 'export'
    }
  ]

  const router = useRouter()
  const clickLeftEvent = (value: string | number | object) => {
    if (value === 'create') {
      showDialog.value = true
      dialogType.value = 'resourcePool'
    } else if (value === 'unsubscribe') {
      showDialog.value = true
      dialogType.value = OperateEventEnum.unsubscribe
    }
  }

  /**
   * 弹窗
   */
  const showDialog = ref(false)
  const dialogType = ref<OperateEventEnum | string>()
  const clickCloseEvent = () => {
    showDialog.value = false
  }
  const clickRefreshEvent = () => {
    if (dialogType.value === 'resourcePool') {
      router.push({ path: '/multi-cloud/elb/create' })
    }
    showDialog.value = false
  }

  return {
    state,
    selectionChangeHandle,
    sizeChangeHandle,
    currentChangeHandle,
    clickSearch,
    clickReset,
    searchOptions,
    tableHeaders,
    operateBtns,
    clickOperateEvent,
    clickLeftEvent,
    dialogType,
    attrData,
    handleRedirectDetail,
    clickRefreshEvent,
    clickCloseEvent,
    showDialog,
    rowData,
    multipleSelection,
    addListener
  }
}
