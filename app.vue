<template>
  <Body data-theme="dark">
    <Head>
      <Link rel="preconnect" href="https://fonts.googleapis.com"/>
      <Link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
      <Link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&amp;display=swap"/>
    </Head>
    <NuxtLayout>
      <NuxtPage/>
    </NuxtLayout>
    <div :class="['theme-switch-container', {home: isHome}]">
      <p>theme</p>
      <Switch v-model="checked"/> 
    </div>
  </Body>
</template>

<script lang="ts" setup>
import "~/assets/styles/main.scss";


const route = useRoute();

const checked = ref<boolean>(true);

const isHome = computed(() => {
  return ['/', '/auth/login', '/auth/logout', '/auth/signup'].includes(route.path);
})

onBeforeMount(autoLogin);
</script>
