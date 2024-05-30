<template>
  <div class="replace-route-table">
    <div class="flex-row replace-route-table__warning-tip">
      <svg-icon icon="info-warning" color="var(--el-color-primary)"></svg-icon>
      <span class="replace-route-table__warning-tip-content"
        >更换新路由器表后，子网下资源将启用新路由表测策略，请确认对业务造成的影响</span
      >
    </div>

    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="所选路由表">
        <div>{{ form.currentTable }}</div>
      </el-form-item>

      <el-form-item label="目标路由表" prop="name">
        <el-input v-model="form.destination" class="custom-input" />
        <svg-icon
          icon="refresh-icon"
          class="ideal-svg-margin-right ideal-svg-margin-left"
        ></svg-icon>
        <el-button link type="primary">创建自定义路由表</el-button>
      </el-form-item>
    </el-form>

    <div class="flex-row ideal-header-container">
      <el-divider direction="vertical" />
      <div>请根据业务需要选择所选路由表中需要添加至目标路由表的路由信息</div>
    </div>

    <ideal-table-list
      :table-data="state.dataList"
      :table-headers="tableHeaders"
      :show-pagination="false"
      :is-multiple="true"
      @handleSelectionChange="selectionChangeHandle"
    >
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
import { EventEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders } from '@/types'

const { t } = useI18n()
const formRef = ref<FormInstance>()
const form = reactive({
  currentTable: 'rtb-vpc-27d6(默认路由表)', // 所选路由表
  destination: 'subnet-e883' // 目标路由表
})
const rules = reactive<FormRules>({
  destination: [
    { required: true, message: '请输入目标路由表', trigger: 'blur' }
  ]
})

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
  emit(EventEnum.success)
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
  { label: '下一跳', prop: 'next' },
  { label: '描述', prop: 'description' }
]
</script>

<style scoped lang="scss">
.replace-route-table {
  width: 100%;
  // 修改图标
  .replace-route-table__warning-tip {
    background-color: var(--custom-information-bg-color);
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
}
</style>
