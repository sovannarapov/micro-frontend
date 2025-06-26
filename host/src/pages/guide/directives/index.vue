<script setup>
  definePageMeta({
    layout: 'guide',
    keepalive: true,
  });

  const selected = ref('a');
  const options = ref([
    { value: null, text: 'Please select an option' },
    { value: 'a', text: 'This is First option' },
    { value: 'b', text: 'Selected Option' },
    { value: 'c', text: 'This is an option with object value' },
    { value: 'd', text: 'This one is disabled', disabled: true },
  ]);
  const addComma = ref('');
  const addCommaPlain = ref('33333');
  const addCommaWithMaxLength = ref('6222221254');
  const addCommaWithFixed_A = ref('22222.32421');
  const addCommaWithFixed_B = ref('22222.12');
  const addCommaWithPositiveAndFixed = ref('-1534477');
  const addCommaWithNegativeAndFixed = ref('');
  const addCommaWithFixedMaxLength = ref('22222.12');
  const numberOnly = ref('12643342');
  const numberOnlyWithoutComma = ref('12643342');
  const numberOnlyWithFullStop = ref('12643342');
  const textOnly = ref('text only 1');
  const maskedName = ref('ridley scott');
  const unformattedTime = ref('175801');

  onMounted(() => {
    window.setTimeout(() => {
      addComma.value = '11223344';
      addCommaWithNegativeAndFixed.value = '-45645622.32421';
    }, 1000);

    if (testvalue === '300') testInput.value.input.value = '';
  });

  const testvalue = '300';
  const testInput = ref();
  const onUpdate = value => {
    testInput.value.input.value = value !== '300' ? value : '';
  };
</script>
<template>
  <div>
    <h1>Directives</h1>
    <br /><br />
    <div>
      <p>v-select-all</p>
      <b-form-select v-select-all v-model="selected" :options="options"></b-form-select>
    </div>
    <br /><br />
    <div>
      <p>v-select-mix</p>
      <b-form-select v-select-mix v-model="selected" :options="options"></b-form-select>
    </div>
    <br />
    <hr />
    <br />
    <div>
      <p>v-input-add-comma {{ addComma }}</p>
      <b-form-input v-model="addComma" lazy v-input-add-comma></b-form-input>
    </div>
    <br /><br />
    <div>
      <p>v-input-add-comma + max length</p>
      <b-form-input v-model="addCommaWithMaxLength" v-input-add-comma max="15"></b-form-input>
    </div>
    <br /><br />
    <div>
      <p>v-input-add-comma . fixed {{ addCommaPlain }}</p>
      <b-form-input v-model="addCommaPlain" lazy v-input-add-comma="3"></b-form-input>
    </div>
    <br /><br />
    <div>
      <p>v-input-add-comma . fixed</p>
      <b-form-input v-model="addCommaWithFixed_A" v-input-add-comma="5"></b-form-input>
    </div>
    <br /><br />
    <div>
      <p>v-input-add-comma . fixed + negative</p>
      <b-form-input v-model="addCommaWithNegativeAndFixed" v-input-add-comma="5"></b-form-input>
    </div>
    <br /><br />
    <div>
      <p>v-input-add-comma . fixed + positive only</p>
      <b-form-input v-model="addCommaWithPositiveAndFixed" v-input-add-comma:positive="(0)"></b-form-input>
    </div>
    <br /><br />
    <div>
      <p>v-input-add-comma . fixed</p>
      <b-form-input v-model="addCommaWithFixed_B" v-input-add-comma="5"></b-form-input>
    </div>
    <br /><br />
    <div>
      <p>v-input-add-comma . fixed + max length</p>
      <b-form-input v-model="addCommaWithFixedMaxLength" v-input-add-comma="5" max="10"></b-form-input>
    </div>
    <br />
    <hr />
    <br />
    <div>
      <p>v-input-number-only + comma {{ numberOnly }}</p>
      <b-form-input v-model="numberOnly" lazy v-input-number-only></b-form-input>
    </div>
    <br />
    <div>
      <p>v-input-number-only + no comma</p>
      <b-form-input v-model="numberOnlyWithoutComma" v-input-number-only="false"></b-form-input>
    </div>
    <br /><br />
    <div>
      <p>v-input-number</p>
      <b-form-input v-model="numberOnlyWithFullStop" v-input-number maxlength="7"></b-form-input>
    </div>
    <br />
    <hr />
    <br />
    <div>
      <p>v-input-text-only</p>
      <b-form-input v-model="textOnly" v-input-text-only maxlength="7"></b-form-input>
    </div>
    <br />
    <hr />
    <br />
    <div>
      <p>v-input-mask-name</p>
      <b-form-input v-model="maskedName" v-input-mask-name></b-form-input>
    </div>
    <br />
    <hr />
    <br />
    <div>
      <p>v-input-format-time</p>
      <b-form-input v-model="unformattedTime" v-input-format-time></b-form-input>
    </div>
    <br />
    <hr />
    <br />
    <div>
      <p>value test</p>
      <b-form-input :model-value="testvalue" ref="testInput" @input="onUpdate"></b-form-input>
    </div>
    <br />
    <hr />
    <br />
    <div>
      <p>prevent drag</p>
      <b-form-input :model-value="testvalue" ref="testInput" v-prevent-drag></b-form-input>
    </div>
    <br />
  </div>
</template>
