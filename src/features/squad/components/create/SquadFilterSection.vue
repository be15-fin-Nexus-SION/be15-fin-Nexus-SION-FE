<script setup>
import { ref } from "vue";
import ManualDeveloperList from "@/features/squad/components/create/ManualDeveloperList.vue";
import AiRecommendedSection from "@/features/squad/components/create/AiRecommendedSection.vue";
import AiLoadingOverlay from "@/components/AiLoadingOverlay.vue";

defineProps({
  projectId: {
    type: String,
    required: true,
  },
});

const activeTab = ref("manual");
const isLoading = ref(false);
const showAISection = ref(false);

function switchToAI() {
  activeTab.value = "ai";
  isLoading.value = true;
  showAISection.value = false;

  setTimeout(() => {
    isLoading.value = false;
    showAISection.value = true;
  }, 4000);
}
</script>

<template>
  <section class="developer-panel">
    <div class="tab-header">
      <div class="tab-left">
        <button
          :class="['tab-btn', activeTab === 'manual' ? 'active' : '']"
          @click="activeTab = 'manual'"
        >
          직접 조회
        </button>
        <button
          :class="['tab-btn', activeTab === 'ai' ? 'active' : '']"
          @click="switchToAI"
        >
          AI 추천
        </button>
      </div>
      <button class="btn-outline">기존 스쿼드 가져오기</button>
    </div>

    <ManualDeveloperList v-if="activeTab === 'manual'" />
    <AiLoadingOverlay
      :visible="isLoading"
      message="AI 분석 기반 <strong>직무별 인재풀 추천</strong>이 진행중입니다..."
    />
    <transition name="fade">
      <AiRecommendedSection v-if="activeTab === 'ai' && showAISection" />
    </transition>
  </section>
</template>

<style scoped>
.developer-panel {
  @apply w-full relative;
}

.tab-header {
  @apply flex items-center justify-between mb-4;
}

.tab-left {
  @apply flex items-center;
}

.tab-btn {
  @apply px-4 py-2 text-xl text-gray-600 font-bold;
}

.tab-btn.active {
  @apply text-blue-600;
}

.tab-btn:first-child {
  position: relative;
}

.tab-btn:first-child::after {
  content: "";
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  width: 2.5px;
  height: 20px;
  background-color: #111827;
}

.btn-outline {
  @apply px-4 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-white transition;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
