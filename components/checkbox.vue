<template>
  <div class="custom-checkbox">
    <input :id="getId" type="checkbox" :checked="modelValue" @input="$emit('update:modelValue', $event.target.checked)"/>
    <label :for="getId">
      <slot></slot>
    </label>
  </div>
</template>

<script lang="ts" setup>

defineProps(['modelValue'])
defineEmits(['update:modelValue'])

const getId = computed(() => {
  return Math.random().toString(36).substring(2, 15);
})

</script>

<style lang="scss" scoped>

.custom-checkbox {
  position: relative;
  text-align: left;

  label {
    cursor: pointer;
    display: inline;
    line-height: 1.25em;
    vertical-align: top;
    clear: both;
    padding-left: 1px;
  }
  label:not(:empty) {
    padding-left: 0.75em;
  }
  label::before, label::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
  }
  label::before {
    width: 1.25em;
    height: 1.25em;
    background: #fff;
    cursor: pointer;
    transition: background 0.3s;
  }

  input[type=checkbox] {
    outline: 0;
    visibility: hidden;
    width: 1.25em;
    margin: 0;
    display: block;
    float: left;
    font-size: inherit;
  }

  input[type=checkbox]:checked + label:before {
    background: var(--primary);
  }

  input[type=checkbox]:checked + label:after {
    transform: translate(0.25em, 0.3365384615em) rotate(-45deg);
    width: 0.7em;
    height: 0.325em;
    border: 0.125em solid #fff;
    border-top-style: none;
    border-right-style: none;
  }

  input[type=checkbox]:disabled + label:before {
    border: 2px solid rgba(0, 0, 0, 0.26);
    border-radius: 0.125em;
  }

  input[type=checkbox]:disabled:checked + label:before {
    background: rgba(0, 0, 0, 0.26);
  }
}

</style>