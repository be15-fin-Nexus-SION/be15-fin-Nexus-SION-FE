<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  fetchMyProjectList,
  fetchProjectList,
  getMyProjectWorkRequests,
  getRequestsForAdmin,
} from "@/api/project.js";
import { useAuthStore } from "@/stores/auth";
import FilterSidebar from "@/features/project/components/FilterSidebar.vue";
import ProjectCard from "@/features/project/components/ProjectCard.vue";
import Pagination from "@/components/Pagination.vue";
import ProjectHistoryList from "@/features/project/components/ProjectHistoryList.vue";
import { showErrorToast } from "@/utills/toast.js";

const router = useRouter();
const authStore = useAuthStore();

const allProjects = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const perPage = 10;
const selectedFilter = ref({});
const projectHistories = ref([]);
const activeTab = ref("list");
const selectedSort = ref("RECENT");

const memberRole = computed(() => authStore.memberRole);
const employeeId = computed(() => authStore.memberId);
const selectedStatusForUser = ref(null);
const selectedStatus = ref(null);

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
      sortBy: selectedSort.value,
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
      sortBy: selectedSort.value,
      keyword: filter.keyword ?? "",
    };
    const response = await fetchMyProjectList(requestPayload);
    const pageData = response.data?.data;

    allProjects.value = pageData?.content ?? [];
    totalPages.value = pageData?.totalPages ?? 1;
  }
}

async function fetchProjectHistories() {
  const page = currentPage.value - 1;
  try {
    const query = {
      page,
      size: perPage,
      status: selectedStatus.value,
    };

    const res =
      memberRole.value === "ADMIN"
        ? await getRequestsForAdmin(query)
        : await getMyProjectWorkRequests(query);

    if (res.data.success) {
      projectHistories.value = res.data.data?.content ?? [];
      totalPages.value = res.data.data?.totalPages ?? 1;
    } else {
      showErrorToast("요청 목록 불러오기 실패");
    }
  } catch (e) {
    const errorMessage = e.response?.data?.message || "요청 목록 불러오기 실패";
    showErrorToast(errorMessage);
  }
}

function handleFilterChange(filter) {
  currentPage.value = 1;
  selectedFilter.value = filter;
  selectedSort.value = filter.sortBy ?? "RECENT";

  if (activeTab.value === "list") {
    fetchProjects(filter);
  } else if (activeTab.value === "history") {
    selectedStatus.value = filter.status;
    fetchProjectHistories();
  }
}

function goToPage(page) {
  currentPage.value = page;
  if (activeTab.value === "list") {
    if (memberRole.value === "ADMIN") {
      fetchProjects(selectedFilter.value);
    } else {
      fetchProjects();
    }
  } else if (activeTab.value === "history") {
    fetchProjectHistories();
  }
}

function goToRegister() {
  router.push("/projects/register");
}

const pagedProjects = computed(() => allProjects.value ?? []);
const hasNoProjects = computed(() => pagedProjects.value.length === 0);

watch(
  () => activeTab.value,
  (tab) => {
    currentPage.value = 1;
    if (tab === "history") {
      fetchProjectHistories();
    } else if (tab === "list") {
      fetchProjects(selectedFilter.value);
    }
  },
  { immediate: true },
);

const route = useRoute();
onMounted(() => {
  if (!memberRole.value) return;
  if (memberRole.value === "ADMIN") {
    fetchProjects({
      keyword: "",
      period: 36,
      budget: 50000,
      memberCount: 50,
      status: null,
    });
  } else {
    fetchProjects();
  }
  const status = route.query.status;
  if (typeof status === "string" && status.toLowerCase() === "evaluate") {
    activeTab.value = "history";
  }
});
</script>

<template>
  <div class="page-layout">
    <div class="filter-sidebar-wrapper">
      <FilterSidebar
        :mode="activeTab === 'list' ? 'project' : 'history'"
        @filter-change="handleFilterChange"
      />
    </div>

    <div class="project-content-wrapper">
      <div class="header">
        <div class="tabs">
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

        <button
          class="register-button"
          v-if="memberRole === 'ADMIN' && activeTab === 'list'"
          @click="goToRegister"
        >
          등록
        </button>
      </div>

      <div class="content-flex-layout">
        <div class="project-main-area">
          <template v-if="activeTab === 'list'">
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

          <template v-else-if="activeTab === 'history'">
            <ProjectHistoryList
              :histories="projectHistories"
              :current-page="currentPage"
              :total-pages="totalPages"
              @change-page="goToPage"
            />
          </template>
        </div>
      </div>
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
  @apply flex justify-between items-start mb-6;
}

.tabs {
  @apply flex gap-6;
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

.content-flex-layout {
  @apply flex gap-6;
}

.project-main-area {
  @apply flex-1;
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
</style>
