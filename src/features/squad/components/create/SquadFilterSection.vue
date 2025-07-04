<script setup>
import { ref } from "vue";
import ManualDeveloperList from "@/features/squad/components/create/ManualDeveloperList.vue";

defineProps({
  projectId: {
    type: String,
    required: true,
  },
});

const activeTab = ref("manual");
</script>

<template>
  <section class="developer-panel">
    <!-- 탭 + 스쿼드 버튼 -->
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
          @click="activeTab = 'ai'"
        >
          AI 추천
        </button>
      </div>
      <button class="btn-outline">기존 스쿼드 가져오기</button>
    </div>

    <ManualDeveloperList v-if="activeTab === 'manual'" />
    <!-- 향후 AI 탭에 AiRecommendedSlider 등 추가 예정 -->
  </section>
</template>

<style scoped>
.developer-panel {
  @apply w-full;
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
  background-color: #111827; /* border-gray-900 */
}

.btn-outline {
  @apply px-4 py-2 border border-primary text-primary rounded hover:bg-primary hover:text-white transition;
}
</style>
