<script setup>
import { ref, computed, onMounted } from "vue";
import { showSuccessToast, showErrorToast } from "@/utills/toast.js";
import { getInitialConsonant, isChoseong } from "@/utills/hangul.js";
import SidebarWrapper from "@/components/side/SidebarWrapper.vue";
import InputBox from "@/components/input/InputBox.vue";
import PrimaryButton from "@/components/button/PrimaryButton.vue";
import AdminDomainsList from "@/features/admin/components/AdminDomainsList.vue";
import NameIndexBar from "@/components/searchBar/NameIndexBar.vue";
import { getAllDomains, addDomain, deleteDomain } from "@/api/admin.js";

const domainName = ref("");
const domainList = ref([]);
const domainListRef = ref(null);

// ---- 데이터 불러오기 ----
async function fetchDomains() {
  try {
    const res = await getAllDomains();
    domainList.value = res.data.data.domains;
  } catch (e) {
    const errorMessage = e.response?.data?.message || "도메인 목록 조회 실패";
    showErrorToast(errorMessage);
  }
}

// ---- 직무 추가 ----
async function handleAdd() {
  if (!domainName.value.trim()) {
    showErrorToast("도메인을 입력해주세요.");
    return;
  }
  try {
    await addDomain(domainName.value.trim());
    await fetchDomains();
    domainName.value = "";
    showSuccessToast("도메인이 등록되었습니다.");
  } catch (e) {
    const errorMessage =
      e.response?.data?.message || "도메인 등록에 실패했습니다.";
    showErrorToast(errorMessage);
  }
}

// ---- 직무 삭제 ----
async function handleDelete(domain) {
  try {
    await deleteDomain(domain);
    await fetchDomains();
    showSuccessToast("도메인이 삭제되었습니다.");
  } catch (e) {
    const errorMessage =
      e.response?.data?.message || "도메인 삭제에 실패했습니다.";
    showErrorToast(errorMessage);
  }
}

// ---- 스크롤 이동 ----
function onInitialSelect(letter) {
  domainListRef.value?.scrollToLetter(letter);
}

// ---- 초성 필터 ----
const availableKoreanInitials = computed(() => {
  const initials = domainList.value
    .map((domain) => getInitialConsonant(domain.trim()[0]))
    .filter(isChoseong);
  return [...new Set(initials)];
});

const availableEnglishInitials = computed(() => {
  const initials = domainList.value
    .map((domain) => getInitialConsonant(domain.trim()[0]))
    .filter((i) => /^[A-Z]$/.test(i));
  return [...new Set(initials)];
});

onMounted(fetchDomains);
</script>

<template>
  <div class="page-layout">
    <SidebarWrapper viewType="adminSetting" />
    <div class="content-wrapper">
      <h1 class="page-title">도메인 관리</h1>
      <div class="body">
        <div class="body-main">
          <div class="input-add">
            <InputBox
              v-model="domainName"
              placeholder="예: 영업"
              @enter="handleAdd"
            />
            <PrimaryButton label="추가" :onClick="handleAdd" />
          </div>
          <AdminDomainsList
            ref="domainListRef"
            :domainList="domainList"
            @deleteDomain="handleDelete"
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
