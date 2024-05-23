<template>
  <div>
    <el-form
      ref="basicInfoRef"
      :model="form"
      :rules="rules"
      label-position="left"
    >
      <el-form-item label="域名" prop="domainName">
        <div class="flex-column">
          <el-input
            v-model="form.domainName"
            type="textarea"
            :autosize="{ minRows: 12 }"
            style="width: 500px"
          ></el-input>
          <div class="ideal-tip-text">
            每行输入一个域名。您最多可输入10,000个域名，还可再输入{{
              recordNum
            }}个。
          </div>
        </div>
      </el-form-item>

      <el-form-item label=" ">
        <el-button type="primary">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { FormRules } from 'element-plus'
const form = reactive({
  domainName: 'cloudjtc.com'
})

const rules = reactive<FormRules>({
  domainName: [{ required: true, message: '请输入域名', trigger: 'blur' }]
})

const recordNum = ref(9999)
watch(
  () => form.domainName,
  str => {
    const count = str.split('\n').length
    recordNum.value = 10000 - count
  }
)
</script>

<style scoped lang="scss"></style>
