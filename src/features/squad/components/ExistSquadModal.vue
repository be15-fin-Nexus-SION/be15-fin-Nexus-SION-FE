<script setup>
import { ref, toRef, watch } from "vue";
import { startLoading } from "@/composable/useLoadingBar.js";
import { useInfiniteScroll } from "@/composable/useInfiniteScroll.js";
import { getSquadList } from "@/api/squad.js";
import Close_LG from "@/assets/icons/Close_LG.svg";
import Circle_Check from "@/assets/icons/Circle_Check.svg";
import ExistSquadCard from "@/features/squad/components/ExistSquadCard.vue";
import { showErrorToast } from "@/utills/toast.js";
const props = defineProps({
  isModalOpen: {
    type: Boolean,
    required: true,
  },
  projectCode: {
    type: String,
    required: true,
  },
  projectTitle: {
    type: String,
    required: true,
  },
});

const isModalOpenRef = toRef(props, "isModalOpen");

const emit = defineEmits(["close", "select"]);

const scrollContainer = ref(null);

const selectedIndex = ref(null);

const fetchFn = async (page) => {
  try {
    startLoading();
    const data = await getSquadList({
      projectCode: props.projectCode,
      page: page,
      size: 6,
    });

    // 이미 확정된 스쿼드는 에러처리
    if (data?.data?.data?.content === undefined) {
      showErrorToast("이미 확정된 스쿼드입니다.");
      handleClose();
      return { data: { data: { content: [], totalPages: 0, currentPage: 0 } } };
    }
    return data;
  } catch (e) {
    console.error(e + "스쿼드 목록 로드 실패");
  }
};

const { items: squads, reset } = useInfiniteScroll({
  fetchFn,
  scrollTargetRef: scrollContainer,
});

watch(isModalOpenRef, (newVal, oldVal) => {
  if (newVal !== oldVal && newVal === true) {
    reset();
  }
});

const handleSelect = () => {
  if (selectedIndex.value === null) {
    showErrorToast("스쿼드를 선택해주세요.");
    return;
  }
  const selectedSquad = squads.value[selectedIndex.value];
  emit("select", selectedSquad.squadCode);
  handleClose();
};

function handleClose() {
  emit("close");
}
</script>

<template>
  <div class="modal-overlay" @click.self="handleClose">
    <section class="squads-modal">
      <div class="modal-header">
        <div class="header1">{{ projectTitle }}</div>
        <button class="cancel-button" @click="handleClose">
          <img :src="Close_LG" alt="닫기 버튼" class="close-icon" />
        </button>
      </div>
      <div class="modal-body">
        <div v-if="squads.length === 0" class="empty-message-wrapper">
          <div class="text-gray-400 text-sm text-center py-2">
            프로젝트에 해당하는 스쿼드가 없습니다.
          </div>
        </div>
        <div v-else class="body-scroll" ref="scrollContainer">
          <div
            class="flex flex-wrap justify-left gap-x-7 gap-y-4 overflow-y-auto"
          >
            <ExistSquadCard
              v-for="(squad, idx) in squads"
              :key="idx"
              :squad="squad"
              :is-selected="selectedIndex === idx"
              @click="selectedIndex = idx"
            />
          </div>
        </div>
        <div class="mt-4">
          <button
            @click="handleSelect"
            class="mx-auto gap-2 w-[368px] h-[56px] bg-primary hover:bg-primary-hover shadow-hover rounded-md flex justify-center items-center text-bodyLg text-white"
          >
            <img :src="Circle_Check" alt="체크 이미지" class="close-icon" />
            선택 완료
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 bg-black/20 flex justify-center items-center z-50;
}

.squads-modal {
  @apply w-[960px] min-h-[80vh] max-h-[90vh] bg-white rounded-md pb-5 px-5 text-center shadow-elevated flex flex-col;
}

.modal-header {
  @apply w-full flex justify-between items-center border-b pt-4 pb-2 px-2;
}

.cancel-button {
  @apply border-none cursor-pointer;
}

.modal-body {
  @apply flex-1 flex flex-col;
}

.header1 {
  @apply text-headlineMd font-bold p-3 text-left;
}

.body-scroll {
  @apply overflow-y-auto space-y-1 py-2 pl-1 max-h-[65vh];
}

.empty-message-wrapper {
  @apply flex-grow flex justify-center items-center;
}
</style>
