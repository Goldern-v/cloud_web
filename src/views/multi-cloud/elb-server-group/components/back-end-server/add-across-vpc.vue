<template>
  <div class="add-across-vpc">
    <div class="flex-row custom-tip-box">
      <svg-icon
        icon="info-warning"
        color="var(--el-color-primary)"
        class="ideal-large-margin-right"
      ></svg-icon>
      <div>
        跨VPC后端的安全组规则必须放通负载均衡器的后端子网网段，否则负载均衡器无法向后端服务器发送请求，健康检查也会出现异常。
      </div>
    </div>

    <div style="margin-bottom: 20px">
      批量添加端口<el-input v-model="port" class="port-input"></el-input
      ><el-button>{{ t('confirm') }}</el-button>
    </div>

    <svg-icon
      icon="info-warning"
      color="var(--el-color-primary)"
      class="ideal-default-margin-right"
    ></svg-icon>
    <span
      >您最多可以添加500个跨VPC后端服务器，如需中请更多配额请点击<span
        style="color: var(--el-color-primary); cursor: pointer"
        >申请扩大配额。购买云服务器</span
      ></span
    >

    <ideal-table-list
      ref="multipleTableRef"
      :table-data="tableData"
      :table-headers="tableHeaders"
      :show-pagination="false"
    >
      <template #IP>
        <el-table-column label="跨VPC后端IP" width="380">
          <template #default="props">
            <ideal-ip-input
              :ip-value="props.row.ipAddress"
              @listenChange="ipChangeEvent(props.row)"
            ></ideal-ip-input>
          </template>
        </el-table-column>
      </template>

      <template #servicePort>
        <el-table-column label="业务端口">
          <template #default="props">
            <el-input v-model="props.row.servicePort"></el-input>
          </template>
        </el-table-column>
      </template>

      <template #weight>
        <el-table-column label="权重">
          <template #default="props">
            <el-input v-model="props.row.weight"></el-input>
          </template>
        </el-table-column>
      </template>

      <template #operation>
        <el-table-column label="操作">
          <template #default="props">
            <el-button link @click="handleDelete(props.$index)">移除</el-button>
          </template>
        </el-table-column>
      </template>
    </ideal-table-list>

    <div style="text-align: center" class="ideal-default-margin-top">
      <svg-icon
        icon="circle-add"
        class="ideal-svg-margin-right"
        @click="addIp"
      ></svg-icon
      >添加一个跨VPC后端服务器
    </div>

    <div class="flex-row ideal-submit-button">
      <el-button @click="cancelBtn">{{ t('cancel') }}</el-button>
      <el-button type="primary" @click="submitBtn">{{
        t('confirm')
      }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders } from '@/types'
import { useCrud } from '@/hooks'
import { EventEnum } from '@/utils/enum'

const { t } = useI18n()

const port = ref('')

const tableData: any = ref([
  {
    ipAddress: '0.0.0.0',
    servicePort: 80,
    weight: 1
  }
])
const tableHeaders: IdealTableColumnHeaders[] = [
  { label: '跨VPC后端IP', prop: 'IP', useSlot: true },
  { label: '业务端口', prop: 'servicePort', useSlot: true },
  { label: '权重', prop: 'weight', useSlot: true }
]

const ipChangeEvent = (row: any) => {}
//添加一个vpc后端
const addIp = () => {
  tableData.value.push({
    ipAddress: '',
    servicePort: null,
    weight: null
  })
}
//移除
const handleDelete = (index: any) => {
  tableData.value.splice(index, 1)
}
/**
 * 保存、取消
 */
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

const cancelBtn = () => {
  emit(EventEnum.cancel)
}

const submitBtn = () => {
  emit(EventEnum.success)
}
</script>

<style scoped lang="scss">
.add-across-vpc {
  .port-input {
    width: 100px;
    margin: 0 10px;
  }
  .custom-tip-box {
    background-color: var(--custom-information-bg-color);
    border: 1px solid var(--el-color-primary);
    padding: 15px 20px;
    margin-bottom: 20px;
    ul li {
      line-height: 24px;
      span {
        color: var(--el-color-primary);
        cursor: pointer;
      }
    }
  }
}
</style>
