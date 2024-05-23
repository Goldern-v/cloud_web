<template>
  <div class="region-project-select">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="区域" prop="regionId">
        <el-select v-model="form.regionId" :disabled="designatedInfo">
          <el-option
            v-for="(item, index) of state.regionList"
            :key="index"
            :label="item.cnName"
            :value="item.id"
            >{{ item.cnName }}</el-option
          >
        </el-select>
      </el-form-item>

      <el-form-item label="项目" prop="projectId">
        <el-select v-model="form.projectId" :disabled="designatedInfo">
          <el-option
            v-for="(item, index) of state.projectList"
            :key="index"
            :label="item.name"
            :value="item.id"
            >{{ item.name }}</el-option
          >
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormRules } from 'element-plus'
import { queryUserProject, cloudPlatformRegionAz } from '@/api/java/public'
import store from '@/store'

const formRef = ref()
interface regionProps {
  designatedRegion?: boolean //是否存在指定区域
  detailInfo?: any //存在指定区域时的详细信息
  regionKey?: string //区域code值字段
  resourcePoolKey?: string //资源池id字段
  projectKey?: string //资源归属(项目)id字段
  vdcKey?: string //资源归属(项目)id字段
}
const props = withDefaults(defineProps<regionProps>(), {
  designatedRegion: false,
  detailInfo: () => ({}),
  regionKey: 'regionId',
  resourcePoolKey: 'resourcePoolId',
  projectKey: 'projectId',
  vdcKey: 'vdcId'
})

const form = reactive({
  regionId: '', //区域id
  projectId: '' //云管项目id
})

const state = reactive({
  regionList: [] as any[],
  projectList: [] as any[]
})

const rules = reactive<FormRules>({
  regionId: { required: true, message: '请选择区域' },
  projectId: { required: true, message: '请选择项目' }
})

const { resourcePool } = store.resourceStore
onMounted(() => {
  getRegion()
  getUserProject()
})

const designatedInfo = computed(() => Object.keys(props.detailInfo).length > 0) //是否存在指定区域或项目
// 获取区域
const getRegion = () => {
  let params: any = {}
  if (designatedInfo.value) {
    params.cloudResourcePoolId = props.detailInfo[props.resourcePoolKey]
  } else {
    if (!resourcePool?.resourcePoolId) {
      return
    }
    params.cloudResourcePoolId = resourcePool?.resourcePoolId
  }
  cloudPlatformRegionAz(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        state.regionList = data
        if (data?.length) {
          form.regionId = designatedInfo.value
            ? props.detailInfo[props.regionKey]
            : data[0].id
        }
      } else {
        state.regionList = []
        form.regionId = ''
      }
    })
    .catch(_ => {
      state.regionList = []
      form.regionId = ''
    })
}

watch(
  () => form.regionId,
  value => {
    if (value) {
      const regionInfo = state.regionList?.find(item => item.id === value)
      store.resourceStore.regionCode = regionInfo.code
      store.resourceStore.regionId = regionInfo.id
      emit('selectRegion', regionInfo)
    }
  }
)

// 项目信息
const getUserProject = () => {
  let params: any = {}
  if (designatedInfo.value) {
    params.vdcId = props.detailInfo[props.vdcKey]
  } else {
    if (!resourcePool?.vdcId) {
      return
    }
    params.vdcId = resourcePool?.vdcId
  }
  params.userId = store.userStore.user.id
  queryUserProject(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        state.projectList = data
        if (data?.length) {
          form.projectId = designatedInfo.value
            ? props.detailInfo[props.projectKey]
            : data[0].id
        }
      } else {
        state.projectList = []
      }
    })
    .catch(_ => {
      state.projectList = []
    })
}

watch(
  () => form.projectId,
  value => {
    if (value) {
      const projectInfo = state.projectList?.find(item => item.id === value)
      store.resourceStore.projectId = projectInfo.cloudProjectId //底层项目id
      store.resourceStore.cloudProjectId = value //云管项目id
      emit('selectProject', projectInfo)
    }
  }
)

// 方法
interface EventEmits {
  (e: 'selectRegion', v: any): void
  (e: 'selectProject', v: any): void
}
const emit = defineEmits<EventEmits>()

defineExpose({
  formRef
})
</script>

<style scoped lang="scss">
.region-project-select {
  .el-select {
    width: 100%;
  }
}
</style>
