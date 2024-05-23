<template>
  <div class="organizeScene">
    <el-tabs v-model="tabActiveName">
      <el-tab-pane label="个人" name="personal"></el-tab-pane>
      <el-tab-pane
        v-if="organizePermission"
        label="VDC"
        name="organize"
        :disabled="!isAgentOpen"
      >
        <el-cascader
          v-model="cascaderList"
          placeholder="请搜索或选择VDC"
          :options="organizeList"
          :props="selectItem.props"
          collapse-tags
          clearable
          filterable
          style="min-width:260px"
          @change="organizeChange"
        ></el-cascader>
      </el-tab-pane>
      <el-tab-pane
        v-if="projectPrmission"
        label="项目"
        name="project"
        :disabled="!isAgentOpen"
      >
        <el-cascader
          v-model="projectValue"
          style="min-width:260px"
          placeholder="请搜索或选择项目"
          :options="projectList"
          :props="selectItem.props"
          collapse-tags
          clearable
          filterable
          @change="projectChange"
        ></el-cascader>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
const organizePermission = true
const projectPrmission = true
const isAgentOpen = true
const tabActiveName = ref('personal')
const cascaderList: any = []
const organizeList: any = []
const projectValue: any = []
const projectList: any = []
const selectItem: any = ref({})

const organizeChange = () => {}
const projectChange = () => {}

</script>

<style scoped>

</style>