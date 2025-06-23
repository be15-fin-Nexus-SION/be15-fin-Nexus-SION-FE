<template>
  <div class="tech-badge">
    <span class="tech-label">{{ label }}</span>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.tech-badge {
  @apply flex justify-center items-center px-[10px] py-[5px] bg-[#555555] rounded-full gap-1.5;
  width: fit-content;
}

.tech-label {
  @apply w-[65px] h-[17px] text-[14px] font-bold text-white flex items-center justify-center text-center;
  line-height: 1.1;
  white-space: nowrap;
}
</style>
