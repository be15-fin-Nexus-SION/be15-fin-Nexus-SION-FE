<script setup>
import { useRouter } from "vue-router";
import { computed } from "vue";

// ✅ props 정의
const props = defineProps({
  pendingProjects: {
    type: Array,
    required: true,
  },
  analyzingProjects: {
    type: Array,
    required: true,
  },
});

const router = useRouter();
const now = new Date();

const formattedRoles = (roles) =>
  Object.entries(roles)
    .map(([role, count]) => `${role} ${count}명`)
    .join(" / ");

const remainingDays = (startDate) => {
  const date = new Date(startDate);
  const diff = (date - now) / (1000 * 60 * 60 * 24);
  return `${Math.ceil(diff)}일 남음`;
};

const elapsedTime = (startTime) => {
  const start = new Date(startTime);
  const diffMs = now - start;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);
  return `${diffHours}시간 ${diffMinutes}분 경과`;
};

const goToSquad = (projectCode) => {
  router.push(`/squads?projectId=${projectCode}`);
};
</script>

<template>
  <div class="flex w-full gap-6">
    <!-- 마감 임박 프로젝트 -->
    <div
      class="flex-[2] p-6 bg-white rounded-xl shadow-md border border-gray-200"
    >
      <div class="flex justify-between items-center mb-5">
        <h2 class="text-lg font-bold text-gray-800">마감 임박 프로젝트</h2>
        <span class="text-sm text-primary font-medium">
          기준: {{ new Date().toLocaleDateString("ko-KR") }}
        </span>
      </div>

      <ul class="space-y-4">
        <li
          v-for="project in props.pendingProjects"
          :key="project.projectCode"
          class="relative group border-l-4 border-primary pl-4 py-4 bg-gray-50 rounded-md overflow-hidden transition-shadow hover:shadow-lg"
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
            <p class="text-sm text-gray-600 mb-1">
              {{ project.description }}
            </p>
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

    <!-- 분석 중 프로젝트 -->
    <div
      class="flex-1 p-6 bg-white rounded-xl shadow-md border border-gray-200"
    >
      <h2 class="text-lg font-bold text-gray-800 mb-5">분석 중 프로젝트</h2>
      <ul class="space-y-4">
        <li
          v-for="project in props.analyzingProjects"
          :key="project.id"
          class="p-4 bg-gray-50 rounded-md border-l-4 border-blue-400"
        >
          <div class="flex justify-between items-center mb-1">
            <h3 class="font-semibold text-base text-gray-800">
              {{ project.name }}
            </h3>
            <span class="text-xs text-blue-500">{{
              elapsedTime(project.analysisStartTime)
            }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
