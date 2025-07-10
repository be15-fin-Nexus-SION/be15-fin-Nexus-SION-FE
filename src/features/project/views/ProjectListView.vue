<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import {
  fetchProjectList,
  fetchMyProjectList,
  getMyProjectWorkRequests,
} from "@/api/project.js";
import { useAuthStore } from "@/stores/auth";
import FilterSidebar from "@/features/project/components/FilterSidebar.vue";
import ProjectCard from "@/features/project/components/ProjectCard.vue";
import Pagination from "@/components/Pagination.vue";
import StatusFilter from "@/features/project/components/StatusFilter.vue";
import ProjectHistoryList from "@/features/project/components/ProjectHistoryList.vue";

const router = useRouter();
const authStore = useAuthStore();

const allProjects = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const perPage = 4;
const selectedFilter = ref({});
const projectHistories = ref([]);
const activeTab = ref("list");

const memberRole = computed(() => authStore.memberRole);
const employeeId = computed(() => authStore.memberId);
const selectedStatusForUser = ref(null);

function goToDetail(projectCode) {
  router.push({ name: "project-detail", params: { projectCode } });
}

async function fetchProjects(filter = {}) {
  const page = currentPage.value - 1;

  if (memberRole.value === "ADMIN") {
    const requestPayload = {
      ...filter,
      page,
      size: perPage,
      statuses: filter.status ? [filter.status] : [],
      maxPeriodInMonth: filter.period,
      maxBudget: filter.budget * 10000,
      maxNumberOfMembers: filter.memberCount,
    };
    const response = await fetchProjectList(requestPayload);
    const pageData = response.data?.data;
    allProjects.value = pageData?.content ?? [];
    totalPages.value = pageData?.totalPages ?? 1;
  } else {
    const statuses = selectedStatusForUser.value
      ? [selectedStatusForUser.value]
      : [];
    const requestPayload = {
      employeeId: employeeId.value,
      page,
      size: perPage,
      statuses,
    };
    const response = await fetchMyProjectList(requestPayload);
    const pageData = response.data?.data;
    allProjects.value = pageData?.content ?? [];
    totalPages.value = pageData?.totalPages ?? 1;
  }
}

function handleFilterChange(filter) {
  currentPage.value = 1;
  selectedFilter.value = filter;
  fetchProjects(filter);
}

function handleStatusRadioChange(statusValue) {
  selectedStatusForUser.value =
    selectedStatusForUser.value === statusValue ? null : statusValue;
  currentPage.value = 1;
  fetchProjects();
}

function goToPage(page) {
  currentPage.value = page;
  if (memberRole.value === "ADMIN") {
    fetchProjects(selectedFilter.value);
  } else {
    fetchProjects();
  }
}

function goToRegister() {
  router.push("/projects/register");
}

async function fetchProjectHistories() {
  const res = await getMyProjectWorkRequests();
  if (res.data.success) {
    projectHistories.value = res.data.data;
  }
}

const statusOptions = [
  { label: "미완료", value: "INCOMPLETE", color: "#9e9e9e" },
  { label: "시작 전", value: "WAITING", color: "#FFD700" },
  { label: "진행중", value: "IN_PROGRESS", color: "#00C851" },
  { label: "종료", value: "COMPLETE", color: "#FF4444" },
];

const pagedProjects = computed(() => allProjects.value ?? []);
const hasNoProjects = computed(() => pagedProjects.value.length === 0);

onMounted(() => {
  // memberRole 값이 셋팅된 이후 fetchProjects 수행
  watch(
    () => memberRole.value,
    (role) => {
      if (!role) return;
      if (role === "ADMIN") {
        fetchProjects({
          keyword: "",
          period: 36,
          budget: 50000,
          memberCount: 50,
          status: null,
        });
      } else {
        fetchProjects();
        fetchProjectHistories();
      }
    },
    { immediate: true },
  );
});
</script>

<template>
  <div class="page-layout">
    <div class="filter-sidebar-wrapper" v-if="memberRole === 'ADMIN'">
      <FilterSidebar @filter-change="handleFilterChange" />
    </div>

    <div class="project-content-wrapper">
      <div class="header">
        <div class="tabs" v-if="memberRole !== 'ADMIN'">
          <h1
            class="title-tab"
            :class="{ active: activeTab === 'list' }"
            @click="activeTab = 'list'"
          >
            프로젝트 목록
          </h1>
          <h1
            class="title-tab"
            :class="{ active: activeTab === 'history' }"
            @click="activeTab = 'history'"
          >
            프로젝트 이력 등록
          </h1>
        </div>

        <h1 class="title" v-else>프로젝트 목록</h1>
        <button
          class="register-button"
          v-if="memberRole === 'ADMIN'"
          @click="goToRegister"
        >
          등록
        </button>
      </div>

      <!-- 일반 사용자: 프로젝트 목록 -->
      <template v-if="memberRole !== 'ADMIN' && activeTab === 'list'">
        <StatusFilter
          :selected-status="selectedStatusForUser"
          :options="statusOptions"
          @change="handleStatusRadioChange"
        />

        <div v-if="hasNoProjects" class="empty-message">
          조건에 맞는 프로젝트가 없습니다.
        </div>

        <div v-else class="project-list">
          <ProjectCard
            v-for="project in pagedProjects"
            :key="project.projectCode"
            :project="project"
            @click="goToDetail(project.projectCode)"
          />
        </div>

        <div v-if="!hasNoProjects" class="pagination-wrapper">
          <Pagination
            :current-page="currentPage"
            :total-pages="totalPages"
            @change="goToPage"
          />
        </div>
      </template>

      <!-- 일반 사용자: 프로젝트 이력 등록 -->
      <template v-if="memberRole !== 'ADMIN' && activeTab === 'history'">
        <div class="page-full">
          <div class="page-container">
            <ProjectHistoryList :histories="projectHistories" />
          </div>
        </div>
      </template>

      <!-- 관리자: 프로젝트 목록 -->
      <template v-if="memberRole === 'ADMIN'">
        <div v-if="hasNoProjects" class="empty-message">
          조건에 맞는 프로젝트가 없습니다.
        </div>

        <div v-else class="project-list">
          <ProjectCard
            v-for="project in pagedProjects"
            :key="project.projectCode"
            :project="project"
            @click="goToDetail(project.projectCode)"
          />
        </div>

        <div v-if="!hasNoProjects" class="pagination-wrapper">
          <Pagination
            :current-page="currentPage"
            :total-pages="totalPages"
            @change="goToPage"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.page-layout {
  @apply flex justify-center;
}

.filter-sidebar-wrapper {
  @apply py-4;
}

.project-content-wrapper {
  @apply flex-1 px-6 py-10 max-w-[970px];
}

.header {
  @apply flex justify-between items-center mb-6;
}

.tabs {
  @apply flex gap-6;
}

.title {
  @apply text-2xl font-bold;
}

.title-tab {
  @apply text-2xl font-bold cursor-pointer;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.title-tab.active {
  opacity: 1;
  border-bottom: 2px solid #000;
}

.register-button {
  @apply bg-primary px-5 py-2 text-white rounded-md;
}

.empty-message {
  @apply text-center text-gray-500 mt-10;
}

.project-list {
  @apply flex flex-col gap-4;
}

.pagination-wrapper {
  @apply mt-10 flex justify-center;
}

.page-full {
  @apply w-full h-fit flex justify-center;
}

.page-container {
  @apply flex flex-col w-[782px] h-fit items-center px-[30px] py-[30px] gap-[30px];
}

.page-title {
  @apply w-full text-headlineLg flex px-[12px] justify-start;
}
</style>
