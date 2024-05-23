<template>
  <span v-if="isObject" class="json-preview">
    <span v-if="!!parentKey"
      ><span class="json-preview-key">"{{ parentKey }}"</span> :
    </span>
    <span class="json-preview-symbol">{</span>
    <div class="json-preview-object-block">
      <div v-for="(item, index) in jsonValue" :key="index">
        <span v-if="typeof item.value === 'string'">
          <span class="json-preview-key">"{{ item.key }}"</span> :
          <span class="json-preview-string-value">"{{ item.value }}"</span>
        </span>
        <span v-if="typeof item.value === 'number'">
          <span class="json-preview-key">"{{ item.key }}"</span> :
          <span class="json-preview-number-value">{{ item.value }}</span
          ><span v-if="index != jsonValue.length - 1"> </span>
        </span>
        <span v-if="typeof item.value === 'boolean'">
          <span class="json-preview-key">"{{ item.key }}"</span> :
          <span class="json-preview-boolean-value">{{ item.value }}</span>
        </span>
        <span v-if="typeof item.value === 'object'">
          <ideal-json-preview
            :parent-key="item.key"
            :model-value="item.value"
          />
        </span>
        <span v-if="index != jsonValue.length - 1">,</span>
      </div>
    </div>
    <span class="json-preview-symbol">}</span>
  </span>

  <span v-else>
    <span v-if="!!parentKey"
      ><span class="json-preview-key">"{{ parentKey }}"</span> :
    </span>
    <span class="json-preview-symbol">[</span>
    <div class="json-preview-object-block">
      <div v-for="(item, index) in jsonValue" :key="index">
        <span v-if="typeof item === 'string'">
          <span class="json-preview-string-value">"{{ item }}"</span>
        </span>
        <span v-if="typeof item === 'number'">
          <span class="json-preview-number-value">{{ item }}</span>
        </span>
        <span v-if="typeof item === 'boolean'">
          <span class="json-preview-boolean-value">{{ item }}</span>
        </span>
        <span v-if="typeof item === 'object'">
          <ideal-json-preview :model-value="item" />
        </span>
        <span v-if="index != jsonValue.length - 1">,</span>
      </div>
    </div>
    <span class="json-preview-symbol">]</span>
  </span>
</template>

<script setup lang="ts" name="IdealJsonPreview">
interface IdealJsonPreviewProps {
  modelValue?: any
  parentKey?: string
}

const props = withDefaults(defineProps<IdealJsonPreviewProps>(), {
  modelValue: () => ({}),
  parentKey: ''
})

const jsonValue = computed(() => {
  if (!!!props.modelValue) {
    return {}
  }
  if (typeof props.modelValue === 'string') {
    let value = JSON.parse(props.modelValue)
    let jsonValue = []
    for (let key in value) {
      jsonValue.push({
        key: key,
        value: value[key]
      })
    }
    return jsonValue
  }
  if (
    typeof props.modelValue === 'object' &&
    !(props.modelValue instanceof Array)
  ) {
    let jsonValue = []
    for (let key in props.modelValue) {
      jsonValue.push({
        key: key,
        value: props.modelValue[key]
      })
    }
    return jsonValue
  }
  return props.modelValue
})

const isObject = computed(() => {
  return !(props.modelValue instanceof Array)
})
</script>

<style scoped lang="scss">
.json-preview {
  font-size: $defaultFontSize;
  font-weight: 400;
  &-object-block {
    margin: 5px 0 5px 2px;
    border-left: dotted 1px;
    padding-left: 30px;
  }
  &-symbol {
    color: #2c3e50;
  }
  &-key {
    color: #09a43a;
  }
  &-number-value {
    color: #0e69eb;
  }
  &-string-value {
    color: #0dbc79;
  }
  &-boolean-value {
    color: #c678dd;
  }
}
</style>
