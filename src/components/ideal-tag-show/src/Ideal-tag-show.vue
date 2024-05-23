<template>
  <div>
    <div class="tagItem">
      <div v-show="row[tagKey]?.length > 0">
        <el-popover placement="right" trigger="hover" :width="popverWidth">
          <template #reference>
            <el-button link type="primary">{{ row[tagKey]?.length }}</el-button>
          </template>
          <div
            v-for="(item, index) in row[tagKey]"
            :key="index"
            class="flex-row tagList"
          >
            <el-tooltip :key="index" :content="item.labelName" placement="top">
              <div
                v-if="item.labelType === 320001"
                class="tagItemPublic"
                :style="
                  'border:' +
                  '2px' +
                  ' ' +
                  'solid' +
                  ' ' +
                  item.color +
                  ';' +
                  'background:' +
                  item.color +
                  ';'
                "
              >
                {{ item.labelName }}
              </div>
              <div
                v-else
                class="tagItemPrivate"
                :style="
                  'border:' +
                  '2px' +
                  ' ' +
                  'solid' +
                  ' ' +
                  item.color +
                  ';' +
                  'color:' +
                  item.color +
                  ';'
                "
              >
                {{ item.labelName }}
              </div>
            </el-tooltip>
          </div>
        </el-popover>
      </div>
    </div>
    <el-text v-show="row[tagKey]?.length === 0" type="primary">0</el-text>
  </div>
</template>

<script setup lang="ts">
interface IdealTagShowProps {
  row?: any // 行数据
  tagKey?: string //标签字段
}

const props = withDefaults(defineProps<IdealTagShowProps>(), {
  row: () => ({}),
  tagKey: 'labels'
})

const popverWidth = ref('')
onMounted(() => {
  popverWidth.value = props.row[props.tagKey]?.length > 1 ? '230px' : '100px'
})
</script>

<style scoped lang="scss">
.tagList {
  display: inline-block;
  width: 100px;
  .tagItemPublic,
  .tagItemPrivate {
    border-radius: 3px;
    box-sizing: border-box;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 5px;
    margin: 5px 5px 0;
  }
  .tagItemPublic {
    color: #ffffff;
  }
}
</style>
