<template>
  <div class="upload-object">
    <ideal-horizontal-steps
      :data-array="stepsArray"
      :current-step="stepsIndex"
    />

    <div v-if="showTip" class="flex-row upload-object-tip ideal-middle-margin-top">
      <div class="flex-row">
        <svg-icon icon="info-warning" class-name="tip-icon" class="ideal-svg-margin-right"/>
        <div class="flex-row">上传操作将产生<span class="ideal-theme-text">请求费用</span>，上传成功后将产生<span class="ideal-theme-text">存储费用</span>。</div>
      </div>
      <svg-icon icon="close-icon" class-name="tip-icon" style="cursor: pointer;" @click="clickCloseTip"/>
    </div>

    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="存储类别">
        <div>
          <el-radio-group v-model="form.category" class="ideal-default-margin-right">
            <el-radio-button
              v-for="(item, index) of categories"
              :key="index"
              :label="item.label"
            >
              {{ item.value }}
            </el-radio-button>
          </el-radio-group>

          <div class="ideal-tip-text">适用于有大量热点文件或小文件，且需要频繁访问(平均一个月多次)并快速获取数据的业务场景。</div>
          <div class="ideal-tip-text">对象默认与桶的存储类别相同，也可以根据适用场景修改。</div>
        </div>
      </el-form-item>

      <el-form-item label="上传对象">
        <div>
          <div class="flex-row">
            <svg-icon icon="info-warning" class-name="upload-tip" class="ideal-svg-margin-right"/>
            <div class="upload-tip-text">桶内如有同名文件/文件夹，将被新上传的文件/文件夹覆盖。如您想要保留多个版本的文件/文件夹，请开启多版本控制。</div>
          </div>

          <el-upload
            ref="upload"
            drag
            action
            :http-request="httpRequest"
            multiple
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
          </el-upload>
        </div>
      </el-form-item>
    </el-form>

    <div class="flex-row upload-footer">
      <el-button type="primary" :disabled="stepsIndex === 0">下一步：高级配置（可选）</el-button>
      <div class="flex-row">
        <el-button type="primary">上传</el-button>
        <el-button>取消</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import type { IdealSteps } from '@/types'

// 步骤
const stepsIndex = ref(0)
const stepsArray: IdealSteps[] = [
  { title: '上传对象' },
  { title: '高级配置(可选)' }
]

const showTip = ref(true)
const clickCloseTip = () => {
  showTip.value = false
}

const formRef = ref<FormInstance>()
const form = reactive({
  category: 'standard' // 存储类别
})
const rules = reactive<FormRules>({})

const categories = [
  { label: 'standard', value: '标准存储' },
  { label: 'lows', value: '低频访问存储' },
  { label: 'archive', value: '归档存储' }
]

const httpRequest = (e: any) => {
  console.log(e) // e->upload组件所有参数 接口
  // const formdata = new FormData()
  // fileUp(formdata)
  //   .then(res => {
  //     if (res.data.errcode === "SUCCESS") {
  //       this.$parent.getData()
  //     }
  //     this.close()
  //   })
  //   .catch(error => {
  //     this.close()
  //     console.log(error)
  //   })
}
</script>

<style scoped lang="scss">
.upload-object {
  width: 100%;
  .upload-object-tip {
    background-color: var(--el-color-primary-light-9);
    border: 1px solid var(--el-color-primary);
    padding: 10px;
    justify-content: space-between;
    border-radius: $circleRadiusSize;
    :deep(.tip-icon) {
      color: var(--el-color-primary);
    }
  }
  :deep(.el-form-item--default .el-form-item__label) {
    width: 100px;
  }
  :deep(.upload-tip) {
    color: $warningColor;
  }
  .upload-tip-text {
    color: $warningColor;
  }
  .upload-footer {
    justify-content: space-between;
  }
}
</style>
