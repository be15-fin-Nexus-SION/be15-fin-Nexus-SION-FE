<script setup>
import { ref, computed, onMounted } from "vue";
import { showSuccessToast, showErrorToast } from "@/utills/toast.js";
import { getInitialConsonant, isChoseong } from "@/utills/hangul.js";
import SidebarWrapper from "@/components/side/SidebarWrapper.vue";
import InputBox from "@/components/input/InputBox.vue";
import PrimaryButton from "@/components/button/PrimaryButton.vue";
import AdminJobsList from "@/features/admin/components/AdminJobsList.vue";
import NameIndexBar from "@/components/searchBar/NameIndexBar.vue";
import { getAllJobs, addJob, deleteJob } from "@/api/admin.js";

const jobName = ref("");
const jobList = ref([]);
const jobListRef = ref(null);

// ---- 데이터 불러오기 ----
async function fetchJobs() {
  try {
    const res = await getAllJobs();
    jobList.value = res.data.data.jobs;
  } catch (e) {
    const errorMessage = e.response?.data?.message || "직무 목록 조회 실패";
    showSuccessToast(errorMessage);
  }
}

// ---- 직무 추가 ----
async function handleAdd() {
  if (!jobName.value.trim()) {
    showErrorToast("직무명을 입력해주세요.");
    return;
  }
  try {
    await addJob(jobName.value.trim());
    await fetchJobs();
    jobName.value = "";
    showSuccessToast("직무가 등록되었습니다.");
  } catch (e) {
    const errorMessage =
      e.response?.data?.message || "직무 등록에 실패했습니다.";
    showErrorToast(errorMessage);
  }
}

// ---- 직무 삭제 ----
async function handleDelete(job) {
  try {
    await deleteJob(job);
    await fetchJobs();
    showSuccessToast("직무가 삭제되었습니다.");
  } catch (e) {
    const errorMessage =
      e.response?.data?.message || "직무 삭제에 실패했습니다.";
    showErrorToast(errorMessage);
  }
}

// ---- 스크롤 이동 ----
function onInitialSelect(letter) {
  jobListRef.value?.scrollToLetter(letter);
}

// ---- 초성 필터 ----
const availableKoreanInitials = computed(() => {
  const initials = jobList.value
    .map((job) => getInitialConsonant(job.trim()[0]))
    .filter(isChoseong);
  return [...new Set(initials)];
});

const availableEnglishInitials = computed(() => {
  const initials = jobList.value
    .map((job) => getInitialConsonant(job.trim()[0]))
    .filter((i) => /^[A-Z]$/.test(i));
  return [...new Set(initials)];
});

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
              :onClick="handleAdd"
            />
          </div>
          <AdminJobsList
            ref="jobListRef"
            :jobList="jobList"
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
