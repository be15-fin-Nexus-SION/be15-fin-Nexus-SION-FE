<script setup>
import { onMounted, ref } from "vue";
import { fetchProjectDetail, updateProjectStatus } from "@/api/project";
import TechBadge from "@/components/badge/TechBadge.vue";
import SquadCard from "@/features/project/components/SquadCard.vue";
import { showSuccessToast } from "@/utills/toast";

const props = defineProps({
  projectCode: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const project = ref(null);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const response = await fetchProjectDetail(props.projectCode);
    project.value = response.data.data;
  } catch (error) {
    console.error("프로젝트 상세 정보 로드 실패:", error);
  } finally {
    isLoading.value = false;
  }
});

const handleComplete = async () => {
  const confirm = window.confirm("정말 프로젝트를 종료하시겠습니까?");
  if (!confirm) return;

  try {
    await updateProjectStatus(props.projectCode, "COMPLETE");
    project.value.status = "COMPLETE";
    showSuccessToast("프로젝트가 종료되었습니다.");
  } catch (e) {
    console.error("프로젝트 종료 실패", e);
  }
};

const closeModal = () => {
  emit("close");
};
</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay">
      <div class="project-modal">
        <!-- 닫기 버튼 영역 -->
        <div class="modal-close-wrapper">
          <button class="close-button" @click="closeModal">
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line
                x1="6"
                y1="6"
                x2="19"
                y2="19"
                stroke="black"
                stroke-width="2"
              />
              <line
                x1="19"
                y1="6"
                x2="6"
                y2="19"
                stroke="black"
                stroke-width="2"
              />
            </svg>
          </button>
        </div>

        <!-- 본문 내용 -->
        <div v-if="isLoading">로딩 중...</div>

        <template v-else-if="project">
          <div class="modal-header">
            <h1 class="modal-title">프로젝트 {{ project.title }}</h1>
            <button
              v-if="project.status === 'COMPLETE'"
              class="disabled-button"
              disabled
            >
              종료됨
            </button>
            <button v-else class="complete-button" @click="handleComplete">
              종료
            </button>
          </div>

          <div class="info-group">
            <div>
              <p class="label">도메인</p>
              <p>{{ project.domainName }}</p>
            </div>
            <div>
              <p class="label">기간</p>
              <p>{{ project.duration }}</p>
            </div>
            <div>
              <p class="label">예산</p>
              <p>{{ project.budget }}</p>
            </div>
          </div>

          <div class="section">
            <p class="label">개요</p>
            <p class="description">{{ project.description }}</p>
          </div>

          <div class="tech-stack">
            <TechBadge
              v-for="tech in project.techStacks"
              :key="tech"
              :label="tech"
            />
          </div>

          <div class="section">
            <div class="flex justify-between items-center mb-2">
              <h2 class="font-semibold">구성 인원</h2>
            </div>

            <div class="squad-list">
              <SquadCard
                v-for="(member, idx) in project.members"
                :key="idx"
                :name="member.name"
                :role="member.job"
                :isLeader="member.isLeader"
                :imageUrl="member.imageUrl"
              />
            </div>
          </div>
        </template>

        <div v-else class="text-gray-500 text-center">
          프로젝트 정보를 불러오지 못했습니다.
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center;
}

.project-modal {
  @apply flex flex-col items-center p-6 bg-white rounded-xl overflow-y-auto shadow-lg;
  width: 560px;
  max-height: 80vh;
  position: relative;
}

.modal-close-wrapper {
  @apply w-full flex justify-end mb-4;
}

.close-button {
  width: 25px;
  height: 25px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
}

.modal-header {
  @apply w-full flex justify-between items-center mb-4;
}

.modal-title {
  @apply text-xl font-bold;
}

.disabled-button {
  @apply bg-gray-300 text-gray-600 text-sm px-4 py-1 rounded cursor-not-allowed;
}

.complete-button {
  background-color: #6574f6;
  @apply text-white text-sm px-4 py-1 rounded hover:brightness-110;
}

.info-group {
  @apply w-full flex gap-6 text-sm text-gray-600 mb-4;
}

.label {
  @apply text-gray-400 text-sm mb-1;
}

.description {
  @apply text-sm text-gray-700 leading-relaxed whitespace-pre-line;
}

.section {
  @apply w-full mb-6;
}

.tech-stack {
  @apply flex flex-wrap justify-start w-full gap-2 mb-6;
}

.squad-list {
  @apply bg-[#F7FAFC] divide-y max-h-64 overflow-y-auto rounded-md border-y border-gray-200;
}

.modal-actions {
  @apply w-full flex justify-end mt-6 gap-3;
}

.action-button {
  @apply px-4 py-2 rounded text-sm;
}
</style>
