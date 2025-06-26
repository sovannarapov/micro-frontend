<script setup>
definePageMeta({
  layout: 'guide',
});

let $table;

onMounted(() => {
  // console.log('$', $);
  $table = $('#table');
  const rowData = reactive([
    {
      state: 'state 0',
      id: 0,
      name: 'Item 0',
      price: '$0',
      operate: 'operate 0',
    },
    {
      state: 'state 1',
      id: 1,
      name: 'Item 1',
      price: '$0',
      operate: 'operate 1',
    },
  ]);

  $table.bootstrapTable('destroy').bootstrapTable({
    height: 550,
    // locale: $('#locale').val(),
    columns: [
      [
        {
          field: 'state',
          checkbox: true,
          rowspan: 2,
          align: 'center',
          valign: 'middle',
        },
        {
          title: 'Item ID',
          field: 'id',
          rowspan: 2,
          align: 'center',
          valign: 'middle',
          // footerFormatter: totalTextFormatter,
        },
        {
          title: 'Item Detail',
          colspan: 3,
          align: 'center',
        },
      ],
      [
        {
          field: 'name',
          title: 'Item Name',
          // footerFormatter: totalNameFormatter,
          align: 'center',
        },
        {
          field: 'price',
          title: 'Item Price',
          align: 'center',
          // footerFormatter: totalPriceFormatter,
        },
        {
          field: 'operate',
          title: 'Item Operate',
          align: 'center',
          clickToSelect: false,
        },
      ],
    ],
    data: [],
  });
});
</script>

<template>
  <!-- <div class="boardlist">
    <table id="table"></table>
  </div> -->
</template>
