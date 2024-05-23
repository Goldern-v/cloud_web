<template>
  <div class="high-config">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-card>
        <el-form-item label="云服务器名称" prop="cloudHostName">
          <div class="flex-column" style="width: 100%">
            <div class="flex-row">
              <el-input
                v-model="form.cloudHostName"
                class="ideal-default-margin-right custom-input"
              />
              <el-checkbox v-model="form.duplication" label="允许重名" />
            </div>
            <div class="flex-row">
              <div class="ideal-tip-text">
                购买多台云服务器时，支持自动增加数字后缀命名或者自定义规则命名。
              </div>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="描述">
          <el-input
            v-model="form.description"
            type="textarea"
            show-word-limit
            maxlength="150"
            style="width: 50%"
          />
        </el-form-item>

        <el-form-item label="登录凭证">
          <div class="flex-column">
            <el-radio-group v-model="form.loginCredentials" class="ideal-default-margin-right">
              <el-radio-button
                v-for="(item, index) of state.loginCredentialsList"
                :key="index"
                :label="item.value"
              >
                {{ item.label }}
              </el-radio-button>
            </el-radio-group>

            <div
              v-if="form.loginCredentials === '2'"
              class="ideal-warning-text"
            >
              请妥善保管密钥对的私钥文件，登录、重装和切换云服务器操作系统时，均需要使用该文件。
            </div>
            <div v-if="form.loginCredentials === '3'" class="ideal-error-text">
              您在登录云服务器前，需要先通过重置密码的方式设置密码。
            </div>
          </div>
        </el-form-item>

        <el-form-item v-if="form.loginCredentials === '1'" label="用户名">
          <div>root</div>
        </el-form-item>

        <el-form-item
          v-if="form.loginCredentials === '1'"
          label="密码"
          prop="securityCode"
        >
          <div class="flex-column" style="width: 100%">
            <el-input
              v-model="form.securityCode"
              class="custom-input"
              show-password
              autocomplete="new-password"
            />
            <div>请牢记密码，如忘记密码可登录ECS控制台重置密码。</div>
          </div>
        </el-form-item>

        <el-form-item
          v-if="form.loginCredentials === '1'"
          label="确认密码"
          prop="againSecurityCode"
        >
          <el-input
            v-model="form.againSecurityCode"
            class="custom-input"
            show-password
            autocomplete="new-password"
          />
        </el-form-item>

        <el-form-item v-if="form.loginCredentials === '2'" label="密钥对">
          <el-select
            v-model="form.keyPair"
            placeholder="请选择密钥对"
            class="ideal-default-margin-right"
            style="width: 20%"
          >
            <el-option
              v-for="item in state.keyPairList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
          <svg-icon
            icon="refresh-icon"
            style="cursor: pointer"
            class="ideal-svg-margin-right"
            @click="clickRefreshKeyPair"
          ></svg-icon>
          <el-tooltip
            popper-class="custom-tooltip"
            effect="dark"
            content="密钥对"
            placement="right"
          >
            <svg-icon icon="question-icon"></svg-icon>
          </el-tooltip>
        </el-form-item>
      </el-card>

      <el-card v-if="isPublicHuawei" class="ideal-large-margin-top">
        <el-form-item label="云备份">
          <div class="flex-column">
            <div class="flex-row">
              <el-radio-group v-model="form.cloudBackup" class="ideal-default-margin-right">
                <el-radio-button
                  v-for="(item, index) of state.cloudBackupList"
                  :key="index"
                  :label="item.value"
                >
                  {{ item.label }}
                </el-radio-button>
              </el-radio-group>
            </div>

            <div class="ideal-tip-text">
              使用云备份服务，需购买备份存储库，存储库是存放服务器产生的备份副本的容器。
            </div>
          </div>
        </el-form-item>

        <el-form-item
          v-if="form.cloudBackup === '1'"
          label="云备份存储库名称"
          prop="cloudBackupRepositoryName"
        >
          <el-input
            v-model="form.cloudBackupRepositoryName"
            class="custom-input"
          />
        </el-form-item>

        <el-form-item v-if="form.cloudBackup === '1'" label="云备份存储库容量">
          <div class="flex-column">
            <div class="flex-row">
              <el-input-number
                v-model="form.repositorySize"
                class="ideal-default-margin-right"
                :min="30"
              />

              <el-select
                v-model="form.repositoryUnit"
                placeholder="请选择"
                class="custom-input"
              >
                <el-option
                  v-for="(item, idx) of state.cloudBackupRepositoryUnit"
                  :key="idx"
                  :label="item.label"
                  :value="item.label"
                />
              </el-select>
            </div>

            <div>为了保证连续性，建议存储库空间不小于备份服务器空间。</div>
          </div>
        </el-form-item>

        <el-form-item v-if="form.cloudBackup === '2'" label="云备份存储库">
          <el-select
            v-model="form.cloudBackupRepository"
            placeholder="请选择"
            class="custom-input ideal-default-margin-right"
          >
            <el-option
              v-for="item in state.backupRepositoryList"
              :key="item.uuid"
              :label="item.name"
              :value="item.uuid"
            />
          </el-select>

          <svg-icon
            icon="refresh-icon"
            style="cursor: pointer"
            @click="clickRefreshRepository"
          ></svg-icon>
        </el-form-item>

        <el-form-item
          v-if="form.cloudBackup === '1' || form.cloudBackup === '2'"
          label="备份策略"
        >
          <div class="flex-column" style="width: 100%">
            <div class="flex-row">
              <el-select
                v-model="form.backupPolicy"
                placeholder="请选择"
                class="custom-input ideal-default-margin-right"
              >
                <el-option
                  v-for="item of state.backupPolicyList"
                  :key="item.uuid"
                  :label="item.name"
                  :value="item.uuid"
                />
              </el-select>

              <svg-icon
                icon="refresh-icon"
                style="cursor: pointer"
                @click="clickRefreshPolicy"
              ></svg-icon>
            </div>

            <div class="ideal-tip-text">
              如需创建或修改备份策略，请前往<span
                style="color: var(--el-color-primary)"
                >云备份控制台</span
              >进行操作，操作后请单击刷新按钮同步备份策略。
            </div>
          </div>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="云监控">
          <div class="flex-column">
            <div class="flex-row">
              <el-checkbox v-model="form.detailMonitor" label="开启详情监控" />
            </div>
            <div class="ideal-tip-text">
              开启对云服务器CPU，内存，网络，磁盘，进程等指标的1分钟详细监控
            </div>
          </div>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="云服务器组(可选)">
          <div class="flex-column flex-column-starts" style="width: 100%">
            <div class="flex-row">
              <el-radio-group v-model="form.cloudGroupType" class="ideal-default-margin-right">
                <el-radio-button
                  v-for="(item, index) of cloudGroupList"
                  :key="index"
                  :label="item.value"
                >
                  {{ item.label }}
                </el-radio-button>
              </el-radio-group>
            </div>

            <div class="flex-row ideal-large-margin-top flex-row-start-center">
              <el-select
                v-model="form.cloudHostGroup"
                placeholder="请选择"
                class="custom-input"
              >
                <el-option
                  v-for="item of state.cloudHostGroups"
                  :key="item.uuid"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <svg-icon
                icon="refresh-icon"
                style="cursor: pointer"
                class="ideal-svg-margin-left"
                @click="clickRefreshCloudGroup"
              ></svg-icon>
            </div>

            <div>新建云服务器组</div>
          </div>
        </el-form-item>
      </el-card>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { useHigh } from './high-config'
import { IHooksHigh } from './interface'
import { generateCode } from '@/utils/tool'
import { nameRuleOne, passwordRule } from '@/utils/validate'
import { useResourcePool } from '@/utils/common/resource'

const { isPublicHuawei } = useResourcePool()

const formRef = ref<FormInstance>()
// 表单
const form = reactive({
  resourceId: '',
  regionId: '',
  cloudHostName: 'ecs-' + generateCode(4), // 云服务器名称
  duplication: false, // 允许重名
  description: '', // 描述
  loginCredentials: '1', // 登录凭证
  loginCredentialsName: '密码', // (供确认配置界面使用)
  keyPair: '', // 密钥对
  securityCode: '', // 密码
  againSecurityCode: '',
  cloudBackup: '1', // 云备份
  cloudBackupRepository: '', // 云备份存储库
  cloudBackupRepositoryName: '', // 云备份存储库名称
  repositorySize: 1, // 云备份存储库容量
  repositoryUnit: 'GB', // 云备份存储库单位
  backupPolicy: '', // 备份策略
  backupPolicyInfo: '', // 备份策略(供确认配置界面使用)
  detailMonitor: false, // 开启详情监控
  cloudGroupType: '1', // 云服务器组选择
  cloudHostGroup: '', // 云服务器组
  cloudGroupTypeInfo: '' // 云服务器组(供确认配置界面使用)
})
const checkName = (rule: any, value: any, callback: (e?: Error) => any) => {
  const reg = /(\-)*(\-)\2/g
  if (reg.test(value)) {
    callback(new Error('不能连续输入连字符--'))
  }
  rule.minLength = 2
  rule.maxLength = 15
  nameRuleOne(rule, value, callback)
}

const checkPwd = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!value) {
    callback(new Error('请输入密码'))
  }
  rule.minLength = 8
  rule.maxLength = 26
  passwordRule(rule, value, callback)
}
const checkAgainPwd = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!value) {
    callback(new Error('请输入确认密码'))
  }
  if (form.securityCode !== form.againSecurityCode) {
    callback(new Error('输入密码不一致！'))
  }
  rule.minLength = 8
  rule.maxLength = 26
  passwordRule(rule, value, callback)
}
const rules = reactive<FormRules>({
  cloudHostName: [{ required: true, validator: checkName, trigger: 'blur' }],
  securityCode: [{ required: true, validator: checkPwd, trigger: 'blur' }],
  againSecurityCode: [
    { required: true, validator: checkAgainPwd, trigger: 'blur' }
  ],
  cloudBackupRepositoryName: [
    { required: true, message: '请输入云备份存储库名称', trigger: 'blur' }
  ]
})

const state: IHooksHigh = reactive({
  form
})
const {
  clickRefreshKeyPair,
  clickRefreshRepository,
  clickRefreshPolicy,
  clickRefreshCloudGroup
} = useHigh(state)

const cloudGroupList: any = [{ label: '反亲和性', value: '1' }]

defineExpose({
  formRef,
  form
})
</script>

<style scoped lang="scss">
.high-config {
  width: 100%;
  :deep(.el-form) {
    padding: 0;
  }
  .flex-column-start {
    justify-content: flex-start;
    align-items: flex-start;
  }
  .flex-row-start-center {
    justify-content: flex-start;
    align-items: center;
  }
  .custom-input {
    width: 20%;
  }
  :deep(.el-card__body) {
    padding: 20px 20px 0;
  }
}
</style>
<style lang="scss">
.custom-tooltip {
  max-width: 260px;
}
</style>
