<template>
  <div class="ideal-large-margin optimize-strategy-create">
    <el-form
      ref="formRef"
      :model="form"
      label-position="left"
      :rules="rules"
      class="optimize-strategy-create-form"
    >
      <el-form-item>
        <div class="flex-row ideal-header-container">
          <el-divider direction="vertical" />
          <div>基本信息</div>
        </div>
      </el-form-item>

      <el-form-item label="名称" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入内容"
          class="custom-input"
        />
      </el-form-item>

      <el-form-item label="描述">
        <el-input
          v-model="form.description"
          placeholder="请输入内容"
          type="textarea"
          class="custom-input"
        />
      </el-form-item>

      <el-form-item label="资源类型" prop="resourceType">
        <el-select
          v-model="form.resourceType"
          placeholder="请选择"
          class="custom-input"
        >
          <el-option
            v-for="(item, index) in resourceList"
            :key="index"
            :label="item.name"
            :value="item.code"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="影响程度" required>
        <el-radio-group v-model="form.influenceDegree">
          <el-radio
            v-for="(item, index) in degreeGrade"
            :key="index"
            :label="item.value"
            >{{ item.label }}</el-radio
          >
        </el-radio-group>
      </el-form-item>

      <el-form-item label="启用" required>
        <el-switch v-model="form.enable" />
      </el-form-item>

      <el-form-item>
        <div class="flex-row ideal-header-container">
          <el-divider direction="vertical" />
          <div>策略规则</div>
        </div>
      </el-form-item>

      <el-form-item label="资源停机超过时长">
        <el-input-number
          v-model="form.duration"
          class="ideal-default-margin-right"
          :min="1"
          controls-position="right"
        ></el-input-number
        >天
      </el-form-item>

      <el-form-item label="配置负载指标">
        <div class="flex-column optimize-strategy-create-index">
          <el-button link type="primary" @click="clickAddIndex">
            <svg-icon
              icon="circle-add"
              class="ideal-svg-margin-right"
            ></svg-icon>
            新增
          </el-button>

          <ideal-table-list
            :table-data="loadIndexData"
            :table-headers="tableHeaders"
            :show-pagination="false"
          >
            <template #optimizingStrategyType>
              <el-table-column label="负载指标" width="160px">
                <template #default="props">
                  <el-select
                    v-model="props.row.optimizingStrategyType"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, idx) of indexList"
                      :key="idx"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
            </template>

            <template #thresholdValue>
              <el-table-column label="阈值" width="490px">
                <template #default="props">
                  <el-row :gutter="10">
                    <el-col :span="8">
                      <el-select
                        v-model="props.row.operatorType"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="(item, idx) of compareValues"
                          :key="idx"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="8">
                      <el-select
                        v-model="props.row.comparatorSign"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="(item, idx) of compareMethods"
                          :key="idx"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="8">
                      <el-input-number
                        v-model="props.row.thresholdValue"
                        controls-position="right"
                      ></el-input-number>
                    </el-col>
                  </el-row>
                </template>
              </el-table-column>
            </template>

            <template #timeDimension>
              <el-table-column label="时间维度" width="160px">
                <template #default="props">
                  <el-select
                    v-model="props.row.timeDimension"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, idx) of timeList"
                      :key="idx"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
            </template>

            <template #operation>
              <el-table-column label="操作" width="120">
                <template #default="props">
                  <svg-icon
                    icon="delete-icon"
                    color="var(--el-color-primary)"
                    @click="clickDeleteIndex(props.$index)"
                  ></svg-icon>
                </template>
              </el-table-column>
            </template>
          </ideal-table-list>
        </div>
      </el-form-item>

      <el-form-item>
        <div class="flex-row ideal-header-container">
          <el-divider direction="vertical" />
          <div>作用范围</div>
        </div>
      </el-form-item>

      <el-form-item label="维度选择">
        <el-radio-group v-model="form.dimension">
          <el-radio-button
            v-for="(item, index) in allDimension"
            :key="index"
            :label="item.value"
            @change="dimensionChange"
            >{{ item.label }}</el-radio-button
          >
        </el-radio-group>
      </el-form-item>

      <template v-if="form.dimension === 'POOL_RESOURCE'">
        <el-form-item label="云平台选择" prop="platForm">
          <el-select
            v-model="form.platForm"
            placeholder="请选择"
            class="custom-input"
          >
            <el-option
              v-for="(item, index) in platformList"
              :key="index"
              :label="item.information.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源池选择" prop="resourcePool">
          <el-select
            v-model="form.resourcePool"
            multiple
            collapse-tags
            placeholder="请选择"
            class="custom-input"
          >
            <el-option
              v-for="(item, index) in resourcePoolList"
              :key="index"
              :label="item.information.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </template>

      <el-form-item
        v-if="form.dimension === 'VDC'"
        label="VDC选择"
        prop="vdcMulti"
      >
        <el-tree-select
          v-model="form.vdcMulti"
          :data="vdcTree"
          multiple
          collapse-tags
          :render-after-expand="false"
          :props="defaultProps"
          check-strictly
          class="custom-input"
        />
      </el-form-item>

      <template v-if="form.dimension === 'PROJECT'">
        <el-form-item label="VDC选择" prop="vdc">
          <el-tree-select
            v-model="form.vdc"
            :data="vdcTree"
            :render-after-expand="false"
            :props="defaultProps"
            check-strictly
            class="custom-input"
          />
        </el-form-item>

        <el-form-item label="项目选择" prop="project">
          <el-select
            v-model="form.project"
            multiple
            collapse-tags
            placeholder="请选择"
            class="custom-input"
          >
            <el-option
              v-for="(item, index) in projectList"
              :key="index"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </template>

      <el-form-item>
        <div class="flex-row ideal-header-container">
          <el-divider direction="vertical" />
          <div>消息通知</div>
        </div>
      </el-form-item>

      <el-form-item label="通知到用户">
        <el-select
          v-model="form.user"
          placeholder="请选择"
          class="custom-input"
        >
          <el-option
            v-for="(item, index) in userList"
            :key="index"
            :label="item.username"
            :value="item.id.toString()"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="通知到角色">
        <el-select
          v-model="form.character"
          placeholder="请选择"
          class="custom-input"
        >
          <el-option
            v-for="(item, index) in characterList"
            :key="index"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <div class="flex-row ideal-header-container">
          <el-divider direction="vertical" />
          <div>优化建议</div>
        </div>
      </el-form-item>

      <el-form-item label="建议">
        <el-select
          v-model="form.suggestion"
          placeholder="请选择"
          class="custom-input"
        >
          <el-option
            v-for="(item, index) in suggestionList"
            :key="index"
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
  </div>
</template>
<script lang="ts" setup>
import { createData } from './create'

const { t } = useI18n()
const {
  tableHeaders,
  degreeGrade, //影响程度
  indexList, //负载指标
  compareValues, //比较值
  compareMethods, //比较方法
  timeList,
  allDimension, //所有维度
  resourceList, //资源类型
  platformList, //云平台
  resourcePoolList, //资源池
  vdcTree, //vdc数
  defaultProps, //vdc数的节点
  projectList, //项目
  userList, //用户
  characterList, //角色
  suggestionList, //建议
  formRef,
  form,
  rules,
  clickAddIndex,
  clickDeleteIndex,
  loadIndexData,
  dimensionChange, //维度切换
  cancelForm,
  submitForm
} = createData()
</script>
<style lang="scss" scoped>
.optimize-strategy-create {
  box-sizing: border-box;
  :deep(.el-divider--vertical) {
    border-left: 1px var(--el-color-primary) var(--el-border-style);
  }
  .optimize-strategy-create-form {
    background-color: white;
    padding: 20px;
  }
  .optimize-strategy-create-index {
    align-items: flex-start;
    // width: 60%;
  }
  :deep(.el-form-item--default .el-form-item__label) {
    width: 130px;
    margin-right: 16px;
  }
  .custom-input {
    width: $formInputWidth;
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
  :deep(.el-radio-button__inner) {
    width: 100px;
  }
  .ideal-header-container {
    width: 100%;
  }
}
</style>
