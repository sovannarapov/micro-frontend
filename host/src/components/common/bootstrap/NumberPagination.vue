<script setup>
import { useArrayPagination } from 'vue-composable';

const array = new Array(1000).fill(0).map((_, i) => i);
const { next, prev, currentPage, lastPage, result, pageSize, offset } = useArrayPagination(array, {});
</script>

<template>
  <div id="arrayPagination">
    <p>page {{ currentPage }} of {{ lastPage }}</p>
    <p>
      <label for="pageSize">Page size</label>
      <input name="pageSize" v-model.number="pageSize" type="number" />
    </p>
    <p>
      <button @click="prev">prev</button>
      <button @click="next">next</button>
    </p>
    <ul>
      <li v-for="n in result" :key="n">
        {{ n }}
      </li>
    </ul>
  </div>
</template>
