<template>
  <div class="optimize_strategy">
    <ideal-search
      :show-category="false"
      :show-platform-type="false"
      :show-resource-pool="false"
      :type-array="typeArray"
      @clickSearch="onClickSearch"
    />

    <el-divider />
    <el-button
      type="primary"
      :icon="CirclePlus"
      @click="clickOptimizeStrategyCreate"
      >新建优化策略</el-button
    >
    <ideal-table-list
      :loading="state.dataListLoading"
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :page="state.page"
      :total="state.total"
      @clickSizeChange="sizeChangeHandle"
      @clickCurrentChange="currentChangeHandle"
    >
      <template #influenceDegree>
        <el-table-column label="影响程度" width="150">
          <template #default="props">
            <span :style="{ color: props.row.incidenceColor }">{{
              props.row.incidenceTypeName
            }}</span>
          </template>
        </el-table-column>
      </template>
      <template #dimensionRange>
        <el-table-column label="维度范围" width="150">
          <template #default="props">
            <p v-for="(item, index) in props.row.dimensionRange" :key="index">
              {{ item }}
            </p>
          </template>
        </el-table-column>
      </template>
      <template #enable>
        <el-table-column label="启用状态" width="150">
          <template #default="props">
            <el-switch
              v-model="props.row.enabled"
              @click="changeStatus(props.row)"
            />
          </template>
        </el-table-column>
      </template>
      <template #operation>
        <el-table-column label="操作" width="185" fixed="right">
          <template #default="props">
            <ideal-table-operate
              :buttons="operateButtons"
              @clickMoreEvent="clickOperateEvent($event as any, props.row)"
            >
            </ideal-table-operate>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      :width="dialogWidth"
      :append-to-body="true"
      :before-close="handleClose"
      class="custom-class"
    >
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">{{
            t('cancel')
          }}</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            {{ t('confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { CirclePlus } from '@element-plus/icons-vue'
import { IHooksOptions } from '@/hooks/interface'
import type {
  IdealTableColumnHeaders,
  IdealTableColumnOperate,
  IdealSearch,
  IdealTextProp
} from '@/types'
import { useCrud } from '@/hooks'
import {
  billOptimizeStrategyPage,
  deleteOptimizeStrategy,
  executeOptimizeStrategyRule
} from '@/api/java/operate-center'
import { ElMessage, ElMessageBox } from 'element-plus/es'
import { FiltrateEnum } from '@/utils/enum'

const { t } = useI18n()

/**
 * 搜索类型
 * @type {IdealSearch[]}
 */
const typeArray = ref<IdealSearch[]>([
  { label: '优化策略名称', prop: 'name', type: FiltrateEnum.input }
])

const onClickSearch = (v: IdealTextProp[]) => {
  state.queryForm = {}
  if (v.length) {
    v.forEach((item: IdealTextProp) => {
      const temp = item.label.split('：')
      state.queryForm[item.prop] = temp[1]
    })
  }
  getDataList()
}
/**
 * 列表
 */
const state: IHooksOptions = reactive({
  dataListUrl: billOptimizeStrategyPage,
  deleteUrl: '',
  queryForm: {}
})

//页码切换
const { sizeChangeHandle, currentChangeHandle, getDataList } = useCrud(state)
// 列表表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '策略名称', prop: 'name', width: '150px' },
  { label: '资源类型', prop: 'resourceTypeName', width: '150px' },
  {
    label: '影响程度',
    prop: 'influenceDegree',
    useSlot: true
  },
  { label: '启用状态', prop: 'enable', useSlot: true },
  { label: '描述', prop: 'remark', width: '150px' },
  { label: '策略规则', prop: 'optimizingStrategyDetail', width: '300px' },
  { label: '作用维度', prop: 'actionDimension', width: '150px' },
  { label: '维度范围', prop: 'dimensionRange', useSlot: true },
  { label: '优化建议', prop: 'suggestText', width: '150px' },
  { label: '创建人', prop: 'creator.name', width: '150px' },
  { label: '创建时间', prop: 'createTime.date', width: '150px' }
]
const operateButtons: IdealTableColumnOperate[] = [
  { title: '编辑', prop: 'edit' },
  { title: '删除', prop: 'delete' }
]

watch(
  () => state.dataList,
  arr => {
    arr?.forEach((item: any) => {
      const dimensionText: any = {
        VDC: 'VDC',
        PROJECT: '项目',
        POOL_RESOURCE: '资源池',
        CLOUD_PLATFORM: '云平台'
      }
      const colorFormat: any = {
        LOW: '#2ba471',
        MIDDLE: '#FA9550',
        HIGH: '#954500',
        HIGHEST: '#D54941'
      }
      item.incidenceColor = colorFormat[item.incidenceType]
      item.actionDimension = dimensionText[item.scope]
      item.dimensionRange = item.scopeDetailName
        ? item.scopeDetailName.split(',')
        : []
    })
  }
)

/* 弹窗 */
const dialogVisible = ref(false) // 是否显示弹框
const dialogTitle = ref('') // 弹窗名称
const dialogWidth = ref('30%')

/*
方法
*/
// 搜索
const clickSearch = (search: string, type: string) => {
  state.queryForm.name = search
  getDataList()
}

// 重置
const clickReset = () => {
  state.page = 1
  state.queryForm = {}
  getDataList()
}
//新建优化策略
const router = useRouter()
const clickOptimizeStrategyCreate = () => {
  router.push({
    path: '/operate-center/expense-center/expense-optimize/optimize-strategy/create'
  })
}

// 操作
const clickOperateEvent = (command: string | number, row: any) => {
  if (command === 'delete') {
    ElMessageBox.confirm('确定要删除优化策略吗？', '删除优化策略', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deleteOptimizeStrategy({ id: row.id }).then((res: any) => {
          const { code } = res
          if (code === 200) {
            getDataList()
            ElMessage.success('删除优化策略成功')
          } else {
            ElMessage.error('删除优化策略失败')
          }
        })
      })
      .catch(() => {
        ElMessage.info('删除优化策略失败')
      })
  } else if (command === 'edit') {
    const data = JSON.stringify(row)
    router.push({
      path: '/operate-center/expense-center/expense-optimize/optimize-strategy/edit',
      query: { type: 'edit', data }
    })
  }
}

const changeStatus = (row: any) => {
  const params = {
    id: row.id,
    enabled: row.enabled
  }
  executeOptimizeStrategyRule(params)
    .then((res: any) => {
      const { code } = res
      if (code === 200) {
        ElMessage.success('更新优化策略状态成功')
        router.push({
          path: '/operate-center/expense-center/expense-optimize/list',
          query: {
            type: 'createReturn'
          }
        })
      } else {
        ElMessage.error('更新优化策略状态失败')
        row.enabled = !row.enabled
      }
    })
    .catch(() => {
      row.enabled = !row.enabled
    })
}
// 关闭弹框
const handleClose = () => {
  dialogVisible.value = false
}
</script>
