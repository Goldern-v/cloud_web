<template>
  <div>
    <div class="flex-row custom-tip-box">
      <svg-icon
        icon="info-warning"
        color="var(--el-color-primary)"
        class="ideal-svg-margin-right"
      ></svg-icon>
      <div class="flex-column">
        <p>温馨提示</p>
        <ul>
          <li>
            1、域名转移任务为异步操作，请您耐心等待。转移期间请避免对转移中的域名进行操作导致数据不同步问题。
          </li>
          <li>
            2、域名转移前请先确保对方账户能正常登陆云解析页面进行域名操作，暂不支持中国站和国际站之间互转。
          </li>
        </ul>
      </div>
    </div>
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
            每行输入一个域名。您最多可输入10,00个域名，还可再输入{{
              recordNum
            }}个。
          </div>
        </div>
      </el-form-item>

      <el-form-item label="对方账号ID" prop="account" required>
        <div class="flex-column">
          <div>
            <el-select
              v-model="form.account"
              placeholder="请输入要转入的华为云账号ID"
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
            <svg-icon
              icon="question-icon"
              class="ideal-svg-margin-left"
            ></svg-icon>
          </div>
          <div class="ideal-warning-text">
            为了防止用户名输入错误误转影响业务，对方账户必须输入对方帐号ID。
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
  type: 'A',
  hostRecord: [{ value: '' }],
  value: '',
  lineType: '全网默认',
  ttl: 30,
  account: ''
})

const rules = reactive<FormRules>({
  domainName: [{ required: true, message: '请输入域名', trigger: 'blur' }],
  value: [{ required: true, message: '请输入值', trigger: 'blur' }]
})

const recordNum = ref(1000)
watch(
  () => form.domainName,
  str => {
    const count = str.split('\n').length
    recordNum.value = 1000 - count
  }
)

const recordTypes = [
  { label: 'A-将域名指向IPv4地址', value: 'A' },
  { label: 'CANME-将域名指向另外一个域名', value: 'CANME' },
  { label: 'MX-将域名指向邮件服务器地址', value: 'MX' },
  { label: 'AAAA-将域名指向IPv6地址', value: 'AAAA' },
  { label: 'TXT-设置文本记录', value: 'TXT' }
]
</script>

<style scoped lang="scss">
.custom-tip-box {
  background-color: var(--custom-information-bg-color);
  border: 1px solid var(--el-color-primary);
  padding: 15px 20px;
  margin: 20px 10px 10px;
  ul {
    list-style-type: none;
  }
}
.custom-box {
  width: 500px;
}
:deep .el-form-item__content {
  font-size: 12px;
}
</style>
