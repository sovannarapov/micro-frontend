<script setup>
  definePageMeta({
    layout: 'guide',
    keepalive: true,
  });

  const addCommaPlain = ref('33333');
  const addCommaPlain1 = ref('33333');
  const addCommaPlain2 = ref('33333');
  const addCommaPlain3 = ref('33333');


  const testvalue = '300';
  const testInput = ref();
  const onUpdate = value => {
    testInput.value.input.value = value !== '300' ? value : '';
  };
</script>
<template>
  <div>
    <h1>Directives</h1>

    <div>
      <p>v-input-add-comma . fixed {{ addCommaPlain }}</p>
      <b-form-input v-model="addCommaPlain" lazy v-input-add-comma="3"></b-form-input>
    </div>
    <div>
      <p>v-input-add-comma . fixed {{ addCommaPlain1 }}</p>
      <b-form-input v-model="addCommaPlain1" lazy v-input-add-comma="3"></b-form-input>
    </div>
    <div>
      <p>v-input-add-comma . fixed {{ addCommaPlain2 }}</p>
      <b-form-input v-model="addCommaPlain2" lazy v-input-add-comma="3"></b-form-input>
    </div>
    <div>
      <p>v-input-add-comma . fixed {{ addCommaPlain3 }}</p>
      <b-form-input v-model="addCommaPlain3" lazy v-input-add-comma="3"></b-form-input>
    </div>

    <br /><br />
    
  </div>
</template>
