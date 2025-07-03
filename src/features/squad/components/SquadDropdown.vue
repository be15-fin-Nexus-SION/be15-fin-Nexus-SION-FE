<template>
  <div class="relative">
    <button
      @click="toggle"
      class="bg-[#6574F6] hover:bg-[#586DDD] text-white px-4 py-2 rounded"
    >
      + 스쿼드 추가
    </button>
    <div
      v-if="open"
      class="absolute right-0 mt-1 w-full bg-white border rounded shadow z-50"
    >
      <button
        class="block w-full text-center px-4 py-2 hover:bg-gray-100"
        @click="openAiModal"
      >
        AI 추천
      </button>
      <button
        class="block w-full text-center px-4 py-2 hover:bg-gray-100"
        @click="selectManual"
      >
        사용자 지정
      </button>
    </div>

    <!-- AI 추천 기준 선택 모달 -->
    <AiRecommendationModal
      v-if="showAiModal"
      @confirm="handleAiConfirm"
      @close="showAiModal = false"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import AiRecommendationModal from "@/features/squad/components/AiRecommendationModal.vue";

const open = ref(false);
const showAiModal = ref(false);

const toggle = () => {
  open.value = !open.value;
};

const openAiModal = () => {
  open.value = false;
  showAiModal.value = true;
};

const handleAiConfirm = (criteria) => {
  showAiModal.value = false;
  console.log("선택된 AI 기준:", criteria);
  // 👉 여기서 API 요청 또는 다음 단계 이동
};

const selectManual = () => {
  open.value = false;
  // 👉 사용자 지정 로직 (예: 라우터 이동)
};
</script>
