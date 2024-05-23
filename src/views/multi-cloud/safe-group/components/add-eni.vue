<template>
  <div class="add-eni">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="安全组">
        <div>{{ name }}</div>
      </el-form-item>

      <el-form-item label="辅助弹性网卡">
        <div style="width: 100%">
          <ideal-search
            :type-array="typeArray"
            class="ideal-default-margin-top"
            @clickSearch="onClickSearch"
          />

          <ideal-table-list
            :table-data="state.dataList"
            :table-headers="tableHeaders"
            :show-pagination="false"
            max-height="300"
            :is-multiple="true"
            @handleSelectionChange="selectionChangeHandle"
          >
            <template #network>
              <el-table-column label="所属网络">
                <template #default="props">
                  <p>{{ props.row.vpcName }}</p>
                  <p>{{ props.row.subnet?.name }}</p>
                </template>
              </el-table-column>
            </template>

            <template #status>
              <el-table-column label="状态" width="120">
                <template #default="props">
                  <ideal-status-icon
                    v-if="props.row.status"
                    :status-icon="props.row.statusType"
                    :status-text="props.row.statusDes"
                  />
                </template>
              </el-table-column>
            </template>
          </ideal-table-list>
          <el-text v-if="!selected" type="danger"
            >请选择一个或多个辅助弹性网卡。</el-text
          >
        </div>
      </el-form-item>
    </el-form>

    <div class="flex-row footer-button">
      <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus/es'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { EventEnum, FiltrateEnum } from '@/utils/enum'
import { showLoading, hideLoading } from '@/utils/tool'
import type {
  IdealTableColumnHeaders,
  IdealSearch,
  IdealTextProp
} from '@/types'
import {
  queryNetCardPage,
  safeGroupRelevanceAssistNIc
} from '@/api/java/network'

const route = useRoute()
const { uuid, resourcePoolId, regionId, projectId, name } = route.query

const { t } = useI18n()
const formRef = ref<FormInstance>()
const form = reactive({
  safeGroup: '', // 安全组
  eni: '' // 辅助弹性网卡
})
const rules = reactive<FormRules>({})

const commonParams = () => {
  const params = {
    resourcePoolId,
    regionId,
    projectId
  }
  return params
}

// 列表
const state: IHooksOptions = reactive({
  dataListUrl: queryNetCardPage,
  deleteUrl: '',
  queryForm: {
    ...commonParams(),
    type: 'BACKUP_CARD'
  }
})
const { getDataList, selectionChangeHandle } = useCrud(state)
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '私有IP地址', prop: 'fixedIp' },
  { label: '所属弹性网卡', prop: 'mainFixedIp' },
  { label: '所属网络', prop: 'network', useSlot: true },
  { label: '描述', prop: 'description' }
]
const selected = ref(false)
watch(
  () => state.dataListSelections,
  value => {
    selected.value = false
    if (value?.length) {
      selected.value = true
    }
  }
)
/**
 * 搜索类型
 */
const typeArray = ref<IdealSearch[]>([
  { label: '名称', prop: 'name', type: FiltrateEnum.input },
  { label: 'UUID', prop: 'uuid', type: FiltrateEnum.input }
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
// 方法
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  emit(EventEnum.cancel)
}

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  if (!selected.value) {
    return ElMessage.warning('请选择一个或多个辅助弹性网卡。')
  }
  const nicDtoList = state.dataListSelections?.map((item: any) => {
    return item.uuid
  })
  const params = {
    ...commonParams,
    securityGroups: [
      {
        securitygroupId: uuid
      }
    ],
    nicDtoList
  }
  showLoading('关联辅助网卡中...')
  safeGroupRelevanceAssistNIc(params)
    .then((res: any) => {
      const { code } = res
      if (code === 200) {
        ElMessage.success('关联辅助网卡成功')
        emit(EventEnum.success)
      } else {
        ElMessage.error('关联辅助网卡失败')
      }
      hideLoading()
    })
    .catch(_ => {
      hideLoading()
    })
}
</script>

<style scoped lang="scss">
.add-eni {
  width: 100%;
  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
