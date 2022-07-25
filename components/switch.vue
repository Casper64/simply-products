<template>
  <div class="switch-container">
    <input
      :checked="modelValue"
      class="switch-checkbox"
      type="checkbox"
      @change="$emit('update:modelValue', $event.target.checked)"
      id="vue-switch"
    />
    <label
      :class="['switch-label', {on: modelValue}]"
      for="vue-switch"
    >
      <span class="switch-button"></span>
    </label>
  </div>
</template>

<script lang="ts" setup>

defineProps<{
  modelValue: boolean
}>();
defineEmits(['update:modelValue']);

</script>

<style lang="scss" scoped>

.switch-container {
  height: 30px;
  width: 60px;
  position: relative;
}

.switch-checkbox {
  height: 0;
  width: 0;
  visibility: hidden;
}
  
.switch-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  width: 60px;
  height: 30px;
  background: grey;
  border-radius: 60px;
  position: absolute;
  top: 0;
  transition: background-color .2s;

  &.on {
    background-color: var(--primary);
  }
}
  
.switch-label .switch-button {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 25px;
  height: 25px;
  border-radius: 25px;
  transition: 0.3s;
  background: #fff;
  box-shadow: 0 0 2px 0 rgba(10, 10, 10, 0.29);
}
  
.switch-checkbox:checked + .switch-label .switch-button {
  left: calc(100% - 2px);
  transform: translateX(-100%);
}
  
.switch-label:active .switch-button {
  width: 35px;
}

</style>