<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import TechBadge from "@/components/badge/TechBadge.vue";
import SquadCard from "@/features/project/components/SquadCard.vue";
import ProjectEditForm from "@/features/project/components/ProjectEditForm.vue";
import {
  fetchProjectDetail,
  updateProjectStatus,
  deleteProject,
  updateProject,
} from "@/api/project";
import { showSuccessToast, showErrorToast } from "@/utills/toast";

const route = useRoute();
const router = useRouter();
const project = ref(null);
const isLoading = ref(true);
const isEditVisible = ref(false);

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

function handleComplete() {
  const confirm = window.confirm("정말 프로젝트를 종료하시겠습니까?");
  if (!confirm) return;

  const projectCode = route.params.projectCode;
  updateProjectStatus(projectCode, "COMPLETE")
    .then(() => {
      project.value.status = "COMPLETE";
      showSuccessToast("프로젝트가 종료되었습니다.");
    })
    .catch((e) => {
      console.error("프로젝트 종료 실패", e);
      showErrorToast("종료 중 오류가 발생했습니다.");
    });
}

function handleDelete() {
  const confirmDelete = window.confirm("정말 이 프로젝트를 삭제하시겠습니까?");
  if (!confirmDelete) return;

  const projectCode = route.params.projectCode;
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

async function handleEditSubmit(payload) {
  const projectCode = route.params.projectCode;

  try {
    await updateProject(projectCode, payload);
    showSuccessToast("프로젝트가 수정되었습니다.");

    // UI 반영
    Object.assign(project.value, payload);

    isEditVisible.value = false;
  } catch (error) {
    console.error("프로젝트 수정 실패:", error);
    showErrorToast("수정 중 오류가 발생했습니다.");
  }
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

          <!-- 요구사항명세서 링크 -->
          <a
            v-if="project.requestSpecificationUrl"
            :href="project.requestSpecificationUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-blue-600 underline hover:text-blue-800"
          >
            요구사항 명세서
          </a>
        </div>

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

      <div class="rounded-md overflow-hidden border-y border-gray-200">
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
        <button
          v-if="project.status !== 'COMPLETE'"
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

    <!-- Edit Side Panel -->
    <transition name="slide">
      <div v-if="isEditVisible" class="fixed inset-0 z-40">
        <!-- 투명 클릭 감지 영역 -->
        <div class="absolute inset-0" @click="isEditVisible = false"></div>

        <!-- 실제 패널 -->
        <div
          class="absolute top-0 right-0 w-[480px] h-full bg-white border-l shadow-xl z-50 p-6 overflow-y-auto"
          @click.stop
        >
          <!-- 상단 헤더: 제목 + 수정 완료 버튼 -->
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold">프로젝트 수정</h2>
            <button
              type="submit"
              form="edit-form"
              class="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:brightness-110"
            >
              수정 완료
            </button>
          </div>

          <!-- 폼 -->
          <ProjectEditForm
            :initial-data="project"
            :is-edit="true"
            @submit="handleEditSubmit"
            @delete="handleDelete"
          />

          <!-- 닫기 버튼 -->
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
</style>
