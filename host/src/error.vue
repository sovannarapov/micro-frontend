<script setup lang="ts">
  defineProps({
    error: Object,
  });
  const config = useRuntimeConfig();
  const {
    public: { ENV, TITLE },
  } = config;

  const handleError = () => clearError({ redirect: '/' });
</script>

<template>
  <div class="login_wrap">
    <h1>
      KB PRASAC <span>{{ TITLE }}</span>
    </h1>
    <div class="mb20">
      Error Occurred : <span class="fc_red">{{ error?.message }}</span>
    </div>
    <div class="btn_area mt20">
      <b-button @click="handleError">Navigate home</b-button>
    </div>
  </div>
</template>
