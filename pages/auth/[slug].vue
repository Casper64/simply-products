<template>
  <div class="login-page">
    <h1>Welcome</h1>
    <div class="forms">
      <Input v-if="!isLogin" v-model="email" @enter="submit" placeholder="user@example.com">
        <svg viewBox="0 0 330.001 330.001">
          <path d="M173.871,177.097c-2.641,1.936-5.756,2.903-8.87,2.903c-3.116,0-6.23-0.967-8.871-2.903L30,84.602
            L0.001,62.603L0,275.001c0.001,8.284,6.716,15,15,15L315.001,290c8.285,0,15-6.716,15-14.999V62.602l-30.001,22L173.871,177.097z"
            />
          <polygon points="165.001,146.4 310.087,40.001 19.911,40 	"/>
        </svg>
      </Input>
      <p v-if="emailError" class="error">{{ emailError }}</p>

      <Input v-model="username" @enter="submit" placeholder="username">
        <svg viewBox="0 0 1792 1792">
          <path d="M1600 1405q0 120-73 189.5t-194 69.5H459q-121 0-194-69.5T192 1405q0-53 3.5-103.5t14-109T236 1084t43-97.5 62-81 85.5-53.5T538 832q9 0 42 21.5t74.5 48 108 48T896 971t133.5-21.5 108-48 74.5-48 42-21.5q61 0 111.5 20t85.5 53.5 62 81 43 97.5 26.5 108.5 14 109 3.5 103.5zm-320-893q0 159-112.5 271.5T896 896 624.5 783.5 512 512t112.5-271.5T896 128t271.5 112.5T1280 512z" />
        </svg>
      </Input>
      <p v-if="usernameError" class="error">{{ usernameError }}</p>

      <Input v-model="password" @enter="submit" placeholder="password" type="password">
        <svg viewBox="0 0 1792 1792">
        <path d="M640 768h512V576q0-106-75-181t-181-75-181 75-75 181v192zm832 96v576q0 40-28 68t-68 28H416q-40 0-68-28t-28-68V864q0-40 28-68t68-28h32V576q0-184 132-316t316-132 316 132 132 316v192h32q40 0 68 28t28 68z" />
        </svg>
      </Input>
      <p v-if="passwordError" @enter="submit" class="error">{{ passwordError }}</p>

      <div class="submit-button" @click="submit">
        {{ isLogin ? 'Log in' : 'Sign up'}}
      </div>

    </div>
    <p class="wrong-side">
      {{ isLogin ? 'Not a member?' : 'Already a member?' }}
      <NuxtLink :to="$route.params.slug == 'login' ? '/auth/signup' : '/auth/login'">
        {{ isLogin ? 'Sign up now': 'Log in now' }}
      </NuxtLink> 
      <svg viewBox="0 0 1792 1792"><path d="M1600 960q0 54-37 91l-651 651q-39 37-91 37-51 0-90-37l-75-75q-38-38-38-91t38-91l293-293H245q-52 0-84.5-37.5T128 1024V896q0-53 32.5-90.5T245 768h704L656 474q-38-36-38-90t38-90l75-75q38-38 90-38 53 0 91 38l651 651q37 35 37 90z" /></svg>
    </p>
  </div>
</template>

<script lang="ts" setup>

const route = useRoute();

const email = ref("");
const username = ref("");
const password = ref("");

const emailError = ref("");
const usernameError = ref("");
const passwordError = ref("");

const isLogin = computed(() => {
  return route.params.slug == 'login';
})

definePageMeta({
  layout: 'empty'
})


function validateEmail() {
  let valid = email.value.length >= 3 && email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  emailError.value = valid ? "" : "Invalid email";
  return valid;
}
function validateUsername() {
  let valid = username.value.length > 3;
  usernameError.value = valid ? "" : "Username must be at least 4 characters";
  return valid;
}
function validatePassword() {
  let valid = password.value.length > 8;
  passwordError.value = valid ? "" : "Password must be at least 8 characters";
  return valid;
}

async function submit() {
  // reset errors
  emailError.value = "";
  usernameError.value = "";
  passwordError.value = "";

  const login = route.params.slug == 'login';

  if (login) {
    let valid = validateEmail() && validatePassword();
    if (valid === false) return;

  }
  // Singup
  else {
    let valid = validateEmail() && validateUsername() && validatePassword();
    if (valid === false) return;

    const res = await $fetch('/api/auth/signup', {
      method: 'POST',
      body: {
        email: email.value,
        username: username.value,
        password: password.value
      }
    });
    console.log(res)
  }
}

</script>

<style lang="scss" scoped>

.login-page {
  background-color: var(--selected-ui);
  min-height: 100vh;
  display: grid;
  align-content: center;
  justify-items: center;

  h1 {
    font-weight: 400;
    font-size: 4em;
    padding-bottom: 1em;
  }

  .error {
    font-size: 14px;
    color: var(--error);
    padding-top: 0.5rem;
  }

  .form-field {
    margin-top: 0.875rem;
  }
}

.forms {
  width: 320px;
  display: grid;
}

.submit-button {
  width: 100%;
  padding: 1rem;
  border-radius: 0.25em;
  cursor: pointer;
  transition: filter 0.3s;
  background-color: var(--primary);
  text-align: center;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 14px;
  margin-top: 0.875rem;

  &:hover {
    filter: brightness(1.1);
  }
}

.wrong-side {
  color: #606468;
  margin: 1.5rem 0;
  text-align: center;

  a {
    padding: 0px 5px;
    color: var(--text) !important;
  }

  svg {
    fill: #606468;
    width: 1em;
    height: 1em;
    display: inline-block;
    vertical-align: middle;
  }
}

</style>