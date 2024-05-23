<template>
  <div class="bind">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
      class="bind-form">
      <el-form-item label="云服务器名称">
        <div>{{ detail.name }}</div>
      </el-form-item>

      <el-form-item label="选择网卡">
        <el-radio-group v-model="form.networkCard">
          <el-radio-button label="already">选择已有弹性网卡</el-radio-button>
          <el-radio-button label="create">创建新的弹性网卡</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="!isCreate" label="选择弹性网卡">
        <el-input v-model="form.elasticNetCard" placeholder="请输入内容">
          <template #prepend>
            <el-select v-model="elasticNetCardSelect" placeholder="请选择">
              <el-option
                v-for="(item, index) of elasticNetCardSelects"
                :key="index + 'select'"
                :label="item.label"
                :value="item.prop"
              >
              </el-option>
            </el-select>
          </template>
          <template #suffix>
            <svg-icon icon="search-icon"></svg-icon>
          </template>
        </el-input>

        <ideal-table-list
          row-key="uuid"
          :table-data="nicList"
          :table-headers="nicTableHeaders"
          :is-radio="true"
          :show-pagination="false">
        </ideal-table-list>
      </el-form-item>

      <template v-if="isCreate">
        <el-form-item label="所属虚拟私有云">
          <div>vpc-default</div>
        </el-form-item>

        <el-form-item label="所属子网">
          <div class="flex-row">
            <el-select v-model="form.subnet" placeholder="请选择" class="ideal-default-margin-right">
              <el-option
                v-for="(item, index) of subnetList"
                :key="index + 'subnet'"
                :label="item.label"
                :value="item.prop"
              >
              </el-option>
            </el-select>
            <svg-icon icon="refresh-icon" class="ideal-default-margin-right"></svg-icon>
            <el-button link type="primary">查看已有子网</el-button>
          </div>
        </el-form-item>

        <el-form-item label="私有IP地址">
          <div class="flex-row">
            <el-select v-model="form.privateIp" placeholder="请选择" class="ideal-default-margin-right">
              <el-option
                v-for="(item, index) of privateIpList"
                :key="index + 'privateIp'"
                :label="item.label"
                :value="item.prop"
              >
              </el-option>
            </el-select>
            <svg-icon icon="refresh-icon" class="ideal-default-margin-right"></svg-icon>
            <el-button link type="primary">查看已使用IP地址</el-button>
          </div>
        </el-form-item>

        <el-form-item label="安全组">
          <div class="flex-column" style="width: 100%;">
            <div class="flex-row" style="justify-content: space-between;">
              <el-input v-model="form.elasticNetCard" placeholder="请输入内容" style="width: 80%;">
                <template #prepend>
                  <el-select v-model="elasticNetCardSelect" placeholder="请选择">
                    <el-option
                      v-for="(item, index) of elasticNetCardSelects"
                      :key="index + 'select'"
                      :label="item.label"
                      :value="item.prop"
                    >
                    </el-option>
                  </el-select>
                </template>
                <template #suffix>
                  <svg-icon icon="search-icon"></svg-icon>
                </template>
              </el-input>

              <el-button link>查看已有安全组</el-button>
            </div>

            <ideal-table-list
              :loading="safeState.dataListLoading"
              :table-data="safeState.dataList"
              :table-headers="safeTableHeaders"
              :is-multiple="true"
              :show-pagination="false">
            </ideal-table-list>
          </div>
        </el-form-item>
      </template>
    </el-form>

    <div class="flex-row footer-button">
      <el-button @click="cancelForm(formRef)"
        >{{ t('cancel') }}</el-button
      >
      <el-button type="primary" @click="submitForm(formRef)"
        >{{ t('confirm') }}</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum } from '@/utils/enum'
import type { FormRules, FormInstance } from 'element-plus'
import { queryNetCardList } from '@/api/java/network'

interface BindProps {
  detail?: any // 行数据
}
const props = withDefaults(defineProps<BindProps>(), {
  detail: () => ({})
})

const { t } = useI18n()

onMounted(() => {
  getNicList()
})

const formRef = ref<FormInstance>()
const form = reactive({
  networkCard: 'already', // 选择网卡
  elasticNetCard: '', // 选择弹性网卡
  subnet: '', // 所属子网
  privateIp: '', // 私有IP地址
  safeGroup: [] as any[] // 安全组
})
const rules = reactive<FormRules>({
  safeGroup: [{ required: true, message: '请选择安全组', trigger: 'blur' }]
})
// 是否选择新建弹性网卡
const isCreate = computed(() => form.networkCard === 'create')
// 选择弹性网卡输入框搜索类型选择
const elasticNetCardSelect = ref('')
const elasticNetCardSelects = [{ label: '名称', prop: 'name' }]

const subnetList: any = ref([])
const privateIpList: any = ref([])

watch(() => form.networkCard, value => {
  if (value === 'already') {
    getNicList()
  } else {
  }
})

const route = useRoute()
const detail = JSON.parse(route.query.detail as any)

const nicList = ref<any[]>([])
const getNicList = () => {
  const params = {
    resourcePoolId: detail.pool.id,
    instanceUuid: detail.uuid,
    regionId: detail.regionId,
    projectId: detail.project.id,
    resourceStatus: 'DOWN'
  }
  queryNetCardList(params).then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      nicList.value = data
    } else {
      nicList.value = []
    }
  }).catch(_ => {
    nicList.value = []
  })
}
// 弹性网卡列表
const cardState: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const { getDataList } = useCrud(cardState)
cardState.dataList = [
  { name: 'eip-0717', id: 'ec3370c5-7', subnet: 'subnet-default', privateIp: '192.168.0.143', bindIp: '10.3.2.4', safeGroup: 1 },
  { name: 'eip-0401', id: 'ec3370c5-7', subnet: 'subnet-default', privateIp: '192.168.0.143', bindIp: '10.3.2.4', safeGroup: 2 },
  { name: 'eip-0211', id: 'ec3370c5-7', subnet: 'subnet-default', privateIp: '192.168.0.143', bindIp: '10.3.2.4', safeGroup: 3 }
]
// 已有弹性网卡表头
const nicTableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name' },
  { label: 'ID', prop: 'uuid' },
  { label: '子网', prop: 'subnet' },
  { label: '私有IP地址', prop: 'fixedIp' },
  { label: '绑定弹性公网IP', prop: 'bindIp' },
  { label: '关联安全组个数', prop: 'safeGroup' }
]
// 安全组列表
const safeState: IHooksOptions = reactive({
  dataListUrl: '',
  deleteUrl: '',
  queryForm: {}
})
const safeCrud = useCrud(safeState)
// safeCrud.getDataList()
safeState.dataList = [
  { name: 'eip-0717', id: 'ec3370c5-7', subnet: 'subnet-default', privateIp: '192.168.0.143', bindIp: '10.3.2.4', safeGroup: 1 },
  { name: 'eip-0401', id: 'ec3370c5-7', subnet: 'subnet-default', privateIp: '192.168.0.143', bindIp: '10.3.2.4', safeGroup: 2 },
  { name: 'eip-0211', id: 'ec3370c5-7', subnet: 'subnet-default', privateIp: '192.168.0.143', bindIp: '10.3.2.4', safeGroup: 3 }
]
// 安全组表头
const safeTableHeaders: IdealTableColumnHeaders[] = [
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
  formEl.validate(valid => {
    if (valid) {
      console.log('submit!')
      emit(EventEnum.success)
    } else {
      console.log('error submit!')
      return false
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
