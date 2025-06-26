<script setup>
defineProps({
  count: {
    type: Number,
    required: true,
  },
  remoteClass: {
    type: String,
    default: '',
  },
})
defineEmits(['update:count'])
</script>

<template>
  <div>
    <h3 class="h3">Remote Counter</h3>
    <p class="p">Count from host: {{ count }}</p>
    <button :class="remoteClass" @click="$emit('update:count', count + 1)">Increment (from remote)</button>
  </div>
</template>
