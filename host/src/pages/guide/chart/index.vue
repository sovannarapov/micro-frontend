<script setup>
definePageMeta({
  layout: 'guide',
  keepalive: true,
});

let year = 2019;
let month = 0;
const randomNumber = (min, max) => Math.round(Math.random() * (max - min) + min);
const mockDates = new Array(240).fill(0).map((_, key) => {
  key % 12 === 0 ? year++ : year;
  key % 12 === 0 ? (month = 0) : month++;

  return [new Date(year, month)];
});
const tickDates = mockDates.map((date, key) => date[0]);
const mockData = mockDates.map((date, key) => {
  const ranNo = [randomNumber(4000, 4250)];

  return date.concat(ranNo);
});

const columns = [
  { type: 'date', name: 'Month' },
  { type: 'number', name: 'Average Temperature' },
];
const data = mockData;

const options = {
  legend: { position: 'none' },
  title: 'Average Temperatures and Daylight in Iceland Throughout the Year',
  chartArea: { width: '90%' },
  width: '100%',
  height: 500,
  // Gives each series an axis that matches the vAxes number below.
  series: {
    0: { targetAxisIndex: 0 },
    1: { targetAxisIndex: 1 },
  },
  vAxes: {
    // Adds titles to each axis.
    // 0: { title: 'Temps (Celsius)' },
    // 1: { title: 'Daylight' },
  },
  // curveType: 'function',
  pointSize: 1,
  hAxis: {
    textStyle: { fontSize: 12 },
    slantedText: true,
    format: 'MMM-yyyy',
    // ticks: tickDates,
    showTextEvery: 1,
    gridlines: {
      color: '#CCC',
      interval: 10,
      multiple: 60,
    },
    logScale: false,
    interpolateNulls: 'absolute',
  },
  vAxis: {
    minValue: 3000,
    textStyle: { fontSize: 12 },
    logScale: true,
  },
};
</script>
<template>
  <div><common-chart-line :columns="columns" :data="data" :options="options" /></div>
  <div id="chart_div"></div>
</template>
