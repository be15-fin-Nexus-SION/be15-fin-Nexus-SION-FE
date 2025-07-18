<!-- components/CustomBadge.vue -->
<template>
  <div :class="badgeClass" :style="{ backgroundColor: bgColor }">
    <span class="badge-text">{{ label }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  bgColor: {
    type: String,
    default: "#E0E0E0", // 기본 배경색 (회색 계열)
  },
});

const badgeClass = [
  "flex items-center justify-center h-[27px] px-[10px] rounded-full",
];
</script>

<style scoped>
.badge-text {
  @apply text-[14px] text-[#121212] leading-[1.1] whitespace-nowrap;
}
</style>
