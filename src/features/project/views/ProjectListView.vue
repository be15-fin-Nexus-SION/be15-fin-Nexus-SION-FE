<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { fetchProjectList } from "@/api/project.js";
import FilterSidebar from "@/features/project/components/FilterSidebar.vue";
import ProjectCard from "@/features/project/components/ProjectCard.vue";
import Pagination from "@/components/Pagination.vue";

const router = useRouter();

const allProjects = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const perPage = 4;
const selectedFilter = ref({});

async function fetchProjects(filter) {
  const requestPayload = {
    ...filter,
    page: currentPage.value - 1,
    size: perPage,
    statuses: filter.status ? [filter.status] : [],
    maxPeriodInMonth: filter.period,
    maxBudget: filter.budget * 10000, // ✅ 원 단위로 변환
    maxNumberOfMembers: filter.memberCount,
  };

  const response = await fetchProjectList(requestPayload);
  const pageData = response.data?.data;
  allProjects.value = pageData?.content ?? [];
  totalPages.value = pageData?.totalPages ?? 1;
}

function handleFilterChange(filter) {
  currentPage.value = 1;
  fetchProjects(filter);
}

function goToPage(page) {
  currentPage.value = page;
  fetchProjects(selectedFilter.value);
}

function goToRegister() {
  router.push("/projects/register");
}

const pagedProjects = computed(() => allProjects.value ?? []);
const hasNoProjects = computed(() => pagedProjects.value.length === 0);

onMounted(() => {
  fetchProjects({
    keyword: "",
    period: 36,
    budget: 50000,
    memberCount: 50,
    status: null,
  });
});
</script>

<template>
  <div class="page-layout">
    <div class="py-4">
      <FilterSidebar @filter-change="handleFilterChange" />
    </div>

    <div class="project-content-wrapper">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">프로젝트 목록</h1>
        <button
          class="bg-primary px-5 py-2 text-white rounded-md"
          @click="goToRegister"
        >
          등록
        </button>
      </div>

      <div v-if="hasNoProjects" class="text-center text-gray-500 mt-10">
        조건에 맞는 프로젝트가 없습니다.
      </div>

      <div v-else class="flex flex-col gap-4">
        <ProjectCard
          v-for="project in pagedProjects"
          :key="project.projectCode"
          :project="project"
        />
      </div>

      <div v-if="!hasNoProjects" class="mt-10 flex justify-center">
        <Pagination
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
  @apply flex-1 px-6 py-10 max-w-[970px];
}
</style>
