<template>
  <div class="name-norm">
    <div class="name-norm-table">
      <ideal-select-search
        :search-type="SearchTypeEnum.title"
        prefix-title="规范名称"
        @clickSearch="clickSearch"
        @clickReset="clickReset"
      />

      <el-divider border-style="solid" />

      <el-button type="primary" @click="handleCreate">
        <svg-icon icon="circle-add" class="ideal-svg-margin-right"></svg-icon>
        创建命名规范
      </el-button>

      <ideal-table-list
        :loading="state.dataListLoading"
        :table-data="state.dataList"
        :table-headers="tableHeaders"
        :total="state.total"
        :page="state.page"
        @clickSizeChange="sizeChangeHandle"
        @clickCurrentChange="currentChangeHandle"
        @handleSelectionChange="selectionChangeHandle"
      >
        <template #operation>
          <el-table-column label="操作" width="120">
            <template #default="props">
              <div>
                <el-button
                  link
                  type="primary"
                  @click="editItem($event, props.row)"
                  >编辑</el-button
                >
                <span class="ideal-vertical-line">丨</span>
                <el-button
                  link
                  type="primary"
                  @click="deleteItem($event, props.row)"
                  >删除</el-button
                >
              </div>
            </template>
          </el-table-column>
        </template>
      </ideal-table-list>
    </div>

    <div class="flex-row footer-button">
      <el-button type="primary" @click="clickSubmit">{{ t('save') }}</el-button>
      <el-button @click="clickCancel">{{ t('back') }}</el-button>
    </div>

    <dialog-box
      v-if="showDialog"
      :row-data="rowData"
      :type="dialogType"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import dialogBox from './dialog-box.vue'
import { useCrud } from '@/hooks'
import { ElMessage, ElMessageBox } from 'element-plus'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum, SearchTypeEnum } from '@/utils/enum'
import { getNormsListApi, deleVdcNameNormApi } from '@/api/java/business-center'

const { t } = useI18n()

// 这里要更换接口url
const state: IHooksOptions = reactive({
  dataListUrl: getNormsListApi,
  dataList: [],
  total: 0,
  isPage: true,
  pageSizes: [10, 20, 50, 100],
  dataListLoading: true,
  queryForm: {
    vdcId: useRoute().query.id,
    // vdcCode: useRoute().query.code,
    pageNum: 1,
    pageSize: 10
  }
})
const {
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle,
  getDataList
} = useCrud(state)

// 搜索
const clickSearch = (search: string, type: string) => {
  if (search) {
    state.queryForm['name'] = search
  }
  getDataList()
}

// 重置
const clickReset = () => {
  state.page = 1
  state.queryForm.name = ''
  getDataList()
}

const tableHeaders = [
  { label: '规范名称', prop: 'name', useSlot: false, width: '' },
  { label: '描述', prop: 'remark', useSlot: false, width: '' },
  { label: '云资源', prop: 'resourceTypeTest', useSlot: false, width: '' },
  { label: '命名后缀类型', prop: 'suffixTypeText', useSlot: false, width: '' },
  { label: '后缀长度', prop: 'suffixLength', useSlot: false, width: '' },
  { label: '创建者', prop: 'createName', useSlot: false, width: '' },
  { label: '创建时间', prop: 'createTimeText', useSlot: false, width: '' }
]

// const operateBtns = [
//   { type: '', title: '挂载', prop: 'mounted' },
//   { type: '', title: '卸载', prop: 'unmounted' },
//   { type: 'primary', title: '扩容', prop: 'expansion' },
//   { type: 'success', title: '续订', prop: 'renewal' },
//   { type: 'info', title: '更改云硬盘名称', prop: 'change' },
//   { type: 'success', title: '关联订单', prop: 'relation' },
//   { type: 'success', title: '退订', prop: 'unsubscribe' },
//   { type: 'success', title: '删除', prop: 'delete' }
// ]

// const defaultProps = {
//   children: 'children',
//   label: 'label',
// }
// VDC树 end

const router = useRouter()
// 新增编辑
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum>()
const rowData = ref({})
const handleCreate = () => {
  showDialog.value = true
  rowData.value = {}
  dialogType.value = OperateEventEnum.create
}
const editItem = (command: string | number | object, row: object) => {
  showDialog.value = true
  rowData.value = row
  dialogType.value = OperateEventEnum.edit
}

const resourceType: any = {
  ECS: '云主机',
  IMAGE: '镜像',
  EBS: '云硬盘',
  SLB: '负载均衡',
  VPC: '虚拟机',
  BMS: '裸金属',
  EIP: '弹性IP',
  REP: '存储库',
  EFS: '弹性文件系统',
  SBW: '共享带宽',
  VPN_G: 'VPN网关',
  NAT_G: 'NAT网关',
  SUBNETS: '子网',
  ACL: 'ACL',
  SEC_GROUP: '安全组',
  GIVE: '告警',
  CM: '证书管理',
  HIGH_SPEED: '云间高速',
  IPV6_BW: 'IPV6带宽',
  VIP: '虚IP',
  IPSEC: 'IPSec隧道',
  SEC_GROUP_RULE: '安全组规则',
  NIC: '网卡'
}

const suffixType: any = {
  NUMBER_LIST: '数字序列',
  DYNAMIC_NUMBER_LIST: '动态数字序列',
  RANDOM_STRING: '随机数字串'
}

const clickCloseEvent = () => {
  rowData.value = {}
  showDialog.value = false
}
const clickRefreshEvent = () => {
  rowData.value = {}
  showDialog.value = false
  getDataList()
}
const deleteItem = (command: string | number | object, row: any) => {
  // messageDialog({
  //   title: '删除命名规范',
  //   msg: '确定要删除当前命名规范吗？',
  //   type: 'warning',
  //   onOk: async () => {
  //     const res: any = await deleVdcNameNormApi(row)
  //     if (res.code == 200) {
  //       ElMessage.success('删除成功')
  //       getDataList()
  //     } else {
  //       ElMessage.error('删除失败')
  //     }
  //   },
  //   onCancel: () => {
  //     console.log('取消删除')
  //   }
  // })
  ElMessageBox.confirm('确定要删除当前命名规范吗？', '删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const res: any = await deleVdcNameNormApi(row)
    if (res.code == 200) {
      ElMessage.success('删除成功')
      getDataList()
    } else {
      ElMessage.error('删除失败')
    }
  })
}
watch(
  () => state.dataList,
  value => {
    value?.forEach(item => {
      item.resourceTypeTest = resourceType[item.resourceType]
      item.suffixTypeText = suffixType[item.suffix.type]
      item.suffixLength = item.suffix.length
      item.createTimeText = item.createTime.date
      item.createName = item.creator.name
    })
  }
)
onMounted(() => {})

const clickSubmit = () => {}
const clickCancel = () => {
  router.back()
}
</script>

<style scoped lang="scss">
.name-norm {
  width: 100%;
  .name-norm-table {
    padding: 20px;
    background-color: white;
  }
  .footer-button {
    margin-top: 5px;
    padding: 20px;
    background-color: white;
    justify-content: flex-start;
    align-items: center;
  }
}
</style>
