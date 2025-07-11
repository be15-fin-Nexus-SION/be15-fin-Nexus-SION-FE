<template>
  <div class="max-w-5xl mx-auto py-10 px-4 space-y-6">
    <!-- 🔽 헤더 영역 -->
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
      <div class="w-64">
        <SearchBar
          placeholder="이름 또는 사번을 입력하세요"
          @search="onSearchKeywordChange"
        />
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
            <th class="p-2 text-center w-[22%]">이름</th>
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
            <!-- 사번 -->
            <td class="p-4 text-center">{{ developer.employeeId }}</td>

            <!-- 유형 -->
            <td class="p-4 text-center">{{ developer.role }}</td>

            <!-- 이름 + 프로필 이미지 -->
            <td class="p-4 px-12 text-center align-middle">
              <div class="flex items-center justify-start gap-3">
                <img
                  :src="developer.profileImageUrl || fallbackImage"
                  class="w-8 h-8 min-w-8 min-h-8 rounded-full object-cover flex-shrink-0 bg-gray-200"
                  alt="프로필"
                />
                <div>{{ developer.name }}</div>
              </div>
            </td>

            <!-- 부서 -->
            <td class="p-4 text-center">{{ developer.department }}</td>

            <!-- 직급 -->
            <td class="p-4 text-center">{{ developer.position }}</td>

            <!-- 주요 기술 -->
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

            <!-- 등급 -->
            <td class="p-4 text-center">
              <div class="flex justify-center">
                <GradeBadge :label="developer.grade" />
              </div>
            </td>

            <!-- 현재 상태 -->
            <td class="p-4 relative text-center" @click.stop>
              <div class="relative">
                <div class="flex justify-center">
                  <button
                    @click="toggleDropdown(index)"
                    class="text-xs px-3 py-1 rounded-full font-medium focus:outline-none"
                    :class="{
                      'bg-yellow-100 text-yellow-700':
                        developer.status === '대기중',
                      'bg-green-100 text-green-700':
                        developer.status === '투입중',
                      'bg-gray-100 text-gray-600':
                        developer.status === '비활성',
                    }"
                  >
                    {{ developer.status }}
                  </button>
                </div>

                <!-- 상태 변경 드롭다운 -->
                <ul
                  v-if="openDropdownIndex === index"
                  class="absolute top-full left-1/2 -translate-x-1/2 z-10 mt-1 w-24 bg-white border border-gray-200 rounded-md shadow text-sm"
                >
                  <li
                    v-for="option in statusOptions.slice(1)"
                    :key="option.value"
                    @click="changeStatus(index, option.name, option.value)"
                    class="m-3 px-2 py-1 text-xs rounded-full font-medium cursor-pointer text-center"
                    :class="{
                      'bg-yellow-100 text-yellow-700': option.name === '대기중',
                      'bg-green-100 text-green-700': option.name === '투입중',
                      'bg-gray-100 text-gray-600': option.name === '비활성',
                    }"
                  >
                    {{ option.name }}
                  </li>
                </ul>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { fetchDeveloperList, updateMemberStatus } from "@/api/member";
import PrimaryButton from "@/components/button/PrimaryButton.vue";
import SortDropdown from "@/components/dropdown/SortDropdown.vue";
import SearchBar from "@/components/searchBar/SearchBar.vue";
import { useRouter } from "vue-router";
import TechBadge from "@/components/badge/TechBadge.vue";
import GradeBadge from "@/components/badge/GradeBadge.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const isLoading = ref(true);

const router = useRouter();
const developers = ref([]);
const statusFilter = ref("");
const gradeFilter = ref("");
const roleFilter = ref("");
const sortBy = ref("employeeId");
const sortAsc = ref(true);
const searchKeyword = ref("");
const openDropdownIndex = ref(null);
const fallbackImage = "https://placehold.co/32x32";

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

const statusLabel = (status) => {
  switch (status) {
    case "AVAILABLE":
      return "대기중";
    case "IN_PROJECT":
      return "투입중";
    case "UNAVAILABLE":
      return "비활성";
    default:
      return "대기중";
  }
};

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
    const res = await fetchDeveloperList({
      keyword: searchKeyword.value,
      status: statusFilter.value,
      gradeCode: gradeFilter.value,
      role: roleFilter.value,
      sortBy: sortBy.value,
      sortDir: sortAsc.value ? "asc" : "desc",
      page: 0,
      size: 100,
    });

    const content = res?.data?.data?.content ?? [];
    developers.value = content.map((dev) => ({
      name: dev.name,
      position: dev.position || "-",
      department: dev.department || "-",
      employeeId: dev.employeeId,
      role: roleLabel(dev.role),
      grade: dev.grade_code || "-",
      status: statusLabel(dev.status),
      profileImageUrl: dev.profileImageUrl,
      topTechStackName: dev.topTechStackName,
      joinedAt: dev.joinedAt || "1900-01-01T00:00:00",
    }));
  } catch (e) {
    console.error("개발자 목록 불러오기 실패:", e);
  } finally {
    isLoading.value = false;
  }
};

function goToFreelancerList() {
  router.push({ name: "freelancer-list" });
}

function toggleDropdown(index) {
  openDropdownIndex.value = openDropdownIndex.value === index ? null : index;
}

async function changeStatus(index, newStatusLabel, newStatusEnum) {
  const employeeId = developers.value[index].employeeId;
  try {
    await updateMemberStatus(employeeId, newStatusEnum);
    developers.value[index].status = newStatusLabel;
  } catch (e) {
    console.error("상태 변경 실패:", e);
    alert("상태 변경에 실패했습니다.");
  } finally {
    openDropdownIndex.value = null;
  }
}

function onSearchKeywordChange(keyword) {
  searchKeyword.value = keyword;
}

function onSortChange(selected) {
  sortBy.value = selected.value;
}

function onStatusFilterChange(selected) {
  statusFilter.value = selected.value;
}

function onGradeFilterChange(selected) {
  gradeFilter.value = selected.value;
}

function onRoleFilterChange(selected) {
  roleFilter.value = selected.value;
}

function handleClickOutside() {
  openDropdownIndex.value = null;
}

function goToDetail(employeeId) {
  router.push({ name: "developer-detail", params: { employeeId: employeeId } });
}

function goToAdd() {
  router.push({ name: "developer-add" });
}

document.addEventListener("click", handleClickOutside);
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

onMounted(fetchDevelopers);
watch(
  [statusFilter, gradeFilter, roleFilter, sortBy, sortAsc, searchKeyword],
  fetchDevelopers,
);
</script>
