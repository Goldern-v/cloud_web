<template>
  <div class="ideal-table-list__container">
    <el-table
      ref="IdealTableList"
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      :height="maxHeight"
      fit
      highlight-current-row
      :border="showBorder"
      :row-key="rowKey"
      :expand-row-keys="expands"
      :span-method="objectSpanMethod"
      @row-click="onClickTableCellRow"
      @selection-change="handleSelectionChange"
      @expand-change="expandChange"
      @sort-change="sortChange"
    >
      <el-table-column v-if="showIndex" type="index"> </el-table-column>

      <el-table-column
        v-if="isMultiple"
        width="55"
        type="selection"
        :reserve-selection="reserve"
        :selectable="selectionDisabled"
      >
      </el-table-column>

      <slot name="expandTable"></slot>

      <el-table-column v-if="isRadio" :width="showBorder ? 50 : 50">
        <template #default="props">
          <el-radio
            :model-value="selectRadio"
            :label="props.row[rowKey]"
            :disabled="props.row.radioDisabled"
            >&nbsp;</el-radio
          >
        </template>
      </el-table-column>

      <template v-for="item of tableOptions" :key="item.prop + 'slot'">
        <slot v-if="item.useSlot" :name="item.prop"></slot>

        <el-table-column
          v-else
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.minWidth"
          :width="item.width"
          show-overflow-tooltip
          :align="item.align ? item.align : 'left'"
        >
          <template #default="props">
            <el-text
              v-if="item.setTextType && item.textTypeProp"
              :type="
                item.setTextType && item.textTypeProp
                  ? props.row[item.textTypeProp]
                  : ''
              "
              >{{ props.row[item.prop] }}</el-text
            >
          </template>
        </el-table-column>
      </template>
      <slot name="operation"></slot>
    </el-table>

    <el-pagination
      v-if="showPagination"
      background
      :current-page="page"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :total="total"
      :layout="paginationLayout"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>

<script setup lang="ts" name="IdealTableList">
/**
 * 列表
 */
import type { IdealTableColumnHeaders } from '@/types'
import { PaginationTypeEnum } from '@/utils/enum'
import type { TableColumnCtx } from 'element-plus'
/**
 * 列表插槽: operation 操作栏插槽
 * el-text几种字体颜色 primary | success | info | warning | danger(不传默认#606266), tableData的对象包含textType即可设置几种颜色
 */
// 列表组件参数
interface TableData {
  showBorder?: boolean // 是否显示边框
  loading?: boolean // 加载
  tableHeaders: IdealTableColumnHeaders[] // 列表表头(必传)
  tableData: any[] // 列表数据(必传)
  rowKey?: string // 行数据key
  showIndex?: boolean // 是否显示序列
  isMultiple?: boolean // 是否多选
  isRadio?: boolean // 是否单选
  showPagination?: boolean // 是否显示列表分页
  page?: number //当前页
  total?: number // 表格总数
  paginationType?: PaginationTypeEnum // 分页布局类型
  reserve?: boolean //数据刷新后是否保留选项
  mergeData?: any[] // 列表需要合并的行列(注: 因行列合并情况太多,需自己根据实际情况判断处理再传值)
  mergeRow?: number[] // 需要合并的行
  mergeColumn?: number[] // 需要合并的列
  defaultFirst?: boolean // 当是单选的时候, 是否默认选择第一条
  maxHeight?: string | number //表格最大高度
  customAssign?: string //自定义赋值
}
// 自定义属性值
const props = withDefaults(defineProps<TableData>(), {
  showBorder: true,
  loading: false,
  tableHeaders: () => [],
  tableData: () => [],
  showIndex: false,
  isMultiple: false,
  isRadio: false,
  showPagination: true,
  reserve: true,
  rowKey: 'id',
  page: 1,
  total: 0,
  paginationType: PaginationTypeEnum.all,
  mergeData: () => [],
  mergeRow: () => [],
  mergeColumn: () => [],
  defaultFirst: false,
  maxHeight: '100%',
  customAssign: ''
})
const IdealTableList = ref()
const pageSizes = ref([10, 20, 50, 100]) // 分页大小选择
const tableOptions = ref<IdealTableColumnHeaders[]>([]) // 表头

onMounted(() => {
  tableOptions.value = props.tableHeaders
})
// 监听表头自定义
watch(
  () => props.tableHeaders,
  value => {
    if (value.length) {
      tableOptions.value = value
    }
  },
  { deep: true }
)

// 分页布局样式
const paginationLayout = computed(() => {
  let layout = ''
  if (props.paginationType === PaginationTypeEnum.all) {
    layout = 'total, sizes, prev, pager, next, jumper'
  } else if (props.paginationType === PaginationTypeEnum.total) {
    layout = 'total, prev, pager, next'
  } else if (props.paginationType === PaginationTypeEnum.totalSizes) {
    layout = 'total, sizes, prev, pager, next'
  } else if (props.paginationType === PaginationTypeEnum.totalJump) {
    layout = 'total, prev, pager, next, jumper'
  } else if (props.paginationType === PaginationTypeEnum.jump) {
    layout = 'prev, pager, next, jumper'
  } else if (props.paginationType === PaginationTypeEnum.sizes) {
    layout = 'sizes, prev, pager, next'
  } else if (props.paginationType === PaginationTypeEnum.sizesJump) {
    layout = 'sizes, prev, pager, next, jumper'
  }
  return layout
})

// 事件枚举
enum EventType {
  cell = 'clickTableCellRow', // 当前行点击
  selection = 'handleSelectionChange', // 多选
  expand = 'expandChange', // 某一行展开或关闭
  pageSize = 'clickSizeChange', // 当前分页大小
  currentPage = 'clickCurrentChange', // 当前分页
  sortChange = 'clickSortChange' // 表头排序
}
// 按钮点击事件
interface EventEmits {
  (e: EventType.cell, v: any): void
  (e: EventType.selection, v: any[]): void
  (e: EventType.expand, v: any, expand: any[]): void
  (e: EventType.pageSize, v: number): void
  (e: EventType.currentPage, v: number): void
  (e: EventType.sortChange, v: any): void
}
const emit = defineEmits<EventEmits>()

const selectRadio = ref<any>() // 单选结果
// 行点击事件
const onClickTableCellRow = (row: any) => {
  if (!row.radioDisabled) {
    selectRadio.value = row[props.rowKey]
  }
  emit(EventType.cell, row)
}
// 多选事件
const handleSelectionChange = (sections: any[]) => {
  emit(EventType.selection, sections)
}

const expands = ref<any[]>([]) // 只展开一行放入当前行id
// 展开事件
const expandChange = (row: any, expandedRows: any[]) => {
  // 点击另一行收起当前行
  if (expandedRows.length) {
    expands.value.length = 0
    if (row) {
      expands.value.push(row[props.rowKey])
    }
  } else {
    expands.value.length = 0
  }
  emit(EventType.expand, row, expandedRows)
}

const selectionDisabled = (row: any) => {
  return row.selectableDisabled && typeof row.selectableDisabled === 'function'
    ? row.selectableDisabled(row)
    : true
}

const pageSize = ref(10) // 分页大小
const handleSizeChange = (val: number) => {
  pageSize.value = val
  console.log('----pageSize----', pageSize.value)
  emit(EventType.pageSize, val)
}

const handleCurrentChange = (val: number) => {
  emit(EventType.currentPage, val)
}

const sortChange = (val: any) => {
  // 排序
  emit(EventType.sortChange, val)
}

// 监听列表默认选择第一条
watch(
  () => props.tableData,
  value => {
    if (value.length && props.defaultFirst) {
      selectRadio.value = value[0][props.rowKey]
    } else if (value.length && props.customAssign) {
      selectRadio.value = props.customAssign
    }
  }
)
/**
 * 列表合并
 */
interface SpanMethodProps {
  row: any
  column: TableColumnCtx<any>
  rowIndex: number
  columnIndex: number
}
const objectSpanMethod = ({
  row,
  column,
  rowIndex,
  columnIndex
}: SpanMethodProps) => {
  if (!props.mergeData.length) {
    return
  }

  if (props.mergeColumn.includes(columnIndex)) {
    const _row = props.mergeData[rowIndex]
    const _col = _row > 0 ? 1 : 0
    return {
      rowspan: _row,
      colspan: _col
    }
  }
}
// 暴露给父组件的属性
defineExpose({
  IdealTableList
})
</script>

<style lang="scss" scoped>
.ideal-table-list__container {
  width: 100%;
  box-sizing: border-box;
  :deep(.el-pager li) {
    line-height: inherit;
  }

  // 自定义表头(注: 修改表头颜色, 可以在父视图下穿透修改background-color)
  :deep(.el-table th.el-table__cell) {
    // overflow: hidden;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    background-color: $tableHeaderBgColor;
    color: #666666;
    font-weight: normal; // 表头标题取消加粗
    font-size: $mediumFontSize; // 表头文字
  }
  // 修改列表高度通过.el-table

  // 修改el-text字体
  :deep(.el-text--default) {
    font-size: $defaultFontSize;
  }
  :deep(.el-text.el-text--primary) {
    color: var(--el-color-primary);
  }
  :deep(.el-text.el-text--success) {
    color: $success5-light;
  }
  :deep(.el-text.el-text--info) {
    color: $gray5-light;
  }
  :deep(.el-text.el-text--warning) {
    color: $warning4-light;
  }
  :deep(.el-text.el-text--danger) {
    color: $error5-light;
  }

  // 隐藏表格边框 (列宽拖动实现大小改变功能)
  :deep(.el-table) {
    --el-table-border-color: white;
    border-collapse: collapse;
    td {
      border-bottom: 1px solid $gray3-light; // 显示列表每行底部下划线
    }
  }
  :deep(.el-table tbody) {
    td {
      border-right: none;
    }
  }
  :deep(.el-table--border, .el-table--group) {
    border: none;
  }
  :deep(.el-table thead) {
    th {
      border-right: 1px solid white;
    }
  }
  // 显示列表底部边框
  :deep(.el-table__inner-wrapper::before) {
    bottom: 1px;
  }
}
</style>
