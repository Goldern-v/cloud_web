<template>
  <div>
    <el-radio-group v-model="analyzeType" class="custom-radio">
      <el-radio-button
        v-for="item of analyzeTypeList"
        :key="item.label"
        type="text"
        :label="item.label"
        >{{ item.name }}
      </el-radio-button>
    </el-radio-group>

    <div class="ideal-tip-text" style="margin-top: 10px">
      同时添加www和@记录，将cloudjtc.com域名解析至您的网站地址
    </div>

    <el-form v-model="form" label-position="left">
      <el-form-item label="网站地址">
        <el-radio-group v-model="form.address" class="custom-radio">
          <el-radio
            v-for="item of addressList"
            :key="item.label"
            type="text"
            :label="item.label"
            >{{ item.name }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="值">
        <ideal-ip-input
          v-if="form.address == 'ip'"
          :ip-value="form.ipv4Cidr"
          @listenChange="ipv4ChangeEvent"
        ></ideal-ip-input>

        <el-input
          v-else
          v-model="form.domainName"
          placeholder="例如:huawei.com"
        >
        </el-input>
      </el-form-item>
    </el-form>

    <div class="custom-tip-box">
      <p>添加成功后，用户可以通过以下域名访问您的网站：</p>
      <p>www.cloudjtc.com</p>
      <p>cloudjtc.com</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const analyzeType = ref('net')
const analyzeTypeList = [
  { label: 'net', name: '网站解析' },
  { label: 'email', name: '邮箱解析' }
]

const addressList = [
  { label: 'ip', name: 'IP地址' },
  { label: 'cname', name: 'CNAME域名' }
]

const form = reactive({
  address: 'ip',
  ipv4Cidr: '',
  domainName: ''
})

const ipv4ChangeEvent = (value: string) => {
  form.ipv4Cidr = value
}
</script>

<style scoped lang="scss">
.custom-tip-box {
  padding: 10px;
  background: $gray2-light;
  p {
    line-height: 25px;
  }
}
</style>
