<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import ConfirmDeleteModal from "@/features/squad/components/ConfirmDeleteModal.vue";
import { shareSquad } from "@/api/notification.js";

const props = defineProps({
  squad: Object,
  projectId: String,
});

const emit = defineEmits(["delete"]);
const showDeleteModal = ref(false);
const router = useRouter();

const openDeleteModal = () => {
  showDeleteModal.value = true;
};

const confirmDelete = () => {
  emit("delete", props.squad.squadCode);
  showDeleteModal.value = false;
};

const goToDetail = () => {
  router.push(`/squads/${props.squad.squadCode}`);
};

const MAX_DISPLAY_MEMBERS = 3;
const displayedMembers = computed(() =>
  props.squad.members.slice(0, MAX_DISPLAY_MEMBERS),
);
const remainingCount = computed(
  () => props.squad.members.length - MAX_DISPLAY_MEMBERS,
);

async function handleShareSquad() {
  await shareSquad({
    squadCode: props.squad.squadCode,
    receivers: ["0120250002"],
  });
}
</script>

<template>
  <div
    :class="[
      'squad-card',
      squad.aiRecommended ? 'ai-border' : 'border-2 border-gray-200 bg-white',
    ]"
    @click="goToDetail"
  >
    <div class="inner-card-wrapper">
      <!-- 헤더 영역 -->
      <div class="flex items-start justify-between mb-4">
        <h3 class="text-lg font-bold truncate max-w-[70%]">
          스쿼드 {{ squad.squadCode?.split("_").pop() }}
        </h3>
        <div
          v-if="squad.aiRecommended"
          class="text-xs text-white px-2 py-1 rounded-full bg-gradient-to-r from-purple-500 to-sky-400 shadow-sm"
        >
          AI 추천
        </div>
      </div>

      <!-- 멤버 목록 -->
      <div class="mb-4">
        <p class="text-base font-medium mb-2">
          팀 멤버 ({{ squad.members.length }}명)
        </p>
        <div class="member-list-wrapper">
          <span
            v-for="member in displayedMembers"
            :key="member.name"
            class="bg-gray-100 text-sm text-gray-700 px-2 py-1 rounded-md"
          >
            {{ member.name }} - {{ member.job }}
          </span>
          <span
            v-if="remainingCount > 0"
            class="bg-gray-200 text-sm text-gray-500 px-2 py-1 rounded-md"
          >
            외 {{ remainingCount }}명
          </span>
        </div>
      </div>

      <!-- 기간 및 예산 -->
      <div class="text-base font-medium mb-1">
        <span>예상 기간:</span>
        <span class="text-sm text-gray-600 ml-1">{{
          squad.estimatedPeriod || "-"
        }}</span>
      </div>
      <div class="text-base font-medium mb-4">
        <span>예상 예산:</span>
        <span class="text-sm text-gray-600 ml-1">{{
          squad.estimatedCost || "-"
        }}</span>
      </div>

      <!-- 하단 버튼 -->
      <div class="flex gap-2 mt-auto">
        <button
          @click.stop="handleShareSquad"
          class="flex-1 px-4 py-2 bg-secondary-green text-white rounded-md font-semibold transition-colors duration-200 hover:bg-secondary-green-hover"
        >
          스쿼드 공유
        </button>
        <button
          @click.stop="openDeleteModal"
          class="flex-1 px-4 py-2 bg-natural-gray text-gray-800 rounded-md font-semibold transition-colors duration-200 hover:bg-natural-gray-hover"
        >
          삭제
        </button>
      </div>

      <!-- 삭제 모달 -->
      <ConfirmDeleteModal
        v-if="showDeleteModal"
        :message="`스쿼드 ${squad.squadCode?.split('_').pop()}을 삭제하시겠습니까?`"
        confirmText="삭제"
        @confirm="confirmDelete"
        @close="showDeleteModal = false"
      />
    </div>
  </div>
</template>

<style scoped>
/* 타이틀 ellipsis 처리 */
h3.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 외부 카드 래퍼 */
.squad-card {
  @apply relative rounded-lg p-0 flex flex-col justify-between h-[400px] cursor-pointer overflow-hidden animate-luxFadeSlideIn;
}

/* 카드 내부 내용 */
.inner-card-wrapper {
  @apply h-full w-full rounded-lg bg-white p-4 flex flex-col;
}

/* 멤버 목록 스타일 */
.member-list-wrapper {
  @apply flex flex-wrap gap-2 items-start;
  min-height: 48px;
  max-height: 96px;
  overflow: hidden;
}

/* AI 추천 border */
.ai-border {
  @apply bg-white border-0 p-[2px] bg-gradient-to-r from-purple-500 to-sky-400;
}

/* 애니메이션 */
@keyframes luxFadeSlideIn {
  0% {
    opacity: 0;
    transform: translateY(8px) scale(0.97);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-luxFadeSlideIn {
  animation: luxFadeSlideIn 0.5s ease-out both;
}
</style>
