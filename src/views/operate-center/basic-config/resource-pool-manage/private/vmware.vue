<template>
  <div class="vmware">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
      class="vmware__container"
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
            <div class="vmware--upload" @click="clickUpload">
              上传
              <input type="file" style="visibility: collapse; height: 0px" />
            </div>
          </div>

          <img
            v-if="fileUrl"
            class="vmware-icon"
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
        <div style="width: 100%">
          <el-select
            v-model="form.region"
            style="width: 20%"
            filterable
            allow-create
            :disabled="isEdit"
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

          <el-tooltip
            effect="dark"
            placement="right"
            content="选择列表不存在区域时，可手动输入区域。"
            popper-class="vmware-form--create__tooltip"
          >
            <svg-icon
              icon="question-icon"
              class="ideal-svg-margin-left"
            ></svg-icon>
          </el-tooltip>
        </div>
      </el-form-item>

      <el-form-item label="可用区" prop="availableZone">
        <div style="width: 100%">
          <el-select
            v-model="form.availableZone"
            style="width: 20%"
            filterable
            allow-create
            :disabled="isEdit"
          >
            <el-option
              v-for="(item, index) of availableZones"
              :key="index"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>

          <el-tooltip
            effect="dark"
            placement="right"
            content="选择列表不存在可用区，可手动输入可用区，输入多个采用英文,进行分割。"
            popper-class="vmware-form--create__tooltip"
          >
            <svg-icon
              icon="question-icon"
              class="ideal-svg-margin-left"
            ></svg-icon>
          </el-tooltip>
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
import {
  vdcTreeList,
  uploadBase64Data,
  cloudPlatformRegion
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
  networkType: [{ required: true, message: '请选择网络类型', trigger: 'blur' }],
  availableZone: [{ required: true, message: '请选择可用区', trigger: 'blur' }]
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
      form.cloudPlatform = data?.cloudPlatform.id
      form.region = data?.region
      form.networkType = data?.networkType
      fileUrl.value = data?.imageUrl

      getRegionList(data?.cloudPlatform?.id)
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
          regionList.value = data
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
}
// 云网关
const cloudGatewayIds: any = []

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
  formEl.validate((valid: boolean) => {
    if (!valid) {
      return
    }
    // changeImage: true 选择或重选图标, 需重新上传
    if (changeImage.value) {
      uploadIcon()
    } else {
      handleEvent()
    }
  })
}
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
  const params: { [key: string]: any } = {
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
    networkType: form.networkType
  }
  // 判断当前区域是否手动输入值
  if (regionList.value.includes(form.region)) {
    params.region = form.region
  } else {
    params.regionCode = form.region // 在资源池中新增区域时，使用此参数
  }
  // 可用手动输入值则接口传参,选择可不传
  if (!availableZones.value.includes(form.availableZone)) {
    params.azCodes = form.availableZone.split(',')
  }

  resourcePoolCreate(params).then((res: any) => {
    const { code } = res
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
  const params = {
    id,
    name: form.name, // 资源池名称
    remark: form.remark, // 备注
    status: form.status, // 状态
    imageUrl: form.imageUrl // 图标地址
  }
  resourcePoolEdit(params).then((res: any) => {
    const { code } = res
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
.vmware {
  width: 100%;
  .vmware__container {
    padding: $idealPadding;
  }
  .vmware__title {
    justify-content: flex-start;
    align-items: center;
    background-color: $gray1-light;
    padding: 10px;
    width: 100%;
  }
  .vmware--upload {
    cursor: pointer;
    margin-left: 10px;
    color: var(--el-color-primary);
  }
  .vmware-icon {
    width: 40px;
    height: 50px;
    margin-top: 10px;
  }
  .vmware--create {
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
<style lang="scss">
.vmware-form--create__tooltip {
  width: 260px;
}
</style>
