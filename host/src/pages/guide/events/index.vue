<script setup>
import { vue } from '@codemirror/lang-vue';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { oneDark } from '@codemirror/theme-one-dark';

definePageMeta({
  layout: 'guide',
  keepalive: true,
});

const onBlur = e => {
  const { target } = e;
  console.log('on blur', target);
};

const inputValues = reactive({
  a: 0,
  b: 0,
  c: () => computed(() => parseInt(inputValues.a) + parseInt(inputValues.b)),
});
const sum = computed(() => parseInt(inputValues.a) + parseInt(inputValues.b));

for (const item in inputValues) {
  if (!(inputValues[item] instanceof Function)) inputValues[item] = 4;
}
</script>

<template>
  <div>
    <h1>Event</h1>

    <div>
      <p>Capture input blur event</p>
    </div>
    <br />
    <div>
      <b-form-input class="input-0" @blur="onBlur" />
    </div>
    <br />
    <div>
      <b-form-input class="input-1" @blur="onBlur" />
    </div>
    <br />
    <div>
      <b-form-input class="input-2" @blur="onBlur" />
    </div>
    <br /><br />
    <div>
      <p>Calculate input values</p>
    </div>
    <br />
    <div>
      <b-form-input type="number" v-model="inputValues.a" />
    </div>
    <br />
    <div>
      <b-form-input type="number" v-model="inputValues.b" />
    </div>
    <br />
    <div>
      <b-form-input type="number" disabled v-model="sum" />
    </div>
    <br />
  </div>
</template>
