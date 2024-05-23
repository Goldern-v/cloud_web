<template>
  <div class="private-create">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-card>
        <div class="flex-row private-create__tip">
          <svg-icon
            icon="info-warning"
            color="var(--el-color-primary)"
            class="ideal-svg-margin-right"
          ></svg-icon>
          <span
            >目前镜像服务已进入商业化阶段，私有镜像会收取一定的存储费用。</span
          >
        </div>

        <div class="ideal-default-margin-top private-create-title">镜像类型和来源</div>

        <el-form-item label="区域" prop="regionId" class="ideal-large-margin-top">
          <div class="flex-column" style="width: 100%">
            <el-select
              v-model="form.regionId"
              placeholder="请选择"
              class="ideal-default-margin-right"
              style="width: 20%;"
            >
              <el-option
                v-for="(item, index) of regionList"
                :key="index"
                :label="item.cnName"
                :value="item.id"
              />
            </el-select>

            <div class="ideal-tip-text">
              不同区域的云服务产品之间内网互不相通；请就近选择靠近您业务的区域，可减少网络延迟，提高访问速度。
            </div>
          </div>
        </el-form-item>

        <el-form-item label="项目" prop="projectId">
          <el-select
            v-model="form.projectId"
            style="width: 20%;"
          >
            <el-option
              v-for="(item, index) of projectList"
              :key="index"
              :label="item.name"
              :value="item.id"
              >{{ item.name }}</el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="创建方式" prop="createMode">
          <el-radio-group v-model="form.createMode" class="ideal-default-margin-right">
            <el-radio-button
              v-for="(item, index) of createModeArray"
              :key="index"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="镜像类型" prop="mirrorType">
          <el-radio-group v-model="form.mirrorType" class="ideal-default-margin-right">
            <el-radio-button
              v-for="(item, index) of mirrorTypeArray"
              :key="index"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="选择镜像源" required>
          <div class="flex-column" style="width: 100%">
            <el-tabs v-model="originType">
              <el-tab-pane label="云服务器" name="1" />
            </el-tabs>

            <ecs 
              v-if="originType === '1'"
              :region-id="form.regionId"
              :project-id="form.projectId"
              @clickTableCell="clickTableCell"
            />
            <el-form-item prop="instanceId"></el-form-item>
          </div>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <div class="private-create-title">配置信息</div>

        <el-form-item label="名称" prop="name" class="ideal-large-margin-top">
          <el-input v-model="form.name" style="width: 30%" />
        </el-form-item>

        <el-form-item label="标签">
          <div class="flex-column">
            <div>
              如果您需要使用同一标签标识多种云资源，即所有服务均可在标签输入框下拉选择同一标签，建议在TMS中创建预定义标签。
            </div>
            <div
              v-for="(item, index) of form.tags"
              :key="index"
              class="flex-row private-create-tags"
            >
              <el-input
                v-model="item.key"
                placeholder="标签键"
                class="ideal-default-margin-right"
                style="width: 210px"
              />
              <el-input
                v-model="item.value"
                placeholder="标签值"
                class="ideal-default-margin-right"
                style="width: 210px"
              />
              <svg-icon
                v-if="form.tags.length > 1"
                icon="delete-icon"
                color="var(--el-color-primary)"
                @click="clickDeleteTag(index)"
              />
            </div>
            <div class="flex-row">
              <el-button link type="primary" @click="clickAddTag"
                >添加标签</el-button
              >
              <div>您还可以添加10个标签。</div>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="描述">
          <el-input
            v-model="form.description"
            type="textarea"
            style="width: 30%"
            maxlength="1024"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="协议">
          <div class="flex-row private-create-protocol">
            <el-checkbox v-model="form.protocol" class="ideal-default-margin-right" />
            <div class="ideal-default-margin-left">我已经阅读并同意</div>
            <el-button type="primary" link>《镜像制作承诺书》</el-button>
            <div>和</div>
            <el-button type="primary" link>《镜像免责声明》</el-button>
          </div>
        </el-form-item>
      </el-card>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import ecs from './ecs.vue'
// import bareMetal from './bare-metal.vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRegion } from '@/utils/common/region'

const formRef = ref<FormInstance>()
const form = reactive({
  regionId: '', // 区域
  regionName: '',
  resourceId: '', // 资源池id
  projectId: '', // 项目
  cloudProjectId: '', // 底层项目id
  createMode: '1', // 创建方式
  mirrorType: '1', // 镜像类型
  instanceId: '', // 镜像源
  instanceName: '',
  name: '', // 名称
  tags: [{ key: '', value: '' }],
  description: '', // 描述
  protocol: false // 协议
})

const {
  regionList,
  projectList
} = useRegion(form)

const checkOrigin = (rule: any, value: any, callback:(e?: Error) => any) => {
  if (!form.instanceId) {
    callback(new Error('请选择镜像源'))
  }
  callback()
}

const rules = reactive<FormRules>({
  regionId: [{ required: true, message: '请选择区域', trigger: 'blur' }],
  projectId: [{ required: true, message: '请选择项目', trigger: 'blur' }],
  createMode: [{ required: true, message: '请选择创建方式', trigger: 'blur' }],
  mirrorType: [{ required: true, message: '请选择镜像类型', trigger: 'blur' }],
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  instanceId: [{ required: true, validator: checkOrigin, trigger: 'blur' }]
})

const createModeArray: any = ref([
  { label: '创建私有镜像', value: '1' }
])
const mirrorTypeArray: any = ref([
  { label: '系统盘镜像', value: '1' }
])
// 镜像源类型
const originType = ref('1')
const clickTableCell = (row: any) => {
  form.instanceId = row.id
  form.instanceName = row.name
}
// 添加标签
const clickAddTag = () => {
  form.tags.push({ key: '', value: '' })
}
const clickDeleteTag = (index: number) => {
  if (form.tags.length === 1) { return }
  form.tags.splice(index, 1)
}

defineExpose({
  formRef,
  form
})
</script>

<style scoped lang="scss">
.private-create {
  width: 100%;
  .private-create__tip {
    background-color: var(--el-color-primary-light-9);
    padding: 10px 20px;
    align-items: center;
  }
  .private-create-title {
    font-weight: 500;
    font-size: 16px;
  }
  .private-create-tags {
    margin: 10px 0 0;
    align-items: center;
    justify-content: flex-start;
  }
  .private-create-protocol {
    justify-content: flex-start;
    align-items: center;
  }
  :deep(.el-form) {
    padding: 0;
  }
  :deep(.el-card__body) {
    padding: 20px 20px 0;
  }
}
</style>
