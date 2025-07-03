<script setup>
defineProps({
  squad: Object,
});
</script>

<template>
  <div
    class="relative border-2 rounded-lg p-4 shadow-sm"
    :class="squad.originType === 'AI' ? 'border-blue-400' : 'border-gray-200'"
  >
    <!-- AI 추천 뱃지 -->
    <div
      v-if="squad.originType === 'AI'"
      class="absolute top-2 right-2 text-xs bg-blue-500 text-white px-2 py-1 rounded"
    >
      AI 추천
    </div>

    <!-- 스쿼드 제목 -->
    <h3 class="text-base font-semibold mb-3">
      스쿼드 {{ squad.squadCode?.split("_").pop() }}
    </h3>

    <!-- 팀 멤버 -->
    <div class="mb-3">
      <p class="text-sm font-medium mb-1">
        팀 멤버 ({{ squad.members.length }}명)
      </p>
      <ul class="flex flex-wrap gap-2">
        <li
          v-for="member in squad.members"
          :key="member.name"
          class="bg-gray-100 text-sm px-2 py-1 rounded"
        >
          {{ member.name }} - {{ member.job }}
        </li>
      </ul>
    </div>

    <!-- 예상 기간 -->
    <div class="text-sm mb-1">
      <span class="font-medium">예상 기간:</span>
      <span class="ml-1">{{ squad.estimatedPeriod || "-" }}</span>
    </div>

    <!-- 예상 예산 -->
    <div class="text-sm mb-4">
      <span class="font-medium">예상 예산:</span>
      <span class="ml-1">{{ squad.estimatedCost || "-" }}</span>
    </div>

    <!-- 버튼 -->
    <div class="flex gap-2 mt-auto">
      <button
        class="flex-1 px-3 py-1 bg-emerald-500 text-white rounded hover:bg-emerald-600"
      >
        스쿼드 공유
      </button>
      <button
        class="flex-1 px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
      >
        삭제
      </button>
    </div>
  </div>
</template>
