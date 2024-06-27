<template>
  <div class="bind">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
      class="bind-form"
    >
      <el-form-item label="云服务器名称">
        <div>{{ detail.name }}</div>
      </el-form-item>

      <el-form-item label="选择网卡" prop="netCard">
        <el-select
          v-model="form.netCard"
          placeholder="请选择"
          style="width: 320px"
        >
          <el-option
            v-for="(item, index) of netCardList"
            :key="index + 'select'"
            :label="item.name"
            :value="item.uuid"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="选择弹性公网IP">
        <div class="flex-column" style="width: 100%">
          <div class="flex-row" style="justify-content: space-between">
            <el-button link type="primary" @click="clickGoToEip"
              >查看弹性公网IP</el-button
            >

            <el-input
              v-model="form.eipName"
              placeholder="请输入内容"
              style="width: 50%"
            >
              <template #suffix>
                <svg-icon icon="search-icon"></svg-icon>
              </template>
            </el-input>
          </div>

          <ideal-table-list
            row-key="uuid"
            :loading="state.dataListLoading"
            :table-data="state.dataList"
            :table-headers="tableHeaders"
            :is-radio="true"
            :show-pagination="false"
            @clickTableCellRow="clickTableCellRow"
          >
            <template #shareType>
              <el-table-column label="带宽类型">
                <template #default="props">
                  <div>{{ props.row?.bandwidth?.chargeModeCN }}</div>
                  <div>{{ props.row?.bandwidth?.size }} Mbit/s</div>
                </template>
              </el-table-column>
            </template>

            <template #status>
              <el-table-column label="状态" width="120">
                <template #default="props">
                  <ideal-status-icon
                    v-if="props.row.status"
                    :status-icon="props.row.statusIcon"
                    :status-text="props.row.statusText"
                  />
                </template>
              </el-table-column>
            </template>
          </ideal-table-list>
        </div>
      </el-form-item>

      <el-form-item label="释放行为">
        <el-checkbox v-model="form.behavior" label="随实例释放" />
      </el-form-item>
    </el-form>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus/es'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum } from '@/utils/enum'
import type { FormRules, FormInstance } from 'element-plus'
import { eipListUrl } from '@/api/java/compute'
import { RESOURCE_STATUS, RESOURCE_STATUS_ICON } from '@/utils/dictionary'
import {
  queryUnbindNetCardList,
  eipRelevanceInstance
} from '@/api/java/network'

interface BindProps {
  rowData?: any // 行数据
  detail?: any
}
const props = withDefaults(defineProps<BindProps>(), {
  rowData: () => ({}),
  detail: () => ({})
})

const { t } = useI18n()

const route = useRoute()

const formRef = ref<FormInstance>()
const form = reactive({
  netCard: '', // 选择网卡
  eipName: '',
  eip: null as any, // 选择弹性公网IP
  behavior: false // 释放行为
})
const rules = reactive<FormRules>({
  netCard: [{ required: true, message: '请选择网卡', trigger: 'blur' }]
})

onMounted(() => {
  queryNetCard()
})
// 网卡列表
const netCardList = ref<any[]>([])
const queryNetCard = () => {
  const params = {
    resourcePoolId: props.detail?.pool?.id, // 资源池id
    region: props.detail?.regionId, // 区域
    instanceUuid: props.detail?.uuid, // 云主机uuid
    projectId: props.detail?.project?.id // 项目id
  }
  queryUnbindNetCardList(params).then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      netCardList.value = data
    } else {
      netCardList.value = []
    }
  })
}
// 规格列表选择
const clickTableCellRow = (row: any) => {
  form.eip = row
}
// 弹性公网IP列表
const state: IHooksOptions = reactive({
  dataListUrl: eipListUrl,
  isPage: false,
  queryForm: {
    status: 'UNBIND',
    resourcePoolId: props.detail?.pool?.id, // 资源池id
    region: props.detail?.regionId, // 区域
    projectId: props.detail?.project?.id // 项目id
  }
})
const { getDataList } = useCrud(state)
watch(
  () => state?.dataList,
  value => {
    if (value?.length) {
      value.forEach((item: any) => {
        item.statusText = RESOURCE_STATUS[item?.status]
        item.statusIcon = RESOURCE_STATUS_ICON[item?.status]
      })
    }
  }
)
// 弹性公网IP表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '弹性公网IP', prop: 'ipAddress' },
  { label: '类型', prop: 'eipTypeCN' },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '带宽名称', prop: 'bandwidth.name' },
  { label: '带宽类型', prop: 'shareType', useSlot: true },
  { label: '带宽大小', prop: 'bandwidth.size' }
]
const router = useRouter()
const clickGoToEip = () => {
  router.push({ path: '/multi-cloud/elastic-ip/list' })
}
// 点击事件
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
  formEl.validate((valid: boolean) => {
    if (!valid) {
      return
    }
    clickSubmit()
  })
}
const clickSubmit = () => {
  const params = {
    uuid: form.eip.uuid, // 弹性ip的uuid
    bindnicUuid: form.netCard, // 云主机网卡的uuid
    resourcePoolId: props.detail.pool.id, // 资源池id
    regionId: props.detail.regionId, // 区域code
    projectId: props.detail.project.id, // 云管项目id
    vdcId: props.detail.vdc.id // 云管vdcId
  }
  eipRelevanceInstance(params).then((res: any) => {
    const { code } = res
    if (code === 200) {
      ElMessage.success('绑定成功')
      emit(EventEnum.success)
    } else {
      ElMessage.error(res.msg || '绑定失败')
    }
  })
}
</script>

<style scoped lang="scss">
.bind {
  width: 100%;
  .bind-form {
    :deep(.el-table) {
      height: 196px;
    }
  }
  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
