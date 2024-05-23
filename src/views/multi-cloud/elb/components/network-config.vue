<template>
  <div class="net-config">
    <el-form
      ref="netFormRef"
      :model="netForm"
      :rules="rules"
      label-position="left"
    >
      <el-card class="ideal-large-margin-top">
        <el-form-item>
          <p>网络配置</p>
        </el-form-item>

        <el-form-item label="网络类型">
          <el-radio-group v-model="netForm.netType" class="custom-radio">
            <el-radio-button
              v-for="item of netTypeList"
              :key="item.label"
              type="text"
              :label="item.label"
              >{{ item.name }}
            </el-radio-button>
          </el-radio-group>
          <el-tooltip
            popper-class="custom-tooltip"
            effect="dark"
            placement="right"
          >
            <template #content>
              <div>
                IPv4 公网<br />
                公网负载均衡器通过公网IP对外提供服务，将<br />
                来自公网的客户端请求按照指定的负载均衡策<br />
                略分发到后端云服务器进行处理。<br />
                <br />
                IPv4 私网<br />
                私网负载均衡器通过私网IP对外提供服务，将<br />
                来自同一个VPC的客户端请求按照指定的负载<br />
                均衡策略分发到后端进行处理。<br />
              </div>
            </template>
            <svg-icon
              icon="question-icon"
              class="ideal-svg-margin-left"
            ></svg-icon>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="IP版本">
          <el-checkbox-group v-model="netForm.ipType">
            <el-checkbox label="IPV4" />
            <el-checkbox label="IPV6" />
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="所属VPC" prop="vpc">
          <el-select v-model="netForm.vpc" class="custom-input">
            <el-option
              v-for="(item, index) in vpcList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <svg-icon icon="refresh-icon" class="ideal-svg-margin-left"></svg-icon>
          <el-link type="primary" :underline="false" class="skip-text ideal-default-margin-left"
            >创建虚拟私有云</el-link
          >
        </el-form-item>

        <el-form-item label="子网" prop="subnet">
          <el-select v-model="netForm.subnet" class="custom-input">
            <el-option
              v-for="(item, index) in subnetList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <svg-icon icon="refresh-icon" class="ideal-svg-margin-left"></svg-icon>
          <el-tooltip
            content="负载均衡所在的子网，从该子网中分配ELB实例对外服务的IP地址 "
            effect="dark"
            placement="right"
            popper-class="custom-tooltip"
          >
            <svg-icon
              icon="question-icon"
              class="ideal-svg-margin-left"
            ></svg-icon>
          </el-tooltip>
          <el-link type="primary" :underline="false" class="skip-text ideal-default-margin-left"
            >查看子网</el-link
          >
        </el-form-item>

        <el-divider border-style="dashed" />

        <el-form-item label="弹性公网IP">
          <div class="flex-column">
            <el-radio-group v-model="netForm.eipSource" class="ideal-default-margin-right">
              <el-radio label="new"> 新创建</el-radio>
              <el-radio label="exit"> 使用已有</el-radio>
              <el-tooltip
                content="弹性公网IP是指将公网IP地址与负载均衡器绑定，通过公网IP对外提供负载分发服务。"
                effect="dark"
                placement="right"
                popper-class="custom-tooltip"
              >
                <svg-icon
                  icon="question-icon"
                  class="ideal-svg-margin-left"
                ></svg-icon>
              </el-tooltip>
            </el-radio-group>

            <div class="ideal-default-margin-top">
              <el-select v-model="netForm.eip" class="custom-input">
                <el-option
                  v-for="(item, index) in eipList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <svg-icon
                icon="refresh-icon"
                class="ideal-svg-margin-left"
              ></svg-icon>
              <el-tex type="primary" :underline="false" class="skip-text ideal-default-margin-left"
                >查看弹性公网IP</el-tex
              >
            </div>
          </div>
        </el-form-item>

        <template v-if="newEip">
          <el-form-item label="弹性公网IP类型" prop="eipType">
            <el-radio-group
              v-model="netForm.eipType"
              class="ideal-default-margin-right custom-radio"
            >
              <el-radio-button
                v-for="(item, index) of eipTypeList"
                :key="index"
                type="text"
                :label="item.label"
                >{{ item.name }}
              </el-radio-button>
            </el-radio-group>

            <el-tooltip
              popper-class="custom-tooltip"
              effect="dark"
              placement="right"
            >
              <template #content>
                <div>
                  全动态BGP<br />
                  可以根据设定的寻路协议实时自动优化调整网<br />
                  络结构，以保证客户网络的持续稳定和高效运<br />
                  行。全动态BGP弹性公网IP每服务周期的服<br />
                  务可用率不低于99.95%。若选择全动态<br />
                  BGP，将提供更持续稳定、高效的网络质量。<br />
                  静态BGP<br />
                  <br />
                  网络结构发生变化时，无法实时通过自动调整<br />
                  网络设置来保障用户体验。静态BGP弹性公<br />
                  网IP每服务周期的服务可用率不低于99%。若<br />
                  选择静态BGP，需要应用系统自行具备容灾切<br />
                  换能力。
                </div>
              </template>
              <svg-icon icon="question-icon"></svg-icon>
            </el-tooltip>
          </el-form-item>

          <el-form-item label="公网带宽">
            <div class="flex-column">
              <div class="flex-row">
                <el-radio-group
                  v-model="netForm.bandwidthType"
                  class="ideal-default-margin-right custom-radio"
                >
                  <el-radio-button
                    v-for="(item, index) of bandwidthTypeOption"
                    :key="index"
                    :label="item.label"
                  >
                    {{ item.name }}
                  </el-radio-button>
                </el-radio-group>
                <el-tooltip
                  popper-class="custom-tooltip"
                  effect="dark"
                  placement="right"
                >
                  <template #content>
                    <div>
                      按带宽计费<br />
                      流量较大或稳定的场景<br />
                      <br />
                      按流量计费<br />
                      流量较小或流量波动较大的场景<br />
                      <br />
                      加入共享带宽<br />
                      多业务流量错峰分布场景<br />
                    </div>
                  </template>
                  <svg-icon icon="question-icon"></svg-icon>
                </el-tooltip>
              </div>

              <div class="ideal-tip-text">
                <div class="flex-row" style="align-items: center">
                  <div v-show="netForm.bandwidthType === 'bandwidth'">
                    按照您指定的带宽大小及使用时长收取带宽费，不限流量。
                  </div>
                  <div v-show="netForm.bandwidthType === 'traffic'">
                    按照您实际使用的出云流量收取流量费，带宽大小仅做限速使用，不做为收费依据。
                  </div>
                  <div v-show="netForm.bandwidthType === 'shareBandwidth'">
                    加入共享带宽的EIP，不再单独收取带宽费和流量费，以共享带宽费用为准。
                  </div>
                  <span class="skip-text"
                    >计费信息请参考<el-link
                      type="primary"
                      :underline="false"
                      class="skip-text"
                      >弹性公网IP计费说明</el-link
                    >
                  </span>
                </div>
              </div>
            </div>
          </el-form-item>

          <el-form-item
            v-if="netForm.bandwidthType !== 'shareBandwidth'"
            label="带宽大小(MBit/s)"
          >
            <el-radio-group
              v-model="netForm.bandwidthSize"
              class="ideal-default-margin-right number-radio"
            >
              <el-radio-button
                v-for="(item, index) of sizeList"
                :key="index"
                type="text"
                :label="item"
                >{{ item }}
              </el-radio-button>
            </el-radio-group>
            <span style="margin: 0 10px">自定义</span>
            <el-input-number v-model="netForm.bandwidthSize" class="ideal-default-margin-right">
            </el-input-number>
            <span class="ideal-warning-text">带宽范围:1-2,000 Mbit/s</span>
          </el-form-item>

          <el-form-item
            v-if="netForm.bandwidthType === 'shareBandwidth'"
            label="带宽名称"
          >
            <div class="flex-column">
              <div class="flex-row" style="align-items: center">
                <el-select
                  v-model="netForm.bandwidthName"
                  placeholder="请选择带宽"
                  class="ideal-default-margin-right"
                >
                  <el-option
                    v-for="item of bandwidthList"
                    :key="item.label"
                    :label="item.name"
                  />
                </el-select>
                <svg-icon
                  icon="refresh-icon"
                  class="ideal-svg-margin-right"
                ></svg-icon>
                <el-link type="primary" :underline="false" class="skip-text"
                  >管理共享带宽</el-link
                >
              </div>
              <div class="ideal-warning-text">
                {{ bandwidthLineInstruction }}
              </div>
              <div v-if="netForm.bandwidthName" class="ideal-tip-text">
                <p>带宽(Mbit/s):{{ bandwidthSize }}</p>
                <p>当前共享带宽还可以添加弹性公网IP个数:{{ eipNum }}</p>
                <p class="flex-row">
                  单个共享带宽最多可添加弹性公网IP的个数：{{
                    eipMaximum
                  }}如需申请更多配额请点击<el-link
                    type="primary"
                    :underline="false"
                    class="skip-text"
                    >申请扩大配额</el-link
                  >
                </p>
              </div>
            </div>
          </el-form-item>
        </template>
      </el-card>

      <el-card v-if="isPackage">
        <el-form-item label="购买时长">
          <div class="flex-column">
            <el-radio-group
              v-model="netForm.purchaseDuration"
              class="ideal-default-margin-right number-radio"
            >
              <el-radio-button
                v-for="(item, index) of duration"
                :key="index"
                :label="item.label"
              >
                <el-tooltip :content="item.desc" placement="top">
                  {{ item.label < 10 ? item.label : item.desc }}
                </el-tooltip>
              </el-radio-button>
            </el-radio-group>
            <div class="flex-row" style="margin-top: 15px">
              <el-checkbox v-model="netForm.autoRenewal" label="自动续费" />
              <el-tooltip
                popper-class="custom-tooltip"
                effect="dark"
                placement="right"
              >
                <template #content
                  >按月购买：<br />则自动续费周期为一个月，<br />按年购买：<br />则自动续费周期为一年。</template
                >
                <svg-icon icon="question-icon"></svg-icon>
              </el-tooltip>
            </div>
          </div>
        </el-form-item>
      </el-card>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import store from '@/store'
import { BillingEnum } from '@/utils/enum'

interface basicInfo {
  basicData?: any
}
const props = withDefaults(defineProps<basicInfo>(), {
  basicData: () => ({})
})

const isPackage = computed(() => props.basicData.billingMode === BillingEnum.PACKAGE) //是否包年包月

const netFormRef = ref<FormInstance>() // 校验表单

const { resourcePoolInfo, regionInfo } = storeToRefs(store.resourceStore)
const netForm = reactive({
  netType: 'private',
  ipType: '',
  vpc: '',
  subnet: '',
  instanceIpv4: '',
  eip: '',
  eipSource: 'new',
  eipType: '5_bgp',
  remark: '',
  bandwidthType: 'bandwidth',
  bandwidthSize: 1, //带宽大小
  bandwidthName: '',
  purchaseDuration: 1,
  autoRenewal: false
})
const rules = reactive<FormRules>({})

const newEip = computed(() => netForm.eipSource === 'new')

const vpcList: any = ref([])
const subnetList: any = ref([])
const eipList: any = ref([])

const ipv4Distribution = [
  { label: 'auto', name: '自动分配' },
  { label: 'manual', name: '手动分配' }
]
const eipTypeList = [
  { label: '5_bgp', name: '全动态BGP' },
  { label: '5_sbgp', name: '静态BGP' }
]
const bandwidthTypeOption = [
  { name: '按带宽计费', label: 'bandwidth' },
  { name: '按流量计费', label: 'traffic' },
  { name: '加入共享带宽', label: 'shareBandwidth' }
]

const netTypeList = [
  { label: 'public', name: '公网' },
  { label: 'private', name: '私网' }
]
const sizeList: any = ref()
watch(
  () => netForm.bandwidthType,
  value => {
    sizeList.value =
      value === 'bandwidth' ? [1, 2, 5, 10, 100, 200] : [5, 10, 20, 50, 100]
    netForm.bandwidthSize = sizeList.value[0]
  },
  { immediate: true }
)

const bandwidthList: any = ref([])
const bandwidthLineInstruction = computed(
  () =>
    `当前EIP的线路类型为，${
      netForm.eipType === '5_bgp' ? '全动态' : '静态'
    }BGP可添加的共享带宽线路类型为普通带宽`
)
const bandwidthSize = ref(5)
const eipNum = ref(20)
const eipMaximum = ref(20)

const duration = [
  { desc: '1个月', label: 1 },
  { desc: '2个月', label: 2 },
  { desc: '3个月', label: 3 },
  { desc: '4个月', label: 4 },
  { desc: '5个月', label: 5 },
  { desc: '6个月', label: 6 },
  { desc: '7个月', label: 7 },
  { desc: '8个月', label: 8 },
  { desc: '9个月', label: 9 },
  { desc: '1年', label: 12 },
  { desc: '2年', label: 24 },
  { desc: '3年', label: 36 },
  { desc: '4年', label: 48 },
  { desc: '5年', label: 60 }
]

defineExpose({
  netForm,
  netFormRef
})
</script>

<style scoped lang="scss">
.net-config {
  width: 100%;
  margin-bottom: 65px;
  :deep(.custom-radio .el-radio-button__inner) {
    width: 105px;
  }
  :deep(.number-radio .el-radio-button__inner) {
    width: 70px;
  }
  .custom-input {
    width: $formInputWidth;
  }

  .skip-text {
    font-size: $defaultFontSize;
  }
  :deep(.custom-tooltip) {
    max-width: 50px;
  }
}
</style>
