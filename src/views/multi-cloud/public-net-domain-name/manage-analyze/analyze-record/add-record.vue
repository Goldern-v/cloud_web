<template>
  <div class="add-record">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="主机记录" prop="recordName">
        <el-row style="width: 100%">
          <el-col :span="20"
            ><el-input v-model="form.recordName"></el-input
          ></el-col>
          <el-col :span="4">
            <span style="font-weight: bolder; margin-left: 5px; font-size: 12px"
              >e1xample.com</span
            >
          </el-col>
        </el-row>
        <div class="ideal-tip-text">
          主机记录指域名前缀，例如example.com常用的解析如下：<br />
          <span>网站解析：</span
          >主机记录写www，解析的域名是www.example.com<br />
          <span>网站解析：</span>主机记录为空，解析的域名是example.com<br />
          <span>子域名：</span>主机记录写cdn，解析的域名是cdn.example.com<br />
          <span>邮箱解析：</span
          >主机记录写mail，解析的域名是mail.example.com<br />
          <span>泛解析：</span
          >主机记录写*，解析的域名是*.example.com，匹配example.com的所有子域名
        </div>
      </el-form-item>

      <el-form-item label="类型" prop="type" required>
        <el-select
          v-model="form.type"
          placeholder="请选择类型"
          class="custom-input-width"
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

      <el-form-item label="别名">
        <div class="flex-column">
          <el-radio-group v-model="form.anotherName">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
          <div class="ideal-tip-text">
            将此记录集关联到一个华为云服务资源实例，与CNAME记录集相比，别名支持一级主域名。
          </div>
        </div>
      </el-form-item>

      <el-form-item label="线路类型" prop="lineType">
        <div class="flex-column">
          <el-select
            v-model="form.lineType"
            placeholder="请选择类型"
            class="custom-input-width"
          >
            <el-option
              v-for="(item, index) in lineTypeList"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <div class="ideal-tip-text">
            全网默认：<span>必选</span>。未匹配到已设置的线路时，会返回默认解析结果。<br />
            运营商线路：可选。根据访问用户所在运营商网络调度到最佳访问地址。<br />
            地域线路：可选。根据访问用户所处地理位置调度到最佳访问地址。<br />
          </div>
        </div>
      </el-form-item>

      <el-form-item label="TTL(秒)" prop="ttl">
        <el-input
          v-model="form.ttl"
          style="width: 70px"
          class="ideal-default-margin-right"
        ></el-input>
        <el-radio-group v-model="form.ttl">
          <el-radio-button
            v-for="(item, i) in timeOption"
            :key="i"
            :label="item.value"
          >
            {{ item.label }}
          </el-radio-button>
        </el-radio-group>
        <div class="ideal-tip-text">
          TTL指解析记录在本地DNS服务器的缓存时间。如果您的服务地址经常更换，建议TTL值设置相对小些，反之，建议设置相对大些
        </div>
      </el-form-item>

      <el-form-item label="值:" prop="value" class="value-container">
        <div class="flex-column">
          <el-input
            v-model="form.value"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 6 }"
            :placeholder="'例:\n192.168.10.10'"
            class="custom-input-width"
          ></el-input>
          <div class="ideal-tip-text">
            A记录：填写IPv4地址，最多可以输入50个不重复地址，每行一个。<br />
            例如：<br />
            192.168.10.10<br />
            172.16.100.100<br />
          </div>
        </div>
      </el-form-item>

      <el-form-item label="权重:" prop="weight">
        <el-input v-model="form.weight" class="custom-input-width"></el-input>
        <div class="ideal-tip-text">
          当域名在同一解析线路中有多条相同类型的解析记录时，可以通过“权重”设置解析记录集的响应比例。<el-text
            type="primary"
            style="font-weight: normal"
            >查看详情</el-text
          >
        </div></el-form-item
      >

      <el-form-item label="标签">
        <ideal-tag-multiple-select
          class="custom-input-width"
          @selectTag="selectTag"
        >
        </ideal-tag-multiple-select>
      </el-form-item>

      <el-form-item label="描述" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4 }"
          class="custom-input-width"
        >
        </el-input>
      </el-form-item>
    </el-form>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelForm(formRef)">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitForm(formRef)">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FormInstance } from 'element-plus'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()

const formRef = ref<FormInstance>()
const form = reactive({
  recordName: '',
  type: 'A', //类型
  anotherName: false,
  lineType: 'default',
  ttl: 300,
  value: [],
  weight: 1,
  remark: ''
})

const rules = reactive({
  recordName: [{ required: true, message: '请输入主机记录', trigger: 'blur' }]
})

const recordTypes = [
  { label: 'A-将域名指向IPv4地址', value: 'A' },
  { label: 'CANME-将域名指向另外一个域名', value: 'CANME' },
  { label: 'MX-将域名指向邮件服务器地址', value: 'MX' },
  { label: 'AAAA-将域名指向IPv6地址', value: 'AAAA' },
  { label: 'TXT-设置文本记录', value: 'TXT' }
]

const lineTypeList = [
  { label: '全网默认', value: 'default' },
  { label: '运营商线路解析', value: 'operator' },
  { label: '地域解析', value: 'territory' }
]

const timeOption = [
  { label: '5分钟', value: 300 },
  { label: '1小时', value: 3600 },
  { label: '12小时', value: 43200 },
  { label: '1天', value: 86400 }
]

const selectTag = () => {}

// 方法
interface EmitEvent {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EmitEvent>()
const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  emit(EventEnum.cancel)
}

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
}
</script>

<style scoped lang="scss">
.custom-input-width {
  width: 100%;
}
.ideal-tip-text {
  line-height: 20px;
  margin-top: 5px;
  span {
    font-weight: bold;
  }
}
:deep .el-radio-button__inner {
  width: 70px;
}
</style>
