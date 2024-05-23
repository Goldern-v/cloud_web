<template>
  <div class="allocate-strategy">
    <el-form
      ref="basicInfoRef"
      :model="form"
      :rules="rules"
      label-position="left"
    >
      <el-card>
        <el-form-item label="后端服务器组" prop="serverGroup">
          <div class="flex-column">
            <el-radio-group v-model="form.serverGroup">
              <el-radio-button
                v-for="(item, index) of serverGroupList"
                :key="index"
                :label="item.label"
                >{{ item.name }}</el-radio-button
              >
            </el-radio-group>
          </div>
        </el-form-item>

        <el-form-item label="名称" prop="name">
          <el-input
            v-model.trim="form.name"
            placeholder="请输入名称"
            class="custom-input"
          />
        </el-form-item>

        <el-form-item label="后端协议" prop="protocol">
          <el-select v-model="form.protocol">
            <el-option
              v-for="(item, index) in protocolList"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="分配策略类型" prop="type">
          <div class="flex-column">
            <el-radio-group v-model="form.type">
              <el-radio-button
                v-for="(item, index) of typeList"
                :key="index"
                :label="item.label"
                >{{ item.name }}</el-radio-button
              >
            </el-radio-group>
          </div>
        </el-form-item>

        <el-form-item label="会话保持">
          <div class="flex-column">
            <span>
              <el-switch v-model="form.session" class="ideal-default-margin-right"></el-switch>
              <el-tooltip
                popper-class="custom-tooltip"
                effect="dark"
                content=""
                placement="right"
              >
                <svg-icon icon="question-icon"></svg-icon>
              </el-tooltip>
            </span>
          </div>
        </el-form-item>

        <el-form-item label="描述" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder="请输入描述"
            class="custom-input"
          >
          </el-input>
        </el-form-item>
      </el-card>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { generateCode } from '@/utils/tool'

const form = reactive({
  serverGroup: 'new',
  name: 'server-group-' + generateCode(4), // vpc名称
  protocol: 'TCP',
  type: 'weighted-polling',
  session: false,
  remark: ''
})

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  port: [{ required: true, message: '端口不可为空', trigger: 'blur' }],
  subnetName: [{ required: true, message: '请输入子网名称', trigger: 'blur' }]
})

const serverGroupList = [
  { name: '新创建', label: 'new' },
  { name: '使用已有', label: 'exit' }
]
const protocolList = ['TCP', 'UDP', 'HTTP', 'HTTPS']
const typeList = [
  { name: '加权轮询算法', label: 'weighted-polling' },
  { name: '加权最少连接', label: 'least-weighted' },
  { name: '源IP算法', label: 'source-ip' }
]
const controlList: any = []
</script>

<style scoped lang="scss">
.allocate-strategy {
  width: 100%;
  :deep(.el-form) {
    padding: 0;
  }
}
.custom-input {
  width: $formInputWidth;
}
</style>
