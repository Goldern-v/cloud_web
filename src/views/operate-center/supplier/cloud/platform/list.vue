<template>
  <div class="ideal-main-container cloud-platform-manage">
    <ideal-search
      ref="searchRef"
      :type-array="typeArray"
      :show-resource-pool="false"
      cloud-category-prop="supplierCloudCategory"
      cloud-type-props="ctgCloudType"
      @clickSearch="onClickSearch"
    />

    <el-divider />

    <ideal-button-events
      :left-btns="leftButtons"
      :right-btns="rightButtons"
      @clickLeftEvent="clickLeftEvent"
      @clickRightEvent="clickRightEvent"
    />

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :total="state.total"
      :page="state.page"
      :pagination-type="PaginationTypeEnum.totalSizes"
      :is-multiple="true"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #name>
        <el-table-column label="名称">
          <template #default="props">
            <el-button link type="primary" @click="clickDetail(props.row)">{{
              props.row.name
            }}</el-button>
          </template>
        </el-table-column>
      </template>

      <template #platformType>
        <el-table-column label="云平台类型">
          <template #default="props">
            <el-image
              :src="`/images/${props.row?.cloudTypeImageUrl}`"
              :crossorigin="null"
              style="width: 40px; height: 40px"
            />
          </template>
        </el-table-column>
      </template>

      <template #attribute>
        <el-table-column label="属性" show-overflow-tooltip>
          <template #default="props">
            <div v-if="props.row.secret">
              <template v-if="props.row.secret.region">
                <div>区域：{{ props.row.secret.region }}</div>
              </template>
              <template v-if="props.row.secret.subscriptionId">
                <div>订阅ID：{{ props.row.secret.subscriptionId }}</div>
              </template>
              <template v-if="props.row.secret.tenantId">
                <div>租户ID：{{ props.row.secret.tenantId }}</div>
              </template>
            </div>
            <div v-else-if="props.row.password">
              <div>端口：{{ props.row.password.accessPort }}</div>
              <div>访问API主机：{{ props.row.password.accessUrl }}</div>
            </div>
          </template>
        </el-table-column>
      </template>

      <template #statusText>
        <el-table-column label="状态">
          <template #default="props">
            <ideal-status-icon
              :status-icon="props.row.statusIcon"
              :status-text="props.row.statusText"
            ></ideal-status-icon>
          </template>
        </el-table-column>
      </template>

      <template #readOnly>
        <el-table-column label="只读状态">
          <template #default="props">
            <div @click="clickReadOnly(props.row)">
              <el-switch v-model="props.row.readOnly" />
            </div>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作" width="185">
          <template #default="props">
            <ideal-table-operate
              :buttons="props.row.operate"
              @clickMoreEvent="clickOperateEvent($event as any, props.row)"
            >
            </ideal-table-operate>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      :selection-data="state.dataListSelections"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus/es'
import dialogBox from './dialog-box.vue'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { existPropWithArray } from '@/utils/tool'
import { RESOURCE_STATUS_ICON, RESOURCE_STATUS } from '@/utils/dictionary'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealButtonEventProp,
  IdealSearch,
  IdealSearchResult
} from '@/types'
import {
  PaginationTypeEnum,
  OperateEventEnum,
  FiltrateEnum
} from '@/utils/enum'
import {
  cloudPlatformPageUrl,
  cloudPlatformUpdateReadOnly,
  cloudPlatformDelete,
  cloudPlatformConnectCheck,
  cloudPlatformBatchDelete
} from '@/api/java/operate-center'

// 搜索
const typeArray = ref<IdealSearch[]>([
  { label: '名称', prop: 'name', type: FiltrateEnum.input }
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

// 获取搜索组件
const searchRef = ref()
// 重置
const clickReset = () => {
  searchRef.value.clickDeleteAll()
}
// 列表
const state: IHooksOptions = reactive({
  dataListUrl: cloudPlatformPageUrl,
  deleteUrl: cloudPlatformDelete,
  queryForm: {},
  primaryKey: 'id' // 多选结果主键
})

const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  deleteHandle,
  getDataList
} = useCrud(state)
watch(
  () => state.dataList,
  value => {
    if (value) {
      value.map((item: any) => {
        item.statusIcon = RESOURCE_STATUS_ICON[item.status.toUpperCase()]
        item.statusText = RESOURCE_STATUS[item.status]
        item.category =
          item.supplierCloudCategory === 'PUBLIC' ? '公有云' : '私有云' // 云平台类别
        item.readOnly = !!item.mode // 0读写 1只读
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
      getDataList()
    }, 5000)
  } else {
    if (timer) {
      clearTimeout(timer)
    }
  }
}
// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true },
  { label: '云平台类别', prop: 'category' },
  { label: '云平台类型', prop: 'platformType', useSlot: true },
  { label: '属性', prop: 'attribute', useSlot: true }, // secret有值则显示密钥 password有值则显示账户
  { label: '状态', prop: 'statusText', useSlot: true },
  { label: '创建者', prop: 'creator.name' },
  { label: '创建时间', prop: 'createTime.date' }
]
// 列表左侧按钮
const leftButtons = ref<IdealButtonEventProp[]>([
  {
    title: '创建云平台',
    prop: 'create',
    type: 'primary',
    icon: 'circle-add',
    iconColor: 'white',
    authority: 'supplier:platform:add'
  }
])
const router = useRouter()
const clickLeftEvent = (value: string | number | object) => {
  if (value === 'create') {
    router.push({
      path: '/operate-center/supplier/platform/create',
      query: {
        type: 'create'
      }
    })
  } else if (value === 'sync') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.sync
  } else if (value === 'delete') {
    showDialog.value = true
    dialogType.value = OperateEventEnum.delete
  }
}

watch(
  () => state.dataListSelections,
  value => {
    // leftButtons.value[2].disabled = true
    // value数组只有主键,需从state.dataList遍历数据判断是否公有云或私有云
    if (value?.length && state.dataList?.length) {
      let arr = state.dataList.filter(item => {
        return value.includes(item.id) // 根据多选结果主键筛选
      })
      // 选择有私有云则不能点击同步
      // leftButtons.value[1].disabled = arr.some(v =>
      //   RegExp(/PRIVATE/g).test(v.supplierCloudCategory)
      // )
      // leftButtons.value[1].disabledText =
      //   '只有公有云支持同步账单功能，且该平台启用了账单同步策略。'

      // 所选公有云未启用账单同步
      if (
        arr.some(
          v =>
            v.sync === false && RegExp(/PUBLIC/g).test(v.supplierCloudCategory)
        )
      ) {
        ElMessage.error('所选的平台有未启用账单同步')
        // leftButtons.value[1].disabled = true
      }

      // leftButtons.value[2].disabled = false
    } else {
      // leftButtons.value[1].disabled = true
    }
  }
)
const rightButtons = ref<IdealButtonEventProp[]>([
  {
    title: '刷新',
    prop: 'refresh',
    icon: 'refresh-icon',
    authority: 'supplier:platform:refresh'
  },
  {
    title: '批量删除',
    prop: 'delete',
    icon: 'delete-icon',
    authority: 'supplier:platform:delete'
  }
])
const clickRightEvent = (value: string | number | object) => {
  if (value === 'refresh') {
    clickReset()
  } else if (value === 'delete') {
    if (!state.dataListSelections?.length) {
      return ElMessage.warning('请至少选择一条')
    }
    ElMessageBox.confirm('确定进行删除操作?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        cloudPlatformBatchDelete({ ids: state.dataListSelections })
          .then((res: any) => {
            const { code } = res
            if (code === 200) {
              ElMessage.success('删除成功')
              getDataList()
            } else {
              ElMessage.error(res.msg || '删除失败')
            }
          })
          .catch(_ => {
            ElMessage.error('删除失败')
          })
      })
      .catch(() => {})
  }
}
const operateBtns = ref<IdealTableColumnOperate[]>([
  { title: '编辑', prop: 'edit', authority: 'supplier:platform:edit' },
  {
    title: '连接校验',
    prop: 'check',
    authority: 'supplier:platform:connection:check'
  },
  { title: '删除', prop: 'delete', authority: 'supplier:platform:delete' }
])
const clickOperateEvent = (command: string | number, row: any) => {
  if (command === 'edit') {
    router.push({
      path: '/operate-center/supplier/platform/create',
      query: {
        id: row.id,
        cloudCategory: row.supplierCloudCategory,
        cloudType: row.ctgCloudType,
        type: 'edit'
      }
    })
  } else if (command === 'delete') {
    deleteHandle(row.id, '/')
  } else if (command === 'check') {
    connectCheck(row?.id)
  }
}
const connectCheck = (id: string) => {
  cloudPlatformConnectCheck({ id }).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('云账号有效')
    } else {
      ElMessage.error('云账号无效')
    }
  })
}
// 根据每行数据状态判断操作是否禁用
const newOperate = (item: any): IdealTableColumnOperate[] => {
  let resultArr: IdealTableColumnOperate[] = []
  const tempArr = JSON.parse(JSON.stringify(operateBtns.value))

  // enableUpdate: true 可编辑删除 false 当前云平台有资源池不可编辑删除
  // if (!item.enableUpdate) {
  //   const tip = `已添加资源池不可编辑/删除`
  //   resultArr = setDisableOperateBtns(true, tip, tempArr)
  // } else {
  resultArr = setOperateBtns(false, '', tempArr)
  // }
  if (item.statusIcon === 'loading') {
    const tip = `${RESOURCE_STATUS[item.status]}不可操作`
    resultArr = setOperateBtns(true, tip, tempArr)
  }
  return resultArr
}
const setOperateBtns = (
  disabled: boolean,
  disabledText: string,
  array: IdealTableColumnOperate[]
): IdealTableColumnOperate[] => {
  const arr: IdealTableColumnOperate[] = []
  array.forEach((item: any) => {
    if (!item.children) {
      item.disabled = disabled
      item.disabledText = disabledText
    }
    arr.push(item)
  })
  return arr
}
const setDisableOperateBtns = (
  disabled: boolean,
  disabledText: string,
  array: IdealTableColumnOperate[]
): IdealTableColumnOperate[] => {
  const arr: IdealTableColumnOperate[] = []
  array.forEach((item: any) => {
    if (!item.children && item.prop !== 'check') {
      item.disabled = disabled
      item.disabledText = disabledText
    }
    arr.push(item)
  })
  return arr
}
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum>()

const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = () => {
  showDialog.value = false
  getDataList()
}

// 详情
const clickDetail = (rowData: any) => {
  router.push({
    path: '/operate-center/supplier/platform/detail',
    query: {
      id: rowData.id,
      supplierCloudCategory: rowData.supplierCloudCategory,
      ctgCloudType: rowData.ctgCloudType,
      type: 'detail'
    }
  })
}
// 只读模式修改
const clickReadOnly = (item: any) => {
  let params = {
    id: item.information.id,
    readOnlyModel: item.readOnly ? '1' : '0'
  }
  cloudPlatformUpdateReadOnly(params)
    .then((res: any) => {
      let { code } = res
      if (code === 200) {
        ElMessage.success('修改成功')
      } else {
        ElMessage.error('修改失败')
      }
    })
    .catch(_ => {
      ElMessage.error('修改失败')
    })
}
</script>

<style scoped lang="scss">
.cloud-platform-manage {
  padding: $idealPadding;
  background-color: white;
  box-sizing: border-box;
  :deep(.el-select__wrapper) {
    min-height: 34px;
  }
  :deep(.el-button) {
    height: 34px;
  }
  :deep(.el-select .el-input) {
    width: 200px;
    height: 34px;
  }
  .cloud-platform-manage__button {
    justify-content: space-between;
    align-items: center;
  }
  .custom-select {
    width: 200px;
  }
  .custom-color {
    color: var(--el-color-primary);
  }
  .cloud-platform-manage__table-name {
    cursor: pointer;
  }
}
</style>
