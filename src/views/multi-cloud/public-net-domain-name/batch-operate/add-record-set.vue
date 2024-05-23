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
            class="custom-box"
          ></el-input>
          <div class="ideal-tip-text">
            每行输入一个域名。您最多可输入10,000个域名，还可再输入{{
              recordNum
            }}个。
          </div>
        </div>
      </el-form-item>

      <el-form-item label="类型" prop="type" required>
        <el-select
          v-model="form.type"
          placeholder="请选择类型"
          class="custom-box"
        >
          <el-option
            v-for="item in recordTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="主机记录">
        <div class="flex-column">
          <div
            v-for="(item, index) in form.hostRecord"
            :key="index"
            style="margin-bottom: 10px"
          >
            <el-input v-model="item.value" class="custom-box"></el-input>
            <el-button
              v-if="form.hostRecord.length > 1"
              link
              type="primary"
              @click="handleDelete(index)"
              >删除</el-button
            >
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

      <el-form-item label="值:" prop="value" class="value-container">
        <div class="flex-column">
          <el-input
            v-model="form.value"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 6 }"
            :placeholder="'例:\n192.168.10.10'"
            class="custom-box"
          ></el-input>
          <div class="ideal-tip-text">
            A记录：填写IPv4地址，最多可以输入50个不重复地址，每行一个。<br />
            例如：<br />
            192.168.10.10<br />
            172.16.100.100<br />
          </div>
        </div>
      </el-form-item>

      <el-form-item label="线路类型">{{ form.lineType }}</el-form-item>

      <el-form-item label="TTL(秒)">{{ form.ttl }}</el-form-item>
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
  type: 'A',
  hostRecord: [{ value: '' }],
  value: '',
  lineType: '全网默认',
  ttl: 30
})

const rules = reactive<FormRules>({
  domainName: [{ required: true, message: '请输入域名', trigger: 'blur' }],
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
  form.hostRecord.push({ value: '' })
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
