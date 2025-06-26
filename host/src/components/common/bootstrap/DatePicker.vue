<script lang="ts" setup>
  import { enUS } from 'date-fns/locale';
  import { getSessionInfo, allowNumberOnly, parseDateInfo, parseDateLoan } from '@/common/util/helpers';

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
    readonly: {
      type: Boolean,
      default: () => false,
    },
    state: {
      type: Boolean,
      default: () => null,
    },
    class: {
      type: String,
      default: () => '',
    },
    minDate: {
      type: Date,
      default: () => null,
    },
  });
  const emit = defineEmits(['update:modelValue', 'closed']);

  const localFormat = ref('dd-MMM-yyyy');
  const initDate = ref();
  const alterFormat = event => {
    if (event === 'c') {
      localFormat.value = 'dd-MMM-yyyy';

      if (!initDate.value) emit('update:modelValue', undefined);
    }
    if (event === 'o') {
      localFormat.value = 'ddMMyyyy';
    }
  };
  const setDate = value => {
    const date = ref(!value ? initDate.value : value);

    if (typeof date.value === 'string' && !date.value) return false;
    if (date.value === null) date.value = undefined;

    emit('update:modelValue', date.value);
  };

  const setReadOnly = computed(() => props.readonly);
  const minDateParsed = ref();
  const textInputOptions = {
    format: value => {
      console.log('value', value);
    },
  };

  const onClosed = () => {
    alterFormat('c');
    emit('closed');
  };

  watch(
    () => props.modelValue,
    (newValue, oldValue) => {
      initDate.value = newValue;
    },
    { deep: true, immediate: true },
  );

  watch(
    () => props.minDate,
    val => {
      minDateParsed.value = props.dateFormat === 'yyyyMMdd' ? parseDateInfo(val) : parseDateLoan(val);
    },
    { deep: true, immediate: true },
  );

  const serverDate = getSessionInfo().tranBaseYmd;

  if (!props.modelValue) setDate('')
  // if (props.modelValue === null) setDate(serverDate)
  if (props.modelValue) setDate(props.modelValue)

  const calRef = ref();
  const calInputRef = ref();

  defineExpose({
    calRef
  })

  onMounted(() => {
    calInputRef.value = calRef.value.$el.querySelector('input');
    calInputRef.value.addEventListener('keypress', function (e) {
      if (e.which !== 13) {
        if (e.target.value.length >= 8) e.preventDefault();
      }

      allowNumberOnly(e);
    });
    calInputRef.value.addEventListener('keyup', function (e) {
      e.target.value = e.target.value.replace(/[\ㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
    });
  });
</script>
<template>
  <div :class="setReadOnly ? 'read-only' : ''">
    <vue-date-picker
      ref="calRef"
      auto-apply
      locale="en"
      text-input
      week-start="0"
      v-model="initDate"
      :teleport="true"
      :readonly="setReadOnly"
      :clearable="true"
      :format-locale="enUS"
      :format="localFormat"
      :enable-time-picker="false"
      :year-range="[1800, 9999]"
      :model-type="dateFormat"
      :state="props.state"
      :class="props.class"
      :min-date="minDateParsed"
      @open="() => alterFormat('o')"
      @closed="onClosed"
      @update:model-value="setDate"
    />
  </div>
</template>
