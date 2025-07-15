<script setup>
import { computed, ref } from "vue";
import ReplacementDeveloperSearch from "@/features/project/components/ReplacementDeveloperSearch.vue";
import ReplacementSearchPanel from "@/features/project/components/ReplacementSearchPanel.vue";
import AiLoadingOverlay from "@/components/AiLoadingOverlay.vue"; // 필요시 위치 조정

const props = defineProps({
  project: Object,
  leavingMember: Object,
});

const visible = computed(() => props.project && props.leavingMember);
defineEmits(["close", "replace"]);

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
  }, 2000);
}
</script>

<template>
  <transition name="slide">
    <div v-if="visible" class="fixed inset-0 z-50">
      <div class="absolute inset-0 opacity-30" @click="$emit('close')"></div>

      <div
        class="absolute top-0 right-0 w-[650px] h-full bg-white border-l shadow-xl z-50 p-6 overflow-y-auto"
        @click.stop
      >
        <h2 class="text-xl font-bold mb-2">인재 대체</h2>
        <p class="text-sm text-gray-600 mb-4">
          <strong>{{ leavingMember.name }}</strong> 님을 대체할 인재를
          선택하세요.
        </p>

        <!-- 탭 -->
        <div class="flex gap-3 mb-4">
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

        <ReplacementDeveloperSearch
          v-if="activeTab === 'manual'"
          :project="project"
          :leaving-member="leavingMember"
          @replace="(payload) => $emit('replace', payload)"
        />

        <AiLoadingOverlay
          :visible="isLoading"
          message="AI 분석 기반 <strong>추천 인재 탐색</strong>이 진행중입니다..."
        />

        <transition name="fade">
          <ReplacementSearchPanel
            v-if="activeTab === 'ai' && showAISection"
            :project="project"
            :leaving-member="leavingMember"
            @replace="(payload) => $emit('replace', payload)"
          />
        </transition>

        <div class="mt-6 flex justify-end">
          <button @click="$emit('close')" class="text-sm text-gray-500">
            닫기
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-in-out;
}
.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.tab-btn {
  @apply px-4 py-2 border rounded text-sm font-medium;
}
.tab-btn.active {
  @apply bg-primary text-white border-primary;
}
</style>
