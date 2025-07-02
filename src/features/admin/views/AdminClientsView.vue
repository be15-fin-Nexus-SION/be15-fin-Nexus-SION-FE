<script setup>
import { onMounted, ref, computed } from "vue";
import SidebarWrapper from "@/components/side/SidebarWrapper.vue";
import PrimaryButton from "@/components/button/PrimaryButton.vue";
import AdminClientsList from "@/features/admin/components/AdminClientsList.vue";
import AdminClientAddModal from "@/features/admin/components/AdminClientAddModal.vue";
import { showSuccessToast, showErrorToast } from "@/utills/toast.js";
import { getAllClients, addClient } from "@/api/admin.js";
import AutoCompleteSearchBar from "@/components/searchBar/AutoCompleteSearchBar.vue";
import { isKoreanChar } from "@/utills/hangul.js";

const allClients = ref([]);
const clientList = ref([]);
const showModal = ref(false);

onMounted(async () => {
  await fetchClients();
});

function sortClientsByName(clients) {
  return [...clients].sort((a, b) => {
    const nameA = a.companyName;
    const nameB = b.companyName;

    const charA = nameA[0];
    const charB = nameB[0];

    const isKorA = isKoreanChar(charA);
    const isKorB = isKoreanChar(charB);

    if (isKorA && !isKorB) return -1; // 한글 우선
    if (!isKorA && isKorB) return 1; // 영어 뒤로
    return nameA.localeCompare(nameB, "ko"); // 한글 또는 영어 내부 정렬
  });
}

const fetchClients = async () => {
  try {
    const res = await getAllClients();
    const rawClients = res.data.data.content || [];
    const sorted = sortClientsByName(rawClients);

    allClients.value = sorted;
    clientList.value = [...sorted];
  } catch (e) {
    const errorMessage = e.response?.data?.message || "고객사 목록 조회 실패";
    showErrorToast(errorMessage);
  }
};

// 고객사명 목록 (자동완성 대상)
const clientNames = computed(() =>
  allClients.value.map((client) => client.companyName),
);

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const handleAdd = async (formData) => {
  try {
    await addClient(formData);
    showSuccessToast("고객사가 등록되었습니다.");
    closeModal();
    await fetchClients();
  } catch (e) {
    const errorMessage = e.response?.data?.message || "등록 실패";
    showErrorToast(errorMessage);
  }
};

// 고객사 검색
function handleSearch(keyword) {
  const normalized = keyword.trim().toLowerCase();
  if (!normalized) {
    clientList.value = sortClientsByName(allClients.value);
    return;
  }

  const filtered = allClients.value.filter((client) =>
    client.companyName.toLowerCase().includes(normalized),
  );
  clientList.value = sortClientsByName(filtered);
}

// 전체 목록 조회
function resetClientList() {
  clientList.value = sortClientsByName(allClients.value);
}
</script>

<template>
  <div class="page-layout">
    <SidebarWrapper viewType="adminSetting" />
    <div class="content-wrapper">
      <h1 class="page-title">고객사 관리</h1>
      <div class="body">
        <div class="body-main">
          <div class="input-add">
            <div class="searchbar">
              <AutoCompleteSearchBar
                placeholder="고객사명을 입력하세요"
                :options="clientNames"
                :onlyOne="true"
                @search="handleSearch"
              />
            </div>
            <div
              class="before-add"
              :class="
                clientList.length !== allClients.length
                  ? 'justify-between'
                  : 'justify-end'
              "
            >
              <div
                v-if="clientList.length !== allClients.length"
                class="before hover:text-primary-hover cursor-pointer"
                @click="resetClientList"
              >
                <svg
                  class="icon fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path
                    d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"
                  />
                </svg>
                <span class="reset-text">전체 목록 조회</span>
              </div>

              <PrimaryButton label="등록" @click="openModal" />
            </div>
          </div>
          <AdminClientsList
            :clients="clientList"
            @deleted="fetchClients"
            @updated="fetchClients"
          />
        </div>
      </div>
    </div>

    <AdminClientAddModal
      :show="showModal"
      :onCancel="closeModal"
      :onSubmit="handleAdd"
    />
  </div>
</template>

<style scoped>
.page-layout {
  @apply relative flex;
}

.content-wrapper {
  @apply flex-1 px-[100px] py-12 max-w-[970px];
}

.page-title {
  @apply text-headlineSm text-black font-semibold mb-[50px];
}

.body {
  @apply flex flex-row w-full gap-[10px];
}

.body-main {
  @apply flex flex-col w-full gap-[20px] pb-4;
}

.input-add {
  @apply flex flex-col w-full items-end gap-4;
}

.searchbar {
  @apply w-full;
}

.before-add {
  @apply flex w-full items-center pl-[5px];
}

.before {
  @apply flex gap-[10px] items-center;
}

.icon {
  @apply w-[15px] h-[15px] hover:text-primary-hover;
}

.reset-text {
  @apply cursor-pointer text-bodyMd hover:text-primary-hover;
}
</style>
