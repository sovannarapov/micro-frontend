<script lang="ts" setup>
import { vue } from '@codemirror/lang-vue';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { oneDark } from '@codemirror/theme-one-dark';

definePageMeta({
  layout: 'guide',
  keepalive: true,
});

const extensions = [javascript(), vue(), html(), oneDark];
const code1 = ref(`// script
const compCallbackUp = () => {
  console.log('compCallbackUp');
};
const openDialogUp = () => {
  const options = { title: 'dialog 1', contents: 'dialog contents 1', callback: compCallbackUp };
  useDialog(options);
};

// template
<b-button variant="outline-primary" @click="openDialogUp">Modal 1</b-button>`);

const code2 = ref(`// script
const compCallbackDown = () => {
  console.log('compCallbackDown');
};
const openDialogDown = () => {
  const options = { title: 'dialog 2', contents: 'dialog contents 2', callback: compCallbackDown };
  useDialog(options);
};

// template
<b-button variant="outline-primary" @click="openDialogDown">Modal 2</b-button>`);

const compCallbackUp = param => {
  console.log('compCallbackUp', param);
};
const compCancelCallbackUp = param => {
  console.log('compCancelCallbackUp', param);
};
const compCallbackDown = param => {
  console.log('compCallbackDown', param);
};

const openDialogUp = () => {
  const options = {
    title: 'dialog 1',
    contents: `<p>contents with <strong>tags</strong><br/><br/>dialog test</p>`, // template literal 방식으로 입력
    callback: compCallbackUp,
    cancelCallback: compCancelCallbackUp,
    param: { test: 'testParam' },
    cancelParam: { test: 'cancel testParam' },
  };

  useDialog(options);
};

const openDialogDown = () => {
  const options = { title: 'dialog 2', contents: 'dialog contents 2', callback: compCallbackDown };

  useDialog(options);
};
</script>
<template>
  <div>
    <h1>Dialog</h1>

    <div>
      <b-button @click="openDialogUp">Modal 1</b-button>
    </div>

    <div>
      <!-- <code-mirror
        v-model="code1"
        basic
        :autofocus="true"
        :indent-with-tab="true"
        :tab-size="2"
        :extensions="extensions"
      /> -->
    </div>

    <div>
      <b-button @click="openDialogDown">Modal 2</b-button>
    </div>
    <div>
      <!-- <code-mirror v-model="code2" basic :indent-with-tab="true" :tab-size="2" :extensions="extensions" /> -->
    </div>
  </div>
</template>
