<script lang="ts" setup>
import { enUS } from 'date-fns/locale';
import dayjs from 'dayjs';

const props = defineProps({
  modelValue: {
    default: () => '',
  },
  dateFormat: {
    type: String,
    default: () => 'ddMMyyyy',
  },
  initValue: {
    default: () => new Date(),
  },
  range: {
    default: false,
    type: Boolean,
  },
  dateRange: {
    default: 1,
    type: Number,
  },
  readonly: {
    type: Boolean,
    default: () => false,
  },
});
const emit = defineEmits(['update:modelValue']);

const datepicker = ref();
const localFormat = ref('dd-MMM-yyyy');
const dayJsFormat = {
  ddMMyyyy: 'DDMMYYYY',
  yyyyMMdd: 'YYYYMMDD',
};
const initDate = ref();
const selectDate = date => {
  const selectedDates = date ? toRaw(date) : [];

  if (selectedDates.length === 1) {
    const selectedDate = toRaw(selectedDates)[0];
    const startDate = dayjs(new Date(selectedDate)).format(dayJsFormat[props.dateFormat]);
    const endDate = dayjs(new Date(selectedDate)).add(props.dateRange, 'days').format(dayJsFormat[props.dateFormat]);

    setDate([startDate, endDate]);
    datepicker.value.closeMenu();
  }
};
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
  <vue-date-picker
    auto-apply
    locale="en"
    week-start="0"
    ref="datepicker"
    :readonly="setReadOnly"
    :clearable="false"
    :format-locale="enUS"
    :format="localFormat"
    :enable-time-picker="false"
    :year-range="[1800, 9999]"
    :model-type="dateFormat"
    :range="range"
    v-model="initDate"
    @internal-model-change="selectDate"
    @update:model-value="setDate"
  />
</template>
