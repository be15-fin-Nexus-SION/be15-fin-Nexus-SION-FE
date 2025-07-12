<script setup>
import { ref } from "vue";
import { startLoading } from "@/composable/useLoadingBar.js";
import Close_LG from "@/assets/icons/Close_LG.svg";
import { useInfiniteScroll } from "@/composable/useInfiniteScroll.js";
import { searchAdmins } from "@/api/member.js";
import AdminSearchList from "@/features/squad/components/modal/AdminSearchList.vue";
import PrimaryButton from "@/components/button/PrimaryButton.vue";

const emit = defineEmits(["close", "share"]);
const scrollContainer = ref(null);

const keyword = ref("");

const searchParams = ref({
  keyword: "",
});

const fetchFn = async (page, params) => {
  try {
    startLoading();
    return await searchAdmins({
      keyword: params.keyword,
      page: page,
    });
  } catch (e) {
    console.error("관리자 목록 검색 실패", e);
    return [];
  }
};

const { items: adminList, reset } = useInfiniteScroll({
  fetchFn,
  scrollTargetRef: scrollContainer,
  params: searchParams,
});

async function handleSearch() {
  searchParams.value.keyword = keyword;
  await reset();
}

const selectedAdmin = ref([]);

// 선택 / 선택 해제 토글 함수
function handleSelect(admin) {
  if (!admin || !admin.employeeId) return;

  const exists = selectedAdmin.value.find(
    (a) => a.employeeId === admin.employeeId,
  );
  if (!exists) {
    selectedAdmin.value.push(admin);
  }
}

// 선택 목록에서 제거
function removeSelectedAdmin(employeeId) {
  if (!employeeId) return;
  selectedAdmin.value = selectedAdmin.value.filter(
    (a) => a.employeeId !== employeeId,
  );
}

function handleShare() {
  const employeeIds = selectedAdmin.value.map((admin) => admin.employeeId);
  emit("share", employeeIds);
}
</script>

<template>
  <teleport to="body">
    <div class="modal-overlay" @click.self="emit('close')">
      <section class="search-admin-modal flex flex-col">
        <!-- 헤더 -->
        <div class="modal-header">
          <div class="header1">스쿼드 공유하기</div>
          <button class="cancel-button" @click="emit('close')">
            <img :src="Close_LG" alt="닫기 버튼" class="close-icon" />
          </button>
        </div>

        <div class="p-4 space-y-2">
          <!-- 검색 -->
          <div class="flex gap-4 items-center">
            <div class="search-bar">
              <input
                v-model="keyword"
                type="text"
                placeholder="이름"
                class="search-input"
                @keyup.enter="handleSearch"
              />

              <button class="btn-icon" @click="handleSearch">
                <i class="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>

            <PrimaryButton
              @click="handleShare"
              bg-color-class="bg-secondary-green"
              hover-color-class="hover:bg-secondary-green-hover"
              text-color-class="text-white"
              customClass="w-[72px] h-[40px]"
              label="공유"
            />
          </div>

          <!-- 선택된 관리자 -->
          <div class="selected-admin-list max-h-40">
            <div
              v-if="selectedAdmin.length === 0"
              class="text-gray-400 text-sm"
            >
              선택된 관리자가 없습니다.
            </div>
            <div v-else class="flex flex-wrap gap-2">
              <span
                v-for="admin in selectedAdmin"
                :key="admin.employeeId"
                class="bg-gray-100 rounded-lg px-3 py-1 text-bodySm flex items-center gap-1"
              >
                {{ admin.name }}
                <button
                  @click="removeSelectedAdmin(admin.employeeId)"
                  class="ml-1 text-gray-800"
                >
                  ×
                </button>
              </span>
            </div>
          </div>
        </div>

        <!-- 본문: 검색 결과 + 선택 목록 -->
        <div class="modal-body flex flex-col flex-1">
          <!-- 검색 결과 -->
          <div
            v-if="adminList.length === 0"
            class="empty-message-wrapper flex-grow flex justify-center items-center"
          >
            <div class="text-gray-400 text-sm text-center py-2">
              검색 결과가 없습니다.
            </div>
          </div>
          <div v-else class="body-scroll flex-grow" ref="scrollContainer">
            <AdminSearchList :adminList="adminList" @select="handleSelect" />
          </div>
        </div>
      </section>
    </div>
  </teleport>
</template>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 bg-black/30 flex justify-center items-center z-50;
}
.search-admin-modal {
  @apply w-[600px] h-[70vh] bg-white rounded-lg text-center shadow-elevated flex flex-col;
}
.modal-header {
  @apply w-full flex justify-between items-center border-b p-6;
}
.close-icon {
  @apply w-5 h-5;
}
.cancel-button {
  @apply border-none cursor-pointer;
}
.modal-body {
  @apply flex-1 flex flex-col overflow-hidden;
}
.header1 {
  @apply text-bodyLg text-left;
}
.body-scroll {
  @apply overflow-y-auto overscroll-contain space-y-1 p-4 flex-grow;
}
.empty-message-wrapper {
  @apply flex-grow flex justify-center items-center;
}
.selected-admin-list {
  @apply overflow-y-auto overscroll-contain max-h-16;
}
.search-bar {
  @apply flex items-center gap-2 px-3 py-3 border border-gray-300 rounded-lg transition relative w-full;
}
.search-input {
  @apply flex-1 outline-none border-none bg-transparent;
}
</style>
