<script setup>
import { vue } from '@codemirror/lang-vue';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { oneDark } from '@codemirror/theme-one-dark';

definePageMeta({
  layout: 'guide',
  keepalive: true,
});

const nuxtApp = useNuxtApp();
const {
  $global: { sessionInfo },
} = nuxtApp;

const extensions = [javascript(), vue(), html(), oneDark];
const code = ref(`// script
const nuxtApp = useNuxtApp();
const {
  $global: { sessionInfo },
} = nuxtApp;

// template
<p>{{ sessionInfo }}</p>`);
</script>

<template>
  <div>
    <h1>Session</h1>

    <div>
      <p>Get Session Info</p>
      <p>{{ sessionInfo }}</p>
    </div>
    <br />
    <div>
      <code-mirror
        v-model="code"
        basic
        :autofocus="true"
        :indent-with-tab="true"
        :tab-size="2"
        :extensions="extensions"
      />
    </div>
  </div>
</template>
