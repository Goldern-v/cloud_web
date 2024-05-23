<template>
  <div class="basic-config">
    <el-form
      ref="eipFormRef"
      :model="eipForm"
      :rules="rules"
      label-position="left"
    >
      <el-card>
        <ideal-region-project
          class="region-input"
          @selectRegion="selectRegion"
          @selectProject="selectProject"
        ></ideal-region-project>

        <el-form-item label="计费方式" prop="billingMode">
          <el-radio-group v-model="eipForm.billingMode" class="custom-radio">
            <el-radio-button
              v-for="item of state.chargeModeList"
              :key="item.label"
              type="text"
              :label="item.label"
              >{{ item.name }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <!-- 华为私有云创建需外部网络参数 -->
        <el-form-item
          v-if="isPrivateHuawei"
          label="外部网络"
          prop="externalNetwork"
        >
          <el-select
            v-model="eipForm.externalNetwork"
            placeholder="请选择外部网络"
            class="custom-input"
          >
            <el-option
              v-for="(item, index) of state.exNetList"
              :key="index"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>

        <template v-if="isPublic">
          <el-form-item label="线路">
            <div class="flex-column">
              <div class="flex-row">
                <el-radio-group
                  v-model="eipForm.line"
                  class="ideal-default-margin-right custom-radio"
                >
                  <el-radio-button
                    v-for="item of state.lineList"
                    :key="item.label"
                    type="text"
                    :label="item.label"
                    >{{ item.name }}
                  </el-radio-button>
                </el-radio-group>
                <template v-if="isHuawei">
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
                </template>
              </div>
              <div class="flex-row">
                <svg-icon
                  v-if="isHuawei"
                  icon="check-circle"
                  color="#56C08D"
                ></svg-icon>
                <span class="ideal-tip-text">{{ state.eipTypeDes }}</span>
              </div>
            </div>
          </el-form-item>

          <el-form-item v-if="!isPackage" label="公网带宽">
            <div class="flex-column">
              <div class="flex-row">
                <el-radio-group v-model="eipForm.bandwidthType" class="ideal-default-margin-right">
                  <el-radio-button
                    v-for="(item, index) of state.bandwidthTypeOption"
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
                    <div v-html="state.bandwidthDes"></div>
                  </template>
                  <svg-icon icon="question-icon"></svg-icon>
                </el-tooltip>
              </div>

              <div class="ideal-tip-text">
                <p v-show="eipForm.bandwidthType === 'bandwidth'">
                  按照您指定的带宽大小及使用时长收取带宽费，不限流量。
                </p>
                <p v-show="eipForm.bandwidthType === 'traffic'">
                  按照您实际使用的出云流量收取流量费，带宽大小仅做限速使用，不做为收费依据。
                </p>
                <p v-show="eipForm.bandwidthType === 'shareBandwidth'">
                  加入共享带宽的EIP，不再单独收取带宽费和流量费，以共享带宽费用为准。
                </p>
                <p>
                  EIP与实例解绑后，新增IP保有费，不影响共享带宽计费。更多计费信息请参考<el-text
                    type="primary"
                    >计费说明</el-text
                  >
                </p>
              </div>
            </div>
          </el-form-item>

          <el-form-item
            v-if="eipForm.bandwidthType !== 'shareBandwidth'"
            label="带宽大小(MBit/s)"
          >
            <el-radio-group
              v-model="eipForm.bandwidthSize"
              class="ideal-default-margin-right number-radio"
            >
              <el-radio-button
                v-for="(item, index) of state.sizeList"
                :key="index"
                type="text"
                :label="item"
                >{{ item }}
              </el-radio-button>
            </el-radio-group>
            <el-tooltip
              popper-class="custom-tooltip"
              effect="dark"
              content="了解入云带宽和出云带宽"
              placement="right"
            >
              <svg-icon icon="question-icon"></svg-icon>
            </el-tooltip>
            <span style="margin: 0 10px; font-size: 12px">自定义</span>
            <el-input-number
              v-model="eipForm.bandwidthSize"
              :min="1"
              :max="eipForm.maxSize"
              class="ideal-default-margin-right"
            >
            </el-input-number>
            <span class="ideal-warning-text"
              >带宽范围:1-{{ eipForm.maxSize }} Mbit/s</span
            >
          </el-form-item>

          <el-form-item
            v-if="eipForm.bandwidthType === 'shareBandwidth'"
            label="带宽名称"
          >
            <div class="flex-column">
              <div class="flex-row" style="align-items: center">
                <el-select
                  v-model="eipForm.bandwidth"
                  placeholder="请选择带宽"
                  class="ideal-default-margin-right"
                >
                  <el-option
                    v-for="item of state.bandwidthList"
                    :key="item.label"
                    :label="item.name"
                  />
                </el-select>
                <svg-icon
                  icon="refresh-icon"
                  class="ideal-svg-margin-right"
                ></svg-icon>
                <el-text type="primary">管理共享带宽</el-text>
              </div>
              <div class="ideal-warning-text">
                当前EIP的线路类型为全动态BGP，可添加的共享带宽线路类型为普通带宽
              </div>
              <div class="ideal-tip-text">
                <p>带宽(Mbit/s):{{ bandwidthSize }}</p>
                <p>当前共享带宽还可以添加弹性公网IP个数:{{ eipNum }}</p>
                <p class="flex-row">
                  单个共享带宽最多可添加弹性公网IP的个数：{{
                    eipMaximum
                  }}如需申请更多配额请点击<el-text type="primary"
                    >申请扩大配额</el-text
                  >
                </p>
              </div>
            </div>
          </el-form-item>

          <el-form-item v-if="isHuawei" label="IPv6转换">
            <div class="flex-column">
              <div class="flex-row">
                <el-checkbox
                  v-model="eipForm.openIpv6"
                  label="开启IPv6"
                  class="ideal-default-margin-right"
                />
                <span>一键开启，实现对外提供IPv6访问能力</span>
                <el-tooltip
                  effect="dark"
                  placement="right"
                  content="密码有效期"
                  popper-class=""
                >
                  <template #content>
                    <div>
                      开启IPv6转换后，将提供IPv4和IPv6弹性公网IP地址，原有IPv4业务可以快速为IPv6用户提供访问能力。
                    </div>
                  </template>
                  <svg-icon icon="question-icon"></svg-icon>
                </el-tooltip>
              </div>
              <div class="flex-row">
                <span class="ideal-tip-text"
                  >公测期间IPv6转换功能免费。开启IPv6转换后，还需配置安全组，在安全组的出方向和入方向中放通198.19.0.0/16网段的IP地址。</span
                ><el-text type="primary">了解更多</el-text>
              </div>
            </div>
          </el-form-item>
        </template>
      </el-card>

      <el-card class="ideal-large-margin-top">
        <el-form-item label="弹性公网IP名称">
          <el-input v-model="eipForm.eipName" class="custom-input" />
        </el-form-item>

        <el-form-item>
          <template #label>
            <div>高级配置</div>
            <svg-icon
              v-if="!state.highConfig"
              icon="down-arrow"
              class="ideal-svg-margin-left"
              @click="state.highConfig = !state.highConfig"
            ></svg-icon>
            <svg-icon
              v-if="state.highConfig"
              icon="down-arrow"
              class="ideal-svg-margin-left"
              @click="state.highConfig = !state.highConfig"
            ></svg-icon>
          </template>
          <div>
            <span v-if="eipForm.bandwidthType !== 'shareBandwidth'"
              ><span v-if="isPublic">带宽名称 |</span> </span
            >标签
          </div>
        </el-form-item>

        <template v-if="state.highConfig">
          <el-form-item
            v-if="eipForm.bandwidthType !== 'shareBandwidth' && isPublic"
            label="带宽名称"
            prop="bandwidthName"
          >
            <el-input
              v-model="eipForm.bandwidthName"
              class="custom-input"
            ></el-input>
          </el-form-item>
          <el-form-item label="标签">
            <div class="flex-column" style="width: 20%">
              <ideal-tag-multiple-select @selectTag="selectTag">
              </ideal-tag-multiple-select>
              <div class="ideal-tip-text">
                您可以至多添加{{ state.labelNum }}个标签
              </div>
            </div>
          </el-form-item>
        </template>
      </el-card>

      <el-card class="ideal-large-margin-top" style="margin-bottom: 20px">
        <el-form-item v-if="isPackage" label="购买时长">
          <div class="flex-column">
            <el-radio-group
              v-model="eipForm.eipPurchaseDuration"
              class="ideal-default-margin-right number-radio"
            >
              <el-tooltip
                v-for="(item, index) of state.duration"
                :key="index"
                :content="item.desc"
                placement="top"
              >
                <el-radio-button :label="item.label">
                  {{ item.label < 10 ? item.label : item.desc }}
                </el-radio-button>
              </el-tooltip>
            </el-radio-group>
            <div v-if="isAliyun" class="flex-row" style="margin-top: 15px">
              <el-checkbox v-model="eipForm.autoRenewal" label="自动续费" />
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

        <el-form-item v-if="!isPackage" label="购买量">
          <div class="flex-column">
            <div class="flex-row">
              <el-input-number
                v-model="eipForm.eipPurchaseVolume"
                class="ideal-default-margin-right"
                :min="1"
                :max="20"
              />
              <span class="ideal-warning-text"
                >一次最多可以购买20个弹性公网IP，</span
              ><span class="ideal-tip-text"
                >您还可以购买5个弹性公网IP，如需申请更多配教请点击申请</span
              ><el-text type="primary">扩大配额。</el-text>
            </div>
            <div class="ideal-warning-text">
              如您使用中国大陆境内节点的云服器资源，对外提供网站服务之前，需依法完成ICP备案。
              <el-text type="primary">了解详情。</el-text>
            </div>
          </div>
        </el-form-item>
      </el-card>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { useResourcePool } from '@/utils/common/resource'
import { useBasic } from './basic-config'
import { IHooksBasic } from './interface'

const { isPrivateHuawei, isPublic, isAliyun } = useResourcePool()

const state: IHooksBasic = reactive({})
const basicData = useBasic(state)

const {
  selectRegion,
  selectProject,
  isPackage,
  eipForm,
  eipFormRef,
  bandwidthSize,
  eipNum,
  eipMaximum,
  selectTag,
  isHuawei
} = basicData

// 校验表单
const rules = reactive<FormRules>({
  billingMode: [{ required: true, message: '请选择付费类型', trigger: 'blur' }],
  bandwidthName: [
    { required: true, message: '带宽名称不能为空', trigger: 'blur' }
  ]
})

defineExpose({
  eipFormRef,
  eipForm
})
</script>

<style scoped lang="scss">
.basic-config {
  width: 100%;
  margin-bottom: 40px;

  :deep(.el-form) {
    padding: 0 0 8px;
  }
  :deep .el-form-item--default .el-form-item__label {
    width: 120px;
  }
  :deep(.el-card__header) {
    border-bottom: 0;
  }

  .eip-name-input {
    width: $formInputWidth;
  }

  .current-config__container {
    border-radius: $circleRadiusSize;
    background-color: $gray1-light;
    align-items: center;
    padding: 20px;
    margin-bottom: 20px;
  }

  .custom-input {
    width: 20%;
  }

  .custom-input + .custom-input {
    margin-left: 10px;
  }
  :deep(.custom-radio .el-radio-button__inner) {
    width: 105px;
  }
  :deep(.number-radio .el-radio-button__inner) {
    width: 70px;
  }
  :deep(.el-card__body) {
    padding: 20px 20px 0;
  }
  .custom-tooltip {
    width: 50px;
  }
  :deep .region-input {
    .el-select {
      width: 20%;
    }
  }
}
</style>
