<script setup>
import { ref, computed, onMounted } from "vue";
import FilterSidebar from "@/features/project/components/FilterSidebar.vue";
import ProjectCard from "@/features/project/components/ProjectCard.vue";
import BasePagination from "@/components/BasePagination.vue";

const allProjects = ref([]);
const currentPage = ref(1);
const perPage = 4;
const selectedFilter = ref({});

function fetchProjects(filter) {
  selectedFilter.value = filter;

  // 더미 프로젝트 12개 생성
  allProjects.value = Array.from({ length: 12 }).map((_, i) => ({
    title: "Project Alpha",
    startDate: "2025/01/01",
    endDate: "2025/07/01",
    description:
      "사내 직원들의 근무 이력과 프로젝트 배치를 효율적으로 관리할 수 있는 HR 시스템을 구축하는 프로젝트입니다. 연차·직무·기술 스택 기반 자동 매칭 기능이 핵심입니다.",
    hrCount: 8,
    status: ["WAITING", "IN_PROGRESS", "COMPLETE", "INCOMPLETE"][i % 4],
  }));
}

function handleFilterChange(filter) {
  currentPage.value = 1;
  fetchProjects(filter);
}

function goToPage(page) {
  currentPage.value = page;
}

const pagedProjects = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return allProjects.value.slice(start, start + perPage);
});

const totalPages = computed(() =>
  Math.ceil(allProjects.value.length / perPage),
);

onMounted(() => fetchProjects({}));
</script>

<template>
  <div class="page-layout">
    <FilterSidebar @filter-change="handleFilterChange" />

    <div class="project-content-wrapper">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-headlineMd font-bold">프로젝트 목록</h1>
        <button class="bg-primary px-5 py-2 text-white rounded-md">등록</button>
      </div>

      <div class="flex flex-col gap-4">
        <ProjectCard
          v-for="(project, index) in pagedProjects"
          :key="index"
          :project="project"
        />
      </div>

      <div class="mt-10 flex justify-center">
        <BasePagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @change="goToPage"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-layout {
  @apply flex relative;
}

.project-content-wrapper {
  @apply flex-1 px-16 py-12 max-w-[970px];
}
</style>
