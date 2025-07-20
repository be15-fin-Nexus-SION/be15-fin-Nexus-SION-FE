<template>
  <div :class="badgeClass">
    <span class="badge-text">{{ label }}</span>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) =>
      ["AVAILABLE", "UNAVAILABLE", "IN_PROJECT"].includes(value),
  },
});

// 상태 표시 텍스트 변환
const label = computed(() => {
  switch (props.status) {
    case "IN_PROJECT":
      return "작업중";
    case "AVAILABLE":
      return "대기중";
    case "UNAVAILABLE":
      return "비활성";
    default:
      return "알수없음";
  }
});

// 상태에 따른 배경색 클래스
const badgeClass = computed(() => {
  return [
    "flex items-center justify-center h-[27px] px-[10px] rounded-full",
    props.status === "IN_PROJECT"
      ? "bg-status-projecting"
      : props.status === "AVAILABLE"
        ? "bg-status-waiting"
        : "bg-natural-gray",
  ];
});
</script>

<style scoped>
.badge-text {
  @apply text-[12px] text-white font-semibold leading-[1.1] whitespace-nowrap;
}
</style>
