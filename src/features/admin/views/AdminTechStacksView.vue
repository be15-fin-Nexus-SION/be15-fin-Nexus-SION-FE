<script setup>
import { ref, computed, onMounted } from "vue";
import { showSuccessToast, showErrorToast } from "@/utills/toast.js";
import { getInitialConsonant, isChoseong } from "@/utills/hangul.js";
import SidebarWrapper from "@/components/side/SidebarWrapper.vue";
import InputBox from "@/components/input/InputBox.vue";
import PrimaryButton from "@/components/button/PrimaryButton.vue";
import NameIndexBar from "@/components/searchBar/NameIndexBar.vue";
import {
  getAllTechStacks,
  addTechStack,
  deleteTechStack,
} from "@/api/admin.js";
import AdminTechStacksList from "@/features/admin/components/AdminTechStacksList.vue";

const techStackName = ref("");
const techStackList = ref([]);
const techStackListRef = ref(null);

// ---- 데이터 불러오기 ----
async function fetchTechStacks() {
  try {
    const res = await getAllTechStacks();
    techStackList.value = res.data.data.techStacks;
  } catch (e) {
    const errorMessage =
      e.response?.data?.message || "기술 스택 목록 조회 실패";
    showErrorToast(errorMessage);
  }
}

// ---- 직무 추가 ----
async function handleAdd() {
  if (!techStackName.value.trim()) {
    showErrorToast("기술 스택을 입력해주세요.");
    return;
  }
  try {
    await addTechStack(techStackName.value.trim());
    await fetchTechStacks();
    techStackName.value = "";
    showSuccessToast("기술 스택이 등록되었습니다.");
  } catch (e) {
    const errorMessage =
      e.response?.data?.message || "기술 스택 등록에 실패했습니다.";
    showErrorToast(errorMessage);
  }
}

// ---- 직무 삭제 ----
async function handleDelete(techStack) {
  try {
    await deleteTechStack(techStack);
    await fetchTechStacks();
    showSuccessToast("기술 스택이 삭제되었습니다.");
  } catch (e) {
    const errorMessage =
      e.response?.data?.message || "기술 스택 삭제에 실패했습니다.";
    showErrorToast(errorMessage);
  }
}

// ---- 스크롤 이동 ----
function onInitialSelect(letter) {
  techStackListRef.value?.scrollToLetter(letter);
}

// ---- 초성 필터 ----
const availableKoreanInitials = computed(() => {
  const initials = techStackList.value
    .map((techStack) => getInitialConsonant(techStack.trim()[0]))
    .filter(isChoseong);
  return [...new Set(initials)];
});

const availableEnglishInitials = computed(() => {
  const initials = techStackList.value
    .map((techStack) => getInitialConsonant(techStack.trim()[0]))
    .filter((i) => /^[A-Z]$/.test(i));
  return [...new Set(initials)];
});

onMounted(fetchTechStacks);
</script>

<template>
  <div class="page-layout">
    <SidebarWrapper viewType="adminSetting" />
    <div class="content-wrapper">
      <h1 class="page-title">기술 스택 관리</h1>
      <div class="body">
        <div class="body-main">
          <div class="input-add">
            <InputBox
              v-model="techStackName"
              placeholder="예: Java"
              @enter="handleAdd"
            />
            <PrimaryButton
              label="추가"
              text-color-class="text-white"
              :onClick="handleAdd"
            />
          </div>
          <AdminTechStacksList
            ref="techStackListRef"
            :techStackList="techStackList"
            @deleteTechStack="handleDelete"
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
  @apply flex gap-4 pr-[15px];
}
</style>
