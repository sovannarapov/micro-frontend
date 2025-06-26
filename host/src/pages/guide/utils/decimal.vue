<script setup>
  import { vue } from '@codemirror/lang-vue';
  import { javascript } from '@codemirror/lang-javascript';
  import { html } from '@codemirror/lang-html';
  import { oneDark } from '@codemirror/theme-one-dark';

  definePageMeta({
    layout: 'guide',
    keepalive: true,
  });

  const extensions = [javascript(), vue(), html(), oneDark];
  const code = ref(`
const numA = ref(0.13)
const numB = ref(0.21)

// toFixed(소수점 길이)
const fixedSum = ref(+(numA.value + numB.value).toFixed(2))
`);

  const numA = ref(0.13);
  const numB = ref(0.21);

  const sum = ref(numA.value + numB.value);
  const fixedSum = ref(+(numA.value + numB.value).toFixed(2));

  console.log('sum', fixedSum.value, ' vs ', sum.value);
</script>
<template>
  <div>
    <p>소수점 계산</p>
    <br /><br />
    <code-mirror
      v-model="code"
      basic
      :autofocus="true"
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="extensions"
    />
  </div>
</template>
