<template>
  <div class="ideal-large-margin role-create">
    <collapse-layout :slot-names="collapseActiveNames" style="height: 100%">
      <template #basicInfo>
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="left"
          style="padding: 20px 20px 10px"
        >
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" class="custom-input" />
          </el-form-item>

          <el-form-item label="角色类别" prop="category">
            <el-select
              v-model="form.category"
              placeholder="请选择角色类别"
              class="custom-input"
              :disabled="isEdit"
              @change="categoryChange"
            >
              <el-option
                v-for="(item, idx) of categoryList"
                :key="idx"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="继承角色">
            <el-select
              v-model="form.inherit"
              placeholder="请选择继承角色"
              class="custom-input"
              :disabled="isEdit"
              clearable
              @change="inheritChange"
            >
              <el-option
                v-for="(item, idx) of inheritRoleList"
                :key="idx"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="描述">
            <el-input
              v-model="form.remark"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              placeholder="请输入描述"
              class="custom-input"
            />
          </el-form-item>
        </el-form>
      </template>

      <template #permissionConfig>
        <permission-config
          ref="permissionConfigRef"
          :limits="inheritRoleLimits"
          :form-info="form"
          :form-ref="formRef"
        ></permission-config>
      </template>
    </collapse-layout>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import collapseLayout from './components/collapse-layout.vue'
import permissionConfig from './components/permission-config.vue'
import { nameRuleThree } from '@/utils/validate'
import {
  queryRoleClassify,
  queryRoleList,
  queryRoleLimits,
  queryRoleConfigTemplate
} from '@/api/java/business-center'

const formRef = ref<FormInstance>()
const route = useRoute()
const detailInfo: any = ref({}) //路由传参
const isEdit = route.query.type === 'edit' //是否编辑模式
const collapseActiveNames = ref([
  { name: 'basicInfo', title: '基础信息' },
  { name: 'permissionConfig', title: '权限配置' }
])

const checkName = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!value.length) {
    callback(new Error('请填写名称，不可为空'))
  }
  nameRuleThree({ maxLength: 20, minLength: 1 }, value, callback)
}
const form = reactive({
  name: '',
  category: '',
  inherit: '',
  remark: ''
})

const rules = reactive<FormRules>({
  name: [{ required: true, validator: checkName, trigger: 'blur' }],
  category: [{ required: true, message: '请选择角色类别', trigger: 'blur' }]
})

onMounted(() => {
  if (isEdit) {
    detailInfo.value = JSON.parse(route.query.detail as any)
    form.name = detailInfo.value.name
    form.remark = detailInfo.value.remark
  }
  getRoleClassify()
})
//查询角色类别
const categoryList: any = ref([])
const getRoleClassify = () => {
  queryRoleClassify().then((res: any) => {
    const { data, code } = res
    if (code === 200) {
      categoryList.value = data
      if (isEdit) {
        form.category = detailInfo.value.roleType
        getRoleList(form.category)
      }
    } else {
      categoryList.value = []
    }
  })
}
const categoryChange = (value: any) => {
  form.inherit = ''
  getRoleList(value)
}
//查询继承角色
const inheritRoleList: any = ref([])
const getRoleList = (val: string) => {
  queryRoleList({ roleType: val }).then((res: any) => {
    const { data, code } = res
    if (code === 200) {
      inheritRoleList.value = data
      if (isEdit) {
        form.inherit = detailInfo.value.pid
        getRoleLimits(detailInfo.value.id)
      }
    } else {
      inheritRoleList.value = []
    }
  })
}
//查询角色权限
const inheritRoleLimits = reactive({
  buttonList: [],
  menuList: []
})
const getRoleLimits = (val: string) => {
  queryRoleLimits({ roleId: val }).then((res: any) => {
    const { data, code } = res
    if (code === 200) {
      inheritRoleLimits.buttonList = data.buttonIdList
      inheritRoleLimits.menuList = data.menuIdList
    } else {
      inheritRoleLimits.buttonList = []
      inheritRoleLimits.menuList = []
    }
  })
}
const inheritChange = (value: any) => {
  if (value) {
    getRoleLimits(value)
  } else {
    inheritRoleLimits.buttonList = []
    inheritRoleLimits.menuList = []
  }
}
</script>

<style scoped lang="scss">
.role-create {
  height: 100%;
  .custom-input {
    width: 400px;
  }
}
</style>
