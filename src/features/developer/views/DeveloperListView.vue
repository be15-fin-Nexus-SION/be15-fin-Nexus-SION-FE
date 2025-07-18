<template>
  <div class="max-w-5xl mx-auto py-10 px-4 space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <h1 class="text-2xl font-bold">개발자 목록</h1>
        <button @click="goToFreelancerList" class="text-sm text-blue-500">
          프리랜서 목록
        </button>
      </div>
      <PrimaryButton label="개발자 등록" @click="goToAdd" />
    </div>

    <div class="flex gap-2 items-center justify-between">
      <div class="flex items-center gap-4 mt-2">
        <div class="w-64">
          <SearchBar
            placeholder="이름 또는 사번을 입력하세요"
            @search="onSearchKeywordChange"
          />
        </div>
        <button class="text-xs text-blue-500" @click="resetFilters">
          필터 초기화
        </button>
      </div>

      <div class="w-20">
        <SortDropdown
          :options="sortOptions"
          :defaultValue="sortOptions.find((opt) => opt.value === sortBy)"
          @change="onSortChange"
        />
      </div>
    </div>
    <div
      v-if="searchKeyword"
      class="flex items-center gap-3 text-sm text-gray-600 mt-2"
    >
      <div>
        "{{ searchKeyword }}"에 대한 검색 결과입니다
        <span v-if="developers.length"> ({{ developers.length }}건)</span>
        <span v-else class="text-red-500"> - 결과 없음</span>
      </div>
      <button
        @click="searchKeyword = ''"
        class="text-blue-500 underline text-xs"
      >
        검색 초기화
      </button>
    </div>

    <div class="w-full">
      <LoadingSpinner v-if="isLoading" />
      <table v-else class="min-w-full text-sm mt-4">
        <thead>
          <tr class="text-gray-500 border-b">
            <th class="p-2 text-center w-[12%]">사번</th>
            <th class="p-2 text-center w-[10%]">
              <SortDropdown
                :options="roleOptions"
                :defaultValue="
                  roleOptions.find((opt) => opt.value === roleFilter)
                "
                @change="onRoleFilterChange"
                trigger-label="유형"
              />
            </th>
            <th class="p-2 text-center w-[16%]">이름</th>
            <th class="p-2 text-center w-[19%]">부서</th>
            <th class="p-2 text-center w-[19%]">직급</th>
            <th class="p-2 text-center w-[15%]">주요 기술</th>
            <th class="p-2 text-center w-[12%]">
              <SortDropdown
                class="w-20 text-gray-500"
                :options="gradeOptions"
                :defaultValue="
                  gradeOptions.find((opt) => opt.value === gradeFilter)
                "
                @change="onGradeFilterChange"
                trigger-label="등급"
              />
            </th>
            <th class="p-2 text-center w-[15%]">
              <SortDropdown
                class="w-20 text-gray-500"
                :options="statusOptions"
                :defaultValue="
                  statusOptions.find((opt) => opt.value === statusFilter)
                "
                @change="onStatusFilterChange"
                trigger-label="현재 상태"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(developer, index) in developers"
            :key="index"
            class="border-b py-4 hover:bg-gray-50 cursor-pointer"
            @click="goToDetail(developer.employeeId)"
          >
            <td class="p-4 text-center">{{ developer.employeeId }}</td>
            <td class="p-4 text-center">{{ developer.role }}</td>
            <td class="p-4 px-8 text-center align-middle">
              <div class="flex items-center justify-start gap-3">
                <img
                  :src="
                    developer.profileImageUrl ||
                    `https://api.dicebear.com/9.x/notionists/svg?seed=${developer.employeeId}`
                  "
                  class="w-8 h-8 min-w-8 min-h-8 rounded-full object-cover flex-shrink-0 bg-gray-200"
                  alt="프로필"
                />
                <div>{{ developer.name }}</div>
              </div>
            </td>
            <td class="p-4 text-center">{{ developer.department }}</td>
            <td class="p-4 text-center">{{ developer.position }}</td>
            <td class="p-4 text-center text-xs font-medium">
              <div class="flex justify-center">
                <TechBadge
                  v-if="developer.topTechStackName"
                  class="p-2 text-xs font-medium"
                  :label="developer.topTechStackName"
                />
                <span v-else>-</span>
              </div>
            </td>
            <td class="p-4 text-center">
              <div class="flex justify-center">
                {{ developer.grade }}
              </div>
            </td>
            <td class="p-4 relative text-center" @click.stop>
              <div class="relative">
                <div class="flex justify-center" @click="toggleDropdown(index)">
                  <StatusBadge :status="developer.status" />
                </div>
                <ul
                  v-if="openDropdownIndex === index"
                  class="absolute top-full left-1/2 -translate-x-1/2 z-10 mt-1 w-24 bg-white border border-gray-200 rounded-md shadow text-sm"
                >
                  <li
                    v-for="option in statusOptions.slice(1)"
                    :key="option.value"
                    @click="changeStatus(index, option.value)"
                    class="m-3 px-2 py-1 cursor-pointer text-center"
                  >
                    <StatusBadge :status="option.value" />
                  </li>
                </ul>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div
        v-if="!isLoading && developers.length === 0"
        class="text-center text-gray-400 text-sm mt-6 p-12"
      >
        조건에 일치하는 개발자가 없습니다.
      </div>

      <div
        v-if="!isLoading && developers.length !== 0"
        class="flex justify-center mt-6"
      >
        <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @change="onPageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { fetchDeveloperList, updateMemberStatus } from "@/api/member";
import PrimaryButton from "@/components/button/PrimaryButton.vue";
import SortDropdown from "@/components/dropdown/SortDropdown.vue";
import SearchBar from "@/components/searchBar/SearchBar.vue";
import { useRoute, useRouter } from "vue-router";
import TechBadge from "@/components/badge/TechBadge.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import Pagination from "@/components/Pagination.vue";
import StatusBadge from "@/components/badge/StatusBadge.vue";
import { showErrorToast } from "@/utills/toast.js";

const router = useRouter();
const isLoading = ref(true);
const developers = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = 15;

const statusFilter = ref("");
const gradeFilter = ref("");
const roleFilter = ref("");
const sortBy = ref("employeeId");
const sortAsc = ref(true);
const searchKeyword = ref("");
const openDropdownIndex = ref(null);

const sortOptions = [
  { name: "사번순", value: "employeeId" },
  { name: "이름순", value: "name" },
  { name: "입사일순", value: "joinedAt" },
];

const gradeOptions = [
  { name: "전체", value: "" },
  { name: "S", value: "S" },
  { name: "A", value: "A" },
  { name: "B", value: "B" },
  { name: "C", value: "C" },
  { name: "D", value: "D" },
];

const statusOptions = [
  { name: "전체", value: "" },
  { name: "대기중", value: "AVAILABLE" },
  { name: "투입중", value: "IN_PROJECT" },
  { name: "비활성", value: "UNAVAILABLE" },
];

const roleOptions = [
  { name: "전체", value: "" },
  { name: "내부 개발자", value: "INSIDER" },
  { name: "프리랜서", value: "OUTSIDER" },
];

const roleLabel = (role) => {
  switch (role) {
    case "INSIDER":
      return "EMP";
    case "OUTSIDER":
      return "FREE";
    default:
      return "-";
  }
};

const fetchDevelopers = async () => {
  try {
    isLoading.value = true;
    const res = await fetchDeveloperList({
      keyword: searchKeyword.value,
      status: statusFilter.value,
      gradeCode: gradeFilter.value,
      role: roleFilter.value,
      sortBy: sortBy.value,
      sortDir: sortAsc.value ? "asc" : "desc",
      page: currentPage.value - 1,
      size: pageSize,
    });

    const pageData = res?.data?.data;
    const content = pageData?.content ?? [];

    developers.value = content.map((dev) => ({
      name: dev.name,
      position: dev.position || "-",
      department: dev.department || "-",
      employeeId: dev.employeeId,
      role: roleLabel(dev.role),
      grade: dev.grade_code || "-",
      status: dev.status,
      profileImageUrl: dev.profileImageUrl,
      topTechStackName: dev.topTechStackName,
      joinedAt: dev.joinedAt || "1900-01-01T00:00:00",
    }));

    totalPages.value = pageData?.totalPages ?? 1;
  } catch (e) {
    developers.value = [];
    totalPages.value = 1;
  } finally {
    isLoading.value = false;
  }
};

const onPageChange = (page) => {
  currentPage.value = page;
};

const onSearchKeywordChange = (keyword) => {
  searchKeyword.value = keyword;
  currentPage.value = 1;
};

const onSortChange = (selected) => {
  sortBy.value = selected.value;
  currentPage.value = 1;
};

const onStatusFilterChange = (selected) => {
  statusFilter.value = selected.value;
  currentPage.value = 1;
};

const onGradeFilterChange = (selected) => {
  gradeFilter.value = selected.value;
  currentPage.value = 1;
};

const onRoleFilterChange = (selected) => {
  roleFilter.value = selected.value;
  currentPage.value = 1;
};

const toggleDropdown = (index) => {
  openDropdownIndex.value = openDropdownIndex.value === index ? null : index;
};

const changeStatus = async (index, newStatusEnum) => {
  const employeeId = developers.value[index].employeeId;
  try {
    await updateMemberStatus(employeeId, newStatusEnum);
    developers.value[index].status = newStatusEnum;
  } catch (e) {
    showErrorToast("상태 변경에 실패했습니다.");
  } finally {
    openDropdownIndex.value = null;
  }
};

const goToDetail = (employeeId) => {
  router.push({ name: "developer-detail", params: { employeeId } });
};

const goToAdd = () => {
  router.push({ name: "developer-add" });
};

const goToFreelancerList = () => {
  router.push({ name: "freelancer-list" });
};

const handleClickOutside = () => {
  openDropdownIndex.value = null;
};

const resetFilters = () => {
  searchKeyword.value = "";
  statusFilter.value = "";
  gradeFilter.value = "";
  roleFilter.value = "";
  sortBy.value = "employeeId";
  sortAsc.value = true;
  currentPage.value = 1;
  fetchDevelopers();
};

document.addEventListener("click", handleClickOutside);
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const route = useRoute();
onMounted(() => {
  const status = route.query.status;
  if (typeof status === "string" && status.toLowerCase() === "available") {
    // 대문자로 바꾸고 상태 필터 변경
    onStatusFilterChange({ value: status.toUpperCase() });
  }

  fetchDevelopers();
});
watch(
  [
    statusFilter,
    gradeFilter,
    roleFilter,
    sortBy,
    sortAsc,
    searchKeyword,
    currentPage,
  ],
  fetchDevelopers,
);
</script>
