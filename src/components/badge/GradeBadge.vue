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
      return "bg-[linear-gradient(270deg,_#FF8C00_0%,_#992E00_100%)]";
    case "A":
      return "bg-[linear-gradient(270deg,_#FF000D_0%,_#990000_100%)]";
    case "B":
      return "bg-[linear-gradient(270deg,_#00FFA6_0%,_#009966_100%)]";
    case "C":
      return "bg-[linear-gradient(270deg,_#FFE600_0%,_#999600_100%)]";
    case "D":
      return "bg-[linear-gradient(270deg,_#BDBDBD_0%,_#606060_100%)]";
    default:
      return "bg-[linear-gradient(270deg,_#CCCCCC_0%,_#888888_100%)]";
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
