<template>
  <div class="route-table-create">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item>
        <div class="flex-row ideal-header-container">
          <el-divider direction="vertical" />
          <div>基本信息</div>
        </div>
      </el-form-item>

      <ideal-region-project
        ref="regionProject"
        class="region-input"
        :detail-info="detailInfo"
        @selectRegion="selectRegion"
        @selectProject="selectProject"
      ></ideal-region-project>

      <el-form-item label="路由表名称" prop="name">
        <el-input v-model="form.name" class="custom-input" />
      </el-form-item>

      <el-form-item label="所属VPC" prop="vpc">
        <div class="flex-column custom-input">
          <el-select
            v-model="form.vpc"
            placeholder="请选择"
            :disabled="vpcDetailSwitch"
          >
            <el-option
              v-for="item in state.vpcList"
              :key="item.value"
              :label="item.name"
              :value="item.uuid"
            />
          </el-select>

          <div class="ideal-tip-text">IPv4网段：{{ state.vpcInfo?.cidr }}</div>
          <div class="ideal-tip-text">
            已创建子网：{{ state.vpcInfo?.subnetDtoList?.length }}
          </div>
        </div>
      </el-form-item>

      <el-form-item label="描述">
        <el-input
          v-model="form.description"
          maxlength="150"
          show-word-limit
          type="textarea"
          class="custom-input"
        />
      </el-form-item>

      <el-form-item v-if="!isAliyun && !isCtyun">
        <div class="flex-row ideal-header-container">
          <el-divider direction="vertical" />
          <div>添加路由</div>
        </div>
      </el-form-item>

      <el-form-item v-if="!isAliyun && !isCtyun">
        <ideal-table-list
          :table-data="form.routeData"
          :table-headers="tableHeaders"
          :show-pagination="false"
        >
          <template #destinationType>
            <el-table-column label="目的地址类型">
              <template #default="props">
                <div v-if="!props.$index">Local</div>
                <el-select
                  v-else
                  v-model="props.row.destinationType"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in destinationTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>
          </template>

          <template #destination>
            <el-table-column label="目的地址">
              <template #default="props">
                <div v-if="!props.$index">Local</div>
                <el-input v-else v-model="props.row.destination" />
              </template>
            </el-table-column>
          </template>

          <template #nextHopType>
            <el-table-column label="下一跳类型">
              <template #default="props">
                <div v-if="!props.$index">Local</div>
                <el-select
                  v-else
                  v-model="props.row.nextHopType"
                  placeholder="请选择"
                  @change="nextTypeChange(props.row)"
                >
                  <el-option
                    v-for="item in nextTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>
          </template>

          <template #nextHop>
            <el-table-column label="下一跳">
              <template #default="props">
                <div v-if="!props.$index">Local</div>
                <el-cascader
                  v-else-if="isTencent && props.row.nextHopType === 'ECS'"
                  v-model="props.row.nextHop"
                  :options="props.row.privateIpList"
                  :props="cascaderProps"
                  :show-all-levels="false"
                  placeholder="请选择"
                />
                <el-select
                  v-else
                  v-model="props.row.nextHop"
                  placeholder="请选择"
                  @change="nextChange(props.row)"
                >
                  <el-option
                    v-for="item in props.row.nextList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.uuid"
                  />
                </el-select>
              </template>
            </el-table-column>
          </template>

          <template #description>
            <el-table-column label="描述">
              <template #default="props">
                <div v-if="!props.$index">系统默认，表示VPC内实例互通</div>
                <div v-else class="flex-row route-table-create-description">
                  <el-input v-model="props.row.description" />
                  <svg-icon
                    icon="delete-icon"
                    class="ideal-svg-margin-left"
                    @click="clickDeleteRoute(props.$index)"
                  ></svg-icon>
                </div>
              </template>
            </el-table-column>
          </template>
        </ideal-table-list>

        <div
          class="flex-row route-table-create__add-route"
          @click="clickAddRoute"
        >
          <svg-icon icon="circle-add" class="ideal-svg-margin-right"></svg-icon>
          继续添加
        </div>
      </el-form-item>
    </el-form>

    <div class="flex-row route-table-create__submit">
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
import type { FormRules, FormInstance } from 'element-plus'
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum } from '@/utils/enum'
import { generateCode } from '@/utils/tool'
import store from '@/store'
import { useResourcePool } from '@/utils/common/resource'
import { ElMessage } from 'element-plus/es'
import { showLoading, hideLoading } from '@/utils/tool'
import { nextTypeList, destinationTypeList } from './components/constant'
import { queryVpcList, routeTableCreate } from '@/api/java/network'
import { queryCloudHostList } from '@/api/java/compute'
import { getNextHop } from './components/constant'

interface routeTableProps {
  detailInfo?: any
}

const props = withDefaults(defineProps<routeTableProps>(), {
  detailInfo: () => ({})
})

const { t } = useI18n()
const formRef = ref<FormInstance>()
const form = reactive({
  region: '', //区域code
  regionId: '', //区域id
  projectId: '', //项目id
  cloudProjectId: '',
  resourcePoolId: '', //资源池id
  vdcId: '',
  name: 'rtb-' + generateCode(4), // 路由表名称
  vpc: '', // 所属VPC
  description: '',
  routeData: [{}] as any[] // 路由数据
})

const selectRegion = (regionInfo: any) => {
  form.region = regionInfo.code
  form.regionId = regionInfo.id
}

const selectProject = (projectInfo: any) => {
  form.projectId = projectInfo.id
  form.cloudProjectId = projectInfo.cloudProjectId
}

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入路由表名称', trigger: 'blur' }],
  vpc: [{ required: true, message: '请选择vpc', trigger: 'change' }]
})
// 表头
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '目的地址类型', prop: 'destinationType', useSlot: true },
  { label: '目的地址', prop: 'destination', useSlot: true },
  { label: '下一跳类型', prop: 'nextHopType', useSlot: true },
  { label: '下一跳', prop: 'nextHop', useSlot: true },
  { label: '描述', prop: 'description', useSlot: true }
]

const state = reactive({
  vpcList: [] as any[],
  vpcInfo: {} as any
})

const vpcDetailSwitch = computed(() => Object.keys(props.detailInfo).length > 0) //是否vpc详情页新建路由

const { resourcePool } = store.resourceStore

onMounted(() => {
  if (vpcDetailSwitch.value) {
    form.resourcePoolId = props.detailInfo?.resourcePoolId
    form.vdcId = props.detailInfo?.vdcId
  } else {
    form.resourcePoolId = resourcePool.resourcePoolId
    form.vdcId = resourcePool.vdcId
  }
})
// 阿里公有云、天翼云不支持同步创建路由
const { isAliyun, isTencent, isCtyun } = useResourcePool()
watch(
  () => [form.resourcePoolId, form.regionId, form.projectId],
  ([pool, region, project]) => {
    form.vpc = ''
    state.vpcInfo = {}
    state.vpcList = []
    if (pool && region && project) {
      queryVpc()
    }
  }
)
// 查询VPC
const queryVpc = () => {
  const params = {
    resourcePoolId: form.resourcePoolId,
    regionId: form.regionId,
    projectId: form.projectId,
    vdcId: form.vdcId
  }
  queryVpcList(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        state.vpcList = data
        if (vpcDetailSwitch.value) {
          form.vpc = props.detailInfo.uuid
          state.vpcInfo = props.detailInfo
        } else {
          form.vpc = data[0].uuid
          state.vpcInfo = data[0]
        }
      } else {
        state.vpcList = []
      }
    })
    .catch(_ => {
      state.vpcList = []
    })
}
watch(
  () => form.vpc,
  val => {
    state.vpcInfo = state.vpcList.find(item => item.uuid === form.vpc)
    form.routeData = [{}]
  }
)

const cascaderProps = {
  value: 'name',
  label: 'name',
  children: 'nicList'
}
const nextTypeChange = (row: any) => {
  if (row.nextHopType === 'ECS') {
    queryCloudHostList({ vpcId: form.vpc }).then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        if (isTencent.value) {
          data.forEach((ele: any) => {
            ele.nicList.forEach((item: any) => {
              item.name = item.fixedIp
            })
          })
          row.privateIpList = data
        } else {
          row.nextList = data
        }
      } else {
        row.privateIpList = []
        row.nextList = []
      }
    })
  }
}
const nextChange = (val: any) => {
  const nextInfo = val.nextList.find((item: any) => item.uuid === val.nextHop)
  if (nextInfo) {
    val.nextHopName = nextInfo.name
    val.ip = nextInfo.ip
  }
}
// 添加路由
const clickAddRoute = () => {
  form.routeData.push({
    destinationType: '',
    destination: '',
    nextHopType: '',
    nextHop: '',
    nextHopName: '',
    description: ''
  })
}
// 删除路由
const clickDeleteRoute = (index: number) => {
  form.routeData.splice(index, 1)
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

const regionProject = ref() //区域项目选择框组件
// 校验表单
const checkForm = async (formEl: FormInstance | undefined) => {
  let flag = false
  if (!formEl) {
    flag = false
  } else {
    await formEl.validate(valid => {
      flag = valid
    })
    return flag
  }
  return flag
}
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  const flag = await checkForm(regionProject.value.formRef) //校验区域项目
  formEl.validate(valid => {
    if (valid && flag) {
      //公共参数
      const commonParams = {
        resourcePoolId: form.resourcePoolId,
        regionId: form.regionId,
        projectId: form.projectId
      }
      const routeList = form.routeData
        .filter((item: any, index: number) => index !== 0)
        .map((item: any) => {
          let obj: { [key: string]: any } = {
            destination: item.destination,
            nextHopType: item.nextHopType,
            description: item.description
          }
          //腾讯云下一跳类型需传云主机的内网ip，其他云传云主机的uuid
          if (isTencent.value) {
            obj.nextHop = getNextHop(item).nextHop
            obj.nextHopName = getNextHop(item).nextHopName
          } else {
            obj.nextHop = item.nextHop
            obj.nextHopName = item.nextHopName
          }
          return obj
        })

      const params = {
        name: form.name,
        vpcId: state.vpcInfo.id,
        vpcUuid: form.vpc,
        description: form.description,
        vdcId: form.vdcId,
        ...commonParams,
        routeList
      }
      showLoading('创建中...')
      routeTableCreate(params)
        .then((res: any) => {
          const { data, code } = res
          if (code === 200) {
            ElMessage.success('创建路由表成功')
            emit(EventEnum.success)
          } else {
            ElMessage.error('创建路由表失败')
          }
          hideLoading()
        })
        .catch(err => {
          hideLoading()
        })
    } else {
      console.log('error submit!')
      return false
    }
  })
}
</script>

<style scoped lang="scss">
.route-table-create {
  width: 100%;
  :deep(.el-form) {
    padding: 0;
  }
  .ideal-header-container {
    width: 100%;
  }
  .custom-input {
    width: 440px;
  }
  :deep .region-input {
    .el-select {
      width: 440px;
    }
  }
  // 修改分割线颜色
  :deep(.el-divider--vertical) {
    border-left: 1px var(--el-color-primary) solid;
  }
  .route-table-create__add-route {
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-top: 10px;
    cursor: pointer;
  }
  .route-table-create-description {
    justify-content: flex-start;
    align-items: center;
  }
  .route-table-create__submit {
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
