<template>
  <el-card>
    <el-form :inline="true" :model="state.queryForm">
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="state.dataListLoading"
      :data="state.dataList"
      border
      style="width: 100%"
      @selection-change="selectionChangeHandle"
      @sort-change="sortChangeHandle"
    >
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50"
      ></el-table-column>
      <el-table-column
        prop="dictValue"
        label="字典值"
        header-align="center"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="dictLabel"
        label="字典标签"
        show-overflow-tooltip
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="sort"
        label="排序"
        sortable="custom"
        header-align="center"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        header-align="center"
        align="center"
        width="180"
      ></el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        header-align="center"
        align="center"
        width="150"
      >
        <template #default="scope">
          <el-button
            type="primary"
            link
            @click="addOrUpdateHandle(scope.row.id)"
            >修改</el-button
          >
          <el-button
            type="primary"
            link
            @click="deleteBatchHandle(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="state.page"
      :page-sizes="state.pageSizes"
      :page-size="state.limit"
      :total="state.total"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
    >
    </el-pagination>
    <!-- 新增 / 修改 -->
    <add-or-update
      ref="addOrUpdateRef"
      @refresh-data-list="getDataList"
    ></add-or-update>
  </el-card>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import AddOrUpdate from './data-add-or-update.vue'
import { IHooksOptions } from '@/hooks/interface'

const props = defineProps({
  dictTypeId: {
    type: Number,
    required: true
  }
})

const state: IHooksOptions = reactive({
  dataListUrl: '/sys/dict/data/page',
  deleteUrl: '/sys/dict/data',
  queryForm: {
    dictTypeId: props.dictTypeId
  }
})

const addOrUpdateRef = ref()
const addOrUpdateHandle = (id?: Number) => {
  addOrUpdateRef.value.dataForm.dictTypeId = props.dictTypeId
  addOrUpdateRef.value.init(id)
}

const {
  getDataList,
  sizeChangeHandle,
  selectionChangeHandle,
  sortChangeHandle,
  currentChangeHandle,
  deleteBatchHandle
} = useCrud(state)
</script>
