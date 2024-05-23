<template>
  <div class="replace-route-table">
    <div class="flex-row replace-route-table__warning-tip">
      <svg-icon icon="info-warning" color="#F3AD3C"></svg-icon>
      <span class="replace-route-table__warning-tip-content"
        >更换新路由器表后，子网下资源将启用新路由表测策略，请确认对业务造成的影响</span
      >
    </div>

    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="子网">
        <div>{{ rowData.name }}</div>
      </el-form-item>

      <el-form-item label="当前关联路由表">
        <div>
          {{ rowData.routeTableName
          }}{{ rowData.defaultRoute === '1' ? '默认路由表' : '自定义路由表' }}
        </div>
      </el-form-item>

      <el-form-item label="更换路由表" prop="routeTable">
        <el-select
          v-model="form.routeTable"
          placeholder="请选择"
          class="custom-input ideal-default-margin-right"
          @change="changeRouteTable"
        >
          <el-option
            v-for="(item, idx) of routeTableList"
            :key="idx"
            :label="item.name + ' (' + item.defaultRouteText + ')'"
            :value="item.id"
          >
            {{ item.name }} ({{ item.defaultRouteText }})
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div class="flex-row ideal-header-container">
      <el-divider direction="vertical" />
      <div>请选择需要同步至新路由表的路由。</div>
    </div>

    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="tableData"
      :table-headers="tableHeaders"
      :show-pagination="false"
      :is-multiple="true"
      @handleSelectionChange="selectionChangeHandle"
    >
      <template #nextHopName>
        <el-table-column label="下一跳">
          <template #default="props"
            ><el-text
              :type="props.$index ? 'primary' : ''"
              style="cursor: pointer"
              @click="toDetail(props.row)"
              >{{ props.row.nextHopName }}</el-text
            ></template
          >
        </el-table-column>
      </template>
    </ideal-table-list>

    <div class="flex-row replace-route-table-button">
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
import { ElMessage } from 'element-plus'
import { EventEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders } from '@/types'
import { showLoading, hideLoading } from '@/utils/tool'
import {
  queryRouteTableList,
  queryRouteTableDetail,
  subnetChangeRouteTable
} from '@/api/java/network'
import { nextTypeText } from '@/views/multi-cloud/route-table/components/constant'

interface RouteProps {
  rowData?: any // 行数据
  customRoute?: any //当前路由表的自定义路由
}
const props = withDefaults(defineProps<RouteProps>(), {
  rowData: () => ({}),
  customRoute: () => []
})

const { t } = useI18n()
const formRef = ref<FormInstance>()
const form = reactive({
  routeTable: ''
})
const rules = reactive<FormRules>({
  routeTable: [{ required: true, message: '请选择路由表', trigger: 'change' }]
})

const commonParams = () => {
  return {
    resourcePoolId: props.rowData.resourcePoolId,
    regionId: props.rowData.regionId,
    projectId: props.rowData.projectId
  }
}
onMounted(() => {
  getRouteTableList()
})

//查询可更换的路由表
const routeTableList: any = ref([])
const getRouteTableList = () => {
  const params = {
    vpcId: props.rowData.vpcId,
    ...commonParams()
  }
  queryRouteTableList(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        data.forEach((item: any) => {
          item.defaultRouteText =
            item.defaultRoute === 1 ? '默认路由表' : '自定义路由表'
        })
        routeTableList.value = data.filter(
          (item: any) => item.id !== props.rowData.routeTableId
        )
        form.routeTable = routeTableList.value[0].id
        queryDetailInfo(form.routeTable)
      } else {
        routeTableList.value = []
      }
    })
    .catch(_ => {
      routeTableList.value = []
    })
}

const changeRouteTable = (val: string) => {}

const tableData: any = ref([])
//路由表详细信息
const queryDetailInfo = (val: string) => {
  const params = {
    id: val,
    ...commonParams()
  }
  queryRouteTableDetail(params).then((res: any) => {
    const { data, code } = res
    if (code === 200) {
      props.customRoute.forEach((item: any) => {
        item.nextType = nextTypeText[item.nextHopType]
      })
      tableData.value = props.customRoute.filter(
        (item: any) =>
          !data.routeList.some(
            (ele: any) => ele.destination === item.destination
          )
      )
    }
  })
}

const toDetail = (row: any) => {}
// 点击事件
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const cancelForm = () => {
  emit(EventEnum.cancel)
}

const submitForm = () => {
  const routeList: any = tableData.value.map((item: any) => {
    return {
      destination: item.destination,
      nextHopType: item.nextHopType,
      nextHop: item.nextHop,
      nextHopName: item.nextHopName,
      description: item.description
    }
  })
  const params = {
    subnetList: {
      id: props.rowData.id,
      uuid: props.rowData.uuid
    },
    id: form.routeTable,
    routeList,
    ...commonParams()
  }
  showLoading('更换路由表中...')
  subnetChangeRouteTable(params)
    .then((res: any) => {
      const { data, code } = res
      if (code === 200) {
        ElMessage.success('更换路由表成功')
        emit(EventEnum.success)
      } else {
        ElMessage.error('更换路由表失败')
      }
      hideLoading()
    })
    .catch(err => {
      hideLoading()
    })
}

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const { selectionChangeHandle } = useCrud(state)
state.dataList = [
  {
    destination: 'Local',
    nextType: 'Local',
    next: 'Local',
    description: '系统默认，表示VPC内实例互通'
  }
]
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '目的地址', prop: 'destination' },
  { label: '下一跳类型', prop: 'nextType' },
  { label: '下一跳', prop: 'nextHopName', useSlot: true },
  { label: '描述', prop: 'description' }
]
</script>

<style scoped lang="scss">
.replace-route-table {
  width: 100%;
  // 修改图标
  :deep .el-form-item--default .el-form-item__label {
    width: 130px;
  }
  .replace-route-table__warning-tip {
    background-color: #fefbed;
    padding: 20px;
    .replace-route-table__warning-tip-content {
      color: black;
      margin-left: 5px;
    }
  }
  .replace-route-table-button {
    margin-top: 20px;
    justify-content: flex-end;
    align-items: center;
  }
  // 修改分割线颜色
  :deep(.el-divider--vertical) {
    border-left: 1px var(--el-color-primary) solid;
  }
  .ideal-header-container {
    width: 100%;
  }
  .custom-input {
    width: 20%;
  }
}
</style>
