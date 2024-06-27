<template>
  <div class="assist-netcard-create">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <ideal-region-project
        class="region-input"
        :detail-info="detailInfo"
        @selectRegion="selectRegion"
        @selectProject="selectProject"
      ></ideal-region-project>

      <el-form-item label="所属弹性网卡" prop="elasticCard">
        <el-select
          v-model="form.elasticCard"
          placeholder="请选择"
          class="assist-netcard-content"
        >
          <el-option
            v-for="(item, idx) of netCardState.nicList"
            :key="idx"
            :label="item.fixedIp"
            :value="item.uuid"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="所属VPC">
        <div class="ideal-theme-text">{{ netCardState.nicInfo?.vpcName }}</div>
      </el-form-item>

      <el-form-item label="所属子网" prop="subnet">
        <div class="flex-column" style="width: 100%">
          <div class="flex-row assist-netcard-content">
            <el-select
              v-model="form.subnet"
              placeholder="请选择"
              class="assist-netcard-input"
            >
              <el-option
                v-for="(item, idx) of netCardState.subnetList"
                :key="idx"
                :label="item.name + ' (' + item.cidr + ')'"
                :value="item.uuid"
              >
                {{ item.name }} ({{ item.cidr }})
              </el-option>
            </el-select>
            <svg-icon
              icon="refresh-icon"
              class="ideal-svg-margin-left"
            ></svg-icon>
          </div>

          <div class="ideal-theme-text">查看已有子网</div>
          <div>可用IP数：249</div>
        </div>
      </el-form-item>

      <el-form-item label="描述">
        <el-input
          v-model="form.description"
          type="textarea"
          class="assist-netcard-content"
          show-word-limit
          maxlength="150"
        ></el-input>
      </el-form-item>

      <el-form-item label="创建数量" prop="createNumber">
        <el-input-number
          v-model="form.createNumber"
          class="ideal-default-margin-right"
          :min="1"
          :max="10"
        />

        <div class="ideal-tip-text">该弹性网卡还可以创建16个辅助弹性网卡。</div>
      </el-form-item>

      <el-form-item label="私有IP地址">
        <el-checkbox
          v-model="form.selectPrivateIp"
          label="IPV4私网"
          disabled
          class="ideal-default-margin-right"
        >
        </el-checkbox>
      </el-form-item>

      <el-form-item label="IPv4地址">
        <div class="flex-column">
          <el-radio-group
            v-model="form.ipMode"
            class="ideal-default-margin-right"
          >
            <el-radio-button
              v-for="(item, index) in netCardState.ipModeList"
              :key="index"
              :label="item.label"
            >
              {{ item.value }}
            </el-radio-button>
          </el-radio-group>
          <div class="flex-row-center ideal-default-margin-top">
            <ideal-ip-input
              v-if="form.ipMode === 'manual'"
              class="ideal-default-margin-right"
              :ip-value="form.privateIp"
              @listenChange="ipv4ChangeEvent"
            >
            </ideal-ip-input>
            <div class="ideal-theme-text">查看已使用IP地址</div>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="安全组">
        <el-input v-model="searchValue" placeholder="请输入内容">
          <template #prepend>
            <div>模糊查询</div>
          </template>
          <template #suffix>
            <svg-icon
              icon="search-icon"
              @click="clickSafeGroupSearch"
            ></svg-icon>
          </template>
        </el-input>

        <ideal-table-list
          ref="safeGroupListRef"
          :table-data="state.dataList"
          :table-headers="tableHeaders"
          :is-multiple="true"
          :show-pagination="false"
          @handleSelectionChange="selectionChangeHandle"
        >
          <template #name>
            <el-table-column label="名称">
              <template #default="props">
                <div class="ideal-theme-text">{{ props.row.name }}</div>
              </template>
            </el-table-column>
          </template>
        </ideal-table-list>
      </el-form-item>

      <el-form-item>
        <template #label>
          <div>
            您已选择<span v-if="isSelected">（{{ selectedNumber }}）</span>
          </div>
        </template>

        <div
          v-for="(item, index) of state.dataListSelections"
          :key="index"
          class="flex-row assist-netcard-tags"
        >
          <div class="flex-row assist-netcard-tags-item">
            <div>{{ item.name }}</div>
            <svg-icon
              icon="close-icon"
              class="item-close-icon"
              @click="clickDeleteItem(item)"
            ></svg-icon>
          </div>
        </div>
      </el-form-item>
    </el-form>

    <div class="flex-row assist-netcard-create--button">
      <el-button type="info" @click="cancelForm(formRef)">{{
        t('cancel')
      }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { FormRules, FormInstance } from 'element-plus'
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum } from '@/utils/enum'
import store from '@/store'
import { showLoading, hideLoading } from '@/utils/tool'
import {
  safeGroupListByInstanceUrl,
  querySubnetList,
  queryNetCardList,
  createAssistNic,
  batchCreateAssistNic
} from '@/api/java/network'
import { ElMessage } from 'element-plus/es'

interface nicProps {
  detailInfo?: any
}

const props = withDefaults(defineProps<nicProps>(), {
  detailInfo: () => ({})
})

const { t } = useI18n()
const formRef = ref<FormInstance>()
const form = reactive({
  resourcePoolId: '',
  vdcId: '',
  region: '',
  regionId: '',
  projectId: '',
  elasticCard: '', // 所属弹性网卡
  vpc: 'subnet-e883', // 所属VPC
  subnet: '', // 所属子网
  description: '',
  createNumber: 1, //
  selectPrivateIp: true, // 私有IP地址
  privateIp: '', // 私有IP地址
  ipMode: 'auto', //ip地址分配方式
  safeGroup: '' // 安全组
})

const rules = reactive<FormRules>({
  elasticCard: [{ required: true, message: '请选择弹性网卡', trigger: 'blur' }],
  vpc: [{ required: true, message: '请选择虚拟私有云', trigger: 'blur' }],
  subnet: [{ required: true, message: '请选择所属子网', trigger: 'blur' }],
  safeGroup: [{ required: true, message: '请选择安全组', trigger: 'blur' }]
})

const netCardState = reactive({
  regionList: [] as any,
  regionInfo: {} as any,
  projectList: [] as any,
  nicList: [] as any,
  nicInfo: {} as any,
  subnetList: [] as any,
  ipModeList: [] as any
})

watch(
  () => form.createNumber,
  val => {
    if (val > 1) {
      netCardState.ipModeList = [{ value: '自动分配IP地址', label: 'auto' }]
    } else {
      netCardState.ipModeList = [
        { value: '自动分配IP地址', label: 'auto' },
        { value: '手动指定IP地址', label: 'manual' }
      ]
    }
  },
  { immediate: true }
)

//获取区域信息
const selectRegion = (regionInfo: any) => {
  netCardState.regionInfo = regionInfo
  form.regionId = regionInfo?.id
}
//获取项目信息
const selectProject = (projectInfo: any) => {
  form.projectId = projectInfo.id
}

watch(
  () => [form.regionId, form.projectId],
  ([region, project, mainNic]) => {
    if (region && project) {
      getNicList()
      if (form.elasticCard) {
        state.queryForm = {
          ...commonParams(),
          instanceUuid: form.elasticCard
        }
        getDataList()
      }
    }
  }
)
// 安全组搜索
const searchValue = ref('')
const { resourcePool } = store.resourceStore

const mainNicSwitch = computed(() => Object.keys(props.detailInfo).length > 0) //是都主网卡详情页新建辅助网卡
onMounted(() => {
  if (mainNicSwitch.value) {
    form.resourcePoolId = props.detailInfo?.resourcePoolId
    form.vdcId = props.detailInfo?.vdcId
  } else {
    form.resourcePoolId = resourcePool.resourcePoolId
    form.vdcId = resourcePool.vdcId
  }
})
//公共参数
const commonParams = () => {
  return {
    resourcePoolId: form.resourcePoolId,
    regionId: form.regionId,
    projectId: form.projectId
  }
}
// 安全组列表
const state: IHooksOptions = reactive({
  dataListUrl: safeGroupListByInstanceUrl,
  deleteUrl: '',
  queryForm: {},
  isPage: false,
  createdIsNeed: false
})
const { selectionChangeHandle, getDataList } = useCrud(state)

// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '名称', prop: 'name', useSlot: true },
  { label: '访问规则', prop: 'ruleDetailString' }
]
// 是否选择了安全组
const isSelected = ref(false)
// 选择的安全组数量
const selectedNumber = ref(0)
watch(
  () => state.dataListSelections,
  value => {
    isSelected.value = false
    selectedNumber.value = 0
    if (value?.length) {
      isSelected.value = true
      selectedNumber.value = value.length
    }
  }
)
// 获取列表dom
const safeGroupListRef = ref()
// 删除选择的安全组
const clickDeleteItem = (row: any) => {
  state.dataList?.forEach((item: any) => {
    if (item.name === row.name) {
      safeGroupListRef.value.IdealTableList.toggleRowSelection(item, false)
    }
  })
}

//弹性网卡
const getNicList = () => {
  const params = {
    ...commonParams(),
    type: 'MAIN_CARD'
  }
  queryNetCardList(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        netCardState.nicList = data
        if (mainNicSwitch.value) {
          form.elasticCard = props.detailInfo.uuid
        } else {
          form.elasticCard = data[0].uuid
        }
      } else {
        netCardState.nicList = []
      }
    })
    .catch(_ => {
      netCardState.nicList = []
    })
}

watch(
  () => form.elasticCard,
  val => {
    netCardState.nicInfo = netCardState.nicList.find(
      (item: any) => item.uuid === val
    )
    const vpcId = netCardState.nicInfo.subnet?.vpcId
    getSubnetList(vpcId)
  }
)

const getSubnetList = (vpcId: string) => {
  const params = {
    ...commonParams(),
    vpcId
  }
  querySubnetList(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        netCardState.subnetList = data
        form.subnet = data[0].uuid
      } else {
        netCardState.subnetList = []
      }
    })
    .catch(_ => {
      netCardState.subnetList = []
    })
}

const ipv4ChangeEvent = (val: any) => {
  form.privateIp = val
}
// 搜索
const clickSafeGroupSearch = () => {
  state.queryForm = {}
  getDataList()
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
    if (valid) {
      const securityGroups = state.dataListSelections?.map(item => {
        return {
          securitygroupId: item.uuid
        }
      })
      let params: any = {
        ...commonParams(),
        vdcId: form.vdcId,
        subnetUuid: form.subnet,
        parentId: form.elasticCard,
        availableZone: netCardState.nicInfo.availableZone,
        description: form.description,
        securityGroups
      }
      if (form.ipMode === 'manual') {
        params.fixedIp = form.privateIp
      }
      if (form.createNumber === 1) {
        showLoading('创建辅助弹性网卡中...')
        createAssistNic(params)
          .then((res: any) => {
            const { code, data } = res
            if (code === 200) {
              ElMessage.success('创建辅助弹性网卡成功')
              emit(EventEnum.success)
            } else {
              ElMessage.success('创建辅助弹性网卡失败')
            }
            hideLoading()
          })
          .catch(_ => {
            hideLoading()
          })
      } else {
        params.count = form.createNumber
        showLoading('批量创建辅助弹性网卡中...')
        batchCreateAssistNic(params)
          .then((res: any) => {
            const { code, data } = res
            if (code === 200) {
              ElMessage.success('批量创建辅助弹性网卡成功')
              emit(EventEnum.success)
            } else {
              ElMessage.success('批量创建辅助弹性网卡失败')
            }
            hideLoading()
          })
          .catch(_ => {
            hideLoading()
          })
      }
    }
  })
}
</script>

<style scoped lang="scss">
.assist-netcard-create {
  width: 100%;
  // 修改表单标签长度
  :deep(.el-form-item--default .el-form-item__label) {
    width: 120px;
  }
  .assist-netcard-create--button {
    justify-content: flex-end;
    align-items: center;
    padding: 0 20px;
  }
  :deep .region-input {
    .el-select {
      width: $formInputWidth;
    }
  }
  .assist-netcard-content {
    width: 65%;
    justify-content: space-between;
  }
  .assist-netcard-input {
    width: 92%;
  }
  .assist-netcard-tags {
    white-space: nowrap;
    margin: 3px 5px;
    .assist-netcard-tags-item {
      background-color: $gray1-light;
      padding: 2px 10px;
      border-radius: $circleRadiusSize;
      .item-close-icon {
        cursor: pointer;
        margin-left: 10px;
      }
    }
  }
  .flex-row-center {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}
</style>
<style lang="scss">
.custom-tooltip {
  max-width: 260px;
}
</style>
