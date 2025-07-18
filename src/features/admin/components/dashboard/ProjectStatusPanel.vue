<script setup>
import { useRouter } from "vue-router";
import { computed } from "vue";

const props = defineProps({
  pendingProjects: {
    type: Array,
    required: true,
  },
  pendingApprovalProjects: {
    type: Array,
    required: true,
  },
});

const router = useRouter();

const today = computed(() => new Date().toLocaleDateString("ko-KR"));

const formattedRoles = (roles) => {
  if (!roles || Object.keys(roles).length === 0) return "직무 정보 없음";
  return Object.entries(roles)
    .map(([role, count]) => `${role} ${count}명`)
    .join(" / ");
};

const remainingDays = (startDate) => {
  const now = new Date();
  const date = new Date(startDate);
  const diff = (date - now) / (1000 * 60 * 60 * 24);
  const daysLeft = Math.ceil(diff);
  return daysLeft > 0
    ? `${daysLeft}일 남음`
    : daysLeft === 0
      ? "마감 임박"
      : "기간 초과";
};

const elapsedTimeSinceRequest = (startTime) => {
  const now = new Date();
  const start = new Date(startTime);
  const diffMs = now - start;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);
  return `${diffHours}시간 ${diffMinutes}분 경과`;
};

const goToSquad = (projectCode) => {
  router.push(`/squads?projectId=${projectCode}`);
};

const goToApprovalPage = (id) => {
  router.push(`/projects/history/${id}`);
};

function handleViewMore() {
  router.push("/projects");
}

function handleGoToProjectDetail(projectCode) {
  router.push(`/projects/${projectCode}`);
}
</script>

<template>
  <div class="flex w-full gap-6">
    <div
      class="flex-[2] p-6 bg-white rounded-xl shadow-md border border-gray-200"
    >
      <div class="flex justify-between items-center mb-5">
        <div class="flex items-center">
          <h2 class="text-lg font-bold text-gray-800">마감 임박 프로젝트</h2>
          <span
            class="ml-2 text-gray-400 cursor-pointer text-sm text-center"
            @click="handleViewMore"
          >
            더보기
          </span>
        </div>
        <span class="text-sm text-primary font-medium">
          기준: {{ today }}
        </span>
      </div>

      <ul class="space-y-4">
        <li
          v-for="project in pendingProjects"
          :key="project.projectCode"
          class="relative group border-l-4 border-primary pl-4 py-4 bg-gray-50 rounded-md overflow-hidden transition-shadow hover:shadow-lg cursor-pointer"
          @click="handleGoToProjectDetail(project.projectCode)"
        >
          <div class="transition-all group-hover:translate-x-[-4px]">
            <div class="flex justify-between items-center mb-1">
              <h3 class="font-semibold text-base text-gray-800">
                {{ project.title }}
              </h3>
              <span class="text-xs text-secondary">{{
                remainingDays(project.startDate)
              }}</span>
            </div>
            <p class="text-sm text-gray-600 mb-1">{{ project.description }}</p>
            <p class="text-sm text-gray-500">
              직무: {{ formattedRoles(project.roles) }}
            </p>
            <div class="flex justify-between mt-1 text-xs text-gray-400">
              <span>예산: {{ project.budget.toLocaleString() }}만원</span>
              <span>도메인: {{ project.domainName }}</span>
            </div>
          </div>

          <!-- 슬라이드 버튼 -->
          <div
            class="absolute top-1/2 right-4 transform -translate-y-1/2 translate-x-full group-hover:translate-x-0 transition-all duration-300"
          >
            <button
              @click="goToSquad(project.projectCode)"
              class="px-4 py-1 text-sm font-semibold rounded-md bg-primary text-white shadow hover:bg-primary-dark transition"
            >
              스쿼드 구성하기 →
            </button>
          </div>
        </li>
      </ul>
    </div>

    <div
      class="flex-1 p-6 bg-white rounded-xl shadow-md border border-gray-200"
    >
      <div class="flex justify-between items-center mb-5">
        <h2 class="text-lg font-bold text-gray-800">승인 대기 프로젝트</h2>
        <span class="text-sm text-primary font-medium">기준: {{ today }}</span>
      </div>

      <template v-if="pendingApprovalProjects.length > 0">
        <ul class="space-y-4">
          <li
            v-for="approval in pendingApprovalProjects"
            :key="approval.id"
            class="relative group border-l-4 border-yellow-400 pl-4 py-4 bg-gray-50 rounded-md overflow-hidden transition-shadow hover:shadow-lg"
          >
            <div class="transition-all group-hover:translate-x-[-4px]">
              <div class="flex justify-between items-center mb-1">
                <h3 class="font-semibold text-base text-gray-800">
                  {{ approval.projectTitle }}
                </h3>
                <span class="text-xs text-secondary">
                  {{ elapsedTimeSinceRequest(approval.createdAt) }}
                </span>
              </div>
              <p class="text-sm text-gray-600 mb-1">
                개발자: {{ approval.developerName }} ({{
                  approval.developerId
                }})
              </p>
              <p class="text-sm text-gray-500">
                프로젝트 코드: {{ approval.projectCode }}
              </p>
            </div>

            <!-- 승인하기 버튼 -->
            <div
              class="absolute top-1/2 right-4 transform -translate-y-1/2 translate-x-full group-hover:translate-x-0 transition-all duration-300"
            >
              <button
                @click="goToApprovalPage(approval.id)"
                class="px-4 py-1 text-sm font-semibold rounded-md bg-yellow-400 text-white shadow hover:bg-yellow-500 transition"
              >
                승인하기 →
              </button>
            </div>
          </li>
        </ul>
      </template>
      <template v-else>
        <div
          class="flex flex-col items-center justify-center h-full min-h-[200px] text-gray-400 text-sm font-medium"
        >
          현재 승인 대기 중인 프로젝트가 없습니다.
        </div>
      </template>
    </div>
  </div>
</template>
