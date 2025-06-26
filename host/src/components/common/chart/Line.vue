<script setup lang="ts">
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'vue-chartjs';

interface ColumnType {
  type: String;
  name: String;
}

interface DefaultProps {
  columns: ColumnType[];
  data: [];
  options: [];
}

const props = withDefaults(defineProps<DefaultProps>(), {
  columns: () => [],
  data: () => [],
  options: () => [],
});

window.setTimeout(() => {
  const google = window['google'];
  google.charts.load('current', { packages: ['corechart', 'line'] });
  google.charts.setOnLoadCallback(drawBackgroundColor);

  function drawBackgroundColor() {
    const data = new google.visualization.DataTable();

    for (const column of props.columns) {
      data.addColumn(column.type, column.name);
    }

    data.addRows(props.data);

    const options = props.options;

    // const chartDiv = document.getElementById('chart_div');
    // const materialChart = new google.charts.Line(chartDiv);
    // materialChart.draw(data, options);

    const chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    chart.draw(data, google.charts.Line.convertOptions(options));
    // chart.draw(data, options);
  }
}, 1000);
</script>
<template>
  <div id="chart_div"></div>
</template>
