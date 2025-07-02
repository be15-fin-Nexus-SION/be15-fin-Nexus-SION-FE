<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import TechBadge from "@/components/badge/TechBadge.vue";
import SearchBar from "@/components/searchBar/TechStackSearchBar.vue";

const projectName = ref("");
const domain = ref("");
const overview = ref("");
const file = ref(null);
const fileName = ref("");
const startDate = ref("");
const endDate = ref("");
const budget = ref("");
const domainOptions = ["AI", "핀테크", "교육", "헬스케어"];
const allTechStacks = [
  "Java",
  "Spring Boot",
  "Vue.js",
  "React",
  "Python",
  "Django",
  "Node.js",
  "AWS",
  "MySQL",
];
const jobOptions = ["프론트엔드", "백엔드", "디자인", "PM"];

const jobs = ref([
  { id: 1, name: "", people: "", techStacks: [], dropdownOpen: false },
  { id: 2, name: "", people: "", techStacks: [], dropdownOpen: false },
]);

const domainDropdownOpen = ref(false);
const domainDropdownRef = ref(null);

function handleFileUpload(e) {
  file.value = e.target.files[0];
  fileName.value = file.value.name;
}

function removeFile() {
  file.value = null;
  fileName.value = "";
}

function addJob() {
  jobs.value.push({
    id: Date.now(),
    name: "",
    people: "",
    techStacks: [],
    dropdownOpen: false,
  });
}

function addTech(job, tech) {
  if (!job.techStacks.includes(tech)) {
    job.techStacks.push(tech);
  }
}

function removeTech(job, techToRemove) {
  job.techStacks = job.techStacks.filter((t) => t !== techToRemove);
}

function toggleDomainDropdown() {
  domainDropdownOpen.value = !domainDropdownOpen.value;
}

function selectDomain(selected) {
  domain.value = selected;
  domainDropdownOpen.value = false;
}

function toggleJobDropdown(job) {
  jobs.value.forEach((j) => {
    j.dropdownOpen = j.id === job.id ? !j.dropdownOpen : false;
  });
}

function selectJob(job, selected) {
  job.name = selected;
  job.dropdownOpen = false;
}

function handleClickOutside(e) {
  if (domainDropdownRef.value && !domainDropdownRef.value.contains(e.target)) {
    domainDropdownOpen.value = false;
  }
  jobs.value.forEach((job) => {
    if (!e.target.closest(`#job-dropdown-${job.id}`)) {
      job.dropdownOpen = false;
    }
  });
}

onMounted(() => document.addEventListener("click", handleClickOutside));
onBeforeUnmount(() =>
  document.removeEventListener("click", handleClickOutside),
);
</script>

<template>
  <div class="min-h-screen pt-6 pb-24 px-4">
    <div
      class="max-w-4xl mx-auto px-8 py-4 bg-white rounded-xl"
      style="box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.25)"
    >
      <h1 class="text-2xl font-bold mb-6">프로젝트 등록</h1>

      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-semibold mb-1">프로젝트 명</label>
          <input
            v-model="projectName"
            type="text"
            class="input"
            placeholder="프로젝트 명"
          />
        </div>
        <div ref="domainDropdownRef" class="relative">
          <label class="block text-sm font-semibold mb-1">도메인</label>
          <div
            class="input cursor-pointer relative"
            @click="toggleDomainDropdown"
          >
            <span>{{ domain || "카테고리 선택" }}</span>
            <svg
              class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <ul
            v-if="domainDropdownOpen"
            class="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md"
          >
            <li
              v-for="d in domainOptions"
              :key="d"
              @click="selectDomain(d)"
              class="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
              :class="{
                'bg-blue-50 font-semibold text-blue-600': d === domain,
              }"
            >
              {{ d }}
            </li>
          </ul>
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">개요</label>
        <textarea
          v-model="overview"
          class="input"
          rows="4"
          placeholder="프로젝트 개요 입력"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-semibold mb-1">요구사항 명세서</label>
        <div class="relative flex items-center">
          <input
            type="file"
            class="hidden"
            id="file-upload"
            @change="handleFileUpload"
          />
          <label
            for="file-upload"
            class="input cursor-pointer flex items-center justify-between pr-10"
          >
            파일 업로드
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 ml-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </label>
        </div>
        <div
          v-if="fileName"
          class="flex items-center gap-2 mt-2 ml-1 text-sm text-gray-600"
        >
          <span>{{ fileName }}</span>
          <button
            @click="removeFile"
            class="text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ×
          </button>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label class="block text-sm font-semibold mb-1">시작일</label>
          <input v-model="startDate" type="date" class="input" />
        </div>
        <div>
          <label class="block text-sm font-semibold mb-1">종료일</label>
          <input v-model="endDate" type="date" class="input" />
        </div>
        <div>
          <label class="block text-sm font-semibold mb-1">예산 (만원)</label>
          <input
            v-model="budget"
            type="number"
            class="input"
            placeholder="예: 5000"
          />
        </div>
      </div>

      <div class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-semibold"
            >예상 인원 및 기술 스택</label
          >
          <span class="text-xs text-gray-500"
            >기술스택 왼쪽부터 우선순위 1 2 3...</span
          >
        </div>

        <div v-for="job in jobs" :key="job.id" class="mb-6">
          <div class="grid grid-cols-3 gap-2 items-center mb-2">
            <div :id="`job-dropdown-${job.id}`" class="relative">
              <div
                class="input cursor-pointer relative"
                @click="toggleJobDropdown(job)"
              >
                <span>{{ job.name || "직무 선택" }}</span>
                <svg
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              <ul
                v-if="job.dropdownOpen"
                class="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md"
              >
                <li
                  v-for="option in jobOptions"
                  :key="option"
                  @click="selectJob(job, option)"
                  class="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                  :class="{
                    'bg-blue-50 font-semibold text-blue-600':
                      option === job.name,
                  }"
                >
                  {{ option }}
                </li>
              </ul>
            </div>

            <input
              v-model="job.people"
              type="number"
              class="input"
              placeholder="숫자입력"
            />

            <SearchBar
              :options="allTechStacks"
              placeholder="기술 스택 검색"
              @search="(tech) => addTech(job, tech)"
            />
          </div>

          <div class="flex flex-wrap gap-2 mt-2">
            <TechBadge
              v-for="tech in job.techStacks"
              :key="tech"
              :label="tech"
              :showClose="true"
              @remove="() => removeTech(job, tech)"
            />
          </div>
        </div>

        <button class="text-sm text-blue-600" @click="addJob">
          + 직무추가
        </button>
      </div>

      <button
        class="mt-6 w-full bg-blue-500 text-white py-3 rounded-lg font-semibold"
      >
        프로젝트 등록
      </button>
    </div>
  </div>
</template>

<style scoped>
.input {
  @apply w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white;
}
</style>
