<template>
  <div class="create">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-card>
        <el-form-item label="复制桶配置">
          <div>
            <el-button @click="clickCopy">选择源桶</el-button>
            <div class="ideal-tip-text">
              该项可选。选择后可复制源桶的以下配置信息：区域 / 数据冗余策略 /
              存储类别 / 桶策略 / 默认加密 / 归档数据直读 / 企业项目 / 标签。
            </div>
          </div>
        </el-form-item>

        <el-form-item label="区域">
          <div>
            <div>{{ form.regionName }}</div>
            <div class="ideal-tip-text">
              不同区域的资源之间内网互不相通，请选择靠近您业务的区域，可以降低网络时延，提高访问速度。桶创建成功后不支持变更区域，请谨慎选择。
            </div>
          </div>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="桶名称">
          <div>
            <el-input v-model="form.name" />
            <div class="flex-row">
              <div class="ideal-tip-text ideal-default-margin-right">不能和本用户已有桶重名</div>

              <div class="ideal-tip-text ideal-default-margin-right">
                不能和其他用户已有的桶重名
              </div>

              <div class="ideal-tip-text">创建成功后不支持修改</div>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="数据冗余存储策略">
          <div>
            <div class="flex-row">
              <el-radio-group v-model="form.redundancy" class="ideal-default-margin-right">
                <el-radio-button
                  v-for="(item, index) of redundancies"
                  :key="index"
                  :label="item.label"
                >
                  {{ item.value }}
                </el-radio-button>
              </el-radio-group>

              <div>启用后不支持修改。 多AZ存储采用相对较高计费标准。</div>
            </div>

            <div v-if="form.redundancy === 'more'" class="ideal-tip-text">
              数据在同区域的多个AZ中存储，可用性更高。
            </div>
          </div>
        </el-form-item>

        <el-form-item label="默认存储类别">
          <div style="width: 100%">
            <storage-class :type="form.redundancy" />
            <div class="ideal-tip-text">
              创建桶时选择的存储类别会作为上传对象的默认存储类别。
            </div>
          </div>
        </el-form-item>

        <el-form-item label="桶策略">
          <div>
            <el-radio-group v-model="form.bucketPolicy" class="ideal-default-margin-right">
              <el-radio-button
                v-for="(item, index) of bucketPolicies"
                :key="index"
                :label="item.label"
                :disabled="!form.bucket && index === 3"
              >
                <el-tooltip
                  :disabled="!form.bucket && index !== 3"
                  class="box-item"
                  effect="dark"
                  content="请先选择一个桶作为复制源"
                  placement="top"
                >
                  {{ item.value }}
                </el-tooltip>
              </el-radio-button>
            </el-radio-group>

            <div v-if="form.bucketPolicy === 'private'" class="ideal-tip-text">
              桶的拥有者拥有完全控制权限，其他用户在未经授权的情况下均无访问权限。
            </div>
            <div
              v-else-if="form.bucketPolicy === 'read'"
              class="ideal-error-text"
            >
              任何用户都可以对桶内对象进行读操作，仅桶拥有者可以进行写操作。
            </div>
            <div
              v-else-if="form.bucketPolicy === 'readWrite'"
              class="ideal-error-text"
            >
              任何用户都可以对桶内对象进行读/写/删除操作。
            </div>
          </div>
        </el-form-item>

        <el-form-item label="归档数据直读">
          <div>
            <el-radio-group v-model="form.directRead" class="ideal-default-margin-right">
              <el-radio-button
                v-for="(item, index) of directReads"
                :key="index"
                :label="item.label"
              >
                {{ item.value }}
              </el-radio-button>
            </el-radio-group>

            <div v-if="form.directRead === 'open'" class="ideal-tip-text">
              通过归档数据直读，您可以直接下载存储类别为归档存储的数据，而无需提前恢复。归档数据直读会收取相应的费用。
            </div>
            <div v-else class="ideal-tip-text">
              关闭归档直读，归档存储类别的数据要先恢复才能访问。归档存储数据恢复和访问会收取相应的费用。
            </div>
          </div>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="服务端加密">
          <div>
            <el-radio-group v-model="form.encrypt" class="ideal-default-margin-right">
              <el-radio-button
                v-for="(item, index) of encrypts"
                :key="index"
                :label="item.label"
              >
                {{ item.value }}
              </el-radio-button>
            </el-radio-group>

            <div v-if="form.encrypt === 'onOpen'" class="ideal-tip-text">
              开启默认加密后，上传到当前桶的对象会默认加密。您也可以在桶创建完成之后在桶概览页面调整默认加密配置。
            </div>
            <div v-else-if="form.encrypt === 'sseKms'" class="ideal-tip-text">
              SSE-KMS加密模式会使用您在KMS服务中托管的加密密钥加密。
            </div>
            <div v-else class="ideal-tip-text">
              SSE-OBS加密模式使用OBS服务创建和管理的密钥加密。
            </div>
          </div>
        </el-form-item>

        <el-form-item v-if="form.encrypt === 'sseKms'" label="加密密钥类型">
          <div>
            <el-radio-group v-model="form.keyType" class="ideal-default-margin-right">
              <el-radio-button
                v-for="(item, index) of keyTypes"
                :key="index"
                :label="item.label"
              >
                {{ item.value }}
              </el-radio-button>
            </el-radio-group>

            <div v-if="form.keyType === 'default'" class="ideal-tip-text">
              您上传的对象将使用当前区域的默认密钥进行加密，如果您没有默认密钥，系统将会在首次上传对象时自动为您创建。
            </div>
            <div v-else class="ideal-tip-text">
              您上传的对象将默认采用以下密钥进行加密。
            </div>
          </div>
        </el-form-item>

        <el-form-item
          v-if="form.encrypt === 'sseKms' && form.keyType === 'custom'"
          label="自定义密钥"
        >
          <el-select
            v-model="form.customKey"
            clearable
            placeholder="选择"
            :popper-append-to-body="false"
            class="custom-input ideal-default-margin-right"
          >
            <el-option
              v-for="item of customKeys"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="标签">
          <tag />
        </el-form-item>
      </el-card>
    </el-form>

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>

    <price-info />
  </div>
</template>

<script setup lang="ts">
import dialogBox from './dialog-box.vue'
import storageClass from './components/storage-class.vue'
import tag from './components/tag.vue'
import priceInfo from './components/price-info.vue'
import type { FormRules, FormInstance } from 'element-plus'
import { OperateEventEnum } from '@/utils/enum'
import store from '@/store'

const { resourcePoolInfo, regionInfo } = storeToRefs(store.resourceStore)
onBeforeMount(() => {
  if (store.resourceStore) {
    store.resourceStore.$subscribe(async (mutations: any, state: any) => {
      form.regionName = state?.regionInfo?.name
    })
  }
})

onMounted(async () => {
  // 右上角资源池区域是否选择
  if (regionInfo.value && resourcePoolInfo.value) {
    form.regionName = regionInfo.value.name
  }
})

const formRef = ref<FormInstance>()
const form = reactive({
  bucket: '', // 桶
  regionName: '', // 区域
  name: '', // 桶名称
  redundancy: 'more', // 数据冗余存储策略
  storageClass: '', // 默认存储类别
  bucketPolicy: 'private', // 桶策略
  directRead: 'open', // 归档数据直读
  encrypt: 'onOpen', // 服务端加密
  keyType: 'default', // 加密密钥类型
  customKey: '' // 自定义密钥
})
const rules = reactive<FormRules>({
  // name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
})
const clickCopy = () => {
  showDialog.value = true
  dialogType.value = OperateEventEnum.copy
}
// 数据冗余存储策略
const redundancies = [
  { label: 'more', value: '多AZ存储' },
  { label: 'single', value: '单AZ存储' }
]
// 桶策略
const bucketPolicies = [
  { label: 'private', value: '私有' },
  { label: 'read', value: '公共读' },
  { label: 'readWrite', value: '公共读写' },
  { label: 'copy', value: '复制桶策略' }
]
// 归档数据直读
const directReads = [
  { label: 'open', value: '开启' },
  { label: 'close', value: '关闭' }
]
// 服务端加密
const encrypts = [
  { label: 'onOpen', value: '不开启加密' },
  { label: 'sseKms', value: 'SSE-KMS' },
  { label: 'sseObs', value: 'SSE-OBS' }
]
// 加密密钥类型
const keyTypes = [
  { label: 'default', value: '默认密钥' },
  { label: 'custom', value: '自定义密钥' }
]
// 自定义密钥
const customKeys = ref<any[]>([])
// 监听桶策略
watch(
  () => form.bucketPolicy,
  value => {
    if (value === 'read') {
      showDialog.value = true
      dialogType.value = 'read'
    } else if (value === 'readWrite') {
      showDialog.value = true
      dialogType.value = 'readWrite'
    }
  }
)
// 弹框
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  form.bucketPolicy = 'private'
  resetDialog()
}
const clickRefreshEvent = () => {
  resetDialog()
}
// 重置弹框
const resetDialog = () => {
  showDialog.value = false
  dialogType.value = ''
}
</script>

<style scoped lang="scss">
.create {
  margin: $idealMargin $idealMargin 80px;
  :deep(.el-form) {
    padding: 0;
  }
  :deep(.el-card__body) {
    padding: 20px 20px 0;
  }
}
</style>
