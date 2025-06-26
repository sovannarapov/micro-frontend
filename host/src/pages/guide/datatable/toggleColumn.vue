<script setup>
definePageMeta({
  layout: 'guide',
});

// 원본 필드
const oriFields = reactive([
  { key: 'No', label: 'No' },
  {
    key: 'first_name',
    label: 'First Name',
    class: 'text-left',
    formatter: value => {
      return value;
    },
  },
  { key: 'last_name', label: 'Last Name', class: 'text-left' },
  { key: 'age', label: 'Age' },
]);
// 체크박스로 선택된 필드 명
const selected = ref(['No', 'first_name', 'last_name', 'age']);
// 선택된 필드 필터링하여 반영
const fields = computed(() => {
  const arrs = [];
  for (const field of oriFields) {
    for (const select of selected.value) {
      if (field.key === select) arrs.push(field);
    }
  }

  return arrs;
});

// 테스트용 데이터
const items = reactive(
  new Array(20).fill(null).map((_, index) => ({
    age: 10 + index,
    first_name: index % 4 === 0 ? '     ' : `Dickerson ${index}`,
    last_name: `Macdonald ${index}`,
  })),
);

const hideTestTable = ref();
const hideRows = () => {
  window.setTimeout(() => {
    // table 내 div들 검색
    const divs = hideTestTable.value.querySelectorAll('tr td div');

    for (const div of divs) {
      // html data 속성 추출
      const isInvisible = div.dataset['visibility'];

      if (/true/i.test(isInvisible)) {
        // hidden 속성이 적용된 row 감춤 처리
        div.parentNode.parentNode.style.display = 'none';
      }
    }
  }, 0);
};

watch(
  () => items,
  value => {
    // datatable 존재 시 row 감춤 실행
    hideRows();
  },
  { deep: true, immediate: true },
);
</script>

<template>
  <h1>Datatable - toggle fileds</h1>
  <br /><br />
  <b-form-checkbox-group
    v-model="selected"
    :options="oriFields"
    value-field="key"
    text-field="label"
  ></b-form-checkbox-group>
  <br />
  <div ref="hideTestTable" class="boardlist">
    <b-table :items="items" :fields="fields">
      <template #cell(No)="row">
        <!-- first_name 필드값이 비었을 경우 html data visibility true로 적용 -->
        <div :data-visibility="row.item.first_name.trim().length === 0">{{ row.index + 1 }}</div>
      </template>
    </b-table>
  </div>
</template>
