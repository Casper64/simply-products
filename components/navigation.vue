<template>
  <nav :class="['normal-nav', {'home-nav': isHome}]">
    <div v-if="!mobile" class="nav-message">
      <NuxtLink to="/">Home</NuxtLink>
    </div>
    <div class="nav-items">
      <template v-if="user">
        <div class="nav-item">
          <NuxtLink to="/dashboard">Dashboard</NuxtLink>
        </div>
        <div class="nav-item">
          <NuxtLink to="/auth/logout">Log out</NuxtLink>
        </div>
      </template>
      <div v-else class="nav-item">
        <NuxtLink to="/auth/login">Log in</NuxtLink>
      </div>
    </div>
  </nav>
  
</template>

<script lang="ts" setup>

const route = useRoute();
const mobile = useMobile();


const isHome = computed(() => {
  return route.path == '/';
})

</script>

<style lang="scss" scoped>
@import "~/assets/styles/variables.scss";

nav.normal-nav {
  background-color: var(--selected-ui);
  display: grid;
  align-items: center;
  justify-items: start;
  grid-template-columns: auto 1fr;
  height: 80px;
  gap: 20px;
  width: 100vw;
  top: 0;
  left: 0;
  color: var(--color);
  z-index: 10;

  &.home-nav {
    background-color: transparent;
    position: fixed;
  }

  @media only screen and (max-width: $mobile) {
    grid-row: -1;
    height: 70px;
    gap:0;
    
    background-color: transparent;

    .nav-items {
      padding: 0px;
      width: 100vw;
      justify-content: space-between;
      grid-template-columns: unset;
    }
  }
}

nav .center-items {
  justify-self: center;
  .theme-toggler {
    display: grid;
    grid-template-columns: auto 60px auto;
    align-items: center;
    gap: 20px;
  }
}

nav .nav-message {
  padding: 20px;
  padding-left: 20px;
  font-size: 28px;
  a {
    color: inherit;
  }
}

nav .search-form {
  justify-self: center;
  width: 400px;
}

nav .search-form input {
  font-size: 18px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
  width: 100%;
}

nav .nav-items {
  padding: 0px 50px;
  display: grid;
  grid-auto-columns: auto;
  grid-auto-flow: column;
  justify-self: end;
}

nav .nav-item {
  display: grid;
  justify-items: center;
}

nav .nav-items .nav-item a {
  padding: 20px;
  font-size: 20px;
  color: inherit;

  @media only screen and (max-width: $mobile) {
      padding-top: 0px;
  }
}
</style>