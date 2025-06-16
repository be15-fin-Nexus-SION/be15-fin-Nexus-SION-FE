<template>
  <div :class="badgeClass">
    <span class="badge-text">{{ label }}</span>
  </div>
</template>

<script setup>
import { computed } from "vue";

// 상태 값을 부모 컴포넌트에서 받아옴
const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ["대기중", "투입중"].includes(value),
  },
});

// 상태에 따른 클래스 설정
const badgeClass = computed(() => {
  return [
    "flex items-center justify-center h-[27px] px-[10px] rounded-full",
    props.status === "대기중" ? "bg-[#FFD344]" : "bg-[#2DCB67]",
  ];
});

const label = computed(() => props.status);
</script>

<style scoped>
.badge-text {
  @apply text-[14px] leading-[17px] text-[#121212];
}
</style>
