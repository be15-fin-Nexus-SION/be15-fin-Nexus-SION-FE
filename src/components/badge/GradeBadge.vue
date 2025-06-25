<template>
  <span :class="['grade-badge', gradeGradientClass]">
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
});

const gradeGradientClass = computed(() => {
  switch (props.label?.toUpperCase()) {
    case "S":
      return "bg-gradient-grade-s";
    case "A":
      return "bg-gradient-grade-a";
    case "B":
      return "bg-gradient-grade-b";
    case "C":
      return "bg-gradient-grade-c";
    case "D":
      return "bg-gradient-grade-d";
    default:
      return "bg-gradient-to-r from-gray-400 to-gray-600"; // fallback
  }
});
</script>

<style scoped>
.grade-badge {
  @apply text-headlineSm leading-[39px] font-black
  text-transparent bg-clip-text
  w-[32px] h-[39px] flex items-center justify-center;
}
</style>
