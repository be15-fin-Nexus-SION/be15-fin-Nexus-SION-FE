<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import ConfirmDeleteModal from "@/features/squad/components/ConfirmDeleteModal.vue";

const props = defineProps({
  squad: Object,
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
</script>

<template>
  <div
    :class="[
      'relative rounded-lg p-4 flex flex-col h-full transition-all duration-300 ease-in-out transform hover:scale-[1.0] hover:-translate-y-2 hover:shadow-2xl cursor-pointer',
      squad.originType === 'AI'
        ? 'bg-white border-0 p-[2px] bg-gradient-to-r from-purple-500 to-sky-400'
        : 'border-2 border-gray-200 bg-white',
    ]"
    @click="goToDetail"
  >
    <!-- 내부 카드 내용 (AI는 한겹 더 감싸기) -->
    <div
      :class="[
        squad.originType === 'AI'
          ? 'rounded-lg bg-white p-4 h-full relative'
          : 'contents',
      ]"
    >
      <!-- AI 추천 배지 -->
      <div
        v-if="squad.originType === 'AI'"
        class="absolute top-2 right-2 text-xs text-white px-2 py-1 rounded-full bg-gradient-to-r from-purple-500 to-sky-400 shadow-sm"
      >
        AI 추천
      </div>

      <!-- 제목 -->
      <h3 class="text-base font-semibold mb-3">
        스쿼드 {{ squad.squadCode?.split("_").pop() }}
      </h3>

      <!-- 팀 멤버 -->
      <div class="mb-3">
        <p class="text-sm font-medium mb-1">
          팀 멤버 ({{ squad.members.length }}명)
        </p>
        <ul>
          <li
            v-for="member in squad.members"
            :key="member.name"
            class="bg-gray-100 text-sm px-2 py-1 mb-1 rounded-md w-fit"
          >
            {{ member.name }} - {{ member.job }}
          </li>
        </ul>
      </div>

      <!-- 예상 기간 / 예산 -->
      <div class="text-sm mb-1">
        <span class="font-medium">예상 기간:</span>
        <span class="ml-1">{{ squad.estimatedPeriod || "-" }}</span>
      </div>
      <div class="text-sm mb-4">
        <span class="font-medium">예상 예산:</span>
        <span class="ml-1">{{ squad.estimatedCost || "-" }}</span>
      </div>

      <!-- 하단 버튼 -->
      <div class="flex gap-2 mt-auto">
        <button
          @click.stop
          class="flex-1 px-3 py-1 bg-secondary-green text-white rounded hover:bg-secondary-green-hover"
        >
          스쿼드 공유
        </button>
        <button
          class="flex-1 px-3 py-1 bg-natural-gray text-gray-700 rounded hover:bg-natural-gray-hover"
          @click.stop="openDeleteModal"
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
