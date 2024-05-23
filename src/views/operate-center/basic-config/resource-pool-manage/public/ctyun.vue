<template>
  <div class="ctyun">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
      class="ctyun__container"
    >
      <el-form-item>
        <div class="flex-row ideal-header-container" style="width: 100%">
          <el-divider direction="vertical" />
          <div>基本信息</div>
        </div>
      </el-form-item>

      <el-form-item label="资源池名称" prop="name">
        <el-input v-model="form.name" style="width: 20%" />
      </el-form-item>

      <el-form-item label="VDC" prop="vdcId">
        <div style="width: 20%">
          <el-tree-select
            v-model="form.vdcId"
            :data="vdcList"
            :render-after-expand="false"
            :props="vdcTreeProp"
            check-strictly
          />
        </div>
      </el-form-item>

      <el-form-item label="图标" prop="imageUrl">
        <div class="flex-column" style="width: 100%">
          <div class="flex-row">
            <el-input
              v-model="form.imageUrl"
              disabled
              style="width: 20%"
            ></el-input>
            <div class="ctyun--upload" @click="clickUpload">
              上传
              <input type="file" style="visibility: collapse; height: 0px" />
            </div>
          </div>

          <img
            v-if="fileUrl"
            class="ctyun-icon"
            :src="fileUrl"
            alt=""
            @click="clickPreview"
          />
        </div>
      </el-form-item>

      <el-form-item label="备注">
        <el-input v-model="form.remark" type="textarea" style="width: 20%" />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio label="ACTIVATE">激活</el-radio>
          <el-radio label="OFF">关闭</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <div class="flex-row ideal-header-container" style="width: 100%">
          <el-divider direction="vertical" />
          <div>云平台资源信息</div>
        </div>
      </el-form-item>

      <el-form-item label="云平台入口" prop="cloudPlatform">
        <el-select
          v-model="form.cloudPlatform"
          placeholder="请选择"
          :disabled="isEdit"
          style="width: 20%"
          @change="changeCloudPlatform"
        >
          <el-option
            v-for="(item, idx) of cloudPlatforms"
            :key="idx"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="区域" prop="region">
        <div class="flex-column" style="width: 100%">
          <el-select
            v-model="form.region"
            :disabled="isEdit"
            style="width: 20%"
            @change="changeRegion"
          >
            <el-option
              v-for="(item, index) of regionList"
              :key="index"
              :label="item.cnName"
              :value="item.id"
            >
            </el-option>
          </el-select>

          <el-radio-group
            v-if="availableZones.length"
            v-model="form.availableZone"
            style="margin-top: 10px"
          >
            <el-radio-button
              v-for="(item, index) of availableZones"
              :key="index"
              :label="item.name"
            />
          </el-radio-group>
        </div>
      </el-form-item>

      <el-form-item label="资源组">
        <div class="flex-column" style="width: 100%">
          <el-select
            v-model="form.resourceGroup"
            :disabled="isEdit"
            style="width: 20%"
          >
            <el-option
              v-for="(item, index) of resourceGroups"
              :key="index"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
      </el-form-item>

      <el-form-item label="网络类型" prop="networkType">
        <div class="flex-column" style="width: 100%">
          <el-select
            v-model="form.networkType"
            :disabled="isEdit"
            style="width: 20%"
          >
            <el-option
              v-for="(item, index) of networkTypes"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </el-form-item>

      <el-form-item>
        <div class="flex-row ideal-header-container" style="width: 100%">
          <el-divider direction="vertical" />
          <div>网络连接与安全</div>
        </div>
      </el-form-item>

      <el-form-item label="云网关">
        <el-select
          v-model="form.cloudGatewayId"
          placeholder="请选择"
          style="width: 20%"
        >
          <el-option
            v-for="(item, idx) of cloudGatewayIds"
            :key="idx"
            :label="item.otherName"
            :value="item.otherId"
          >
            {{ item.otherName }}
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <el-dialog v-model="dialogVisible">
      <img w-full :src="fileUrl" alt="Preview Image" />
    </el-dialog>

    <submit-button
      @clickCancel="cancelForm(formRef)"
      @clickSave="submitForm(formRef)"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * 创建和详情-基本信息
 */
import submitButton from '../components/submit-button.vue'
import type { FormRules, FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus/es'
import { EventEnum } from '@/utils/enum'
import { nameRuleThree } from '@/utils/validate'
import { isEmpty, isUnDef } from '@/utils/is'
import { compareDiffDictionary } from '@/utils/tool'
import {
  vdcTreeList,
  uploadBase64Data,
  cloudPlatformRegion,
  getResourceGroupList
} from '@/api/java/public'
import {
  resourcePoolCreate,
  resourcePoolEdit,
  cloudPlatformList,
  resourcePoolDetail
} from '@/api/java/operate-center'

interface CloudProps {
  cloudCategory?: string
  cloudType?: string
}
const props = withDefaults(defineProps<CloudProps>(), {
  cloudCategory: '',
  cloudType: ''
})

const formRef = ref<FormInstance>()
const form = reactive({
  name: '', // 资源池名称
  vdcId: '',
  imageUrl: '',
  remark: '',
  status: 'ACTIVATE', // 状态
  cloudPlatform: '', // 云平台入口
  cloudGatewayId: '', // 网管
  region: '', // 区域
  availableZone: '',
  resourceGroup: '',
  networkType: ''
})
const checkResourceName = (
  rule: any,
  value: any,
  callback: (e?: Error) => any
) => {
  if (!value.length) {
    callback(new Error('请输入资源池名称'))
  }
  nameRuleThree({ maxLength: 20, minLength: 1 }, value, callback)
}
const rules = reactive<FormRules>({
  name: [{ required: true, validator: checkResourceName, trigger: 'blur' }],
  vdcId: [{ required: true, message: '请选择VDC', trigger: 'blur' }],
  imageUrl: [{ required: true, message: '请上传图标', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
  cloudPlatform: [
    { required: true, message: '请选择云平台入口', trigger: 'blur' }
  ],
  region: [{ required: true, message: '请选择区域', trigger: 'blur' }],
  networkType: [{ required: true, message: '请选择网络类型', trigger: 'blur' }]
})

const networkTypes = [
  { label: '经典网络', value: 'CLASSIC' },
  { label: '专有网络', value: 'PROPRIETARY' }
]

const route = useRoute()
const id = route.query.id
const isEdit = !isEmpty(id) && !isUnDef(id)
// 云平台
const platform = reactive({
  cloudType: '', // 类型
  cloudCategory: '' // 类别
})

onMounted(() => {
  platform.cloudType = props.cloudType
  platform.cloudCategory = props.cloudCategory
  if (isEdit) {
    platform.cloudType = route.query.cloudType as string
    platform.cloudCategory = route.query.cloudCategory as string
    initEditData()
  }
  getVdcTreeList()
  getEntrance()
})
// 表单深拷贝, 比较表单是否修改
const originDic = ref()
// 编辑信息
const initEditData = () => {
  resourcePoolDetail({ id }).then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      form.name = data?.name
      form.vdcId = data?.vdcId
      form.imageUrl = data?.imageUrl
      form.remark = data?.remark
      form.status = data?.status
      form.cloudPlatform = data?.cloudPlatform?.id
      form.region = data?.region
      form.networkType = data?.networkType
      fileUrl.value = data?.imageUrl

      getRegionList(data?.cloudPlatform?.id)
      originDic.value = Object.assign({}, form)
    }
  })
}
// vdc
const vdcList: any = ref([])
const getVdcTreeList = async () => {
  const data: any = await vdcTreeList()
  if (data.code === 200) {
    vdcList.value = data.data.sons
  } else {
    vdcList.value = []
  }
}
// VDC 自定义prop
const vdcTreeProp = {
  label: 'name',
  children: 'sons',
  value: 'id'
}
// 云平台入口
const cloudPlatforms = ref<any[]>([])
const getEntrance = () => {
  const params = {
    name: '',
    cloudType: platform.cloudType, // 云平台的类型
    cloudCategory: platform.cloudCategory // 云平台的类别
  }
  cloudPlatformList(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        cloudPlatforms.value = data
      } else {
        cloudPlatforms.value = []
      }
    })
    .catch(_ => {
      cloudPlatforms.value = []
    })
}
// 监听云平台选择
const changeCloudPlatform = (cloudPlatformId: string) => {
  getRegionList(cloudPlatformId)
}
// 区域
const regionList = ref<any[]>([])
const getRegionList = (cloudPlatformId: string) => {
  cloudPlatformRegion({ cloudPlatformId })
    .then((res: any) => {
      const { code, data } = res
      regionList.value = []
      if (code === 200) {
        if (data.length) {
          regionList.value = [{ cnName: '全部', id: 'all' }].concat(data) // 全部则不传值
        }
      }
    })
    .catch(_ => {
      regionList.value = []
    })
}
// 可用区
const availableZones = ref<any[]>([])
const changeRegion = (regionId: string) => {
  const result = regionList.value.find((item: any) => item.id === regionId)
  availableZones.value = result?.availableZones
  // 是否选择全部
  if (regionId.includes('all')) {
    availableZones.value = []
  }
  getResourceGroup()
}
// 资源组
const cloudGatewayIds: any = []
const resourceGroups = ref<any[]>([])
const getResourceGroup = () => {
  if (form.region.includes('all')) { return }
  const params = {
    // cloudResourcePoolId: val.cloudResourcePoolId,
    regionId: form.region
  }
  getResourceGroupList(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        resourceGroups.value = data
      } else {
        resourceGroups.value = []
      }
    })
    .catch(_ => {
      resourceGroups.value = []
    })
}

const fileUrl = ref<any>() // 图标
const changeImage = ref(false) // 是否选择或重选图标
// 选择本地图片
const clickUpload = () => {
  const input: any = document.querySelector('input[type=file]')
  input.click()
  input.onchange = (e: any) => {
    changeImage.value = true
    form.imageUrl = e.target.files[0].name
    const reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])
    reader.onloadend = (a: any) => {
      fileUrl.value = a.target.result
    }
  }
}
const dialogVisible = ref(false)
// 图标放大显示
const clickPreview = () => {
  dialogVisible.value = true
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
  router.push({
    path: '/operate-center/basic-config/resource-pool-manage/list'
  })
}

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate(valid => {
    if (valid) {
      // changeImage: true 选择或重选图标, 需重新上传
      if (changeImage.value) {
        uploadIcon()
      } else {
        handleEvent()
      }
    } else {
      console.log('error submit!')
      return false
    }
  })
}
// 上传图标
const uploadIcon = () => {
  const params = {
    file: fileUrl.value
  }
  uploadBase64Data(params).then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      form.imageUrl = data
      handleEvent()
    }
  })
}
// 处理创建和编辑
const handleEvent = () => {
  if (isEdit) {
    handleEdit()
  } else {
    handleCreate()
  }
}
// 创建
const router = useRouter()
const handleCreate = () => {
  if (form.region.includes('all')) {
    form.region = '' // 区域选择全部 为空
  }
  const params = {
    name: form.name, // 资源池名称
    vdcId: form.vdcId, // vdc的id
    image_url: form.imageUrl, // 图标地址
    remark: form.remark, // 备注
    status: form.status, // 状态 ACTIVATE激活、OFF关闭
    cloudPlatform: {
      id: form.cloudPlatform // 云平台id
    },
    cloudType: props.cloudType, // 云类型
    cloudCategory: props.cloudCategory, // 云类别
    region: form.region, // 区域
    networkType: form.networkType
  }
  resourcePoolCreate(params).then((res: any) => {
    let { code } = res
    if (code === 200) {
      ElMessage.success('创建成功')
      router.push({
        path: '/operate-center/basic-config/resource-pool-manage/list'
      })
    } else {
      ElMessage.error('创建失败')
    }
  })
}
// 编辑
const handleEdit = () => {
  // 筛选表单修改项, 编辑时只传修改项
  const tempDic = compareDiffDictionary(originDic.value, form)

  const params: { [key: string]: any } = { id }
  for (const key in tempDic) {
    if (key === 'cloudPlatform') {
      params.cloudPlatform = {
        id: form.cloudPlatform
      }
    } else {
      params[key] = tempDic[key]
    }
  }
  params.name = form.name

  resourcePoolEdit(params).then((res: any) => {
    let { code } = res
    if (code === 200) {
      ElMessage.success('编辑成功')
      router.push({
        path: '/operate-center/basic-config/resource-pool-manage/list'
      })
    } else {
      ElMessage.error('编辑失败')
    }
  })
}
</script>

<style scoped lang="scss">
$customInputWidth: 352px;
.ctyun {
  width: 100%;
  .ctyun__container {
    padding: $idealPadding;
  }
  .ctyun__title {
    justify-content: flex-start;
    align-items: center;
    background-color: $gray1-light;
    padding: 10px;
    width: 100%;
  }
  .ctyun--upload {
    cursor: pointer;
    margin-left: 10px;
    color: var(--el-color-primary);
  }
  .ctyun-icon {
    width: 40px;
    height: 50px;
    margin-top: 10px;
  }
  .ctyun--create {
    justify-content: flex-start;
    align-items: center;
  }
  :deep(.el-input) {
    width: $customInputWidth;
  }
  :deep(.el-divider--vertical) {
    border-left: 1px var(--el-color-primary) solid;
  }
}
</style>
