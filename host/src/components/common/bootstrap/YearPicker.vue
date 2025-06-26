<script lang="ts" setup>
import { enUS } from 'date-fns/locale';
import { format, formatDistanceToNow } from 'date-fns';

const props = defineProps({
  modelValue: {
    default: () => '',
  },
  dateFormat: {
    type: String,
    default: () => 'yyyy',
  },
  initValue: {
    default: () => new Date(),
  },
  readonly: {
    type: Boolean,
    default: () => false,
  },
});
const emit = defineEmits(['update:modelValue']);

const initDate = ref();

const setDate = value => {
  const date = !value ? initDate.value : value;

  emit('update:modelValue', date);
};

const setReadOnly = computed(() => props.readonly);

watch(
  () => props.modelValue,
  (newValue, oldValue) => {
    initDate.value = newValue;
  },
  { deep: true, immediate: true },
);
setDate(props.modelValue);
</script>
<template>
  <div>
    <vue-date-picker
      auto-apply
      year-picker
      text-input
      :readonly="setReadOnly"
      :clearable="true"
      :enable-time-picker="false"
      v-model="initDate"
      @update:model-value="setDate"
    />
  </div>
</template>
