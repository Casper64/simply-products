<template>
  <div class="dashboard">
    <h1>Welcome {{ user.username }}</h1>
  </div>
</template>

<script lang="ts" setup>
const user = useUser();

definePageMeta({
  middleware: 'auth'
})

</script>