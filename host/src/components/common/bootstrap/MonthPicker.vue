<script lang="ts" setup>
  import { enUS } from 'date-fns/locale';
  import dayjs from 'dayjs';
  import { allowNumberOnly, parseDateInfo, parseDateLoan } from '@/common/util/helpers';

  const props = defineProps({
    modelValue: {
      default: () => '',
    },
    dateFormat: {
      type: String,
      default: () => 'MMyyyy',
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

  const localFormat = ref('MMM-yyyy');
  const initDate = ref();
  const alterFormat = event => {
    if (event === 'c') {
      localFormat.value = 'MMM-yyyy';
      calInputRef.value.blur();
    }
    if (event === 'o') {
      localFormat.value = 'MMyyyy';
      calInputRef.value.focus();
    }
  };
  const setDate = (value, type?) => {
    const fmtDate = ref('');

    if (typeof value === 'string') {
      if (!type) fmtDate.value = initDate.value;
      // key-in 으로 입력한 경우
      if (type === 'm' && value.length === 6) {
        if (props.dateFormat === 'yyyyMM') fmtDate.value = value.slice(2, 6) + value.slice(0, 2);
        if (props.dateFormat === 'MMyyyy') fmtDate.value = value;
      }
    }

    if (!value) {
      emit('update:modelValue', value);
    }

    // calendar 로 선택한 경우
    if (!!value && typeof value === 'object') {
      const { month, year } = value;
      const fmt = props.dateFormat === 'MMyyyy' ? 'MMYYYY' : 'YYYYMM';

      fmtDate.value = dayjs(`${year}-${month + 1}`).format(fmt);
    }

    if (fmtDate.value.length === 6) emit('update:modelValue', fmtDate.value);
  };

  watch(
    () => props.modelValue,
    (newValue, oldValue) => {
      initDate.value = newValue;
    },
    { deep: true, immediate: true },
  );

  // clear 시
  watch(
    () => initDate,
    (newValue, oldValue) => {
      setDate(newValue.value);
    },
    { deep: true, immediate: true },
  );

  const setReadOnly = computed(() => props.readonly);

  setDate(props.modelValue);

  const calRef = ref();
  const calInputRef = ref();

  onMounted(() => {
    calInputRef.value = calRef.value.$el.querySelector('input');
    calInputRef.value.addEventListener('keypress', function (e) {
      if (e.which !== 13) {
        if (e.target.value.length >= 6) e.preventDefault();
      }
      if (e.which === 13) {
        if (e.target.value.length === 6) calInputRef.value.blur();
      }

      allowNumberOnly(e);
    });
    calInputRef.value.addEventListener('keyup', function (e) {
      e.target.value = e.target.value.replace(/[\ㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
    });
  });
</script>
<template>
  <vue-date-picker
    ref="calRef"
    auto-apply
    month-picker
    locale="en"
    text-input
    :readonly="setReadOnly"
    :clearable="true"
    :format-locale="enUS"
    :format="localFormat"
    :model-type="dateFormat"
    :year-range="[1800, 9999]"
    v-model="initDate"
    @open="() => alterFormat('o')"
    @closed="() => alterFormat('c')"
    @input="e => setDate(e.target.value, 'm')"
  />
</template>
