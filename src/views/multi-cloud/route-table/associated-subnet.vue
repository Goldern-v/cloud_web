<template>
  <div class="associate-subnet">
    <div class="flex-row associate-subnet__warning-tip">
      <svg-icon icon="info-warning" color="#F3AD3C"></svg-icon>
      <span class="associate-subnet__warning-tip-content"
        >一个子网只能关联一个路由表，关联后，子网的云资源将启用新路由表策略，请确认对业务造成的影响，谨慎操作。</span
      >
    </div>

    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="所选路由表">
        <div>
          {{ props.rowData.name }}({{
            props.rowData.defaultRoute ? '默认路由表' : '自定义路由表'
          }})
        </div>
      </el-form-item>

      <el-form-item label="虚拟私有云" prop="name">
        <div>{{ props.rowData.vpc?.name }}</div>
      </el-form-item>
    </el-form>

    <ideal-search :type-array="typeArray" @clickSearch="onClickSearch" />

    <ideal-table-list
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :show-pagination="false"
    >
      <template #select>
        <el-table-column width="50" align="center">
          <template #header>
            <el-checkbox v-model="checkAll" @change="selectAll"></el-checkbox
          ></template>
          <template #default="scope">
            <el-tooltip
              content="该子网已被此路由表关联"
              placement="top"
              :disabled="scope.row.routeTableId !== props.rowData.id"
            >
              <el-checkbox
                v-model="scope.row.checked"
                :disabled="scope.row.routeTableId === props.rowData.id"
              ></el-checkbox>
            </el-tooltip>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <div class="ideal-default-margin-top">已选子网({{ selectSubnets.length }})</div>

    <div class="flex-row associate-subnet-button">
      <el-button type="info" @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum, FiltrateEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealSearch,
  IdealTextProp
} from '@/types'
import { showLoading, hideLoading } from '@/utils/tool'
import { ElMessage } from 'element-plus'
import { subnetListUrl, routeTableBindSubnet } from '@/api/java/network'
import store from '@/store'
interface routeProps {
  rowData?: any
}
const props = withDefaults(defineProps<routeProps>(), {
  rowData: () => ({})
})

const typeArray = ref<IdealSearch[]>([
  { label: '名称', prop: 'name', type: FiltrateEnum.input },
  { label: 'UUID', prop: 'uuid', type: FiltrateEnum.input }
])

const onClickSearch = (v: IdealTextProp[]) => {
  state.queryForm = {}
  state.queryForm.vdcId = props.rowData.vdcId
  state.queryForm.vpcId = props.rowData.vpc?.id
  if (v.length) {
    v.forEach((item: IdealTextProp) => {
      const temp = item.label.split('：')
      state.queryForm[item.prop] = temp[1]
    })
  }
  getDataList()
}

const { t } = useI18n()
const formRef = ref<FormInstance>()
const form = reactive({})

const rules = reactive<FormRules>({})
const state: IHooksOptions = reactive({
  dataListUrl: subnetListUrl,
  deleteUrl: '',
  isPage: false,
  queryForm: {
    vdcId: store.userStore.user.vdcId,
    vpcId: props.rowData.vpc?.id
  }
})
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '', prop: 'select', useSlot: true },
  { label: '名称', prop: 'name' },
  { label: 'ipv4网段', prop: 'cidr' },
  { label: '路由表', prop: 'routeTableName' }
]
const { getDataList } = useCrud(state)

const checkAll = ref('')
const selectAll = (val: boolean) => {
  state.dataList?.forEach((item: any) => {
    if (item.routeTableId !== props.rowData.id) {
      item.checked = val
    }
  })
}

const selectSubnets: any = ref([])
watch(
  () => state.dataList,
  arr => {
    if (arr?.length) {
      selectSubnets.value = arr?.filter(item => item.checked)
    }
  },
  { deep: true }
)

// 搜索值
const searchValue = ref('')
// 搜索
const clickSearch = () => {
  if (!searchValue.value) {
    return
  }
}

// 点击事件
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const cancelForm = () => {
  emit(EventEnum.cancel)
}

const commonParams = {
  resourcePoolId: props.rowData.resourcePoolId,
  regionId: props.rowData.regionId,
  projectId: props.rowData.projectId
}
const submitForm = () => {
  const subnetList = selectSubnets.value?.map((item: any) => {
    return {
      id: item.id,
      uuid: item.uuid
    }
  })
  const params = {
    name: props.rowData.name,
    id: props.rowData.id,
    subnetList,
    ...commonParams
  }
  showLoading('关联中...')
  routeTableBindSubnet(params)
    .then((res: any) => {
      const { data, code } = res
      if (code === 200) {
        ElMessage.success('关联子网成功')
        emit(EventEnum.success)
      } else {
        ElMessage.error('关联子网失败')
      }
      hideLoading()
    })
    .catch(err => {
      hideLoading()
    })
}
</script>

<style scoped lang="scss">
.associate-subnet {
  width: 100%;
  // 修改图标
  .associate-subnet__warning-tip {
    background-color: #fefbed;
    padding: 20px;
    .associate-subnet__warning-tip-content {
      color: black;
      margin-left: 5px;
    }
  }
  .associate-subnet-button {
    margin-top: 20px;
    justify-content: flex-end;
    align-items: center;
  }
  // 修改分割线颜色
  :deep(.el-divider--vertical) {
    border-left: 1px var(--el-color-primary) solid;
  }
}
</style>
