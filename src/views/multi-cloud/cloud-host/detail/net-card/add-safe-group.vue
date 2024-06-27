<template>
  <div class="add">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="云服务器名称">
        <div>{{ detail.name }}</div>
      </el-form-item>

      <el-form-item label="网卡">
        <el-select v-model="form.netCard" disabled>
          <el-option
            v-for="(item, index) of netCards"
            :key="index"
            :label="item.fixedIp"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="选择安全组">
        <div style="width: 100%">
          <div class="flex-row add-safe-search">
            <div class="flex-row" style="align-items: center">
              <el-input
                v-model="searchValue"
                placeholder="请输入安全组名称搜索"
              >
                <template #suffix>
                  <svg-icon
                    icon="search-icon"
                    style="cursor: pointer"
                    @click="clickSearch"
                  />
                </template>
              </el-input>
              <el-button style="margin-left: 10px">
                <svg-icon
                  icon="refresh-icon"
                  style="cursor: pointer"
                  @click="clickRefresh"
                />
              </el-button>
            </div>
          </div>

          <ideal-table-list
            ref="tableRef"
            :loading="state.dataListLoading"
            :table-data="state.dataList"
            :table-headers="tableHeaders"
            :show-pagination="false"
            :is-multiple="true"
            max-height="200"
            @handleSelectionChange="selectionChangeHandle"
          ></ideal-table-list>

          <div v-if="showTip" class="flex-row">
            <div>已选安全组：</div>
            <div v-for="(item, idx) of state.dataListSelections" :key="idx">
              {{ item.name }}
            </div>
          </div>
          <div v-if="showTip">
            为了更好的网络性能，建议单个网卡最多绑定5个安全组。
          </div>
        </div>
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
import type { FormRules, FormInstance } from 'element-plus'
import { EventEnum, OperateEventEnum } from '@/utils/enum'
import { IHooksOptions } from '@/hooks/interface'
import { useCrud } from '@/hooks'
import type { IdealTableColumnHeaders } from '@/types'
import {
  safeGroupListByInstanceUrl,
  safeGroupBindGroups
} from '@/api/java/network'

interface AddSafeGroupProps {
  type?: OperateEventEnum | string | undefined
  detail?: any // 行数据
}
const props = withDefaults(defineProps<AddSafeGroupProps>(), {
  type: '',
  detail: () => ({})
})

const showTip = computed(
  () => props.type === 'addSafeGroup' || props.type === 'removeSafeGroup'
)

const { t } = useI18n()

const formRef = ref<FormInstance>()
const form = reactive({
  netCard: '', // 网卡
  safeGroup: [] as any[] // 安全组
})
const rules = reactive<FormRules>({})
// 网卡
const netCards = ref<any[]>([])
onMounted(() => {
  if (props.detail?.nicList) {
    netCards.value = props.detail?.nicList
    const result = props.detail?.nicList.find(
      (item: any) => item.mainCard === '1'
    ) // 获取主网卡
    if (result) {
      form.netCard = result.id
    } else {
      form.netCard = props.detail?.nicList[0].id
    }
  }
  // 阿里公有云查询安全组需vpc uuid
  if (
    props.detail?.pool?.cloudType === 'ALI_CLOUD' &&
    props.detail?.pool?.cloudCategory === 'PUBLIC'
  ) {
    state.queryForm.vpcId = props.detail?.vpc.uuid
  }
  query()
})
// 安全组搜索
const searchValue = ref('')
const clickSearch = () => {
  state.queryForm.name = searchValue.value
  query()
}
const clickRefresh = () => {
  searchValue.value = ''
  state.queryForm.name = ''
  query()
}
// 列表
const state: IHooksOptions = reactive({
  dataListUrl: safeGroupListByInstanceUrl,
  isPage: false,
  createdIsNeed: false,
  primaryKey: 'uuid',
  queryForm: {
    resourcePoolId: props.detail?.pool?.id,
    regionId: props.detail?.regionId,
    projectId: props.detail?.project?.id,
    instanceUuid: props.detail?.uuid
  }
})
const { selectionChangeHandle, query } = useCrud(state)
const tableRef = ref()
watch(
  () => state.dataList,
  value => {
    if (value?.length) {
      value?.forEach(item => {
        // bindFlag 1已绑定
        tableRef.value.IdealTableList.toggleRowSelection(
          item,
          item.bindFlag === '1'
        )
      })
    }
  }
)
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '安全组名称', prop: 'name' },
  { label: '描述', prop: 'description' }
]
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
    console.log('submit!')
    handleEvent()
  })
}
const handleEvent = () => {
  const params = {
    resourcePoolId: props.detail?.pool?.id, // 资源池id
    regionId: props.detail?.regionId,
    projectId: props.detail?.project?.id,
    vdcId: props.detail?.vdc?.id,
    instanceUuid: props.detail?.uuid, // 云主机uuid
    securityGroupList: state.dataListSelections
  }
  safeGroupBindGroups(params).then((res: any) => {
    let tip = ''
    if (props.type === 'changeSafeGroup') {
      tip = '更改安全组'
    } else if (props.type === 'addSafeGroup') {
      tip = '加入安全组'
    } else if (props.type === 'removeSafeGroup') {
      tip = '移出安全组'
    }
    const { code } = res
    if (code === 200) {
      ElMessage.success(`${tip}成功`)
      emit(EventEnum.success)
    } else {
      ElMessage.error(`${tip}失败`)
    }
  })
}
</script>

<style scoped lang="scss">
.add {
  width: 100%;
  .add-safe-search {
    justify-content: space-between;
    align-items: center;
  }
}
</style>
