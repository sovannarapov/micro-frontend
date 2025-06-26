<template>
  <div class="container">
    <div class="text-center">
      <img alt="Vue logo" src="../assets/logo.png" class="text-center" />
    </div>
    <CForm />
  </div>
</template>

<script></script>

<script setup>
import CForm from '../components/CForm.vue'

defineOptions({
  name: 'Home',
  components: {
    CForm,
  },
})
</script>
