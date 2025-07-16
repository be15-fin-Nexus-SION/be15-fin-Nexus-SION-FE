<template>
  <div class="page-layout">
    <!-- 좌측 사이드바 -->
    <SidebarWrapper viewType="developerSelf" />

    <!-- 우측 본문 영역 -->
    <div class="content-wrapper">
      <h1 class="text-2xl font-bold mb-6">자격증 종류 조회</h1>

      <!-- 검색 -->
      <div class="flex justify-end mb-4 w-[730px]">
        <SearchBar
          class="w-full"
          placeholder="자격증명을 입력하세요"
          @search="handleSearch"
        />
      </div>

      <!-- 자격증 테이블 -->
      <table class="w-[730px] border text-center table-fixed">
        <thead class="bg-blue-100">
          <tr>
            <th class="py-2 px-5">자격증명</th>
            <th class="py-2 px-5">발급기관</th>
            <th class="py-2 px-5">반영점수</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="certificate in pagedCertificates"
            :key="certificate.id"
            class="border-b"
          >
            <td class="py-3 text-center">{{ certificate.certificateName }}</td>
            <td class="py-3 text-center">
              {{ certificate.issuingOrganization }}
            </td>
            <td class="py-3 text-center">{{ certificate.score }}</td>
          </tr>
        </tbody>
      </table>

      <!-- 항목이 없을 때 메시지 -->
      <div
        v-if="pagedCertificates.length === 0"
        class="w-[730px] text-center py-6 text-gray-500"
      >
        등록된 자격증이 없습니다.
      </div>

      <!-- 페이지네이션 -->
      <div
        v-if="pagedCertificates.length > 0"
        class="mt-4 flex w-[730px] justify-center"
      >
        <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @change="changePage"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import SidebarWrapper from "@/components/side/SidebarWrapper.vue";
import Pagination from "@/components/Pagination.vue";
import SearchBar from "@/components/searchBar/SearchBar.vue";
import { fetchCertificates } from "@/api/member.js";
import { showErrorToast } from "@/utills/toast.js";

const originalCertificates = ref([]);
const certificates = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10;

const loadCertificates = async () => {
  try {
    const res = await fetchCertificates();
    originalCertificates.value = res.data.data;
    certificates.value = [...originalCertificates.value];
  } catch (e) {
    const errorMessage =
      e.response?.data?.message || "자격증 목록을 불러오지 못했습니다.";
    showErrorToast(errorMessage);
  }
};

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
