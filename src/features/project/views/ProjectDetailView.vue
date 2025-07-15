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

const route = useRoute();
const router = useRouter();
const project = ref(null);
const isLoading = ref(true);
const isEditVisible = ref(false);
const projectCode = route.params.projectCode;
const authStore = useAuthStore();
const memberRole = computed(() => authStore.memberRole);

function handleEvaluate() {
  const confirm = window.confirm("프로젝트를 종료하시겠습니까?");
  if (!confirm) return;

  updateProjectStatus(projectCode, "EVALUATION")
    .then(() => {
      project.value.status = "EVALUATION";
      showSuccessToast("프로젝트 평가 상태로 변경되었습니다.");
    })
    .catch((e) => {
      console.error("프로젝트 종료 실패", e);
      showErrorToast("상태 변경 중 오류가 발생했습니다.");
    });
}

function handleComplete() {
  const confirm = window.confirm("프로젝트 평가를 종료하겠습니까?");
  if (!confirm) return;

  updateProjectStatus(projectCode, "COMPLETE")
    .then(() => {
      project.value.status = "EVALUATION";
      showSuccessToast("프로젝트가 종료되었습니다.");
    })
    .catch((e) => {
      console.error("프로젝트 종료 실패", e);
      showErrorToast("상태 변경 중 오류가 발생했습니다.");
    });
}

function handleDelete() {
  const confirmDelete = window.confirm("정말 이 프로젝트를 삭제하시겠습니까?");
  if (!confirmDelete) return;

  deleteProject(projectCode)
    .then(() => {
      showSuccessToast("프로젝트가 삭제되었습니다.");
      router.push("/projects");
    })
    .catch((error) => {
      console.error("프로젝트 삭제 실패:", error);
      showErrorToast("삭제 중 오류가 발생했습니다.");
    });
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
    console.error("프로젝트 수정 실패:", error);
    showErrorToast("수정 중 오류가 발생했습니다.");
  }
}

const isReplacementMode = ref(false); // 대체 모드 진입 여부
const isReplacementVisible = ref(false); // 패널 열림 여부
const replacingMember = ref(null); // 현재 대체 대상 멤버

const enterReplacementMode = () => {
  isReplacementMode.value = true;
  showSuccessToast("대체할 대상을 선택하세요.");
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
    console.error("프로젝트 인원 대체 실패", e);
    showErrorToast("프로젝트 인원 대체에 실패했습니다.");
  }
};

const approvalStatuses = ref([]);

async function fetchApprovalStatuses() {
  const { data } = await fetchDeveloperApprovals(projectCode);
  approvalStatuses.value = data;
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
    console.error("프로젝트 상세 정보 로드 실패:", error);
  } finally {
    isLoading.value = false;
  }

  await fetchApprovalStatuses();
});

const approvalStatusMap = computed(() => {
  return approvalStatuses.value.reduce((map, status) => {
    map[status.employeeId] = status.approvalStatus;
    return map;
  }, {});
});

const approvedCount = computed(
  () =>
    Object.values(approvalStatusMap.value).filter(
      (status) => status === "APPROVED",
    ).length,
);
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

          <a
            v-if="project.requestSpecificationUrl"
            :href="project.requestSpecificationUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-blue-600 underline hover:text-blue-800"
          >
            요구사항 명세서
          </a>

          <span
            v-if="project.analysisStatus"
            :class="[
              'text-sm font-semibold',
              project.analysisStatus === 'FAILED'
                ? 'text-red-500'
                : 'text-gray-500',
            ]"
          >
            {{
              project.analysisStatus === "PENDING"
                ? "보류"
                : project.analysisStatus === "PROCEEDING"
                  ? "진행중..."
                  : project.analysisStatus === "COMPLETE"
                    ? "분석 완료"
                    : project.analysisStatus === "FAILED"
                      ? "분석 실패"
                      : ""
            }}
          </span>
        </div>

        <template v-if="project.status === 'EVALUATION'">
          <button
            v-if="memberRole === 'ADMIN'"
            class="bg-gray-300 text-gray-600 px-5 py-2 rounded-md cursor-not-allowed"
            disabled
            :class="[
              'px-5 py-2 rounded-md font-semibold',
              approvalStatuses.every((a) => a.approvalStatus === 'APPROVED')
                ? 'bg-primary text-white cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed',
            ]"
            @click="handleComplete"
          >
            평가 완료
          </button>
        </template>
        <template v-else>
          <button
            class="bg-primary px-5 py-2 text-white rounded-md hover:brightness-110"
            @click="handleEvaluate"
          >
            종료
          </button>
        </template>
      </div>

      <!-- 기본 정보 -->
      <div class="flex gap-6 text-sm text-gray-600 mb-4">
        <div>
          <p class="text-gray-400">도메인</p>
          <p>{{ project.domainName }}</p>
        </div>
        <div>
          <p class="text-gray-400">기간</p>
          <p>{{ project.duration }}</p>
        </div>
        <div>
          <p class="text-gray-400">예산</p>
          <p>{{ project.budget }}</p>
        </div>
      </div>

      <!-- 개요 -->
      <div class="mb-6">
        <p class="text-gray-400 text-sm mb-2">개요</p>
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
          <p class="text-sm font-bold text-red-500 mb-2">
            승인 인원: {{ approvedCount }}/{{ project.members.length }}
          </p>
        </template>
        <template v-if="['WAITING', 'IN_PROGRESS'].includes(project.status)">
          <button
            class="text-sm text-blue-500"
            @click="
              project.status === 'WAITING'
                ? router.push(
                    `/squads/create/${projectCode}?squadCode=${project.squadCode}`,
                  )
                : enterReplacementMode()
            "
          >
            {{ project.status === "WAITING" ? "스쿼드 수정" : "인재 대체" }}
          </button>
        </template>
      </div>

      <p
        v-if="isReplacementMode"
        class="text-sm text-red-500 mb-2 font-medium animate-fade"
      >
        대체할 개발자를 선택하세요.
      </p>

      <div class="rounded-md overflow-hidden border-y border-gray-200">
        <div
          v-if="project.members.length > 0"
          class="rounded-md bg-[#F7FAFC] divide-y-2 max-h-80"
        >
          <SquadCard
            v-for="(member, idx) in project.members"
            :key="member.employeeId"
            :name="member.name"
            :role="member.job"
            :isLeader="member.isLeader"
            :imageUrl="
              // member.imageUrl ||
              `https://api.dicebear.com/9.x/notionists/svg?seed=` + idx
            "
            :selected="
              isReplacementMode &&
              replacingMember?.employeeId === member.employeeId
            "
            @click="handleMemberClick(member)"
            :approvalStatus="
              approvalStatusMap[member.employeeId] || 'NOT_REQUESTED'
            "
          />
        </div>
        <div v-else class="p-6 text-center text-gray-400 text-sm bg-[#F7FAFC]">
          스쿼드가 존재하지 않습니다.
        </div>
      </div>

      <!-- 하단 버튼 -->
      <div class="flex justify-end mt-6 gap-3">
        <button
          v-if="['WAITING', 'IN_PROGRESS'].includes(project.status)"
          class="px-4 py-2 bg-gray-100 rounded text-sm"
          @click="isEditVisible = true"
        >
          수정
        </button>
        <button
          class="px-4 py-2 bg-red-500 text-white rounded text-sm"
          @click="handleDelete"
        >
          삭제
        </button>
      </div>
    </template>

    <div v-else class="text-center text-gray-500">
      프로젝트 정보를 불러오지 못했습니다.
    </div>

    <!-- 수정 패널 -->
    <transition name="slide">
      <div v-if="isEditVisible" class="fixed inset-0 z-40">
        <div class="absolute inset-0" @click="isEditVisible = false"></div>
        <div
          class="absolute top-0 right-0 w-[480px] h-full bg-white border-l shadow-xl z-50 p-6 overflow-y-auto"
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
</template>

<style scoped>
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

.animate-fade {
  animation: fade 0.4s ease-out forwards;
}
</style>
