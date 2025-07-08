<template>
  <div class="space-y-4">
    <!-- 스쿼드 설명 -->
    <div
      :class="[
        'rounded-lg p-4 shadow-sm',
        isAI
          ? 'ai-border border-gradient'
          : 'bg-gray-50 border border-gray-200',
      ]"
    >
      <h3 class="text-sm font-medium text-gray-500 mb-1">
        {{ isAI ? "스쿼드 추천 이유" : "스쿼드 설명" }}
      </h3>
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
const props = defineProps({
  description: String,
  period: [String, Number],
  totalCost: [String, Number],
  isAI: Boolean, // SquadDetailView에서 전달받을 AI 여부
});
</script>

<style scoped>
.ai-border {
  @apply relative rounded-lg p-4 shadow-sm bg-white;
}

.border-gradient {
  border: 3px solid transparent;
  background-origin: border-box;
  background-clip: padding-box, border-box;
  background-image:
    linear-gradient(white, white),
    linear-gradient(120deg, #823bff, #1268dd, #823bff);
  background-size:
    100% 150%,
    500% 500%;
  background-position:
    center,
    0% 50%;
  border-radius: 0.5rem;
}
</style>
