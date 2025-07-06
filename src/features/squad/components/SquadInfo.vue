<template>
  <div>
    <!-- 스쿼드 설명 -->
    <div class="info-box mb-3">
      <h3 class="font-semibold mb-1">📝 스쿼드 설명</h3>
      <p class="text-sm text-gray-700 whitespace-pre-wrap">
        {{ reason || "설명 없음" }}
      </p>
    </div>

    <!-- 예상 기간 -->
    <div class="info-box mb-3">
      <h3 class="font-semibold mb-1">📅 예상 기간</h3>
      <p class="text-sm text-gray-600">{{ period || "-" }} (Effort 기준)</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  aiRecommended: Boolean,
  reason: String,
  period: String,
});
</script>

<style scoped>
.info-box {
  @apply bg-white rounded-xl shadow px-4 py-3 border border-gray-200;
}
</style>
