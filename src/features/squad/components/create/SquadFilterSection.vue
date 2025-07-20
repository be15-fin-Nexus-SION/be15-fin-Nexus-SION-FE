<script setup>
import { ref } from "vue";
import ManualDeveloperList from "@/features/squad/components/create/ManualDeveloperList.vue";
import AiRecommendedSection from "@/features/squad/components/create/AiRecommendedSection.vue";
import AiLoadingOverlay from "@/components/AiLoadingOverlay.vue";
import ExistSquadModal from "@/features/squad/components/ExistSquadModal.vue";
import { useRoute } from "vue-router";
import { handleSquadSelect } from "@/composable/useSquadSelect.js";

const activeTab = ref("manual");
const isLoading = ref(false);
const showAISection = ref(false);

// 모달 제어용 상태
const showExistSquadModal = ref(false);

// 예시용 프로젝트 정보 (상위에서 props로 받을 경우 수정 필요)
const route = useRoute();
const projectCode = route.params.projectId;
const projectTitle = "AI 추천 기반 프로젝트";

// 탭 전환
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

      <button class="btn-outline" @click="showExistSquadModal = true">
        기존 스쿼드 가져오기
      </button>
    </div>

    <ManualDeveloperList v-if="activeTab === 'manual'" />
    <AiLoadingOverlay
      :visible="isLoading"
      message="AI 분석 기반 <strong>직무별 인재풀 추천</strong>이 진행중입니다..."
    />
    <transition name="fade">
      <AiRecommendedSection v-if="activeTab === 'ai' && showAISection" />
    </transition>

    <ExistSquadModal
      v-if="showExistSquadModal"
      :is-modal-open="showExistSquadModal"
      :project-code="projectCode"
      :project-title="projectTitle"
      @close="showExistSquadModal = false"
      @select="handleSquadSelect"
    />
  </section>
</template>

<style scoped>
.developer-panel {
  @apply w-full min-w-[500px] relative;
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
