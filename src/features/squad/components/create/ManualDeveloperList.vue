<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import FilterModal from "@/features/squad/components/modal/FilterModal.vue";
import SortModal from "@/features/squad/components/modal/SortModal.vue";
import { searchSquadDevelopers } from "@/api/squad.js";
import BasePagination from "@/components/Pagination.vue";

const searchQuery = ref("");
const developers = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);

async function handleSearch(page = 1) {
  const payload = {
    keyword: searchQuery.value,
    status: selectedFilters.value.statuses[0] || null,
    grades: selectedFilters.value.grades,
    stacks: selectedFilters.value.techStacks,
    memberRoles: selectedFilters.value.freelancer
      ? [selectedFilters.value.freelancer]
      : [],
    sortBy: selectedFilters.value.sortBy || "grade",
    sortDir: selectedFilters.value.sortOrder || "asc",
    page: page - 1, // 백엔드는 0부터 시작
    size: 10,
  };

  try {
    const result = await searchSquadDevelopers(payload);
    developers.value = result.content.map((dev) => ({
      id: dev.employeeId,
      name: dev.name,
      grade: dev.grade,
      status: dev.status === "AVAILABLE" ? "대기중" : "투입중",
      techStack: [dev.topTechStackName],
      monthlyUnitPrice: dev.monthlyUnitPrice,
      productivity: dev.productivity,
    }));

    currentPage.value = result.currentPage + 1;
    totalPages.value = result.totalPages;
  } catch (e) {
    developers.value = [];
    currentPage.value = 1;
    totalPages.value = 1;
  }
}

const isFocused = ref(false);
const showFilter = ref(false);
const showSort = ref(false);

const selectedFilters = ref({
  techStacks: ["Gradle", "Java"],
  grades: ["S", "B"],
  statuses: [],
  freelancer: null,
  sortBy: "",
  sortOrder: "",
});

function handleAddDeveloper(id) {
  console.log("추가된 개발자:", id);
}

function removeTechStack(stack) {
  selectedFilters.value.techStacks = selectedFilters.value.techStacks.filter(
    (s) => s !== stack,
  );
}

function handleDocumentClick(e) {
  const filterModal = document.getElementById("filterModal");
  const sortModal = document.getElementById("sortModal");
  if (filterModal && !filterModal.contains(e.target)) {
    showFilter.value = false;
  }
  if (sortModal && !sortModal.contains(e.target)) {
    showSort.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleDocumentClick);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", handleDocumentClick);
});

function toggleFilter() {
  showSort.value = false;
  showFilter.value = !showFilter.value;
}
function toggleSort() {
  showFilter.value = false;
  showSort.value = !showSort.value;
}

function renderSummary() {
  const parts = [];

  if (selectedFilters.value.techStacks.length) {
    parts.push(selectedFilters.value.techStacks.join(", "));
  }
  if (selectedFilters.value.grades.length) {
    parts.push(selectedFilters.value.grades.join(", "));
  }
  if (selectedFilters.value.statuses.length) {
    parts.push(selectedFilters.value.statuses.join(", "));
  }
  if (selectedFilters.value.freelancer) {
    parts.push(selectedFilters.value.freelancer);
  }
  if (selectedFilters.value.sortBy || selectedFilters.value.sortOrder) {
    parts.push(
      `${selectedFilters.value.sortBy}-${selectedFilters.value.sortOrder}`,
    );
  }

  return parts.join(" / ");
}

function addTechStack(stack) {
  if (!selectedFilters.value.techStacks.includes(stack)) {
    selectedFilters.value.techStacks.push(stack);
  }
}
</script>

<template>
  <div>
    <!-- 검색바 -->
    <div class="search-bar" :class="{ focused: isFocused }">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="개발자를 검색해주세요"
        class="search-input"
        @focus="isFocused = true"
        @blur="isFocused = false"
        @keyup.enter="handleSearch"
      />

      <!-- 필터 버튼 + 모달 -->
      <div class="relative">
        <button class="btn-icon" @click.stop="toggleFilter">
          <i class="fa-solid fa-filter"></i>
        </button>
        <FilterModal
          v-if="showFilter"
          :selectedFilters="selectedFilters"
          @removeTechStack="removeTechStack"
          @addTechStack="addTechStack"
        />
      </div>

      <!-- 정렬 버튼 + 모달 -->
      <div class="relative">
        <button class="btn-icon" @click.stop="toggleSort">
          <i class="fa-solid fa-align-center"></i>
        </button>
        <SortModal v-if="showSort" :selectedFilters="selectedFilters" />
      </div>

      <button class="btn-icon" @click="handleSearch">
        <i class="fa-solid fa-magnifying-glass"></i>
      </button>
    </div>

    <!-- 필터 요약 -->
    <div class="filter-summary">
      <div class="overflow-hidden whitespace-nowrap text-ellipsis">
        {{ renderSummary() }}
      </div>
    </div>

    <!-- 테이블 -->
    <div class="table-wrapper">
      <template v-if="developers.length > 0">
        <table class="dev-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>개발자명</th>
              <th>등급</th>
              <th>상태</th>
              <th>기술스택</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(dev, index) in developers" :key="dev.id">
              <td class="text-center">{{ index + 1 }}</td>
              <td class="text-center">{{ dev.name }}</td>
              <td class="text-center">{{ dev.grade }}</td>
              <td class="text-center">
                <span class="status-badge">{{ dev.status }}</span>
              </td>
              <td class="text-center">
                <div class="stack-list">
                  <span
                    v-for="stack in dev.techStack"
                    :key="stack"
                    class="stack-badge"
                  >
                    {{ stack }}
                  </span>
                </div>
              </td>
              <td class="text-center">
                <button class="btn-add" @click="handleAddDeveloper(dev.id)">
                  추가
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
      <template v-else>
        <div class="empty-message">검색한 개발자가 없습니다</div>
      </template>
    </div>

    <div class="flex justify-center">
      <BasePagination
        :current-page="currentPage"
        :total-pages="totalPages"
        @change="handleSearch"
      />
    </div>
  </div>
</template>

<style scoped>
.search-bar {
  @apply flex items-center gap-2 mb-4 px-3 py-2 border border-gray-300 rounded transition relative;
}
.search-bar.focused {
  @apply border-primary ring-2 ring-primary/30;
}
.search-input {
  @apply flex-1 outline-none border-none bg-transparent;
}
.btn-icon {
  @apply px-4 py-3 text-sm hover:bg-gray-100 rounded;
}
.filter-summary {
  @apply mb-3 text-sm text-gray-600 max-w-full overflow-hidden;
}
.table-wrapper {
  @apply h-[500px] overflow-y-auto border border-gray-200 relative mb-4;
}
.dev-table {
  @apply w-full border-collapse text-sm text-center;
}
.dev-table thead th {
  @apply bg-gray-100 text-gray-800 py-2 border-b border-gray-300;
}
.dev-table tbody td {
  @apply py-2 border-b border-gray-100;
}
.status-badge {
  @apply inline-block px-2 py-1 text-xs bg-yellow-200 text-yellow-800 rounded;
}
.stack-list {
  @apply flex justify-center gap-1 flex-wrap;
}
.stack-badge {
  @apply px-2 py-1 bg-gray-200 text-xs rounded;
}
.btn-add {
  @apply px-5 py-2 bg-white text-primary border border-primary shadow-sm rounded text-sm font-bold hover:bg-gray-50 transition;
}
.pagination {
  @apply flex justify-center gap-2 mt-4;
}
.pagination button {
  @apply px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100;
}
.pagination .active {
  @apply bg-primary text-white;
}
.empty-message {
  @apply absolute inset-0 flex items-center justify-center text-gray-400;
}
</style>
