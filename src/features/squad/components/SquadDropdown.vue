<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import AiRecommendationModal from "@/features/squad/components/AiRecommendationModal.vue";
import AiLoadingOverlay from "@/components/AiLoadingOverlay.vue";
import { recommendSquad } from "@/api/squad";
import { showErrorToast } from "@/utills/toast.js";

const props = defineProps({
  projectId: {
    type: String,
    required: true,
  },
});

const open = ref(false);
const showAiModal = ref(false);
const isLoading = ref(false);
const dropdownRef = ref(null);
const router = useRouter();

const toggle = () => {
  open.value = !open.value;
};

const openAiModal = () => {
  open.value = false;
  showAiModal.value = true;
};

const handleAiConfirm = async (criteria) => {
  showAiModal.value = false;
  isLoading.value = true;

  try {
    const response = await recommendSquad({
      projectId: props.projectId,
      criteria,
    });
    await router.push(`/squads/${response.data.data.squadCode}`);
  } catch (error) {
    showErrorToast("스쿼드 추천 중 오류가 발생했습니다.");
  } finally {
    isLoading.value = false;
  }
};

const selectManual = () => {
  open.value = false;
  router.push(`/squads/create/${props.projectId}`);
};

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    open.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="relative" ref="dropdownRef">
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

    <AiRecommendationModal
      v-if="showAiModal"
      @confirm="handleAiConfirm"
      @close="showAiModal = false"
    />

    <AiLoadingOverlay
      :visible="isLoading"
      message="AI 추천 스쿼드를 구성 중입니다..."
    />
  </div>
</template>
