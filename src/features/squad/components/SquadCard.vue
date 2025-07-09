<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import ConfirmDeleteModal from "@/features/squad/components/ConfirmDeleteModal.vue";

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
  router.push(`/squads/${props.squad.squadCode}?projectId=${props.projectId}`);
};
</script>

<template>
  <div
    :class="[
      'squad-card',
      squad.aiRecommended ? 'ai-border' : 'border-2 border-gray-200 bg-white',
    ]"
    @click="goToDetail"
  >
    <div
      :class="[
        squad.aiRecommended
          ? 'rounded-lg bg-white p-4 h-full relative'
          : 'contents',
      ]"
    >
      <div
        v-if="squad.aiRecommended"
        class="absolute top-2 right-2 text-xs text-white px-2 py-1 rounded-full bg-gradient-to-r from-purple-500 to-sky-400 shadow-sm"
      >
        AI 추천
      </div>

      <h3 class="text-lg font-bold mb-4">
        스쿼드 {{ squad.squadCode?.split("_").pop() }}
      </h3>

      <div class="mb-4">
        <p class="text-base font-medium mb-2">
          팀 멤버 ({{ squad.members.length }}명)
        </p>
        <ul class="space-y-1">
          <li
            v-for="member in squad.members"
            :key="member.name"
            class="bg-gray-100 text-sm text-gray-700 px-2 py-1 rounded-md w-fit"
          >
            {{ member.name }} - {{ member.job }}
          </li>
        </ul>
      </div>

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

      <div class="flex gap-2 mt-auto">
        <button
          @click.stop
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
.squad-card {
  @apply relative rounded-lg p-4 flex flex-col h-full transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl cursor-pointer;
  animation: softFadeIn 0.6s ease-in-out both;
}

@keyframes softFadeIn {
  0% {
    opacity: 0.7;
    transform: translateY(2px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.ai-border {
  @apply bg-white border-0 p-[2px] bg-gradient-to-r from-purple-500 to-sky-400;
}
</style>
