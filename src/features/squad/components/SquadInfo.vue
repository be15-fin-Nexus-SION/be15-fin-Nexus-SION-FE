<template>
  <div class="space-y-4">
    <!-- 스쿼드 설명 -->
    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
      <h3 class="text-sm font-medium text-gray-500 mb-1">스쿼드 설명</h3>
      <p
        class="text-base font-semibold text-gray-800 whitespace-pre-wrap leading-relaxed"
      >
        {{ description || "설명 없음" }}
      </p>
    </div>

    <!-- 예상 기간 + 총 예산 (반반 나눔) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- 예상 기간 -->
      <div
        class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm text-center"
      >
        <h4 class="text-sm font-medium text-gray-500 mb-2">예상 기간</h4>
        <p class="text-2xl font-bold text-gray-800">
          {{ period ? period + "개월" : "-" }}
        </p>
      </div>

      <!-- 총 예산 -->
      <div
        class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm text-center"
      >
        <h4 class="text-sm font-medium text-gray-500 mb-2">총 예산</h4>
        <p class="text-2xl font-bold text-gray-800">
          {{ totalCost }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  description: String,
  period: [String, Number],
  totalCost: [String, Number],
});
</script>
