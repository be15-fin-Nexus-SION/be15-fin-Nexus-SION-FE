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
  @apply flex flex-row justify-center items-center px-[10px] py-[5px] gap-[9px] w-[85px] h-[27px] bg-[#555555] rounded-[13px];
}

.tech-label {
  @apply w-[65px] h-[17px] text-[14px] leading-[17px] font-bold text-white flex items-center justify-center text-center;
}
</style>
