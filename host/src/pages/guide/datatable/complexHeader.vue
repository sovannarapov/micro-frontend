<script setup>
definePageMeta({
  layout: 'guide',
});

const items = reactive([
  { age: 40, first_name: 'Dickerson', last_name: 'Macdonald', gender: 'M' },
  { age: 21, first_name: 'Larsen', last_name: 'Shaw', gender: 'M' },
  {
    age: 89,
    first_name: 'Geneva',
    last_name: 'Wilson',
    gender: 'M',
  },
  { age: 38, first_name: 'Jami', last_name: 'Carney', gender: 'M' },
  {
    age: 89,
    first_name: 'Geneva',
    last_name: 'Wilson',
    gender: 'M',
  },
  { age: 38, first_name: 'Jami', last_name: 'Carney', gender: 'M' },
  {
    age: 89,
    first_name: 'Geneva',
    last_name: 'Wilson',
    gender: 'M',
  },
  { age: 38, first_name: 'Jami', last_name: 'Carney', gender: 'M' },
  {
    age: 89,
    first_name: 'Geneva',
    last_name: 'Wilson',
    gender: 'M',
  },
  { age: 38, first_name: 'Jami', last_name: 'Carney', gender: 'M' },
  {
    age: 89,
    first_name: 'Geneva',
    last_name: 'Wilson',
    gender: 'M',
  },
  { age: 38, first_name: 'Jami', last_name: 'Carney', gender: 'M' },
  {
    age: 89,
    first_name: 'Geneva',
    last_name: 'Wilson',
    gender: 'M',
  },
  { age: 38, first_name: 'Jami', last_name: 'Carney', gender: 'M' },
]);

const tbodyData = reactive([
  {
    firstName: 'fname 1',
    lastName: 'lname 1',
    age: 11,
    gender: 'M',
    names: 'names 1',
    totalAge: '1111',
    nickName: 'nName 1',
    mix: 'mix 1',
  },
  {
    firstName: 'fname 2',
    lastName: 'lname 2',
    age: 22,
    gender: 'M',
    names: 'names 2',
    totalAge: '2222',
    nickName: 'nName 2',
    mix: 'mix 2',
  },
  {
    firstName: 'fname 3',
    lastName: 'lname 3',
    age: 33,
    gender: 'M',
    names: 'names 3',
    totalAge: '3333',
    nickName: 'nName 3',
    mix: 'mix 3',
  },
  {
    firstName: 'fname 4',
    lastName: 'lname 4',
    age: 44,
    gender: 'M',
    names: 'names 4',
    totalAge: '4444',
    nickName: 'nName 4',
    mix: 'mix 4',
  },
]);

const onClickTable = e => {
  const trs = document.querySelectorAll('#fixed-table tr');
  const { index } = e.target.parentNode.dataset;

  console.log('index', index);
  for (const tr of trs) {
    // click된 tr그룹
    if (tr.dataset.index === index) {
      const tds = tr.querySelectorAll('td');
      // click된 tr그룹 하위 전체 td
      for (const td of tds) {
      }
    }
  }
};
</script>

<template>
  <h1>Datatable - Complex header</h1>

  <div ref="tableau" class="boardlist sticky-head complex-head">
    <b-table id="complex-table" responsive :items="items">
      <template #thead-top>
        <b-tr>
          <b-th>First Name</b-th>
          <b-th>Last Name</b-th>
          <b-th>Age</b-th>
          <b-th colspan="3" rowspan="3">Gender</b-th>
        </b-tr>
        <b-tr>
          <b-th colspan="2">Names</b-th>
          <b-th class="borR">Age</b-th>
        </b-tr>
        <b-tr>
          <b-th>First Name</b-th>
          <b-th colspan="2" class="borR">Mix</b-th>
        </b-tr>
      </template>
    </b-table>
  </div>
  <br /><br />
  <div class="boardlist sticky-head">
    <b-table-simple id="fixed-table" responsive>
      <b-thead head-variant="dark">
        <b-tr>
          <b-th>First Name</b-th>
          <b-th>Last Name</b-th>
          <b-th>Age</b-th>
          <b-th colspan="3" rowspan="3">Gender</b-th>
        </b-tr>
        <b-tr>
          <b-th colspan="2">Names</b-th>
          <b-th class="borR">Total Age</b-th>
        </b-tr>
        <b-tr>
          <b-th>Nick Name</b-th>
          <b-th colspan="2" class="borR">Mix</b-th>
        </b-tr>
      </b-thead>
      <b-tbody @click="onClickTable">
        <template v-for="(item, idx) in tbodyData" :key="idx">
          <b-tr :class="idx % 2 === 0 ? 'evenr' : 'oddr'" :data-index="idx">
            <b-td>{{ item.firstName }}</b-td>
            <b-td>{{ item.lastName }}</b-td>
            <b-td>{{ item.age }}</b-td>
            <b-td colspan="3" rowspan="3">{{ item.age }}</b-td>
          </b-tr>
          <b-tr :class="idx % 2 === 0 ? 'evenr' : 'oddr'" :data-index="idx">
            <b-td colspan="2">{{ item.names }}</b-td>
            <b-td class="borR">{{ item.totalAge }}</b-td>
          </b-tr>
          <b-tr :class="idx % 2 === 0 ? 'evenr' : 'oddr'" :data-index="idx">
            <b-td>{{ item.nickName }}</b-td>
            <b-td colspan="2" class="borR">{{ item.mix }}</b-td>
          </b-tr>
        </template>
      </b-tbody>
    </b-table-simple>
  </div>
</template>
<style scoped>
#complex-table {
  height: 250px;
}
#fixed-table tr.oddr td {
  background-color: rgb(244, 244, 244);
}
</style>
