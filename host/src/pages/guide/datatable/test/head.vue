<script setup>
definePageMeta({
  layout: 'guide',
});

const data = ref([
  {
    user_data: [
      {
        amount: 2550,
        time1: '2017/04/05',
        time2: '2017/04/06',
      },
      {
        amount: 2550,
        time1: '2017/04/05',
        time2: '2017/04/06',
      },
    ],
    name: 'hulk',
  },
  {
    user_data: [
      {
        amount: 2125,
        time1: '2017/04/05',
        time2: '2017/04/06',
      },
      {
        amount: 1700,
        time1: '2017/04/05',
        time2: '2017/04/06',
      },
      {
        amount: 1700,
        time1: '2017/04/05',
        time2: '2017/04/06',
      },
      {
        amount: 2125,
        time1: '2017/04/05',
        time2: '2017/04/06',
      },
    ],
    name: 'gomu',
  },
]);

onMounted(() => {
  let tableStr = '';
  data.value.forEach(obj => {
    const userData = obj.user_data;
    let total = 0;

    userData.forEach((o, index) => {
      tableStr +=
        '<tr>' +
        (index == 0 ? '<td rowspan="' + userData.length + '">' + obj.name + '</td>' : '') +
        '<td>' +
        o.time1 +
        '</td><td>' +
        o.time2 +
        '</td><td>' +
        o.amount +
        '</td></tr>';
      total += o.amount;
    });
    tableStr += '<tr><td colspan="3">Total</td><td>' + total + '</td></tr>';
  });
  $('#user thead').html(tableStr);
  console.log('tableStr', tableStr);
});
</script>

<template>
  <div class="boardlist">
    <table id="user">
      <thead>
        <tr>
          <th>User Name</th>
          <th>Time 1</th>
          <th>Time 2</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>
</template>
