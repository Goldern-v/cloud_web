<template>
  <div class="renew">
    <el-card>
      <div class="renew__content-config">
        <div class="current-config__before">
          <p class="renew__content-title">当前配置</p>
          <div>
            <ul class="flex-row">
              <li
                v-for="(item, index) in configItems"
                :key="index"
                class="flex-row"
              >
                <div class="ideal-tip-text current-config__label">
                  {{ item.label }}
                </div>
                <div v-if="item.prop === 'bandwidth'">
                  {{ routeData.bandwidth.name }}
                </div>
                <div v-else>{{ routeData[item.prop] }}</div>
              </li>
            </ul>
          </div>
        </div>

        <el-divider border-style="dashed" />

        <div class="current-config__after">
          <ul class="flex-row">
            <li class="flex-row">
              <div class="ideal-tip-text current-config__label">到期时间</div>
              <div class="ideal-warning-text">
                {{ routeData.expiredTime }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </el-card>

    <el-card class="ideal-large-margin-top">
      <el-form
        ref="eipFormRef"
        :model="eipForm"
        :rules="rules"
        label-position="left"
      >
        <el-form-item label="购买时长">
          <div class="flex-column">
            <div class="flex-row">
              <el-radio-group
                v-model="eipForm.eipPurchaseDuration"
                class="ideal-default-margin-right number-radio"
              >
                <el-tooltip
                  v-for="(item, index) of duration"
                  :key="index"
                  :content="item.desc"
                  placement="top"
                >
                  <el-radio-button :key="index" :label="item.label">
                    {{ item.label < 10 ? item.label : item.desc }}
                  </el-radio-button>
                </el-tooltip>
              </el-radio-group>
            </div>
            <div class="flex-row" style="margin-top: 15px">
              <el-checkbox v-model="eipForm.autoRenewal" label="自动续费" />
              <div></div>
            </div>
          </div>
        </el-form-item>

        <el-divider border-style="dashed" />

        <el-form-item label="到期时间">
          <span class="ideal-warning-text">{{ expiredTime }}</span>
        </el-form-item>
      </el-form>
    </el-card>

    <price-info
      ref="priceInfoRef"
      operate-type="renew"
      :basic-data="detailInfo"
      :steps-index="1"
      @clickNext="clickNext"
    >
    </price-info>
  </div>
</template>

<script setup lang="ts">
import priceInfo from '../components/price-info.vue'
import type { FormRules, FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus/es'
import { renewEip } from '@/api/java/network'
import { showLoading, hideLoading } from '@/utils/tool'
import { approvalProcess } from '@/utils/tool'
import { dayjs } from 'element-plus'

const route = useRoute()
const routeData = JSON.parse(route.query.data as any)
const configItems = [
  { label: '实例id', prop: 'uuid' },
  { label: '带宽', prop: 'bandwidth' },
  { label: '线路类型', prop: 'eipTypeCN' }
]

const eipForm = reactive({
  eipPurchaseDuration: 1,
  autoRenewal: ''
})

const rules = reactive<FormRules>({})

const duration: any = ref([])
onMounted(() => {
  duration.value = durationOptions()
})
const durationOptions = () => {
  return Array.from({ length: 12 }, (v, k) => k + 1).map((item: number) => {
    return {
      desc: item < 10 ? item + '个月' : item - 9 + '年',
      label: item < 10 ? item : 12 * (item - 9)
    }
  })
}

const detailInfo = computed(() => {
  return Object.assign({}, routeData, {
    eipPurchaseDuration: eipForm.eipPurchaseDuration
  })
})
const commonParams = () => {
  const { resourcePoolId, regionId, projectId, vdcId, cloudPlatformId } =
    routeData
  const params = {
    resourcePoolId,
    regionId,
    projectId,
    vdcId,
    cloudPlatformId
  }
  return params
}

const expiredTime = ref('')
watch(
  () => [eipForm.eipPurchaseDuration, routeData.expiredTime],
  ([num, time]) => {
    if (num && time) {
      const initialDate = new Date(time)
      // 添加月份数
      initialDate.setMonth(initialDate.getMonth() + num)
      // 获取并格式化结果日期
      expiredTime.value = dayjs(new Date(initialDate)).format(
        'YYYY-MM-DD HH:mm:ss'
      )
    }
  },
  { immediate: true }
)

const router = useRouter()
const clickNext = async () => {
  const { eipType, id, billType, name, bandwidth } = routeData
  const bandwidthObj = {
    name: bandwidth.name,
    size: bandwidth.size,
    chargeMode: bandwidth.chargeMode
  }
  const params = {
    eipType,
    resourceType: 'EIP',
    instanceResourceId: id,
    type: 'RENEW', // 订单类别 SUBSCRIBE订购、RENEW续订、VARIATION变配、UNSUBSCRIBE退订
    billType,
    billCycle: eipForm.eipPurchaseDuration < 10 ? 'MONTH' : 'YEAR',
    billCycleNum: eipForm.eipPurchaseDuration,
    instanceResourceName: name,
    bandwidth: bandwidthObj,
    ...commonParams()
  }
  showLoading('续订中...')
  renewEip(params)
    .then((res: any) => {
      const { code, data } = res
      const orderId: any = data
      if (code === 200) {
        approvalProcess('EIP', routeData.vdcId, orderId).then((res: any) => {
          if (res.code === 200) {
            router.push({ path: '/multi-cloud/elastic-ip/list' })
          }
        })
      } else {
        ElMessage.error('生成订单失败')
      }
      hideLoading()
    })
    .catch(err => {
      hideLoading()
    })
}
</script>

<style scoped lang="scss">
.renew {
  margin: $idealMargin $idealMargin 80px;
  :deep(.el-radio-button__inner) {
    width: 70px;
  }
  ul {
    flex-wrap: wrap;
  }
  ul li {
    list-style-type: none;
    width: 50%;
    line-height: 40px;
  }
  .renew__content-title {
    font-weight: 600;
    font-size: 15px;
  }
  .current-config__label {
    width: 30%;
  }
  .renew__content-config {
    background-color: var(--custom-information-bg-color);
    .current-config__before {
      padding: 20px 20px 0 20px;
    }
    .current-config__after {
      padding: 0 20px 20px 20px;
    }
  }
}
</style>
