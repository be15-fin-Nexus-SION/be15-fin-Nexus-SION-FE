<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="input-tag-wrapper">
    <input
      class="input-tag-field"
      type="text"
      :placeholder="placeholder"
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<style scoped>
.input-tag-wrapper {
  @apply flex flex-row items-center px-[15px] w-[448px] h-[40px] bg-white border border-[#CFD6E8] rounded-lg box-border;
}

.input-tag-field {
  @apply w-[417px] h-[24px] text-bodyMd text-primary-hover font-normal outline-none bg-transparent;
}
</style>
