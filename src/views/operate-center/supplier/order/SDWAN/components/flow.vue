<template>
  <el-dialog
    v-model="flowTableVisible"
    title="流程记录"
    width="800"
    class="order-flow"
  >
    <div class="supplier-order-flow">
      <ideal-table-list
        :show-pagination="false"
        :table-data="state.dataList"
        :table-headers="flowTableHeaders"
      >
      </ideal-table-list>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { IHooksOptions } from '@/hooks/interface'
import { flowTableHeaders, stateData } from '../utils/data'
import { sdwanProcess } from '@/api/java/operate-center'

const state: IHooksOptions = reactive(JSON.parse(JSON.stringify(stateData)))
const flowTableVisible = ref(false)
const open = (row: any) => {
  const { orderItemId, siteId } = row
  sdwanProcess({ orderItemId, siteId }).then((res: any) => {
    if (res.code === '200') {
      state.dataList = res.data
    }
    flowTableVisible.value = true
  })
}
const close = () => {
  flowTableVisible.value = false
}

defineExpose({
  open
})
</script>

<style lang="scss" scoped>
.order-flow {
  .supplier-order-flow {
    min-height: 400px;
  }
  .dialog-footer {
    text-align: center;
  }
}
</style>
