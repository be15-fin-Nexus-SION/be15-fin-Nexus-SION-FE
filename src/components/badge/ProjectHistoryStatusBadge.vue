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
    validator: (value) => ["PENDING", "APPROVED", "REJECTED"].includes(value),
  },
});

// 상태 표시 텍스트 변환
const label = computed(() => {
  switch (props.status) {
    case "PENDING":
      return "요청됨";
    case "APPROVED":
      return "승인됨";
    case "REJECTED":
      return "거절됨";
    case "NOT_REQUESTED":
      return "미요청";
    default:
      return "알 수 없음";
  }
});

// 상태에 따른 배경색 클래스
const badgeClass = computed(() => {
  return [
    "flex items-center justify-center h-[27px] px-[10px] rounded-full",
    props.status === "APPROVED"
      ? "bg-status-projecting"
      : props.status === "REJECTED"
        ? "bg-semantic-warning"
        : props.status === "PENDING"
          ? "bg-status-waiting"
          : "bg-natural-gray",
  ];
});
</script>

<style scoped>
.badge-text {
  @apply text-[14px] text-[#121212];
  line-height: 1.1;
  white-space: nowrap;
}
</style>
