<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import TechBadge from "@/components/badge/TechBadge.vue";
import SquadCard from "@/features/project/components/SquadCard.vue";
import ProjectEditForm from "@/features/project/components/ProjectEditForm.vue";
import {
  fetchProjectDetail,
  updateProjectStatus,
  deleteProject,
  updateProject,
  analyzeProject,
  replaceProjectSquad,
  fetchDeveloperApprovals,
} from "@/api/project";
import { showSuccessToast, showErrorToast } from "@/utills/toast";
import { useAuthStore } from "@/stores/auth.js";
import ReplacementPanel from "@/features/project/components/ReplacementPanel.vue";
import PrimaryButton from "@/components/button/PrimaryButton.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import StatusIndicator from "@/features/project/components/StatusIndicator.vue";

const route = useRoute();
const router = useRouter();
const project = ref(null);
const isLoading = ref(true);
const isEditVisible = ref(false);
const projectCode = route.params.projectCode;
const authStore = useAuthStore();
const memberRole = computed(() => authStore.memberRole);
const isConfirmVisible = ref(false);
const confirmMessage = ref("");
const onConfirmAction = ref(() => {});
const confirmText = ref("종료");

// 프로젝트 종료
function handleEvaluate() {
  confirmMessage.value = "프로젝트를 종료하시겠습니까?";
  confirmText.value = "종료";
  onConfirmAction.value = async () => {
    try {
      await updateProjectStatus(projectCode, "EVALUATION");
      project.value.status = "EVALUATION";
      showSuccessToast("프로젝트가 종료되고 평가 상태로 변경되었습니다.");
    } catch {
      showErrorToast("프로젝트 종료 중 오류가 발생했습니다.");
    } finally {
      isConfirmVisible.value = false;
    }
  };
  isConfirmVisible.value = true;
}

// 프로젝트 평가 종료
function handleComplete() {
  confirmMessage.value = "평가를 완료하겠습니까?";
  confirmText.value = "완료";
  onConfirmAction.value = async () => {
    try {
      await updateProjectStatus(projectCode, "COMPLETE");
      project.value.status = "EVALUATION";
      showSuccessToast("평가가 완료되었습니다.");
    } catch (e) {
      showErrorToast("평가 완료 처리 중 오류가 발생했습니다.");
    } finally {
      isConfirmVisible.value = false;
    }
  };
  isConfirmVisible.value = true;
}

// 프로젝트 삭제
function handleDelete() {
  confirmMessage.value = "정말 이 프로젝트를 삭제하시겠습니까?";
  confirmText.value = "삭제";
  onConfirmAction.value = async () => {
    try {
      await deleteProject(projectCode);
      showSuccessToast("프로젝트가 삭제되었습니다.");
      router.push("/projects");
    } catch (error) {
      showErrorToast("삭제 중 오류가 발생했습니다.");
    } finally {
      isConfirmVisible.value = false;
    }
  };
  isConfirmVisible.value = true;
}

async function handleEditSubmit(data) {
  try {
    await updateProject(projectCode, data.payload);
    showSuccessToast("프로젝트가 수정되었습니다.");

    await analyzeProject(projectCode, data.file);

    // UI 반영
    Object.assign(project.value, data.payload);

    isEditVisible.value = false;
  } catch (error) {
    showErrorToast("수정 중 오류가 발생했습니다.");
  }
}

const isReplacementMode = ref(false); // 대체 모드 진입 여부
const isReplacementVisible = ref(false); // 패널 열림 여부
const replacingMember = ref(null); // 현재 대체 대상 멤버

const toggleReplacementMode = () => {
  isReplacementMode.value = !isReplacementMode.value;
  isReplacementVisible.value = false;
  replacingMember.value = null;
};

const handleMemberClick = (member) => {
  if (isReplacementMode.value) {
    replacingMember.value = member;
    isReplacementVisible.value = true;
  }
};

const handleReplace = async ({ oldMemberId, newMemberId }) => {
  try {
    await replaceProjectSquad({
      squadCode: project.value.squadCode,
      oldEmployeeId: oldMemberId,
      newEmployeeId: newMemberId,
    });
    showSuccessToast("프로젝트 인원이 성공적으로 대체되었습니다.");
    isReplacementVisible.value = false;
    isReplacementMode.value = false;

    const response = await fetchProjectDetail(projectCode);
    project.value = response.data.data;
  } catch (e) {
    showErrorToast("프로젝트 인원 대체에 실패했습니다.");
  }
};

const approvalStatuses = ref([]);

async function fetchApprovalStatuses() {
  const { data } = await fetchDeveloperApprovals(projectCode);
  approvalStatuses.value = data.data;
}

onMounted(async () => {
  const projectCode = route.params.projectCode;
  try {
    const response = await fetchProjectDetail(projectCode);
    project.value = response.data.data;

    if (project.value?.members?.length > 0) {
      replacingMember.value = project.value.members[1];
    }
  } catch (error) {
    showErrorToast("프로젝트 상세 정보 로드 실패");
  } finally {
    isLoading.value = false;
  }

  await fetchApprovalStatuses();
});

const approvalStatusMap = computed(() => {
  return approvalStatuses.value.reduce((map, status) => {
    map[status.employeeIdentificationNumber] = {
      approvalStatus: status.approvalStatus,
      developerProjectWorkId: status.developerProjectWorkId,
    };
    return map;
  }, {});
});

const approvedCount = computed(
  () =>
    Object.values(approvalStatusMap.value).filter(
      (status) => status.approvalStatus === "APPROVED",
    ).length,
);

function beforeEnter(el) {
  el.style.height = "0";
  el.style.opacity = "0";
}

function enter(el) {
  el.style.transition = "all 0.3s ease";
  el.style.height = el.scrollHeight + "px";
  el.style.opacity = "1";
}

function leave(el) {
  el.style.transition = "all 0.3s ease";
  el.style.height = "0";
  el.style.opacity = "0";
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return `${date.getFullYear()}.${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}.${date.getDate().toString().padStart(2, "0")}`;
}
</script>

<template>
  <div
    class="max-w-4xl mx-auto px-8 py-10 bg-white rounded-xl relative overflow-hidden"
  >
    <div v-if="isLoading">로딩 중...</div>

    <template v-else-if="project">
      <!-- 제목 + 상태 버튼 -->
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold">{{ project.title }}</h1>
          <div class="status">
            <StatusIndicator
              :status="project.status"
              mode="project"
              :showLabel="true"
            />
          </div>
        </div>
        <template v-if="project.status === 'EVALUATION'">
          <PrimaryButton
            v-if="memberRole === 'ADMIN'"
            label="평가 완료"
            :onClick="handleComplete"
            :disabled="
              !Object.values(approvalStatusMap).every(
                (a) => a.approvalStatus === 'APPROVED',
              )
            "
            bgColorClass="bg-primary"
            hoverColorClass="hover:bg-primary-hover"
            textColorClass="text-white"
            customClass="px-5 py-2 rounded-md font-semibold"
          />
        </template>
        <template
          v-else-if="
            project.status === 'IN_PROGRESS' || project.status === 'WAITING'
          "
        >
          <PrimaryButton
            label="프로젝트 종료"
            @click="handleEvaluate"
            v-if="memberRole === 'ADMIN'"
          />
        </template>
        <template v-else>
          <PrimaryButton
            label="평가 완료"
            :onClick="handleComplete"
            :disabled="project.status === 'COMPLETE'"
            v-if="memberRole === 'ADMIN'"
          />
        </template>
      </div>

      <div class="requestSpecificationUrl flex items-center gap-3">
        <a
          v-if="project.requestSpecificationUrl"
          :href="project.requestSpecificationUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm underline text-support-stack hover:text-primary-hover"
        >
          요구사항 명세서
        </a>

        <StatusIndicator
          v-if="project.analysisStatus"
          :status="project.analysisStatus"
          mode="analysis"
        />
      </div>

      <!-- 기본 정보 -->
      <div class="flex gap-6 text-sm text-gray-600 mb-4">
        <div>
          <p class="text-gray-400">도메인</p>
          <p>{{ project.domainName }}</p>
        </div>
        <div>
          <p class="text-gray-400">
            {{ project.status === "WAITING" ? "예상 기간" : "기간" }}
          </p>
          <p>
            {{ formatDate(project.startDate) }} ~
            {{
              project.status === "COMPLETE" || project.endDate
                ? formatDate(project.endDate)
                : "진행중"
            }}
          </p>
        </div>
        <div>
          <div>
            <p class="text-gray-400">
              {{ project.status === "WAITING" ? "예산" : "실투입 금액" }}
            </p>
            <p>{{ project.budget }}</p>
          </div>
        </div>
      </div>

      <!-- 개요 -->
      <div class="mb-6">
        <p class="text-gray-400 text-sm">개요</p>
        <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {{ project.description }}
        </p>
      </div>

      <!-- 기술 스택 -->
      <div class="flex flex-wrap gap-2 mb-6">
        <TechBadge
          v-for="tech in project.techStacks"
          :key="tech"
          :label="tech"
        />
      </div>

      <div class="mb-2 flex justify-between items-center">
        <h2 class="font-semibold">구성 인원</h2>
        <template v-if="project.status === 'EVALUATION'">
          <p class="text-sm text-semantic-warning mr-2">
            승인 인원: {{ approvedCount }}/{{ project.members.length }}
          </p>
        </template>
        <template v-if="['WAITING', 'IN_PROGRESS'].includes(project.status)">
          <button
            v-if="memberRole === 'ADMIN'"
            class="text-sm text-blue-500"
            @click="
              project.status === 'WAITING'
                ? router.push(
                    `/squads/create/${projectCode}?squadCode=${project.squadCode}`,
                  )
                : toggleReplacementMode()
            "
          >
            {{
              project.status === "WAITING"
                ? "스쿼드 추가"
                : isReplacementMode
                  ? "인재 대체 취소"
                  : "인재 대체"
            }}
          </button>
        </template>
      </div>

      <!-- 메시지 문구 + 카드 간격 애니메이션 -->
      <Transition
        name="expand-fade"
        @before-enter="beforeEnter"
        @enter="enter"
        @leave="leave"
      >
        <div v-if="isReplacementMode" class="overflow-hidden">
          <p class="text-sm text-red-500 font-medium">
            대체할 개발자를 선택하세요.
          </p>
        </div>
      </Transition>

      <!-- 스쿼드 카드 영역 분기 -->
      <template v-if="project.members.length > 0">
        <Transition name="slide-y">
          <div
            v-if="true"
            class="rounded-md overflow-hidden border-y border-gray-200 transition-all duration-300 bg-[#F7FAFC] divide-y-2 mb-4"
            :class="{ 'mt-4': isReplacementMode, 'mt-0': !isReplacementMode }"
          >
            <SquadCard
              v-for="(member, idx) in project.members"
              :key="member.employeeId"
              :viewerRole="memberRole"
              :memberRole="memberRole"
              :employeeId="member.employeeId"
              :name="member.name"
              :role="member.job"
              :isLeader="member.isLeader"
              :imageUrl="`https://api.dicebear.com/9.x/notionists/svg?seed=${idx}`"
              :selected="
                isReplacementMode &&
                replacingMember?.employeeId === member.employeeId
              "
              @click="handleMemberClick(member)"
              :approvalStatus="
                approvalStatusMap[member.employeeId]?.approvalStatus ||
                'NOT_REQUESTED'
              "
              :isEvaluationMode="project.status === 'EVALUATION'"
              :historyId="
                approvalStatusMap[member.employeeId]?.developerProjectWorkId ||
                null
              "
            />
          </div>
        </Transition>
      </template>

      <template v-else>
        <Transition name="fade">
          <div
            v-if="true"
            class="p-6 text-center text-gray-400 text-sm bg-[#F7FAFC]"
          >
            스쿼드가 존재하지 않습니다.
          </div>
        </Transition>
      </template>

      <!-- 하단 버튼 -->
      <div
        v-if="memberRole === 'ADMIN' && ['WAITING'].includes(project.status)"
        class="flex justify-end mt-6 gap-3"
      >
        <PrimaryButton
          label="수정"
          :onClick="() => (isEditVisible = true)"
          bgColorClass="bg-gray-100"
          hoverColorClass="hover:bg-gray-200"
          textColorClass="text-gray-800"
          customClass="px-4 py-2 text-sm rounded"
        />
        <PrimaryButton
          label="삭제"
          :onClick="handleDelete"
          bgColorClass="bg-red-500"
          hoverColorClass="hover:bg-red-600"
          textColorClass="text-white"
          customClass="px-4 py-2 text-sm rounded"
        />
      </div>
    </template>

    <template v-else>
      <div class="text-center text-gray-500">
        프로젝트 정보를 불러오지 못했습니다.
      </div>
    </template>

    <!-- 수정 패널 -->
    <transition name="slide">
      <div v-if="isEditVisible" class="fixed inset-0 z-40">
        <div class="absolute inset-0" @click="isEditVisible = false"></div>
        <div
          class="absolute top-0 right-0 w-[480px] h-full bg-white border-l shadow-xl z-50 p-6 mt-[83px] overflow-y-auto"
          @click.stop
        >
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">프로젝트 수정</h2>
            <button
              type="submit"
              form="edit-form"
              class="bg-primary px-5 py-2 text-white rounded-md hover:brightness-110"
            >
              수정 완료
            </button>
          </div>

          <ProjectEditForm
            :initial-data="project"
            :is-edit="true"
            @submit="handleEditSubmit"
            @delete="handleDelete"
          />

          <div class="mt-6 flex justify-end">
            <button
              @click="isEditVisible = false"
              class="text-sm text-gray-500"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </transition>
    <ReplacementPanel
      :key="replacingMember?.employeeId"
      :project="project"
      v-show="isReplacementVisible"
      :leaving-member="replacingMember"
      @close="isReplacementVisible = false"
      @replace="handleReplace"
    />
  </div>

  <!-- 모달 -->
  <ConfirmModal
    v-if="isConfirmVisible"
    :message="confirmMessage"
    :confirmText="confirmText"
    @close="isConfirmVisible = false"
    @confirm="onConfirmAction"
  />
</template>

<style scoped>
.requestSpecificationUrl {
  @apply flex gap-[10px] mb-4;
}

/* 슬라이드 패널 (우측 수정 패널) */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* 세로 슬라이드 (문구 및 스쿼드 카드 영역에 사용) */
.slide-y-enter-active,
.slide-y-leave-active {
  transition: all 0.3s ease;
}
.slide-y-enter-from,
.slide-y-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.slide-y-enter-to,
.slide-y-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* 페이드 (문구용 트랜지션) */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.slide-y-enter-active,
.slide-y-leave-active {
  transition: all 0.3s ease;
}
.slide-y-enter-from,
.slide-y-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.slide-y-enter-to,
.slide-y-leave-from {
  opacity: 1;
  transform: translateY(0);
}

@keyframes fade {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
