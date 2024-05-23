<template>
  <div class="renew">
    <div class="renew-original">
      <div class="flex-row renew__tip">
        <svg-icon icon="info-warning" color="#F3AD3C" class="ideal-svg-margin-right"></svg-icon>
        <span
          >以下弹性云主机将进行续订操作</span
        >
      </div>

      <ideal-table-list
        :table-data="originalData"
        :table-headers="originalHeader"
        :show-pagination="false">
        <template #name>
          <el-table-column label="名称/ID" show-overflow-tooltip>
            <template #default="props">
              <div>{{ props.row.name }}</div>
              <div>{{ props.row.id }}</div>
            </template>
          </el-table-column>
        </template>
        <template #status>
          <el-table-column label="状态">
            <template #default="props">
              <ideal-status-icon
                :status-icon="props.row.statusIcon"
                :status-text="props.row.statusText"
              ></ideal-status-icon>
            </template>
          </el-table-column>
        </template>
        <template #spec>
          <el-table-column label="规格">
            <template #default="props">
              <div>
                {{ props.row.flavor.vcpus }}核｜{{ props.row.flavor.ram }}G
              </div>
            </template>
          </el-table-column>
        </template>
      </ideal-table-list>
    </div>

    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="left"
      class="renew-form">
      <el-form-item label="购买时长" prop="buyTime">
        <el-slider
          v-model="form.buyTime"
          :marks="buyTimeMarks"
          :max="14"
          :min="1"
        />
      </el-form-item>

      <el-form-item v-if="publicAliyun" label="数据盘" prop="disk">
        <div class="flex-column" style="width: 100%">
          <div>选择需要同时续订挂载在实例上的数据盘</div>

          <ideal-table-list
            ref="diskTableListRef"
            :loading="state.dataListLoading"
            :table-data="state.dataList"
            :table-headers="diskHeaders"
            :is-multiple="true"
            :show-pagination="false"
            @handleSelectionChange="selectionChangeHandle"
          >
            <template #diskName>
              <el-table-column
                label="云硬盘名称/ID"
                width="280"
                show-overflow-tooltip
              >
                <template #default="props">
                  <el-button link type="primary">{{
                    props.row.name
                  }}</el-button>

                  <ideal-text-copy
                    :row="props.row"
                    @mouseEnterEvent="value => (props.row.showCopy = value)"
                    @mouseLeaveEvent="value => (props.row.showCopy = value)"
                  />
                </template>
              </el-table-column>
            </template>
          </ideal-table-list>
        </div>
      </el-form-item>
    </el-form>

    <div class="flex-row footer-button">
      <div>配置费用: <span class="footer-button-price">32323.00元</span></div>
      <div class="flex-row">
        <el-button @click="cancelForm(formRef)"
          >{{ t('cancel') }}</el-button
        >
        <el-button type="primary" @click="submitForm(formRef)"
          >{{ t('confirm') }}</el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useCrud } from '@/hooks'
import { IHooksOptions } from '@/hooks/interface'
import type { IdealTableColumnHeaders } from '@/types'
import { EventEnum } from '@/utils/enum'
import type { FormRules, FormInstance } from 'element-plus'
import { diskTypeDic } from '@/utils/dictionary'
import { approvalProcess } from '@/utils/tool'
import { renewCloudHost, queryCloudHostDetail } from '@/api/java/compute'

const { t } = useI18n()
interface RenewProps {
  rowData?: any // 行数据
}
const props = withDefaults(defineProps<RenewProps>(), {
  rowData: () => ({})
})
// 原有规格数据
const originalData = ref<any[]>([])
const publicAliyun = computed(() => RegExp(/ALI/).test(props.rowData?.pool?.cloudType) && RegExp(/PUBLIC/).test(props.rowData?.pool?.cloudCategory))
onMounted(() => {
  originalData.value = [props.rowData]
  queryDetailData()
})

const originalHeader: IdealTableColumnHeaders[] = [
  { label: '名称/ID', prop: 'name', useSlot: true },
  { label: '监控', prop: 'monitor', useSlot: true },
  { label: '状态', prop: 'status', useSlot: true },
  { label: '镜像', prop: 'image.osVersion' },
  { label: '规格', prop: 'spec', useSlot: true },
  { label: '创建时间', prop: 'createTime.date' }
]

const formRef = ref<FormInstance>()
const form = reactive({
  buyTime: 1,
  disk: ''
})
const rules = reactive<FormRules>({
  buyTime: [{ required: true, message: '请选择购买时长', trigger: 'blur' }]
})
const buyTimeMarks: { [key: number]: string } = {
  1: '1个月',
  2: '2个月',
  3: '3个月',
  4: '4个月',
  5: '5个月',
  6: '6个月',
  7: '7个月',
  8: '8个月',
  9: '9个月',
  10: '10个月',
  11: '11个月',
  12: '1年',
  13: '2年',
  14: '3年'
}

// 数据盘列表
const state: IHooksOptions = reactive({})
const { selectionChangeHandle } = useCrud(state)
// 数据盘表头
const diskHeaders: IdealTableColumnHeaders[] = [
  { label: '云硬盘名称/ID', prop: 'diskName', useSlot: true },
  { label: '挂载主机', prop: 'bindInstance' },
  { label: '磁盘类型', prop: 'volumeTypeText' },
  { label: '容量(GB)', prop: 'size' },
  { label: '共享盘', prop: 'share' }
]
const diskTableListRef = ref()
const queryDetailData = () => {
  queryCloudHostDetail({ uuid: props.rowData.uuid })
    .then((res: any) => {
      const { code, data } = res
      if (code === 200) {
        data.volumeList.forEach((item: any) => {
          item.volumeTypeText = diskTypeDic[item.volumeType]
          item.bindInstance = data.name
          item.share = item.shareable ? '是' : '否'
        })
        state.dataList = data.volumeList
        state.dataList?.forEach((item: any) => diskTableListRef.value.IdealTableList.toggleRowSelection(item, true))
        
      } else {
        state.dataList = []
      }
    })
    .catch(_ => {
      state.dataList = []
    })
}
// 点击事件
interface EventEmits {
  (e: EventEnum.cancel): void
  (e: EventEnum.success): void
}
const emit = defineEmits<EventEmits>()

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
  formEl.validate(valid => {
    if (valid) {
      console.log('submit!')
      handleRenew()
    } else {
      console.log('error submit!')
      return false
    }
  })
}
const handleRenew = () => {
  const params: {[key: string]: any} = {
    resourceIdList: [
      {
        resourceUuid: props.rowData?.uuid, // 云主机
        mainResource: true
      }
    ],
    unsubscribeType: 1,
    resourceType: "ECS",
    billType: "PACKAGE",
    type: "RENEW",
    resourcePoolId: props.rowData?.pool?.id,
    regionId: props.rowData?.regionId,
    projectId: props.rowData?.project?.id,
    vdcId: props.rowData?.vdc?.id,
    cloudPlatformId: props.rowData?.pool?.cloudPlatform?.id
  }
  params.billCycle = form.buyTime > 11 ? 'YEAR' : 'MONTH' // 包年包月时间单位 计费周期（1 小时；2 天；4 周；8 月； 16 年 ）
  params.billCycleNum = form.buyTime > 11 ? form.buyTime - 11 : form.buyTime // 包年包月时间
  state.dataListSelections?.forEach((item: any) => {
    const dic = {
      resourceUuid: item.uuid,
      mainResource: false
    }
    params.resourceIdList.push(dic)
  })
  renewCloudHost(params).then((res: any) => {
    const { code, data } = res
    if (code === 200) {
      approvalProcess('ECSRENEW', props.rowData?.vdcId, data).then(
        (result: any) => {
          if (result.code === 200) {
            emit(EventEnum.success)
          }
        }
      )
    } else {
      ElMessage.error('续订失败')
    }
  })
}
</script>

<style scoped lang="scss">
.renew {
  width: 100%;
  .renew-original {
    padding: 0 17px;
    .renew__tip {
      background-color: #FEFBED;
      padding: 20px;
      align-items: center;
    }
  }
  .renew-form {
    :deep(.el-table) {
      height: 200px;
    }
  }
  .footer-button {
    justify-content: space-between;
    align-items: center;
    .footer-button-price {
      color: var(--el-color-primary);
    }
  }
}

</style>