<template>
  <div class="node-info">
    <el-form ref="formRef" :model="form" :rules="rules" label-address="left">
      <!-- 单节点创建或编辑 -->
      <el-form-item v-if="nodeOnly" label="节点名称" prop="name">
        <el-input
          v-model="form.name"
          class="custom-input"
          placeholder="请输入节点名称"
        ></el-input>
      </el-form-item>

      <!-- 信息录入 -->
      <el-form-item v-else label="节点名称" prop="nodeId">
        <el-select
          v-model="form.nodeId"
          filterable
          clearable
          placeholder="请输入或选择节点名称"
          allow-create
          default-first-option
          class="custom-input"
          @change="nodeChange"
        >
          <el-option
            v-for="(item, index) of state.nodeList"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="节点ID" prop="uuid">
        <el-input
          v-model="form.uuid"
          class="custom-input"
          placeholder="请输入节点ID"
          :disabled="isApproved || isSelect"
        ></el-input>
      </el-form-item>

      <el-form-item
        v-if="nodeOnly && !isSupplierManager"
        label="所属供应商"
        prop="vendorId"
      >
        <el-select
          v-model="form.vendorId"
          placeholder="请选择节点所属供应商"
          class="custom-input"
        >
          <el-option
            v-for="(item, index) of state.supplierList"
            :key="index"
            :label="item.username"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="区域" prop="areaId">
        <el-select
          v-model="form.areaId"
          placeholder="请选择节点所属区域,例如中国大陆-华东"
          class="custom-input"
          :disabled="isApproved || isSelect"
          @change="areaChange"
        >
          <el-option
            v-for="(item, index) of state.areaList"
            :key="index"
            :label="item.name"
            :value="item.rcId"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="国家">
        <el-select
          v-model="form.countryId"
          placeholder="请选择节点所属区国家"
          class="custom-input"
          :disabled="isApproved || isSelect"
          @change="countryChange"
        >
          <el-option
            v-for="(item, index) of state.countryList"
            :key="index"
            :label="item.name"
            :value="item.rcId"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="城市" prop="cityId">
        <el-select
          v-if="cityCount < 3000"
          v-model="form.cityId"
          placeholder="请选择节点所属的城市"
          class="custom-input"
          filterable
          :disabled="isApproved || isSelect"
        >
          <el-option
            v-for="(item, index) of state.cityList"
            :key="index"
            :label="item.name"
            :value="item.rcId"
          />
        </el-select>

        <el-cascader
          v-else
          v-model="selectedCitys"
          :props="cascaderProps"
          class="custom-input"
        ></el-cascader>
      </el-form-item>

      <el-form-item label="机房名称" prop="equipmentRoom">
        <el-input
          v-model="form.equipmentRoom"
          class="custom-input"
          placeholder="请输入机房名称"
          :disabled="isApproved || isSelect"
        >
        </el-input>
      </el-form-item>

      <el-form-item label="经度">
        <el-input
          v-model="form.longitude"
          class="custom-input"
          placeholder="请输入经度数据"
          :disabled="isApproved || isSelect"
        >
        </el-input>
      </el-form-item>

      <el-form-item label="维度">
        <el-input
          v-model="form.latitude"
          class="custom-input"
          placeholder="请输入维度数据"
          :disabled="isApproved || isSelect"
        >
        </el-input>
      </el-form-item>

      <el-form-item label="地理位置" prop="address">
        <el-input
          v-model="form.address"
          class="custom-input"
          placeholder="请输入地理位置,例如xxx市xx区xx街道x号"
          :disabled="isApproved || isSelect"
        >
        </el-input>
      </el-form-item>

      <el-form-item label="数据中心名称" prop="dataCenter">
        <el-input
          v-model="form.dataCenter"
          class="custom-input"
          placeholder="请输入数据中心名称"
          :disabled="isApproved || isSelect"
        >
        </el-input>
      </el-form-item>

      <el-form-item label="机柜号" prop="cabinets">
        <el-input
          v-model="form.cabinets"
          class="custom-input"
          type="textarea"
          placeholder="请输入机柜号,例如:F504-1-5"
          :disabled="isApproved || isSelect"
        >
        </el-input>
        <el-tooltip
          effect="dark"
          placement="right"
          content="机柜号文本框支持输入多个机柜，每个机柜中间以分号隔开"
        >
          <svg-icon
            icon="question-icon"
            class="ideal-svg-margin-left"
          ></svg-icon>
        </el-tooltip>
      </el-form-item>
    </el-form>

    <div v-if="nodeOnly" class="flex-row ideal-submit-button">
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
import {
  ElMessage,
  type FormInstance,
  type FormRules,
  type CascaderProps
} from 'element-plus'
import { NodeBasic } from './interface'
import { EventEnum } from '@/utils/enum'
import store from '@/store'
import {
  nodeEdit,
  nodeAdd,
  getRegionList,
  getNodeList,
  getCabinetList,
  getSupplierList
} from '@/api/java/operate-center'
import { isSupplierManager } from '@/utils/role'
import { hideLoading, showLoading } from '@/utils/tool'
import { clearForm } from '../common'

const { t } = useI18n()

interface NodeProps {
  type?: undefined | string
  vendorForm?: any //平台管理员角色信息录入时上一步的供应商信息
  rowData?: any
}

const props = withDefaults(defineProps<NodeProps>(), {
  type: '',
  vendorForm: () => {},
  rowData: () => {}
})

// 仅单独节点操作
const nodeOnly = computed(() =>
  RegExp(/createNode|editNode/).test(props.type as string)
)
const isEdit = computed(() => props.type === 'editNode') //单独节点操作编辑时

//供应商录入信息
const route = useRoute()
const isSupplierEntry = computed(() => route.query?.type === 'entry')
const isEditSupplier = computed(() => route.query?.type === 'edit') //编辑供应商录入信息

const formRef = ref<FormInstance>() // 校验表单
let form: { [key: string]: any } = reactive({
  name: '',
  uuid: '',
  nodeId: '',
  vendorId: '',
  areaId: '',
  countryId: '',
  cityId: '',
  equipmentRoom: '',
  address: '',
  dataCenter: '',
  cabinets: '',
  longitude: '', //经度
  latitude: '' //维度
})
//需要传参给后端的值
let regionForm = reactive({
  areaCode: '',
  areaName: '',
  countryName: '',
  countryCode: '',
  cityCode: '',
  cityName: ''
})

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入节点名称', trigger: 'blur' }],
  uuid: [{ required: true, message: '请输入节点ID', trigger: 'blur' }],
  nodeId: [
    { required: true, message: '请输入或选择节点名称', trigger: 'blur' }
  ],
  vendorId: [
    { required: true, message: '请选择节点所属供应商', trigger: 'change' }
  ],
  areaId: [
    { required: true, message: '请选择节点所属区域', trigger: 'change' }
  ],
  countryId: [
    { required: true, message: '请选择节点所属的国家', trigger: 'change' }
  ],
  cityId: [
    { required: true, message: '请选择节点所属的城市', trigger: 'blur' }
  ],
  equipmentRoom: [
    { required: true, message: '请输入机房名称', trigger: 'blur' }
  ],
  address: [{ required: true, message: '请输入地理位置', trigger: 'blur' }],
  dataCenter: [
    { required: true, message: '请输入数据中心名称', trigger: 'blur' }
  ],
  cabinets: [{ required: true, message: '请输入机柜号', trigger: 'blur' }]
})

const defaultOptions: NodeBasic = {
  areaList: [],
  countryList: [],
  cityList: [],
  supplierList: []
}

const state = reactive(defaultOptions)

onMounted(() => {
  /**
   * 单节点操作时
   */
  //供应商角色取当前登录用户id
  if (isSupplierManager.value) {
    form.vendorId = store.userStore.user.id
  } else if (nodeOnly.value) {
    //平台管理员角色查询所有供应商用户
    querySupplier()
  }
  //单节点操作编辑时
  if (isEdit.value) {
    Object.keys(form).forEach((key: string) => {
      if (key !== 'vendorId' && key !== 'nodeId') {
        form[key] = props.rowData[key]
      } else {
        form.vendorId = parseInt(props.rowData.vendorId)
      }
    })
  }
  queryAreas()
})
//查询供应商
const querySupplier = async () => {
  try {
    const res = await getSupplierList()
    state.supplierList = res.data
  } catch (err: any) {
    ElMessage.error(err)
  }
}

//查询区域
const queryAreas = async () => {
  try {
    const res = await getRegionList({ resType: 0 })
    state.areaList = res.data
  } catch (err: any) {
    ElMessage.error(err)
  }
}

watch(
  () => [form.areaId, state.areaList],
  ([val, arr]) => {
    if (val && arr.length) {
      const areaInfo = state.areaList?.find((item: any) => item.rcId === val)
      regionForm.areaCode = ''
      regionForm.areaName = areaInfo.name
      queryCountries(val)
    }
  }
)

//查询国家
const queryCountries = async (areaId: any) => {
  try {
    const res = await getRegionList({ resType: 1, parentId: areaId })
    state.countryList = res.data
  } catch (err: any) {
    ElMessage.error(err)
  }
}

const cityCount = ref(0)
watch(
  () => [form.countryId, state.countryList],
  ([val, arr]) => {
    if (val && arr.length) {
      const countryInfo = state.countryList?.find(
        (item: any) => item.rcId === val
      )
      regionForm.countryCode = countryInfo?.bssId
      regionForm.countryName = countryInfo?.name
      cityCount.value = countryInfo?.cityCount
      queryCities(form.areaId, val)
    }
  }
)

const areaChange = () => {
  form.countryId = ''
  form.cityId = ''
}
const countryChange = () => {
  form.cityId = ''
}
//判断国家下的城市数量，当数量过多时为了避免接口数据量过大造成页面卡顿，分开请求州级和州级下的市级信息
const selectedCitys: any = ref([])
const cascaderProps: CascaderProps = {
  lazy: true,
  lazyLoad: async (node, resolve) => {
    const { level, value } = node
    let nodes = []
    if (node.level === 0) {
      const res = await getRegionList({ resType: 4, parentId: form.countryId })
      nodes = res.data.map((item: any) => {
        return {
          value: item.rcId,
          label: item.name,
          leaf: level >= 1
        }
      })
    } else {
      const res = await getRegionList({
        resType: 2,
        provinceId: value
      })
      state.cityList = res.data
      nodes = res.data.map((item: any) => {
        return {
          value: item.rcId,
          label: item.name,
          leaf: level >= 1
        }
      })
    }
    if (isEdit.value) {
      selectedCitys.value = [props.rowData.provinceId, props.rowData.cityId]
    }
    resolve(nodes)
  }
}

watch(
  () => selectedCitys.value,
  (val: any) => {
    if (val.length) {
      form.cityId = val[val.length - 1]
    }
  },
  { deep: true }
)
//查询城市
const queryCities = async (areaId: string, countryId: string) => {
  try {
    //当城市数量较少时直接查询所有城市，城市数量过多时通过州划分城市
    if (cityCount.value < 3000) {
      const res = await getRegionList({ resType: 2, parentId: countryId })
      state.cityList = res.data
    }
  } catch (err: any) {
    ElMessage.error(err)
  }
}
watch(
  () => [form.cityId, state.cityList],
  ([val, arr]) => {
    if (val && arr.length) {
      const cityInfo = state.cityList?.find((item: any) => item.rcId === val)
      regionForm.cityCode = cityInfo?.bssId
      regionForm.cityName = cityInfo?.name
    }
  }
)

/**
 * 信息录入时获取所选供应商，并查询供应商下节点
 */
//录入信息页面,从上一步获取供应商id
watch(
  () => props.vendorForm,
  val => {
    if (val) {
      clearForm(form, [''])
      form.vendorId = val.vendorId
    }
  },
  { deep: true }
)

watch(
  () => form.vendorId,
  val => {
    if (val) {
      queryNode(val)
    }
  },
  { deep: true }
)
//查询供应商下节点
const queryNode = async (supplierId: string) => {
  try {
    const res = await getNodeList({ supplierId })
    state.nodeList = res.data
    if (isEditSupplier.value) {
      form.nodeId = route.query?.nodeId as string
    }
  } catch (err: any) {
    ElMessage.error(err)
  }
}
//节点发生改变
const nodeChange = (val: string) => {
  clearForm(form, ['vendorId', 'nodeId'])
  emit('changeNode', val)
}

const isApproved = ref(false) //选择已审批通过的节点不支持对节点信息的修改
const isSelect = ref(false) //信息录入时选择已经存在节点不支持对节点信息的修改
//拿到节点名称，用来判断是手输入新节点还是下拉选择已存在的节点
watch(
  () => [form.nodeId, state.nodeList],
  ([val, list]) => {
    if (val && list.length) {
      const nodeInfo = list?.find((item: any) => item.id === val)
      isApproved.value = nodeInfo?.approvalStatus.toUpperCase() === 'PASS'
      if (nodeInfo) {
        isSelect.value = isSupplierEntry.value
        Object.keys(form).forEach((key: string) => {
          if (key !== 'vendorId' && key !== 'nodeId') {
            form[key] = nodeInfo[key]
          }
        })
        selectedCitys.value = [nodeInfo.provinceId, nodeInfo.cityId]
        queryCabinet(val)
      } else {
        isSelect.value = false
      }
    } else {
      isApproved.value = false
      isSelect.value = false
    }
  },
  { deep: true }
)

const cabinetList: any = ref([])
//查询节点下机柜
const queryCabinet = async (nodeId: string) => {
  try {
    const res = await getCabinetList({ nodeId })
    cabinetList.value = res.data
  } catch (err: any) {
    ElMessage.error(err)
  }
}

// 方法
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void // 表单成功提交后刷新列表
  (e: 'changeNode', v: string): void
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
      if (isEdit.value) {
        const params = { id: props.rowData.id, ...form, ...regionForm }
        showLoading('编辑中...')
        nodeEdit(params)
          .then((res: any) => {
            if (res.code === 200) {
              ElMessage.success('编辑节点信息成功')
              emit(EventEnum.success)
            } else {
              ElMessage.error('编辑节点信息失败')
            }
            hideLoading()
          })
          .catch((err: any) => {
            hideLoading()
          })
      } else {
        const params = {
          ...form,
          ...regionForm
        }
        showLoading('创建中...')
        nodeAdd(params)
          .then((res: any) => {
            if (res.code === 200) {
              ElMessage.success('创建节点成功')
              emit(EventEnum.success)
            } else {
              ElMessage.error('创建失败')
            }
            hideLoading()
          })
          .catch((err: any) => {
            hideLoading()
          })
      }
    }
  })
}

defineExpose({ formRef, form, regionForm, cabinetList })
</script>

<style scoped lang="scss">
.node-info {
  width: 100%;
  :deep(.el-form) {
    padding: 0;
    height: 100%;
    overflow: auto;
  }
}
</style>
