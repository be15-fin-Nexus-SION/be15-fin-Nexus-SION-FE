<script setup>
import { ref, computed, onMounted } from "vue";
import { showSuccessToast, showErrorToast } from "@/utills/toast.js";
import SidebarWrapper from "@/components/side/SidebarWrapper.vue";
import InputBox from "@/components/input/InputBox.vue";
import PrimaryButton from "@/components/button/PrimaryButton.vue";
import AdmJobsList from "@/features/admin/components/AdminJobsList.vue";
import { getAllJobs, addJobApi } from "@/api/admin.js";
import NameIndexBar from "@/components/searchBar/NameIndexBar.vue";

const jobName = ref("");
const jobList = ref([]);
const jobListRef = ref(null);

// ---- 초성 추출 관련 ----
const CHO = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

function getInitialConsonant(char) {
  const code = char.charCodeAt(0);
  if (code >= 0xac00 && code <= 0xd7a3) {
    const choIndex = Math.floor((code - 0xac00) / 588);
    return CHO[choIndex];
  }
  return char.toUpperCase();
}

// ---- API ----
async function fetchJobs() {
  try {
    const res = await getAllJobs();
    jobList.value = res.data.data.jobs;
  } catch (e) {
    console.error("직무 목록 가져오기 실패", e);
  }
}

async function addJob() {
  if (!jobName.value.trim()) {
    showErrorToast("직무명을 입력해주세요.");
    return;
  }
  try {
    await addJobApi(jobName.value.trim());
    await fetchJobs();
    jobName.value = "";
    showSuccessToast("직무가 등록되었습니다.");
  } catch (e) {
    const errorMessage =
      e.response?.data?.message || "직무 등록에 실패했습니다.";
    showErrorToast(errorMessage);
  }
}

// ---- 이벤트 핸들러 ----
function handleEdit(job) {
  console.log("수정할 직무:", job);
}
function handleDelete(job) {
  console.log("삭제할 직무:", job);
}
function onInitialSelect(letter) {
  jobListRef.value?.scrollToLetter(letter);
}

// ---- 사용 중인 초성 목록 계산 ----
const availableKoreanInitials = computed(() => {
  const initials = jobList.value
    .map((job) => getInitialConsonant(job.trim()[0]))
    .filter((i) => /^[ㄱ-ㅎ]$/.test(i));
  return [...new Set(initials)];
});

const availableEnglishInitials = computed(() => {
  const initials = jobList.value
    .map((job) => getInitialConsonant(job.trim()[0]))
    .filter((i) => /^[A-Z]$/.test(i));
  return [...new Set(initials)];
});

// ---- 초기 데이터 로딩 ----
onMounted(fetchJobs);
</script>

<template>
  <div class="page-layout">
    <SidebarWrapper viewType="adminSetting" />
    <div class="content-wrapper">
      <h1 class="page-title">직무 설정</h1>
      <div class="body">
        <div class="body-main">
          <div class="input-add">
            <InputBox v-model="jobName" placeholder="예: Backend" />
            <PrimaryButton
              label="추가"
              text-color-class="text-white"
              :onClick="addJob"
            />
          </div>
          <AdmJobsList
            ref="jobListRef"
            :jobList="jobList"
            @editJob="handleEdit"
            @deleteJob="handleDelete"
          />
        </div>
        <div class="body-side">
          <NameIndexBar
            type="korean"
            :available-letters="availableKoreanInitials"
            @select="onInitialSelect"
          />
          <NameIndexBar
            type="english"
            :available-letters="availableEnglishInitials"
            @select="onInitialSelect"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-layout {
  @apply relative flex;
}
.content-wrapper {
  @apply flex-1 px-[180px] py-12 max-w-[970px];
}
.page-title {
  @apply text-headlineSm text-black font-semibold mb-[50px];
}
.body {
  @apply flex flex-row gap-[10px];
}
.body-main {
  @apply flex flex-col gap-[20px];
}
.body-side {
  @apply flex flex-col gap-[10px];
  position: sticky;
  top: 120px;
  height: fit-content;
}
.input-add {
  @apply flex gap-4 px-[15px];
}
</style>
