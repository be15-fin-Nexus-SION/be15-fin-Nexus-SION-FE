<script setup>
import { ref } from "vue";
import ConfirmDeleteModal from "@/features/squad/components/ConfirmDeleteModal.vue";

const props = defineProps({
  squad: Object,
});
const emit = defineEmits(["delete"]);

const showDeleteModal = ref(false);

const openDeleteModal = () => {
  showDeleteModal.value = true;
};

const confirmDelete = () => {
  emit("delete", props.squad.squadCode);
  showDeleteModal.value = false;
};
</script>

<template>
  <!-- 🎨 AI 추천인 경우 그라데이션 테두리 -->
  <div
    v-if="squad.originType === 'AI'"
    class="rounded-lg p-[2px] bg-gradient-to-r from-purple-500 to-sky-400"
  >
    <div class="relative rounded-lg bg-white p-4 shadow-sm h-full">
      <!-- 🔽 이하 내용은 그대로 유지 -->
      <div
        class="absolute top-2 right-2 text-xs text-white px-2 py-1 rounded-full bg-gradient-to-r from-purple-500 to-sky-400 shadow-sm"
      >
        AI 추천
      </div>

      <h3 class="text-base font-semibold mb-3">
        스쿼드 {{ squad.squadCode?.split("_").pop() }}
      </h3>

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

      <div class="text-sm mb-1">
        <span class="font-medium">예상 기간:</span>
        <span class="ml-1">{{ squad.estimatedPeriod || "-" }}</span>
      </div>
      <div class="text-sm mb-4">
        <span class="font-medium">예상 예산:</span>
        <span class="ml-1">{{ squad.estimatedCost || "-" }}</span>
      </div>

      <div class="flex gap-2 mt-auto">
        <button
          class="flex-1 px-3 py-1 bg-secondary-green text-white rounded hover:bg-secondary-green-hover"
        >
          스쿼드 공유
        </button>
        <button
          class="flex-1 px-3 py-1 text-gray-700 rounded bg-natural-gray hover:bg-natural-gray-hover"
          @click="openDeleteModal"
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

  <!-- ⚙️ 일반 스쿼드 -->
  <div
    v-else
    class="relative border-2 border-gray-200 rounded-lg p-4 shadow-sm"
  >
    <h3 class="text-base font-semibold mb-3">
      스쿼드 {{ squad.squadCode?.split("_").pop() }}
    </h3>

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

    <div class="text-sm mb-1">
      <span class="font-medium">예상 기간:</span>
      <span class="ml-1">{{ squad.estimatedPeriod || "-" }}</span>
    </div>
    <div class="text-sm mb-4">
      <span class="font-medium">예상 예산:</span>
      <span class="ml-1">{{ squad.estimatedCost || "-" }}</span>
    </div>

    <div class="flex gap-2 mt-auto">
      <button
        class="flex-1 px-3 py-1 bg-secondary-green text-white rounded hover:bg-secondary-green-hover"
      >
        스쿼드 공유
      </button>
      <button
        class="flex-1 px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        @click="openDeleteModal"
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
</template>
