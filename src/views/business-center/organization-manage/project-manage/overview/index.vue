<template>
  <div class="overview">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
      class="overview-form"
    >
      <div class="flex-row header__title">
        <el-divider direction="vertical" />
        <div class="header__title-label">基本信息</div>
      </div>

      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" class="vbf-item" clearable />
      </el-form-item>

      <el-form-item v-if="form.parent" label="上级VDC" prop="vpc">
        <el-select
          v-model="form.parent.name"
          class="vbf-item"
          placeholder="请选择"
          disabled
        >
          <el-option
            v-for="(item, index) of vdcList"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="描述" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="请输入描述"
          class="vbf-item"
        >
        </el-input>
      </el-form-item>

      <div class="flex-row header__title">
        <el-divider direction="vertical" />
        <div class="header__title-label">资源共享</div>
      </div>

      <el-form-item label="资源共享">
        <el-switch
          v-model="form.shared"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>

      <div class="flex-row header__title">
        <el-divider direction="vertical" />
        <div class="header__title-label">资源绑定</div>
        <div class="ideal-tip-text">
          为方便实现底层资源的纳管与管理，您可以设定项目绑定关系。用户在资源组所属资源池中申请部署的资源可分配到指定的项目。
        </div>
      </div>

      <el-form-item>
        <div class="flex-column" style="width: 50%">
          <ideal-table-list
            :table-data="form.dataList"
            :table-headers="tableHeaders"
            :show-pagination="false"
          >
            <template #name>
              <el-table-column label="资源池名称">
                <template #default="props">
                  <el-select
                    v-model="props.row.cloudResourcePoolId"
                    placeholder="请选择"
                    :disabled="props.row.disabled"
                    @change="selectResource(props.row)"
                  >
                    <el-option
                      v-for="(item, index) of resourcePoolIds"
                      :key="index"
                      :label="item.name"
                      :disabled="item.disabled"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
            </template>

            <template #regionId>
              <el-table-column label="区域">
                <template #default="props">
                  <el-select
                    v-model="props.row.regionId"
                    placeholder="请选择"
                    :disabled="props.row.disabled"
                    @change="selectRegion(props.row)"
                  >
                    <el-option
                      v-for="(item, index) of props.row.regionList"
                      :key="index"
                      :label="item.code"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
            </template>

            <template #resourceGroupId>
              <el-table-column label="资源组">
                <template #default="props">
                  <el-select
                    v-model="props.row.resourceGroupId"
                    value-key="id"
                    :disabled="props.row.disabled"
                    placeholder="请选择"
                    @change="selectResourceGroup(props.row)"
                  >
                    <el-option
                      v-for="(item, index) of props.row.resourceGroupList"
                      :key="index"
                      :label="item.name"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
            </template>

            <template #operation>
              <el-table-column label="操作" width="120">
                <template #default="props">
                  <ideal-table-operate
                    :buttons="operateBtns"
                    @clickMoreEvent="clickOperateEvent($event, props)"
                  >
                  </ideal-table-operate>
                </template>
              </el-table-column>
            </template>
          </ideal-table-list>
          <el-button
            link
            type="primary"
            class="ideal-middle-margin-top"
            style="justify-content: flex-start"
            @click="clickAddResource"
            >添加一条</el-button
          >
        </div>
      </el-form-item>
    </el-form>

    <div class="flex-row footer-button">
      <!-- <el-button type="primary" @click="submitForm(formRef)">{{
        t('save')
      }}</el-button> -->
      <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus/es'
import { FormRules, FormInstance } from 'element-plus'
import type { IdealTableColumnHeaders, IdealTableColumnOperate } from '@/types'
import {
  projectDetailApi,
  editProjectApi,
  projectBindResourceApi,
  projectBindResourceGroup,
  projectUnbindResourceApi
} from '@/api/java/business-center'
import { resourcePoolSelect } from '@/api/java/operate-center'
import { getResourceGroupList, cloudPlatformRegionAz } from '@/api/java/public'

const { t } = useI18n()
const route = useRoute()
const id = route.query.id
const vdcId = route.query.vdcId

onMounted(() => {
  detailInfo()
  queryBindResourceGroup()
})
const detailInfo = async () => {
  const res: any = await projectDetailApi(id)
  const { code, data } = res
  if (code === 200) {
    getResourcePool({ vdcId: data?.vdc?.id })
    form.name = data?.name
    form.id = data?.id
    form.remark = data?.remark
    form.parent.name = data?.vdc?.name
    form.shared = data?.shared
    if (JSON.stringify(data?.cloudResourcePool)) {
      form.resourcePool = data.cloudResourcePool?.id
      form.region = data?.region
    }
    if (JSON.stringify(data.cloudProject)) {
      form.resourceGroup = {
        id: data.cloudProject?.id,
        name: data.cloudProject?.name
      }
    }
  }
}

const formRef = ref<FormInstance>()
const form = reactive({
  name: '',
  id: '',
  remark: '',
  parent: {
    name: ''
  },
  shared: 0,
  resourcePool: '', // 资源池
  region: '', // 区域
  resourceGroup: {
    id: '',
    name: ''
  }, // 资源组
  dataList: [{}] as any[]
})
const rules = reactive<FormRules>({
  name: [{ required: true, message: '请填写名称', trigger: 'blur' }]
})
const vdcList = ref<any>([])
const resourcePoolIds: any = ref([])
const cloudPlatform: any = ref('')

const router = useRouter()

// 资源绑定列表
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '资源池名称', prop: 'name', useSlot: true },
  { label: '区域', prop: 'regionId', useSlot: true },
  { label: '资源组', prop: 'resourceGroupId', useSlot: true }
]

/*
方法
 */
//查询项目所绑定的资源组
const queryBindResourceGroup = () => {
  projectBindResourceGroup(id).then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      data.forEach((ele: any) => {
        ele.disabled = true
      })
      form.dataList = data.length ? data : [{}]
    } else {
      form.dataList = [{}]
    }
  })
}

watch(
  () => form.dataList,
  arr => {
    resourcePoolIds.value.forEach((ele: any) => {
      ele.disabled = false
      ele.disabled = arr.some((item: any) => {
        return item.cloudResourcePoolId === ele.id
      })
    })
  },
  { deep: true, immediate: true }
)
// 查询资源池
const getResourcePool = (params: any = {}) => {
  resourcePoolSelect(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        resourcePoolIds.value = data
        form.dataList.forEach(item => {
          getRegionList(item)
        })
      } else {
        resourcePoolIds.value = []
      }
    })
    .catch(_ => {
      resourcePoolIds.value = []
    })
}
const selectResource = (val: any) => {
  val.regionId = ''
  val.resourceGroupId = ''
  val.resourceGroupList = []
  getRegionList(val)
}

// 查询区域
const getRegionList = (val: any) => {
  const params = { cloudResourcePoolId: val.cloudResourcePoolId }
  cloudPlatformRegionAz(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        val.regionList = data
        getResourceGroup(val)
      } else {
        val.regionList = []
      }
    })
    .catch(_ => {
      val.regionList = []
    })
}

const selectRegion = (val: any) => {
  val.resourceGroupId = ''
  getResourceGroup(val)
}
// 查询资源组
const getResourceGroup = (val: any) => {
  if (val.regionId) {
    const params = {
      cloudResourcePoolId: val.cloudResourcePoolId,
      regionId: val.regionId
    }
    getResourceGroupList(params)
      .then((res: any) => {
        const { code, data } = res
        if (code === 200) {
          val.resourceGroupList = data
        } else {
          val.resourceGroupList = []
        }
      })
      .catch(_ => {
        val.resourceGroupList = []
      })
  } else {
    val.resourceGroupList = []
  }
}

const selectResourceGroup = (row: any) => {
  const params = [
    {
      resourceGroupId: row.resourceGroupId,
      cloudResourcePoolId: row.cloudResourcePoolId,
      regionId: row.regionId,
      projectId: id,
      vdcId
    }
  ]
  projectBindResourceApi(params).then((res: any) => {
    if (res.code === 200) {
      form.dataList.forEach((item: any) => {
        item.disabled = true
      })
    }
  })
}
// 列表行数据操作事件
const operateBtns: IdealTableColumnOperate[] = [
  { title: '删除', prop: 'delete' }
]
const clickOperateEvent = (command: string | number | object, props: any) => {
  if (command === 'delete') {
    if (props.row.id) {
      projectUnbindResourceApi({ ids: props.row.id }).then((res: any) => {
        if (res.code === 200) {
          form.dataList.splice(props.$index, 1)
        }
      })
    } else {
      form.dataList.splice(props.$index, 1)
    }
  }
}
const clickAddResource = () => {
  form.dataList.push({ name: '', regionId: '', resourceGroupId: '' })
}

// 方法
const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  router.back()
}

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate(async (valid: boolean) => {
    if (valid) {
      let obj = {
        name: form.name,
        id: form.id,
        remark: form.remark,
        shared: form.shared,
        cloud_resource_pool_id: form.resourcePool,
        region: form.region
      }
      const res: any = await editProjectApi(obj)
      if (res.code === 200) {
        ElMessage.success('修改成功')
        router.back()
      } else {
        ElMessage.error('修改失败')
      }
      detailInfo()
    }
  })
}
</script>

<style lang="scss" scoped>
.overview {
  width: 100%;
  .header__title {
    background-color: var(--el-color-primary-light-9);
    line-height: $headerContainerHeight;
    height: $headerContainerHeight;
    align-items: center;
    margin-bottom: 10px;
    // 修改分割线颜色
    :deep(.el-divider--vertical) {
      border-left: 2px var(--el-color-primary) solid;
    }
    .header__title-label {
      font-size: 16px;
      font-weight: 500;
      color: #000;
      margin-right: 10px;
    }
  }
  .overview-form {
    background-color: white;
    padding: 20px;
    .vbf-item {
      width: 352px;
    }
  }
  .footer-button {
    margin-top: 5px;
    padding: 20px;
    background-color: white;
    justify-content: flex-start;
    align-items: center;
  }
}
</style>
