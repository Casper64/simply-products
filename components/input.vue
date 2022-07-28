<template>
  <div class="form-field" :class="{'with-icon': (Object.keys($slots).length > 0)}">
    <label v-if="Object.keys($slots).length > 0"  :for="uid">
      <div class="icon">
        <slot></slot>
      </div>
      <span class="hidden">{{ prettyName }}</span>
    </label>
    <input 
      autocomplete="off" 
      class="form-input" 
      required 
      :id="uid" 
      :type="type || 'text'" 
      :name="placeholder" 
      :placeholder="prettyName" 
      :value="modelValue" 
      @input="$emit('update:modelValue', $event.target.value)" 
      @keyup.enter="$emit('enter', $event.target.value)"
    >
  </div>
</template>

<script lang="ts" setup>

const { placeholder } = defineProps<{
  modelValue: String,
  placeholder: String,
  type?: String,
}>();
defineEmits(['update:modelValue', 'enter']);

const prettyName = computed(() => {
  let capital = placeholder[0].toUpperCase();
  let rest = placeholder.slice(1);
  return capital + rest;
})

const uid = ref(Math.random().toString(36).substring(2, 15));

</script>

<style lang="scss" scoped>

.form-field {
  display: flex;

  label {
    background-color: var(--plain-ui);
    border-radius: 0.25rem;
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
    padding: 1rem;
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    height: 47px;
    transition: filter 0.3s;
    cursor: pointer;
  }

  &:hover {
    label, input {
      filter: brightness(1.05);
    }
  }

  &.with-icon .form-input {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}

.form-input {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  border-radius: 0.25rem;
  padding: 1rem;
  background: var(--lighter-ui);
  background-image: none;
  
  transition: filter 0.3s;
}



.icon {
  height: 1em;
  display: inline-block;
  fill: var(--lighter-ui);
  width: 1em;
  vertical-align: middle;
}

.hidden {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
}

</style>