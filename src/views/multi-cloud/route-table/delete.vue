<template>
  <div>
    <div class="delete-route-table">
      <div></div>
      <div class="flex-row warning_desc">
        {{ exitSubnet ? '无法' : '即将' }}删除路由表<span class="ideal-default-margin-left">{{
          props.rowData.name
        }}</span>
      </div>
      <div v-if="exitSubnet || isDefault">
        <el-alert type="error" show-icon>
          <template #title
            ><span style="color: #5e5e5e"
              >您暂时无法删除该路由表，详细原因请参考如下解释。</span
            ></template
          >
        </el-alert>
        <ideal-table-list
          :table-data="tableData"
          :table-headers="subTableHeaders"
          :show-pagination="false"
        >
          <template #reason>
            <el-table-column label="原因">
              <div v-if="isDefault">
                默认路由表无法直接删除，当您删除VPC时，系统会同步删除VPC关联的默认路由表。<el-text
                  type="primary"
                  >查看VPC。</el-text
                >
              </div>
              <div v-else-if="exitSubnet">
                自定义路由表已关联至子网，无法直接删除，请解除关联后重试。您需要<el-text
                  type="primary"
                  >为子网更换其他路由表</el-text
                >，从而解除当前路由表和子网的关联。
              </div>
            </el-table-column>
          </template>
        </ideal-table-list>
      </div>

      <div v-else>
        <div v-if="!exitSubnet" class="ideal-tip-text">
          删除路由表可能导致业务中断，请再次确认变更后的影响。
        </div>
        <ideal-table-list
          :table-data="tableData"
          :table-headers="tableHeaders"
          :show-pagination="false"
        >
        </ideal-table-list>
      </div>
    </div>

    <div class="flex-row ideal-submit-button">
      <el-button type="info" @click="cancelForm">{{ t('cancel') }}</el-button>
      <el-button type="primary" :disabled="exitSubnet" @click="submitForm">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessageBox, ElMessage } from 'element-plus'
import { routeTableDelete } from '@/api/java/network'
import { EventEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders } from '@/types'

interface PowerOnProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<PowerOnProps>(), {
  rowData: () => ({})
})
const exitSubnet = computed(() => {
  return props.rowData.subnetList?.length
}) //路由表中是否关联子网
const isDefault = computed(() => {
  return props.rowData.defaultRoute === 1
})
const { t } = useI18n()

const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: 'ID', prop: 'uuid' }
]

const subTableHeaders: IdealTableColumnHeaders[] = [
  { label: '', prop: 'reason', useSlot: true }
]

const tableData: any = ref([])
onMounted(() => {
  tableData.value = [props.rowData]
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
//删除
const submitForm = () => {
  const params = {
    id: props.rowData.id,
    resourcePoolId: props.rowData.resourcePoolId,
    regionId: props.rowData.regionId,
    projectId: props.rowData.projectId
  }
  routeTableDelete(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('删除路由表成功')
      emit(EventEnum.success)
    } else {
      ElMessage.success('删除路由表失败')
    }
  })
}
</script>

<style scoped lang="scss">
.delete-route-table {
  width: 100%;
  .footer-button {
    justify-content: flex-end;
    align-items: center;
    margin-top: 10px;
  }
  .warning_desc {
    margin: 10px 0;
    font-size: 14px;
    align-items: center;
    span {
      font-weight: bolder;
      color: var(--el-text-color-primary);
      margin-left: 5px;
    }
  }
  .el-alert__title {
    font-style: 12px;
  }
  .el-alert {
    padding: 12px;
  }
}
</style>
