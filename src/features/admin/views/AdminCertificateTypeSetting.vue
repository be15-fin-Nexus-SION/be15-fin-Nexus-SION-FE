<template>
  <div class="page-layout">
    <!-- 좌측 사이드바 -->
    <SidebarWrapper viewType="adminSetting" />

    <!-- 우측 본문 영역 -->
    <div class="content-wrapper">
      <h1 class="text-2xl font-bold mb-6">자격증 종류 관리</h1>

      <!-- 검색 및 등록 -->
      <div class="flex flex-col items-end gap-2 mb-4 w-[730px]">
        <button
          class="bg-primary text-white hover:bg-primary-hover px-4 py-2 rounded"
          @click="openRegisterModal"
        >
          등록
        </button>
        <SearchBar
          class="w-full"
          placeholder="자격증명을 입력하세요"
          @search="handleSearch"
        />
      </div>

      <!-- 자격증 테이블 -->
      <table class="w-[730px] border text-center">
        <thead class="bg-blue-100">
          <tr>
            <th class="py-2">자격증명</th>
            <th class="py-2">발급기관</th>
            <th class="py-2">반영점수</th>
            <th class="py-2">관리</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="certificate in pagedCertificates"
            :key="certificate.id"
            class="border-b"
          >
            <td class="py-2">{{ certificate.certificateName }}</td>
            <td class="py-2">{{ certificate.issuingOrganization }}</td>
            <td class="py-2">{{ certificate.score }}</td>
            <td class="py-2 flex justify-center gap-2">
              <button
                @click="edit(certificate)"
                class="px-3 py-1 bg-natural-gray text-gray-800 rounded-md font-medium transition-colors duration-200 hover:bg-natural-gray-hover"
              >
                수정
              </button>
              <button
                @click="remove(certificate.certificateName)"
                class="px-3 py-1 bg-red-200 text-red-700 rounded-md font-medium transition-colors duration-200 hover:bg-red-300"
              >
                삭제
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 페이지네이션 -->
      <div class="mt-4 flex justify-center">
        <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @change="changePage"
        />
      </div>
    </div>

    <!-- 등록 모달 -->
    <CertificateTypeModal
      v-if="isRegisterModalOpen"
      :initial-value="{
        certificateName: '',
        issuingOrganization: '',
        score: null,
      }"
      :is-edit-mode="false"
      @close="closeRegisterModal"
      @submit="handleRegisterSubmit"
    />

    <!-- 수정 모달 -->
    <CertificateTypeModal
      v-if="isEditModalOpen"
      :initial-value="selectedCertificate"
      :is-edit-mode="true"
      @close="closeEditModal"
      @submit="handleEditSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import SidebarWrapper from "@/components/side/SidebarWrapper.vue";
import Pagination from "@/components/Pagination.vue";
import SearchBar from "@/components/searchBar/SearchBar.vue";
import CertificateTypeModal from "@/features/admin/components/CertificateTypeModal.vue";
import {
  fetchCertificates,
  deleteCertificate,
  registerCertificate,
  updateCertificate,
} from "@/api/member.js";

// 상태 변수
const originalCertificates = ref([]);
const certificates = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;

// 등록 모달 제어
const isRegisterModalOpen = ref(false);
const openRegisterModal = () => (isRegisterModalOpen.value = true);
const closeRegisterModal = () => (isRegisterModalOpen.value = false);

// 수정 모달 제어
const isEditModalOpen = ref(false);
const selectedCertificate = ref(null);
const edit = (certificate) => {
  selectedCertificate.value = { ...certificate };
  isEditModalOpen.value = true;
};
const closeEditModal = () => {
  isEditModalOpen.value = false;
  selectedCertificate.value = null;
};

// 등록 처리
const handleRegisterSubmit = async (newCertificate) => {
  try {
    await registerCertificate(newCertificate);
    await loadCertificates();
    closeRegisterModal();
  } catch (e) {
    console.error("등록 실패:", e);
  }
};

// 수정 처리
const handleEditSubmit = async (updatedCertificate) => {
  try {
    await updateCertificate(selectedCertificate.value.certificateName, {
      issuingOrganization: updatedCertificate.issuingOrganization,
      score: updatedCertificate.score,
    });
    await loadCertificates();
    closeEditModal();
  } catch (e) {
    console.error("수정 실패:", e);
  }
};

// 자격증 목록 조회
const loadCertificates = async () => {
  const res = await fetchCertificates();
  originalCertificates.value = res.data.data;
  certificates.value = [...originalCertificates.value];
};

// 검색
const handleSearch = (keyword) => {
  if (!keyword) {
    certificates.value = [...originalCertificates.value];
    return;
  }

  const trimmed = keyword.trim().toLowerCase();
  certificates.value = originalCertificates.value.filter((c) =>
    c.certificateName?.toLowerCase().includes(trimmed),
  );
  currentPage.value = 1;
};

// 삭제
const remove = async (certificateName) => {
  if (!confirm("정말 삭제하시겠습니까?")) return;
  await deleteCertificate(certificateName);
  await loadCertificates();
};

// 페이징 계산
const pagedCertificates = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return certificates.value.slice(start, start + itemsPerPage);
});
const totalPages = computed(() =>
  Math.ceil(certificates.value.length / itemsPerPage),
);
const changePage = (page) => {
  currentPage.value = page;
};

// 초기 로딩
onMounted(loadCertificates);
</script>

<style scoped>
.page-layout {
  @apply relative flex;
}

.content-wrapper {
  @apply flex-1 px-[180px] py-12 max-w-[970px];
}
</style>
