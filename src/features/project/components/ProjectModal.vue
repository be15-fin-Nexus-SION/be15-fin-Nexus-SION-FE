<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useAuthStore } from "@/stores/auth.js";
import { fetchProjectDetail } from "@/api/project";
import TechBadge from "@/components/badge/TechBadge.vue";
import SquadCard from "@/features/project/components/SquadCard.vue";
import { showErrorToast } from "@/utills/toast.js";

const scrollY = ref(0);

const props = defineProps({
  projectCode: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const project = ref(null);
const isLoading = ref(true);
const authStore = useAuthStore();
const memberId = computed(() => authStore.memberId);
const memberRole = computed(() => authStore.memberRole);

onMounted(async () => {
  scrollY.value = window.scrollY;

  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY.value}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";

  try {
    const response = await fetchProjectDetail(props.projectCode);
    project.value = response.data.data;
  } catch (e) {
    showErrorToast("프로젝트 상세 정보 로드 실패");
  } finally {
    isLoading.value = false;
  }
});

onUnmounted(() => {
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";

  window.scrollTo(0, scrollY.value);
});

const closeModal = () => {
  emit("close");
};
</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay">
      <div class="project-modal">
        <div class="sticky-header">
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

        <div v-if="isLoading">로딩 중...</div>

        <template v-else-if="project">
          <div class="modal-header">
            <h1 class="modal-title">{{ project.title }}</h1>
          </div>

          <div class="w-full mb-4">
            <a
              v-if="project.requestSpecificationUrl"
              :href="project.requestSpecificationUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm underline text-support-stack hover:text-primary-hover"
            >
              요구사항 명세서
            </a>
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

          <div class="section">
            <p class="label">도메인</p>
            <div class="tech-stack">
              <TechBadge
                v-for="tech in project.techStacks"
                :key="tech"
                :label="tech"
              />
            </div>
          </div>

          <div class="section">
            <div class="flex justify-between items-center mb-2">
              <h2 class="font-semibold">구성 인원</h2>
            </div>

            <div class="squad-list">
              <SquadCard
                v-for="member in project.members"
                :key="member.employeeId"
                :viewerRole="memberRole"
                :name="member.name"
                :role="member.job"
                :isLeader="member.isLeader"
                :imageUrl="member.imageUrl"
                :employeeId="member.employeeId"
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
  @apply flex flex-col items-center bg-white rounded-xl shadow-lg;
  width: 800px;
  height: 600px;
  max-height: 600vh;
  overflow-y: auto;
  position: relative;
  padding: 2rem;
  padding-top: 1rem;
}

.sticky-header {
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.close-button {
  width: 25px;
  height: 25px;
  background: transparent;
  border: none;
  cursor: pointer;
}

.modal-header {
  @apply w-full flex justify-between items-center mb-4;
}

.modal-title {
  @apply text-xl font-bold;
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
