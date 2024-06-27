<template>
  <div class="ideal-large-margin price-model-create">
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
      class="price-model-create-form"
    >
      <el-form-item>
        <div class="flex-row ideal-header-container">
          <el-divider direction="vertical" />
          <div>基本信息</div>
        </div>
      </el-form-item>

      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" class="custom-input" />
      </el-form-item>

      <el-form-item label="云平台类别" prop="cloudCategory">
        <el-select
          v-model="form.cloudCategory"
          placeholder="请选择"
          class="custom-input"
        >
          <el-option
            v-for="(item, idx) of cloudPlatformCategory"
            :key="idx"
            :label="item.name"
            :value="item.cloudCategory"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="云平台类型" prop="cloudType">
        <el-select
          v-model="form.cloudType"
          placeholder="请选择"
          class="custom-input"
        >
          <el-option
            v-for="(item, idx) of cloudPlatformTypes"
            :key="idx"
            :label="item.name"
            :value="item.cloudType"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="云平台" prop="platform">
        <el-select
          v-model="form.platform"
          placeholder="请选择"
          class="custom-input"
        >
          <el-option
            v-for="(item, idx) of platformList"
            :key="idx"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="资源池" prop="resourcePool">
        <el-select
          v-model="form.resourcePool"
          placeholder="请选择"
          class="custom-input"
        >
          <el-option
            v-for="(item, idx) of resourcePools"
            :key="idx"
            :label="item.name"
            :disabled="item.id !== 'all'"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="启用状态" prop="enabled">
        <el-switch v-model="form.enabled" />
      </el-form-item>

      <el-form-item>
        <div class="flex-row ideal-header-container">
          <el-divider direction="vertical" />
          <div>计费规则</div>
        </div>
      </el-form-item>

      <el-form-item label="费用类型" prop="costType">
        <el-select
          v-model="form.costType"
          placeholder="请选择"
          class="custom-input"
        >
          <el-option
            v-for="(item, idx) of costTypeList"
            :key="idx"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="计费模式" prop="billingMode">
        <el-select
          v-model="form.billingMode"
          placeholder="请选择"
          class="custom-input"
          @change="modeChange"
        >
          <el-option
            v-for="(item, idx) of billingModeList"
            :key="idx"
            :label="item.label"
            :value="item.value"
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
            <el-tooltip :disabled="form.costType" content="请先选择费用类型">
              <el-button
                link
                type="primary"
                :disabled="!form.costType"
                @click="clickAddCostItem"
                >添加计费项</el-button
              >
            </el-tooltip>
          </div>

          <ideal-table-list
            :table-data="form.billItems"
            :table-headers="tableHeaders"
            :show-pagination="false"
          >
            <template #price>
              <el-table-column label="价格">
                <template #default="props">
                  <p v-for="(item, index) of props.row.priceText" :key="index">
                    {{ item }}
                  </p>
                </template>
              </el-table-column>
            </template>
            <template #operation>
              <el-table-column label="操作" width="120">
                <template #default="props">
                  <svg-icon
                    icon="delete-icon"
                    @click="clickDeleteChargeItem(props.$index)"
                  ></svg-icon>
                </template>
              </el-table-column>
            </template>
          </ideal-table-list>
        </div>
      </el-form-item>

      <el-form-item label="周期" prop="cycle">
        <el-select
          v-model="form.cycle"
          placeholder="请选择"
          class="custom-input"
        >
          <el-option
            v-for="(item, idx) of cycleList"
            :key="idx"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="打折系数">
        <div v-if="!billDemand" class="flex-column price-model-create-discount">
          <el-button link type="primary" @click="clickAddDiscount">
            <svg-icon
              icon="circle-add"
              class="ideal-svg-margin-right"
            ></svg-icon>
            添加一条
          </el-button>

          <ideal-table-list
            :table-data="discountData"
            :table-headers="discountHeaders"
            :show-pagination="false"
          >
            <template #startMonth>
              <el-table-column label="起始月">
                <template #default="props">
                  <el-input
                    v-model="props.row.start"
                    type="number"
                    :min="0"
                    placeholder="请输入起始的月数量"
                  />
                </template>
              </el-table-column>
            </template>
            <template #endMonth>
              <el-table-column label="结束月">
                <template #default="props">
                  <el-input
                    v-model="props.row.end"
                    type="number"
                    :min="0"
                    placeholder="请输入结束的月数量"
                  />
                </template>
              </el-table-column>
            </template>

            <template #discountRate>
              <el-table-column label="折扣比">
                <template #default="props">
                  <div class="flex-row" style="align-items: center">
                    <el-input v-model="props.row.discount" type="number" />
                    <span style="margin-left: 5px">%</span>
                  </div>
                </template>
              </el-table-column>
            </template>

            <template #operation>
              <el-table-column label="操作" width="120">
                <template #default="props">
                  <svg-icon
                    icon="delete-icon"
                    @click="clickDeleteDiscount(props.$index)"
                  ></svg-icon>
                </template>
              </el-table-column>
            </template>
          </ideal-table-list>
          <div class="ideal-warning-text">
            阶梯折扣系数最后一组的结束数值应设为空,表示上限
          </div>
        </div>

        <div v-else>
          <el-input
            v-model="form.discount"
            class="custom-input"
            type="number"
          />
          <span style="margin-left: 5px">%</span>
        </div>
      </el-form-item>

      <el-form-item>
        <div class="flex-row ideal-header-container">
          <el-divider direction="vertical" />
          <div>结算周期</div>
        </div>
      </el-form-item>

      <el-form-item label="频率" prop="frequency">
        <el-select
          v-model="form.frequency"
          placeholder="请选择"
          class="custom-input"
        >
          <el-option
            v-for="(item, idx) of frequencyList"
            :key="idx"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
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

    <dialog-box
      v-if="showDialog"
      :type="dialogType"
      :const-type="form.costType"
      :exit-charge-item="form.billItems"
      @clickCloseEvent="clickCloseEvent"
      @clickRefreshEvent="clickRefreshEvent"
    ></dialog-box>
  </div>
</template>

<script setup lang="ts">
import dialogBox from './dialog-box.vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus/es'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import { OperateEventEnum, BillingEnum } from '@/utils/enum'
import type { IdealTableColumnHeaders } from '@/types'
import { nameRuleThree } from '@/utils/validate'
import { resourcePoolGrade } from '@/api/java/public'
import {
  expenseTypeList,
  billItems,
  addBillPrice,
  editBillPrice
} from '@/api/java/operate-center'

const { t } = useI18n()
/*
 *表单
 */
const formRef = ref<FormInstance>()
const form = reactive({
  name: '', // 名称
  cloudCategory: '', //云平台类别
  cloudType: '', // 云平台类型
  platform: '', // 云平台
  resourcePool: '', // 资源池
  enabled: false, // 启用状态
  costType: '', // 费用类型
  billingMode: '', // 计费模式
  cycle: '', // 周期
  discount: '', // 打折系数
  frequency: '', // 频率
  billItems: [] as any[]
})

const checkName = (rule: any, value: any, callback: (e?: Error) => any) => {
  if (!value.length) {
    callback(new Error('请填写名称，不可为空'))
  }
  nameRuleThree({ maxLength: 20, minLength: 1 }, value, callback)
}
const checkBillPrice = (
  rule: any,
  value: any,
  callback: (e?: Error) => any
) => {
  if (!form.billItems.length) {
    callback(new Error('计费项价格不可为空，请至少添加一项'))
  } else {
    callback()
  }
}
const rules = reactive<FormRules>({
  name: [{ required: true, validator: checkName, trigger: 'blur' }],
  cloudType: [{ required: true, message: '请选择云平台类型', trigger: 'blur' }],
  platform: [{ required: true, message: '请选择云平台', trigger: 'blur' }],
  resourcePool: [
    { required: true, message: '请选择资源池', trigger: 'change' }
  ],
  enabled: [{ required: true, message: '请选择启用状态', trigger: 'blur' }],
  costType: [{ required: true, message: '请选择费用类型', trigger: 'blur' }],
  billingMode: [{ required: true, message: '请选择计费模式', trigger: 'blur' }],
  cycle: [{ required: true, message: '请选择周期', trigger: 'blur' }],
  frequency: [{ required: true, message: '请选择频率', trigger: 'blur' }],
  billPrice: [{ required: true, validator: checkBillPrice, trigger: 'blur' }]
})

const billingModeList: any = [
  { label: '包年/包月', value: BillingEnum.PACKAGE },
  { label: '按需', value: BillingEnum.ON_DEMAND }
]
const modeChange = () => {
  form.cycle = '' //切换计费模式时周期清空数据
}
const frequencyList: any = [{ label: '天', value: 'DAY' }]

const billDemand = computed(() => form.billingMode === BillingEnum.ON_DEMAND) //是否按需计费

const route = useRoute()
const isEdit = computed(() => route.query.type === 'edit') //是否编辑页面
onMounted(() => {
  getCloudTypes()
  getExpenseType()
  if (isEdit.value) {
    getEditData()
  }
})
// 编辑时渲染页面
const currentRow = ref<any>() // 行数据
const getEditData = () => {
  currentRow.value = JSON.parse(route.query.data as any)
  form.name = currentRow.value.name
  form.costType = currentRow.value.expenseType.id
  form.billItems = currentRow.value.billableItemsPrices
  form.enabled = currentRow.value.enabled
  form.billingMode = currentRow.value.billType
  form.cycle = currentRow.value.billCycle
  if (currentRow.value.billType === BillingEnum.ON_DEMAND) {
    form.discount = currentRow.value.discount
  } else {
    discountData.value = currentRow.value.tieredDiscounts
  }
  form.frequency = currentRow.value.settlementFrequency
}

/*
方法
*/
//添加计费项
const clickAddCostItem = () => {
  showDialog.value = true
  dialogType.value = 'addChargeItem'
}
// 删除计费项
const clickDeleteChargeItem = (index: number) => {
  ElMessageBox.confirm('确定要删除添加的计费项的价格吗？', '删除计费项', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    form.billItems?.splice(index, 1)
  })
}

/*
 *折扣系数
 */
// 周期选择月时的折扣系数
const discountData: any = ref([])
const discountHeaders: IdealTableColumnHeaders[] = [
  { label: '起始月', prop: 'startMonth', useSlot: true },
  { label: '结束月', prop: 'endMonth', useSlot: true },
  { label: '折扣比', prop: 'discountRate', useSlot: true }
]
const clickAddDiscount = () => {
  discountData.value.push({ start: '', end: '', discount: '' })
} // 添加折扣系数
const clickDeleteDiscount = (index: number) => {
  discountData.value.splice(index, 1)
} // 删除折扣系数

/*
 * 查询云平台类别,云平台类型，云平台，资源池四级列表
 */
const cloudPlatformCategory: any = ref([]) //云平台类别
const getCloudTypes = () => {
  resourcePoolGrade({ all: true })
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        cloudPlatformCategory.value = data
        if (isEdit.value) {
          form.cloudCategory = currentRow.value.cloudPlatform.cloudCategory
        }
      } else {
        cloudPlatformCategory.value = []
      }
    })
    .catch(_ => {
      cloudPlatformCategory.value = []
    })
}
const cloudPlatformTypes: any = ref([]) //云平台类型
const platformList: any = ref([]) //云平台
const resourcePools: any = ref([]) //资源池
const cycleList: any = ref([]) //周期

watch(
  () => form.cloudCategory,
  val => {
    if (val) {
      cloudPlatformTypes.value = cloudPlatformCategory.value.find(
        (item: any) => item.cloudCategory === val
      )?.cloudPlatformTypes
      if (isEdit.value) {
        form.cloudType = currentRow.value.cloudPlatform.cloudPlatformType
      }
    }
  }
)
watch(
  () => form.cloudType,
  val => {
    platformList.value = cloudPlatformTypes.value.find(
      (item: any) => item.cloudType === val
    )?.cloudPlatforms
    if (isEdit.value) {
      form.platform = currentRow.value.cloudPlatform.id
    }
  }
)
watch(
  () => form.platform,
  val => {
    const arr = platformList.value.find(
      (item: any) => item.id === val
    )?.cloudResourcePools
    resourcePools.value = [{ name: '全部资源池', id: 'all' }].concat(arr)
    form.resourcePool = 'all'
  }
)
watch(
  () => form.billingMode,
  billingModeNew => {
    //根据计费模式展示不同的周期
    if (billingModeNew) {
      let arr = [
        { label: '小时', value: 'HOUR' },
        { label: '日', value: 'DAY' },
        { label: '周', value: 'WEEK' },
        { label: '月', value: 'MONTH' }
      ]
      let arr1 = [{ label: '月', value: 'MONTH' }]
      cycleList.value = billingModeNew === BillingEnum.ON_DEMAND ? arr : arr1
    }
  }
)

/* 查询费用类型列表 */
const costTypeList: any = ref([])
const getExpenseType = () => {
  expenseTypeList()
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        costTypeList.value = data
      } else {
        costTypeList.value = []
      }
    })
    .catch(_ => {
      costTypeList.value = []
    })
}
/*
保存/取消
*/
const router = useRouter() // 路由
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
  formEl.validate((valid: boolean) => {
    if (!valid) {
      return
    }
    let billItemArr: any = []
    form.billItems?.forEach(ele => {
      if (ele.chargeType === 'FIXED') {
        billItemArr.push({
          billableItemsId: ele.billableItems.id,
          unit: ele.unit,
          priceType: ele.chargeType,
          unitPrice: ele.unitPrice
        })
      } else {
        billItemArr.push({
          billableItemsId: ele.billableItems.id,
          unit: ele.unit,
          priceType: ele.chargeType,
          tieredPrices: ele.priceList
        })
      }
    })
    let params: any = {
      name: form.name,
      cloudPlatformId: form.platform,
      enabled: form.enabled,
      expenseTypeId: form.costType,
      billType: form.billingMode,
      billCycle: form.cycle,
      settlementFrequency: form.frequency,
      billableItemsPrices: billItemArr
    }
    if (billDemand.value) {
      params.discount = form.discount
    } else {
      params.tieredDiscounts = discountData.value
    }
    if (isEdit.value) {
      params.id = currentRow.value.id
      editBillPrice(params).then((res: any) => {
        let { code } = res
        if (code === 200) {
          ElMessage.success('编辑定价模型成功')
          router.push({
            path: '/operate-center/billing-manage/price-model/list'
          })
        } else {
          ElMessage.error('编辑定价模型失败')
        }
      })
    } else {
      addBillPrice(params).then((res: any) => {
        let { code } = res
        if (code === 200) {
          ElMessage.success('创建定价模型成功')
          router.push({
            path: '/operate-center/billing-manage/price-model/list'
          })
        } else {
          ElMessage.error('创建定价模型失败')
        }
      })
    }
  })
}
/**
 * 弹框
 */
const showDialog = ref(false)
const dialogType = ref<OperateEventEnum | string>()
const clickCloseEvent = () => {
  showDialog.value = false
}
const clickRefreshEvent = (value: any) => {
  showDialog.value = false
  form.billItems?.push(value)
}
/**
 * 计费项价格列表
 */
const state: IHooksOptions = reactive({
  dataListUrl: billItems,
  deleteUrl: '',
  createdIsNeed: false,
  isPage: false
})
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '计费项', prop: 'billableItems.name' },
  { label: '计费单元', prop: 'billableItems.preUnit' },
  { label: '计费单位', prop: 'unit' },
  { label: '价格', prop: 'price', useSlot: true }
]
const { getDataList } = useCrud(state)
</script>

<style scoped lang="scss">
.price-model-create {
  box-sizing: border-box;
  :deep(.el-divider--vertical) {
    border-left: 1px var(--el-color-primary) var(--el-border-style);
  }
  .price-model-create-form {
    background-color: white;
    padding: 20px;
    .price-model-create-discount {
      align-items: flex-start;
      width: 60%;
    }
  }
  // svg图片颜色
  :deep(.svg-icon svg) {
    fill: var(--el-color-primary);
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
  .ideal-header-container {
    width: 100%;
  }
}
</style>
