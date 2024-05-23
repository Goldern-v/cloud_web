import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import store from '@/store'
import { ElMessage, ElMessageBox } from 'element-plus'
import { existPropWithArray } from '@/utils/tool'
import { RESOURCE_STATUS, RESOURCE_STATUS_ICON } from '@/utils/dictionary'
import { OperateEventEnum, BillingEnum, FiltrateEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealSearch,
  IdealSearchResult,
  IdealTableColumnOperate,
  IdealButtonEventProp
} from '@/types'
import {
  cloudDiskPageUrl,
  cloudDiskUnsubscribeUrl,
  cloudDiskDelete
} from '@/api/java/store'

export const useList = () => {
  // 列表
  const state: IHooksOptions = reactive({
    dataListUrl: cloudDiskPageUrl,
    deleteUrl: cloudDiskUnsubscribeUrl,
    queryForm: {}
  })
  const {
    selectionChangeHandle,
    sizeChangeHandle,
    currentChangeHandle,
    getDataList,
    query
  } = useCrud(state)
  // 搜索
  const typeArray = ref<IdealSearch[]>([
    { label: '名称', prop: 'name', type: FiltrateEnum.input },
    { label: 'UUID', prop: 'uuid', type: FiltrateEnum.input }
  ])
  const onClickSearch = (v: IdealSearchResult[]) => {
    state.queryForm = {}
    if (v.length) {
      v.forEach((item: IdealSearchResult) => {
        state.queryForm[item.prop] = item.value
      })
    }
    getDataList()
  }
  // 监听列表
  watch(
    () => state.dataList,
    value => {
      if (value?.length) {
        value.forEach((item: any) => {
          item.encryptionDisk = item.encrypted === 1 ? '是' : '否'
          item.diskAttribute = item.bootable === 1 ? '系统盘' : '数据盘'
          item.billingMode =
            item.billType === BillingEnum.PACKAGE ? '包年包月' : '按需'
          item.statusText = RESOURCE_STATUS[item.status.toUpperCase()]
          item.statusIcon = RESOURCE_STATUS_ICON[item.status.toUpperCase()]
          item.instanceName = item.instanceName ? item.instanceName : '--'
          item.operate = newOperate(item)
        })
      }
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
  // 根据每行数据状态判断操作是否禁用
  const newOperate = (item: any): IdealTableColumnOperate[] => {
    let resultArr: IdealTableColumnOperate[] = []
    const tempArr = JSON.parse(JSON.stringify(operateBtns))
    //
    if (item.billType === BillingEnum.PACKAGE) {
      const renew = { title: '续订', prop: 'renew' }
      tempArr.splice(5, 0, renew)
    }

    if (item.cloudResourcePool.cloudType === 'VMWARE') {
      resultArr = handlePrivateVmware(tempArr)
    } else {
      resultArr = handleOperateBtn(item, tempArr)
    }

    return resultArr
  }
  const handlePrivateVmware = (
    array: IdealTableColumnOperate[]
  ): IdealTableColumnOperate[] => {
    array.forEach((item: any) => {
      item.disabled = true
      item.disabledText = 'VMWARE云平台类型不允许操作'
    })
    return array
  }
  //
  const handleOperateBtn = (
    item: any,
    array: IdealTableColumnOperate[]
  ): IdealTableColumnOperate[] => {
    // 根据计费模式显示退订或删除
    if (item.billType !== BillingEnum.ON_DEMAND) {
      array.forEach((child: any) => {
        if (child.prop === 'delete') {
          child.title = '退订'
          child.prop = 'unsubscribe'
        }
      })
    }
    // 判断云硬盘是否挂载
    if (!item?.available) {
      array.forEach((child: any) => {
        if (child.prop === 'mount') {
          child.disabled = true
          child.disabledText = '只有可用状态的磁盘才能挂载。'
        } else if (child.prop === 'delete' || child.prop === 'unsubscribe') {
          child.disabled = true
          child.disabledText =
            '正在使用状态的磁盘不允许执行此操作，请先卸载磁盘。'
        }
      })
    } else {
      array.forEach((child: any) => {
        if (child.prop === 'uninstall') {
          child.disabled = true
          child.disabledText = '只有挂载状态的磁盘才能进行卸载。'
        }
      })
    }

    if (item?.statusIcon === 'loading') {
      array.forEach((child: any) => {
        child.disabled = true
        child.disabledText = `${item?.statusText}暂不能操作`
      })
    }
    // bootable = 1 不挂载、不卸载 不退订
    if (item?.bootable) {
      array.forEach((child: any) => {
        child.disabled = child.prop !== 'associateTag'
        child.disabledText = `系统盘禁止操作`
      })
    } else if (
      // 华为私有云 底层限制：关机状态的云硬盘支持卸载
      item?.instanceStatus !== 'SHUTDOWN' &&
      RegExp(/HUAWEI/).test(item?.cloudResourcePool?.cloudType) &&
      RegExp(/PRIVATE/).test(item?.cloudResourcePool?.cloudCategory) &&
      !item?.available
    ) {
      array.forEach((child: any) => {
        if (child.prop === 'uninstall') {
          child.disabled = true
          child.disabledText = `挂载云主机只有关机状态，云硬盘才支持卸载。`
        }
      })
    }
    // 阿里公有云
    if (
      RegExp(/PUBLIC/).test(item?.cloudResourcePool?.cloudCategory) &&
      RegExp(/ALI/).test(item?.cloudResourcePool?.cloudType) &&
      item.bootable &&
      !item?.available
    ) {
      array.forEach((child: any) => {
        if (child.prop === 'delete' || child.prop === 'unsubscribe') {
          child.disabled = true
          child.disabledText = '包年包月的数据盘需与云服务器共同卸载'
        }
      })
    }
    return array
  }
  // 操作事件
  const rowData = ref()
  const clickOperateEvent = (command: string | number | object, row: any) => {
    rowData.value = row
    if (command === 'mount') {
      showDialog.value = true
      dialogType.value = OperateEventEnum.mount
    } else if (command === 'expand') {
      const data = JSON.stringify(row)
      router.push({ path: '/multi-cloud/cloud-disk/expand', query: { data } })
    } else if (command === 'backup') {
      showDialog.value = true
      dialogType.value = 'backup'
    } else if (command === 'snapShoot') {
      showDialog.value = true
      dialogType.value = 'snapShoot'
    } else if (command === 'uninstall') {
      showDialog.value = true
      dialogType.value = OperateEventEnum.uninstall
    } else if (command === 'delete') {
      deleteEvent()
    } else if (command === 'unsubscribe') {
      showDialog.value = true
      dialogType.value = OperateEventEnum.unsubscribe
    } else if (command === 'associateTag') {
      showDialog.value = true
      dialogType.value = OperateEventEnum.associate
    } else if (command === 'renew') {
      showDialog.value = true
      dialogType.value = OperateEventEnum.renew
    }
  }
  const deleteEvent = () => {
    ElMessageBox.confirm('确定要删除此云硬盘?', '删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      const params = {
        id: rowData.value.id,
        resourcePoolId: rowData.value.resourcePoolId,
        regionId: rowData.value.regionId,
        projectId: rowData.value.projectId
      }
      cloudDiskDelete(params).then((res: any) => {
        const { code, eventFlowId } = res
        if (code === 200) {
          if (eventFlowId.length) {
            // 保存事件流id
            eventFlowId.forEach((item: string) => {
              store.resourceStore.eventFlow.push({ eventFlowId: item })
            })
          }
          ElMessage.success('删除成功')
          query()
        } else {
          ElMessage.error('删除失败')
        }
      })
    })
  }

  // 列表左侧按钮
  const leftButtons = ref<IdealButtonEventProp[]>([
    {
      title: '新建云硬盘',
      prop: 'create',
      type: 'primary',
      icon: 'circle-add',
      iconColor: 'white'
    },
    {
      title: '导出',
      prop: 'export',
      disabled: true,
      disabledText: '请选择磁盘'
    },
    { title: '批量解绑标签', prop: 'unbindTag', disabled: false }
  ])
  const clickLeftEvent = (value: string | number | object) => {
    if (value === 'create') {
      handleCloudDiskCreate()
    } else if (value === 'unbindTag') {
      dialogType.value = 'unbindTag'
      showDialog.value = true
    }
  }
  const searchRef = ref()

  const rightButtons = ref<IdealButtonEventProp[]>([
    { prop: 'refresh', icon: 'refresh-icon' }
  ])
  const clickRightEvent = (value: string | number | object) => {
    if (value === 'refresh') {
      state.queryForm = {}
      searchRef.value.clickDeleteAll()
      getDataList()
    }
  }
  watch(
    () => state.dataListSelections,
    value => {
      leftButtons.value[1].disabled = true
      if (value?.length) {
        leftButtons.value[1].disabled = false
      }
    }
  )
  const handleCloudDiskCreate = () => {
    showDialog.value = true
    dialogType.value = 'resourcePool'
  }
  const clickDetail = (row: any) => {
    const id = row.id
    router.push({ path: '/multi-cloud/cloud-disk/detail', query: { id } })
  }

  const router = useRouter()

  // 弹框
  const showDialog = ref(false)
  const dialogType = ref<OperateEventEnum | string>()
  const clickCloseEvent = () => {
    resetDialog()
  }
  const clickRefreshEvent = () => {
    if (dialogType.value === 'resourcePool') {
      router.push({ path: '/multi-cloud/cloud-disk/create' })
    }
    resetDialog()
    query()
  }
  // 重置弹框
  const resetDialog = () => {
    showDialog.value = false
    dialogType.value = '' // 防止再点击弹框时 有值
  }

  return {
    state,
    tableHeaders,
    showDialog,
    dialogType,
    leftButtons,
    clickLeftEvent,
    rightButtons,
    clickRightEvent,
    clickCloseEvent,
    clickRefreshEvent,
    selectionChangeHandle,
    sizeChangeHandle,
    currentChangeHandle,
    typeArray,
    onClickSearch,
    clickDetail,
    rowData,
    clickOperateEvent,
    searchRef
  }
}

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称/ID', prop: 'name', useSlot: true },
  { label: '状态', prop: 'status', useSlot: true },
  {
    label: '云平台类别',
    prop: 'cloudResourcePool.cloudCategoryName',
    width: '120'
  },
  {
    label: '云平台类型',
    prop: 'cloudResourcePool.cloudTypeName',
    width: '120'
  },
  {
    label: '云平台名称',
    prop: 'cloudResourcePool.cloudPlatform.name',
    width: '120'
  },
  { label: '资源池名称', prop: 'cloudResourcePool.name', width: '120' },
  { label: '所属项目', prop: 'projectName', width: '120' },
  { label: '可用区', prop: 'availableZone' },
  { label: '磁盘类型', prop: 'volumeTypeName' },
  { label: '容量(GiB)', prop: 'size', useSlot: true },
  { label: '磁盘属性', prop: 'diskAttribute' },
  { label: '挂载云服务器', prop: 'instanceName', width: '150' },
  { label: '共享盘', prop: 'shareable', useSlot: true },
  { label: '磁盘模式', prop: 'volumeMode' },
  { label: '加密盘', prop: 'encryptionDisk' },
  { label: '计费模式', prop: 'billingMode', useSlot: true },
  { label: '标签', prop: 'tag', useSlot: true }
]
// 操作
const operateBtns: IdealTableColumnOperate[] = [
  { title: '挂载', prop: 'mount' },
  { title: '扩容', prop: 'expand' },
  { title: '创建备份', prop: 'backup' },
  { title: '卸载', prop: 'uninstall' },
  { title: '创建快照', prop: 'snapShoot' },
  { title: '删除', prop: 'delete' },
  { title: '标签管理', prop: 'associateTag' }
]
