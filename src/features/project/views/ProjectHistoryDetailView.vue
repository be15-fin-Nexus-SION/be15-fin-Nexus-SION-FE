<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import PrimaryButton from "@/components/button/PrimaryButton.vue";
import ProjectHistoryQueryCard from "@/features/project/components/ProjectHistoryQueryCard.vue";
import { getProjectHistoryDetail } from "@/api/project.js";
import ProjectHistoryStatusBadge from "@/components/badge/ProjectHistoryStatusBadge.vue";
import ProjectModal from "@/features/project/components/ProjectModal.vue";

const route = useRoute();
const router = useRouter();
const projectId = route.params.id;

const project = ref(null);
const expandedIndex = ref(null);
const showModal = ref(false);

onMounted(async () => {
  try {
    const res = await getProjectHistoryDetail(projectId);
    project.value = res.data.data;
  } catch (err) {
    console.error("이력 상세 조회 실패:", err);
  }
});

const isUnrequested = () => project.value?.approvalStatus === "NOT_REQUESTED";

const goToRegisterPage = () => {
  router.push(`/projects/history/register/${projectId}`);
};

const toggleExpand = (index) => {
  expandedIndex.value = expandedIndex.value === index ? null : index;
};

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};
</script>

<template>
  <div class="page-full">
    <div class="page-container">
      <h1 class="page-title">{{ project?.projectTitle }}</h1>

      <div class="project-info">
        <div class="project-status">
          <ProjectHistoryStatusBadge :status="project?.approvalStatus" />
          <span>|</span>
          <span class="project-dates">
            {{ project?.createdAt?.slice(0, 10) }}
            <template v-if="project?.actualEndDate">
              ~ {{ project.actualEndDate.slice(0, 10) }}
            </template>
          </span>
        </div>
        <span class="project-link" @click="openModal"
          >해당 프로젝트 자세히 보기</span
        >
      </div>

      <div v-if="isUnrequested()" class="unrequested-wrapper">
        <div class="button">
          <PrimaryButton label="등록 요청" @click="goToRegisterPage" />
        </div>
        <div class="empty-message">등록 요청한 프로젝트 이력이 없습니다.</div>
      </div>

      <div v-else class="work-list-wrapper">
        <div
          v-for="(history, index) in project?.histories"
          :key="history.historyId"
          @click="toggleExpand(index)"
        >
          <ProjectHistoryQueryCard
            :history="history"
            :expanded="index === expandedIndex"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Project 상세 모달 -->
  <ProjectModal
    v-if="showModal"
    :projectCode="project?.projectCode"
    @close="closeModal"
  />
</template>

<style scoped>
.page-full {
  @apply w-full h-fit flex justify-center;
}

.page-container {
  @apply flex flex-col w-[782px] h-fit items-center px-[30px] pt-[30px] pb-[60px] gap-[30px];
}

.page-title {
  @apply w-full text-headlineLg flex px-[12px] justify-start;
}

.project-info {
  @apply w-full flex flex-col justify-start px-[12px] gap-[10px];
}

.project-status {
  @apply flex items-center gap-2 text-bodySm;
}

.project-dates {
  @apply text-bodySm;
}

.project-link {
  @apply text-bodySm text-primary hover:text-primary-hover hover:underline cursor-pointer;
}

.unrequested-wrapper {
  @apply w-full flex flex-col items-center gap-[30px];
}

.button {
  @apply w-full flex justify-end;
}

.empty-message {
  @apply w-full flex justify-center text-gray-400 text-bodySm bg-white px-6 py-4 rounded shadow-base;
}

.work-list-wrapper {
  @apply w-full flex flex-col gap-4;
}
</style>
