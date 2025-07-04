<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import TechBadge from "@/components/badge/TechBadge.vue";
import SquadCard from "@/features/project/components/SquadCard.vue";
import { fetchProjectDetail, updateProjectStatus } from "@/api/project";
import { showSuccessToast } from "@/utills/toast";

const route = useRoute();
const project = ref(null);
const isLoading = ref(true);

onMounted(async () => {
  const projectCode = route.params.projectCode;
  try {
    const response = await fetchProjectDetail(projectCode);
    project.value = response.data.data;
  } catch (error) {
    console.error("프로젝트 상세 정보 로드 실패:", error);
  } finally {
    isLoading.value = false;
  }
});

// 종료 처리
async function handleComplete() {
  const confirm = window.confirm("정말 프로젝트를 종료하시겠습니까?");
  if (!confirm) return;

  try {
    const projectCode = route.params.projectCode;
    await updateProjectStatus(projectCode, "COMPLETE");
    project.value.status = "COMPLETE";
    showSuccessToast("프로젝트가 종료되었습니다.");
  } catch (e) {
    console.error("프로젝트 종료 실패", e);
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-8 py-10 bg-white rounded-xl">
    <div v-if="isLoading">로딩 중...</div>

    <template v-else-if="project">
      <!-- 제목 + 상태 버튼 -->
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">프로젝트 {{ project.title }}</h1>

        <!-- 상태별 버튼 -->
        <template v-if="project.status === 'COMPLETE'">
          <button
            class="bg-gray-300 text-gray-600 text-sm px-4 py-1 rounded cursor-not-allowed"
            disabled
          >
            종료됨
          </button>
        </template>
        <template v-else>
          <button
            class="bg-[#6574F6] text-white text-sm px-4 py-1 rounded hover:brightness-110"
            @click="handleComplete"
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

      <!-- 구성 인원 -->
      <div class="mb-2 flex justify-between items-center">
        <h2 class="font-semibold">구성 인원</h2>
        <button class="text-sm text-blue-500">스쿼드 수정</button>
      </div>

      <!-- 리스트 -->
      <div class="rounded-md overflow-hidden border-y border-gray-200">
        <!-- 리스트 (스크롤 적용) -->
        <div class="rounded-md bg-[#F7FAFC] divide-y max-h-80 overflow-y-auto">
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

      <!-- 하단 버튼 -->
      <div class="flex justify-end mt-6 gap-3">
        <!-- 수정 버튼은 COMPLETE 상태가 아닐 때만 표시 -->
        <button
          v-if="project.status !== 'COMPLETE'"
          class="px-4 py-2 bg-gray-100 rounded text-sm"
        >
          수정
        </button>

        <button class="px-4 py-2 bg-red-500 text-white rounded text-sm">
          삭제
        </button>
      </div>
    </template>

    <div v-else class="text-center text-gray-500">
      프로젝트 정보를 불러오지 못했습니다.
    </div>
  </div>
</template>

<style scoped></style>
