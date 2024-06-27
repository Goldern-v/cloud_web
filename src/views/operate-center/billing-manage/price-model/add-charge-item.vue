<template>
  <div class="add-charge-item">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="left">
      <el-form-item label="计费项" prop="billableItems">
        <el-select
          v-model="form.billableItems"
          placeholder="请选择"
          value-key="id"
          class="custom-input"
          @change="chargeItemChange"
        >
          <el-option
            v-for="(item, index) of chargeItemList"
            :key="index"
            :label="item.name"
            :disabled="item.selectDisabled"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="计费单元">
        <el-input
          v-model="form.pretUnit"
          placeholder="显示所选项计费单元"
          class="custom-input"
          disabled
        />
      </el-form-item>

      <el-form-item label="计费单位">
        <el-input
          v-model="form.unit"
          placeholder="显示所选项计费单位"
          disabled
          class="custom-input"
        />
      </el-form-item>

      <el-form-item label="计价类型" prop="chargeType">
        <el-radio-group v-model="form.chargeType">
          <el-radio label="FIXED">固定计费</el-radio>
          <el-radio label="TIERED">阶梯计费</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="价格" :prop="isFixed ? 'unitPrice' : 'priceList'">
        <div class="flex-column">
          <div v-if="isFixed" class="flex-row">
            <el-input v-model="form.unitPrice" class="custom-input" />
            <div class="ideal-default-margin-left">元</div>
          </div>

          <div v-else class="flex-column">
            <div class="flex-row">
              <svg-icon
                icon="circle-add"
                class="ideal-svg-margin-right"
              ></svg-icon>
              <el-button link type="primary" @click="clickAddPrice"
                >添加一条</el-button
              >
            </div>

            <div
              v-for="(item, index) of form.priceList"
              :key="index"
              class="flex-row price-item"
            >
              <el-row :gutter="5" style="margin-top: 5px">
                <el-col :span="1">
                  <svg-icon
                    icon="circle-close"
                    @click="clickDeletePrice(index)"
                  ></svg-icon>
                </el-col>
                <el-col :span="7">
                  <el-input-number
                    v-model="item.start"
                    placeholder="请输入起始值"
                    :min="startLower(index)"
                    :max="startLower(index)"
                    controls-position="right"
                    class="custom-input"
                  />
                </el-col>
                <el-col :span="7">
                  <el-input-number
                    v-model="item.end"
                    placeholder="请输入结束值"
                    controls-position="right"
                    :min="upper(index)"
                    class="custom-input"
                    @change="changeEnd($event, index)"
                  />
                </el-col>
                <el-col :span="9"
                  ><el-input v-model="item.unitPrice" placeholder="请输入单价"
                /></el-col>
              </el-row>
            </div>
            <div class="ideal-warning-text">
              阶梯计费最后一组的结束数值应设为空,表示上限
            </div>
          </div>
        </div>
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
import type { FormInstance, FormRules } from 'element-plus'
import { EventEnum } from '@/utils/enum'
import { queryBillItems } from '@/api/java/operate-center'
import { isEmpty } from '@/utils/is'

const { t } = useI18n()

onMounted(() => {
  if (props.costType) {
    queryCostItem() //查询费用类型下的计费项
  }
})
/*
表单
*/
const formRef = ref<FormInstance>()
const form = reactive({
  billableItems: {} as { [key: string]: any }, // 计费项
  pretUnit: '', //计费项单元
  unit: '', // 计费单位
  chargeType: 'FIXED', // 计价类型
  unitPrice: '',
  priceText: [] as any[],
  priceList: [] as any[]
})

const validateBillableItems = (rule: any, value: any, callback: any) => {
  if (isEmpty(form.billableItems)) {
    return callback(new Error('请选择计费项'))
  } else {
    callback()
  }
}

const validatePrice = (rule: any, value: any, callback: any) => {
  if (!value.length) {
    return callback(new Error('请添加一条价格计费'))
  } else if (value[value.length - 1].end) {
    return callback(new Error('阶梯计费最后一组的结束数值应设为空,表示上限'))
  } else {
    callback()
  }
}
const rules = reactive<FormRules>({
  billableItems: [
    { required: true, validator: validateBillableItems, trigger: 'blur' }
  ],
  chargeType: [{ required: true, message: '请选择计价类型', trigger: 'blur' }],
  unitPrice: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  priceList: [{ required: true, validator: validatePrice, trigger: 'blur' }]
})

// 是否固定计费
const isFixed = computed(() => form.chargeType === 'FIXED')
//起始值的最小值
const startLower = (index: number): number => {
  let min = 1
  min = index ? form.priceList[index - 1].end + 1 : 1
  return min
}
//结束值的最小值
const upper = (index: number): number => {
  return form.priceList[index].start + 1
}

const changeEnd = (item: any, index: number) => {
  console.log(item, index)
}

interface costTypeData {
  costType?: string //费用类型
  exitChargeItem?: any //已添加的计费项
}
const props = withDefaults(defineProps<costTypeData>(), {
  costType: '',
  exitChargeItem: []
})
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success, v: object): void
}
const emit = defineEmits<EventEmits>()
/*
方法
*/
//选择计费项后展示计费项单元
const chargeItemChange = (value: any) => {
  form.pretUnit = value.preUnit
}
//阶梯计费添加一条价格
const clickAddPrice = () => {
  form.priceList.push({ start: '', end: null, unitPrice: '' })
}
const clickDeletePrice = (index: number) => {
  form.priceList.splice(index, 1)
}
const cancelForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  emit(EventEnum.cancel)
}
//查询计费项
const chargeItemList: any = ref([])
const queryCostItem = () => {
  queryBillItems({
    expenseTypeId: props.costType
  })
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        data.forEach((ele: any) => {
          ele.selectDisabled = props.exitChargeItem.some((item: any) => {
            return item.billableItems.id === ele.id
          })
        })
        chargeItemList.value = data
      } else {
        chargeItemList.value = []
      }
    })
    .catch(_ => {
      chargeItemList.value = []
    })
}
// 监听计费项获取单位
watch(
  () => form.billableItems,
  value => {
    if (value) {
      form.unit = value?.unit
    }
  }
)
//添加计费项规格
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate((valid: boolean) => {
    if (valid) {
      if (form.chargeType === 'FIXED') {
        form.priceText = [form.unitPrice + '元/' + form.unit]
      } else if (Array.isArray(form.priceList)) {
        let arr: any = []
        form.priceList.forEach((item: any) => {
          if (item.end) {
            let string =
              item.start +
              '-' +
              item.end +
              ', ' +
              item.unitPrice +
              '元/' +
              form.unit
            arr.push(string)
          } else {
            let string =
              item.start + '以上, ' + item.unitPrice + '元/' + form.unit
            arr.push(string)
          }
          form.priceText = arr
        })
      }
      emit(EventEnum.success, form)
    }
  })
}
</script>

<style scoped lang="scss">
.add-charge-item {
  width: 100%;
  // svg图片颜色
  :deep(.svg-icon svg) {
    fill: var(--el-color-primary);
  }
  // .price-item {
  //   padding: 5px 0;
  //   :deep(.svg-icon svg) {
  //     fill: black;
  //   }
  // }
  .custom-input {
    width: 100%;
  }
}
</style>
