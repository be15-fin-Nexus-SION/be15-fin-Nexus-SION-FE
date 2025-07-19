<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import PrimaryButton from "@/components/button/PrimaryButton.vue";
import ProjectHistoryQueryCard from "@/features/project/components/ProjectHistoryQueryCard.vue";
import ProjectHistoryRejectCard from "@/features/project/components/ProjectHistoryRejectCard.vue";
import ProjectHistoryStatusBadge from "@/components/badge/ProjectHistoryStatusBadge.vue";
import ProjectModal from "@/features/project/components/ProjectModal.vue";
import {
  getProjectHistoryDetail,
  rejectWorkHistory,
  approveWorkHistory,
} from "@/api/project.js";
import { useAuthStore } from "@/stores/auth.js";
import { showErrorToast, showSuccessToast } from "@/utills/toast.js";

const route = useRoute();
const router = useRouter();
const projectId = route.params.id;
const authStore = useAuthStore();
const memberRole = computed(() => authStore.memberRole);
const adminId = computed(() => authStore.memberId);

const project = ref(null);
const expandedIndex = ref(null);
const showModal = ref(false);
const rejectCardRef = ref(null);
const showRejectReason = ref(false);

onMounted(async () => {
  try {
    const res = await getProjectHistoryDetail(projectId);
    project.value = res.data.data;
  } catch (e) {
    const errorMessage = e.response?.data?.message || "이력 상세 조회 실패";
    showErrorToast(errorMessage);
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

const getRejectReason = () => rejectCardRef.value?.getReason?.() || "";

const onReject = async () => {
  const reason = getRejectReason();

  // 거부 사유가 없으면 사유 입력을 열고, 있으면 거부 처리 로직 실행
  if (!reason.trim()) {
    toggleInput();
    return;
  }

  try {
    // 거부 처리 API 호출
    await rejectWorkHistory({
      id: projectId,
      adminId: adminId.value,
      reason,
    });
    showSuccessToast("프로젝트 이력 등록이 거부되었습니다.");

    showRejectReason.value = false;

    // 페이지 새로고침 (0초로 돌아가기)
    router.go(0);
  } catch (e) {
    const errorMessage =
      e.response?.data?.message || "거부 처리 중 오류가 발생했습니다.";
    showErrorToast(errorMessage);
  }
};

const onApprove = async () => {
  try {
    await approveWorkHistory(projectId, adminId.value);
    showSuccessToast("프로젝트 이력 등록이 승인되었습니다.");

    // 페이지 새로고침
    router.go(0);
  } catch (e) {
    const errorMessage =
      e.response?.data?.message || "승인 처리 중 오류가 발생했습니다.";
    showErrorToast(errorMessage);
  }
};

const toggleInput = () => {
  showRejectReason.value = !showRejectReason.value; // 자식에서 실행할 toggleInput 메서드
};
</script>

<template>
  <div class="page-full">
    <div class="page-container">
      <h1 class="page-title">{{ project?.projectTitle }}</h1>

      <div class="project-area">
        <div class="project-info">
          <div class="project-status">
            <ProjectHistoryStatusBadge
              v-if="project?.approvalStatus"
              :status="project?.approvalStatus"
            />
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

        <div
          class="header-button"
          v-if="memberRole === 'ADMIN' && project?.approvalStatus === 'PENDING'"
        >
          <PrimaryButton
            label="거부"
            bg-color-class="bg-natural-gray"
            :hover-color-class="
              getRejectReason().trim() ? 'hover:bg-natural-gray-hover' : null
            "
            text-color-class="text-black"
            :disabled="!getRejectReason().trim()"
            @click="onReject"
          />
          <PrimaryButton
            label="승인"
            :disabled="!!getRejectReason().trim()"
            @click="onApprove"
          />
        </div>
      </div>

      <div v-if="isUnrequested()" class="unrequested-wrapper">
        <div class="button">
          <PrimaryButton label="등록 요청" @click="goToRegisterPage" />
        </div>
        <div class="empty-message">등록 요청한 프로젝트 이력이 없습니다.</div>
      </div>

      <div v-else class="work-list-wrapper">
        <!-- REJECTED 상태에서 거부 사유 표시 -->
        <ProjectHistoryRejectCard
          v-if="project?.approvalStatus === 'REJECTED'"
          ref="rejectCardRef"
          :expanded="showRejectReason"
          :rejectedReason="project?.rejectedReason || '거부 사유 없음'"
          :toggleInput="toggleInput"
        />

        <!-- PENDING 상태에서 관리자가 거부 사유 입력 가능 -->
        <ProjectHistoryRejectCard
          v-if="project?.approvalStatus === 'PENDING' && memberRole === 'ADMIN'"
          ref="rejectCardRef"
          :expanded="showRejectReason"
          :rejectedReason="project?.rejectedReason || ''"
          :toggleInput="toggleInput"
        />

        <!-- 프로젝트 기능 이력 리스트 -->
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

.project-area {
  @apply w-full flex justify-between;
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
  @apply text-bodySm text-primary hover:text-primary-hover hover:underline cursor-pointer w-fit;
}

.unrequested-wrapper {
  @apply w-full flex flex-col items-center gap-[30px];
}

.header-button {
  @apply w-full flex justify-end h-fit items-end gap-[10px];
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
