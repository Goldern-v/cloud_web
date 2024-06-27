<template>
  <div class="ideal-large-margin allocation-rule-create">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
      class="allocation-rule-create-form"
    >
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" class="custom-input" />
      </el-form-item>

      <el-form-item label="描述" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          maxlength="100"
          show-word-limit
          class="custom-input"
        />
      </el-form-item>

      <el-form-item label="VDC" prop="vdc">
        <el-tree-select
          v-model="form.vdcId"
          :data="vdcTree"
          :render-after-expand="false"
          :props="defaultProps"
          class="custom-input"
          @change="changeVdc"
        />
      </el-form-item>

      <el-form-item label="优先级" prop="order">
        <div class="flex-column">
          <el-input-number v-model="form.order" :min="1"></el-input-number>
          <div class="ideal-tip-text">
            数据越小优先级越高，优先执行优先级高的规则
          </div>
        </div>
      </el-form-item>

      <el-form-item label="启用状态" prop="enabled">
        <el-switch
          v-model="form.enabled"
          :active-value="true"
          :inactive-value="false"
        />
      </el-form-item>

      <el-form-item label="生效资源池" prop="resourcePoolId">
        <el-select
          v-model="form.resourcePoolId"
          placeholder="请选择"
          multiple
          collapse-tags
          collapse-tags-tooltip
          class="custom-input"
        >
          <el-option
            v-for="(item, idx) of resourcePoolIds"
            :key="idx"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="计费项价格" prop="billPrice">
        <div class="flex-column" style="width: 60%">
          <div class="flex-row">
            <svg-icon
              icon="circle-add"
              class="ideal-svg-margin-right"
            ></svg-icon>
            <el-tooltip
              content="当前分摊比已达100%,不可继续添加规则"
              :disabled="allocationRatioTotal < 100"
              placement="right"
            >
              <el-button
                link
                :disabled="allocationRatioTotal >= 100"
                @click="clickAddRule"
                >新增规则</el-button
              >
            </el-tooltip>
          </div>

          <ideal-table-list
            :table-data="form.ruleList"
            :table-headers="tableHeaders"
            :show-pagination="false"
          >
            <template #costCenter>
              <el-table-column label="成本中心">
                <template #default="props">
                  <el-select
                    v-model="props.row.costId"
                    placeholder="请选择"
                    class="custom-input"
                  >
                    <el-option
                      v-for="(item, idx) of costCenterList"
                      :key="idx"
                      :label="item.name"
                      :disabled="item.disabled"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
            </template>

            <template #allocation>
              <el-table-column label="分摊方式%">
                <template #default="props">
                  <el-input-number
                    v-model="props.row.rate"
                    class="custom-input"
                    :min="1"
                    :max="100"
                    controls-position="right"
                  />
                </template>
              </el-table-column>
            </template>
            <template #operation>
              <el-table-column label="操作" width="185">
                <template #default="props">
                  <el-button
                    link
                    type="primary"
                    :disabled="form.ruleList.length < 2"
                    @click="clickDeleteRule(props.$index)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </template>
          </ideal-table-list>

          <div class="ideal-warning-text">
            当前费用分摊比例已达{{ allocationRatioTotal }}%, 剩余{{
              100 - allocationRatioTotal
            }}%待分配, 请完成分摊后保存
          </div>
        </div>
      </el-form-item>
    </el-form>

    <el-card>
      <div class="flex-row footer">
        <el-button type="primary" @click="submitForm(formRef)">{{
          t('save')
        }}</el-button>
        <el-button @click="cancelForm(formRef)">{{ t('back') }}</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus/es'
import type { IdealTableColumnHeaders } from '@/types'
import { nameRuleThree } from '@/utils/validate'
import {
  addAllocationRule,
  editAllocationRule,
  resourcePoolSelect,
  queryBillCostPage
} from '@/api/java/operate-center'
import { vdcTreeList } from '@/api/java/public'

const { t } = useI18n()

const formRef = ref<FormInstance>()
const form = reactive({
  name: '',
  remark: '',
  order: 1, // 优先级
  enabled: false,
  resourcePoolId: [], // 生效资源池
  ruleList: [{ costId: '', rate: null }] as any[], //计费规则列表
  code: '',
  vdcId: ''
})

onMounted(async () => {
  await getVdcTree()
  if (isEdit.value) {
    getEditData()
  }
})

const route = useRoute()
const isEdit = computed(() => route.query.type === 'edit') //是否编辑页面
// 行数据
const currentRow = ref<any>()
// 编辑渲染页面
const getEditData = () => {
  currentRow.value = JSON.parse(route.query.data as any)
  form.name = currentRow.value.name
  form.vdcId = currentRow.value.vdcId
  form.remark = currentRow.value.remark
  form.order = parseInt(currentRow.value.order)
  form.enabled = currentRow.value.enabled
  form.ruleList = currentRow.value.costRelationList
    ? currentRow.value.costRelationList
    : []
}

/**
 * 校验
 */
const checkName = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!value.length) {
    callback(new Error('请填写名称，不可为空'))
  }
  nameRuleThree({ maxLength: 20, minLength: 1 }, value, callback)
}
const checkVdc = (rule: any, value: any, callback: any) => {
  if (!form.vdcId) {
    return callback(new Error('请选择VDC'))
  } else {
    callback()
  }
}
const checkBillPrice = (rule: any, value: any, callback: any) => {
  if (!form.ruleList.length) {
    return callback(new Error('请至少添加一项计费项价格'))
  } else {
    let flag = form.ruleList.some((ele: any) => {
      return !ele.costId || !ele.rate
    })
    if (flag) {
      return callback(new Error('计费项价格数据不能为空'))
    } else if (allocationRatioTotal.value !== 100) {
      return callback(new Error('成本中心分摊比总额需为100%'))
    } else {
      callback()
    }
  }
}
const checkPool = (rule: any, value: any, callback: any) => {
  if (!form.resourcePoolId.length) {
    return callback(new Error('请选择资源池'))
  } else {
    callback()
  }
}
const rules = reactive<FormRules>({
  name: [{ required: true, validator: checkName, trigger: 'blur' }],
  vdc: [{ required: true, validator: checkVdc, trigger: 'blur' }],
  order: [{ required: true, message: '请选择优先级', trigger: 'blur' }],
  enabled: [{ required: true, message: '请选择启用状态', trigger: 'blur' }],
  resourcePoolId: [{ required: true, validator: checkPool, trigger: 'blur' }],
  billPrice: [{ required: true, validator: checkBillPrice, trigger: 'blur' }]
})

// VDC树
const vdcTree: Ref<any[]> = ref([])
const defaultProps = {
  children: 'sons',
  label: 'name',
  value: 'id'
}
watch(
  () => form.vdcId,
  vdcId => {
    queryCostCenter({ vdcId })
    getResourcePool({ vdcId })
  }
)
const changeVdc = () => {
  form.resourcePoolId = []
  form.ruleList = []
}
const getVdcTree = async () => {
  try {
    const res = await vdcTreeList()
    vdcTree.value = res.data.sons
  } catch (err: any) {
    ElMessage.error(err)
  }
}

// 查询资源池
const resourcePoolIds: any = ref([])
const getResourcePool = (params: any = {}) => {
  resourcePoolSelect(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        resourcePoolIds.value = data
        if (isEdit.value) {
          form.resourcePoolId = currentRow.value.resourcePoolIdList
            ? currentRow.value.resourcePoolIdList
            : []
        }
      } else {
        resourcePoolIds.value = []
      }
    })
    .catch(_ => {
      resourcePoolIds.value = []
    })
}

//查询成本中心
const costCenterList: any = ref([])
const queryCostCenter = (params: any) => {
  queryBillCostPage(params)
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        costCenterList.value = data
      } else {
        costCenterList.value = []
      }
    })
    .catch(_ => {
      costCenterList.value = []
    })
}

/**
 * 计费项规则
 */
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '成本中心', prop: 'costCenter', useSlot: true },
  { label: '分摊方式%', prop: 'allocation', useSlot: true }
]
const clickAddRule = () => {
  form.ruleList.push({ costId: '', rate: null })
} //添加规则
const clickDeleteRule = (index: number) => {
  form.ruleList.splice(index, 1)
} //删除规则
const allocationRatioTotal = ref(0) //分摊规则比总值

watch(
  () => form.ruleList,
  arr => {
    let total = 0
    arr.forEach((item: any) => {
      total += item.rate
      costCenterList.value.forEach((ele: any) => {
        ele.disabled = false
        ele.disabled = arr.some((item: any) => {
          return item.costId === ele.id
        })
      })
    })
    allocationRatioTotal.value = total
  },
  { deep: true, immediate: true }
)
/**
 * 保存和取消
 */
const router = useRouter()
const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  router.back()
}
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  const arr = form.ruleList.map(ele => {
    return {
      costId: ele.costId,
      rate: ele.rate
    }
  })
  const params: any = {
    name: form.name,
    remark: form.remark,
    enabled: form.enabled,
    resourcePoolIdList: form.resourcePoolId,
    order: form.order,
    vdcId: form.vdcId,
    costRelationList: arr
  }
  formEl.validate((valid: boolean) => {
    if (!valid) {
      return
    }
    if (isEdit.value) {
      params.id = currentRow.value.id
      editAllocationRule(params).then((res: any) => {
        let { code } = res
        if (code === 200) {
          ElMessage.success('编辑分摊规则成功')
          router.push({
            path: '/operate-center/billing-manage/allocation-rule/list'
          })
        } else {
          ElMessage.error('编辑分摊规则失败')
        }
      })
    } else {
      addAllocationRule(params).then((res: any) => {
        let { code } = res
        if (code === 200) {
          ElMessage.success('创建分摊规则成功')
          router.push({
            path: '/operate-center/billing-manage/allocation-rule/list'
          })
        } else {
          ElMessage.error('创建分摊规则失败')
        }
      })
    }
  })
}
</script>

<style scoped lang="scss">
$customInputWidth: 352px;
.allocation-rule-create {
  background-color: white;
  .allocation-rule-create-form {
    padding: 20px;
  }
  .footer {
    justify-content: flex-start;
    align-items: center;
  }
  :deep(.el-card) {
    border: none;
    border-radius: 0;
  }
  :deep(.el-card.is-always-shadow) {
    box-shadow: 0 2px 4px 2px $sub5-light !important;
  }
  .custom-input {
    width: $formInputWidth;
  }
}
</style>
