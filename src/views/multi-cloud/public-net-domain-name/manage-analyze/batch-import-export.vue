<template>
  <div>
    <div class="ideal-tip-text">
      <div>温馨提示</div>
      <ul>
        <li>上传文件格式支持xlsx，大小不超过2MB。</li>
        <li>
          云解析DNS会按照预定模板扫描您的文件，并导入数据。<el-text
            type="primary"
            >查看模板</el-text
          >
        </li>
        <li>
          解析记录线路类型字段填写请参考帮助中心文档。<el-text type="primary"
            >线路填写规则</el-text
          >
        </li>
        <li>每次最多可以导入500条解析记录，超出的部分将不会导入。</li>
      </ul>
    </div>

    <div class="ideal-large-margin-top border-box">
      <div class="import-success_container"><span>导入成功记录</span></div>
      <div class="import-success_sub-container">导入成功记录数:0</div>
    </div>

    <div class="ideal-large-margin-top border-box">
      <div class="import-fail_container"><span>导入失败记录</span></div>
    </div>

    <ideal-table-list
      :table-data="tableData"
      :table-headers="tableHeader"
      :show-pagination="false"
    >
    </ideal-table-list>
  </div>
</template>

<script setup lang="ts">
import type { IdealTableColumnHeaders } from '@/types'

const tableData: any = ref([])
const tableHeader: IdealTableColumnHeaders[] = [
  { label: '域名', prop: 'name' },
  { label: '状态', prop: 'statusText' },
  { label: '类型', prop: 'type' },
  { label: '线路类型', prop: 'type' },
  { label: 'TTL(秒)', prop: 'ttl' },
  { label: '值', prop: 'value' },
  { label: '权重', prop: 'weight' },
  { label: '失败原因', prop: 'reason' }
]
</script>

<style scoped lang="scss">
ul li {
  margin-left: 14px;
}
.import-success_container,
.import-fail_container {
  border-left: 5px solid $brand5-light;
  background-color: $gray1-light;
  padding: 10px 20px;
  font-size: $mediumFontSize;
}
.import-success_container {
  border-bottom: 1px solid $gray6-light;
}
.import-fail_container {
  border-bottom: 1px solid $brand5-light;
}
.import-success_sub-container {
  padding: 10px 25px;
}
.border-box {
  border: 1px solid $gray6-light;
}
</style>
