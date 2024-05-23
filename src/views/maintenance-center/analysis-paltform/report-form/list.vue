<template>
  <div class="flex-row report-form">
    <div class="report-form-left">
      <div class="flex-row report-form__title">
        <el-divider direction="vertical" />
        <div>报告报表</div>
      </div>

      <div class="flex-row report-form__btn">
        <div class="folder-button" style="width: 30%">
          <span> 新建文件夹</span>
        </div>
        <div class="analyze-button" style="width: 30%">
          <span> 新建分析</span>
        </div>
      </div>

      <el-menu
        :default-active="selectTemplate"
        class="el-menu__level"
        mode="horizontal"
        :ellipsis="false"
      >
        <el-menu-item
          v-for="(item, index) in menuList"
          :key="index"
          :index="item.name"
        >
          <template #title>
            <svg-icon icon="layers"></svg-icon>
            <span>{{ item.title }}</span>
          </template>
        </el-menu-item>
      </el-menu>

      <el-menu :default-active="defaultFile" class="el-menu-vertical">
        <el-sub-menu
          v-for="(item, index) in sidebar"
          :key="index"
          :index="item.index"
        >
          <template #title>
            <svg-icon icon="folder"></svg-icon>
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item
            v-for="(ele, index) in item.childrenList"
            :key="index"
            :index="ele.name"
            @click="handleSelect(ele)"
          >
            <template #title>
              <svg-icon icon="chart"></svg-icon>
              <span>{{ ele.title }}</span>
            </template>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>
    <div class="report-form-right">
      <div class="flex-row report-form__file-title">
        <div style="font-size: 15px; font-weight: 600">{{ fileName }}</div>
        <div class="flex-row" style="line-height: 16px">
          <div class="analyze-button">
            <span> 编辑报告</span>
          </div>
          <div class="operate-button">
            <span> 刷新数据</span>
          </div>
          <el-select v-model="exportFile" placeholder="导出">
            <el-option
              v-for="item in options"
              :key="item.prop"
              :label="item.label"
              :value="item.prop"
            />
          </el-select>
          <el-select v-model="shareFile" placeholder="分享">
            <el-option
              v-for="item in options"
              :key="item.prop"
              :label="item.label"
              :value="item.prop"
            />
          </el-select>
          <div class="operate-button">
            <span>全屏</span>
          </div>
        </div>
      </div>
      <chart-data v-if="selectFile === '1'"></chart-data>
      <sql-data v-if="selectFile === '2'"></sql-data>
    </div>
  </div>
</template>

<script lang="ts" setup>
import chartData from './chart-data.vue'
import sqlData from './SQL-data.vue'
import type { IdealTextProp } from '@/types'

const fileName = ref('')
const defaultFile = ref('1')
const selectFile = ref('1')
const handleSelect = (file: any) => {
  fileName.value = file.title
  selectFile.value = file.name
}
onMounted(() => {
  fileName.value = sidebar.value[0].childrenList[0].title
})

const selectTemplate = ref('personage')
const menuList = ref([
  { title: '个人模板', name: 'personage' },
  { title: '系统模板', name: 'system' }
])

const sidebar: any = ref([
  {
    title: '文件夹1',
    index: 'file-1',
    childrenList: [
      { title: '图表数据分析', name: '1' },
      { title: 'SQL数据分析', name: '2' },
      { title: '报表计算分析', name: '3' },
      { title: '测试', name: '4' }
    ]
  },
  { title: '文件夹2', index: 'file-2' }
])
const exportFile: any = ref('')
const shareFile: any = ref('')
const options: IdealTextProp[] = []
</script>
<style lang="scss" scoped>
@import './custom.scss';
</style>
