<template>
  <div class="add-server">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="安全组">
        <div>{{ safeGroupName }}</div>
      </el-form-item>

      <el-form-item label="选择服务器">
        <div style="width: 100%">
          <el-radio-group v-model="form.type">
            <el-radio-button
              v-for="(item, index) of typeList"
              :key="index"
              :label="item.label"
            >
              {{ item.value }}
            </el-radio-button>
          </el-radio-group>

          <ideal-search
            :type-array="typeArray"
            class="ideal-default-margin-top"
            @clickSearch="onClickSearch"
          />

          <ideal-table-list
            :table-data="state.dataList"
            :table-headers="tableHeaders"
            :is-multiple="true"
            :page="state.page"
            :total="state.total"
            @clickSizeChange="sizeChangeHandle"
            @clickCurrentChange="currentChangeHandle"
            @handleSelectionChange="selectionChangeHandle"
          >
            <template #name>
              <el-table-column
                label="名称/ID"
                width="150"
                show-overflow-tooltip
              >
                <template #default="props">
                  <div class="cloud-host-table-title">
                    {{ props.row.name }}
                  </div>

                  <div class="flex-row">
                    <div class="cloud-host-table-id">{{ props.row.uuid }}</div>
                  </div>
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

            <template #ipAddress>
              <el-table-column
                label="私有IP地址"
                width="150"
                show-overflow-tooltip
              >
                <template #default="props">
                  <ip-address
                    :data-array="props.row.nicList"
                    @mouseEnterPrivate="
                      (value:any) => (props.row.nicList[0].privateIpCopy = value)
                    "
                    @mouseLeavePrivate="
                      (value:any) => (props.row.nicList[0].privateIpCopy = value)
                    "
                    @mouseEnterPublic="
                      (value:any) => (props.row.nicList[0].eip.publicIpCopy = value)
                    "
                    @mouseLeavePublic="
                      (value:any) => (props.row.nicList[0].eip.publicIpCopy = value)
                    "
                  />
                </template>
              </el-table-column>
            </template>
          </ideal-table-list>
          <el-text v-if="!selected" type="danger">您还没有选择服务器。</el-text>
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
import ipAddress from '../../cloud-host/components/ip-address.vue'
import type { FormRules, FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus/es'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { EventEnum, FiltrateEnum } from '@/utils/enum'
import type {
  IdealTableColumnHeaders,
  IdealSearch,
  IdealTextProp
} from '@/types'
import { showLoading, hideLoading } from '@/utils/tool'
import { RESOURCE_STATUS, RESOURCE_STATUS_ICON } from '@/utils/dictionary'
import { cloudHostUrl } from '@/api/java/compute'
import { safeGroupRelevanceInstance } from '@/api/java/network'

interface ServerProps {
  associatedServer?: any[] //已关联的实例
}

const props = withDefaults(defineProps<ServerProps>(), {
  associatedServer: () => []
})
const { t } = useI18n()

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
const formRef = ref<FormInstance>()
const form = reactive({
  safeGroup: '', // 安全组
  type: 'cloud-server', // 选择服务器类型
  server: '' // 选择服务器
})
const rules = reactive<FormRules>({})
const typeList = [
  { label: 'cloud-server', value: '云服务器' }
  // { label: 'bare-metal', value: '裸金属服务器' }  //暂无联调此功能
]

const route = useRoute()
const { uuid, resourcePoolId, regionId, projectId, name } = route.query
//公共参数
const commonParams = () => {
  const params = {
    resourcePoolId,
    regionId,
    projectId
  }
  return params
}
/**
 * 列表
 */
const state: IHooksOptions = reactive({
  dataListUrl: cloudHostUrl,
  deleteUrl: '',
  queryForm: {
    ...commonParams()
  }
})
const {
  getDataList,
  selectionChangeHandle,
  sizeChangeHandle,
  currentChangeHandle
} = useCrud(state)
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '私有IP地址', prop: 'ipAddress', useSlot: true },
  { label: 'IPv6地址', prop: 'ipv6' }
]
const selected = ref(false)
watch(
  () => state.dataListSelections,
  value => {
    selected.value = false
    if (value?.length) {
      selected.value = true
      value.forEach((item: any) => {
        item.statusIcon = RESOURCE_STATUS_ICON[item.status]
        item.statusText = RESOURCE_STATUS[item.status]
        item.ipv6 = '--'
      })
    }
  }
)

watch(
  () => state.dataList,
  value => {
    if (value?.length) {
      value.forEach((item: any) => {
        item.statusIcon = RESOURCE_STATUS_ICON[item.status]
        item.statusText = RESOURCE_STATUS[item.status]
        item.selectableDisabled = function () {
          return !props.associatedServer.some(
            (ele: any) => ele.uuid === item.uuid
          )
        }
      })
    }
  }
)

const safeGroupName: any = ref('')
onMounted(() => {
  safeGroupName.value = name
})

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
  formEl.validate(valid => {
    const instanceDtoList = state.dataListSelections?.map(item => {
      return item.uuid
    })
    if (!instanceDtoList?.length) {
      return ElMessage.warning('请选择需要绑定的实例')
    } else {
      const params = {
        name,
        uuid,
        instanceDtoList,
        ...commonParams()
      }
      showLoading('关联中...')
      safeGroupRelevanceInstance(params)
        .then((res: any) => {
          const { code, data } = res
          if (code === 200) {
            hideLoading()
            ElMessage.success('关联实例成功')
            emit(EventEnum.success)
          } else {
            ElMessage.error('关联实例失败')
          }
          hideLoading()
        })
        .catch(err => {
          hideLoading()
        })
    }
  })
}
</script>

<style scoped lang="scss">
.add-server {
  width: 100%;
  .footer-button {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
