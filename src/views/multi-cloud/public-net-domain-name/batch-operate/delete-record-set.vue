<template>
  <div>
    <el-form
      ref="basicInfoRef"
      :model="form"
      :rules="rules"
      label-position="left"
    >
      <el-form-item label="域名">
        <div class="flex-column">
          <el-input
            v-model="form.domainName"
            type="textarea"
            :autosize="{ minRows: 12 }"
            class="custom-box"
          ></el-input>
          <div class="ideal-tip-text">
            每行输入一个域名。您最多可输入10,000个域名，还可再输入{{
              recordNum
            }}个。
          </div>
        </div>
      </el-form-item>

      <el-form-item label="删除类型">
        <div class="flex-column custom-box">
          <el-radio>删除满足下方任意一个条件的记录</el-radio>
          <div
            v-for="(item, index) in form.hostRecord"
            :key="index"
            style="margin-bottom: 10px"
          >
            <el-row>
              <el-col :span="8">
                <el-select v-model="item.type">
                  <el-option label="主机记录等于" value="hostRecord">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="12"
                ><el-input v-model="item.value"></el-input
              ></el-col>
              <el-col :span="4"
                ><el-button
                  v-if="form.hostRecord.length > 1"
                  link
                  type="primary"
                  @click="handleDelete(index)"
                  >删除</el-button
                ></el-col
              >
            </el-row>
          </div>
          <div>
            <svg-icon
              icon="circle-add"
              class="ideal-svg-margin-right"
              style="color: var(--el-color-primary)"
            ></svg-icon>
            <el-button link type="primary" @click="add">增加</el-button>
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
  domainName: '',
  hostRecord: [{ value: '', type: 'hostRecord' }]
})

const rules = reactive<FormRules>({
  value: [{ required: true, message: '请输入值', trigger: 'blur' }]
})

const recordNum = ref(10000)
watch(
  () => form.domainName,
  str => {
    const count = str.split('\n').length
    recordNum.value = 10000 - count
  }
)

const recordTypes = [
  { label: 'A-将域名指向IPv4地址', value: 'A' },
  { label: 'CANME-将域名指向另外一个域名', value: 'CANME' },
  { label: 'MX-将域名指向邮件服务器地址', value: 'MX' },
  { label: 'AAAA-将域名指向IPv6地址', value: 'AAAA' },
  { label: 'TXT-设置文本记录', value: 'TXT' }
]

const add = () => {
  form.hostRecord.push({ value: '', type: 'hostRecord' })
}
const handleDelete = (index: number) => {
  form.hostRecord.splice(index, 1)
}
</script>

<style scoped lang="scss">
.custom-box {
  width: 500px;
}
:deep .el-form-item__content {
  font-size: 12px;
}
</style>
